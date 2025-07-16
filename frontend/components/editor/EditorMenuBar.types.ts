/**
 * Типы для EditorMenuBar компонента
 * Микромодуль для типизации расширенного меню форматирования
 */

import type { Editor } from '@tiptap/react';

/**
 * Конфигурация элемента меню
 */
export interface MenuItemConfig {
  readonly type: 'button' | 'dropdown' | 'separator';
  readonly name: string;
  readonly label: string;
  readonly icon?: React.ReactNode;
  readonly shortcut?: string;
  readonly isActive?: (editor: Editor) => boolean;
  readonly isDisabled?: (editor: Editor) => boolean;
  readonly onClick?: (editor: Editor) => void;
  readonly children?: readonly MenuItemConfig[];
}

/**
 * Конфигурация дропдауна
 */
export interface DropdownConfig {
  readonly trigger: MenuItemConfig;
  readonly items: readonly MenuItemConfig[];
  readonly placement?: 'bottom-start' | 'bottom-end';
}

/**
 * Пропсы для EditorMenuBar
 */
export interface EditorMenuBarProps {
  readonly editor: Editor | null;
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'floating';
  readonly showItems?: readonly string[];
  readonly hideItems?: readonly string[];
}

/**
 * Пропсы для MenuItem
 */
export interface MenuItemProps {
  readonly config: MenuItemConfig;
  readonly editor: Editor;
  readonly onItemClick?: () => void;
}

/**
 * Пропсы для MenuDropdown
 */
export interface MenuDropdownProps {
  readonly config: DropdownConfig;
  readonly editor: Editor;
  readonly onItemClick?: () => void;
}

/**
 * Типы элементов меню
 */
export type MenuItemType = 
  | 'heading-dropdown'
  | 'text-style'
  | 'lists'
  | 'alignment'
  | 'insert'
  | 'history'
  | 'more';

/**
 * Состояние дропдауна
 */
export interface DropdownState {
  readonly isOpen: boolean;
  readonly activeItem?: string;
} 