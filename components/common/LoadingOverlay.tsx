/**
 * Loading Overlay Component
 * Full-screen loading indicator with message
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { Skull } from 'lucide-react-native';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
}

export function LoadingOverlay({
  visible,
  message = 'Loading...',
  transparent = false,
}: LoadingOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslate={false}
    >
      <View
        style={[
          styles.container,
          transparent && styles.containerTransparent,
        ]}
      >
        <View style={styles.content}>
          <Skull size={48} color="#4CAF50" strokeWidth={2} />

          <ActivityIndicator
            size="large"
            color="#4CAF50"
            style={styles.spinner}
          />

          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerTransparent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 32,
    borderRadius: 16,
    minWidth: 200,
  },
  spinner: {
    marginTop: 24,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});
