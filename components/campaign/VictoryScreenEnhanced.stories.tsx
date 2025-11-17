import type { Meta, StoryObj } from '@storybook/react';
import { VictoryScreenEnhanced } from './VictoryScreenEnhanced';

/**
 * # VictoryScreenEnhanced Component
 *
 * Displays victory screen after level completion with animated star reveal and campaign progression.
 *
 * ## Features
 * - Animated modal entrance with sequential star reveal
 * - Performance stats display (zombies killed, waves, scrap, time)
 * - Three action buttons: Next Level, Replay, Back to Campaign
 * - Responsive layout with dark theme styling
 * - Trophy icons and color-coded stats
 *
 * ## Design Specs
 * From `docs/ui-specs.md` Section 6: VictoryScreenEnhanced Component
 */
const meta = {
  title: 'Campaign/VictoryScreenEnhanced',
  component: VictoryScreenEnhanced,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'game',
      values: [{ name: 'game', value: '#1a1a1a' }],
    },
  },
  argTypes: {
    visible: {
      control: 'boolean',
      description: 'Controls modal visibility',
      table: { defaultValue: { summary: 'true' } },
    },
    starsEarned: {
      control: { type: 'range', min: 0, max: 3, step: 1 },
      description: 'Number of stars earned (0-3)',
      table: { defaultValue: { summary: '3' } },
    },
    isLastLevel: {
      control: 'boolean',
      description: 'Hide "Next Level" button if true',
      table: { defaultValue: { summary: 'false' } },
    },
    levelId: {
      control: 'text',
      description: 'Level identifier',
    },
    stats: {
      control: 'object',
      description: 'Performance statistics',
    },
    onNextLevel: { action: 'next-level' },
    onReplay: { action: 'replay' },
    onBackToCampaign: { action: 'back-to-campaign' },
  },
} satisfies Meta<typeof VictoryScreenEnhanced>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Perfect Victory (3 Stars)
 * Maximum stars earned with excellent performance.
 */
export const ThreeStars: Story = {
  args: {
    visible: true,
    levelId: 'level-01',
    starsEarned: 3,
    stats: {
      zombiesKilled: 247,
      wavesCompleted: 10,
      scrapEarned: 450,
      timeSeconds: 514, // 8:34
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Good Victory (2 Stars)
 * Solid performance with room for improvement.
 */
export const TwoStars: Story = {
  args: {
    visible: true,
    levelId: 'level-03',
    starsEarned: 2,
    stats: {
      zombiesKilled: 189,
      wavesCompleted: 10,
      scrapEarned: 320,
      timeSeconds: 612, // 10:12
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Narrow Victory (1 Star)
 * Level completed but with minimal performance.
 */
export const OneStar: Story = {
  args: {
    visible: true,
    levelId: 'level-05',
    starsEarned: 1,
    stats: {
      zombiesKilled: 98,
      wavesCompleted: 10,
      scrapEarned: 180,
      timeSeconds: 723, // 12:03
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Last Level Victory
 * Victory screen for the final level - no "Next Level" button.
 */
export const LastLevel: Story = {
  args: {
    visible: true,
    levelId: 'level-10',
    starsEarned: 3,
    stats: {
      zombiesKilled: 412,
      wavesCompleted: 10,
      scrapEarned: 580,
      timeSeconds: 892, // 14:52
    },
    isLastLevel: true,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Quick Victory
 * Fast completion time with high zombie kill count.
 */
export const QuickVictory: Story = {
  args: {
    visible: true,
    levelId: 'level-02',
    starsEarned: 3,
    stats: {
      zombiesKilled: 315,
      wavesCompleted: 10,
      scrapEarned: 425,
      timeSeconds: 387, // 6:27
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## High Scrap Victory
 * Maximum scrap collection with 3 stars.
 */
export const HighScrap: Story = {
  args: {
    visible: true,
    levelId: 'level-07',
    starsEarned: 3,
    stats: {
      zombiesKilled: 298,
      wavesCompleted: 10,
      scrapEarned: 650,
      timeSeconds: 678, // 11:18
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Minimal Victory
 * Just barely completed with minimum stats.
 */
export const MinimalVictory: Story = {
  args: {
    visible: true,
    levelId: 'level-06',
    starsEarned: 1,
    stats: {
      zombiesKilled: 52,
      wavesCompleted: 10,
      scrapEarned: 95,
      timeSeconds: 1024, // 17:04
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Epic Victory
 * Exceptional performance across all metrics.
 */
export const EpicVictory: Story = {
  args: {
    visible: true,
    levelId: 'level-08',
    starsEarned: 3,
    stats: {
      zombiesKilled: 523,
      wavesCompleted: 10,
      scrapEarned: 720,
      timeSeconds: 456, // 7:36
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Hidden (Not Visible)
 * Modal in hidden state - useful for testing visibility toggle.
 */
export const Hidden: Story = {
  args: {
    visible: false,
    levelId: 'level-01',
    starsEarned: 3,
    stats: {
      zombiesKilled: 247,
      wavesCompleted: 10,
      scrapEarned: 450,
      timeSeconds: 514,
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level'),
    onReplay: () => console.log('Replay'),
    onBackToCampaign: () => console.log('Back to campaign'),
  },
};

/**
 * ## Interactive Example
 * Fully interactive victory screen with controls.
 */
export const Interactive: Story = {
  args: {
    visible: true,
    levelId: 'level-04',
    starsEarned: 2,
    stats: {
      zombiesKilled: 176,
      wavesCompleted: 10,
      scrapEarned: 285,
      timeSeconds: 548,
    },
    isLastLevel: false,
    onNextLevel: () => console.log('Next level clicked'),
    onReplay: () => console.log('Replay clicked'),
    onBackToCampaign: () => console.log('Back to campaign clicked'),
  },
};
