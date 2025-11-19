/**
 * Power-Ups System Types
 *
 * Strategic abilities players can use during gameplay:
 * - Nuke: Instantly kill all enemies on screen
 * - Time Freeze: Pause all enemies for duration
 * - Repair: Restore hull integrity
 */

export type PowerUpType = 'nuke' | 'timeFreeze' | 'repair';

export interface PowerUpConfig {
  /** Unique identifier */
  id: PowerUpType;

  /** Display name */
  name: string;

  /** Description for tooltip */
  description: string;

  /** Scrap cost to use */
  cost: number;

  /** Cooldown in seconds (0 = no cooldown, just cost) */
  cooldown: number;

  /** Icon emoji or name */
  icon: string;

  /** Color for UI theming */
  color: string;
}

export interface PowerUpState {
  /** Type of power-up */
  type: PowerUpType;

  /** Last time this power-up was used (timestamp) */
  lastUsedAt: number;

  /** Is currently on cooldown */
  isOnCooldown: boolean;

  /** Remaining cooldown in seconds */
  remainingCooldown: number;
}

export interface ActiveEffect {
  /** Unique ID for this effect instance */
  id: string;

  /** Type of power-up causing this effect */
  type: PowerUpType;

  /** When this effect started */
  startTime: number;

  /** Duration in seconds */
  duration: number;

  /** Effect-specific data */
  data?: any;
}
