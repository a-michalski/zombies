import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";

import { EnemyRenderer } from "./EnemyRenderer";
import { ProjectileRenderer } from "./ProjectileRenderer";
import { TowerRenderer } from "./TowerRenderer";
import { VisualEffects } from "./VisualEffects";

import { CONSTRUCTION_SPOTS, MAP_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { useGame } from "@/contexts/GameContext";

export function GameMap() {
  const { gameState, selectSpot } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;
  const mapWidth = MAP_CONFIG.WIDTH * tileSize;
  const mapHeight = MAP_CONFIG.HEIGHT * tileSize;

  return (
    <View style={[styles.container, { width: mapWidth, height: mapHeight }]}>
      <View style={styles.layerContainer}>
        {CONSTRUCTION_SPOTS.map((spot) => {
          const isOccupied = gameState.towers.some((t) => t.spotId === spot.id);
          if (isOccupied) return null;

          const x = spot.x * tileSize;
          const y = spot.y * tileSize;
          const size = tileSize * 0.8;

          return (
            <TouchableOpacity
              key={`touch-${spot.id}`}
              style={[
                styles.constructionSpotTouch,
                {
                  left: x - size / 2,
                  top: y - size / 2,
                  width: size,
                  height: size,
                },
              ]}
              onPress={() => selectSpot(spot.id)}
              activeOpacity={0.7}
            />
          );
        })}
        <Svg
          width={MAP_CONFIG.WIDTH * tileSize}
          height={MAP_CONFIG.HEIGHT * tileSize}
          style={styles.svg}
          pointerEvents="none"
        >
        {WAYPOINTS.map((waypoint, index) => {
          if (index === WAYPOINTS.length - 1) return null;
          const next = WAYPOINTS[index + 1];
          
          return (
            <Line
              key={`path-${index}`}
              x1={waypoint.x * tileSize}
              y1={waypoint.y * tileSize}
              x2={next.x * tileSize}
              y2={next.y * tileSize}
              stroke="#555555"
              strokeWidth={tileSize * 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {WAYPOINTS.map((waypoint, index) => (
          <Circle
            key={`waypoint-${index}`}
            cx={waypoint.x * tileSize}
            cy={waypoint.y * tileSize}
            r={tileSize * 0.3}
            fill={index === 0 ? "#FF4444" : index === WAYPOINTS.length - 1 ? "#4444FF" : "#666666"}
          />
        ))}

        {CONSTRUCTION_SPOTS.map((spot) => {
          const isOccupied = gameState.towers.some((t) => t.spotId === spot.id);
          const isSelected = gameState.selectedSpotId === spot.id;
          
          if (isOccupied) return null;

          const x = spot.x * tileSize;
          const y = spot.y * tileSize;
          const size = tileSize * 0.8;

          return (
            <React.Fragment key={spot.id}>
              <Polygon
                points={`${x},${y - size / 2} ${x + size / 2},${y} ${x},${y + size / 2} ${x - size / 2},${y}`}
                fill="none"
                stroke={isSelected ? "#FFD700" : "#FFA500"}
                strokeWidth={3}
                opacity={0.8}
              />
              <Circle
                cx={x}
                cy={y}
                r={size * 0.3}
                fill="#FFA500"
                opacity={0.5}
              />
            </React.Fragment>
          );
        })}
        </Svg>
        <TowerRenderer />
        <EnemyRenderer />
        <ProjectileRenderer />
        <VisualEffects />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
  },
  layerContainer: {
    position: "relative" as const,
  },
  svg: {
    backgroundColor: "#2a2a2a",
  },
  constructionSpotTouch: {
    position: "absolute" as const,
    zIndex: 10,
  },
});
