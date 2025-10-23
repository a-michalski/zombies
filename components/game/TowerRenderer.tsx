import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";

import { MAP_CONFIG } from "@/constants/gameConfig";
import { LOOKOUT_POST } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";

export function TowerRenderer() {
  const { gameState, selectTower } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {gameState.towers.map((tower) => {
        const x = tower.position.x * tileSize;
        const y = tower.position.y * tileSize;
        const size = tileSize * 0.9;

        return (
          <TouchableOpacity
            key={`touch-${tower.id}`}
            style={[
              styles.towerTouch,
              {
                left: x - size / 2,
                top: y - size / 2,
                width: size,
                height: size,
              },
            ]}
            onPress={() => selectTower(tower.id)}
            activeOpacity={0.7}
          />
        );
      })}
      <Svg
        width={MAP_CONFIG.WIDTH * tileSize}
        height={MAP_CONFIG.HEIGHT * tileSize}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        {gameState.towers.map((tower) => {
          const x = tower.position.x * tileSize;
          const y = tower.position.y * tileSize;
          const size = tileSize * 0.9;
          const isSelected = gameState.selectedTowerId === tower.id;
          const towerStats = LOOKOUT_POST.levels[tower.level - 1];

          const baseColor = tower.level === 1 ? "#4A90E2" : tower.level === 2 ? "#7B68EE" : "#FF6B6B";

          return (
            <React.Fragment key={tower.id}>
              {isSelected && (
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
              )}

              <Polygon
                points={`${x},${y - size / 2} ${x + size / 3},${y - size / 6} ${x + size / 3},${y + size / 2} ${x - size / 3},${y + size / 2} ${x - size / 3},${y - size / 6}`}
                fill={baseColor}
                stroke={isSelected ? "#FFD700" : "#FFFFFF"}
                strokeWidth={isSelected ? 3 : 2}
              />

              <Line
                x1={x - size / 4}
                y1={y - size / 3}
                x2={x + size / 4}
                y2={y - size / 3}
                stroke="#8B4513"
                strokeWidth={3}
              />

              <Circle
                cx={x}
                cy={y + size / 2 + 8}
                r={8}
                fill="#333333"
                stroke="#FFD700"
                strokeWidth={2}
              />
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
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  towerTouch: {
    position: "absolute" as const,
    zIndex: 20,
  },
});