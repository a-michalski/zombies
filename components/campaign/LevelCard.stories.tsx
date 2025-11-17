import type { Meta, StoryObj } from '@storybook/react';
import { View, StyleSheet } from 'react-native';
import LevelCard from './LevelCard';
import { THEME } from '@/constants/ui/theme';
import {
  MOCK_LEVEL_01,
  MOCK_LEVEL_03,
  MOCK_LEVEL_05,
  MOCK_PROGRESS_NOT_COMPLETED,
  MOCK_PROGRESS_ONE_STAR,
  MOCK_PROGRESS_TWO_STARS,
  MOCK_PROGRESS_THREE_STARS,
} from '@/.storybook/mocks/levelMocks';

/**
 * LevelCard is a campaign level selection card component.
 *
 * ## Features
 * - Three states: locked, unlocked (not completed), completed
 * - Shows level thumbnail with number
 * - Displays difficulty badge
 * - **Level description** (2 lines max, ellipsis) - matches Figma specs
 * - Shows star rating for completed levels
 * - Action button: LOCKED / PLAY / REPLAY
 * - Supports highlight for next level (golden border)
 * - Touch interactions: onPress, onLongPress
 *
 * ## Usage
 * ```tsx
 * <LevelCard
 *   level={LEVEL_01}
 *   progress={{ completed: true, starsEarned: 3 }}
 *   locked={false}
 *   onPress={() => console.log('Start level')}
 * />
 * ```
 */
const meta = {
  title: 'Campaign/LevelCard',
  component: LevelCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A card component for displaying campaign level information and allowing level selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      description: 'Level configuration object',
      table: {
        type: { summary: 'LevelConfig' },
      },
    },
    progress: {
      description: 'Level progress data (null if never played)',
      table: {
        type: { summary: 'LevelProgress | null' },
      },
    },
    locked: {
      control: 'boolean',
      description: 'Whether the level is locked',
      table: {
        type: { summary: 'boolean' },
      },
    },
    isNext: {
      control: 'boolean',
      description: 'Highlight as next level to play',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onPress: {
      action: 'pressed',
      description: 'Callback when card is pressed',
      table: {
        type: { summary: '() => void' },
      },
    },
    onLongPress: {
      action: 'long pressed',
      description: 'Callback when card is long pressed',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
} satisfies Meta<typeof LevelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Locked level - cannot be played yet
 */
export const Locked: Story = {
  args: {
    level: MOCK_LEVEL_03,
    progress: null,
    locked: true,
  },
};

/**
 * Unlocked level - ready to play (not completed)
 */
export const Unlocked: Story = {
  args: {
    level: MOCK_LEVEL_01,
    progress: MOCK_PROGRESS_NOT_COMPLETED,
    locked: false,
  },
};

/**
 * Completed with 1 star
 */
export const Completed1Star: Story = {
  args: {
    level: MOCK_LEVEL_01,
    progress: MOCK_PROGRESS_ONE_STAR,
    locked: false,
  },
};

/**
 * Completed with 2 stars
 */
export const Completed2Stars: Story = {
  args: {
    level: MOCK_LEVEL_03,
    progress: MOCK_PROGRESS_TWO_STARS,
    locked: false,
  },
};

/**
 * Completed with 3 stars (perfect)
 */
export const Completed3Stars: Story = {
  args: {
    level: MOCK_LEVEL_01,
    progress: MOCK_PROGRESS_THREE_STARS,
    locked: false,
  },
};

/**
 * Next level to play - highlighted with golden border
 */
export const NextLevel: Story = {
  args: {
    level: MOCK_LEVEL_03,
    progress: null,
    locked: false,
    isNext: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The next recommended level is highlighted with a golden border.',
      },
    },
  },
};

/**
 * Easy difficulty level
 */
export const EasyDifficulty: Story = {
  args: {
    level: MOCK_LEVEL_01,
    progress: null,
    locked: false,
  },
};

/**
 * Medium difficulty level
 */
export const MediumDifficulty: Story = {
  args: {
    level: MOCK_LEVEL_03,
    progress: null,
    locked: false,
  },
};

/**
 * Hard difficulty level
 */
export const HardDifficulty: Story = {
  args: {
    level: MOCK_LEVEL_05,
    progress: null,
    locked: false,
  },
};

/**
 * With interaction handlers
 */
export const WithInteractions: Story = {
  args: {
    level: MOCK_LEVEL_01,
    progress: MOCK_PROGRESS_TWO_STARS,
    locked: false,
    onPress: () => console.log('Level pressed!'),
    onLongPress: () => console.log('Level long pressed!'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the card to trigger onPress, hold to trigger onLongPress. Check the Actions panel.',
      },
    },
  },
};

/**
 * All level states side by side
 */
export const AllStates: Story = {
  render: () => (
    <View style={styles.grid}>
      <LevelCard
        level={MOCK_LEVEL_01}
        progress={null}
        locked={true}
      />
      <LevelCard
        level={MOCK_LEVEL_01}
        progress={MOCK_PROGRESS_NOT_COMPLETED}
        locked={false}
      />
      <LevelCard
        level={MOCK_LEVEL_01}
        progress={MOCK_PROGRESS_ONE_STAR}
        locked={false}
      />
      <LevelCard
        level={MOCK_LEVEL_03}
        progress={MOCK_PROGRESS_TWO_STARS}
        locked={false}
      />
      <LevelCard
        level={MOCK_LEVEL_01}
        progress={MOCK_PROGRESS_THREE_STARS}
        locked={false}
      />
      <LevelCard
        level={MOCK_LEVEL_03}
        progress={null}
        locked={false}
        isNext={true}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays all possible level card states: locked, unlocked, 1/2/3 stars, and next level.',
      },
    },
  },
};

/**
 * All difficulty levels
 */
export const AllDifficulties: Story = {
  render: () => (
    <View style={styles.grid}>
      <LevelCard
        level={MOCK_LEVEL_01}
        progress={MOCK_PROGRESS_THREE_STARS}
        locked={false}
      />
      <LevelCard
        level={MOCK_LEVEL_03}
        progress={MOCK_PROGRESS_TWO_STARS}
        locked={false}
      />
      <LevelCard
        level={MOCK_LEVEL_05}
        progress={MOCK_PROGRESS_ONE_STAR}
        locked={false}
      />
    </View>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays cards for easy, medium, and hard difficulty levels.',
      },
    },
  },
};

/**
 * Interactive playground
 */
export const Interactive: Story = {
  args: {
    level: MOCK_LEVEL_01,
    progress: MOCK_PROGRESS_TWO_STARS,
    locked: false,
    isNext: false,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
    padding: THEME.spacing.md,
    justifyContent: 'center',
  },
});
