import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";

import { MAP_CONFIG } from "@/constants/gameConfig";
import { LOOKOUT_POST } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";
import { getTowerImage, hasTowerImages } from "@/utils/imageAssets";

export function TowerRenderer() {
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

        return (
          <React.Fragment key={tower.id}>
            <TouchableOpacity
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
            {hasTowerImages() ? (
              <View
                style={[
                  styles.towerImageContainer,
                  {
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size,
                    height: size,
                  },
                  isSelected && styles.towerSelected,
                ]}
              >
                <Image
                  source={getTowerImage(LOOKOUT_POST.id, tower.level)}
                  style={[styles.towerImage, { width: size, height: size }]}
                  resizeMode="contain"
                />
                <View style={[styles.levelBadge, { left: x, top: y + size / 2 + 8 }]}>
                  <Svg width={16} height={16} style={styles.levelBadgeSvg}>
                    <Circle cx={8} cy={8} r={8} fill="#333333" stroke="#FFD700" strokeWidth={2} />
                    <SvgText
                      x={8}
                      y={12}
                      fontSize={12}
                      fontWeight="bold"
                      fill="#FFD700"
                      textAnchor="middle"
                    >
                      {tower.level}
                    </SvgText>
                  </Svg>
                </View>
              </View>
            ) : (
              <Svg
                width={MAP_CONFIG.WIDTH * tileSize}
                height={MAP_CONFIG.HEIGHT * tileSize}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              >
                {(() => {
                  const baseColor =
                    tower.level === 1 ? "#4A90E2" : tower.level === 2 ? "#7B68EE" : "#FF6B6B";
                  return (
                    <>
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
                    </>
                  );
                })()}
              </Svg>
            )}
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
  towerImageContainer: {
    position: "absolute" as const,
    zIndex: 15,
  },
  towerSelected: {
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: 4,
  },
  towerImage: {
    width: "100%",
    height: "100%",
  },
  levelBadge: {
    position: "absolute" as const,
    transform: [{ translateX: -8 }, { translateY: -8 }],
    zIndex: 16,
  },
  levelBadgeSvg: {
    position: "absolute" as const,
  },
});
