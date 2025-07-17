/**
 * Storybook конфигурация для блоговой платформы
 * @description Настройка для документации UI компонентов
 */

import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  // Поиск stories файлов
  stories: [
    '../components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],

  // Аддоны для функциональности
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-a11y'
  ],

  // Framework конфигурация
  framework: {
    name: '@storybook/nextjs',
    options: {
      // Next.js опции
      nextConfigPath: '../next.config.js'
    }
  },

  // TypeScript конфигурация
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  // Docs конфигурация
  docs: {
    autodocs: 'tag',
    defaultName: 'Documentation'
  },

  // Статические файлы
  staticDirs: ['../public'],

  // Webpack кастомизация
  webpackFinal: async (config) => {
    // Alias для абсолютных импортов
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': '../',
      };
    }

    return config;
  },

  // Babel конфигурация
  babel: async (options) => {
    return {
      ...options,
      presets: [
        ...options.presets,
        '@babel/preset-typescript'
      ]
    };
  }
};

export default config; 