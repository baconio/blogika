/**
 * @fileoverview TagsSelector component for article tag management
 * Features: autocomplete, validation, keyboard navigation, custom tag creation
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useTags } from '@/hooks/useTags';
import type { Tag } from '@/types';
import type { 
  TagsSelectorProps, 
  TagsState,
  DEFAULT_TAG_VALIDATION,
  DEFAULT_SUGGESTIONS_CONFIG 
} from './TagsSelector.types';

/**
 * TagsSelector component for managing article tags
 * Supports autocomplete, validation, and custom tag creation
 */
export const TagsSelector: React.FC<TagsSelectorProps> = ({
  selectedTags,
  onTagsChange,
  placeholder = 'Добавить теги...',
  validationConfig = {},
  suggestionsConfig = {},
  disabled = false,
  error,
  className = ''
}) => {
  const { searchTags, createTag } = useTags();
  const [state, setState] = useState<TagsState>({
    selectedTags,
    inputValue: '',
    suggestions: [],
    isLoading: false
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const config = { ...DEFAULT_TAG_VALIDATION, ...validationConfig };
  const suggConfig = { ...DEFAULT_SUGGESTIONS_CONFIG, ...suggestionsConfig };

  /**
   * Validates if a tag can be added based on configuration rules
   */
  const validateTag = useCallback((tag: string): string | null => {
    if (tag.length < config.minTagLength) {
      return `Тег должен содержать минимум ${config.minTagLength} символа`;
    }
    if (tag.length > config.maxTagLength) {
      return `Тег не может быть длиннее ${config.maxTagLength} символов`;
    }
    if (selectedTags.length >= config.maxTags) {
      return `Максимум ${config.maxTags} тегов`;
    }
    if (selectedTags.some(t => t.name === tag)) {
      return 'Тег уже добавлен';
    }
    if (config.restrictedTags.includes(tag.toLowerCase())) {
      return 'Этот тег запрещен';
    }
    return null;
  }, [selectedTags, config]);

  /**
   * Searches for tag suggestions with debounce
   */
  const searchTagSuggestions = useCallback(async (query: string) => {
    if (query.length < suggConfig.minQueryLength) {
      setState(prev => ({ ...prev, suggestions: [] }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const excludeIds = selectedTags.map(tag => tag.id);
      const suggestions = await searchTags({
        query,
        limit: suggConfig.maxSuggestions,
        excludeIds
      });
      
      setState(prev => ({ 
        ...prev, 
        suggestions,
        isLoading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Ошибка поиска тегов' 
      }));
    }
  }, [selectedTags, searchTags, suggConfig]);

  /**
   * Handles input value changes with debounced search
   */
  const handleInputChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, inputValue: value }));
    setHighlightedIndex(-1);
    
    const timer = setTimeout(() => {
      searchTagSuggestions(value);
    }, suggConfig.debounceMs);

    return () => clearTimeout(timer);
  }, [searchTagSuggestions, suggConfig.debounceMs]);

  /**
   * Adds a tag to the selected list
   */
  const handleTagAdd = useCallback(async (tag: Tag | string) => {
    let tagToAdd: Tag;
    
    if (typeof tag === 'string') {
      const validation = validateTag(tag);
      if (validation) {
        setState(prev => ({ ...prev, error: validation }));
        return;
      }
      
      if (!config.allowCustomTags) {
        setState(prev => ({ ...prev, error: 'Пользовательские теги запрещены' }));
        return;
      }
      
      try {
        tagToAdd = await createTag({ name: tag });
      } catch (error) {
        setState(prev => ({ ...prev, error: 'Ошибка создания тега' }));
        return;
      }
    } else {
      tagToAdd = tag;
    }

    const newTags = [...selectedTags, tagToAdd];
    onTagsChange(newTags);
    setState(prev => ({ 
      ...prev, 
      inputValue: '',
      suggestions: [],
      error: undefined 
    }));
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [selectedTags, onTagsChange, validateTag, config.allowCustomTags, createTag]);

  /**
   * Removes a tag from the selected list
   */
  const handleTagRemove = useCallback((tagId: string) => {
    const newTags = selectedTags.filter(tag => tag.id !== tagId);
    onTagsChange(newTags);
  }, [selectedTags, onTagsChange]);

  /**
   * Handles keyboard navigation and actions
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && state.suggestions[highlightedIndex]) {
          handleTagAdd(state.suggestions[highlightedIndex]);
        } else if (state.inputValue.trim()) {
          handleTagAdd(state.inputValue.trim());
        }
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev < state.suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : state.suggestions.length - 1
        );
        break;
        
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
        
      case 'Backspace':
        if (!state.inputValue && selectedTags.length > 0) {
          handleTagRemove(selectedTags[selectedTags.length - 1].id);
        }
        break;
    }
  }, [state.suggestions, state.inputValue, highlightedIndex, selectedTags, handleTagAdd, handleTagRemove]);

  // Update state when selectedTags prop changes
  useEffect(() => {
    setState(prev => ({ ...prev, selectedTags }));
  }, [selectedTags]);

  return (
    <div className={`tags-selector ${className}`}>
      <div className="relative">
        {/* Tags display and input */}
        <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg focus-within:border-blue-500 min-h-[44px]">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {tag.name}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag.id)}
                  className="hover:bg-blue-200 rounded p-0.5"
                  aria-label={`Удалить тег ${tag.name}`}
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          
          <input
            ref={inputRef}
            type="text"
            value={state.inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={selectedTags.length === 0 ? placeholder : ''}
            disabled={disabled || selectedTags.length >= config.maxTags}
            className="flex-1 outline-none bg-transparent min-w-[120px] placeholder-gray-400"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && !disabled && (state.suggestions.length > 0 || state.inputValue) && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto"
          >
            {state.isLoading ? (
              <div className="p-3 text-center text-gray-500">
                Поиск тегов...
              </div>
            ) : (
              <>
                {state.suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleTagAdd(suggestion)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                      index === highlightedIndex ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span className="font-medium">{suggestion.name}</span>
                    {suggestion.description && (
                      <span className="text-sm text-gray-500 ml-2">
                        {suggestion.description}
                      </span>
                    )}
                  </button>
                ))}
                
                {config.allowCustomTags && state.inputValue.trim() && 
                 !state.suggestions.some(s => s.name === state.inputValue.trim()) && (
                  <button
                    type="button"
                    onClick={() => handleTagAdd(state.inputValue.trim())}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 border-t border-gray-200 ${
                      highlightedIndex === state.suggestions.length ? 'bg-blue-50' : ''
                    }`}
                  >
                    <PlusIcon className="w-4 h-4 inline mr-2" />
                    Создать тег "{state.inputValue.trim()}"
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {(error || state.error) && (
        <p className="text-red-600 text-sm mt-1">
          {error || state.error}
        </p>
      )}
      
      {/* Tags counter */}
      <p className="text-gray-500 text-xs mt-1">
        {selectedTags.length}/{config.maxTags} тегов
      </p>
    </div>
  );
}; 