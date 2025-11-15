import { router } from "expo-router";
import { ArrowLeft, Music, Settings as SettingsIcon, Volume2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getSettings, saveSettings, type GameSettings } from "@/utils/storage";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<GameSettings>({
    musicEnabled: true,
    soundEffectsEnabled: true,
    defaultGameSpeed: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const loadedSettings = await getSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      router.back();
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <SettingsIcon size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Music size={20} color="#AAAAAA" />
              <Text style={styles.settingLabel}>Background Music</Text>
            </View>
            <Switch
              value={settings.musicEnabled}
              onValueChange={(value) => updateSetting("musicEnabled", value)}
              trackColor={{ false: "#333333", true: "#4CAF50" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Volume2 size={20} color="#AAAAAA" />
              <Text style={styles.settingLabel}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.soundEffectsEnabled}
              onValueChange={(value) => updateSetting("soundEffectsEnabled", value)}
              trackColor={{ false: "#333333", true: "#4CAF50" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gameplay</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Default Game Speed</Text>
            <View style={styles.speedButtons}>
              <TouchableOpacity
                style={[
                  styles.speedButton,
                  settings.defaultGameSpeed === 1 && styles.speedButtonActive,
                ]}
                onPress={() => updateSetting("defaultGameSpeed", 1)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    settings.defaultGameSpeed === 1 && styles.speedButtonTextActive,
                  ]}
                >
                  1x
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.speedButton,
                  settings.defaultGameSpeed === 2 && styles.speedButtonActive,
                ]}
                onPress={() => updateSetting("defaultGameSpeed", 2)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.speedButtonText,
                    settings.defaultGameSpeed === 2 && styles.speedButtonTextActive,
                  ]}
                >
                  2x
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#222222",
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
  speedButtons: {
    flexDirection: "row",
    gap: 8,
  },
  speedButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#333333",
    minWidth: 60,
    alignItems: "center",
  },
  speedButtonActive: {
    backgroundColor: "#4CAF50",
  },
  speedButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#AAAAAA",
  },
  speedButtonTextActive: {
    color: "#FFFFFF",
  },
  footer: {
    backgroundColor: "#222222",
    borderTopWidth: 2,
    borderTopColor: "#333333",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

