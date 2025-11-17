import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@/constants/ui/theme';

/**
 * # Spacing Scale
 *
 * Consistent spacing system for margins, padding, and gaps.
 * Based on 4px grid system (xs: 4px → xxl: 48px).
 *
 * ## Usage
 * ```typescript
 * import { THEME } from '@/constants/ui/theme';
 *
 * padding: THEME.spacing.md           // 16px
 * gap: THEME.spacing.lg               // 24px
 * marginBottom: THEME.spacing.xs      // 4px
 * ```
 */
const meta = {
  title: 'Foundations/Spacing',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Spacing Scale
 * Six spacing values from xs (4px) to xxl (48px).
 */
export const SpacingScale: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Spacing Scale</Text>
      <Text style={styles.description}>
        All spacing values are based on a 4px grid system for visual consistency.
      </Text>

      <View style={styles.scaleGrid}>
        <View style={styles.scaleItem}>
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleName}>xs</Text>
            <Text style={styles.scaleValue}>4px</Text>
          </View>
          <View style={[styles.spacingBox, { width: THEME.spacing.xs }]} />
        </View>

        <View style={styles.scaleItem}>
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleName}>sm</Text>
            <Text style={styles.scaleValue}>8px</Text>
          </View>
          <View style={[styles.spacingBox, { width: THEME.spacing.sm }]} />
        </View>

        <View style={styles.scaleItem}>
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleName}>md</Text>
            <Text style={styles.scaleValue}>16px</Text>
          </View>
          <View style={[styles.spacingBox, { width: THEME.spacing.md }]} />
        </View>

        <View style={styles.scaleItem}>
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleName}>lg</Text>
            <Text style={styles.scaleValue}>24px</Text>
          </View>
          <View style={[styles.spacingBox, { width: THEME.spacing.lg }]} />
        </View>

        <View style={styles.scaleItem}>
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleName}>xl</Text>
            <Text style={styles.scaleValue}>32px</Text>
          </View>
          <View style={[styles.spacingBox, { width: THEME.spacing.xl }]} />
        </View>

        <View style={styles.scaleItem}>
          <View style={styles.scaleInfo}>
            <Text style={styles.scaleName}>xxl</Text>
            <Text style={styles.scaleValue}>48px</Text>
          </View>
          <View style={[styles.spacingBox, { width: THEME.spacing.xxl }]} />
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Padding Examples
 * Common padding patterns using the spacing scale.
 */
export const PaddingExamples: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Padding Examples</Text>

      <View style={styles.examplesGrid}>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>padding: sm (8px)</Text>
          <View style={[styles.paddingExample, { padding: THEME.spacing.sm }]}>
            <View style={styles.content}>
              <Text style={styles.contentText}>Content</Text>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>padding: md (16px)</Text>
          <View style={[styles.paddingExample, { padding: THEME.spacing.md }]}>
            <View style={styles.content}>
              <Text style={styles.contentText}>Content</Text>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>padding: lg (24px)</Text>
          <View style={[styles.paddingExample, { padding: THEME.spacing.lg }]}>
            <View style={styles.content}>
              <Text style={styles.contentText}>Content</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Gap Examples
 * Flexbox gap spacing between elements.
 */
export const GapExamples: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Gap Examples</Text>

      <View style={styles.examplesGrid}>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>gap: xs (4px)</Text>
          <View style={[styles.gapExample, { gap: THEME.spacing.xs }]}>
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>gap: sm (8px)</Text>
          <View style={[styles.gapExample, { gap: THEME.spacing.sm }]}>
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>gap: md (16px)</Text>
          <View style={[styles.gapExample, { gap: THEME.spacing.md }]}>
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>gap: lg (24px)</Text>
          <View style={[styles.gapExample, { gap: THEME.spacing.lg }]}>
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
            <View style={styles.gapItem} />
          </View>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## Component Spacing
 * Real-world component spacing examples.
 */
export const ComponentSpacing: Story = {
  render: () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Component Spacing</Text>

      <View style={styles.examplesGrid}>
        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Card with md padding & sm gap</Text>
          <View style={styles.cardExample}>
            <Text style={styles.cardTitle}>Level 1: First Contact</Text>
            <Text style={styles.cardDescription}>Your first encounter with the undead horde</Text>
            <View style={styles.cardStats}>
              <Text style={styles.cardStat}>⭐⭐⭐</Text>
              <Text style={styles.cardStat}>Easy</Text>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Button group with md gap</Text>
          <View style={[styles.buttonGroup, { gap: THEME.spacing.md }]}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </View>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Continue</Text>
            </View>
          </View>
        </View>

        <View style={styles.exampleCard}>
          <Text style={styles.exampleLabel}>Stat row with lg gap</Text>
          <View style={[styles.statRow, { gap: THEME.spacing.lg }]}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>1250</Text>
              <Text style={styles.statLabel}>Scrap</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>87%</Text>
              <Text style={styles.statLabel}>Hull</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Wave</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  ),
};

/**
 * ## All Spacing
 * Complete spacing system in one view.
 */
export const AllSpacing: Story = {
  render: () => (
    <View style={styles.allSpacingContainer}>
      <SpacingScale.render />
      <View style={styles.divider} />
      <PaddingExamples.render />
      <View style={styles.divider} />
      <GapExamples.render />
      <View style={styles.divider} />
      <ComponentSpacing.render />
    </View>
  ),
};

const styles = StyleSheet.create({
  allSpacingContainer: {
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

  // Spacing scale
  scaleGrid: {
    gap: THEME.spacing.md,
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
  },
  scaleInfo: {
    minWidth: 80,
  },
  scaleName: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  scaleValue: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
    fontFamily: 'monospace',
  },
  spacingBox: {
    height: 40,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
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

  // Padding examples
  paddingExample: {
    backgroundColor: THEME.colors.background.tertiary,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
    borderRadius: THEME.borderRadius.sm,
  },
  content: {
    backgroundColor: THEME.colors.primary,
    padding: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.sm,
  },
  contentText: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.primary,
    textAlign: 'center',
  },

  // Gap examples
  gapExample: {
    flexDirection: 'row',
  },
  gapItem: {
    flex: 1,
    height: 40,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.sm,
  },

  // Component examples
  cardExample: {
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.background.elevated,
    borderRadius: THEME.borderRadius.lg,
    gap: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
  },
  cardTitle: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },
  cardDescription: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.tertiary,
  },
  cardStats: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  cardStat: {
    fontSize: THEME.typography.fontSize.sm,
    color: THEME.colors.text.secondary,
  },

  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.typography.fontSize.xl,
    fontWeight: THEME.typography.fontWeight.bold,
    color: THEME.colors.text.primary,
  },
  statLabel: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
    textTransform: 'uppercase',
  },
});
