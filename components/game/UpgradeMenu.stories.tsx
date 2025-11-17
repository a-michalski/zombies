import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { UpgradeMenu } from './UpgradeMenu';

/**
 * # UpgradeMenu Component
 *
 * Modal menu for upgrading or selling existing towers.
 * Shows current stats, upgrade preview, costs, and sell value.
 *
 * ## Features
 * - Displays current tower level and statistics
 * - Shows upgrade preview with stat improvements (green highlighting)
 * - Upgrade button disabled if player cannot afford
 * - Sell button shows calculated sell value (70% of invested cost)
 * - Max level badge for fully upgraded towers (level 3)
 * - Dismissible by clicking outside, close button, or cancel button
 * - Only renders when a tower is selected
 *
 * ## Tower Levels
 * - **Level 1:** Basic tower (newly built)
 * - **Level 2:** Upgraded once (improved stats)
 * - **Level 3:** Max level (⭐ MAX LEVEL ⭐ badge)
 *
 * ## Dependencies
 * Requires GameProvider context for:
 * - gameState.selectedTowerId (determines if menu is visible)
 * - gameState.towers (finds selected tower)
 * - gameState.scrap (current player resources)
 * - upgradeTower(towerId) callback
 * - sellTower(towerId) callback
 * - selectTower(null) callback to close menu
 */
const meta = {
  title: 'Game/UpgradeMenu',
  component: UpgradeMenu,
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
} satisfies Meta<typeof UpgradeMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Level 1 Tower - Can Afford Upgrade
 * Basic tower with upgrade available.
 *
 * **Upgrade Preview:**
 * - Shows stat increases in green
 * - Displays upgrade cost
 * - Upgrade button enabled (green background)
 *
 * **Sell Value:**
 * - Calculated as build cost × 70% sell modifier
 * - For new tower: 100 × 0.7 = 70 scrap
 */
export const Level1CanAfford: Story = {
  render: () => <UpgradeMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Level 1 → Level 2 Upgrade:**
Shows current stats vs. improved stats after upgrade.
Green highlighting indicates stat improvements.

**Upgrade Cost:** Displayed with scrap icon (🔩)
**Sell Value:** 70% of build cost (100 × 0.7 = 70)

Note: Menu requires \`gameState.selectedTowerId\` and matching tower in \`gameState.towers\`.
        `,
      },
    },
  },
};

/**
 * ## Level 1 Tower - Cannot Afford Upgrade
 * Player doesn't have enough scrap to upgrade.
 *
 * **Visual Indicators:**
 * - Upgrade button disabled (gray background, reduced opacity)
 * - Button text grayed out
 * - Upgrade cost still displayed (shows how much is needed)
 * - Sell button remains enabled
 */
export const Level1CannotAfford: Story = {
  render: () => <UpgradeMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Insufficient Scrap:**
When \`gameState.scrap < upgradeCost\`:
- Upgrade button: Gray background (#333333), opacity 0.5
- Button text: Gray (#666666)
- Button is non-interactive (disabled)

Player can still sell the tower for 70 scrap.
        `,
      },
    },
  },
};

/**
 * ## Level 2 Tower - Mid-Tier
 * Tower upgraded once, can upgrade to level 3.
 *
 * **Investment:**
 * - Build cost: 100 scrap
 * - Level 2 upgrade cost: 150 scrap
 * - Total invested: 250 scrap
 * - Sell value: 250 × 0.7 = 175 scrap
 *
 * **Next Upgrade:**
 * - To level 3 (max level)
 * - Increased cost for final upgrade
 */
export const Level2: Story = {
  render: () => <UpgradeMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Mid-Tier Tower:**
Shows tower at level 2 with option to upgrade to max level (3).

**Stats Progression:**
Each level significantly improves:
- Damage
- Range
- Fire Rate
- DPS (calculated: damage × fire rate)

**Sell Value:** 70% of total investment (build + all upgrades)
        `,
      },
    },
  },
};

/**
 * ## Level 3 Tower - Max Level
 * Fully upgraded tower with no further upgrades available.
 *
 * **Special Features:**
 * - **⭐ MAX LEVEL ⭐** badge (gold background)
 * - No upgrade button shown
 * - No "Upgrade to Level X" section
 * - Only displays current stats
 *
 * **Maximum Stats:**
 * - Highest damage, range, and fire rate
 * - Best DPS performance
 * - Cannot be upgraded further
 */
export const Level3MaxLevel: Story = {
  render: () => <UpgradeMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Max Level Tower:**
When \`tower.level === 3\`:
- No upgrade preview shown
- Gold "MAX LEVEL" badge displayed
- Only sell and close buttons available

**Investment:**
- Build: 100 scrap
- Level 2: 150 scrap
- Level 3: 250 scrap
- **Total:** 500 scrap
- **Sell value:** 500 × 0.7 = 350 scrap
        `,
      },
    },
  },
};

/**
 * ## Menu Closed (Not Visible)
 * No tower selected - menu doesn't render.
 *
 * **Render Condition:**
 * UpgradeMenu returns `null` when no tower is found with `gameState.selectedTowerId`.
 * This is the default state when no tower is active.
 */
export const MenuClosed: Story = {
  render: () => <UpgradeMenu />,
  parameters: {
    docs: {
      description: {
        story: `
**Hidden State:**
The UpgradeMenu component has built-in visibility logic:
\`\`\`typescript
const tower = gameState.towers.find(t => t.id === gameState.selectedTowerId);
if (!tower) return null;
\`\`\`

When no tower is selected, the component renders nothing.
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
 * UpgradeMenu takes no direct props. It depends on GameContext:
 *
 * **From useGame():**
 * - `gameState.selectedTowerId` - Controls visibility
 * - `gameState.towers` - Array of all towers (finds selected tower)
 * - `gameState.scrap` - Player's current scrap amount
 * - `upgradeTower(towerId)` - Upgrades tower and deducts scrap
 * - `sellTower(towerId)` - Sells tower for 70% refund
 * - `selectTower(null)` - Closes the menu
 *
 * ### Tower Statistics
 * - **Damage:** Base damage per shot
 * - **Range:** Attack range in game units
 * - **Fire Rate:** Shots per second
 * - **DPS:** Damage per second (damage × fire rate)
 *
 * ### Upgrade System
 * **Level Progression:**
 * 1. **Level 1 → 2:** First upgrade (moderate cost)
 * 2. **Level 2 → 3:** Final upgrade (highest cost)
 * 3. **Level 3:** Max level (no further upgrades)
 *
 * **Cost Formula:**
 * - Build cost: Fixed (100 scrap)
 * - Upgrade costs increase per level
 * - Total investment accumulates
 *
 * **Sell Value Formula:**
 * ```typescript
 * let invested = LOOKOUT_POST.buildCost; // 100
 * for (let i = 1; i < tower.level; i++) {
 *   invested += LOOKOUT_POST.levels[i].upgradeCost;
 * }
 * const sellValue = Math.floor(invested * 0.7); // 70% refund
 * ```
 *
 * ### User Interactions
 * 1. **Upgrade Button:** Upgrades tower (if affordable) and deducts scrap
 * 2. **Sell Button:** Sells tower, refunds 70% of invested scrap, closes menu
 * 3. **Close Button:** Closes menu without changes
 * 4. **Close (X) Button:** Closes menu without changes
 * 5. **Click Outside:** Tapping overlay closes menu
 *
 * ### Visual Indicators
 * **Current Stats:** Dark background (#1a1a1a)
 * **Upgrade Preview:** Green-tinted background (#1a3a1a) with green border
 * **Upgrade Values:** Green text (#4CAF50) showing improvements
 * **Max Level Badge:** Gold background (#FFD700) with dark text
 * **Disabled Button:** Gray with reduced opacity
 *
 * ### State Management
 * ```typescript
 * // Opening menu (from game code)
 * selectTower('tower_123'); // Sets selectedTowerId
 *
 * // Upgrading tower
 * upgradeTower('tower_123'); // Deducts scrap, increases level
 *
 * // Selling tower
 * sellTower('tower_123'); // Refunds scrap, removes tower, closes menu
 *
 * // Closing menu
 * selectTower(null); // Clears selectedTowerId, menu disappears
 * ```
 */
export const Documentation: Story = {
  render: () => <UpgradeMenu />,
  parameters: {
    docs: {
      description: {
        story: `
See the source code and implementation details above.

**Integration Example:**
\`\`\`tsx
import { UpgradeMenu } from '@/components/game/UpgradeMenu';
import { GameProvider } from '@/contexts/GameContext';

function GameScreen() {
  return (
    <GameProvider>
      <GameMap />
      <BuildMenu />    {/* Renders when spot selected */}
      <UpgradeMenu />  {/* Renders when tower selected */}
      <PauseMenu />    {/* Renders when paused */}
    </GameProvider>
  );
}
\`\`\`
        `,
      },
    },
  },
};
