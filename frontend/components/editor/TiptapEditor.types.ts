/**
 * Типы для TiptapEditor компонента
 * Микромодуль для типизации редактора контента
 */

import type { Editor } from '@tiptap/react';

/**
 * Конфигурация редактора
 */
export interface EditorConfig {
  readonly placeholder?: string;
  readonly editable?: boolean;
  readonly maxLength?: number;
  readonly minHeight?: string;
  readonly className?: string;
}

/**
 * Обработчики событий редактора
 */
export interface EditorHandlers {
  readonly onChange?: (content: string) => void;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onUpdate?: (editor: Editor) => void;
}

/**
 * Основные пропсы TiptapEditor
 */
export interface TiptapEditorProps extends EditorConfig, EditorHandlers {
  readonly content?: string;
  readonly disabled?: boolean;
}

/**
 * Состояние редактора
 */
export interface EditorState {
  readonly isLoading: boolean;
  readonly wordCount: number;
  readonly charCount: number;
  readonly readingTime: number;
}

/**
 * Типы расширений редактора
 */
export type EditorExtensionType = 
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link'
  | 'paragraph'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'image'
  | 'table'; 