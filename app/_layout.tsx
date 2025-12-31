import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { GameProvider } from "@/contexts/GameContext";
import { PurchaseProvider } from "@/contexts/PurchaseContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  // Use Slot for web to avoid LinkingContext issues, Stack for native
  if (Platform.OS === "web") {
    return <Slot />;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
      <Stack.Screen name="levels" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <PurchaseProvider>
          <CampaignProvider>
            <GameProvider>
              <GestureHandlerRootView style={styles.gestureHandler}>
                <RootLayoutNav />
              </GestureHandlerRootView>
            </GameProvider>
          </CampaignProvider>
        </PurchaseProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});