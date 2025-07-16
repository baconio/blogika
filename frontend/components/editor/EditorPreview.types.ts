/**
 * @fileoverview TypeScript types for EditorPreview component
 * Handles article preview, auto-save, and content formatting
 */

import type { Article, Category, Tag } from '@/types';

/** Preview display modes */
export type PreviewMode = 'desktop' | 'tablet' | 'mobile';

/** Auto-save status */
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Article draft data for preview */
export interface ArticleDraft {
  readonly title: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly coverImageUrl?: string;
  readonly category?: Category;
  readonly tags: readonly Tag[];
  readonly readingTime?: number;
  readonly wordCount?: number;
  readonly publishedAt?: Date;
  readonly status: 'draft' | 'published' | 'scheduled';
}

/** Auto-save configuration */
export interface AutoSaveConfig {
  readonly enabled: boolean;
  readonly intervalMs: number;
  readonly debounceMs: number;
  readonly maxRetries: number;
  readonly showNotifications: boolean;
}

/** Auto-save state */
export interface AutoSaveState {
  readonly status: AutoSaveStatus;
  readonly lastSaved?: Date;
  readonly hasChanges: boolean;
  readonly error?: string;
  readonly retryCount: number;
}

/** Preview rendering options */
export interface PreviewRenderOptions {
  readonly showMetadata: boolean;
  readonly showReadingTime: boolean;
  readonly showWordCount: boolean;
  readonly showPublishDate: boolean;
  readonly enableSyntaxHighlighting: boolean;
  readonly enableMathRendering: boolean;
}

/** Content statistics */
export interface ContentStatistics {
  readonly wordCount: number;
  readonly characterCount: number;
  readonly paragraphCount: number;
  readonly imageCount: number;
  readonly linkCount: number;
  readonly readingTime: number;
}

/** Props for the main EditorPreview component */
export interface EditorPreviewProps {
  readonly article: ArticleDraft;
  readonly previewMode: PreviewMode;
  readonly onPreviewModeChange: (mode: PreviewMode) => void;
  readonly autoSaveConfig?: Partial<AutoSaveConfig>;
  readonly renderOptions?: Partial<PreviewRenderOptions>;
  readonly onSave?: () => Promise<void>;
  readonly onPublish?: () => Promise<void>;
  readonly isVisible: boolean;
  readonly className?: string;
}

/** Props for preview header component */
export interface PreviewHeaderProps {
  readonly article: ArticleDraft;
  readonly showMetadata: boolean;
  readonly className?: string;
}

/** Props for preview content component */
export interface PreviewContentProps {
  readonly content: string;
  readonly renderOptions: PreviewRenderOptions;
  readonly className?: string;
}

/** Props for preview toolbar component */
export interface PreviewToolbarProps {
  readonly previewMode: PreviewMode;
  readonly onPreviewModeChange: (mode: PreviewMode) => void;
  readonly autoSaveState: AutoSaveState;
  readonly onSave?: () => Promise<void>;
  readonly onPublish?: () => Promise<void>;
  readonly className?: string;
}

/** Props for auto-save indicator */
export interface AutoSaveIndicatorProps {
  readonly status: AutoSaveStatus;
  readonly lastSaved?: Date;
  readonly hasChanges: boolean;
  readonly error?: string;
  readonly className?: string;
}

/** Props for content statistics display */
export interface ContentStatsProps {
  readonly statistics: ContentStatistics;
  readonly showDetailed: boolean;
  readonly className?: string;
}

/** Auto-save handler functions */
export interface AutoSaveHandlers {
  readonly onSave: () => Promise<void>;
  readonly onError: (error: string) => void;
  readonly onSuccess: () => void;
}

/** Draft recovery data */
export interface DraftRecovery {
  readonly hasSavedDraft: boolean;
  readonly draftTimestamp?: Date;
  readonly draftData?: Partial<ArticleDraft>;
}

/** Default auto-save configuration */
export const DEFAULT_AUTOSAVE_CONFIG: AutoSaveConfig = {
  enabled: true,
  intervalMs: 60000, // 1 minute
  debounceMs: 2000,  // 2 seconds
  maxRetries: 3,
  showNotifications: true
} as const;

/** Default preview rendering options */
export const DEFAULT_PREVIEW_OPTIONS: PreviewRenderOptions = {
  showMetadata: true,
  showReadingTime: true,
  showWordCount: true,
  showPublishDate: true,
  enableSyntaxHighlighting: true,
  enableMathRendering: false
} as const;

/** Preview device configurations */
export const PREVIEW_DEVICES = {
  desktop: {
    name: 'Десктоп',
    width: '100%',
    maxWidth: '1024px',
    icon: '🖥️'
  },
  tablet: {
    name: 'Планшет',
    width: '768px',
    maxWidth: '768px',
    icon: '📱'
  },
  mobile: {
    name: 'Мобильный',
    width: '375px',
    maxWidth: '375px',
    icon: '��'
  }
} as const; 