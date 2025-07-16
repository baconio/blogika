'use client';

/**
 * EditorToolbar - панель инструментов для форматирования текста
 * Микромодуль для управления форматированием в редакторе
 */

import { useCallback } from 'react';
import type { EditorToolbarProps, ToolbarButtonProps, ToolbarButtonGroup } from './EditorToolbar.types';

/**
 * Отдельная кнопка панели инструментов
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ 
  config, 
  editor, 
  size = 'md', 
  variant = 'default' 
}) => {
  const isActive = config.isActive?.(editor) ?? false;
  const isDisabled = config.isDisabled?.(editor) ?? false;

  const sizeClasses = {
    sm: 'p-1 text-sm',
    md: 'p-2',
    lg: 'p-3 text-lg'
  };

  const variantClasses = {
    default: 'border border-gray-300 hover:border-gray-400',
    minimal: 'border-0 hover:bg-gray-100'
  };

  return (
    <button
      type="button"
      onClick={() => config.onClick(editor)}
      disabled={isDisabled}
      title={config.title}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        inline-flex items-center justify-center rounded
        transition-colors duration-200
        ${isActive 
          ? 'bg-blue-100 text-blue-600 border-blue-300' 
          : 'bg-white text-gray-700 hover:bg-gray-50'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {config.icon}
    </button>
  );
};

/**
 * Создает конфигурацию кнопок панели инструментов
 */
const createToolbarConfig = (): readonly ToolbarButtonGroup[] => [
  {
    id: 'text-formatting',
    buttons: [
      {
        name: 'bold',
        icon: <span className="font-bold">B</span>,
        title: 'Жирный (Ctrl+B)',
        isActive: (editor) => editor.isActive('bold'),
        onClick: (editor) => editor.chain().focus().toggleBold().run()
      },
      {
        name: 'italic',
        icon: <span className="italic">I</span>,
        title: 'Курсив (Ctrl+I)',
        isActive: (editor) => editor.isActive('italic'),
        onClick: (editor) => editor.chain().focus().toggleItalic().run()
      },
      {
        name: 'underline',
        icon: <span className="underline">U</span>,
        title: 'Подчеркнутый (Ctrl+U)',
        isActive: (editor) => editor.isActive('underline'),
        onClick: (editor) => editor.chain().focus().toggleUnderline().run()
      }
    ]
  },
  {
    id: 'headings',
    buttons: [
      {
        name: 'heading1',
        icon: <span className="font-bold">H1</span>,
        title: 'Заголовок 1',
        isActive: (editor) => editor.isActive('heading', { level: 1 }),
        onClick: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run()
      },
      {
        name: 'heading2',
        icon: <span className="font-bold">H2</span>,
        title: 'Заголовок 2',
        isActive: (editor) => editor.isActive('heading', { level: 2 }),
        onClick: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run()
      }
    ]
  }
];

/**
 * Основной компонент панели инструментов редактора
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  className = '',
  showGroups = ['text-formatting', 'headings'],
  size = 'md',
  variant = 'default'
}) => {
  const toolbarConfig = createToolbarConfig();

  const handleAction = useCallback((action: () => void) => {
    action();
  }, []);

  if (!editor) {
    return null;
  }

  const filteredGroups = toolbarConfig.filter(group => 
    showGroups.includes(group.id)
  );

  return (
    <div className={`editor-toolbar flex items-center gap-1 p-2 border-b border-gray-200 ${className}`}>
      {filteredGroups.map((group, groupIndex) => (
        <div key={group.id} className="flex items-center gap-1">
          {group.buttons.map(button => (
            <ToolbarButton
              key={button.name}
              config={button}
              editor={editor}
              size={size}
              variant={variant}
            />
          ))}
          {groupIndex < filteredGroups.length - 1 && (
            <div className="w-px h-6 bg-gray-300 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}; 