/**
 * Centralized UI theme for Zombie Fleet Bastion
 *
 * Recent changes (2025-11-16):
 * - Created design system based on existing dark theme
 * - Extracted colors from app/index.tsx, app/game.tsx, BuildMenu.tsx
 * - Added campaign-specific colors (difficulty, stars, progression)
 *
 * Usage:
 * import { THEME } from '@/constants/ui/theme';
 *
 * StyleSheet.create({
 *   button: {
 *     backgroundColor: THEME.colors.primary,
 *     paddingVertical: THEME.spacing.md,
 *     borderRadius: THEME.borderRadius.md,
 *   }
 * });
 */

export const THEME = {
  colors: {
    // Backgrounds (darkest to lightest)
    background: {
      primary: '#0a0a0a',      // Main app background
      secondary: '#1a1a1a',    // Game screen, stats containers
      tertiary: '#222222',     // Headers, footers
      elevated: '#2a2a2a',     // Modals, cards
    },

    // Borders & Dividers
    border: {
      default: '#333333',      // Primary borders, control buttons
      light: '#444444',        // Modal borders, lighter elements
      dark: '#222222',         // Subtle dividers
    },

    // Text (white to gray scale)
    text: {
      primary: '#FFFFFF',      // Main text, headings
      secondary: '#CCCCCC',    // Subtitles, less important text
      tertiary: '#AAAAAA',     // Helper text, labels
      disabled: '#666666',     // Disabled states
      inverse: '#000000',      // Text on light backgrounds
    },

    // Semantic Colors
    success: '#4CAF50',        // Success states, scrap/rewards
    danger: '#FF4444',         // Errors, hull damage, warnings
    warning: '#FFA500',        // Caution states
    info: '#3B82F6',           // Informational elements
    primary: '#4A90E2',        // Primary actions (from BuildMenu)

    // Campaign-Specific
    difficulty: {
      easy: '#4CAF50',         // Green - beginner friendly
      medium: '#FFA500',       // Orange - moderate challenge
      hard: '#FF4444',         // Red - expert level
    },

    star: {
      filled: '#FFD700',       // Gold - earned stars
      empty: '#444444',        // Dark gray - unearned stars
    },

    progression: {
      complete: '#4CAF50',     // Completed levels
      current: '#4A90E2',      // Active/current level
      locked: '#666666',       // Locked levels
    },

    // Game-Specific (from existing UI)
    scrap: '#FFD700',          // Resource color (gold from BuildMenu)
    hull: '#FF4444',           // Hull integrity color

    // Overlays
    overlay: {
      dark: 'rgba(0, 0, 0, 0.7)',      // Modal backgrounds
      darker: 'rgba(0, 0, 0, 0.9)',    // Victory/game over screens
      subtle: 'rgba(0, 0, 0, 0.5)',    // Image overlays
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,        // Small buttons, inputs
    md: 12,       // Medium buttons (like startButton)
    lg: 16,       // Large cards, modals
    xl: 24,       // Extra large elements
    round: 999,   // Fully rounded (pills, badges)
  },

  typography: {
    fontSize: {
      xs: 12,     // Version text, small labels
      sm: 14,     // Stats, descriptions, body text
      md: 16,     // Button text, standard body
      lg: 18,     // Large body, tap to continue
      xl: 24,     // Section headings
      xxl: 32,    // Large headings
      huge: 48,   // Title (ZOMBIE FLEET)
    },

    fontWeight: {
      normal: '400' as const,
      semibold: '600' as const,
      bold: '700' as const,
      extrabold: '800' as const,
      black: '900' as const,
    },

    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  shadows: {
    none: {},

    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 2, // Android
    },

    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },

    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },

    // Colored shadows for special buttons (like startButton)
    success: {
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },

    primary: {
      shadowColor: '#4A90E2',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
  },

  touchTarget: {
    minHeight: 44,      // iOS minimum guideline
    minWidth: 44,       // iOS minimum guideline
    recommended: 48,    // Recommended for better UX
  },

  // Animation durations (in milliseconds)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    victory: 1500,      // For star reveals
  },
} as const;

export type Theme = typeof THEME;

/**
 * Helper function to get difficulty color
 */
export const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  return THEME.colors.difficulty[difficulty];
};

/**
 * Helper function to get star color
 */
export const getStarColor = (filled: boolean): string => {
  return filled ? THEME.colors.star.filled : THEME.colors.star.empty;
};

/**
 * Helper function to get progression color
 */
export const getProgressionColor = (state: 'complete' | 'current' | 'locked'): string => {
  return THEME.colors.progression[state];
};
