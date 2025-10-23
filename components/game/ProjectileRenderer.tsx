import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { MAP_CONFIG } from "@/constants/gameConfig";
import { PROJECTILE_CONFIG } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";

export function ProjectileRenderer() {
  const { gameState } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  return (
    <Svg
      width={MAP_CONFIG.WIDTH * tileSize}
      height={MAP_CONFIG.HEIGHT * tileSize}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {gameState.projectiles.map((projectile) => {
        const x = projectile.position.x * tileSize;
        const y = projectile.position.y * tileSize;

        return (
          <Circle
            key={projectile.id}
            cx={x}
            cy={y}
            r={PROJECTILE_CONFIG.SIZE / 2}
            fill={PROJECTILE_CONFIG.COLOR}
            stroke="#000000"
            strokeWidth={1}
          />
        );
      })}
    </Svg>
  );
}