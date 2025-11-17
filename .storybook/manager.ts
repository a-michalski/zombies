import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Zombie Fleet Bastion',
  brandUrl: 'https://github.com/a-michalski/zombies',
  brandTarget: '_blank',

  colorPrimary: '#4A90E2',
  colorSecondary: '#4CAF50',

  // UI
  appBg: '#0a0a0a',
  appContentBg: '#1a1a1a',
  appBorderColor: '#333333',
  appBorderRadius: 8,

  // Text colors
  textColor: '#FFFFFF',
  textInverseColor: '#000000',

  // Toolbar default and active colors
  barTextColor: '#CCCCCC',
  barSelectedColor: '#4CAF50',
  barBg: '#1a1a1a',

  // Form colors
  inputBg: '#2a2a2a',
  inputBorder: '#333333',
  inputTextColor: '#FFFFFF',
  inputBorderRadius: 8,
});

addons.setConfig({
  theme,
  panelPosition: 'right',
  showPanel: true,
});
