import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { MAP_CONFIG } from "@/constants/gameConfig";
import { useGame } from "@/contexts/GameContext";

export function VisualEffects() {
  const { gameState } = useGame();
  const tileSize = MAP_CONFIG.TILE_SIZE;
  const [currentTime, setCurrentTime] = useState(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  // Update time using requestAnimationFrame instead of Date.now() in render
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(Date.now());
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          width: MAP_CONFIG.WIDTH * tileSize,
          height: MAP_CONFIG.HEIGHT * tileSize,
        },
      ]}
      pointerEvents="none"
    >
      {gameState.floatingTexts.map((ft) => {
        const age = (currentTime - ft.spawnTime) / 1000;
        const opacity = Math.max(0, 1 - age);
        const yOffset = age * 30;

        return (
          <Text
            key={ft.id}
            style={[
              styles.floatingText,
              {
                left: ft.position.x * tileSize,
                top: ft.position.y * tileSize - yOffset,
                color: ft.color,
                opacity,
              },
            ]}
          >
            {ft.text}
          </Text>
        );
      })}

      {gameState.particles.map((particle) => {
        const age = (currentTime - particle.spawnTime) / 1000;
        const opacity = Math.max(0, 1 - age / particle.lifetime);
        
        const x = particle.position.x + particle.velocity.x * age;
        const y = particle.position.y + particle.velocity.y * age;

        return (
          <View
            key={particle.id}
            style={[
              styles.particle,
              {
                left: x * tileSize,
                top: y * tileSize,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  floatingText: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "800" as const,
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  particle: {
    position: "absolute",
    borderRadius: 100,
  },
});
