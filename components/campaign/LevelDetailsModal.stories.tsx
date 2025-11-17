import type { Meta, StoryObj } from '@storybook/react';
import { LevelDetailsModal } from './LevelDetailsModal';
import { MOCK_LEVEL_01, MOCK_LEVEL_03, MOCK_LEVEL_05 } from '@/.storybook/mocks/levelMocks';
import {
  MOCK_PROGRESS_NOT_COMPLETED,
  MOCK_PROGRESS_ONE_STAR,
  MOCK_PROGRESS_TWO_STARS,
  MOCK_PROGRESS_THREE_STARS,
} from '@/.storybook/mocks/levelMocks';

/**
 * # LevelDetailsModal Component
 *
 * Shows detailed level information before starting.
 * Includes objectives, difficulty, star requirements, and level stats.
 *
 * ## Features
 * - Scrollable modal with comprehensive level information
 * - Star requirements display with completion indicators
 * - Level statistics (waves, scrap, construction spots)
 * - Player progress tracking (if level completed)
 * - Locked state support with disabled start button
 * - Dismissible by tapping outside or close button
 *
 * ## Design Specs
 * From `docs/ui-specs.md` Section 7: LevelDetailsModal Component
 */
const meta = {
  title: 'Campaign/LevelDetailsModal',
  component: LevelDetailsModal,
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
    isUnlocked: {
      control: 'boolean',
      description: 'Whether level is unlocked',
      table: { defaultValue: { summary: 'true' } },
    },
    level: {
      control: 'object',
      description: 'Level configuration data',
    },
    playerProgress: {
      control: 'object',
      description: 'Player progress for this level (null if not completed)',
    },
    onStart: { action: 'start-level' },
    onClose: { action: 'close-modal' },
  },
} satisfies Meta<typeof LevelDetailsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Easy Level - Not Attempted
 * First level, unlocked but never played.
 */
export const EasyLevelNotAttempted: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_01,
    playerProgress: null,
    isUnlocked: true,
    onStart: () => console.log('Start level 1'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Medium Level - Completed with 2 Stars
 * Completed level showing player progress and best performance.
 */
export const MediumLevelTwoStars: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_03,
    playerProgress: MOCK_PROGRESS_TWO_STARS,
    isUnlocked: true,
    onStart: () => console.log('Replay level 3'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Hard Level - Completed with 3 Stars
 * Perfect completion showing all stars earned.
 */
export const HardLevelThreeStars: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_05,
    playerProgress: MOCK_PROGRESS_THREE_STARS,
    isUnlocked: true,
    onStart: () => console.log('Replay level 5'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Completed with 1 Star
 * Level completed with minimal performance - room for improvement.
 */
export const CompletedOneStar: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_03,
    playerProgress: MOCK_PROGRESS_ONE_STAR,
    isUnlocked: true,
    onStart: () => console.log('Retry level 3'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Locked Level
 * Level is locked - previous level must be completed first.
 */
export const LockedLevel: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_05,
    playerProgress: null,
    isUnlocked: false,
    onStart: () => console.log('Cannot start - locked'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Unlocked but Not Completed
 * Level is available but player hasn't attempted it yet.
 */
export const UnlockedNotCompleted: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_03,
    playerProgress: MOCK_PROGRESS_NOT_COMPLETED,
    isUnlocked: true,
    onStart: () => console.log('Start level 3'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Easy Level - 3 Stars
 * Easy difficulty level completed perfectly.
 */
export const EasyLevelPerfect: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_01,
    playerProgress: {
      ...MOCK_PROGRESS_THREE_STARS,
      levelId: 'level-01',
    },
    isUnlocked: true,
    onStart: () => console.log('Replay level 1'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Hard Level - Locked
 * Difficult level that's still locked.
 */
export const HardLevelLocked: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_05,
    playerProgress: null,
    isUnlocked: false,
    onStart: () => console.log('Cannot start'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Hidden (Not Visible)
 * Modal in hidden state - useful for testing visibility toggle.
 */
export const Hidden: Story = {
  args: {
    visible: false,
    level: MOCK_LEVEL_01,
    playerProgress: null,
    isUnlocked: true,
    onStart: () => console.log('Start level'),
    onClose: () => console.log('Close modal'),
  },
};

/**
 * ## Interactive Example
 * Fully interactive modal with console logging.
 */
export const Interactive: Story = {
  args: {
    visible: true,
    level: MOCK_LEVEL_03,
    playerProgress: MOCK_PROGRESS_TWO_STARS,
    isUnlocked: true,
    onStart: () => console.log('Starting level 3...'),
    onClose: () => console.log('Closing modal...'),
  },
};

/**
 * ## Null Level (Edge Case)
 * Modal with null level - should not render anything.
 */
export const NullLevel: Story = {
  args: {
    visible: true,
    level: null,
    playerProgress: null,
    isUnlocked: true,
    onStart: () => console.log('Start level'),
    onClose: () => console.log('Close modal'),
  },
};
