/**
 * Компонент поиска с автодополнением
 * @description Микромодуль для поиска с предложениями и быстрым доступом
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useSearch, useAnalytics } from '@/hooks';
import type { AutocompleteResult } from '@/types';

/**
 * Пропсы компонента AutocompleteSearch
 */
export interface AutocompleteSearchProps {
  /** Плейсхолдер для поля ввода */
  readonly placeholder?: string;
  /** Начальное значение поиска */
  readonly initialValue?: string;
  /** Автофокус на поле ввода */
  readonly autoFocus?: boolean;
  /** Компактный режим */
  readonly compact?: boolean;
  /** Обработчик выбора результата */
  readonly onResultSelect?: (result: AutocompleteResult) => void;
  /** Обработчик отправки поиска */
  readonly onSearchSubmit?: (query: string) => void;
  /** Максимальное количество предложений */
  readonly maxSuggestions?: number;
  /** Показать популярные поисковые запросы */
  readonly showTrending?: boolean;
}

/**
 * Компонент элемента автодополнения
 */
const AutocompleteItem: React.FC<{
  readonly result: AutocompleteResult;
  readonly query: string;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}> = ({ result, query, isSelected, onClick }) => {
  const getTypeIcon = (type: AutocompleteResult['type']) => {
    switch (type) {
      case 'article':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'category':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
        );
      case 'tag':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
        );
      case 'author':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      className={`
        w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
        flex items-center space-x-3 group
        ${isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''}
      `}
      onClick={onClick}
    >
      <div className={`
        flex-shrink-0 text-gray-400 group-hover:text-gray-600
        ${isSelected ? 'text-blue-500' : ''}
      `}>
        {getTypeIcon(result.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span 
            className="text-sm font-medium text-gray-900 truncate"
            dangerouslySetInnerHTML={{
              __html: result.suggestion.replace(
                new RegExp(`(${query})`, 'gi'),
                '<mark class="bg-yellow-200 px-1">$1</mark>'
              )
            }}
          />
          
          <div className="flex items-center space-x-2 ml-2">
            <Badge variant="outline" size="xs">
              {result.type === 'article' ? 'Статья' :
               result.type === 'category' ? 'Категория' :
               result.type === 'tag' ? 'Тег' : 'Автор'}
            </Badge>
            
            {result.resultsCount > 0 && (
              <span className="text-xs text-gray-500">
                {result.resultsCount}
              </span>
            )}
          </div>
        </div>

        {/* Дополнительная информация */}
        {result.metadata && (
          <div className="mt-1 text-xs text-gray-500">
            {result.metadata.category && `Категория: ${result.metadata.category.name}`}
            {result.metadata.author && `Автор: ${result.metadata.author.display_name}`}
          </div>
        )}
      </div>
    </button>
  );
};

/**
 * Компонент AutocompleteSearch
 */
export const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
  placeholder = 'Поиск статей...',
  initialValue = '',
  autoFocus = false,
  compact = false,
  onResultSelect,
  onSearchSubmit,
  maxSuggestions = 5,
  showTrending = false
}) => {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Используем хук поиска
  const {
    query,
    setQuery,
    autocompleteResults,
    isAutocompletingLoading,
    executeSearch
  } = useSearch({
    initialQuery: initialValue,
    enableAutocomplete: true,
    autoSearch: false
  });

  // Фильтруем результаты по лимиту
  const limitedResults = autocompleteResults.slice(0, maxSuggestions);

  // Закрытие дропдауна при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Обработка клавиш
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen && event.key !== 'Enter') return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < limitedResults.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;

      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && limitedResults[selectedIndex]) {
          handleResultSelect(limitedResults[selectedIndex]);
        } else if (query.trim()) {
          handleSearchSubmit();
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Обработка изменения ввода
  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(value.length >= 2);
  };

  // Обработка фокуса
  const handleFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  // Обработка выбора результата
  const handleResultSelect = (result: AutocompleteResult) => {
    setQuery(result.suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);

    // Трекинг события
    trackEvent({
      name: 'autocomplete_select',
      category: 'article',
      properties: {
        suggestion: result.suggestion,
        type: result.type,
        resultsCount: result.resultsCount
      }
    });

    if (onResultSelect) {
      onResultSelect(result);
    } else {
      // По умолчанию переходим на страницу поиска
      router.push(`/search?q=${encodeURIComponent(result.suggestion)}`);
    }
  };

  // Обработка отправки поиска
  const handleSearchSubmit = () => {
    if (!query.trim()) return;

    setIsOpen(false);
    setSelectedIndex(-1);

    // Трекинг события
    trackEvent({
      name: 'search_submit',
      category: 'article',
      properties: {
        query: query.trim(),
        source: 'autocomplete_input'
      }
    });

    if (onSearchSubmit) {
      onSearchSubmit(query.trim());
    } else {
      // По умолчанию переходим на страницу поиска
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Поле ввода */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoFocus={autoFocus}
          className={`
            pr-12
            ${compact ? 'py-2 text-sm' : 'py-3'}
          `}
        />
        
        {/* Иконка поиска */}
        <button
          onClick={handleSearchSubmit}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Дропдаун с результатами */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isAutocompletingLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2">Поиск...</span>
            </div>
          ) : limitedResults.length > 0 ? (
            <>
              {limitedResults.map((result, index) => (
                <AutocompleteItem
                  key={`${result.type}-${result.suggestion}-${index}`}
                  result={result}
                  query={query}
                  isSelected={index === selectedIndex}
                  onClick={() => handleResultSelect(result)}
                />
              ))}
              
              {query.length >= 2 && (
                <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Показать все результаты для "{query}"
                  </button>
                </div>
              )}
            </>
          ) : query.length >= 2 ? (
            <div className="px-4 py-3 text-center text-gray-500">
              Нет предложений для "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}; 