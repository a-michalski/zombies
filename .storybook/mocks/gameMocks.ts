/**
 * Mock data for game state and entities
 * Used in Storybook stories for game components
 */

import { GameState, Enemy, Tower, Projectile } from '@/types/game';
import { MOCK_LEVEL_01 } from './levelMocks';

/**
 * Mock Tower - Level 1
 */
export const MOCK_TOWER_LEVEL_1: Tower = {
  id: 'tower-1',
  spotId: 'spot-1',
  position: { x: 100, y: 100 },
  level: 1,
  lastFireTime: 0,
  targetEnemyId: null,
};

/**
 * Mock Tower - Level 2
 */
export const MOCK_TOWER_LEVEL_2: Tower = {
  id: 'tower-2',
  spotId: 'spot-2',
  position: { x: 200, y: 100 },
  level: 2,
  lastFireTime: 0,
  targetEnemyId: null,
};

/**
 * Mock Tower - Level 3 (Max)
 */
export const MOCK_TOWER_LEVEL_3: Tower = {
  id: 'tower-3',
  spotId: 'spot-3',
  position: { x: 300, y: 100 },
  level: 3,
  lastFireTime: 0,
  targetEnemyId: null,
};

/**
 * Mock Enemy - Shambler (full health)
 */
export const MOCK_ENEMY_SHAMBLER: Enemy = {
  id: 'enemy-1',
  type: 'shambler',
  health: 20,
  maxHealth: 20,
  position: { x: 50, y: 50 },
  pathProgress: 0,
  waypointIndex: 0,
};

/**
 * Mock Enemy - Runner (damaged)
 */
export const MOCK_ENEMY_RUNNER: Enemy = {
  id: 'enemy-2',
  type: 'runner',
  health: 5,
  maxHealth: 10,
  position: { x: 100, y: 50 },
  pathProgress: 0.5,
  waypointIndex: 1,
};

/**
 * Mock Enemy - Brute (full health)
 */
export const MOCK_ENEMY_BRUTE: Enemy = {
  id: 'enemy-3',
  type: 'brute',
  health: 50,
  maxHealth: 50,
  position: { x: 150, y: 100 },
  pathProgress: 0.3,
  waypointIndex: 2,
};

/**
 * Mock Projectile
 */
export const MOCK_PROJECTILE: Projectile = {
  id: 'projectile-1',
  towerId: 'tower-1',
  position: { x: 100, y: 100 },
  targetPosition: { x: 150, y: 150 },
  targetEnemyId: 'enemy-1',
  damage: 10,
  spawnTime: Date.now(),
};

/**
 * Base GameState - Between Waves (default state)
 */
export const MOCK_GAME_STATE_BETWEEN_WAVES: GameState = {
  phase: 'between_waves',
  currentWave: 1,
  scrap: 100,
  hullIntegrity: 100,
  isPaused: false,
  gameSpeed: 1,
  waveCountdown: 10,
  enemies: [],
  towers: [],
  projectiles: [],
  floatingTexts: [],
  particles: [],
  selectedSpotId: null,
  selectedTowerId: null,
  stats: {
    zombiesKilled: 0,
    totalDamageDealt: 0,
  },
  sessionConfig: {
    currentLevel: MOCK_LEVEL_01,
    mode: 'campaign',
  },
};

/**
 * GameState - Playing (active wave)
 */
export const MOCK_GAME_STATE_PLAYING: GameState = {
  ...MOCK_GAME_STATE_BETWEEN_WAVES,
  phase: 'playing',
  currentWave: 3,
  scrap: 50,
  hullIntegrity: 75,
  enemies: [MOCK_ENEMY_SHAMBLER, MOCK_ENEMY_RUNNER],
  towers: [MOCK_TOWER_LEVEL_1, MOCK_TOWER_LEVEL_2],
  projectiles: [MOCK_PROJECTILE],
  stats: {
    zombiesKilled: 15,
    totalDamageDealt: 300,
  },
};

/**
 * GameState - Low resources (can't afford towers)
 */
export const MOCK_GAME_STATE_LOW_SCRAP: GameState = {
  ...MOCK_GAME_STATE_BETWEEN_WAVES,
  scrap: 10,
  hullIntegrity: 50,
  towers: [MOCK_TOWER_LEVEL_1],
};

/**
 * GameState - High resources (can afford everything)
 */
export const MOCK_GAME_STATE_HIGH_SCRAP: GameState = {
  ...MOCK_GAME_STATE_BETWEEN_WAVES,
  scrap: 500,
  hullIntegrity: 100,
  towers: [MOCK_TOWER_LEVEL_1, MOCK_TOWER_LEVEL_2],
};

/**
 * GameState - Victory
 */
export const MOCK_GAME_STATE_VICTORY: GameState = {
  ...MOCK_GAME_STATE_BETWEEN_WAVES,
  phase: 'victory',
  currentWave: 10,
  scrap: 200,
  hullIntegrity: 85,
  stats: {
    zombiesKilled: 100,
    totalDamageDealt: 2000,
  },
};

/**
 * GameState - Defeat
 */
export const MOCK_GAME_STATE_DEFEAT: GameState = {
  ...MOCK_GAME_STATE_BETWEEN_WAVES,
  phase: 'defeat',
  currentWave: 5,
  scrap: 0,
  hullIntegrity: 0,
  enemies: [MOCK_ENEMY_BRUTE],
  stats: {
    zombiesKilled: 42,
    totalDamageDealt: 850,
  },
};

/**
 * GameState - With selected tower
 */
export const MOCK_GAME_STATE_TOWER_SELECTED: GameState = {
  ...MOCK_GAME_STATE_HIGH_SCRAP,
  selectedTowerId: 'tower-1',
  towers: [MOCK_TOWER_LEVEL_1],
};

/**
 * GameState - With selected spot
 */
export const MOCK_GAME_STATE_SPOT_SELECTED: GameState = {
  ...MOCK_GAME_STATE_HIGH_SCRAP,
  selectedSpotId: 'spot-1',
};

/**
 * GameState - Paused
 */
export const MOCK_GAME_STATE_PAUSED: GameState = {
  ...MOCK_GAME_STATE_PLAYING,
  isPaused: true,
};

/**
 * GameState - Fast speed
 */
export const MOCK_GAME_STATE_FAST_SPEED: GameState = {
  ...MOCK_GAME_STATE_PLAYING,
  gameSpeed: 2,
};
