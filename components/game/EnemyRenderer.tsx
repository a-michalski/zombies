import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

import { ENEMY_CONFIGS } from "@/constants/enemies";
import { MAP_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { useGame } from "@/contexts/GameContext";
import { getEnemyImage, hasEnemyImages } from "@/utils/imageAssets";

// Calculate once outside component
const HAS_ENEMY_IMAGES = hasEnemyImages();

// Pre-calculate rotations for waypoints to avoid recalculating on every render
const WAYPOINT_ROTATIONS: number[] = (() => {
  const rotations: number[] = [];
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    const currentWaypoint = WAYPOINTS[i];
    const nextWaypoint = WAYPOINTS[i + 1];
    const dx = nextWaypoint.x - currentWaypoint.x;
    const dy = nextWaypoint.y - currentWaypoint.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    rotations.push(angle - 90); // Rotate left by 90 degrees
  }
  return rotations;
})();

export function EnemyRenderer() {
  const { gameState } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {HAS_ENEMY_IMAGES ? (
        <>
          {gameState.enemies.map((enemy) => {
            const config = ENEMY_CONFIGS[enemy.type];
            const x = enemy.position.x * tileSize;
            const y = enemy.position.y * tileSize;
            const size = config.size;
            const healthPercent = enemy.health / enemy.maxHealth;

            // Use pre-calculated rotation or default
            const rotation = enemy.waypointIndex < WAYPOINT_ROTATIONS.length
              ? WAYPOINT_ROTATIONS[enemy.waypointIndex]
              : -90; // Default: rotate 90 degrees left (facing right)

            return (
              <View
                key={enemy.id}
                style={[
                  styles.enemyContainer,
                  {
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                    transform: [{ rotate: `${rotation}deg` }],
                  },
                ]}
              >
                <Image
                  source={getEnemyImage(enemy.type)}
                  style={[styles.enemyImage, { width: size, height: size }]}
                  resizeMode="contain"
                  onError={(error) => {
                    if (__DEV__) {
                      console.error("Enemy image load error:", enemy.type, error.nativeEvent.error);
                    }
                  }}
                  onLoad={() => {
                    if (__DEV__) {
                      console.log("Enemy image loaded successfully for type:", enemy.type);
                    }
                  }}
                />
                {/* Health bar */}
                <View
                  style={[
                    styles.healthBarContainer,
                    {
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
            );
          })}
        </>
      ) : (
        <Svg
          width={MAP_CONFIG.WIDTH * tileSize}
          height={MAP_CONFIG.HEIGHT * tileSize}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          {gameState.enemies.map((enemy) => {
            const config = ENEMY_CONFIGS[enemy.type];
            const x = enemy.position.x * tileSize;
            const y = enemy.position.y * tileSize;
            const size = config.size;
            const healthPercent = enemy.health / enemy.maxHealth;

            return (
              <React.Fragment key={enemy.id}>
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
              </React.Fragment>
            );
          })}
        </Svg>
      )}
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
