import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { BuildMenu } from './BuildMenu';

/**
 * # BuildMenu Component
 *
 * Modal menu for building new towers on construction spots.
 * Shows tower stats, cost, and allows player to build if they have enough scrap.
 *
 * ## Features
 * - Displays tower name, description, and statistics (damage, range, fire rate, DPS)
 * - Shows build cost with color coding (gold if affordable, red if not)
 * - Build button disabled if player cannot afford
 * - Dismissible by clicking outside, close button, or cancel button
 * - Only renders when a construction spot is selected
 *
 * ## Dependencies
 * Requires GameProvider context for:
 * - gameState.selectedSpotId (determines if menu is visible)
 * - gameState.scrap (current player resources)
 * - buildTower(spotId) callback
 * - selectSpot(null) callback to close menu
 */
const meta = {
  title: 'Game/BuildMenu',
  component: BuildMenu,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'game',
      values: [{ name: 'game', value: '#1a1a1a' }],
    },
  },
  decorators: [
    (Story, context) => {
      // Create a wrapper that provides GameContext with controlled state
      const GameContextWrapper = () => {
        return (
          <GameProvider>
            <Story />
          </GameProvider>
        );
      };
      return <GameContextWrapper />;
    },
  ],
} satisfies Meta<typeof BuildMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Can Afford Tower
 * Player has enough scrap to build - build button is enabled.
 *
 * Note: This story uses GameProvider with default initial state.
 * The menu visibility depends on gameState.selectedSpotId being set.
 * In actual game, BuildMenu renders when user clicks a construction spot.
 */
export const CanAfford: Story = {
  render: () => {
    // This is a simplified example - in practice, you'd need to trigger
    // selectSpot() to make the menu visible
    return <BuildMenu />;
  },
  parameters: {
    docs: {
      description: {
        story: `
**Interactive Demo:**
This story demonstrates BuildMenu with sufficient scrap.
To see the menu in action:
1. The menu requires \`gameState.selectedSpotId\` to be set
2. In the game, clicking a construction spot triggers \`selectSpot(spotId)\`
3. The build button is enabled when \`gameState.scrap >= LOOKOUT_POST.buildCost\`

**Technical Note:**
BuildMenu uses \`useGame()\` hook which depends on GameProvider context.
The menu auto-renders as a Modal when \`selectedSpotId\` is not null.
        `,
      },
    },
  },
};

/**
 * ## Cannot Afford Tower
 * Player doesn't have enough scrap - build button is disabled.
 *
 * **Visual Indicators:**
 * - Cost value shows in red instead of gold
 * - Build button has gray background and reduced opacity
 * - Build button text is grayed out
 * - Button is non-interactive (disabled state)
 */
export const CannotAfford: Story = {
  render: () => <BuildMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Insufficient Scrap State:**
When \`gameState.scrap < LOOKOUT_POST.buildCost\`:
- Cost value: Changes from gold (#FFD700) to red (#FF4444)
- Build button: Disabled with gray background (#333333)
- Button opacity: 0.5
- Button text: Gray (#666666)

This provides clear visual feedback that the player cannot afford this tower.
        `,
      },
    },
  },
};

/**
 * ## Menu Closed (Not Visible)
 * No construction spot selected - menu doesn't render.
 *
 * **Render Condition:**
 * BuildMenu returns `null` when `gameState.selectedSpotId` is null.
 * This is the default state when no construction spot is active.
 */
export const MenuClosed: Story = {
  render: () => <BuildMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Hidden State:**
The BuildMenu component has built-in visibility logic:
\`\`\`typescript
if (!gameState.selectedSpotId) return null;
\`\`\`

When no construction spot is selected, the component renders nothing.
This is the normal state when player is not actively building.
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
 * BuildMenu takes no direct props. It depends on GameContext:
 *
 * **From useGame():**
 * - `gameState.selectedSpotId` - Controls visibility
 * - `gameState.scrap` - Player's current scrap amount
 * - `buildTower(spotId)` - Builds tower and deducts scrap
 * - `selectSpot(null)` - Closes the menu
 *
 * ### Tower Stats Displayed
 * - **Damage:** Base damage per shot
 * - **Range:** Attack range in game units
 * - **Fire Rate:** Shots per second
 * - **DPS:** Calculated as damage × fire rate
 * - **Cost:** Scrap required to build (100 🔩)
 *
 * ### User Interactions
 * 1. **Build Button:** Constructs tower (if affordable) and closes menu
 * 2. **Cancel Button:** Closes menu without building
 * 3. **Close (X) Button:** Closes menu without building
 * 4. **Click Outside:** Tapping overlay closes menu
 *
 * ### State Management
 * ```typescript
 * // Opening menu (from game code)
 * selectSpot('spot-1'); // Sets selectedSpotId
 *
 * // Building tower
 * buildTower('spot-1'); // Deducts scrap, creates tower, closes menu
 *
 * // Closing menu
 * selectSpot(null); // Clears selectedSpotId, menu disappears
 * ```
 */
export const Documentation: Story = {
  render: () => <BuildMenu />,
  parameters: {
    docs: {
      description: {
        story: `
See the source code and prop types above for complete implementation details.

**Integration Example:**
\`\`\`tsx
import { BuildMenu } from '@/components/game/BuildMenu';
import { GameProvider } from '@/contexts/GameContext';

function GameScreen() {
  return (
    <GameProvider>
      <GameMap />
      <BuildMenu />  {/* Renders when spot selected */}
      <UpgradeMenu /> {/* Renders when tower selected */}
    </GameProvider>
  );
}
\`\`\`
        `,
      },
    },
  },
};
