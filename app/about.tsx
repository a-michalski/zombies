import Constants from "expo-constants";
import { router } from "expo-router";
import { ArrowLeft, Info, Mail, Globe, Code } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const version = Constants.expoConfig?.version || "1.0.0";
  const appName = Constants.expoConfig?.name || "Zombie Fleet Bastion";

  const handleEmailPress = () => {
    Linking.openURL("mailto:hi@adammichalski.com");
  };

  const handleWebsitePress = () => {
    Linking.openURL("https://adammichalski.com");
  };

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
          <Info size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>About & Contact</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>ZFB</Text>
          </View>
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.version}>Version {version}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Game</Text>
          <Text style={styles.paragraph}>
            Zombie Fleet Bastion is a tower defense game where you command a
            fleet of survivors defending against endless waves of zombies. Build
            and upgrade towers, manage resources, and survive as long as you can!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <View style={styles.infoRow}>
            <Code size={20} color="#4A90E2" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>Finelab Adam Michalski</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Support</Text>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <Mail size={20} color="#4CAF50" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Email Support</Text>
              <Text style={styles.contactValue}>hi@adammichalski.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleWebsitePress}
            activeOpacity={0.7}
          >
            <Globe size={20} color="#4A90E2" />
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Website</Text>
              <Text style={styles.contactValue}>adammichalski.com</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoCardRow}>
              <Text style={styles.infoCardLabel}>Version</Text>
              <Text style={styles.infoCardValue}>{version}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoCardRow}>
              <Text style={styles.infoCardLabel}>Bundle ID</Text>
              <Text style={styles.infoCardValue}>
                app.rork.zombie-fleet-bastion
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoCardRow}>
              <Text style={styles.infoCardLabel}>Platform</Text>
              <Text style={styles.infoCardValue}>
                {Constants.platform?.ios ? "iOS" : "Android"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Text style={styles.paragraph}>
            By using this app, you agree to our Terms of Service and Privacy
            Policy. For more information, please visit the respective pages in
            Settings.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with passion by Finelab Adam Michalski
          </Text>
          <Text style={styles.copyrightText}>
            © 2025 Finelab Adam Michalski. All rights reserved.
          </Text>
        </View>
      </ScrollView>
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
  },
  contentContainer: {
    padding: 20,
  },
  logoSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: "#AAAAAA",
    fontWeight: "600" as const,
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#222222",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#333333",
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600" as const,
  },
  infoCard: {
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#333333",
  },
  infoCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoCardLabel: {
    fontSize: 14,
    color: "#AAAAAA",
    fontWeight: "600" as const,
  },
  infoCardValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600" as const,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#333333",
    marginVertical: 8,
  },
  footer: {
    marginTop: 48,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
  },
});
