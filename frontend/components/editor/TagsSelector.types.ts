/**
 * @fileoverview TypeScript types for TagsSelector component
 * Handles tag selection, autocomplete, and validation for articles
 */

import type { Tag } from '@/types';

/** Configuration for tag validation rules */
export interface TagValidationConfig {
  readonly maxTags: number;
  readonly minTagLength: number;
  readonly maxTagLength: number;
  readonly allowCustomTags: boolean;
  readonly restrictedTags: readonly string[];
}

/** State for managing selected tags and input */
export interface TagsState {
  readonly selectedTags: readonly Tag[];
  readonly inputValue: string;
  readonly suggestions: readonly Tag[];
  readonly isLoading: boolean;
  readonly error?: string;
}

/** Handler functions for tag operations */
export interface TagsHandlers {
  readonly onTagAdd: (tag: Tag) => void;
  readonly onTagRemove: (tagId: string) => void;
  readonly onInputChange: (value: string) => void;
  readonly onTagCreate: (name: string) => Promise<Tag>;
  readonly onTagsChange: (tags: readonly Tag[]) => void;
}

/** Search and filter options for tags */
export interface TagSearchOptions {
  readonly query: string;
  readonly limit: number;
  readonly excludeIds: readonly string[];
  readonly categories?: readonly string[];
}

/** Configuration for tag suggestions behavior */
export interface TagSuggestionsConfig {
  readonly debounceMs: number;
  readonly minQueryLength: number;
  readonly maxSuggestions: number;
  readonly showPopular: boolean;
}

/** Props for the main TagsSelector component */
export interface TagsSelectorProps {
  readonly selectedTags: readonly Tag[];
  readonly onTagsChange: (tags: readonly Tag[]) => void;
  readonly placeholder?: string;
  readonly validationConfig?: Partial<TagValidationConfig>;
  readonly suggestionsConfig?: Partial<TagSuggestionsConfig>;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly className?: string;
}

/** Props for individual tag display component */
export interface TagItemProps {
  readonly tag: Tag;
  readonly onRemove: (tagId: string) => void;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly removable?: boolean;
  readonly className?: string;
}

/** Props for tag input field component */
export interface TagInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown: (event: React.KeyboardEvent) => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Props for suggestions dropdown component */
export interface TagSuggestionsProps {
  readonly suggestions: readonly Tag[];
  readonly onTagSelect: (tag: Tag) => void;
  readonly onTagCreate: (name: string) => Promise<Tag>;
  readonly query: string;
  readonly isLoading: boolean;
  readonly isVisible: boolean;
  readonly className?: string;
}

/** Default validation configuration */
export const DEFAULT_TAG_VALIDATION: TagValidationConfig = {
  maxTags: 10,
  minTagLength: 2,
  maxTagLength: 30,
  allowCustomTags: true,
  restrictedTags: []
} as const;

/** Default suggestions configuration */
export const DEFAULT_SUGGESTIONS_CONFIG: TagSuggestionsConfig = {
  debounceMs: 300,
  minQueryLength: 1,
  maxSuggestions: 10,
  showPopular: true
} as const; 