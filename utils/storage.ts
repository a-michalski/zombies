import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  SETTINGS: "@zombie_fleet:settings",
  STATS: "@zombie_fleet:stats",
} as const;

export interface GameSettings {
  musicEnabled: boolean;
  soundEffectsEnabled: boolean;
  defaultGameSpeed: 1 | 2;
}

export interface GameStats {
  bestWave: number;
  totalZombiesKilled: number;
  totalWavesSurvived: number;
  gamesPlayed: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  musicEnabled: true,
  soundEffectsEnabled: true,
  defaultGameSpeed: 1,
};

const DEFAULT_STATS: GameStats = {
  bestWave: 0,
  totalZombiesKilled: 0,
  totalWavesSurvived: 0,
  gamesPlayed: 0,
};

export async function getSettings(): Promise<GameSettings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data) as GameSettings;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

export async function getStats(): Promise<GameStats> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
    if (data) {
      return JSON.parse(data) as GameStats;
    }
    return DEFAULT_STATS;
  } catch (error) {
    console.error("Error loading stats:", error);
    return DEFAULT_STATS;
  }
}

export async function saveStats(stats: GameStats): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving stats:", error);
  }
}

export async function updateStatsFromGame(
  wave: number,
  zombiesKilled: number,
  wavesSurvived: number
): Promise<void> {
  try {
    const currentStats = await getStats();
    const updatedStats: GameStats = {
      bestWave: Math.max(currentStats.bestWave, wave),
      totalZombiesKilled: currentStats.totalZombiesKilled + zombiesKilled,
      totalWavesSurvived: currentStats.totalWavesSurvived + wavesSurvived,
      gamesPlayed: currentStats.gamesPlayed + 1,
    };
    await saveStats(updatedStats);
  } catch (error) {
    console.error("Error updating stats:", error);
  }
}

