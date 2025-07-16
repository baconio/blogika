'use client';

/**
 * EditorMenuBar - расширенное меню форматирования
 * Микромодуль для продвинутого управления форматированием
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { EditorMenuBarProps, MenuItemConfig, MenuDropdownProps } from './EditorMenuBar.types';

/**
 * Дропдаун меню для группировки опций
 */
const MenuDropdown: React.FC<MenuDropdownProps> = ({ config, editor, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = useCallback((item: MenuItemConfig) => {
    item.onClick?.(editor);
    setIsOpen(false);
    onItemClick?.();
  }, [editor, onItemClick]);

  const isActive = config.trigger.isActive?.(editor) ?? false;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 py-2 text-sm font-medium rounded-md border
          transition-colors duration-200
          ${isActive 
            ? 'bg-blue-100 text-blue-700 border-blue-300' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        {config.trigger.label}
        <span className="ml-1">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {config.items.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleItemClick(item)}
              disabled={item.isDisabled?.(editor)}
              className={`
                w-full px-3 py-2 text-left text-sm
                transition-colors duration-200
                ${item.isActive?.(editor) 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
                ${item.isDisabled?.(editor) ? 'opacity-50 cursor-not-allowed' : ''}
                first:rounded-t-md last:rounded-b-md
              `}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-400">{item.shortcut}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Создает конфигурацию элементов меню
 */
const createMenuConfig = (): readonly MenuItemConfig[] => [
  {
    type: 'dropdown',
    name: 'headings',
    label: 'Заголовки',
    isActive: (editor) => editor.isActive('heading'),
    children: [
      {
        type: 'button',
        name: 'paragraph',
        label: 'Обычный текст',
        isActive: (editor) => editor.isActive('paragraph'),
        onClick: (editor) => editor.chain().focus().setParagraph().run()
      },
      {
        type: 'button',
        name: 'heading1',
        label: 'Заголовок 1',
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
        onClick: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run()
      },
      {
        type: 'button',
        name: 'heading2',
        label: 'Заголовок 2',
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
        onClick: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run()
      },
      {
        type: 'button',
        name: 'heading3',
        label: 'Заголовок 3',
        isActive: (editor) => editor.isActive('heading', { level: 3 }),
        onClick: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run()
      }
    ]
  },
  {
    type: 'button',
    name: 'bulletList',
    label: '• Список',
    isActive: (editor) => editor.isActive('bulletList'),
    onClick: (editor) => editor.chain().focus().toggleBulletList().run()
  },
  {
    type: 'button',
    name: 'orderedList',
    label: '1. Нумерованный',
    isActive: (editor) => editor.isActive('orderedList'),
    onClick: (editor) => editor.chain().focus().toggleOrderedList().run()
  },
  {
    type: 'button',
    name: 'blockquote',
    label: '" Цитата',
    isActive: (editor) => editor.isActive('blockquote'),
    onClick: (editor) => editor.chain().focus().toggleBlockquote().run()
  },
  {
    type: 'button',
    name: 'codeBlock',
    label: '</> Код',
    isActive: (editor) => editor.isActive('codeBlock'),
    onClick: (editor) => editor.chain().focus().toggleCodeBlock().run()
  }
];

/**
 * Основной компонент расширенного меню редактора
 */
export const EditorMenuBar: React.FC<EditorMenuBarProps> = ({
  editor,
  className = '',
  variant = 'default',
  showItems,
  hideItems
}) => {
  const menuConfig = createMenuConfig();

  if (!editor) {
    return null;
  }

  const filteredItems = menuConfig.filter(item => {
    if (hideItems?.includes(item.name)) return false;
    if (showItems && !showItems.includes(item.name)) return false;
    return true;
  });

  const variantClasses = {
    default: 'bg-white border-b border-gray-200',
    compact: 'bg-gray-50',
    floating: 'bg-white border border-gray-200 rounded-lg shadow-sm'
  };

  return (
    <div className={`editor-menu-bar flex items-center gap-2 p-2 ${variantClasses[variant]} ${className}`}>
      {filteredItems.map((item) => {
        if (item.type === 'dropdown' && item.children) {
          return (
            <MenuDropdown
              key={item.name}
              config={{
                trigger: item,
                items: item.children,
                placement: 'bottom-start'
              }}
              editor={editor}
            />
          );
        }

        if (item.type === 'button') {
          const isActive = item.isActive?.(editor) ?? false;
          const isDisabled = item.isDisabled?.(editor) ?? false;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => item.onClick?.(editor)}
              disabled={isDisabled}
              title={item.label}
              className={`
                px-3 py-2 text-sm font-medium rounded-md border
                transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-100 text-blue-700 border-blue-300' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {item.label}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}; 