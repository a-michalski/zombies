import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../.storybook/foundations/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-react-native-web',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },

  docs: {
    autodocs: 'tag',
  },

  webpackFinal: async (config) => {
    // Add @ alias for imports
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../'),
    };

    // Ensure proper extensions resolution
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      ...(config.resolve.extensions || []),
    ];

    // Configure babel-loader for React Native Web
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Find the babel-loader rule and add react-native-web plugin
    const babelRule = config.module.rules.find(
      (rule: any) =>
        rule.test instanceof RegExp &&
        rule.test.test('.tsx') &&
        rule.use &&
        Array.isArray(rule.use)
    );

    if (babelRule && Array.isArray(babelRule.use)) {
      const babelLoader = babelRule.use.find(
        (loader: any) =>
          typeof loader === 'object' && loader.loader?.includes('babel-loader')
      );

      if (babelLoader && typeof babelLoader === 'object') {
        babelLoader.options = babelLoader.options || {};
        babelLoader.options.plugins = [
          ...(babelLoader.options.plugins || []),
          'react-native-web',
        ];
      }
    }

    return config;
  },

  staticDirs: ['../assets'],
};

export default config;
