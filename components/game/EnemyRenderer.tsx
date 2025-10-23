import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";

import { ENEMY_CONFIGS } from "@/constants/enemies";
import { MAP_CONFIG } from "@/constants/gameConfig";
import { useGame } from "@/contexts/GameContext";

export function EnemyRenderer() {
  const { gameState } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  return (
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
              fill={healthPercent > 0.5 ? "#4CAF50" : healthPercent > 0.25 ? "#FFC107" : "#FF4444"}
              rx={2}
            />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
