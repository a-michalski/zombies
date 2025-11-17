import type { Meta, StoryObj } from '@storybook/react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '@/constants/ui/theme';

/**
 * # Color Palette
 *
 * Complete color system for Zombie Fleet Bastion.
 * All colors are optimized for dark theme UI.
 *
 * ## Usage
 * ```typescript
 * import { THEME } from '@/constants/ui/theme';
 *
 * backgroundColor: THEME.colors.background.primary
 * color: THEME.colors.text.primary
 * ```
 */
const meta = {
  title: 'Foundations/Colors',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Color swatch component
interface ColorSwatchProps {
  name: string;
  color: string;
  description?: string;
}

const ColorSwatch = ({ name, color, description }: ColorSwatchProps) => (
  <View style={styles.swatchContainer}>
    <View style={[styles.colorBox, { backgroundColor: color }]} />
    <View style={styles.swatchInfo}>
      <Text style={styles.colorName}>{name}</Text>
      <Text style={styles.colorValue}>{color}</Text>
      {description && <Text style={styles.colorDescription}>{description}</Text>}
    </View>
  </View>
);

// Color section component
interface ColorSectionProps {
  title: string;
  colors: { name: string; color: string; description?: string }[];
}

const ColorSection = ({ title, colors }: ColorSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.swatchGrid}>
      {colors.map((colorData) => (
        <ColorSwatch key={colorData.name} {...colorData} />
      ))}
    </View>
  </View>
);

/**
 * ## Background Colors
 * Four levels from darkest to lightest for creating visual hierarchy.
 */
export const Backgrounds: Story = {
  render: () => (
    <ColorSection
      title="Backgrounds"
      colors={[
        { name: 'Primary', color: THEME.colors.background.primary, description: 'Main app background' },
        { name: 'Secondary', color: THEME.colors.background.secondary, description: 'Game screen, stats containers' },
        { name: 'Tertiary', color: THEME.colors.background.tertiary, description: 'Headers, footers' },
        { name: 'Elevated', color: THEME.colors.background.elevated, description: 'Modals, cards' },
      ]}
    />
  ),
};

/**
 * ## Border Colors
 * Three variants for different border contexts.
 */
export const Borders: Story = {
  render: () => (
    <ColorSection
      title="Borders & Dividers"
      colors={[
        { name: 'Default', color: THEME.colors.border.default, description: 'Primary borders, control buttons' },
        { name: 'Light', color: THEME.colors.border.light, description: 'Modal borders, lighter elements' },
        { name: 'Dark', color: THEME.colors.border.dark, description: 'Subtle dividers' },
      ]}
    />
  ),
};

/**
 * ## Text Colors
 * White to gray scale for text hierarchy.
 */
export const TextColors: Story = {
  render: () => (
    <ColorSection
      title="Text Colors"
      colors={[
        { name: 'Primary', color: THEME.colors.text.primary, description: 'Main text, headings' },
        { name: 'Secondary', color: THEME.colors.text.secondary, description: 'Subtitles, less important text' },
        { name: 'Tertiary', color: THEME.colors.text.tertiary, description: 'Helper text, labels' },
        { name: 'Disabled', color: THEME.colors.text.disabled, description: 'Disabled states' },
        { name: 'Inverse', color: THEME.colors.text.inverse, description: 'Text on light backgrounds' },
      ]}
    />
  ),
};

/**
 * ## Semantic Colors
 * Colors with specific meanings across the app.
 */
export const Semantic: Story = {
  render: () => (
    <ColorSection
      title="Semantic Colors"
      colors={[
        { name: 'Success', color: THEME.colors.success, description: 'Success states, scrap/rewards' },
        { name: 'Danger', color: THEME.colors.danger, description: 'Errors, hull damage, warnings' },
        { name: 'Warning', color: THEME.colors.warning, description: 'Caution states' },
        { name: 'Info', color: THEME.colors.info, description: 'Informational elements' },
        { name: 'Primary', color: THEME.colors.primary, description: 'Primary actions' },
      ]}
    />
  ),
};

/**
 * ## Difficulty Colors
 * Campaign-specific colors for level difficulty indicators.
 */
export const Difficulty: Story = {
  render: () => (
    <ColorSection
      title="Difficulty Colors"
      colors={[
        { name: 'Easy', color: THEME.colors.difficulty.easy, description: 'Beginner friendly' },
        { name: 'Medium', color: THEME.colors.difficulty.medium, description: 'Moderate challenge' },
        { name: 'Hard', color: THEME.colors.difficulty.hard, description: 'Expert level' },
      ]}
    />
  ),
};

/**
 * ## Star Rating Colors
 * Colors for earned vs unearned stars in campaign.
 */
export const Stars: Story = {
  render: () => (
    <ColorSection
      title="Star Rating"
      colors={[
        { name: 'Filled', color: THEME.colors.star.filled, description: 'Earned stars (gold)' },
        { name: 'Empty', color: THEME.colors.star.empty, description: 'Unearned stars (dark gray)' },
      ]}
    />
  ),
};

/**
 * ## Progression Colors
 * Level completion states in campaign map.
 */
export const Progression: Story = {
  render: () => (
    <ColorSection
      title="Progression States"
      colors={[
        { name: 'Complete', color: THEME.colors.progression.complete, description: 'Completed levels' },
        { name: 'Current', color: THEME.colors.progression.current, description: 'Active/current level' },
        { name: 'Locked', color: THEME.colors.progression.locked, description: 'Locked levels' },
      ]}
    />
  ),
};

/**
 * ## Game-Specific Colors
 * Colors for in-game resources and elements.
 */
export const GameColors: Story = {
  render: () => (
    <ColorSection
      title="Game-Specific"
      colors={[
        { name: 'Scrap', color: THEME.colors.scrap, description: 'Resource color (gold)' },
        { name: 'Hull', color: THEME.colors.hull, description: 'Hull integrity color (red)' },
      ]}
    />
  ),
};

/**
 * ## Overlay Colors
 * Semi-transparent overlays for modals and screens.
 */
export const Overlays: Story = {
  render: () => (
    <ColorSection
      title="Overlays"
      colors={[
        { name: 'Dark', color: THEME.colors.overlay.dark, description: 'rgba(0, 0, 0, 0.7) - Modal backgrounds' },
        { name: 'Darker', color: THEME.colors.overlay.darker, description: 'rgba(0, 0, 0, 0.9) - Victory/game over' },
        { name: 'Subtle', color: THEME.colors.overlay.subtle, description: 'rgba(0, 0, 0, 0.5) - Image overlays' },
      ]}
    />
  ),
};

/**
 * ## All Colors
 * Complete color palette in one view.
 */
export const AllColors: Story = {
  render: () => (
    <View style={styles.allColorsContainer}>
      <Backgrounds.render />
      <Borders.render />
      <TextColors.render />
      <Semantic.render />
      <Difficulty.render />
      <Stars.render />
      <Progression.render />
      <GameColors.render />
      <Overlays.render />
    </View>
  ),
};

const styles = StyleSheet.create({
  allColorsContainer: {
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
  swatchGrid: {
    gap: THEME.spacing.md,
  },
  swatchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
    padding: THEME.spacing.sm,
    backgroundColor: THEME.colors.background.secondary,
    borderRadius: THEME.borderRadius.sm,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: THEME.borderRadius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border.default,
  },
  swatchInfo: {
    flex: 1,
  },
  colorName: {
    fontSize: THEME.typography.fontSize.md,
    fontWeight: THEME.typography.fontWeight.semibold,
    color: THEME.colors.text.primary,
    marginBottom: 2,
  },
  colorValue: {
    fontSize: THEME.typography.fontSize.sm,
    fontWeight: THEME.typography.fontWeight.normal,
    color: THEME.colors.text.secondary,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  colorDescription: {
    fontSize: THEME.typography.fontSize.xs,
    color: THEME.colors.text.tertiary,
  },
});
