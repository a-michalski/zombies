/**
 * Mock Context Providers for Storybook
 * Provides mock implementations of GameContext and other providers
 */

import React, { ReactNode, useState } from 'react';
import { GameState } from '@/types/game';
import { LevelConfig } from '@/types/levels';
import { MOCK_GAME_STATE_BETWEEN_WAVES } from './gameMocks';

/**
 * Mock GameContext value
 */
export interface MockGameContextValue {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  currentLevel: LevelConfig | null;
  resetGame: () => void;
  startCampaignLevel: (level: LevelConfig) => void;
  buildTower: (spotId: string) => void;
  upgradeTower: (towerId: string) => void;
  sellTower: (towerId: string) => void;
  startWave: (manual?: boolean) => void;
  selectSpot: (spotId: string | null) => void;
  selectTower: (towerId: string | null) => void;
  togglePause: () => void;
  toggleSpeed: () => void;
  addFloatingText: (text: string, x: number, y: number, color: string) => void;
  addParticles: (x: number, y: number, color: string, count: number) => void;
}

/**
 * Props for MockGameProvider
 */
interface MockGameProviderProps {
  children: ReactNode;
  initialState?: Partial<GameState>;
}

/**
 * Mock GameProvider for Storybook stories
 * Provides a simplified GameContext that works without the full game engine
 */
export const MockGameProvider: React.FC<MockGameProviderProps> = ({
  children,
  initialState = {},
}) => {
  const [gameState, setGameState] = useState<GameState>({
    ...MOCK_GAME_STATE_BETWEEN_WAVES,
    ...initialState,
  });

  const [currentLevel, setCurrentLevel] = useState<LevelConfig | null>(
    gameState.sessionConfig?.currentLevel || null
  );

  // Mock functions with console logging for debugging in Storybook
  const mockContextValue: MockGameContextValue = {
    gameState,
    setGameState,
    currentLevel,

    resetGame: () => {
      console.log('[MockGameContext] resetGame called');
      setGameState(MOCK_GAME_STATE_BETWEEN_WAVES);
    },

    startCampaignLevel: (level: LevelConfig) => {
      console.log('[MockGameContext] startCampaignLevel:', level.name);
      setCurrentLevel(level);
      setGameState((prev) => ({
        ...prev,
        sessionConfig: {
          currentLevel: level,
          mode: 'campaign',
        },
      }));
    },

    buildTower: (spotId: string) => {
      console.log('[MockGameContext] buildTower:', spotId);
      setGameState((prev) => ({
        ...prev,
        selectedSpotId: null,
      }));
    },

    upgradeTower: (towerId: string) => {
      console.log('[MockGameContext] upgradeTower:', towerId);
    },

    sellTower: (towerId: string) => {
      console.log('[MockGameContext] sellTower:', towerId);
      setGameState((prev) => ({
        ...prev,
        selectedTowerId: null,
      }));
    },

    startWave: (manual = false) => {
      console.log('[MockGameContext] startWave, manual:', manual);
      setGameState((prev) => ({
        ...prev,
        phase: 'playing',
      }));
    },

    selectSpot: (spotId: string | null) => {
      console.log('[MockGameContext] selectSpot:', spotId);
      setGameState((prev) => ({
        ...prev,
        selectedSpotId: spotId,
        selectedTowerId: null,
      }));
    },

    selectTower: (towerId: string | null) => {
      console.log('[MockGameContext] selectTower:', towerId);
      setGameState((prev) => ({
        ...prev,
        selectedTowerId: towerId,
        selectedSpotId: null,
      }));
    },

    togglePause: () => {
      console.log('[MockGameContext] togglePause');
      setGameState((prev) => ({
        ...prev,
        isPaused: !prev.isPaused,
      }));
    },

    toggleSpeed: () => {
      console.log('[MockGameContext] toggleSpeed');
      setGameState((prev) => ({
        ...prev,
        gameSpeed: prev.gameSpeed === 1 ? 2 : 1,
      }));
    },

    addFloatingText: (text: string, x: number, y: number, color: string) => {
      console.log('[MockGameContext] addFloatingText:', text, x, y, color);
    },

    addParticles: (x: number, y: number, color: string, count: number) => {
      console.log('[MockGameContext] addParticles:', x, y, color, count);
    },
  };

  // Create a mock context (we don't have access to the real GameContext here)
  // Stories will use this provider directly
  return <>{children}</>;
};

/**
 * Mock router for expo-router navigation
 * Prevents errors when components use useRouter()
 */
export const mockRouter = {
  push: (path: string) => {
    console.log('[MockRouter] push:', path);
  },
  back: () => {
    console.log('[MockRouter] back');
  },
  replace: (path: string) => {
    console.log('[MockRouter] replace:', path);
  },
  canGoBack: () => true,
};

/**
 * Helper to create mock router context
 */
export const MockRouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // This is a simplified mock - actual implementation would use expo-router's context
  return <>{children}</>;
};
