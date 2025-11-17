import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@/constants/ui/theme';

/**
 * # Shadow System
 *
 * Elevation shadows for creating depth and visual hierarchy.
 * Includes both standard shadows (sm, md, lg) and colored shadows for special buttons.
 *
 * ## Usage
 * ```typescript
 * import { THEME } from '@/constants/ui/theme';
 *
 * ...THEME.shadows.md          // Standard shadow
 * ...THEME.shadows.success     // Colored shadow for success button
 * ```
 */
const meta = {
  title: 'Foundations/Shadows',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Standard Shadows
 * Three elevation levels for creating depth.
 */
export const StandardShadows: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Standard Shadows</Text>
      <Text style={styles.description}>
        Progressive shadow depths from subtle to prominent elevation.
      </Text>

      <View style={styles.shadowGrid}>
        <View style={styles.shadowCard}>
          <Text style={styles.shadowLabel}>none</Text>
          <View style={[styles.shadowBox, THEME.shadows.none]}>
            <Text style={styles.shadowBoxText}>No Shadow</Text>
          </View>
          <Text style={styles.shadowSpec}>No elevation</Text>
        </View>

        <View style={styles.shadowCard}>
          <Text style={styles.shadowLabel}>sm</Text>
          <View style={[styles.shadowBox, THEME.shadows.sm]}>
            <Text style={styles.shadowBoxText}>Small Shadow</Text>
          </View>
          <Text style={styles.shadowSpec}>
            offset: 0, 2{'\n'}
            opacity: 0.25{'\n'}
            radius: 4{'\n'}
            elevation: 2
          </Text>
        </View>

        <View style={styles.shadowCard}>
          <Text style={styles.shadowLabel}>md</Text>
          <View style={[styles.shadowBox, THEME.shadows.md]}>
            <Text style={styles.shadowBoxText}>Medium Shadow</Text>
          </View>
          <Text style={styles.shadowSpec}>
            offset: 0, 4{'\n'}
            opacity: 0.3{'\n'}
            radius: 8{'\n'}
            elevation: 4
          </Text>
        </View>

        <View style={styles.shadowCard}>
          <Text style={styles.shadowLabel}>lg</Text>
          <View style={[styles.shadowBox, THEME.shadows.lg]}>
            <Text style={styles.shadowBoxText}>Large Shadow</Text>
          </View>
          <Text style={styles.shadowSpec}>
            offset: 0, 8{'\n'}
            opacity: 0.35{'\n'}
            radius: 16{'\n'}
            elevation: 8
          </Text>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Colored Shadows
 * Special shadows for primary and success buttons.
 */
export const ColoredShadows: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Colored Shadows</Text>
      <Text style={styles.description}>
        Vibrant shadows for special interactive elements like CTA buttons.
      </Text>

      <View style={styles.shadowGrid}>
        <View style={styles.shadowCard}>
          <Text style={styles.shadowLabel}>success</Text>
          <View style={[styles.shadowBox, styles.successBox, THEME.shadows.success]}>
            <Text style={styles.shadowBoxText}>Success Button</Text>
          </View>
          <Text style={styles.shadowSpec}>
            color: #4CAF50{'\n'}
            offset: 0, 4{'\n'}
            opacity: 0.4{'\n'}
            radius: 8{'\n'}
            elevation: 6
          </Text>
        </View>

        <View style={styles.shadowCard}>
          <Text style={styles.shadowLabel}>primary</Text>
          <View style={[styles.shadowBox, styles.primaryBox, THEME.shadows.primary]}>
            <Text style={styles.shadowBoxText}>Primary Button</Text>
          </View>
          <Text style={styles.shadowSpec}>
            color: #4A90E2{'\n'}
            offset: 0, 4{'\n'}
            opacity: 0.4{'\n'}
            radius: 8{'\n'}
            elevation: 6
          </Text>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Shadow Comparison
 * Side-by-side comparison of all shadow levels.
 */
export const ShadowComparison: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Shadow Comparison</Text>

      <View style={styles.comparisonGrid}>
        <View style={[styles.comparisonBox, THEME.shadows.none]}>
          <Text style={styles.comparisonText}>none</Text>
        </View>
        <View style={[styles.comparisonBox, THEME.shadows.sm]}>
          <Text style={styles.comparisonText}>sm</Text>
        </View>
        <View style={[styles.comparisonBox, THEME.shadows.md]}>
          <Text style={styles.comparisonText}>md</Text>
        </View>
        <View style={[styles.comparisonBox, THEME.shadows.lg]}>
          <Text style={styles.comparisonText}>lg</Text>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Component Examples
 * Real-world shadow usage in UI components.
 */
export const ComponentExamples: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Component Examples</Text>

      <View style={styles.examplesGrid}>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Card with md shadow</Text>
          <View style={styles.cardExample}>
            <Text style={styles.cardTitle}>Level 1: First Contact</Text>
            <Text style={styles.cardDescription}>Your first encounter with the undead horde</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardDifficulty}>Easy</Text>
              <Text style={styles.cardStars}>⭐⭐⭐</Text>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Success button with colored shadow</Text>
          <View style={styles.successButton}>
            <Text style={styles.buttonText}>START GAME</Text>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Primary button with colored shadow</Text>
          <View style={styles.primaryButton}>
            <Text style={styles.buttonText}>CONTINUE</Text>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Modal with lg shadow</Text>
          <View style={styles.modalExample}>
            <Text style={styles.modalTitle}>Game Paused</Text>
            <Text style={styles.modalText}>Resume or return to menu?</Text>
            <View style={styles.modalButtons}>
              <View style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Resume</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## All Shadows
 * Complete shadow system in one view.
 */
export const AllShadows: Story = {
  render: () => (
    <View style={styles.allShadowsContainer}>
      <StandardShadows.render />
      <View style={styles.divider} />
      <ColoredShadows.render />
      <View style={styles.divider} />
      <ShadowComparison.render />
      <View style={styles.divider} />
      <ComponentExamples.render />
    </View>
  ),
};

const styles = StyleSheet.create({
  allShadowsContainer: {
    gap: THEME.spacing.xl,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
  },
  description: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border.default,
    marginVertical: THEME.spacing.lg,
  },

  // Shadow grid
  shadowGrid: {
    gap: THEME.spacing.xl,
  },
  shadowCard: {
    alignItems: 'center',
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
  },
  shadowLabel: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  shadowBox: {
    width: 200,
    height: 100,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  successBox: {
    backgroundColor: THEME.colors.success,
  },
  primaryBox: {
    backgroundColor: THEME.colors.primary,
  },
  shadowBoxText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  shadowSpec: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: THEME.typography.fontSize.xs * 1.5,
  },

  // Comparison
  comparisonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.lg,
    justifyContent: 'center',
  },
  comparisonBox: {
    width: 120,
    height: 120,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },

  // Examples
  examplesGrid: {
    gap: THEME.spacing.lg,
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
    marginBottom: THEME.spacing.md,
    letterSpacing: 1,
  },

  cardExample: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    ...THEME.shadows.md,
  },
  cardTitle: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.xs,
  },
  cardDescription: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    marginBottom: THEME.spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDifficulty: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.difficulty.easy,
    fontWeight: THEME.typography.fontWeight.semibold,
  },
  cardStars: {
    fontSize: THEME.typography.fontSize.sm,
  },

  successButton: {
    backgroundColor: THEME.colors.success,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.md,
    alignSelf: 'flex-start',
    ...THEME.shadows.success,
  },
  primaryButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: THEME.borderRadius.md,
    alignSelf: 'flex-start',
    ...THEME.shadows.primary,
  },
  buttonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },

  modalExample: {
    backgroundColor: THEME.colors.background.elevated,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    ...THEME.shadows.lg,
  },
  modalTitle: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.sm,
    textAlign: 'center',
  },
  modalText: {
    fontSize: THEME.typography.fontSize.md,
    color: THEME.colors.text.secondary,
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  modalButtons: {
    gap: THEME.spacing.sm,
  },
  modalButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    ...THEME.shadows.sm,
  },
  modalButtonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
});
