import { router } from "expo-router";
import {
  ArrowLeft,
  Database,
  Download,
  Shield,
  Trash2,
  Eye,
  Info,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DeleteAccountConfirmation } from "@/components/gdpr/DeleteAccountConfirmation";
import { useAuth } from "@/contexts/AuthContext";
import {
  downloadDataExport,
  getDataCategories,
  getConsentStatus,
  updateAnalyticsConsent,
} from "@/lib/gdpr";

export default function DataPrivacyScreen() {
  const insets = useSafeAreaInsets();
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadConsentStatus();
  }, []);

  const loadConsentStatus = async () => {
    try {
      const consent = await getConsentStatus();
      setAnalyticsEnabled(consent.analyticsConsent);
    } catch (error) {
      console.error("Failed to load consent:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);

      Alert.alert(
        "Export Your Data",
        "This will create a JSON file containing all your data. You can save or share this file.",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setExporting(false),
          },
          {
            text: "Export",
            onPress: async () => {
              try {
                await downloadDataExport(user?.id || null);
                Alert.alert(
                  "Success",
                  "Your data has been exported. Check your device's share menu.",
                  [{ text: "OK" }]
                );
              } catch (error) {
                console.error("Export failed:", error);
                Alert.alert(
                  "Export Failed",
                  "Failed to export your data. Please try again.",
                  [{ text: "OK" }]
                );
              } finally {
                setExporting(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Export error:", error);
      setExporting(false);
    }
  };

  const handleToggleAnalytics = async (value: boolean) => {
    try {
      setAnalyticsEnabled(value);
      await updateAnalyticsConsent(value);

      Alert.alert(
        value ? "Analytics Enabled" : "Analytics Disabled",
        value
          ? "Thank you! Your usage data helps us improve the game."
          : "Analytics disabled. We will not collect usage data.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Failed to update analytics consent:", error);
      setAnalyticsEnabled(!value); // Revert on error
      Alert.alert("Error", "Failed to update settings. Please try again.", [
        { text: "OK" },
      ]);
    }
  };

  const dataCategories = getDataCategories();

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
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
          <Database size={24} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Data & Privacy</Text>
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
        {/* GDPR Rights Summary */}
        <View style={styles.infoBox}>
          <Shield size={20} color="#4CAF50" />
          <Text style={styles.infoText}>
            You have full control over your data under GDPR. Export, delete, or
            manage your privacy settings below.
          </Text>
        </View>

        {/* Analytics Consent */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Info size={20} color="#AAAAAA" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Analytics & Diagnostics</Text>
                <Text style={styles.settingDescription}>
                  Help improve the game by sharing anonymous usage data
                </Text>
              </View>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={handleToggleAnalytics}
              trackColor={{ false: "#333333", true: "#4CAF50" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Data Export */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportData}
            disabled={exporting}
            activeOpacity={0.8}
          >
            {exporting ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <Download size={20} color="#4CAF50" />
            )}
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionButtonText}>Export My Data</Text>
              <Text style={styles.actionButtonDescription}>
                Download all your data as JSON (GDPR Article 20)
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/privacy" as any)}
            activeOpacity={0.8}
          >
            <Eye size={20} color="#4CAF50" />
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionButtonText}>View Privacy Policy</Text>
              <Text style={styles.actionButtonDescription}>
                See how we collect and use your data
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* What Data We Collect */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Data We Collect</Text>
          <Text style={styles.paragraph}>
            Transparency is important. Here's exactly what data we store:
          </Text>

          {dataCategories.map((category, index) => (
            <View key={index} style={styles.categoryCard}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>
                {category.description}
              </Text>
              <View style={styles.categoryMeta}>
                <Text style={styles.categoryMetaText}>
                  Storage: {category.storage === "both" ? "Local + Cloud" : category.storage === "local" ? "Local only" : "Cloud only"}
                </Text>
                <Text style={styles.categoryMetaText}>
                  Retention: {category.retention}
                </Text>
              </View>
              <Text style={styles.categoryPurpose}>
                Purpose: {category.purpose}
              </Text>
            </View>
          ))}
        </View>

        {/* Account Deletion */}
        {!isGuest && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delete Account</Text>
            <Text style={styles.warningText}>
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </Text>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => setShowDeleteModal(true)}
              activeOpacity={0.8}
            >
              <Trash2 size={20} color="#FF4444" />
              <Text style={styles.deleteButtonText}>Delete My Account</Text>
            </TouchableOpacity>

            <Text style={styles.deleteInfo}>
              This will permanently delete:
            </Text>
            <Text style={styles.deleteInfoItem}>• Your profile and account</Text>
            <Text style={styles.deleteInfoItem}>• All campaign progress</Text>
            <Text style={styles.deleteInfoItem}>• Leaderboard entries</Text>
            <Text style={styles.deleteInfoItem}>• Achievements and rewards</Text>
            <Text style={styles.deleteInfoItem}>• All personal data</Text>
          </View>
        )}

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions About Your Data?</Text>
          <Text style={styles.paragraph}>
            For data requests, questions, or concerns, contact our Data
            Protection Officer:
          </Text>
          <Text style={styles.contactInfo}>Email: hi@adammichalski.com</Text>
          <Text style={styles.contactInfo}>
            Response time: Within 30 days (GDPR requirement)
          </Text>
        </View>

        {/* GDPR Rights Summary */}
        <View style={styles.rightsBox}>
          <Text style={styles.rightsTitle}>Your GDPR Rights</Text>
          <Text style={styles.rightsItem}>
            ✓ Right to Access - Export your data
          </Text>
          <Text style={styles.rightsItem}>
            ✓ Right to Rectification - Edit your profile
          </Text>
          <Text style={styles.rightsItem}>
            ✓ Right to Erasure - Delete your account
          </Text>
          <Text style={styles.rightsItem}>
            ✓ Right to Data Portability - Download JSON
          </Text>
          <Text style={styles.rightsItem}>
            ✓ Right to Withdraw Consent - Disable analytics
          </Text>
          <Text style={styles.rightsItem}>
            ✓ Right to Lodge a Complaint - Contact authorities
          </Text>
        </View>
      </ScrollView>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountConfirmation
          visible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          userId={user?.id || ""}
        />
      )}
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
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
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
  paragraph: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 22,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
    marginBottom: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#4CAF50",
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 18,
  },
  categoryCard: {
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333333",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  categoryMetaText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600" as const,
  },
  categoryPurpose: {
    fontSize: 12,
    color: "#AAAAAA",
    fontStyle: "italic" as const,
  },
  warningText: {
    fontSize: 14,
    color: "#FF9800",
    lineHeight: 22,
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2a1a1a",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF4444",
    marginBottom: 16,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FF4444",
  },
  deleteInfo: {
    fontSize: 14,
    color: "#CCCCCC",
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  deleteInfoItem: {
    fontSize: 14,
    color: "#AAAAAA",
    lineHeight: 22,
    marginLeft: 8,
  },
  contactInfo: {
    fontSize: 14,
    color: "#4A90E2",
    lineHeight: 22,
    marginLeft: 8,
  },
  rightsBox: {
    backgroundColor: "#222222",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#4CAF50",
    marginTop: 8,
  },
  rightsTitle: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#4CAF50",
    marginBottom: 12,
  },
  rightsItem: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 24,
  },
});
