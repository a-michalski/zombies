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
        <Text style={styles.date}>Effective Date: November 19, 2025</Text>
        <Text style={styles.date}>Last Updated: November 19, 2025</Text>
        <Text style={styles.date}>GDPR Compliant</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            Finelab Adam Michalski ("we", "our", or "us") operates the Zombie
            Fleet Bastion mobile application (the "App"). This Privacy Policy
            explains how we collect, use, store, and protect your information
            in compliance with the General Data Protection Regulation (GDPR)
            and other applicable data protection laws.
          </Text>
          <Text style={styles.paragraph}>
            We are committed to protecting your privacy and giving you control
            over your personal data. This policy outlines your rights and how
            we handle your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>

          <Text style={styles.subsectionTitle}>
            1. Account Information (Optional - Cloud Storage)
          </Text>
          <Text style={styles.paragraph}>
            If you create an account, we collect and store:
          </Text>
          <Text style={styles.listItem}>• Email address (for authentication)</Text>
          <Text style={styles.listItem}>• Nickname (displayed on leaderboards)</Text>
          <Text style={styles.listItem}>• Nationality (for regional leaderboards)</Text>
          <Text style={styles.listItem}>• Account creation and last seen dates</Text>
          <Text style={styles.paragraph}>
            Legal Basis (GDPR Article 6): Consent and contract performance
          </Text>

          <Text style={styles.subsectionTitle}>
            2. Data Stored Locally on Your Device
          </Text>
          <Text style={styles.paragraph}>
            The following data is stored locally using AsyncStorage:
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
          <Text style={styles.listItem}>• Star ratings per level</Text>
          <Text style={styles.listItem}>• Best scores</Text>
          <Text style={styles.listItem}>• Total stars and scrap earned</Text>

          <Text style={styles.subsectionTitle}>
            3. Cloud-Synced Game Data (Authenticated Users Only)
          </Text>
          <Text style={styles.paragraph}>
            If you create an account, the following data is synced to our
            secure cloud servers (Supabase):
          </Text>
          <Text style={styles.listItem}>• Campaign progress (for cross-device sync)</Text>
          <Text style={styles.listItem}>• Leaderboard scores and rankings</Text>
          <Text style={styles.listItem}>• Achievement progress</Text>
          <Text style={styles.listItem}>• Daily reward streaks</Text>
          <Text style={styles.listItem}>• Player statistics</Text>

          <Text style={styles.subsectionTitle}>
            4. Analytics Data (Optional)
          </Text>
          <Text style={styles.paragraph}>
            With your consent, we collect anonymized analytics:
          </Text>
          <Text style={styles.listItem}>• Screen views and button clicks</Text>
          <Text style={styles.listItem}>• Level completion events</Text>
          <Text style={styles.listItem}>• Session duration</Text>
          <Text style={styles.listItem}>• Error logs (for bug fixes)</Text>
          <Text style={styles.paragraph}>
            You can opt out of analytics at any time in Data & Privacy settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your data for the following purposes:
          </Text>
          <Text style={styles.listItem}>
            • Game Functionality - Save progress, settings, and statistics
          </Text>
          <Text style={styles.listItem}>
            • Cloud Sync - Sync progress across multiple devices (authenticated users)
          </Text>
          <Text style={styles.listItem}>
            • Leaderboards - Display rankings and compare scores
          </Text>
          <Text style={styles.listItem}>
            • Personalization - Remember your preferences
          </Text>
          <Text style={styles.listItem}>
            • Analytics - Improve game experience (with consent)
          </Text>
          <Text style={styles.listItem}>
            • Bug Fixes - Identify and resolve technical issues
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing and Third Parties</Text>
          <Text style={styles.highlight}>
            We do not sell your personal data to third parties.
          </Text>
          <Text style={styles.paragraph}>
            We use the following trusted third-party services:
          </Text>
          <Text style={styles.listItem}>
            • Supabase (Cloud Infrastructure) - Secure data storage and
            authentication, GDPR compliant
          </Text>
          <Text style={styles.paragraph}>
            Guest mode: If you play as a guest, all data remains on your device
            only. No data is transmitted to external servers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures:
          </Text>
          <Text style={styles.listItem}>
            • Local data: Protected by your device's security (AsyncStorage)
          </Text>
          <Text style={styles.listItem}>
            • Cloud data: Encrypted in transit (HTTPS) and at rest (AES-256)
          </Text>
          <Text style={styles.listItem}>
            • Authentication: Secure password hashing (bcrypt)
          </Text>
          <Text style={styles.listItem}>
            • Database: Row-level security policies (RLS) in Supabase
          </Text>
          <Text style={styles.paragraph}>
            No security is 100% guaranteed. We continuously monitor and update
            our security practices.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your data as follows:
          </Text>
          <Text style={styles.listItem}>
            • Local data: Until app uninstall or manual deletion
          </Text>
          <Text style={styles.listItem}>
            • Account data: Until you delete your account
          </Text>
          <Text style={styles.listItem}>
            • Analytics: 90 days (rolling window)
          </Text>
          <Text style={styles.listItem}>
            • Deleted accounts: Permanently removed within 30 days
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your GDPR Rights</Text>
          <Text style={styles.paragraph}>
            Under GDPR, you have the following rights:
          </Text>

          <Text style={styles.subsectionTitle}>
            Right to Access (Article 15)
          </Text>
          <Text style={styles.paragraph}>
            View and export all your personal data in JSON format via
            Settings → Data & Privacy → Export My Data
          </Text>

          <Text style={styles.subsectionTitle}>
            Right to Rectification (Article 16)
          </Text>
          <Text style={styles.paragraph}>
            Update your nickname, nationality, and email in account settings
          </Text>

          <Text style={styles.subsectionTitle}>
            Right to Erasure (Article 17)
          </Text>
          <Text style={styles.paragraph}>
            Delete your account and all associated data via
            Settings → Data & Privacy → Delete My Account
          </Text>

          <Text style={styles.subsectionTitle}>
            Right to Data Portability (Article 20)
          </Text>
          <Text style={styles.paragraph}>
            Export your data in machine-readable JSON format
          </Text>

          <Text style={styles.subsectionTitle}>
            Right to Withdraw Consent (Article 7)
          </Text>
          <Text style={styles.paragraph}>
            Opt out of analytics at any time in Data & Privacy settings
          </Text>

          <Text style={styles.subsectionTitle}>
            Right to Lodge a Complaint
          </Text>
          <Text style={styles.paragraph}>
            Contact your local data protection authority if you believe your
            rights have been violated
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
          <Text style={styles.sectionTitle}>Consent and Legal Basis</Text>
          <Text style={styles.paragraph}>
            We process your data based on:
          </Text>
          <Text style={styles.listItem}>
            • Consent (GDPR Article 6.1a) - You agree to create an account
          </Text>
          <Text style={styles.listItem}>
            • Contract Performance (GDPR Article 6.1b) - Providing game services
          </Text>
          <Text style={styles.listItem}>
            • Legitimate Interest (GDPR Article 6.1f) - Bug fixes and security
          </Text>
          <Text style={styles.paragraph}>
            You can withdraw consent at any time by deleting your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your data may be stored on servers outside your country. We ensure
            GDPR compliance through Supabase's Standard Contractual Clauses (SCCs).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update this policy. Significant changes will require your
            re-consent. Last updated date is shown at the top.
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Quick Summary:</Text>
          <Text style={styles.summaryItem}>
            • Guest mode: All data stays on your device only
          </Text>
          <Text style={styles.summaryItem}>
            • Account mode: Data synced to secure cloud (optional)
          </Text>
          <Text style={styles.summaryItem}>
            • You control your data: Export or delete anytime
          </Text>
          <Text style={styles.summaryItem}>
            • GDPR compliant: Full transparency and user rights
          </Text>
          <Text style={styles.summaryItem}>
            • Analytics opt-in: You choose whether to share usage data
          </Text>
          <Text style={styles.summaryItem}>
            • No selling data: We never sell your information
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
