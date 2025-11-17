import React, { useMemo } from "react";
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";

import { EnemyRenderer } from "./EnemyRenderer";
import { ProjectileRenderer } from "./ProjectileRenderer";
import { TowerRenderer } from "./TowerRenderer";
import { VisualEffects } from "./VisualEffects";

import { CONSTRUCTION_SPOTS, MAP_CONFIG, WAYPOINTS } from "@/constants/gameConfig";
import { useGame } from "@/contexts/GameContext";
import { Position } from "@/types/game";
import { ConstructionSpotConfig } from "@/types/map";
import {
  MAP_IMAGES,
  getPathTexture,
  hasConstructionSpotImage,
  hasMapImages,
  hasPathTextures,
  hasWaypointImages,
} from "@/utils/imageAssets";

// Calculate these once outside component
const HAS_MAP_GRAPHICS = hasMapImages();
const HAS_PATH_TEXTURE = !!MAP_IMAGES.pathTexture;
const HAS_SPECIALIZED_PATH_TEXTURES = hasPathTextures();
const HAS_WAYPOINT_SPRITES = hasWaypointImages();
const HAS_CONSTRUCTION_SPOT_SPRITE = hasConstructionSpotImage();

interface GameMapProps {
  /** Optional waypoints array - falls back to WAYPOINTS constant if not provided */
  waypoints?: Position[];
  /** Optional construction spots - falls back to CONSTRUCTION_SPOTS constant if not provided */
  constructionSpots?: ConstructionSpotConfig[];
}

export function GameMap({ waypoints, constructionSpots }: GameMapProps = {}) {
  const { gameState, selectSpot } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;
  const mapWidth = MAP_CONFIG.WIDTH * tileSize;
  const mapHeight = MAP_CONFIG.HEIGHT * tileSize;

  // Use provided waypoints or fall back to constants
  const actualWaypoints = waypoints || WAYPOINTS;

  // Use provided construction spots or fall back to constants
  // Convert ConstructionSpotConfig to old format if needed
  const actualSpots = useMemo(() => {
    if (constructionSpots) {
      return constructionSpots.map(spot => ({
        id: spot.id,
        x: spot.position.x,
        y: spot.position.y,
      }));
    }
    return CONSTRUCTION_SPOTS as any;
  }, [constructionSpots]);

  // Memoize occupied spots to avoid recalculating on every render
  const occupiedSpotIds = useMemo(() => {
    return new Set(gameState.towers.map((t) => t.spotId));
  }, [gameState.towers]);

  // Memoize MapContent to prevent recreation on every render
  const mapContent = useMemo(() => (
    <View style={styles.layerContainer} pointerEvents="box-none">
        <Svg
          width={MAP_CONFIG.WIDTH * tileSize}
          height={MAP_CONFIG.HEIGHT * tileSize}
          style={styles.svg}
          pointerEvents="none"
        >
        {/* Path lines - use path texture if available, otherwise gray line */}
        {actualWaypoints.map((waypoint, index) => {
          if (index === actualWaypoints.length - 1) return null;
          const next = actualWaypoints[index + 1];
          
          return (
            <Line
              key={`path-${index}`}
              x1={waypoint.x * tileSize}
              y1={waypoint.y * tileSize}
              x2={next.x * tileSize}
              y2={next.y * tileSize}
              stroke={(HAS_PATH_TEXTURE || HAS_SPECIALIZED_PATH_TEXTURES) ? "transparent" : "#555555"}
              strokeWidth={tileSize * 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Waypoints - use sprites if available, otherwise colored circles */}
        {!HAS_WAYPOINT_SPRITES && actualWaypoints.map((waypoint, index) => (
          <Circle
            key={`waypoint-${index}`}
            cx={waypoint.x * tileSize}
            cy={waypoint.y * tileSize}
            r={tileSize * 0.3}
            fill={index === 0 ? "#FF4444" : index === actualWaypoints.length - 1 ? "#4444FF" : "#666666"}
          />
        ))}

        {/* Construction spots - use SVG if no sprite available */}
        {!HAS_CONSTRUCTION_SPOT_SPRITE && actualSpots.map((spot) => {
          const isOccupied = occupiedSpotIds.has(spot.id);
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
        
        {/* Path texture overlay */}
        {(HAS_PATH_TEXTURE || HAS_SPECIALIZED_PATH_TEXTURES) && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {actualWaypoints.map((waypoint, index) => {
              if (index === actualWaypoints.length - 1) return null;
              const next = actualWaypoints[index + 1];
              const prev = index > 0 ? actualWaypoints[index - 1] : null;
              
              const dx = next.x - waypoint.x;
              const dy = next.y - waypoint.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              // Get appropriate texture for this segment
              const pathTexture = HAS_SPECIALIZED_PATH_TEXTURES
                ? getPathTexture(prev, waypoint, next)
                : (MAP_IMAGES.pathTexture || MAP_IMAGES.pathStraightHorizontal);
              
              // For corners, we need to render at the corner position
              // A corner occurs when direction changes (one axis becomes 0 while the other was 0 before)
              // Improved logic: check if previous movement was purely horizontal/vertical and next is purely vertical/horizontal
              const prevDx = prev ? waypoint.x - prev.x : 0;
              const prevDy = prev ? waypoint.y - prev.y : 0;
              const isPrevHorizontal = Math.abs(prevDx) > Math.abs(prevDy);
              const isNextHorizontal = Math.abs(dx) > Math.abs(dy);
              const isCorner = prev !== null && isPrevHorizontal !== isNextHorizontal;
              
              let centerX, centerY;
              if (isCorner && HAS_SPECIALIZED_PATH_TEXTURES) {
                // Render corner at the waypoint position
                centerX = waypoint.x * tileSize;
                centerY = waypoint.y * tileSize;
              } else {
                // Render straight segment at center
                centerX = ((waypoint.x + next.x) / 2) * tileSize;
                centerY = ((waypoint.y + next.y) / 2) * tileSize;
              }
              
              const segmentWidth = isCorner && HAS_SPECIALIZED_PATH_TEXTURES
                ? tileSize * 1.5
                : length * tileSize;
              const segmentHeight = tileSize * 1.5;
              const segmentLeft = isCorner && HAS_SPECIALIZED_PATH_TEXTURES
                ? centerX - (tileSize * 1.5) / 2
                : centerX - (length * tileSize) / 2;
              const segmentTop = isCorner && HAS_SPECIALIZED_PATH_TEXTURES
                ? centerY - (tileSize * 1.5) / 2
                : centerY - (tileSize * 1.5) / 2;

              const segmentStyle = {
                left: segmentLeft,
                top: segmentTop,
                width: segmentWidth,
                height: segmentHeight,
                opacity: 1,
                transform: isCorner && HAS_SPECIALIZED_PATH_TEXTURES
                  ? [] // No rotation for corners
                  : [{ rotate: `${angle}deg` }],
              };

              return (
                <ImageBackground
                  key={`path-texture-${index}`}
                  source={pathTexture}
                  style={[styles.pathTextureSegment, segmentStyle]}
                  resizeMode="cover"
                  imageStyle={{ opacity: 1 }}
                >
                  <View style={{ width: 1, height: 1 }} />
                </ImageBackground>
              );
            })}
          </View>
        )}
        
        {/* Waypoint sprites */}
        {HAS_WAYPOINT_SPRITES && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {actualWaypoints.map((waypoint, index) => {
              const x = waypoint.x * tileSize;
              const y = waypoint.y * tileSize;
              const size = tileSize * 1.5;

              let waypointImage = null;
              if (index === 0) {
                waypointImage = MAP_IMAGES.startWaypoint;
              } else if (index === actualWaypoints.length - 1) {
                waypointImage = MAP_IMAGES.endWaypoint;
              }
              
              if (!waypointImage) return null;
              
              return (
                <Image
                  key={`waypoint-sprite-${index}`}
                  source={waypointImage}
                  style={[
                    styles.waypointSprite,
                    {
                      left: x - size / 2,
                      top: y - size / 2,
                      width: size,
                      height: size,
                    },
                  ]}
                  resizeMode="contain"
                />
              );
            })}
          </View>
        )}
        
        {/* Construction spot sprites */}
        {HAS_CONSTRUCTION_SPOT_SPRITE && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {actualSpots.map((spot) => {
              const isOccupied = occupiedSpotIds.has(spot.id);
              const isSelected = gameState.selectedSpotId === spot.id;
              
              if (isOccupied) return null;

              const x = spot.x * tileSize;
              const y = spot.y * tileSize;
              const size = tileSize * 0.8;

              return (
                <Image
                  key={`construction-spot-sprite-${spot.id}`}
                  source={MAP_IMAGES.constructionSpot}
                  style={[
                    styles.constructionSpotSprite,
                    {
                      left: x - size / 2,
                      top: y - size / 2,
                      width: size,
                      height: size,
                      opacity: isSelected ? 1 : 0.7,
                    },
                  ]}
                  resizeMode="contain"
                />
              );
            })}
          </View>
        )}
        <TowerRenderer />
        <EnemyRenderer />
        <ProjectileRenderer />
        <VisualEffects />
      {/* Construction spots rendered last to be on top */}
      {actualSpots.map((spot) => {
        const isOccupied = occupiedSpotIds.has(spot.id);
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
            onPress={() => {
              if (__DEV__) {
                console.log("Construction spot clicked:", spot.id);
              }
              selectSpot(spot.id);
            }}
            activeOpacity={0.7}
          />
        );
      })}
      </View>
  ), [tileSize, gameState.selectedSpotId, occupiedSpotIds, actualWaypoints, actualSpots, selectSpot]);

  return (
    <View style={[styles.container, { width: mapWidth, height: mapHeight }]}>
      {HAS_MAP_GRAPHICS && MAP_IMAGES.background ? (
        <ImageBackground
          source={MAP_IMAGES.background}
          style={[styles.mapBackground, { width: mapWidth, height: mapHeight, pointerEvents: "box-none" as const }]}
          resizeMode="cover"
        >
          {mapContent}
        </ImageBackground>
      ) : (
        mapContent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    overflow: "visible" as const, // Changed from "hidden" to allow touch events
  },
  layerContainer: {
    position: "relative" as const,
    width: "100%",
    height: "100%",
  },
  svg: {
    backgroundColor: "transparent",
  },
  mapBackground: {
    width: "100%",
    height: "100%",
  },
  pathTextureSegment: {
    position: "absolute" as const,
    zIndex: 1,
  },
  waypointSprite: {
    position: "absolute" as const,
  },
  constructionSpotSprite: {
    position: "absolute" as const,
  },
  constructionSpotTouch: {
    position: "absolute" as const,
    zIndex: 30, // Higher than towers to ensure clicks work
  },
});
