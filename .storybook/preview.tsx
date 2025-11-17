import React from 'react';
import type { Preview } from '@storybook/react';
import { View, StyleSheet } from 'react-native';
import { THEME } from '../constants/ui/theme';

// Global decorator to provide theme background and styling
const ThemeDecorator = (Story: any) => (
  <View style={styles.container}>
    <Story />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background.primary,
    padding: THEME.spacing.md,
    minHeight: '100vh',
  },
});

const preview: Preview = {
  decorators: [ThemeDecorator],

  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },

    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: THEME.colors.background.primary,
        },
        {
          name: 'elevated',
          value: THEME.colors.background.elevated,
        },
        {
          name: 'secondary',
          value: THEME.colors.background.secondary,
        },
      ],
    },

    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
  },
};

export default preview;
