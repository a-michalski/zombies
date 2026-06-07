import React from "react";
import { StyleSheet, View } from "react-native";

import { MAP_CONFIG } from "@/constants/gameConfig";
import { PROJECTILE_CONFIG } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";

/**
 * Retro projectile renderer: the Lookout Post fires crossbow bolts, drawn as a
 * small crisp pixel bolt built from solid Views (no asset needed) — dark head,
 * wooden shaft, light fletching — rotated toward the target. Mirrors
 * ProjectileRenderer's data usage; the original is untouched.
 */
export function RetroProjectileRenderer() {
  const { gameState } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  const size = PROJECTILE_CONFIG.SIZE;
  const len = Math.round(size * 2); // bolt length
  const thick = Math.max(2, Math.round(size / 3)); // bolt thickness
  const head = Math.max(2, Math.round(size / 2.5)); // arrowhead length

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {gameState.projectiles.map((projectile) => {
        const x = projectile.position.x * tileSize;
        const y = projectile.position.y * tileSize;

        const dx = projectile.targetPosition.x - projectile.position.x;
        const dy = projectile.targetPosition.y - projectile.position.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
          <View
            key={projectile.id}
            style={[
              styles.bolt,
              {
                left: x - len / 2,
                top: y - thick / 2,
                width: len,
                height: thick,
                transform: [{ rotate: `${angle}deg` }],
              },
            ]}
          >
            {/* wooden shaft */}
            <View style={[styles.shaft, { backgroundColor: PROJECTILE_CONFIG.COLOR }]} />
            {/* dark iron head (leading end) */}
            <View style={[styles.head, { width: head, backgroundColor: "#2b2b2b" }]} />
            {/* light fletching (tail) */}
            <View style={[styles.fletch, { width: thick, backgroundColor: "#e7d9b3" }]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bolt: {
    position: "absolute" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  shaft: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  head: {
    position: "absolute" as const,
    right: 0,
    top: 0,
    bottom: 0,
  },
  fletch: {
    position: "absolute" as const,
    left: 0,
    top: 0,
    bottom: 0,
  },
});
