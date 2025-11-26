import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useRef, useState } from "react";

import { CONSTRUCTION_SPOTS, GAME_CONFIG } from "@/constants/gameConfig";
import { LOOKOUT_POST, CANNON_TOWER } from "@/constants/towers";
import { POWER_UP_CONFIGS, TIME_FREEZE_DURATION, REPAIR_PERCENTAGE } from "@/constants/powerups";
import {
  FloatingText,
  GameState,
  GameSessionConfig,
  Particle,
  Tower,
} from "@/types/game";
import { LevelConfig } from "@/types/levels";
import { PowerUpType } from "@/types/powerups";

const INITIAL_STATE: GameState = {
  phase: "between_waves",
  currentWave: 1,
  scrap: GAME_CONFIG.STARTING_SCRAP,
  hullIntegrity: GAME_CONFIG.STARTING_HULL,
  isPaused: false,
  gameSpeed: 1,
  waveCountdown: GAME_CONFIG.AUTO_START_DELAY,

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

  powerUps: POWER_UP_CONFIGS.map(config => ({
    type: config.id,
    lastUsedAt: 0,
    isOnCooldown: false,
    remainingCooldown: 0,
  })),

  activeEffects: [],
};

export const [GameProvider, useGame] = createContextHook(() => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
  }, []);

  /**
   * Start a campaign level with dynamic configuration
   * @param level - The level configuration to load
   */
  const startCampaignLevel = useCallback((level: LevelConfig) => {
    setCurrentLevel(level);

    // Initialize game with level's config
    setGameState({
      phase: 'between_waves',
      currentWave: 1,
      scrap: level.mapConfig.startingResources.scrap,
      hullIntegrity: level.mapConfig.startingResources.hullIntegrity,
      isPaused: false,
      gameSpeed: 1,
      waveCountdown: GAME_CONFIG.AUTO_START_DELAY,
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
      powerUps: POWER_UP_CONFIGS.map(config => ({
        type: config.id,
        lastUsedAt: 0,
        isOnCooldown: false,
        remainingCooldown: 0,
      })),
      activeEffects: [],
      sessionConfig: {
        currentLevel: level,
        mode: 'campaign',
      },
    });
  }, []);

  const buildTower = useCallback((spotId: string, towerType: "tower_lookout_post" | "tower_cannon" = "tower_lookout_post") => {
    setGameState((prev) => {
      const towerConfig = towerType === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST;

      if (prev.scrap < towerConfig.buildCost) return prev;

      const spot = CONSTRUCTION_SPOTS.find((s) => s.id === spotId);
      if (!spot) return prev;

      const existingTower = prev.towers.find((t) => t.spotId === spotId);
      if (existingTower) return prev;

      const newTower: Tower = {
        id: `tower_${Date.now()}`,
        type: towerType,
        spotId,
        position: { x: spot.x, y: spot.y },
        level: 1,
        lastFireTime: 0,
        targetEnemyId: null,
      };

      return {
        ...prev,
        scrap: prev.scrap - towerConfig.buildCost,
        towers: [...prev.towers, newTower],
        selectedSpotId: null,
      };
    });
  }, []);

  const upgradeTower = useCallback((towerId: string) => {
    setGameState((prev) => {
      const tower = prev.towers.find((t) => t.id === towerId);
      if (!tower || tower.level >= 3) return prev;

      const towerConfig = tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST;
      const nextLevel = towerConfig.levels[tower.level];
      const upgradeCost = nextLevel.upgradeCost;

      if (!upgradeCost || prev.scrap < upgradeCost) return prev;

      return {
        ...prev,
        scrap: prev.scrap - upgradeCost,
        towers: prev.towers.map((t) =>
          t.id === towerId ? { ...t, level: t.level + 1 } : t
        ),
      };
    });
  }, []);

  const sellTower = useCallback((towerId: string) => {
    setGameState((prev) => {
      const tower = prev.towers.find((t) => t.id === towerId);
      if (!tower) return prev;

      const towerConfig = tower.type === "tower_cannon" ? CANNON_TOWER : LOOKOUT_POST;

      let invested = towerConfig.buildCost;
      for (let i = 1; i < tower.level; i++) {
        const levelCost = towerConfig.levels[i].upgradeCost;
        if (levelCost) invested += levelCost;
      }

      const sellValue = Math.floor(invested * towerConfig.sellValueModifier);

      return {
        ...prev,
        scrap: prev.scrap + sellValue,
        towers: prev.towers.filter((t) => t.id !== towerId),
        selectedTowerId: null,
      };
    });
  }, []);

  const startWave = useCallback((manual: boolean = false) => {
    setGameState((prev) => {
      if (prev.phase !== "between_waves") return prev;

      const bonus = manual ? GAME_CONFIG.MANUAL_START_BONUS : 0;

      return {
        ...prev,
        phase: "playing",
        scrap: prev.scrap + bonus,
        waveCountdown: 0,
      };
    });
  }, []);

  const selectSpot = useCallback((spotId: string | null) => {
    setGameState((prev) => ({
      ...prev,
      selectedSpotId: spotId,
      selectedTowerId: null,
    }));
  }, []);

  const selectTower = useCallback((towerId: string | null) => {
    setGameState((prev) => ({
      ...prev,
      selectedTowerId: towerId,
      selectedSpotId: null,
    }));
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const toggleSpeed = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      gameSpeed: prev.gameSpeed === 1 ? 2 : 1,
    }));
  }, []);

  const addFloatingText = useCallback(
    (text: string, x: number, y: number, color: string) => {
      const floatingText: FloatingText = {
        id: `text_${Date.now()}_${Math.random()}`,
        text,
        position: { x, y },
        color,
        spawnTime: Date.now(),
      };

      setGameState((prev) => ({
        ...prev,
        floatingTexts: [...prev.floatingTexts, floatingText],
      }));
    },
    []
  );

  const addParticles = useCallback(
    (x: number, y: number, color: string, count: number) => {
      const newParticles: Particle[] = [];
      const now = Date.now();

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 2;
        
        newParticles.push({
          id: `particle_${now}_${i}`,
          position: { x, y },
          velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
          },
          color,
          size: 4 + Math.random() * 4,
          lifetime: 0.5 + Math.random() * 0.5,
          spawnTime: now,
        });
      }

      setGameState((prev) => ({
        ...prev,
        particles: [...prev.particles, ...newParticles],
      }));
    },
    []
  );

  /**
   * Use a power-up
   * Checks cost and cooldown before activating
   */
  const usePowerUp = useCallback((powerUpType: PowerUpType) => {
    setGameState((prev) => {
      const powerUpConfig = POWER_UP_CONFIGS.find(p => p.id === powerUpType);
      if (!powerUpConfig) return prev;

      // Check if enough scrap
      if (prev.scrap < powerUpConfig.cost) {
        addFloatingText("Not enough scrap!", 10, 2, "#FF4444");
        return prev;
      }

      // Check cooldown
      const powerUpState = prev.powerUps.find(p => p.type === powerUpType);
      if (powerUpState?.isOnCooldown) {
        addFloatingText(`On cooldown: ${Math.ceil(powerUpState.remainingCooldown)}s`, 10, 2, "#FF9800");
        return prev;
      }

      const now = Date.now();
      let newState = { ...prev };

      // Deduct cost
      newState.scrap -= powerUpConfig.cost;

      // Apply power-up effect
      switch (powerUpType) {
        case 'nuke':
          // Kill all enemies
          const killedCount = newState.enemies.length;
          const scrapGained = newState.enemies.reduce((sum, enemy) => {
            const config = require("@/constants/enemies").ENEMY_CONFIGS[enemy.type];
            return sum + config.scrapReward;
          }, 0);

          newState.enemies = [];
          newState.scrap += scrapGained;
          newState.stats.zombiesKilled += killedCount;

          addFloatingText(`☢️ NUCLEAR STRIKE! +${scrapGained} scrap`, 10, 6, "#FF4444");
          addParticles(10, 6, "#FF4444", 30);
          break;

        case 'timeFreeze':
          // Add time freeze effect
          newState.activeEffects.push({
            id: `freeze_${now}`,
            type: 'timeFreeze',
            startTime: now,
            duration: TIME_FREEZE_DURATION,
          });

          addFloatingText(`⏸️ TIME FREEZE: ${TIME_FREEZE_DURATION}s`, 10, 6, "#2196F3");
          addParticles(10, 6, "#2196F3", 20);
          break;

        case 'repair':
          // Restore hull
          const maxHull = newState.sessionConfig?.currentLevel?.mapConfig.startingResources.hullIntegrity || GAME_CONFIG.STARTING_HULL;
          const repairAmount = Math.floor(maxHull * REPAIR_PERCENTAGE);
          const actualRepair = Math.min(repairAmount, maxHull - newState.hullIntegrity);

          newState.hullIntegrity = Math.min(newState.hullIntegrity + repairAmount, maxHull);

          addFloatingText(`🔧 REPAIRED: +${actualRepair} hull`, 10, 6, "#4CAF50");
          addParticles(10, 6, "#4CAF50", 25);
          break;
      }

      // Set cooldown
      newState.powerUps = newState.powerUps.map(p =>
        p.type === powerUpType
          ? { ...p, lastUsedAt: now, isOnCooldown: true, remainingCooldown: powerUpConfig.cooldown }
          : p
      );

      return newState;
    });
  }, [addFloatingText, addParticles]);

  // Game loop moved to useGameEngine hook to avoid duplicate loops
  // All game logic (enemies, towers, projectiles, power-ups, effects, particles) 
  // is now handled in a single 60 FPS loop

  return {
    gameState,
    setGameState,
    currentLevel,
    resetGame,
    startCampaignLevel,
    buildTower,
    upgradeTower,
    sellTower,
    startWave,
    selectSpot,
    selectTower,
    togglePause,
    toggleSpeed,
    addFloatingText,
    addParticles,
    usePowerUp,
  };
});
