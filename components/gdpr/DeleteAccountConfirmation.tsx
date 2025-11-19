import { router } from "expo-router";
import { AlertTriangle, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { deleteUserAccount } from "@/lib/gdpr";
import { analytics } from "@/lib/analytics";

interface DeleteAccountConfirmationProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

/**
 * Delete Account Confirmation Modal
 * Requires user to type "DELETE" to confirm permanent account deletion
 * Implements GDPR Article 17 (Right to Erasure)
 */
export function DeleteAccountConfirmation({
  visible,
  onClose,
  userId,
}: DeleteAccountConfirmationProps) {
  const insets = useSafeAreaInsets();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const isConfirmValid = confirmText.trim().toUpperCase() === "DELETE";

  const handleDelete = async () => {
    if (!isConfirmValid) {
      Alert.alert(
        "Invalid Confirmation",
        'Please type "DELETE" exactly to confirm.',
        [{ text: "OK" }]
      );
      return;
    }

    // Final confirmation
    Alert.alert(
      "Final Warning",
      "This is your last chance. Are you absolutely sure you want to permanently delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Delete Forever",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);

            try {
              analytics.track("account_deletion_confirmed", {
                user_id: userId,
              });

              const result = await deleteUserAccount(userId);

              if (result.success) {
                Alert.alert(
                  "Account Deleted",
                  "Your account and all associated data have been permanently deleted. Thank you for playing Zombie Fleet Bastion.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        onClose();
                        // Navigate back to main menu
                        router.replace("/" as any);
                      },
                    },
                  ]
                );
              } else {
                throw new Error(result.error || "Deletion failed");
              }
            } catch (error) {
              console.error("Account deletion failed:", error);
              setDeleting(false);

              Alert.alert(
                "Deletion Failed",
                "Failed to delete your account. Please try again or contact support at hi@adammichalski.com",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
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
            <View style={styles.headerLeft}>
              <AlertTriangle size={32} color="#FF4444" />
              <View>
                <Text style={styles.title}>Delete Account</Text>
                <Text style={styles.subtitle}>This cannot be undone</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Warning */}
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>WARNING: PERMANENT DELETION</Text>
              <Text style={styles.warningText}>
                This action will permanently delete:
              </Text>
            </View>

            {/* What will be deleted */}
            <View style={styles.deleteList}>
              <Text style={styles.deleteItem}>
                ✗ Your profile and account credentials
              </Text>
              <Text style={styles.deleteItem}>
                ✗ All campaign progress (levels, stars, scrap)
              </Text>
              <Text style={styles.deleteItem}>
                ✗ All leaderboard entries and rankings
              </Text>
              <Text style={styles.deleteItem}>
                ✗ All achievements and rewards
              </Text>
              <Text style={styles.deleteItem}>
                ✗ Daily reward streaks
              </Text>
              <Text style={styles.deleteItem}>
                ✗ All player statistics
              </Text>
              <Text style={styles.deleteItem}>
                ✗ All personal data (email, nickname, etc.)
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                This complies with GDPR Article 17 (Right to Erasure). Your data
                will be permanently removed from our servers within 30 days.
              </Text>
            </View>

            {/* Confirmation Input */}
            <View style={styles.confirmSection}>
              <Text style={styles.confirmLabel}>
                Type <Text style={styles.deleteWord}>DELETE</Text> to confirm:
              </Text>
              <TextInput
                style={styles.confirmInput}
                value={confirmText}
                onChangeText={setConfirmText}
                placeholder="Type DELETE here"
                placeholderTextColor="#666666"
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!deleting}
              />
              {confirmText.length > 0 && !isConfirmValid && (
                <Text style={styles.confirmError}>
                  Must type exactly "DELETE" in capital letters
                </Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.8}
                disabled={deleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  (!isConfirmValid || deleting) && styles.deleteButtonDisabled,
                ]}
                onPress={handleDelete}
                disabled={!isConfirmValid || deleting}
                activeOpacity={0.8}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>
                    Delete Forever
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Alternative */}
            <View style={styles.alternativeBox}>
              <Text style={styles.alternativeTitle}>
                Just want to start fresh?
              </Text>
              <Text style={styles.alternativeText}>
                You can reset your progress in Settings without deleting your
                account. This keeps your profile and lets you compete on
                leaderboards again.
              </Text>
            </View>
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
    borderColor: "#FF4444",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#2a1a1a",
    borderBottomWidth: 2,
    borderBottomColor: "#FF4444",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: "#FF4444",
  },
  subtitle: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 20,
    maxHeight: "80%",
  },
  warningBox: {
    backgroundColor: "rgba(255, 68, 68, 0.1)",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FF4444",
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#FF4444",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: "#CCCCCC",
    lineHeight: 20,
  },
  deleteList: {
    marginBottom: 20,
  },
  deleteItem: {
    fontSize: 14,
    color: "#FF9800",
    lineHeight: 28,
    marginLeft: 8,
  },
  infoBox: {
    backgroundColor: "#222222",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: "#AAAAAA",
    lineHeight: 18,
  },
  confirmSection: {
    marginBottom: 20,
  },
  confirmLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 12,
    fontWeight: "600" as const,
  },
  deleteWord: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#FF4444",
    fontFamily: "monospace",
  },
  confirmInput: {
    backgroundColor: "#222222",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#333333",
    fontFamily: "monospace",
    textAlign: "center",
  },
  confirmError: {
    fontSize: 12,
    color: "#FF4444",
    marginTop: 8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#333333",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#666666",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFFFFF",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF4444",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonDisabled: {
    backgroundColor: "#4a2222",
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#FFFFFF",
  },
  alternativeBox: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: "#4CAF50",
    marginBottom: 8,
  },
  alternativeText: {
    fontSize: 13,
    color: "#CCCCCC",
    lineHeight: 20,
  },
});
