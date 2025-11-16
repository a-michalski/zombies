/**
 * ProgressBar - Linear progress bar showing campaign star collection
 *
 * Created: 2025-11-16 (PHASE-005)
 *
 * Props:
 * - current: Current stars earned
 * - total: Total possible stars
 * - height: Bar height in pixels (default: 8)
 * - showLabel: Display "X/Y Stars" text below bar (default: true)
 * - animated: Enable width animation (default: true)
 * - style: Additional container styles
 *
 * Usage:
 * <ProgressBar current={15} total={30} />
 * <ProgressBar current={28} total={30} animated={true} />
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { THEME } from '@/constants/ui/theme';

export interface ProgressBarProps {
  current: number;
  total: number;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
  style?: ViewStyle;
}

export default function ProgressBar({
  current,
  total,
  height = 8,
  showLabel = true,
  animated = true,
  style,
}: ProgressBarProps) {
  // Calculate progress percentage (0-100)
  const progressPercent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  // Animation value for width
  const animatedWidth = useRef(new Animated.Value(animated ? 0 : progressPercent)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: progressPercent,
        duration: THEME.animation.slow, // 500ms
        useNativeDriver: false, // width animation requires false
      }).start();
    } else {
      animatedWidth.setValue(progressPercent);
    }
  }, [progressPercent, animated, animatedWidth]);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.barBackground, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              height,
              borderRadius: height / 2,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {showLabel && (
        <Text style={styles.label}>
          {current}/{total} Stars
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barBackground: {
    width: '100%',
    backgroundColor: THEME.colors.border.default, // #333333
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: THEME.colors.success, // #4CAF50 (green fill)
  },
  label: {
    marginTop: THEME.spacing.xs,
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
});
