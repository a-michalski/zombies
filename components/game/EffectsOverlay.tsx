/**
 * EffectsOverlay - Visual feedback for active power-up effects
 *
 * Shows screen-wide effects for:
 * - Time Freeze: Blue pulsing border
 * - (Other effects can be added)
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

import { useGame } from '@/contexts/GameContext';

export function EffectsOverlay() {
  const { gameState } = useGame();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  const hasTimeFreezeEffect = gameState.activeEffects.some(
    (effect) => effect.type === 'timeFreeze'
  );

  useEffect(() => {
    if (hasTimeFreezeEffect) {
      // Start pulsing animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => {
        pulse.stop();
        pulseAnim.setValue(0);
      };
    } else {
      // Fade out
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [hasTimeFreezeEffect, pulseAnim]);

  if (!hasTimeFreezeEffect) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: pulseAnim,
        },
      ]}
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
