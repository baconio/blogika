'use client';

/**
 * TiptapEditor - основной редактор контента
 * Микромодуль для создания и редактирования статей
 */

import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { CharacterCount } from '@tiptap/extension-character-count';
import { useCallback, useEffect } from 'react';
import type { TiptapEditorProps } from './TiptapEditor.types';

/**
 * Создает и управляет Tiptap редактором с базовыми расширениями
 * @param props - конфигурация и обработчики редактора
 * @returns JSX элемент редактора
 */
export const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content = '',
  placeholder = 'Начните писать вашу статью...',
  editable = true,
  maxLength = 50000,
  minHeight = '400px',
  className = '',
  onChange,
  onFocus,
  onBlur,
  onUpdate,
  disabled = false
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { class: 'editor-paragraph' } },
        heading: { HTMLAttributes: { class: 'editor-heading' } },
        bulletList: { HTMLAttributes: { class: 'editor-bullet-list' } },
        orderedList: { HTMLAttributes: { class: 'editor-ordered-list' } },
        blockquote: { HTMLAttributes: { class: 'editor-blockquote' } },
        codeBlock: { HTMLAttributes: { class: 'editor-code-block' } },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' }
      }),
      Underline,
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength })
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      onUpdate?.(editor);
    },
    onFocus,
    onBlur
  });

  const handleEditorUpdate = useCallback(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    handleEditorUpdate();
  }, [handleEditorUpdate]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg h-32 flex items-center justify-center">
        <span className="text-gray-500">Загрузка редактора...</span>
      </div>
    );
  }

  const wordCount = editor.storage.characterCount.words();
  const charCount = editor.storage.characterCount.characters();

  return (
    <div className={`editor-container ${className}`}>
      <EditorContent
        editor={editor}
        className={`
          editor-content prose prose-lg max-w-none focus:outline-none
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
        `}
        style={{ minHeight }}
      />
      
      <div className="editor-footer flex justify-between items-center mt-2 text-sm text-gray-500">
        <span>{wordCount} слов, {charCount} символов</span>
        {maxLength && (
          <span className={charCount > maxLength ? 'text-red-500' : ''}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}; 