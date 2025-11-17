import { router } from "expo-router";
import { ArrowLeft, Shield } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();

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
          <Shield size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Privacy Policy</Text>
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
        <Text style={styles.date}>Effective Date: November 17, 2025</Text>
        <Text style={styles.date}>Last Updated: November 17, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Finelab Adam Michalski ("we", "our", or "us") operates the Zombie
            Fleet Bastion mobile application (the "App"). This Privacy Policy
            explains how we collect, use, and protect your information when you
            use our App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.subsectionTitle}>
            Data Stored Locally on Your Device
          </Text>
          <Text style={styles.paragraph}>
            Zombie Fleet Bastion stores the following information locally on
            your device using AsyncStorage:
          </Text>

          <Text style={styles.listTitle}>Game Statistics:</Text>
          <Text style={styles.listItem}>• Best wave reached</Text>
          <Text style={styles.listItem}>• Total zombies killed</Text>
          <Text style={styles.listItem}>• Total waves survived</Text>
          <Text style={styles.listItem}>• Number of games played</Text>

          <Text style={styles.listTitle}>Settings & Preferences:</Text>
          <Text style={styles.listItem}>• Music enabled/disabled</Text>
          <Text style={styles.listItem}>• Sound effects enabled/disabled</Text>
          <Text style={styles.listItem}>• Default game speed preference</Text>

          <Text style={styles.listTitle}>Campaign Progress:</Text>
          <Text style={styles.listItem}>• Unlocked levels</Text>
          <Text style={styles.listItem}>• Level completion status</Text>
          <Text style={styles.listItem}>• Star ratings</Text>
          <Text style={styles.listItem}>• Total stars earned</Text>
          <Text style={styles.listItem}>• Total scrap earned</Text>

          <Text style={styles.highlight}>
            Important: All data is stored locally on your device only. We do not
            collect, transmit, or store any of this information on external
            servers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            The data stored on your device is used solely for:
          </Text>
          <Text style={styles.listItem}>
            • Game Functionality - To save your progress, settings, and
            statistics
          </Text>
          <Text style={styles.listItem}>
            • Personalization - To remember your preferences
          </Text>
          <Text style={styles.listItem}>
            • Progress Tracking - To track your achievements and campaign
            progress
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing and Transmission</Text>
          <Text style={styles.highlight}>
            We do not share, sell, or transmit your data to third parties.
          </Text>
          <Text style={styles.paragraph}>
            Zombie Fleet Bastion operates entirely offline and does not:
          </Text>
          <Text style={styles.listItem}>• Send data to external servers</Text>
          <Text style={styles.listItem}>
            • Share information with advertisers
          </Text>
          <Text style={styles.listItem}>
            • Transmit analytics to third-party services
          </Text>
          <Text style={styles.listItem}>• Require internet connectivity</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.paragraph}>
            Your data is stored locally on your device using AsyncStorage, which
            is:
          </Text>
          <Text style={styles.listItem}>
            • Protected by your device's security measures
          </Text>
          <Text style={styles.listItem}>
            • Not accessible to other applications
          </Text>
          <Text style={styles.listItem}>
            • Only accessible while the app is installed
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.paragraph}>
            Your data is retained on your device until:
          </Text>
          <Text style={styles.listItem}>• You uninstall the app</Text>
          <Text style={styles.listItem}>
            • You manually reset your progress using the "Reset Progress" option
            in Settings
          </Text>
          <Text style={styles.listItem}>
            • You clear the app's data through your device settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>

          <Text style={styles.subsectionTitle}>Access Your Data</Text>
          <Text style={styles.paragraph}>
            All data stored by the app is visible within the app interface
            (statistics, settings, campaign progress).
          </Text>

          <Text style={styles.subsectionTitle}>Delete Your Data</Text>
          <Text style={styles.paragraph}>You can delete your data by:</Text>
          <Text style={styles.listItem}>
            • Using the "Reset Progress" option in Settings
          </Text>
          <Text style={styles.listItem}>• Uninstalling the app</Text>
          <Text style={styles.listItem}>
            • Clearing the app's data through your device settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Zombie Fleet Bastion is rated for ages 9+ and does not knowingly
            collect personal information from children. The app does not require
            account creation, does not collect personal information, and stores
            only game-related data locally on the device.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions or concerns about this Privacy Policy or your
            data, please contact us:
          </Text>
          <Text style={styles.contactInfo}>Developer: Finelab Adam Michalski</Text>
          <Text style={styles.contactInfo}>Email: hi@adammichalski.com</Text>
          <Text style={styles.contactInfo}>Website: https://adammichalski.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consent</Text>
          <Text style={styles.paragraph}>
            By using Zombie Fleet Bastion, you consent to this Privacy Policy
            and the local storage of game data as described above.
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Summary:</Text>
          <Text style={styles.summaryItem}>
            • All data is stored locally on your device only
          </Text>
          <Text style={styles.summaryItem}>
            • No data is transmitted to external servers
          </Text>
          <Text style={styles.summaryItem}>
            • No personal information is collected
          </Text>
          <Text style={styles.summaryItem}>
            • You can delete your data at any time
          </Text>
          <Text style={styles.summaryItem}>
            • The app works completely offline
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
  date: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
    marginBottom: 8,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 4,
  },
  listItem: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
    marginLeft: 8,
  },
  highlight: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#4CAF50",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: "#4A90E2",
    lineHeight: 22,
    marginLeft: 8,
  },
  summaryBox: {
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#4CAF50",
    marginBottom: 8,
  },
  summaryItem: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
  },
});
