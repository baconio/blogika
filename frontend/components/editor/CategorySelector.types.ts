/**
 * @fileoverview TypeScript types for CategorySelector component
 * Handles category selection with hierarchy and validation
 */

import type { Category } from '@/types';

/** Configuration for category selection behavior */
export interface CategorySelectionConfig {
  readonly allowMultiple: boolean;
  readonly maxCategories: number;
  readonly requireCategory: boolean;
  readonly allowSubcategories: boolean;
  readonly showHierarchy: boolean;
}

/** State for managing category selection */
export interface CategoryState {
  readonly selectedCategory?: Category;
  readonly selectedCategories: readonly Category[];
  readonly availableCategories: readonly Category[];
  readonly isLoading: boolean;
  readonly error?: string;
}

/** Handler functions for category operations */
export interface CategoryHandlers {
  readonly onCategorySelect: (category: Category) => void;
  readonly onCategoryRemove: (categoryId: string) => void;
  readonly onCategoriesChange: (categories: readonly Category[]) => void;
}

/** Options for filtering and searching categories */
export interface CategoryFilterOptions {
  readonly searchQuery?: string;
  readonly parentId?: string;
  readonly level?: number;
  readonly isActive?: boolean;
  readonly showEmpty?: boolean;
}

/** Category display options */
export interface CategoryDisplayOptions {
  readonly showDescription: boolean;
  readonly showArticleCount: boolean;
  readonly showHierarchy: boolean;
  readonly maxDisplayLength: number;
}

/** Props for the main CategorySelector component */
export interface CategorySelectorProps {
  readonly selectedCategory?: Category;
  readonly selectedCategories?: readonly Category[];
  readonly onCategoryChange?: (category?: Category) => void;
  readonly onCategoriesChange?: (categories: readonly Category[]) => void;
  readonly selectionConfig?: Partial<CategorySelectionConfig>;
  readonly displayOptions?: Partial<CategoryDisplayOptions>;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly className?: string;
}

/** Props for category dropdown component */
export interface CategoryDropdownProps {
  readonly categories: readonly Category[];
  readonly selectedCategory?: Category;
  readonly selectedCategories: readonly Category[];
  readonly onCategorySelect: (category: Category) => void;
  readonly showHierarchy: boolean;
  readonly isVisible: boolean;
  readonly className?: string;
}

/** Props for individual category item in dropdown */
export interface CategoryItemProps {
  readonly category: Category;
  readonly onSelect: (category: Category) => void;
  readonly isSelected: boolean;
  readonly showDescription: boolean;
  readonly showArticleCount: boolean;
  readonly level: number;
  readonly className?: string;
}

/** Props for category badge display */
export interface CategoryBadgeProps {
  readonly category: Category;
  readonly onRemove?: (categoryId: string) => void;
  readonly showHierarchy: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly removable?: boolean;
  readonly className?: string;
}

/** Tree structure for hierarchical categories */
export interface CategoryTreeNode {
  readonly category: Category;
  readonly children: readonly CategoryTreeNode[];
  readonly level: number;
  readonly hasChildren: boolean;
}

/** Default selection configuration */
export const DEFAULT_CATEGORY_CONFIG: CategorySelectionConfig = {
  allowMultiple: false,
  maxCategories: 1,
  requireCategory: true,
  allowSubcategories: true,
  showHierarchy: true
} as const;

/** Default display options */
export const DEFAULT_DISPLAY_OPTIONS: CategoryDisplayOptions = {
  showDescription: true,
  showArticleCount: true,
  showHierarchy: true,
  maxDisplayLength: 50
} as const; 