import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { PauseMenu } from './PauseMenu';

/**
 * # PauseMenu Component
 *
 * Modal menu displayed when game is paused.
 * Provides options to resume, adjust settings, or return to main menu.
 *
 * ## Features
 * - **Resume:** Unpauses game and continues gameplay
 * - **Settings:** Opens settings screen (navigation)
 * - **Main Menu:** Returns to previous screen (navigation)
 * - Dark overlay (90% opacity) to clearly indicate paused state
 * - Only renders when game is paused (not during victory/defeat)
 *
 * ## Dependencies
 * Requires GameProvider context for:
 * - gameState.isPaused (determines if menu is visible)
 * - gameState.phase (hides menu during victory/defeat screens)
 * - togglePause() callback (resume functionality)
 *
 * Also uses expo-router for navigation:
 * - router.push('/settings') - Settings screen
 * - router.back() - Main menu
 */
const meta = {
  title: 'Game/PauseMenu',
  component: PauseMenu,
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
} satisfies Meta<typeof PauseMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Paused State
 * Game is paused - menu is visible with all actions available.
 *
 * **Visual:**
 * - Dark overlay (rgba(0,0,0,0.9))
 * - Centered modal with "GAME PAUSED" title
 * - Three action buttons vertically stacked
 *
 * **Buttons:**
 * 1. **Resume** (Green #4CAF50) - Continues gameplay
 * 2. **Settings** (Blue #4A90E2) - Opens settings screen
 * 3. **Main Menu** (Gray #444444) - Returns to menu
 */
export const Paused: Story = {
  render: () => <PauseMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Paused Gameplay:**
When \`gameState.isPaused === true\` and phase is not victory/defeat:
- Menu renders as full-screen modal
- Dark overlay prevents interaction with game
- Three action buttons provide navigation options

**Button Actions:**
- Resume: Calls \`togglePause()\` to unpause
- Settings: Calls \`router.push('/settings')\`
- Main Menu: Calls \`router.back()\`

Note: Menu requires \`gameState.isPaused\` to be true.
        `,
      },
    },
  },
};

/**
 * ## Not Paused (Hidden)
 * Game is playing - menu doesn't render.
 *
 * **Render Condition:**
 * PauseMenu returns `null` when:
 * - `gameState.isPaused === false`, OR
 * - `gameState.phase === 'victory'`, OR
 * - `gameState.phase === 'defeat'`
 */
export const NotPaused: Story = {
  render: () => <PauseMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Hidden State:**
The PauseMenu has built-in visibility logic:
\`\`\`typescript
if (!gameState.isPaused ||
    gameState.phase === "victory" ||
    gameState.phase === "defeat") {
  return null;
}
\`\`\`

When game is not paused, the component renders nothing.
During victory/defeat phases, this menu is hidden in favor of GameOverScreen.
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
 * PauseMenu takes no direct props. It depends on GameContext and expo-router:
 *
 * **From useGame():**
 * - `gameState.isPaused` - Controls visibility
 * - `gameState.phase` - Hides during victory/defeat
 * - `togglePause()` - Resumes gameplay
 *
 * **From expo-router:**
 * - `router.push('/settings')` - Settings navigation
 * - `router.back()` - Main menu navigation
 *
 * ### Button Actions
 * **Resume Button:**
 * ```typescript
 * const handleResume = () => {
 *   togglePause(); // Sets isPaused to false
 * };
 * ```
 *
 * **Settings Button:**
 * ```typescript
 * const handleSettings = () => {
 *   togglePause();           // Unpause first
 *   router.push('/settings'); // Navigate to settings
 * };
 * ```
 *
 * **Main Menu Button:**
 * ```typescript
 * const handleMainMenu = () => {
 *   togglePause();  // Unpause first
 *   router.back();  // Return to previous screen
 * };
 * ```
 *
 * ### Visual Styling
 * **Title:**
 * - Font size: 24px
 * - Font weight: 900 (black)
 * - Letter spacing: 2px
 * - Color: White (#FFFFFF)
 *
 * **Buttons:**
 * - Height: ~56px (padding: 16px vertical)
 * - Border radius: 12px
 * - Icons: 20px size from lucide-react-native
 * - Text: 18px, weight 800
 *
 * **Button Colors:**
 * - Resume: Green (#4CAF50)
 * - Settings: Blue (#4A90E2)
 * - Main Menu: Gray (#444444)
 *
 * ### State Management
 * ```typescript
 * // Pausing game (from game code)
 * togglePause(); // Sets isPaused to true, menu appears
 *
 * // Resuming game
 * togglePause(); // Sets isPaused to false, menu disappears
 *
 * // Checking pause state
 * if (gameState.isPaused &&
 *     gameState.phase !== 'victory' &&
 *     gameState.phase !== 'defeat') {
 *   // PauseMenu is visible
 * }
 * ```
 *
 * ### Usage in Game
 * **Pause Trigger:**
 * Typically paused via:
 * - Pause button in game UI
 * - App background/foreground events
 * - ESC key (desktop)
 * - Back button (Android)
 *
 * **Integration Example:**
 * ```tsx
 * import { PauseMenu } from '@/components/game/PauseMenu';
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
  render: () => <PauseMenu />,
  parameters: {
    docs: {
      description: {
        story: 'See the source code and implementation details above for complete reference.',
      },
    },
  },
};
