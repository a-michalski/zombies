/**
 * Campaign Context - Manages player progression and level unlocking
 *
 * Created: 2025-11-16 (PHASE-006)
 *
 * Responsibilities:
 * - Track player progress (unlocked levels, stars)
 * - Handle level completion and unlocking
 * - Provide campaign state to UI components
 *
 * Storage integration: See Agent G (PHASE-007)
 */

import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useState, useEffect } from "react";

import { PlayerProgress, LevelProgress, CampaignSaveData } from "@/types/progression";
import { LevelConfig } from "@/types/levels";
import { ALL_LEVELS } from "@/data/maps";
import {
  loadCampaignProgress,
  saveCampaignProgress,
  createInitialCampaignData,
} from "@/utils/storage";

/**
 * Statistics provided when a level is completed
 * Used to track performance and calculate rewards
 */
export interface LevelCompletionStats {
  /** Total zombies killed during the level */
  zombiesKilled: number;

  /** Number of waves completed */
  wavesCompleted: number;

  /** Final hull integrity percentage (0-100) */
  finalHullIntegrity: number;

  /** Time taken to complete the level in seconds */
  timeTaken: number;

  /** Total scrap earned during the level */
  scrapEarned: number;
}

/**
 * Initial player progress state
 * First level is unlocked by default
 */
const initialPlayerProgress: PlayerProgress = {
  currentCampaignId: 'main-campaign',
  currentLevel: 1,
  unlockedLevels: ['level-01'], // First level unlocked by default
  levelProgress: {},
  totalStars: 0,
  totalScrapEarned: 0,
};

/**
 * Campaign Context Provider
 * Manages player progression, level unlocking, and campaign state
 */
export const [CampaignProvider, useCampaignContext] = createContextHook(() => {
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(initialPlayerProgress);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Load saved campaign progress on mount
   * If no save data exists, initialize with default state
   */
  useEffect(() => {
    const loadSavedProgress = async () => {
      setIsLoading(true);
      try {
        const savedData = await loadCampaignProgress();
        if (savedData) {
          setPlayerProgress(savedData.playerProgress);
        } else {
          // First launch - use initial state
          const initialData = createInitialCampaignData();
          setPlayerProgress(initialData.playerProgress);
        }
      } catch (error) {
        console.error('Failed to load campaign progress:', error);
        // Fallback to initial state on error
        const initialData = createInitialCampaignData();
        setPlayerProgress(initialData.playerProgress);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProgress();
  }, []); // Run only once on mount

  /**
   * Auto-save campaign progress whenever it changes
   */
  useEffect(() => {
    // Skip saving on initial mount (handled by load effect)
    if (isLoading) return;

    const saveData: CampaignSaveData = {
      playerProgress,
      version: 1,
      lastUpdated: Date.now(),
    };

    saveCampaignProgress(saveData).catch((error) => {
      console.error('Failed to auto-save campaign progress:', error);
    });
  }, [playerProgress, isLoading]);

  /**
   * Check if a level is unlocked
   * @param levelId - The level ID to check (e.g., 'level-01')
   * @returns true if level is unlocked, false otherwise
   */
  const isLevelUnlocked = useCallback((levelId: string): boolean => {
    return playerProgress.unlockedLevels.includes(levelId);
  }, [playerProgress.unlockedLevels]);

  /**
   * Get progress data for a specific level
   * @param levelId - The level ID to get progress for
   * @returns LevelProgress object or null if no progress exists
   */
  const getLevelProgress = useCallback((levelId: string): LevelProgress | null => {
    return playerProgress.levelProgress[levelId] || null;
  }, [playerProgress.levelProgress]);

  /**
   * Get the next level in the campaign sequence
   * @param currentLevelId - The current level ID
   * @returns Next LevelConfig or null if current level is the last
   */
  const getNextLevel = useCallback((currentLevelId: string): LevelConfig | null => {
    const currentIndex = ALL_LEVELS.findIndex(level => level.id === currentLevelId);

    if (currentIndex === -1 || currentIndex === ALL_LEVELS.length - 1) {
      return null;
    }

    return ALL_LEVELS[currentIndex + 1];
  }, []);

  /**
   * Calculate total stars from all level progress
   * @returns Total stars earned across all levels
   */
  const calculateTotalStars = useCallback((): number => {
    return Object.values(playerProgress.levelProgress).reduce(
      (sum, progress) => sum + progress.starsEarned,
      0
    );
  }, [playerProgress.levelProgress]);

  /**
   * Mark a level as completed and update progress
   * Also handles automatic unlocking of next level if requirements are met
   *
   * @param levelId - The level ID that was completed
   * @param starsEarned - Number of stars earned (1-3)
   * @param stats - Completion statistics
   */
  const completeLevel = useCallback((
    levelId: string,
    starsEarned: number,
    stats: LevelCompletionStats
  ): void => {
    setPlayerProgress(prev => {
      // Get current progress or create new entry
      const currentProgress = prev.levelProgress[levelId];
      const isFirstCompletion = !currentProgress || !currentProgress.completed;

      // Find the level config to get total waves
      const levelConfig = ALL_LEVELS.find(level => level.id === levelId);
      const totalWaves = levelConfig?.mapConfig.waves.length || stats.wavesCompleted;

      // Create/update level progress
      const updatedLevelProgress: LevelProgress = {
        levelId,
        completed: true,
        starsEarned: currentProgress
          ? Math.max(currentProgress.starsEarned, starsEarned)
          : starsEarned,
        bestScore: currentProgress
          ? Math.max(currentProgress.bestScore, starsEarned * 1000)
          : starsEarned * 1000,
        bestWave: totalWaves,
        timesPlayed: currentProgress ? currentProgress.timesPlayed + 1 : 1,
        lastPlayedAt: Date.now(),
      };

      // Update level progress
      const newLevelProgress = {
        ...prev.levelProgress,
        [levelId]: updatedLevelProgress,
      };

      // Calculate new total scrap
      const newTotalScrap = prev.totalScrapEarned + stats.scrapEarned;

      // Calculate new total stars
      const newTotalStars = Object.values(newLevelProgress).reduce(
        (sum, progress) => sum + progress.starsEarned,
        0
      );

      const updatedProgress = {
        ...prev,
        levelProgress: newLevelProgress,
        totalStars: newTotalStars,
        totalScrapEarned: newTotalScrap,
      };

      // Check if we should unlock the next level
      if (levelConfig) {
        const nextLevel = ALL_LEVELS[ALL_LEVELS.indexOf(levelConfig) + 1];

        if (nextLevel && !updatedProgress.unlockedLevels.includes(nextLevel.id)) {
          const { unlockRequirement } = nextLevel;

          // Check unlock requirements
          let shouldUnlock = true;

          if (unlockRequirement.previousLevelId) {
            const prevProgress = newLevelProgress[unlockRequirement.previousLevelId];

            // Must complete previous level
            if (!prevProgress || !prevProgress.completed) {
              shouldUnlock = false;
            }

            // Must meet star requirement
            if (prevProgress && prevProgress.starsEarned < unlockRequirement.minStarsRequired) {
              shouldUnlock = false;
            }
          }

          if (shouldUnlock) {
            // Unlock the next level
            updatedProgress.unlockedLevels = [...updatedProgress.unlockedLevels, nextLevel.id];
            updatedProgress.currentLevel = Math.max(
              updatedProgress.currentLevel,
              nextLevel.number
            );
          }
        }
      }

      return updatedProgress;
    });
  }, []);

  /**
   * Manually unlock a level
   * Used for testing or special unlock conditions
   *
   * @param levelId - The level ID to unlock
   */
  const unlockLevel = useCallback((levelId: string): void => {
    setPlayerProgress(prev => {
      // Don't unlock if already unlocked
      if (prev.unlockedLevels.includes(levelId)) {
        return prev;
      }

      // Find the level to get its number
      const level = ALL_LEVELS.find(l => l.id === levelId);
      if (!level) {
        console.warn(`Level ${levelId} not found in ALL_LEVELS`);
        return prev;
      }

      return {
        ...prev,
        unlockedLevels: [...prev.unlockedLevels, levelId],
        currentLevel: Math.max(prev.currentLevel, level.number),
      };
    });
  }, []);

  /**
   * Reset all progress to initial state
   * Useful for testing/debugging or "New Game"
   */
  const resetProgress = useCallback((): void => {
    setPlayerProgress(initialPlayerProgress);
  }, []);

  /**
   * Load progress from save data
   * Called by Agent G during storage integration
   *
   * @param data - Campaign save data to load
   */
  const loadProgress = useCallback((data: CampaignSaveData): void => {
    setIsLoading(true);
    setPlayerProgress(data.playerProgress);
    setIsLoading(false);
  }, []);

  /**
   * Get all unlocked levels as full LevelConfig objects
   * @returns Array of unlocked level configurations
   */
  const getUnlockedLevels = useCallback((): LevelConfig[] => {
    return ALL_LEVELS.filter(level => playerProgress.unlockedLevels.includes(level.id));
  }, [playerProgress.unlockedLevels]);

  /**
   * Get all locked levels
   * @returns Array of locked level configurations
   */
  const getLockedLevels = useCallback((): LevelConfig[] => {
    return ALL_LEVELS.filter(level => !playerProgress.unlockedLevels.includes(level.id));
  }, [playerProgress.unlockedLevels]);

  /**
   * Get campaign completion percentage
   * @returns Percentage of levels completed (0-100)
   */
  const getCampaignCompletion = useCallback((): number => {
    const completedLevels = Object.values(playerProgress.levelProgress).filter(
      p => p.completed
    ).length;

    if (ALL_LEVELS.length === 0) return 0;

    return (completedLevels / ALL_LEVELS.length) * 100;
  }, [playerProgress.levelProgress]);

  return {
    // State
    playerProgress,
    availableLevels: ALL_LEVELS,
    isLoading,

    // Level query functions
    isLevelUnlocked,
    getLevelProgress,
    getNextLevel,
    getUnlockedLevels,
    getLockedLevels,

    // Progress actions
    completeLevel,
    unlockLevel,
    resetProgress,
    loadProgress,

    // Statistics
    calculateTotalStars,
    getCampaignCompletion,
  };
});
