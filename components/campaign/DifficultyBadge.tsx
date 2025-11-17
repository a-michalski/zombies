/**
 * DifficultyBadge - Display difficulty level as colored pill badge
 *
 * Created: 2025-11-16 (PHASE-005)
 *
 * Props:
 * - difficulty: Level difficulty ('easy' | 'medium' | 'hard')
 * - size: Badge size ('small' | 'medium')
 * - style: Additional container styles
 *
 * Usage:
 * <DifficultyBadge difficulty="easy" />
 * <DifficultyBadge difficulty="hard" size="small" />
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { THEME } from '@/constants/ui/theme';
import { Difficulty } from '@/types/levels';

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export default function DifficultyBadge({
  difficulty,
  size = 'medium',
  style,
}: DifficultyBadgeProps) {
  // Get background color based on difficulty
  const backgroundColor = THEME.colors.difficulty[difficulty];

  // Size-specific styles
  const sizeStyles = {
    small: {
      width: 50,
      height: 20,
      fontSize: 10,
    },
    medium: {
      width: 60,
      height: 24,
      fontSize: 12,
    },
  }[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          width: sizeStyles.width,
          height: sizeStyles.height,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyles.fontSize,
          },
        ]}
      >
        {difficulty.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.sm,
  },
  text: {
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
    textAlign: 'center',
  },
});
