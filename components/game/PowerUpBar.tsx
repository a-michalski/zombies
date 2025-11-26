/**
 * PowerUpBar - Power-up buttons as vertical icons on the right side
 *
 * Displays 3 power-up buttons as clickable icons with costs, cooldowns, and visual feedback.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Zap, Clock, Wrench } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGame } from '@/contexts/GameContext';
import { POWER_UP_CONFIGS } from '@/constants/powerups';
import { PowerUpType } from '@/types/powerups';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function PowerUpBar() {
  const { gameState, usePowerUp } = useGame();
  const insets = useSafeAreaInsets();

  const handlePowerUpPress = (type: PowerUpType) => {
    usePowerUp(type);
  };

  const getPowerUpIcon = (type: PowerUpType) => {
    switch (type) {
      case 'nuke':
        return <Zap size={28} color="#FFFFFF" />;
      case 'timeFreeze':
        return <Clock size={28} color="#FFFFFF" />;
      case 'repair':
        return <Wrench size={28} color="#FFFFFF" />;
    }
  };

  return (
    <View style={[styles.container, { top: (SCREEN_HEIGHT / 2) - 100 + insets.top }]}>
      {POWER_UP_CONFIGS.map((config) => {
        const state = gameState.powerUps?.find(p => p.type === config.id);
        const canAfford = gameState.scrap >= config.cost;
        const isOnCooldown = state?.isOnCooldown || false;
        const isDisabled = !canAfford || isOnCooldown;

        return (
          <TouchableOpacity
            key={config.id}
            style={[
              styles.powerUpButton,
              { backgroundColor: config.color },
              isDisabled && styles.powerUpButtonDisabled,
            ]}
            onPress={() => handlePowerUpPress(config.id)}
            disabled={isDisabled}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${config.name} - ${config.cost} scrap`}
            accessibilityHint={config.description}
            accessibilityState={{ disabled: isDisabled }}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              {getPowerUpIcon(config.id)}
            </View>

            {/* Cost Badge */}
            <View style={styles.costBadge}>
              <Text style={styles.costText}>🔩 {config.cost}</Text>
            </View>

            {/* Cooldown Overlay */}
            {isOnCooldown && (
              <View style={styles.cooldownOverlay}>
                <Text style={styles.cooldownText}>
                  {Math.ceil(state?.remainingCooldown || 0)}
                </Text>
              </View>
            )}

            {/* Cannot Afford Indicator */}
            {!canAfford && !isOnCooldown && (
              <View style={styles.cannotAffordOverlay}>
                <Text style={styles.cannotAffordText}>💰</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute' as const,
    right: 16,
    flexDirection: 'column',
    gap: 12,
    zIndex: 100,
  },
  powerUpButton: {
    width: 64,
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  powerUpButtonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  costBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  costText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
  },
  cooldownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cooldownText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cannotAffordOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  cannotAffordText: {
    fontSize: 16,
  },
});
