import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

import { MAP_CONFIG } from "@/constants/gameConfig";
import { TINY_DUNGEON, TINY_TOWN, TOWER_GUARD_SPRITE, TT_STONE } from "@/constants/retroSprites";
import { LOOKOUT_POST } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";

import { RetroSprite } from "./RetroSprite";

/**
 * Retro tower renderer: the Lookout Post is "a survivor armed with a crossbow",
 * so it's drawn as a Tiny Town cobblestone platform with a Tiny Dungeon
 * survivor standing on it (sprite escalates per level). Selection ring, level
 * badge and the touch target all mirror TowerRenderer; the original is intact.
 */
export function RetroTowerRenderer() {
  const { gameState, selectTower } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {gameState.towers.map((tower) => {
        const x = tower.position.x * tileSize;
        const y = tower.position.y * tileSize;
        const size = tileSize * 0.9;
        const isSelected = gameState.selectedTowerId === tower.id;
        const towerStats = LOOKOUT_POST.levels[tower.level - 1];
        const guardIdx = TOWER_GUARD_SPRITE[tower.level] ?? TOWER_GUARD_SPRITE[1];
        const guardSize = size * 0.85;

        return (
          <React.Fragment key={tower.id}>
            <TouchableOpacity
              style={[styles.towerTouch, { left: x - size / 2, top: y - size / 2, width: size, height: size }]}
              onPress={() => selectTower(tower.id)}
              activeOpacity={0.7}
            />

            {isSelected && (
              <Svg
                width={MAP_CONFIG.WIDTH * tileSize}
                height={MAP_CONFIG.HEIGHT * tileSize}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              >
                <Circle
                  cx={x}
                  cy={y}
                  r={towerStats.range * tileSize}
                  fill="none"
                  stroke="#FFD700"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  opacity={0.5}
                />
              </Svg>
            )}

            <View
              style={[
                styles.towerContainer,
                { left: x - size / 2, top: y - size / 2, width: size, height: size },
                isSelected && styles.towerSelected,
              ]}
              pointerEvents="none"
            >
              {/* Cobblestone platform */}
              <RetroSprite
                sheet={TINY_TOWN.sheet}
                index={TT_STONE}
                cols={TINY_TOWN.cols}
                rows={TINY_TOWN.rows}
                size={size}
                style={styles.base}
              />
              {/* Survivor standing on the post (raised so they sit on top) */}
              <RetroSprite
                sheet={TINY_DUNGEON.sheet}
                index={guardIdx}
                cols={TINY_DUNGEON.cols}
                rows={TINY_DUNGEON.rows}
                size={guardSize}
                style={[styles.guard, { left: (size - guardSize) / 2, top: -guardSize * 0.35 }]}
              />
            </View>

            {/* Level badge */}
            <Svg
              width={MAP_CONFIG.WIDTH * tileSize}
              height={MAP_CONFIG.HEIGHT * tileSize}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            >
              <Circle cx={x} cy={y + size / 2 + 8} r={8} fill="#333333" stroke="#FFD700" strokeWidth={2} />
              <SvgText
                x={x}
                y={y + size / 2 + 12}
                fontSize={12}
                fontWeight="bold"
                fill="#FFD700"
                textAnchor="middle"
              >
                {tower.level}
              </SvgText>
            </Svg>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  towerTouch: {
    position: "absolute" as const,
    zIndex: 20,
  },
  towerContainer: {
    position: "absolute" as const,
    zIndex: 15,
    overflow: "visible" as const,
  },
  towerSelected: {
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: 4,
  },
  base: {
    position: "absolute" as const,
    left: 0,
    bottom: 0,
  },
  guard: {
    position: "absolute" as const,
  },
});
