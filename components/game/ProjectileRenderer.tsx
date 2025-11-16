import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { MAP_CONFIG } from "@/constants/gameConfig";
import { PROJECTILE_CONFIG } from "@/constants/towers";
import { useGame } from "@/contexts/GameContext";
import { getProjectileImage, hasProjectileImage } from "@/utils/imageAssets";

// Calculate once outside component
const HAS_PROJECTILE_IMAGE = hasProjectileImage();

export function ProjectileRenderer() {
  const { gameState } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {gameState.projectiles.map((projectile) => {
        const x = projectile.position.x * tileSize;
        const y = projectile.position.y * tileSize;
        const size = PROJECTILE_CONFIG.SIZE;

        // Calculate rotation angle
        const dx = projectile.targetPosition.x - projectile.position.x;
        const dy = projectile.targetPosition.y - projectile.position.y;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        return (
          <React.Fragment key={projectile.id}>
            {HAS_PROJECTILE_IMAGE ? (
              <View
                style={[
                  styles.projectileContainer,
                  {
                    left: x - size / 2,
                    top: y - size / 2,
                    width: size * 2,
                    height: size * 2,
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}
              >
                <Image
                  source={getProjectileImage()}
                  style={[styles.projectileImage, { width: size * 2, height: size * 2 }]}
                  resizeMode="contain"
                />
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
                  r={PROJECTILE_CONFIG.SIZE / 2}
                  fill={PROJECTILE_CONFIG.COLOR}
                  stroke="#000000"
                  strokeWidth={1}
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
  projectileContainer: {
    position: "absolute" as const,
  },
  projectileImage: {
    width: "100%",
    height: "100%",
  },
});
