/**
 * PowerUpBar - Power-up buttons HUD
 *
 * Displays 3 power-up buttons with costs, cooldowns, and visual feedback.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Zap, Clock, Wrench } from 'lucide-react-native';

import { useGame } from '@/contexts/GameContext';
import { POWER_UP_CONFIGS } from '@/constants/powerups';
import { PowerUpType } from '@/types/powerups';

export function PowerUpBar() {
  const { gameState, usePowerUp } = useGame();

  const handlePowerUpPress = (type: PowerUpType) => {
    usePowerUp(type);
  };

  const getPowerUpIcon = (type: PowerUpType) => {
    switch (type) {
      case 'nuke':
        return <Zap size={24} color="#FFFFFF" />;
      case 'timeFreeze':
        return <Clock size={24} color="#FFFFFF" />;
      case 'repair':
        return <Wrench size={24} color="#FFFFFF" />;
    }
  };

  return (
    <View style={styles.container}>
      {POWER_UP_CONFIGS.map((config) => {
        const state = gameState.powerUps.find(p => p.type === config.id);
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

            {/* Name */}
            <Text style={styles.powerUpName} numberOfLines={1}>
              {config.name}
            </Text>

            {/* Cost */}
            <View style={styles.costContainer}>
              <Text style={styles.costText}>🔩 {config.cost}</Text>
            </View>

            {/* Cooldown Overlay */}
            {isOnCooldown && (
              <View style={styles.cooldownOverlay}>
                <Text style={styles.cooldownText}>
                  {Math.ceil(state?.remainingCooldown || 0)}s
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
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
  powerUpButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
    minHeight: 90,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  powerUpButtonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    marginBottom: 2,
  },
  powerUpName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  costContainer: {
    marginTop: 2,
  },
  costText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cooldownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cooldownText: {
    fontSize: 24,
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
