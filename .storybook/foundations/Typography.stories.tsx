import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@/constants/ui/theme';

/**
 * # Typography System
 *
 * Font size scale, weights, and line heights for Zombie Fleet Bastion.
 *
 * ## Usage
 * ```typescript
 * import { THEME } from '@/constants/ui/theme';
 *
 * fontSize: THEME.typography.fontSize.md
 * fontWeight: THEME.typography.fontWeight.bold
 * lineHeight: THEME.typography.fontSize.md * THEME.typography.lineHeight.normal
 * ```
 */
const meta = {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Font Size Scale
 * Seven sizes from xs (12px) to huge (48px) for different UI contexts.
 */
export const FontSizes: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Font Size Scale</Text>

      <View style={styles.typeScale}>
        <View style={styles.scaleItem}>
          <Text style={[styles.scaleLabel, styles.xs]}>xs - 12px</Text>
          <Text style={styles.xs}>Version text, small labels</Text>
        </View>

        <View style={styles.scaleItem}>
          <Text style={[styles.scaleLabel, styles.sm]}>sm - 14px</Text>
          <Text style={styles.sm}>Stats, descriptions, body text</Text>
        </View>

        <View style={styles.scaleItem}>
          <Text style={[styles.scaleLabel, styles.md]}>md - 16px</Text>
          <Text style={styles.md}>Button text, standard body</Text>
        </View>

        <View style={styles.scaleItem}>
          <Text style={[styles.scaleLabel, styles.lg]}>lg - 18px</Text>
          <Text style={styles.lg}>Large body, tap to continue</Text>
        </View>

        <View style={styles.scaleItem}>
          <Text style={[styles.scaleLabel, styles.xl]}>xl - 24px</Text>
          <Text style={styles.xl}>Section headings</Text>
        </View>

        <View style={styles.scaleItem}>
          <Text style={[styles.scaleLabel, styles.xxl]}>xxl - 32px</Text>
          <Text style={styles.xxl}>Large headings</Text>
        </View>

        <View style={styles.scaleItem}>
          <Text style={[styles.scaleLabel, styles.huge]}>huge - 48px</Text>
          <Text style={styles.huge}>ZOMBIE FLEET</Text>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Font Weights
 * Five weight variants for creating visual hierarchy.
 */
export const FontWeights: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Font Weights</Text>

      <View style={styles.weightGrid}>
        <View style={styles.weightItem}>
          <Text style={[styles.weightLabel, styles.normal]}>normal - 400</Text>
          <Text style={[styles.weightSample, styles.normal]}>
            The quick brown fox jumps over the lazy dog
          </Text>
        </View>

        <View style={styles.weightItem}>
          <Text style={[styles.weightLabel, styles.semibold]}>semibold - 600</Text>
          <Text style={[styles.weightSample, styles.semibold]}>
            The quick brown fox jumps over the lazy dog
          </Text>
        </View>

        <View style={styles.weightItem}>
          <Text style={[styles.weightLabel, styles.bold]}>bold - 700</Text>
          <Text style={[styles.weightSample, styles.bold]}>
            The quick brown fox jumps over the lazy dog
          </Text>
        </View>

        <View style={styles.weightItem}>
          <Text style={[styles.weightLabel, styles.extrabold]}>extrabold - 800</Text>
          <Text style={[styles.weightSample, styles.extrabold]}>
            The quick brown fox jumps over the lazy dog
          </Text>
        </View>

        <View style={styles.weightItem}>
          <Text style={[styles.weightLabel, styles.black]}>black - 900</Text>
          <Text style={[styles.weightSample, styles.black]}>
            The quick brown fox jumps over the lazy dog
          </Text>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Line Heights
 * Three line height variants for different reading contexts.
 */
export const LineHeights: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Line Heights</Text>

      <View style={styles.lineHeightGrid}>
        <View style={styles.lineHeightItem}>
          <Text style={styles.lineHeightLabel}>Tight - 1.2</Text>
          <Text style={[styles.lineHeightSample, styles.tightLineHeight]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </View>

        <View style={styles.lineHeightItem}>
          <Text style={styles.lineHeightLabel}>Normal - 1.5</Text>
          <Text style={[styles.lineHeightSample, styles.normalLineHeight]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </View>

        <View style={styles.lineHeightItem}>
          <Text style={styles.lineHeightLabel}>Relaxed - 1.75</Text>
          <Text style={[styles.lineHeightSample, styles.relaxedLineHeight]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation.
          </Text>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Typography Examples
 * Real-world examples showing combined font properties.
 */
export const Examples: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Typography Examples</Text>

      <View style={styles.examplesGrid}>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Page Title</Text>
          <Text style={styles.pageTitle}>ZOMBIE FLEET BASTION</Text>
          <Text style={styles.exampleCode}>huge (48px) • black (900)</Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Section Heading</Text>
          <Text style={styles.sectionHeading}>Campaign Levels</Text>
          <Text style={styles.exampleCode}>xl (24px) • bold (700)</Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Button Text</Text>
          <View style={styles.buttonExample}>
            <Text style={styles.buttonText}>START GAME</Text>
          </View>
          <Text style={styles.exampleCode}>md (16px) • semibold (600)</Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Body Text</Text>
          <Text style={styles.bodyText}>
            Defend your ship against waves of zombie enemies.
            Build towers, upgrade defenses, and survive as long as you can.
          </Text>
          <Text style={styles.exampleCode}>sm (14px) • normal (400) • lineHeight: normal</Text>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Helper Text</Text>
          <Text style={styles.helperText}>Tap anywhere to continue</Text>
          <Text style={styles.exampleCode}>xs (12px) • normal (400)</Text>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## All Typography
 * Complete typography system in one view.
 */
export const AllTypography: Story = {
  render: () => (
    <View style={styles.allTypographyContainer}>
      <FontSizes.render />
      <View style={styles.divider} />
      <FontWeights.render />
      <View style={styles.divider} />
      <LineHeights.render />
      <View style={styles.divider} />
      <Examples.render />
    </View>
  ),
};

const styles = StyleSheet.create({
  allTypographyContainer: {
    gap: THEME.spacing.xl,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border.default,
    marginVertical: THEME.spacing.lg,
  },

  // Font sizes
  typeScale: {
    gap: THEME.spacing.md,
  },
  scaleItem: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
  },
  scaleLabel: {
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  xs: { fontSize: THEME.typography.fontSize.xs, color: THEME.colors.text.primary },
  sm: { fontSize: THEME.typography.fontSize.sm, color: THEME.colors.text.primary },
  md: { fontSize: THEME.typography.fontSize.md, color: THEME.colors.text.primary },
  lg: { fontSize: THEME.typography.fontSize.lg, color: THEME.colors.text.primary },
  xl: { fontSize: THEME.typography.fontSize.xl, color: THEME.colors.text.primary },
  xxl: { fontSize: THEME.typography.fontSize.xxl, color: THEME.colors.text.primary },
  huge: { fontSize: THEME.typography.fontSize.huge, color: THEME.colors.text.primary },

  // Font weights
  weightGrid: {
    gap: THEME.spacing.md,
  },
  weightItem: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
  },
  weightLabel: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.xs,
  },
  weightSample: {
    fontSize: THEME.typography.fontSize.lg,
    color: THEME.colors.text.primary,
  },
  normal: { fontWeight: THEME.typography.fontWeight.normal },
  semibold: { fontWeight: THEME.typography.fontWeight.semibold },
  bold: { fontWeight: THEME.typography.fontWeight.bold },
  extrabold: { fontWeight: THEME.typography.fontWeight.extrabold },
  black: { fontWeight: THEME.typography.fontWeight.black },

  // Line heights
  lineHeightGrid: {
    gap: THEME.spacing.md,
  },
  lineHeightItem: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
  },
  lineHeightLabel: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.sm,
  },
  lineHeightSample: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.primary,
  },
  tightLineHeight: {
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.tight,
  },
  normalLineHeight: {
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.normal,
  },
  relaxedLineHeight: {
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.relaxed,
  },

  // Examples
  examplesGrid: {
    gap: THEME.spacing.md,
  },
  exampleCard: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
  },
  exampleLabel: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.tertiary,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing.sm,
    letterSpacing: 1,
  },
  exampleCode: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    fontFamily: 'monospace',
    marginTop: THEME.spacing.sm,
  },
  pageTitle: {
    fontSize: THEME.typography.fontSize.huge,
    fontWeight: THEME.typography.fontWeight.black,
    color: THEME.colors.text.primary,
  },
  sectionHeading: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
  },
  buttonExample: {
    backgroundColor: THEME.colors.success,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.md,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  bodyText: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.normal,
    color: THEME.colors.text.primary,
    lineHeight: THEME.typography.fontSize.sm * THEME.typography.lineHeight.normal,
  },
  helperText: {
    fontSize: THEME.typography.fontSize.xs,
    fontWeight: THEME.typography.fontWeight.normal,
    color: THEME.colors.text.tertiary,
  },
});
