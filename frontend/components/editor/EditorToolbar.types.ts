/**
 * Типы для EditorToolbar компонента
 * Микромодуль для типизации панели инструментов редактора
 */

import type { Editor } from '@tiptap/react';

/**
 * Конфигурация кнопки панели инструментов
 */
export interface ToolbarButtonConfig {
  readonly name: string;
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly isActive?: (editor: Editor) => boolean;
  readonly onClick: (editor: Editor) => void;
  readonly isDisabled?: (editor: Editor) => boolean;
}

/**
 * Группа кнопок в панели инструментов
 */
export interface ToolbarButtonGroup {
  readonly id: string;
  readonly buttons: readonly ToolbarButtonConfig[];
}

/**
 * Пропсы для EditorToolbar
 */
export interface EditorToolbarProps {
  readonly editor: Editor | null;
  readonly className?: string;
  readonly showGroups?: readonly string[];
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'default' | 'minimal' | 'compact';
}

/**
 * Пропсы для ToolbarButton
 */
export interface ToolbarButtonProps {
  readonly config: ToolbarButtonConfig;
  readonly editor: Editor;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly variant?: 'default' | 'minimal';
}

/**
 * Тип действия панели инструментов
 */
export type ToolbarAction = 
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'paragraph'
  | 'bulletList'
  | 'orderedList'
  | 'blockquote'
  | 'codeBlock'
  | 'undo'
  | 'redo'; 