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

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
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

  // Animation shared value for width (0-100)
  const widthProgress = useSharedValue(animated ? 0 : progressPercent);

  useEffect(() => {
    if (animated) {
      // Animate width - runs on UI thread
      widthProgress.value = withTiming(progressPercent, {
        duration: THEME.animation.slow, // 500ms
      });
    } else {
      widthProgress.value = progressPercent;
    }
  }, [progressPercent, animated, widthProgress]);

  // Animated style for width
  const animatedFillStyle = useAnimatedStyle(() => ({
    width: `${widthProgress.value}%`,
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.barBackground, { height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.barFill,
            {
              height,
              borderRadius: height / 2,
            },
            animatedFillStyle,
          ]}
        >
          <LinearGradient
            colors={[THEME.colors.success, THEME.colors.star.filled]}
            start={[0, 0]}
            end={[1, 0]}
            style={styles.gradient}
          />
        </Animated.View>
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
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 4, // Matches parent border radius
  },
  label: {
    marginTop: THEME.spacing.xs,
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
});
