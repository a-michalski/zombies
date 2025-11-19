/**
 * Purchase Modal - Premium Content Unlock
 *
 * Modal for purchasing premium campaign levels (6-17).
 * FREE: Levels 1-5 + Endless Mode
 * PREMIUM: $2.99 - Unlock levels 6-17
 */

import { X, Unlock, RotateCcw, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";

import { THEME } from "@/constants/ui/theme";
import { usePurchase } from "@/contexts/PurchaseContext";

export interface PurchaseModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PurchaseModal({ visible, onClose }: PurchaseModalProps) {
  const { purchasePremium, restorePurchases, isPurchasing } = usePurchase();
  const [isRestoring, setIsRestoring] = useState(false);

  const handlePurchase = async () => {
    const success = await purchasePremium();

    if (success) {
      Alert.alert(
        "Success! 🎉",
        "Premium content unlocked! Enjoy levels 6-17.",
        [{ text: "Awesome!", onPress: onClose }]
      );
    } else {
      Alert.alert(
        "Purchase Failed",
        "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    const success = await restorePurchases();
    setIsRestoring(false);

    if (success) {
      Alert.alert(
        "Restored! ✅",
        "Your premium purchase has been restored.",
        [{ text: "Great!", onPress: onClose }]
      );
    } else {
      Alert.alert(
        "No Purchases Found",
        "We couldn't find any previous purchases to restore.",
        [{ text: "OK" }]
      );
    }
  };

  const isLoading = isPurchasing || isRestoring;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Close purchase modal"
          >
            <X size={24} color={THEME.colors.text.secondary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Sparkles size={64} color="#FFD700" strokeWidth={2.5} />
            <Text style={styles.title}>Unlock Premium</Text>
            <Text style={styles.subtitle}>Get the full campaign experience</Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>✅</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>12 Premium Levels</Text> (Levels 6-17)
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>✅</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Advanced Enemies</Text> (Spitter, Crawler, Bloater, Tank, Hive Queen)
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>✅</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Cannon Tower</Text> (AOE damage)
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureBullet}>✅</Text>
              <Text style={styles.featureText}>
                <Text style={styles.featureBold}>Epic Boss Battles</Text> (Hive Queen encounters)
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>One-time purchase</Text>
            <Text style={styles.price}>$2.99</Text>
            <Text style={styles.priceSubtext}>No subscriptions • Pay once, play forever</Text>
          </View>

          {/* Purchase Button */}
          <TouchableOpacity
            style={[styles.purchaseButton, isLoading && styles.buttonDisabled]}
            onPress={handlePurchase}
            disabled={isLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Purchase premium content for $2.99"
          >
            {isPurchasing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Unlock size={24} color="#FFFFFF" />
                <Text style={styles.purchaseButtonText}>Unlock Premium - $2.99</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Restore Button */}
          <TouchableOpacity
            style={[styles.restoreButton, isLoading && styles.buttonDisabled]}
            onPress={handleRestore}
            disabled={isLoading}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Restore previous purchase"
          >
            {isRestoring ? (
              <ActivityIndicator color={THEME.colors.text.secondary} />
            ) : (
              <>
                <RotateCcw size={20} color={THEME.colors.text.secondary} />
                <Text style={styles.restoreButtonText}>Restore Purchase</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            Endless Mode is FREE forever 🎮
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#1a1a1a",
    borderRadius: 24,
    width: "100%",
    maxWidth: 480,
    padding: 32,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFD700",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.colors.text.secondary,
  },
  features: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 16,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: THEME.colors.text.secondary,
    flex: 1,
  },
  featureBold: {
    fontWeight: "700",
    color: THEME.colors.text.primary,
  },
  priceContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  priceLabel: {
    fontSize: 14,
    color: THEME.colors.text.secondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: "900",
    color: "#FFD700",
    marginBottom: 4,
  },
  priceSubtext: {
    fontSize: 12,
    color: THEME.colors.text.secondary,
  },
  purchaseButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 12,
    marginBottom: 16,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  restoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  restoreButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: THEME.colors.text.secondary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: THEME.colors.text.secondary,
    marginTop: 16,
  },
});
