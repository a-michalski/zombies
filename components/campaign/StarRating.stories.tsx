import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import StarRating from './StarRating';
import { THEME } from '@/constants/ui/theme';

/**
 * StarRating displays a 0-3 star rating system for campaign levels.
 *
 * ## Features
 * - Displays 0-3 filled stars (gold) with remaining stars empty (dark gray)
 * - Three size variants: small, medium, large
 * - Optional sequential fade-in animation
 * - Optional "X/3 Stars" label
 * - Uses Lucide Star icon
 *
 * ## Usage
 * ```tsx
 * <StarRating stars={2} />
 * <StarRating stars={3} size="large" animated={true} showLabel={true} />
 * ```
 */
const meta = {
  title: 'Campaign/StarRating',
  component: StarRating,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A star rating component for displaying level completion performance (0-3 stars).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    stars: {
      control: { type: 'range', min: 0, max: 3, step: 1 },
      description: 'Number of filled stars (0-3)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    maxStars: {
      control: { type: 'number' },
      description: 'Maximum number of stars to display',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the stars',
      table: {
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Enable sequential fade-in animation',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showLabel: {
      control: 'boolean',
      description: 'Show "X/3 Stars" label below stars',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default star rating (no stars earned)
 */
export const Default: Story = {
  args: {
    stars: 0,
    size: 'medium',
  },
};

/**
 * Zero stars - level not completed or failed
 */
export const ZeroStars: Story = {
  args: {
    stars: 0,
    size: 'medium',
  },
};

/**
 * One star - minimal completion
 */
export const OneStar: Story = {
  args: {
    stars: 1,
    size: 'medium',
  },
};

/**
 * Two stars - good performance
 */
export const TwoStars: Story = {
  args: {
    stars: 2,
    size: 'medium',
  },
};

/**
 * Three stars - perfect completion
 */
export const ThreeStars: Story = {
  args: {
    stars: 3,
    size: 'medium',
  },
};

/**
 * Small size variant
 */
export const SmallSize: Story = {
  args: {
    stars: 2,
    size: 'small',
  },
};

/**
 * Large size variant
 */
export const LargeSize: Story = {
  args: {
    stars: 2,
    size: 'large',
  },
};

/**
 * With label showing star count
 */
export const WithLabel: Story = {
  args: {
    stars: 2,
    size: 'medium',
    showLabel: true,
  },
};

/**
 * Animated star reveal (refresh story to see animation)
 */
export const Animated: Story = {
  args: {
    stars: 3,
    size: 'large',
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Stars fade in sequentially when animated=true. Refresh the story to see the animation again.',
      },
    },
  },
};

/**
 * Perfect completion with animation and label
 */
export const VictoryDisplay: Story = {
  args: {
    stars: 3,
    size: 'large',
    animated: true,
    showLabel: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of how stars appear on the victory screen with animation and label.',
      },
    },
  },
};

/**
 * All star counts displayed together
 */
export const AllStarCounts: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.column}>
        <Text style={styles.label}>0 Stars</Text>
        <StarRating stars={0} size="medium" showLabel={true} />
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>1 Star</Text>
        <StarRating stars={1} size="medium" showLabel={true} />
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>2 Stars</Text>
        <StarRating stars={2} size="medium" showLabel={true} />
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>3 Stars</Text>
        <StarRating stars={3} size="medium" showLabel={true} />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays all possible star counts (0-3) for comparison.',
      },
    },
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.column}>
        <Text style={styles.label}>Small</Text>
        <StarRating stars={2} size="small" />
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Medium</Text>
        <StarRating stars={2} size="medium" />
      </View>
      <View style={styles.column}>
        <Text style={styles.label}>Large</Text>
        <StarRating stars={2} size="large" />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays all three size variants for comparison.',
      },
    },
  },
};

/**
 * Interactive playground
 */
export const Interactive: Story = {
  args: {
    stars: 2,
    maxStars: 3,
    size: 'medium',
    animated: false,
    showLabel: false,
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
    flexDirection: 'row',
    gap: THEME.spacing.xl,
    padding: THEME.spacing.md,
  },
  column: {
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  label: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
});
