import { LevelConfig } from "@/types/levels";

/**
 * ENDLESS MODE
 *
 * Survive as long as possible against infinite waves of zombies.
 * Difficulty increases every 5 waves.
 * Your highest wave becomes your high score!
 */
export const ENDLESS_MODE: LevelConfig = {
  id: "endless",
  number: 0, // Special number for endless mode
  name: "Endless Survival",
  difficulty: "medium",
  description: "Survive infinite waves! Difficulty increases every 5 waves. How long can you last?",

  // Always unlocked - no requirements
  unlockRequirement: {
    previousLevelId: null,
    minStarsRequired: 0,
  },

  // No rewards for endless mode
  rewards: {
    firstCompletionBonus: 0,
    scrapPerStar: 0,
  },

  // No star requirements for endless mode (it's about highest wave survived)
  starRequirements: {
    oneStar: {
      type: "complete",
    },
    twoStars: {
      type: "hull_remaining",
      minHullPercent: 50,
    },
    threeStars: {
      type: "hull_remaining",
      minHullPercent: 80,
    },
  },

  mapConfig: {
    // Use default waypoints (classic S-curve path)
    waypoints: [
      { x: 0, y: 6 },
      { x: 4, y: 6 },
      { x: 4, y: 3 },
      { x: 8, y: 3 },
      { x: 8, y: 9 },
      { x: 14, y: 9 },
      { x: 14, y: 4 },
      { x: 20, y: 4 },
    ],

    // All 8 construction spots available
    constructionSpots: [
      { id: "CS-01", x: 2, y: 8 },
      { id: "CS-02", x: 6, y: 5 },
      { id: "CS-03", x: 6, y: 1 },
      { id: "CS-04", x: 10, y: 5 },
      { id: "CS-05", x: 10, y: 11 },
      { id: "CS-06", x: 16, y: 11 },
      { id: "CS-07", x: 16, y: 6 },
      { id: "CS-08", x: 18, y: 2 },
    ],

    startingResources: {
      scrap: 200,
      hullIntegrity: 20,
    },

    // This is a placeholder - actual waves are generated dynamically
    waves: [],
  },
};
