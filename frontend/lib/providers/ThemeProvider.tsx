'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Типы для провайдера тем
 */
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  readonly theme: Theme;
  readonly effectiveTheme: 'light' | 'dark';
  readonly setTheme: (theme: Theme) => void;
  readonly toggleTheme: () => void;
}

interface ThemeProviderProps {
  readonly children: React.ReactNode;
  readonly defaultTheme?: Theme;
  readonly storageKey?: string;
}

/**
 * Контекст для управления темами
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Хук для использования контекста тем
 * @returns контекст управления темами
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme должен использоваться внутри ThemeProvider');
  }
  return context;
};

/**
 * Получает системную тему
 * @returns 'dark' или 'light' в зависимости от системных настроек
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light';
};

/**
 * Получает эффективную тему (разрешает 'system' в конкретную тему)
 * @param theme - выбранная тема
 * @returns 'light' или 'dark'
 */
const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

/**
 * Провайдер тем для управления светлой/темной темой
 * @param children - дочерние компоненты
 * @param defaultTheme - тема по умолчанию
 * @param storageKey - ключ для сохранения темы в localStorage
 * @returns JSX элемент провайдера
 */
export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'blog-theme'
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  
  // Инициализация темы из localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, [storageKey]);
  
  // Обновление эффективной темы при изменении темы или системных настроек
  useEffect(() => {
    const updateEffectiveTheme = () => {
      const newEffectiveTheme = getEffectiveTheme(theme);
      setEffectiveTheme(newEffectiveTheme);
      
      // Применение темы к документу
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(newEffectiveTheme);
      
      // Обновление цвета theme-color для мобильных браузеров
      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute(
          'content', 
          newEffectiveTheme === 'dark' ? '#1f2937' : '#ffffff'
        );
      }
    };
    
    updateEffectiveTheme();
    
    // Слушаем изменения системной темы
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateEffectiveTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  /**
   * Устанавливает новую тему
   * @param newTheme - новая тема
   */
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };
  
  /**
   * Переключает между светлой и темной темой
   */
  const toggleTheme = () => {
    const currentEffective = getEffectiveTheme(theme);
    const newTheme = currentEffective === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  const value: ThemeContextType = {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Компонент переключателя тем
 */
export const ThemeToggle = () => {
  const { theme, effectiveTheme, setTheme } = useTheme();
  
  const themeOptions = [
    { value: 'light' as const, label: 'Светлая', icon: '☀️' },
    { value: 'dark' as const, label: 'Темная', icon: '🌙' },
    { value: 'system' as const, label: 'Системная', icon: '💻' }
  ];
  
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {themeOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            theme === option.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          aria-label={`Переключить на ${option.label.toLowerCase()} тему`}
        >
          <span>{option.icon}</span>
          <span className="hidden sm:inline">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * Простая кнопка переключения темы
 */
export const SimpleThemeToggle = () => {
  const { effectiveTheme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      aria-label="Переключить тему"
    >
      {effectiveTheme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}; 