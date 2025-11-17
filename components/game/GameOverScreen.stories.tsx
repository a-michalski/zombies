import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { GameOverScreen } from './GameOverScreen';

/**
 * # GameOverScreen Component
 *
 * End-game modal displayed after victory or defeat.
 * Shows game statistics and options to replay or return to menu.
 *
 * ## Features
 * - **Victory State:** Green theme with Trophy icon (#4CAF50)
 * - **Defeat State:** Red theme with Skull icon (#FF4444)
 * - Displays final statistics (hull, scrap, zombies killed)
 * - Auto-saves game stats to storage
 * - Two actions: Play Again (reset) or Main Menu (navigate back)
 *
 * ## Victory vs Defeat
 * **Victory:**
 * - Triggered when all waves are survived
 * - Green border and background tint
 * - Trophy icon (gold #FFD700)
 * - "VICTORY!" title
 * - "All waves survived!" subtitle
 *
 * **Defeat:**
 * - Triggered when hull reaches 0
 * - Red border and background tint
 * - Skull icon (red #FF4444)
 * - "BASTION DESTROYED" title
 * - "Survived X/10 waves" subtitle
 *
 * ## Dependencies
 * Requires GameProvider context for:
 * - gameState.phase ('victory' or 'defeat')
 * - gameState.hullIntegrity (final hull value)
 * - gameState.scrap (remaining scrap)
 * - gameState.stats.zombiesKilled (kill count)
 * - gameState.currentWave (wave number)
 * - resetGame() callback (restart functionality)
 */
const meta = {
  title: 'Game/GameOverScreen',
  component: GameOverScreen,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'game',
      values: [{ name: 'game', value: '#1a1a1a' }],
    },
  },
  decorators: [
    (Story) => {
      return (
        <GameProvider>
          <Story />
        </GameProvider>
      );
    },
  ],
} satisfies Meta<typeof GameOverScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Victory Screen
 * All waves survived - victory condition met.
 *
 * **Visual Theme:**
 * - Green background tint (#1a3a1a)
 * - Green border (#4CAF50)
 * - Gold trophy icon (#FFD700)
 *
 * **Stats Displayed:**
 * - Hull Integrity: Remaining health
 * - Scrap Remaining: Unused resources
 * - Zombies Killed: Total kill count
 *
 * **Title:** "VICTORY!"
 * **Subtitle:** "All waves survived!"
 */
export const Victory: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: `
**Victory Condition:**
When \`gameState.phase === 'victory'\`:
- Shows green-themed modal
- Trophy icon (80px, gold color)
- Victory message and stats
- "All waves survived!" subtitle

**Stats Shown:**
- Hull Integrity: Final health value (e.g., 15/20)
- Scrap Remaining: Leftover resources
- Zombies Killed: Total eliminated

Note: Menu requires \`gameState.phase\` to be 'victory'.
        `,
      },
    },
  },
};

/**
 * ## Defeat Screen
 * Hull reached zero - defeat condition met.
 *
 * **Visual Theme:**
 * - Red background tint (#3a1a1a)
 * - Red border (#FF4444)
 * - Red skull icon (#FF4444)
 *
 * **Title:** "BASTION DESTROYED"
 * **Subtitle:** "Survived X/10 waves"
 * (where X = currentWave - 1)
 */
export const Defeat: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: `
**Defeat Condition:**
When \`gameState.phase === 'defeat'\`:
- Shows red-themed modal
- Skull icon (80px, red color)
- Defeat message and stats
- "Survived X/10 waves" subtitle

**Wave Count:**
Displays \`currentWave - 1\` because defeat happens during a wave,
so the wave that killed you is not counted as "survived".

**Example:**
If \`gameState.currentWave === 7\`:
- Subtitle: "Survived 6/10 waves"
- You died during wave 7
        `,
      },
    },
  },
};

/**
 * ## Early Defeat (Wave 1)
 * Defeat on first wave - challenging start.
 *
 * **Subtitle:** "Survived 0/10 waves"
 * **Stats:** Low kill count, full or near-full scrap
 */
export const EarlyDefeat: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: `
**Early Game Defeat:**
When defeated on wave 1:
- \`currentWave === 1\`
- Survived waves: \`1 - 1 = 0\`
- Subtitle: "Survived 0/10 waves"

Usually indicates:
- Player didn't build enough towers
- Poor tower placement
- Insufficient scrap management
        `,
      },
    },
  },
};

/**
 * ## Close Victory
 * Barely survived with low hull integrity.
 *
 * **Hull:** 1-3 remaining (critical)
 * **Visual:** Green victory theme despite low hull
 * **Message:** Still shows "VICTORY!" (completion matters)
 */
export const CloseVictory: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: `
**Narrow Victory:**
Completed all waves but with minimal hull:
- Hull: 1/20 (critical)
- Scrap: Likely depleted
- Zombies Killed: High count

Shows that victory is binary:
- Complete waves = victory (green theme)
- Even with 1 hull remaining
        `,
      },
    },
  },
};

/**
 * ## Perfect Victory
 * All waves with high hull and scrap.
 *
 * **Hull:** 18-20/20 (excellent defense)
 * **Scrap:** High remaining (efficient gameplay)
 * **Zombies:** Maximum kill count
 */
export const PerfectVictory: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: `
**Perfect Run:**
Optimal performance across all metrics:
- Hull: 20/20 (no damage taken)
- Scrap: 500+ (efficient resource use)
- Zombies Killed: 300+ (all waves cleared)

Indicates:
- Excellent tower placement
- Strong resource management
- Optimal upgrade strategy
        `,
      },
    },
  },
};

/**
 * ## Late Game Defeat
 * Survived most waves before defeat.
 *
 * **Waves:** 8-9/10 survived
 * **Stats:** High zombies killed, depleted scrap
 * **Message:** Shows progress despite defeat
 */
export const LateDefeat: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: `
**Near-Victory Defeat:**
Failed on wave 9 or 10:
- \`currentWave === 9 or 10\`
- Survived: 8 or 9 waves
- High kill count (200+)
- Scrap likely depleted

Common causes:
- Insufficient tower upgrades
- Final waves too strong
- Resource depletion
- Poor late-game strategy
        `,
      },
    },
  },
};

/**
 * ## Hidden (Not Game Over)
 * Game is still playing - screen doesn't render.
 *
 * **Render Condition:**
 * GameOverScreen returns `null` when:
 * - `gameState.phase !== 'victory'` AND
 * - `gameState.phase !== 'defeat'`
 */
export const Hidden: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: `
**Hidden State:**
The GameOverScreen has built-in visibility logic:
\`\`\`typescript
if (gameState.phase !== "victory" &&
    gameState.phase !== "defeat") {
  return null;
}
\`\`\`

During normal gameplay (playing, between_waves, etc.),
the component renders nothing.
        `,
      },
    },
  },
};

/**
 * ## Interactive Documentation
 * Full component documentation with usage examples.
 *
 * ### Props & Dependencies
 * GameOverScreen takes no direct props. It depends on GameContext and expo-router:
 *
 * **From useGame():**
 * - `gameState.phase` - Controls which screen ('victory' or 'defeat')
 * - `gameState.hullIntegrity` - Final hull value
 * - `gameState.scrap` - Remaining scrap
 * - `gameState.stats.zombiesKilled` - Total kills
 * - `gameState.currentWave` - Wave number
 * - `resetGame()` - Restarts game from beginning
 *
 * **From expo-router:**
 * - `router.back()` - Returns to previous screen (main menu)
 *
 * ### Auto-Save Feature
 * **Stats Storage:**
 * ```typescript
 * useEffect(() => {
 *   if ((phase === "victory" || phase === "defeat") &&
 *       !statsSavedRef.current) {
 *     const wavesSurvived = phase === "victory"
 *       ? currentWave
 *       : currentWave - 1;
 *
 *     updateStatsFromGame(
 *       currentWave,
 *       stats.zombiesKilled,
 *       wavesSurvived
 *     );
 *     statsSavedRef.current = true;
 *   }
 * }, [phase, currentWave, stats.zombiesKilled]);
 * ```
 *
 * Stats are saved once per game over to persistent storage.
 *
 * ### Button Actions
 * **Play Again Button:**
 * ```typescript
 * onPress={() => {
 *   statsSavedRef.current = false; // Allow new save
 *   resetGame();                   // Reset game state
 * }}
 * ```
 *
 * **Main Menu Button:**
 * ```typescript
 * onPress={() => router.back()}
 * ```
 *
 * ### Visual Styling
 * **Victory Theme:**
 * - Background: Green-tinted (#1a3a1a)
 * - Border: Green (#4CAF50), 3px
 * - Icon: Trophy (gold #FFD700)
 *
 * **Defeat Theme:**
 * - Background: Red-tinted (#3a1a1a)
 * - Border: Red (#FF4444), 3px
 * - Icon: Skull (red #FF4444)
 *
 * **Typography:**
 * - Title: 32px, weight 900
 * - Subtitle: 18px, gray (#AAAAAA)
 * - Stats: 16px, weight 600/700
 *
 * ### Usage in Game
 * **Trigger Conditions:**
 * Victory: Set \`gameState.phase = 'victory'\` after final wave
 * Defeat: Set \`gameState.phase = 'defeat'\` when hull reaches 0
 *
 * **Integration Example:**
 * ```tsx
 * import { GameOverScreen } from '@/components/game/GameOverScreen';
 * import { GameProvider } from '@/contexts/GameContext';
 *
 * function GameScreen() {
 *   return (
 *     <GameProvider>
 *       <GameMap />
 *       <GameControls />
 *       <PauseMenu />
 *       <GameOverScreen />
 *     </GameProvider>
 *   );
 * }
 * ```
 */
export const Documentation: Story = {
  render: () => <GameOverScreen />,
  parameters: {
    docs: {
      description: {
        story: 'See the source code and implementation details above for complete reference.',
      },
    },
  },
};
