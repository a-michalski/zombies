/**
 * Auth Form Input Component
 * Created: 2025-11-19
 *
 * Reusable styled input component for authentication forms
 * Supports email, password, and text input types with error states
 */

import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInputProps,
} from 'react-native';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { THEME } from '@/constants/ui/theme';

export interface AuthFormInputProps extends Omit<TextInputProps, 'onChange'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  type?: 'email' | 'password' | 'text';
  disabled?: boolean;
  showIcon?: boolean;
  helperText?: string;
  testID?: string;
}

export default function AuthFormInput({
  label,
  value,
  onChangeText,
  error,
  type = 'text',
  disabled = false,
  showIcon = true,
  helperText,
  testID,
  ...textInputProps
}: AuthFormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Determine icon based on type
  const renderIcon = () => {
    if (!showIcon) return null;

    const iconColor = error
      ? THEME.colors.danger
      : isFocused
      ? THEME.colors.primary
      : THEME.colors.text.tertiary;
    const iconSize = 20;

    switch (type) {
      case 'email':
        return <Mail size={iconSize} color={iconColor} />;
      case 'password':
        return <Lock size={iconSize} color={iconColor} />;
      case 'text':
      default:
        return <User size={iconSize} color={iconColor} />;
    }
  };

  // Determine keyboard type
  const keyboardType = type === 'email' ? 'email-address' : 'default';

  // Determine secure text entry
  const secureTextEntry = type === 'password' && !showPassword;

  // Border color based on state
  const borderColor = error
    ? THEME.colors.danger
    : isFocused
    ? THEME.colors.primary
    : THEME.colors.border.default;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          { borderColor },
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {renderIcon()}

        <TextInput
          style={[styles.input, disabled && styles.inputDisabled]}
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={THEME.colors.text.disabled}
          keyboardType={keyboardType}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
          accessible={true}
          accessibilityLabel={label}
          accessibilityHint={helperText}
          {...textInputProps}
        />

        {type === 'password' && value.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            activeOpacity={0.7}
            accessible={true}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
          >
            {showPassword ? (
              <EyeOff size={20} color={THEME.colors.text.tertiary} />
            ) : (
              <Eye size={20} color={THEME.colors.text.tertiary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && <Text style={styles.helperText}>{helperText}</Text>}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background.secondary,
    borderWidth: 2,
    borderRadius: THEME.borderRadius.sm,
    paddingHorizontal: THEME.spacing.md,
    minHeight: THEME.touchTarget.recommended,
  },
  inputContainerDisabled: {
    backgroundColor: THEME.colors.background.tertiary,
    opacity: 0.6,
  },
  input: {
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
  inputDisabled: {
    color: THEME.colors.text.disabled,
  },
  eyeButton: {
    padding: THEME.spacing.xs,
    marginLeft: THEME.spacing.xs,
  },
  errorText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.danger,
    marginTop: THEME.spacing.xs,
    marginLeft: THEME.spacing.xs,
  },
  helperText: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    marginTop: THEME.spacing.xs,
    marginLeft: THEME.spacing.xs,
  },
});
