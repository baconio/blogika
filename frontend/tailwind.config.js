/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Кастомная палитра для блоговой платформы
      colors: {
        // Основные цвета блога
        blog: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe', 
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9', // Основной синий
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
          },
          secondary: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a', // Серый для текста
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
          },
          accent: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444', // Красный для акцентов
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
          success: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e', // Зеленый для успеха
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b', // Оранжевый для предупреждений
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
        },
        // Монетизация
        premium: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef', // Фиолетовый для премиум
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      // Типографика для блога
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      // Кастомные размеры для блога
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Анимации для лучшего UX
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'), // Для красивой типографики статей
  ],
  
  // Конфигурация DaisyUI
  daisyui: {
    themes: [
      {
        // Светлая тема блога
        blogLight: {
          'primary': '#0ea5e9',
          'primary-focus': '#0284c7', 
          'primary-content': '#ffffff',
          
          'secondary': '#71717a',
          'secondary-focus': '#52525b',
          'secondary-content': '#ffffff',
          
          'accent': '#ef4444',
          'accent-focus': '#dc2626',
          'accent-content': '#ffffff',
          
          'neutral': '#3f3f46',
          'neutral-focus': '#27272a',
          'neutral-content': '#ffffff',
          
          'base-100': '#ffffff',
          'base-200': '#f4f4f5',
          'base-300': '#e4e4e7',
          'base-content': '#18181b',
          
          'info': '#0ea5e9',
          'success': '#22c55e',
          'warning': '#f59e0b', 
          'error': '#ef4444',
          
          // Кастомные переменные для блога
          '--rounded-box': '0.75rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-text-case': 'uppercase',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        },
        
        // Темная тема блога
        blogDark: {
          'primary': '#38bdf8',
          'primary-focus': '#0ea5e9',
          'primary-content': '#0c4a6e',
          
          'secondary': '#a1a1aa',
          'secondary-focus': '#71717a',
          'secondary-content': '#18181b',
          
          'accent': '#f87171',
          'accent-focus': '#ef4444',
          'accent-content': '#18181b',
          
          'neutral': '#52525b',
          'neutral-focus': '#3f3f46',
          'neutral-content': '#f4f4f5',
          
          'base-100': '#18181b',
          'base-200': '#27272a',
          'base-300': '#3f3f46',
          'base-content': '#f4f4f5',
          
          'info': '#38bdf8',
          'success': '#4ade80',
          'warning': '#fbbf24',
          'error': '#f87171',
          
          // Кастомные переменные для темной темы
          '--rounded-box': '0.75rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '1.9rem',
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          '--btn-text-case': 'uppercase',
          '--btn-focus-scale': '0.95',
          '--border-btn': '1px',
          '--tab-border': '1px',
          '--tab-radius': '0.5rem',
        }
      },
      'light', // Fallback светлая тема
      'dark',  // Fallback темная тема
    ],
    
    // Настройки DaisyUI
    darkTheme: 'blogDark',
    base: true,
    styled: true,
    utils: true,
    rtl: false,
    prefix: '',
    logs: true,
  },
}; 