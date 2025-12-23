/**
 * StarRating - Display 0-3 star rating with optional animation
 *
 * Created: 2025-11-16 (PHASE-005)
 *
 * Props:
 * - stars: Number of filled stars (0-3)
 * - maxStars: Maximum stars to display (default: 3)
 * - size: Star icon size ('small' | 'medium' | 'large')
 * - animated: Enable sequential fade-in animation
 * - showLabel: Display "X/3 Stars" label
 * - style: Additional container styles
 *
 * Usage:
 * <StarRating stars={2} size="large" animated={true} />
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';

export interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showLabel?: boolean;
  style?: ViewStyle;
}

export default function StarRating({
  stars,
  maxStars = 3,
  size = 'medium',
  animated = false,
  showLabel = false,
  style,
}: StarRatingProps) {
  // Size mapping
  const iconSize = {
    small: 16,
    medium: 24,
    large: 32,
  }[size];

  // Animation shared values for each star
  const starOpacities = Array.from({ length: maxStars }, () =>
    useSharedValue(animated ? 0 : 1)
  );

  // Create animated styles for each star
  const starAnimatedStyles = starOpacities.map((opacity) =>
    useAnimatedStyle(() => ({
      opacity: opacity.value,
    }))
  );

  useEffect(() => {
    if (animated) {
      // Sequential fade-in animation - runs on UI thread
      starOpacities.forEach((opacity, index) => {
        opacity.value = withDelay(
          index * THEME.animation.slow, // 500ms delay between stars
          withTiming(1, { duration: THEME.animation.normal })
        );
      });
    } else {
      // Reset to visible if not animated
      starOpacities.forEach((opacity) => {
        opacity.value = 1;
      });
    }
  }, [animated, maxStars]);

  // Render individual star
  const renderStar = (index: number) => {
    const isFilled = index < stars;
    const starColor = isFilled ? THEME.colors.star.filled : THEME.colors.star.empty;

    const starContent = (
      <Star
        size={iconSize}
        color={starColor}
        fill={isFilled ? starColor : 'none'}
        strokeWidth={2}
      />
    );

    if (animated) {
      return (
        <Animated.View
          key={index}
          style={[styles.starWrapper, starAnimatedStyles[index]]}
        >
          {starContent}
        </Animated.View>
      );
    }

    return (
      <View key={index} style={styles.starWrapper}>
        {starContent}
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsRow}>
        {Array.from({ length: maxStars }, (_, index) => renderStar(index))}
      </View>

      {showLabel && (
        <Text style={styles.label}>
          {stars}/{maxStars} Stars
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Removed alignItems to prevent layout issues - starsRow handles alignment
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs, // 4px gap between stars
  },
  starWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: THEME.spacing.xs,
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
  },
});
