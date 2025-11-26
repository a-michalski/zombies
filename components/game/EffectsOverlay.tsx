/**
 * EffectsOverlay - Visual feedback for active power-up effects
 *
 * Shows screen-wide effects for:
 * - Time Freeze: Blue pulsing border
 * - (Other effects can be added)
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import { useGame } from '@/contexts/GameContext';

export function EffectsOverlay() {
  const { gameState } = useGame();
  const opacity = useSharedValue(0);

  const hasTimeFreezeEffect = gameState.activeEffects.some(
    (effect) => effect.type === 'timeFreeze'
  );

  useEffect(() => {
    if (hasTimeFreezeEffect) {
      // Start pulsing animation - runs on UI thread
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1, // Infinite repeat
        false // Don't reverse
      );
    } else {
      // Fade out
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [hasTimeFreezeEffect, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!hasTimeFreezeEffect && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.overlay, animatedStyle]}
      pointerEvents="none"
    >
      <View style={styles.freezeBorder} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  freezeBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 8,
    borderColor: '#2196F3',
    borderRadius: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
});
