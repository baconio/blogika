/**
 * @fileoverview CategorySelector component for article category management
 * Features: hierarchy support, validation, single/multiple selection
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronDownIcon, XMarkIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types';
import type { 
  CategorySelectorProps, 
  CategoryState,
  CategoryTreeNode,
  DEFAULT_CATEGORY_CONFIG,
  DEFAULT_DISPLAY_OPTIONS 
} from './CategorySelector.types';

/**
 * CategorySelector component for managing article categories
 * Supports hierarchy, single/multiple selection, and validation
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  selectedCategories = [],
  onCategoryChange,
  onCategoriesChange,
  selectionConfig = {},
  displayOptions = {},
  placeholder = 'Выберите категорию...',
  disabled = false,
  error,
  className = ''
}) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [state, setState] = useState<CategoryState>({
    selectedCategory,
    selectedCategories,
    availableCategories: [],
    isLoading: false
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const config = { ...DEFAULT_CATEGORY_CONFIG, ...selectionConfig };
  const displayOpts = { ...DEFAULT_DISPLAY_OPTIONS, ...displayOptions };

  /**
   * Builds category tree structure for hierarchical display
   */
  const buildCategoryTree = useCallback((categories: Category[]): CategoryTreeNode[] => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];
    
    // Build category map
    categories.forEach(category => {
      categoryMap.set(category.id, category);
    });
    
    // Find root categories and build tree
    categories.forEach(category => {
      if (!category.parent_id) {
        rootCategories.push(category);
      }
    });
    
    const buildNode = (category: Category, level: number = 0): CategoryTreeNode => {
      const children = categories
        .filter(cat => cat.parent_id === category.id)
        .map(child => buildNode(child, level + 1));
        
      return {
        category,
        children,
        level,
        hasChildren: children.length > 0
      };
    };
    
    return rootCategories.map(category => buildNode(category));
  }, []);

  /**
   * Flattens category tree for dropdown display
   */
  const flattenCategoryTree = useCallback((nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
    const result: CategoryTreeNode[] = [];
    
    const traverse = (node: CategoryTreeNode) => {
      result.push(node);
      node.children.forEach(traverse);
    };
    
    nodes.forEach(traverse);
    return result;
  }, []);

  /**
   * Validates category selection
   */
  const validateSelection = useCallback((category: Category): string | null => {
    if (config.allowMultiple) {
      if (selectedCategories.length >= config.maxCategories) {
        return `Максимум ${config.maxCategories} категорий`;
      }
      if (selectedCategories.some(cat => cat.id === category.id)) {
        return 'Категория уже выбрана';
      }
    }
    
    if (!config.allowSubcategories && category.parent_id) {
      return 'Подкатегории не разрешены';
    }
    
    return null;
  }, [selectedCategories, config]);

  /**
   * Handles category selection
   */
  const handleCategorySelect = useCallback((category: Category) => {
    const validation = validateSelection(category);
    if (validation) {
      setState(prev => ({ ...prev, error: validation }));
      return;
    }

    if (config.allowMultiple) {
      const newCategories = [...selectedCategories, category];
      onCategoriesChange?.(newCategories);
      setState(prev => ({ 
        ...prev, 
        selectedCategories: newCategories,
        error: undefined 
      }));
    } else {
      onCategoryChange?.(category);
      setState(prev => ({ 
        ...prev, 
        selectedCategory: category,
        error: undefined 
      }));
      setIsDropdownOpen(false);
    }
  }, [selectedCategories, config.allowMultiple, onCategoryChange, onCategoriesChange, validateSelection]);

  /**
   * Handles category removal (for multiple selection)
   */
  const handleCategoryRemove = useCallback((categoryId: string) => {
    if (config.allowMultiple) {
      const newCategories = selectedCategories.filter(cat => cat.id !== categoryId);
      onCategoriesChange?.(newCategories);
      setState(prev => ({ ...prev, selectedCategories: newCategories }));
    } else {
      onCategoryChange?.(undefined);
      setState(prev => ({ ...prev, selectedCategory: undefined }));
    }
  }, [selectedCategories, config.allowMultiple, onCategoryChange, onCategoriesChange]);

  /**
   * Renders category item with hierarchy
   */
  const renderCategoryItem = useCallback((node: CategoryTreeNode) => {
    const { category, level } = node;
    const isSelected = config.allowMultiple
      ? selectedCategories.some(cat => cat.id === category.id)
      : selectedCategory?.id === category.id;

    const truncatedName = category.name.length > displayOpts.maxDisplayLength
      ? `${category.name.substring(0, displayOpts.maxDisplayLength)}...`
      : category.name;

    return (
      <button
        key={category.id}
        type="button"
        onClick={() => handleCategorySelect(category)}
        disabled={isSelected}
        className={`w-full text-left px-3 py-2 hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed ${
          isSelected ? 'bg-blue-50 text-blue-700' : ''
        }`}
        style={{ paddingLeft: `${12 + level * 20}px` }}
      >
        <div className="flex items-center gap-2">
          {displayOpts.showHierarchy && level > 0 && (
            <div className="w-4 h-4 border-l border-gray-300" />
          )}
          {category.icon && (
            <span className="text-lg">{category.icon}</span>
          )}
          {!category.icon && <FolderIcon className="w-4 h-4 text-gray-400" />}
          
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{truncatedName}</div>
            {displayOpts.showDescription && category.description && (
              <div className="text-xs text-gray-500 truncate">
                {category.description}
              </div>
            )}
            {displayOpts.showArticleCount && (
              <div className="text-xs text-gray-400">
                {category.article_count || 0} статей
              </div>
            )}
          </div>
        </div>
      </button>
    );
  }, [selectedCategory, selectedCategories, config.allowMultiple, displayOpts, handleCategorySelect]);

  /**
   * Handles click outside dropdown
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update state when props change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      selectedCategory,
      selectedCategories,
      availableCategories: categories
    }));
  }, [selectedCategory, selectedCategories, categories]);

  // Build category tree
  const categoryTree = buildCategoryTree(categories);
  const flatCategories = flattenCategoryTree(categoryTree);

  return (
    <div className={`category-selector ${className}`}>
      <div className="relative">
        {/* Selection display */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled}
          className={`w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-left hover:border-gray-400 focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : ''
          }`}
        >
          <div className="flex-1 min-w-0">
            {config.allowMultiple ? (
              <div className="flex flex-wrap gap-1">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                    >
                      {category.name}
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryRemove(category.id);
                          }}
                          className="hover:bg-blue-200 rounded p-0.5"
                          aria-label={`Удалить категорию ${category.name}`}
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">{placeholder}</span>
                )}
              </div>
            ) : (
              <span className={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
                {selectedCategory ? selectedCategory.name : placeholder}
              </span>
            )}
          </div>
          
          <ChevronDownIcon 
            className={`w-4 h-4 text-gray-400 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && !disabled && (
          <div 
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-64 overflow-y-auto"
          >
            {categoriesLoading ? (
              <div className="p-3 text-center text-gray-500">
                Загрузка категорий...
              </div>
            ) : flatCategories.length > 0 ? (
              flatCategories.map(renderCategoryItem)
            ) : (
              <div className="p-3 text-center text-gray-500">
                Категории не найдены
              </div>
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
      
      {/* Selection counter (for multiple mode) */}
      {config.allowMultiple && (
        <p className="text-gray-500 text-xs mt-1">
          {selectedCategories.length}/{config.maxCategories} категорий
        </p>
      )}
    </div>
  );
}; 