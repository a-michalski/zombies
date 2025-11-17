import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useRef, useState } from "react";

import { CONSTRUCTION_SPOTS, GAME_CONFIG } from "@/constants/gameConfig";
import { LOOKOUT_POST } from "@/constants/towers";
import {
  FloatingText,
  GameState,
  GameSessionConfig,
  Particle,
  Tower,
} from "@/types/game";
import { LevelConfig } from "@/types/levels";

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
};

export const [GameProvider, useGame] = createContextHook(() => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(null);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  const resetGame = useCallback(() => {
    setGameState(INITIAL_STATE);
    lastUpdateRef.current = Date.now();
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
      sessionConfig: {
        currentLevel: level,
        mode: 'campaign',
      },
    });
    lastUpdateRef.current = Date.now();
  }, []);

  const buildTower = useCallback((spotId: string) => {
    setGameState((prev) => {
      if (prev.scrap < LOOKOUT_POST.buildCost) return prev;
      
      const spot = CONSTRUCTION_SPOTS.find((s) => s.id === spotId);
      if (!spot) return prev;
      
      const existingTower = prev.towers.find((t) => t.spotId === spotId);
      if (existingTower) return prev;

      const newTower: Tower = {
        id: `tower_${Date.now()}`,
        spotId,
        position: { x: spot.x, y: spot.y },
        level: 1,
        lastFireTime: 0,
        targetEnemyId: null,
      };

      return {
        ...prev,
        scrap: prev.scrap - LOOKOUT_POST.buildCost,
        towers: [...prev.towers, newTower],
        selectedSpotId: null,
      };
    });
  }, []);

  const upgradeTower = useCallback((towerId: string) => {
    setGameState((prev) => {
      const tower = prev.towers.find((t) => t.id === towerId);
      if (!tower || tower.level >= 3) return prev;

      const nextLevel = LOOKOUT_POST.levels[tower.level];
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

      let invested = LOOKOUT_POST.buildCost;
      for (let i = 1; i < tower.level; i++) {
        const levelCost = LOOKOUT_POST.levels[i].upgradeCost;
        if (levelCost) invested += levelCost;
      }

      const sellValue = Math.floor(invested * LOOKOUT_POST.sellValueModifier);

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

  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      setGameState((prev) => {
        if (prev.isPaused) return prev;

        const dt = deltaTime * prev.gameSpeed;
        let newState = { ...prev };

        // Auto-start disabled - waves must be started manually
        // if (newState.phase === "between_waves") {
        //   newState.waveCountdown = Math.max(0, newState.waveCountdown - dt);
        //   
        //   if (newState.waveCountdown <= 0) {
        //     newState.phase = "playing";
        //   }
        // }

        newState.floatingTexts = newState.floatingTexts.filter(
          (ft) => now - ft.spawnTime < 1000
        );

        newState.particles = newState.particles.filter(
          (p) => (now - p.spawnTime) / 1000 < p.lifetime
        );

        return newState;
      });
    };

    gameLoopRef.current = setInterval(gameLoop, 1000 / 60);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

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
  };
});
