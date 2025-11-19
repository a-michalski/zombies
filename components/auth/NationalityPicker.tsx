/**
 * Nationality Picker Component
 * Created: 2025-11-19
 *
 * Dropdown/picker component for selecting nationality
 * Shows flag emoji + country name with beautiful UI
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  TextInput,
} from 'react-native';
import { ChevronDown, Search, X } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';
import { NATIONALITIES, Nationality } from '@/types/auth';

export interface NationalityPickerProps {
  label: string;
  value: string; // ISO code
  onValueChange: (code: string) => void;
  error?: string;
  disabled?: boolean;
  testID?: string;
}

export default function NationalityPicker({
  label,
  value,
  onValueChange,
  error,
  disabled = false,
  testID,
}: NationalityPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get selected nationality
  const selectedNationality = NATIONALITIES.find((n) => n.code === value);

  // Filter nationalities based on search query
  const filteredNationalities = searchQuery.trim()
    ? NATIONALITIES.filter((n) =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : NATIONALITIES;

  const handleSelect = (code: string) => {
    onValueChange(code);
    setModalVisible(false);
    setSearchQuery('');
  };

  const borderColor = error
    ? THEME.colors.danger
    : THEME.colors.border.default;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={[
          styles.pickerButton,
          { borderColor },
          disabled && styles.pickerButtonDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.7}
        disabled={disabled}
        testID={testID}
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={`Selected: ${selectedNationality?.name || 'None'}`}
        accessibilityRole="button"
      >
        <View style={styles.pickerContent}>
          {selectedNationality ? (
            <>
              <Text style={styles.flag}>{selectedNationality.flag}</Text>
              <Text style={styles.pickerText}>{selectedNationality.name}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>Select your country</Text>
          )}
        </View>
        <ChevronDown size={20} color={THEME.colors.text.tertiary} />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal for selecting nationality */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Country</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                style={styles.closeButton}
                activeOpacity={0.7}
                accessible={true}
                accessibilityLabel="Close"
                accessibilityRole="button"
              >
                <X size={24} color={THEME.colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
              <Search size={20} color={THEME.colors.text.tertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                placeholderTextColor={THEME.colors.text.disabled}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCorrect={false}
                autoCapitalize="none"
                accessible={true}
                accessibilityLabel="Search countries"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                  activeOpacity={0.7}
                >
                  <X size={16} color={THEME.colors.text.tertiary} />
                </TouchableOpacity>
              )}
            </View>

            {/* List of nationalities */}
            <FlatList
              data={filteredNationalities}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.nationalityItem,
                    item.code === value && styles.nationalityItemSelected,
                  ]}
                  onPress={() => handleSelect(item.code)}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel={item.name}
                  accessibilityRole="button"
                >
                  <Text style={styles.nationalityFlag}>{item.flag}</Text>
                  <Text
                    style={[
                      styles.nationalityName,
                      item.code === value && styles.nationalityNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {item.code === value && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No countries found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.background.secondary,
    borderWidth: 2,
    borderRadius: THEME.borderRadius.sm,
    paddingHorizontal: THEME.spacing.md,
    minHeight: THEME.touchTarget.recommended,
    paddingVertical: THEME.spacing.sm,
  },
  pickerButtonDisabled: {
    backgroundColor: THEME.colors.background.tertiary,
    opacity: 0.6,
  },
  pickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: THEME.spacing.sm,
  },
  pickerText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
  },
  placeholderText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.disabled,
  },
  errorText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.danger,
    marginTop: THEME.spacing.xs,
    marginLeft: THEME.spacing.xs,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: THEME.colors.overlay.dark,
    justifyContent: 'flex-end',
    ...(Platform.OS === 'web' && {
      justifyContent: 'center',
      alignItems: 'center',
    }),
  },
  modalContent: {
    backgroundColor: THEME.colors.background.elevated,
    borderTopLeftRadius: THEME.borderRadius.lg,
    borderTopRightRadius: THEME.borderRadius.lg,
    paddingBottom: THEME.spacing.xl,
    maxHeight: '80%',
    ...(Platform.OS === 'web' && {
      borderRadius: THEME.borderRadius.lg,
      maxWidth: 500,
      width: '90%',
      maxHeight: '70%',
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border.default,
  },
  modalTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
  },
  closeButton: {
    padding: THEME.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
    paddingHorizontal: THEME.spacing.md,
    margin: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
    borderWidth: 2,
    borderColor: THEME.colors.border.default,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
    marginLeft: THEME.spacing.sm,
    paddingVertical: THEME.spacing.sm,
    // Remove default outline on web
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    } as any),
  },
  clearButton: {
    padding: THEME.spacing.xs,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
  },
  nationalityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.xs,
    backgroundColor: THEME.colors.background.secondary,
  },
  nationalityItemSelected: {
    backgroundColor: THEME.colors.primary + '20', // 20% opacity
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  nationalityFlag: {
    fontSize: 28,
    marginRight: THEME.spacing.md,
  },
  nationalityName: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.primary,
    flex: 1,
  },
  nationalityNameSelected: {
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.primary,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primary,
  },
  emptyContainer: {
    paddingVertical: THEME.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.tertiary,
  },
});
