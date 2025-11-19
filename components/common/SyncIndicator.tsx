/**
 * Sync Indicator Component
 * Shows cloud sync status to user
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Cloud, CloudOff, CheckCircle, AlertCircle } from 'lucide-react-native';
import { SyncStatus } from '@/lib/cloudSync';

interface SyncIndicatorProps {
  status: SyncStatus;
  compact?: boolean;
}

export function SyncIndicator({ status, compact = false }: SyncIndicatorProps) {
  const getIcon = () => {
    switch (status) {
      case 'syncing':
        return <ActivityIndicator size="small" color="#4CAF50" />;
      case 'synced':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'error':
        return <AlertCircle size={16} color="#FF4444" />;
      case 'offline':
        return <CloudOff size={16} color="#999999" />;
      default:
        return <Cloud size={16} color="#999999" />;
    }
  };

  const getText = () => {
    switch (status) {
      case 'syncing':
        return 'Syncing...';
      case 'synced':
        return 'Synced';
      case 'error':
        return 'Sync failed';
      case 'offline':
        return 'Offline';
      default:
        return '';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'synced':
        return '#4CAF50';
      case 'error':
        return '#FF4444';
      case 'offline':
        return '#999999';
      default:
        return '#666666';
    }
  };

  if (compact) {
    return <View style={styles.compactContainer}>{getIcon()}</View>;
  }

  return (
    <View style={styles.container}>
      {getIcon()}
      <Text style={[styles.text, { color: getColor() }]}>{getText()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
  },
  compactContainer: {
    padding: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
