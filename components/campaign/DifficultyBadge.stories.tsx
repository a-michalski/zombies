import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';
import DifficultyBadge from './DifficultyBadge';
import { THEME } from '@/constants/ui/theme';

/**
 * DifficultyBadge displays the difficulty level of a campaign level as a colored pill badge.
 *
 * ## Features
 * - Three difficulty levels: easy (green), medium (orange), hard (red)
 * - Two size variants: small and medium
 * - Optional icons: CheckCircle (easy), AlertCircle (medium), AlertTriangle (hard)
 * - Color-coded based on THEME.colors.difficulty
 * - Uppercase text display
 *
 * ## Usage
 * ```tsx
 * <DifficultyBadge difficulty="easy" />
 * <DifficultyBadge difficulty="hard" size="small" showIcon />
 * ```
 */
const meta = {
  title: 'Campaign/DifficultyBadge',
  component: DifficultyBadge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A colored badge component that displays the difficulty level of a campaign level.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    difficulty: {
      control: 'select',
      options: ['easy', 'medium', 'hard'],
      description: 'The difficulty level of the level',
      table: {
        type: { summary: "'easy' | 'medium' | 'hard'" },
        defaultValue: { summary: 'medium' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'The size variant of the badge',
      table: {
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: 'medium' },
      },
    },
    showIcon: {
      control: 'boolean',
      description: 'Show difficulty icon (CheckCircle for easy, AlertCircle for medium, AlertTriangle for hard)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof DifficultyBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default difficulty badge with medium size
 */
export const Default: Story = {
  args: {
    difficulty: 'medium',
    size: 'medium',
  },
};

/**
 * Easy difficulty badge (green)
 */
export const Easy: Story = {
  args: {
    difficulty: 'easy',
    size: 'medium',
  },
};

/**
 * Medium difficulty badge (orange)
 */
export const Medium: Story = {
  args: {
    difficulty: 'medium',
    size: 'medium',
  },
};

/**
 * Hard difficulty badge (red)
 */
export const Hard: Story = {
  args: {
    difficulty: 'hard',
    size: 'medium',
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    difficulty: 'medium',
    size: 'small',
  },
};

/**
 * All difficulties displayed together for comparison
 */
export const AllDifficulties: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.row}>
        <DifficultyBadge difficulty="easy" size="medium" />
      </View>
      <View style={styles.row}>
        <DifficultyBadge difficulty="medium" size="medium" />
      </View>
      <View style={styles.row}>
        <DifficultyBadge difficulty="hard" size="medium" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays all three difficulty levels side by side for comparison.',
      },
    },
  },
};

/**
 * All sizes displayed together for comparison
 */
export const AllSizes: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.row}>
        <DifficultyBadge difficulty="hard" size="small" />
      </View>
      <View style={styles.row}>
        <DifficultyBadge difficulty="hard" size="medium" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays both size variants for comparison.',
      },
    },
  },
};

/**
 * With icons - shows difficulty icons
 */
export const WithIcons: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.row}>
        <DifficultyBadge difficulty="easy" size="medium" showIcon />
      </View>
      <View style={styles.row}>
        <DifficultyBadge difficulty="medium" size="medium" showIcon />
      </View>
      <View style={styles.row}>
        <DifficultyBadge difficulty="hard" size="medium" showIcon />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays difficulty badges with icons: CheckCircle (easy), AlertCircle (medium), AlertTriangle (hard).',
      },
    },
  },
};

/**
 * All variants - with and without icons
 */
export const AllVariants: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.row}>
        <DifficultyBadge difficulty="easy" size="medium" />
        <DifficultyBadge difficulty="easy" size="medium" showIcon />
      </View>
      <View style={styles.row}>
        <DifficultyBadge difficulty="medium" size="medium" />
        <DifficultyBadge difficulty="medium" size="medium" showIcon />
      </View>
      <View style={styles.row}>
        <DifficultyBadge difficulty="hard" size="medium" />
        <DifficultyBadge difficulty="hard" size="medium" showIcon />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all difficulties with and without icons.',
      },
    },
  },
};

/**
 * Interactive playground for testing all props
 */
export const Interactive: Story = {
  args: {
    difficulty: 'medium',
    size: 'medium',
    showIcon: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story with full control over all props. Use the Controls panel to experiment.',
      },
    },
  },
};

const styles = StyleSheet.create({
  showcaseContainer: {
    gap: THEME.spacing.md,
    padding: THEME.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
});
