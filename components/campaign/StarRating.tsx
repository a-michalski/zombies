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

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
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

  // Animation refs for each star
  const animatedValues = useRef(
    Array.from({ length: maxStars }, () => new Animated.Value(animated ? 0 : 1))
  ).current;

  useEffect(() => {
    if (animated) {
      // Sequential fade-in animation
      const animations = animatedValues.map((value, index) => {
        return Animated.timing(value, {
          toValue: 1,
          duration: THEME.animation.normal,
          delay: index * THEME.animation.slow, // 500ms delay between stars
          useNativeDriver: true,
        });
      });

      Animated.stagger(0, animations).start();
    }
  }, [animated, animatedValues]);

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
          style={[
            styles.starWrapper,
            {
              opacity: animatedValues[index],
            },
          ]}
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
    alignItems: 'center',
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
