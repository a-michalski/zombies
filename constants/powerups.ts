import { PowerUpConfig } from "@/types/powerups";

/**
 * Power-Up Configurations
 *
 * Balanced for strategic gameplay:
 * - Expensive but powerful
 * - Cooldowns prevent spam
 * - Risk/reward decisions
 */

export const NUKE: PowerUpConfig = {
  id: 'nuke',
  name: 'Nuclear Strike',
  description: 'Instantly eliminate ALL enemies on the battlefield. Devastating but expensive.',
  cost: 150,  // Very expensive - emergency button
  cooldown: 60, // 1 minute cooldown
  icon: '☢️',
  color: '#FF4444', // Red
};

export const TIME_FREEZE: PowerUpConfig = {
  id: 'timeFreeze',
  name: 'Time Freeze',
  description: 'Freeze all enemies for 10 seconds. Towers still fire normally.',
  cost: 100,
  cooldown: 45, // 45 second cooldown
  icon: '⏸️',
  color: '#2196F3', // Blue
};

export const REPAIR: PowerUpConfig = {
  id: 'repair',
  name: 'Emergency Repair',
  description: 'Restore 50% of your hull integrity. Cannot exceed max hull.',
  cost: 120,
  cooldown: 30, // 30 second cooldown
  icon: '🔧',
  color: '#4CAF50', // Green
};

export const POWER_UPS: Record<string, PowerUpConfig> = {
  nuke: NUKE,
  timeFreeze: TIME_FREEZE,
  repair: REPAIR,
};

export const POWER_UP_CONFIGS = [NUKE, TIME_FREEZE, REPAIR];

/**
 * Time Freeze effect duration (in seconds)
 */
export const TIME_FREEZE_DURATION = 10;

/**
 * Repair restoration percentage (0.5 = 50%)
 */
export const REPAIR_PERCENTAGE = 0.5;
