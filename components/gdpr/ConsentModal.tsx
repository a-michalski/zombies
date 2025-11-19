import { Shield, CheckCircle, Info } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { saveConsent } from "@/lib/gdpr";

interface ConsentModalProps {
  visible: boolean;
  onConsentGiven: () => void;
}

/**
 * GDPR Consent Modal
 * Shows on first app launch
 * Requires user to accept privacy policy and optionally analytics
 */
export function ConsentModal({ visible, onConsentGiven }: ConsentModalProps) {
  const insets = useSafeAreaInsets();
  const [essentialConsent, setEssentialConsent] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  const handleAccept = async () => {
    if (!essentialConsent) {
      Alert.alert(
        "Consent Required",
        "You must accept the Privacy Policy to use this app.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      await saveConsent(essentialConsent, analyticsConsent);
      onConsentGiven();
    } catch (error) {
      console.error("Failed to save consent:", error);
      Alert.alert(
        "Error",
        "Failed to save your consent. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handlePrivacyPolicy = () => {
    // In a real app, this would open the privacy policy in a browser or in-app
    Alert.alert(
      "Privacy Policy",
      "The Privacy Policy screen will open. You can also access it later from Settings.",
      [{ text: "OK" }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              paddingTop: Math.max(insets.top, 20),
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Shield size={48} color="#4CAF50" />
            <Text style={styles.title}>Privacy & Consent</Text>
            <Text style={styles.subtitle}>
              Your privacy matters to us. Please review and accept our privacy
              policy.
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Privacy Policy Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What We Collect</Text>
              <Text style={styles.sectionText}>
                • Account info: Email, nickname, nationality (optional)
              </Text>
              <Text style={styles.sectionText}>
                • Game data: Progress, scores, achievements
              </Text>
              <Text style={styles.sectionText}>
                • Analytics: Usage patterns (optional, opt-in)
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How We Use Your Data</Text>
              <Text style={styles.sectionText}>
                • Save your game progress across devices
              </Text>
              <Text style={styles.sectionText}>
                • Display you on leaderboards
              </Text>
              <Text style={styles.sectionText}>
                • Improve the game experience
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Rights (GDPR)</Text>
              <Text style={styles.sectionText}>
                ✓ Export all your data anytime
              </Text>
              <Text style={styles.sectionText}>
                ✓ Delete your account permanently
              </Text>
              <Text style={styles.sectionText}>
                ✓ Opt out of analytics
              </Text>
              <Text style={styles.sectionText}>
                ✓ Update your information
              </Text>
            </View>

            <View style={styles.highlightBox}>
              <Info size={16} color="#4CAF50" />
              <Text style={styles.highlightText}>
                Guest mode: Play without an account. All data stays on your
                device only.
              </Text>
            </View>

            {/* Consent Checkboxes */}
            <View style={styles.consentSection}>
              <Text style={styles.consentTitle}>Your Consent</Text>

              {/* Essential Consent (Required) */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setEssentialConsent(!essentialConsent)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    essentialConsent && styles.checkboxActive,
                  ]}
                >
                  {essentialConsent && (
                    <CheckCircle size={20} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxLabel}>
                    I accept the Privacy Policy
                    <Text style={styles.required}> *</Text>
                  </Text>
                  <Text style={styles.checkboxDescription}>
                    Required to use the app. You can delete your data anytime.
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Analytics Consent (Optional) */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAnalyticsConsent(!analyticsConsent)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    analyticsConsent && styles.checkboxActive,
                  ]}
                >
                  {analyticsConsent && (
                    <CheckCircle size={20} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxLabel}>
                    Share anonymous analytics
                    <Text style={styles.optional}> (Optional)</Text>
                  </Text>
                  <Text style={styles.checkboxDescription}>
                    Helps us improve the game. You can change this later in
                    settings.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Privacy Policy Link */}
            <TouchableOpacity
              style={styles.linkButton}
              onPress={handlePrivacyPolicy}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>Read Full Privacy Policy</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                !essentialConsent && styles.acceptButtonDisabled,
              ]}
              onPress={handleAccept}
              disabled={!essentialConsent}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.acceptButtonText,
                  !essentialConsent && styles.acceptButtonTextDisabled,
                ]}
              >
                {essentialConsent ? "Accept & Continue" : "Please Accept Privacy Policy"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              By continuing, you agree to our data collection and use as
              described in the Privacy Policy
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 500,
    maxHeight: "90%",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#4CAF50",
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#222222",
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
  },
  title: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    lineHeight: 20,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
    marginBottom: 4,
  },
  highlightBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 24,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: "#CCCCCC",
    lineHeight: 20,
  },
  consentSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  consentTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#222222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#666666",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  required: {
    color: "#FF4444",
  },
  optional: {
    color: "#4CAF50",
    fontSize: 12,
  },
  checkboxDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 18,
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  linkText: {
    fontSize: 14,
    color: "#4A90E2",
    textDecorationLine: "underline" as const,
  },
  footer: {
    padding: 20,
    backgroundColor: "#222222",
    borderTopWidth: 2,
    borderTopColor: "#333333",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  acceptButtonDisabled: {
    backgroundColor: "#333333",
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  acceptButtonTextDisabled: {
    color: "#666666",
  },
  footerNote: {
    fontSize: 11,
    color: "#666666",
    textAlign: "center",
    lineHeight: 16,
  },
});
