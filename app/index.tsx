import { router } from "expo-router";
import { Settings, Skull, Trophy } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { hasMainMenuBackground, UI_IMAGES } from "@/utils/imageAssets";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const IS_LANDSCAPE = SCREEN_WIDTH > SCREEN_HEIGHT;

export default function MainMenu() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0.7)).current;
  const hasBackground = hasMainMenuBackground();

  useEffect(() => {
    // Pulsing animation for "TAP TO CONTINUE"
    // useNativeDriver only works on native platforms, not web
    const useNative = Platform.OS !== "web";
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: useNative,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: useNative,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [fadeAnim]);

  const content = (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Skull size={64} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.title}>ZOMBIE FLEET</Text>
            <Text style={styles.subtitle}>BASTION PROTOTYPE</Text>
          </View>

        <TouchableOpacity
          style={styles.tapToContinueContainer}
          onPress={() => router.push("/game" as any)}
          activeOpacity={0.8}
        >
          <Animated.Text style={[styles.tapToContinue, { opacity: fadeAnim }]}>
            TAP TO CONTINUE
          </Animated.Text>
        </TouchableOpacity>

        <View style={styles.menuButtons}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/stats" as any)}
            activeOpacity={0.7}
          >
            <Trophy size={20} color="#FFFFFF" />
            <Text style={styles.menuButtonText}>Statistics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push("/settings" as any)}
            activeOpacity={0.7}
          >
            <Settings size={20} color="#FFFFFF" />
            <Text style={styles.menuButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>v2.0 MVP</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.background}>
      {hasBackground ? (
        <ImageBackground
          source={UI_IMAGES.mainMenuBackground}
          style={styles.imageBackground}
          resizeMode={IS_LANDSCAPE ? "cover" : "contain"}
          imageStyle={styles.imageStyle}
        >
          {content}
        </ImageBackground>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darker overlay for better text readability
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: IS_LANDSCAPE ? 40 : 80,
  },
  title: {
    fontSize: 48,
    fontWeight: "900" as const,
    color: "#FFFFFF", // White text for better contrast
    marginTop: 24,
    letterSpacing: 4,
    textAlign: "center",
    // Use textShadow string format instead of deprecated props
    textShadow: Platform.select({
      web: "3px 3px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.5)", // Strong black shadow for readability
      default: "3px 3px 8px #000000",
    }),
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#CCCCCC", // Lighter gray for better visibility
    marginTop: 8,
    letterSpacing: 4,
    // Use textShadow string format instead of deprecated props
    textShadow: Platform.select({
      web: "2px 2px 6px rgba(0, 0, 0, 0.9)",
      default: "2px 2px 6px #000000",
    }),
  },
  tapToContinueContainer: {
    marginTop: IS_LANDSCAPE ? 24 : 40,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  tapToContinue: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF", // White text for better contrast
    letterSpacing: 3,
    textAlign: "center",
    // Use textShadow string format instead of deprecated props
    textShadow: Platform.select({
      web: "2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)", // Strong shadow for readability
      default: "2px 2px 8px #000000",
    }),
    textTransform: "uppercase" as const,
  },
  menuButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: IS_LANDSCAPE ? 24 : 40,
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker background for better contrast
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFFFFF", // White border for better visibility
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF", // White text for better contrast
  },
  version: {
    position: "absolute",
    bottom: 32,
    fontSize: 12,
    color: "#666666",
    fontWeight: "600" as const,
  },
});