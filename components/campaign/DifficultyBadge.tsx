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
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';
import { Difficulty } from '@/types/levels';

export interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'small' | 'medium';
  showIcon?: boolean;
  style?: ViewStyle;
}

export default function DifficultyBadge({
  difficulty,
  size = 'medium',
  showIcon = false,
  style,
}: DifficultyBadgeProps) {
  // Get background color based on difficulty
  const backgroundColor = THEME.colors.difficulty[difficulty];

  // Size-specific styles
  const sizeStyles = {
    small: {
      width: showIcon ? 65 : 50,
      height: 20,
      fontSize: 10,
      iconSize: 14,
    },
    medium: {
      width: showIcon ? 80 : 60,
      height: 24,
      fontSize: 12,
      iconSize: 16,
    },
  }[size];

  // Icon based on difficulty
  const DifficultyIcon = {
    easy: CheckCircle,
    medium: AlertCircle,
    hard: AlertTriangle,
  }[difficulty];

  return (
    <View
      style={[
        styles.badge,
        showIcon && styles.badgeWithIcon,
        {
          backgroundColor,
          width: sizeStyles.width,
          height: sizeStyles.height,
        },
        style,
      ]}
    >
      {showIcon && (
        <DifficultyIcon
          size={sizeStyles.iconSize}
          color={THEME.colors.text.primary}
          strokeWidth={2.5}
          style={styles.icon}
        />
      )}
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
  badgeWithIcon: {
    flexDirection: 'row',
    gap: 4,
  },
  icon: {
    marginRight: 2,
  },
  text: {
    color: THEME.colors.text.primary,
    fontWeight: THEME.typography.fontWeight.bold,
    textAlign: 'center',
  },
});
