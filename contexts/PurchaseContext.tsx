/**
 * Purchase Context - Freemium Model
 *
 * Manages in-app purchases for premium content.
 * FREE: Levels 1-5 + Endless Mode
 * PREMIUM ($2.99): Levels 6-17
 *
 * NOTE: This is a MOCK implementation for UI/UX testing.
 * For production, integrate with expo-in-app-purchases or RevenueCat.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useState } from "react";

const PREMIUM_STORAGE_KEY = "@zombie_fleet_premium_unlocked";

export const [PurchaseProvider, usePurchase] = createContextHook(() => {
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Load premium status from storage
  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(PREMIUM_STORAGE_KEY);
      setIsPremiumUnlocked(value === "true");
    } catch (error) {
      console.error("Failed to load premium status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if a level is premium (locked behind paywall)
   */
  const isLevelPremium = useCallback((levelId: string) => {
    // Endless mode is always free
    if (levelId === "endless") {
      return false;
    }

    // Levels 1-5 are free
    const levelNumber = parseInt(levelId.replace("level-", ""));
    if (levelNumber >= 1 && levelNumber <= 5) {
      return false;
    }

    // Levels 6-17 are premium
    return true;
  }, []);

  /**
   * Check if a level is accessible (free or premium unlocked)
   */
  const isLevelAccessible = useCallback(
    (levelId: string) => {
      // If not premium, it's accessible
      if (!isLevelPremium(levelId)) {
        return true;
      }

      // If premium content is unlocked, it's accessible
      return isPremiumUnlocked;
    },
    [isLevelPremium, isPremiumUnlocked]
  );

  /**
   * Mock purchase flow
   * In production, this would call expo-in-app-purchases or RevenueCat
   */
  const purchasePremium = useCallback(async (): Promise<boolean> => {
    setIsPurchasing(true);

    try {
      // Simulate purchase delay (network request)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: In production, integrate with:
      // - iOS: App Store (StoreKit)
      // - Android: Google Play Billing
      // Using: expo-in-app-purchases or RevenueCat

      // Mock success
      await AsyncStorage.setItem(PREMIUM_STORAGE_KEY, "true");
      setIsPremiumUnlocked(true);
      return true;
    } catch (error) {
      console.error("Purchase failed:", error);
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  /**
   * Restore purchases (for users who bought on another device)
   */
  const restorePurchases = useCallback(async (): Promise<boolean> => {
    setIsPurchasing(true);

    try {
      // Simulate restore delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: In production, query App Store/Google Play for purchases

      // Mock: Check AsyncStorage
      const value = await AsyncStorage.getItem(PREMIUM_STORAGE_KEY);
      const wasUnlocked = value === "true";

      if (wasUnlocked) {
        setIsPremiumUnlocked(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Restore failed:", error);
      return false;
    } finally {
      setIsPurchasing(false);
    }
  }, []);

  /**
   * DEV ONLY: Reset premium status
   */
  const resetPremium = useCallback(async () => {
    await AsyncStorage.removeItem(PREMIUM_STORAGE_KEY);
    setIsPremiumUnlocked(false);
  }, []);

  return {
    isPremiumUnlocked,
    isLoading,
    isPurchasing,
    isLevelPremium,
    isLevelAccessible,
    purchasePremium,
    restorePurchases,
    resetPremium,
  };
});
