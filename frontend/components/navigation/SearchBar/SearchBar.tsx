/**
 * SearchBar компонент с автодополнением для блоговой платформы
 * Client Component с debounce и клавиатурной навигацией
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/components/ui';
import { useSearch } from '@/hooks';
import type { 
  SearchBarProps, 
  SearchResult, 
  SearchState 
} from './SearchBar.types';
import { DEFAULT_SEARCH_CONFIG } from './SearchBar.types';

/**
 * Иконка поиска
 */
const SearchIcon = () => (
  <svg 
    className="w-4 h-4 text-base-content/50" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
);

/**
 * Результат поиска
 */
const SearchResultItem = ({ 
  result, 
  isSelected, 
  onClick 
}: { 
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'category': return '📁';
      case 'tag': return '🏷️';
      case 'author': return '👤';
      default: return '🔍';
    }
  };

  return (
    <Link
      href={result.href}
      onClick={onClick}
      className={cn(
        'flex items-center space-x-3 px-4 py-2 text-sm transition-colors',
        'hover:bg-base-200 focus:bg-base-200',
        { 'bg-base-200': isSelected }
      )}
    >
      <span className="text-lg">{getTypeIcon(result.type)}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-base-content truncate">
          {result.title}
        </div>
        {result.meta && (
          <div className="text-xs text-base-content/60 truncate">
            {result.meta}
          </div>
        )}
      </div>
      <span className="text-xs text-base-content/40 capitalize">
        {result.type}
      </span>
    </Link>
  );
};

/**
 * Результаты поиска
 */
const SearchResults = ({ 
  isOpen, 
  results, 
  selectedIndex,
  onResultClick,
  query 
}: {
  isOpen: boolean;
  results: SearchResult[];
  selectedIndex: number;
  onResultClick: () => void;
  query: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      {results.length > 0 ? (
        <>
          {results.map((result, index) => (
            <SearchResultItem
              key={`${result.type}-${result.id}`}
              result={result}
              isSelected={index === selectedIndex}
              onClick={onResultClick}
            />
          ))}
          <div className="px-4 py-2 border-t border-base-300 text-xs text-base-content/50">
            Нажмите Enter для поиска по всему сайту
          </div>
        </>
      ) : query.length >= DEFAULT_SEARCH_CONFIG.minQueryLength ? (
        <div className="px-4 py-8 text-center text-base-content/60">
          <div className="text-2xl mb-2">🔍</div>
          <div>Ничего не найдено</div>
          <div className="text-xs mt-1">
            Попробуйте другие ключевые слова
          </div>
        </div>
      ) : (
        <div className="px-4 py-8 text-center text-base-content/60">
          <div className="text-2xl mb-2">💡</div>
          <div>Начните печатать для поиска</div>
          <div className="text-xs mt-1">
            Минимум {DEFAULT_SEARCH_CONFIG.minQueryLength} символа
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SearchBar компонент с автодополнением
 * @param placeholder - текст placeholder
 * @param className - дополнительные CSS классы
 * @param variant - вариант отображения
 * @param maxResults - максимальное количество результатов
 * @param onSearchSubmit - обработчик отправки поиска
 * @param onResultSelect - обработчик выбора результата
 */
export const SearchBar = ({
  placeholder = 'Поиск статей, авторов, категорий...',
  className,
  variant = 'default',
  maxResults = DEFAULT_SEARCH_CONFIG.maxResults,
  onSearchSubmit,
  onResultSelect
}: SearchBarProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [state, setState] = useState<SearchState>({
    query: '',
    isLoading: false,
    isOpen: false,
    results: { articles: [], categories: [], tags: [], authors: [] },
    selectedIndex: -1,
  });

  // Используем хук поиска с debounce
  const { searchResults, isLoading } = useSearch(state.query, {
    enabled: state.query.length >= DEFAULT_SEARCH_CONFIG.minQueryLength,
  });

  // Обновляем результаты когда приходят данные
  useEffect(() => {
    if (searchResults) {
      // Преобразуем результаты в плоский массив для навигации
      const flatResults = [
        ...(searchResults.articles || []),
        ...(searchResults.categories || []),
        ...(searchResults.tags || []),
        ...(searchResults.authors || [])
      ].slice(0, maxResults);

      setState(prev => ({
        ...prev,
        results: searchResults,
        isLoading: false,
      }));
    }
  }, [searchResults, maxResults]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setState(prev => ({ ...prev, isOpen: false, selectedIndex: -1 }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обработка ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setState(prev => ({
      ...prev,
      query,
      isOpen: true,
      isLoading: query.length >= DEFAULT_SEARCH_CONFIG.minQueryLength,
      selectedIndex: -1,
    }));
  }, []);

  // Обработка клавиатуры
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const flatResults = [
      ...(state.results.articles || []),
      ...(state.results.categories || []),
      ...(state.results.tags || []),
      ...(state.results.authors || [])
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          selectedIndex: Math.min(prev.selectedIndex + 1, flatResults.length - 1)
        }));
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setState(prev => ({
          ...prev,
          selectedIndex: Math.max(prev.selectedIndex - 1, -1)
        }));
        break;
      
      case 'Enter':
        e.preventDefault();
        if (state.selectedIndex >= 0 && flatResults[state.selectedIndex]) {
          const selected = flatResults[state.selectedIndex];
          router.push(selected.href);
          onResultSelect?.(selected);
          setState(prev => ({ ...prev, isOpen: false, selectedIndex: -1 }));
        } else if (state.query.trim()) {
          router.push(`/search?q=${encodeURIComponent(state.query)}`);
          onSearchSubmit?.(state.query);
          setState(prev => ({ ...prev, isOpen: false }));
        }
        break;
      
      case 'Escape':
        setState(prev => ({ ...prev, isOpen: false, selectedIndex: -1 }));
        inputRef.current?.blur();
        break;
    }
  }, [state.selectedIndex, state.results, state.query, router, onResultSelect, onSearchSubmit]);

  // Получаем плоский массив результатов для отображения
  const flatResults = [
    ...(state.results.articles || []),
    ...(state.results.categories || []),
    ...(state.results.tags || []),
    ...(state.results.authors || [])
  ];

  const searchBarStyles = cn(
    'relative',
    {
      'w-full max-w-md': variant === 'default',
      'w-48': variant === 'minimal',
      'w-full': variant === 'full',
    },
    className
  );

  return (
    <div ref={containerRef} className={searchBarStyles}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={state.query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setState(prev => ({ ...prev, isOpen: true }))}
          className="w-full pl-10 pr-4 py-2 text-sm bg-base-200 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon />
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <SearchResults
        isOpen={state.isOpen}
        results={flatResults}
        selectedIndex={state.selectedIndex}
        onResultClick={() => setState(prev => ({ ...prev, isOpen: false }))}
        query={state.query}
      />
    </div>
  );
}; 