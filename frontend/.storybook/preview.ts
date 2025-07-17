/**
 * Storybook preview конфигурация
 * @description Глобальные настройки, декораторы и параметры
 */

import type { Preview } from '@storybook/react';
import '../styles/globals.css';

const preview: Preview = {
  // Глобальные параметры
  parameters: {
    // Actions addon
    actions: { argTypesRegex: '^on[A-Z].*' },
    
    // Controls addon
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    // Backgrounds addon
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
      ],
    },

    // Viewport addon
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '360px',
            height: '640px',
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
            width: '1440px',
            height: '900px',
          },
        },
      },
    },

    // Docs addon
    docs: {
      story: {
        height: '400px',
      },
    },

    // Layout параметры
    layout: 'centered',
  },

  // Глобальные arg types
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS классы для стилизации',
    },
    children: {
      control: 'text',
      description: 'Дочерние элементы',
    },
    onClick: {
      action: 'clicked',
      description: 'Обработчик клика',
    },
  },

  // Глобальные args
  args: {
    // Значения по умолчанию для всех stories
  },

  // Глобальные декораторы
  decorators: [
    (Story) => (
      <div className="storybook-decorator">
        <Story />
      </div>
    ),
  ],

  // Теги для автодокументации
  tags: ['autodocs'],
};

export default preview; 