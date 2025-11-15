import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

import { ENEMY_CONFIGS } from "@/constants/enemies";
import { MAP_CONFIG } from "@/constants/gameConfig";
import { useGame } from "@/contexts/GameContext";
import { getEnemyImage, hasEnemyImages } from "@/utils/imageAssets";

export function EnemyRenderer() {
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

        return (
          <React.Fragment key={enemy.id}>
            {hasEnemyImages() ? (
              <View
                style={[
                  styles.enemyContainer,
                  {
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                  },
                ]}
              >
                <Image
                  source={getEnemyImage(enemy.type)}
                  style={[styles.enemyImage, { width: size, height: size }]}
                  resizeMode="contain"
                />
                {/* Health bar */}
                <View
                  style={[
                    styles.healthBarContainer,
                    {
                      left: x - size / 2,
                      top: y - size / 2 - 8,
                      width: size,
                    },
                  ]}
                >
                  <View style={styles.healthBarBg} />
                  <View
                    style={[
                      styles.healthBarFill,
                      {
                        width: `${healthPercent * 100}%`,
                        backgroundColor:
                          healthPercent > 0.5
                            ? "#4CAF50"
                            : healthPercent > 0.25
                              ? "#FFC107"
                              : "#FF4444",
                      },
                    ]}
                  />
                </View>
              </View>
            ) : (
              <Svg
                width={MAP_CONFIG.WIDTH * tileSize}
                height={MAP_CONFIG.HEIGHT * tileSize}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              >
                <Circle
                  cx={x}
                  cy={y}
                  r={size / 2}
                  fill={config.color}
                  stroke="#000000"
                  strokeWidth={2}
                />
                <Rect
                  x={x - size / 2}
                  y={y - size / 2 - 8}
                  width={size}
                  height={4}
                  fill="#333333"
                  rx={2}
                />
                <Rect
                  x={x - size / 2}
                  y={y - size / 2 - 8}
                  width={size * healthPercent}
                  height={4}
                  fill={
                    healthPercent > 0.5
                      ? "#4CAF50"
                      : healthPercent > 0.25
                        ? "#FFC107"
                        : "#FF4444"
                  }
                  rx={2}
                />
              </Svg>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  enemyContainer: {
    position: "absolute" as const,
  },
  enemyImage: {
    width: "100%",
    height: "100%",
  },
  healthBarContainer: {
    position: "absolute" as const,
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
