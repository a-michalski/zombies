import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';
import { THEME } from '@/constants/ui/theme';

/**
 * ProgressBar displays campaign star collection progress.
 *
 * ## Features
 * - Linear progress bar showing current/total stars
 * - Animated width transition (can be disabled)
 * - Customizable height
 * - Optional "X/Y Stars" label
 * - Green fill (#4CAF50) over dark gray background
 *
 * ## Usage
 * ```tsx
 * <ProgressBar current={15} total={30} />
 * <ProgressBar current={28} total={30} height={12} showLabel={false} />
 * ```
 */
const meta = {
  title: 'Campaign/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A linear progress bar for tracking star collection across campaign levels.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View style={styles.decorator}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: { type: 'range', min: 0, max: 30, step: 1 },
      description: 'Current stars earned',
      table: {
        type: { summary: 'number' },
      },
    },
    total: {
      control: { type: 'number' },
      description: 'Total possible stars',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '30' },
      },
    },
    height: {
      control: { type: 'range', min: 4, max: 24, step: 2 },
      description: 'Height of the progress bar in pixels',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '8' },
      },
    },
    showLabel: {
      control: 'boolean',
      description: 'Show "X/Y Stars" label below bar',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    animated: {
      control: 'boolean',
      description: 'Enable width animation',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default progress bar
 */
export const Default: Story = {
  args: {
    current: 15,
    total: 30,
  },
};

/**
 * Empty progress - no stars earned yet
 */
export const Empty: Story = {
  args: {
    current: 0,
    total: 30,
  },
};

/**
 * Half progress - 50% stars earned
 */
export const HalfProgress: Story = {
  args: {
    current: 15,
    total: 30,
  },
};

/**
 * Nearly complete - 90% stars earned
 */
export const NearlyComplete: Story = {
  args: {
    current: 27,
    total: 30,
  },
};

/**
 * Complete progress - all stars earned
 */
export const Complete: Story = {
  args: {
    current: 30,
    total: 30,
  },
};

/**
 * With animation enabled (refresh story to see)
 */
export const Animated: Story = {
  args: {
    current: 20,
    total: 30,
    animated: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar animates from 0% to the target width. Refresh the story to see the animation.',
      },
    },
  },
};

/**
 * Without animation
 */
export const NoAnimation: Story = {
  args: {
    current: 20,
    total: 30,
    animated: false,
  },
};

/**
 * Without label
 */
export const NoLabel: Story = {
  args: {
    current: 18,
    total: 30,
    showLabel: false,
  },
};

/**
 * Small height variant (4px)
 */
export const SmallHeight: Story = {
  args: {
    current: 15,
    total: 30,
    height: 4,
  },
};

/**
 * Medium height variant (12px)
 */
export const MediumHeight: Story = {
  args: {
    current: 15,
    total: 30,
    height: 12,
  },
};

/**
 * Large height variant (20px)
 */
export const LargeHeight: Story = {
  args: {
    current: 15,
    total: 30,
    height: 20,
  },
};

/**
 * Different total (10 levels = 30 max stars)
 */
export const CampaignProgress: Story = {
  args: {
    current: 22,
    total: 30,
    height: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example for a 10-level campaign (max 30 stars: 3 per level).',
      },
    },
  },
};

/**
 * All progress states showcase
 */
export const AllStates: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.progressItem}>
        <ProgressBar current={0} total={30} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={5} total={30} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={15} total={30} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={25} total={30} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={30} total={30} animated={false} />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays progress bars at 0%, 17%, 50%, 83%, and 100% completion.',
      },
    },
  },
};

/**
 * All height variants showcase
 */
export const AllHeights: Story = {
  render: () => (
    <View style={styles.showcaseContainer}>
      <View style={styles.progressItem}>
        <ProgressBar current={15} total={30} height={4} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={15} total={30} height={8} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={15} total={30} height={12} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={15} total={30} height={16} animated={false} />
      </View>
      <View style={styles.progressItem}>
        <ProgressBar current={15} total={30} height={20} animated={false} />
      </View>
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays all available height options (4px, 8px, 12px, 16px, 20px).',
      },
    },
  },
};

/**
 * Interactive playground
 */
export const Interactive: Story = {
  args: {
    current: 15,
    total: 30,
    height: 8,
    showLabel: true,
    animated: true,
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
  decorator: {
    width: 300,
    padding: THEME.spacing.md,
  },
  showcaseContainer: {
    width: 300,
    gap: THEME.spacing.lg,
    padding: THEME.spacing.md,
  },
  progressItem: {
    width: '100%',
  },
});
