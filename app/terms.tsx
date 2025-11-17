import { router } from "expo-router";
import { ArrowLeft, FileText } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsOfServiceScreen() {
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
          <FileText size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Terms of Service</Text>
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
          <Text style={styles.sectionTitle}>Agreement to Terms</Text>
          <Text style={styles.paragraph}>
            By downloading, installing, or using the Zombie Fleet Bastion mobile
            application (the "App"), you agree to be bound by these Terms of
            Service ("Terms"). If you do not agree to these Terms, do not use
            the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Information</Text>
          <Text style={styles.infoItem}>App Name: Zombie Fleet Bastion</Text>
          <Text style={styles.infoItem}>Developer: Finelab Adam Michalski</Text>
          <Text style={styles.infoItem}>Contact: hi@adammichalski.com</Text>
          <Text style={styles.infoItem}>Website: https://adammichalski.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>License to Use</Text>
          <Text style={styles.subsectionTitle}>Grant of License</Text>
          <Text style={styles.paragraph}>
            Subject to these Terms, Finelab Adam Michalski grants you a limited,
            non-exclusive, non-transferable, revocable license to:
          </Text>
          <Text style={styles.listItem}>
            • Download and install the App on your personal device
          </Text>
          <Text style={styles.listItem}>
            • Use the App for your personal, non-commercial entertainment
            purposes
          </Text>

          <Text style={styles.subsectionTitle}>Restrictions</Text>
          <Text style={styles.paragraph}>You may NOT:</Text>
          <Text style={styles.listItem}>
            • Modify, reverse engineer, decompile, or disassemble the App
          </Text>
          <Text style={styles.listItem}>
            • Copy, distribute, or create derivative works from the App
          </Text>
          <Text style={styles.listItem}>
            • Use the App for any commercial purpose
          </Text>
          <Text style={styles.listItem}>
            • Rent, lease, lend, sell, or sublicense the App
          </Text>
          <Text style={styles.listItem}>
            • Remove, alter, or obscure any copyright or proprietary notices
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intellectual Property Rights</Text>
          <Text style={styles.paragraph}>
            All content, features, and functionality of the App, including but
            not limited to game mechanics, graphics, code, text, and branding,
            are and shall remain the exclusive property of Finelab Adam
            Michalski and its licensors.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Conduct</Text>
          <Text style={styles.paragraph}>
            You agree to use the App only for lawful purposes and in accordance
            with these Terms.
          </Text>
          <Text style={styles.subsectionTitle}>Prohibited Activities</Text>
          <Text style={styles.paragraph}>You may NOT:</Text>
          <Text style={styles.listItem}>
            • Use the App in any way that could damage or impair it
          </Text>
          <Text style={styles.listItem}>
            • Attempt to gain unauthorized access to any part of the App
          </Text>
          <Text style={styles.listItem}>
            • Use any automated system (bots, scripts) to interact with the App
          </Text>
          <Text style={styles.listItem}>
            • Violate any applicable laws or regulations while using the App
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Rules and Fair Play</Text>
          <Text style={styles.listItem}>
            • Game progress is stored locally on your device
          </Text>
          <Text style={styles.listItem}>
            • We are not responsible for lost progress due to device issues or
            uninstallation
          </Text>
          <Text style={styles.listItem}>
            • You can reset your progress at any time using "Reset Progress" in
            Settings
          </Text>
          <Text style={styles.listItem}>
            • We reserve the right to modify, update, or discontinue any aspect
            of the App
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Disclaimer of Warranties</Text>
          <Text style={styles.warningText}>
            THE APP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT
            WARRANTIES OF ANY KIND. We do not warrant that the App will be
            uninterrupted, error-free, or compatible with all devices.
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Limitation of Liability</Text>
          <Text style={styles.warningText}>
            TO THE FULLEST EXTENT PERMITTED BY LAW, FINELAB ADAM MICHALSKI SHALL
            NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR
            CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GAME
            PROGRESS.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Requirements</Text>
          <Text style={styles.paragraph}>
            The App is rated for users aged 9 and above. By using the App, you
            confirm that you meet the minimum age requirement or have
            parental/guardian consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Updates and Modifications</Text>
          <Text style={styles.paragraph}>
            We may release updates or modify these Terms at any time. Continued
            use of the App after changes constitutes acceptance of the new Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.paragraph}>
            Your use of the App is also governed by our Privacy Policy. Please
            review our Privacy Policy to understand how we handle your
            information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Termination</Text>
          <Text style={styles.paragraph}>
            You may stop using the App at any time by uninstalling it. We
            reserve the right to terminate or suspend your access to the App at
            any time, with or without cause.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us:
          </Text>
          <Text style={styles.contactInfo}>Developer: Finelab Adam Michalski</Text>
          <Text style={styles.contactInfo}>Email: hi@adammichalski.com</Text>
          <Text style={styles.contactInfo}>Website: https://adammichalski.com</Text>
        </View>

        <View style={styles.acknowledgmentBox}>
          <Text style={styles.acknowledgmentText}>
            BY USING ZOMBIE FLEET BASTION, YOU ACKNOWLEDGE THAT YOU HAVE READ,
            UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
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
  listItem: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
    marginLeft: 8,
  },
  infoItem: {
    fontSize: 14,
    color: "#4A90E2",
    lineHeight: 22,
    marginLeft: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: "#4A90E2",
    lineHeight: 22,
    marginLeft: 8,
  },
  warningBox: {
    backgroundColor: "#2a1a1a",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 2,
    borderColor: "#FF4444",
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#FF4444",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 13,
    color: "#CCCCCC",
    lineHeight: 20,
  },
  acknowledgmentBox: {
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  acknowledgmentText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#4A90E2",
    lineHeight: 22,
    textAlign: "center",
  },
});
