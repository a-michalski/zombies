import { EnemyType } from "@/constants/enemies";
import { LevelConfig } from './levels';
import { PowerUpState, ActiveEffect } from './powerups';

export interface Position {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  health: number;
  maxHealth: number;
  position: Position;
  pathProgress: number;
  waypointIndex: number;
}

export interface Tower {
  id: string;
  type: "tower_lookout_post" | "tower_cannon";
  spotId: string;
  position: Position;
  level: number;
  lastFireTime: number;
  targetEnemyId: string | null;
}

export interface Projectile {
  id: string;
  towerId: string;
  towerType: "tower_lookout_post" | "tower_cannon";
  position: Position;
  targetPosition: Position;
  targetEnemyId: string;
  damage: number;
  spawnTime: number;
}

export interface FloatingText {
  id: string;
  text: string;
  position: Position;
  color: string;
  spawnTime: number;
}

export interface Particle {
  id: string;
  position: Position;
  velocity: Position;
  color: string;
  size: number;
  lifetime: number;
  spawnTime: number;
}

export type GamePhase = "menu" | "playing" | "between_waves" | "victory" | "defeat";

/**
 * Game session configuration
 * Determines whether playing campaign mode or classic/freeplay mode
 */
export interface GameSessionConfig {
  /** Optional: Level being played (null for classic/freeplay mode) */
  currentLevel: LevelConfig | null;

  /** Whether this is campaign mode or classic mode */
  mode: 'campaign' | 'classic';
}

export interface GameState {
  phase: GamePhase;
  currentWave: number;
  scrap: number;
  hullIntegrity: number;
  isPaused: boolean;
  gameSpeed: 1 | 2;
  waveCountdown: number;

  enemies: Enemy[];
  towers: Tower[];
  projectiles: Projectile[];
  floatingTexts: FloatingText[];
  particles: Particle[];

  selectedSpotId: string | null;
  selectedTowerId: string | null;

  stats: {
    zombiesKilled: number;
    totalDamageDealt: number;
  };

  /** Current session configuration (campaign vs classic mode) */
  sessionConfig?: GameSessionConfig;

  /** Power-up cooldown states */
  powerUps: PowerUpState[];

  /** Active power-up effects (e.g., time freeze is currently active) */
  activeEffects: ActiveEffect[];
}
