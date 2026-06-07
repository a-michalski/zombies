import React from "react";
import { StyleSheet, View } from "react-native";

import { ENEMY_CONFIGS } from "@/constants/enemies";
import { MAP_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { ENEMY_SPRITE, TINY_DUNGEON } from "@/constants/retroSprites";
import { useGame } from "@/contexts/GameContext";

import { RetroSprite } from "./RetroSprite";

/**
 * Retro enemy renderer: draws zombies as upright Tiny Dungeon sprites instead
 * of the high-fi PNGs, keeping the health bar. Sprites stay upright (only
 * mirrored to face their travel direction) since top-down characters shouldn't
 * rotate. Mirrors EnemyRenderer's data usage; the original is untouched.
 */

// Whether each path segment heads left, so sprites can face the right way.
const SEGMENT_FACES_LEFT: boolean[] = (() => {
  const out: boolean[] = [];
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    out.push(WAYPOINTS[i + 1].x - WAYPOINTS[i].x < 0);
  }
  return out;
})();

export function RetroEnemyRenderer() {
  const { gameState } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {gameState.enemies.map((enemy) => {
        const config = ENEMY_CONFIGS[enemy.type];
        const x = enemy.position.x * tileSize;
        const y = enemy.position.y * tileSize;
        const size = config.size;
        const healthPercent = enemy.health / enemy.maxHealth;
        const flipX =
          enemy.waypointIndex < SEGMENT_FACES_LEFT.length
            ? SEGMENT_FACES_LEFT[enemy.waypointIndex]
            : false;
        const idx = ENEMY_SPRITE[enemy.type] ?? ENEMY_SPRITE.shambler;

        return (
          <View
            key={enemy.id}
            style={[styles.enemy, { left: x - size / 2, top: y - size / 2, width: size, height: size }]}
          >
            <RetroSprite
              sheet={TINY_DUNGEON.sheet}
              index={idx}
              cols={TINY_DUNGEON.cols}
              rows={TINY_DUNGEON.rows}
              size={size}
              flipX={flipX}
            />
            {/* Health bar */}
            <View style={[styles.healthBarContainer, { width: size }]}>
              <View style={styles.healthBarBg} />
              <View
                style={[
                  styles.healthBarFill,
                  {
                    width: `${healthPercent * 100}%`,
                    backgroundColor:
                      healthPercent > 0.5 ? "#4CAF50" : healthPercent > 0.25 ? "#FFC107" : "#FF4444",
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  enemy: {
    position: "absolute" as const,
  },
  healthBarContainer: {
    position: "absolute" as const,
    top: -8,
    left: 0,
    height: 4,
  },
  healthBarBg: {
    position: "absolute" as const,
    width: "100%",
    height: 4,
    backgroundColor: "#333333",
    borderRadius: 2,
  },
  healthBarFill: {
    position: "absolute" as const,
    height: 4,
    borderRadius: 2,
  },
});
