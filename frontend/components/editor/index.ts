/**
 * Экспорты модуля editor
 * Микромодуль для компонентов редактирования контента
 */

export { TiptapEditor } from './TiptapEditor';
export { EditorToolbar } from './EditorToolbar';
export { EditorMenuBar } from './EditorMenuBar';
export { ImageUploader } from './ImageUploader';
export { CodeBlockExtension } from './CodeBlockExtension';
export { TableExtension } from './TableExtension';
export { ArticleForm } from './ArticleForm';
export { PublishSettings } from './PublishSettings';
export { TagsSelector } from './TagsSelector';
export { CategorySelector } from './CategorySelector';
export { CoverImageUpload } from './CoverImageUpload';
export { PremiumSettings } from './PremiumSettings';
export { EditorPreview } from './EditorPreview';

export type { 
  TiptapEditorProps, 
  EditorConfig,
  EditorHandlers,
  EditorState,
  EditorExtensionType 
} from './TiptapEditor.types';

export type {
  EditorToolbarProps,
  ToolbarButtonProps,
  ToolbarButtonGroup,
  ToolbarButtonConfig,
  ToolbarAction
} from './EditorToolbar.types';

export type {
  EditorMenuBarProps,
  MenuItemConfig,
  MenuItemProps,
  MenuDropdownProps,
  DropdownConfig,
  MenuItemType,
  DropdownState
} from './EditorMenuBar.types';

export type {
  ImageUploaderProps,
  UploadedImage,
  UploadResult,
  UploadHandlers,
  UploadConfig,
  UploadButtonProps,
  UploadState,
  ImagePreview,
  UploadStatus
} from './ImageUploader.types';

export type {
  CodeBlockExtensionProps,
  LanguageSelectorProps,
  CodeBlockProps,
  SupportedLanguage,
  LanguageInfo,
  CodeBlockSettings,
  SyntaxHighlightConfig
} from './CodeBlockExtension.types';

export type {
  TableExtensionProps,
  TableCreatorProps,
  TableEditorProps,
  TableToolbarProps,
  TableData,
  TableRow,
  TableCell,
  TableCreationSettings,
  TableAction,
  TablePosition
} from './TableExtension.types';

export type {
  ArticleFormProps,
  ArticleFormData,
  ArticleFormState,
  ArticleFormErrors,
  ArticleFormHandlers,
  ArticlePublishSettings,
  SeoSettings,
  FormDisplayMode,
  FormTab
} from './ArticleForm.types';

export type {
  PublishSettingsProps,
  PublishSettingsData,
  StatusSelectorProps,
  AccessLevelSelectorProps,
  AdvancedSettingsProps,
  PublicationStatus,
  AccessLevel,
  StatusInfo,
  AccessLevelInfo,
  PublishSettingsValidation
} from './PublishSettings.types';

export type {
  TagsSelectorProps,
  TagsState,
  TagsHandlers,
  TagValidationConfig,
  TagSearchOptions,
  TagSuggestionsConfig,
  TagItemProps,
  TagInputProps,
  TagSuggestionsProps
} from './TagsSelector.types';

export type {
  CategorySelectorProps,
  CategoryState,
  CategoryHandlers,
  CategorySelectionConfig,
  CategoryFilterOptions,
  CategoryDisplayOptions,
  CategoryDropdownProps,
  CategoryItemProps,
  CategoryBadgeProps,
  CategoryTreeNode
} from './CategorySelector.types';

export type {
  CoverImageUploadProps,
  ImageValidationConfig,
  CropArea,
  ImageOptimization,
  ImageMetadata,
  DropZoneProps,
  ImagePreviewProps,
  UploadProgressProps,
  CropEditorProps,
  FileValidationResult
} from './CoverImageUpload.types';

export type {
  PremiumSettingsProps,
  PremiumConfig,
  ContentAccessLevel,
  PricingModel,
  SubscriptionTier,
  PaymentConfig,
  PaymentMethod,
  PreviewConfig,
  PremiumAnalytics,
  PricingConfigProps,
  PreviewSettingsProps,
  TierSelectorProps,
  RevenueProjection
} from './PremiumSettings.types';

export type {
  EditorPreviewProps,
  ArticleDraft,
  PreviewMode,
  AutoSaveStatus,
  AutoSaveConfig,
  AutoSaveState,
  PreviewRenderOptions,
  ContentStatistics,
  PreviewHeaderProps,
  PreviewContentProps,
  PreviewToolbarProps,
  AutoSaveIndicatorProps,
  ContentStatsProps,
  AutoSaveHandlers,
  DraftRecovery
} from './EditorPreview.types'; 