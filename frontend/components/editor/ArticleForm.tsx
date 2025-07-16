'use client';

/**
 * ArticleForm - главная форма создания и редактирования статей
 * Микромодуль с интеграцией всех компонентов редактора
 */

import { useState, useCallback, useEffect } from 'react';
import { TiptapEditor } from './TiptapEditor';
import { EditorToolbar } from './EditorToolbar';
import { EditorMenuBar } from './EditorMenuBar';
import { ImageUploader } from './ImageUploader';
import type { 
  ArticleFormProps, 
  ArticleFormData, 
  ArticleFormState,
  FormTab 
} from './ArticleForm.types';

/**
 * Создает начальные данные формы
 */
const createInitialFormData = (initialData?: Partial<ArticleFormData>): ArticleFormData => ({
  title: '',
  content: '',
  excerpt: '',
  slug: '',
  categoryId: '',
  tagIds: [],
  status: 'draft',
  accessLevel: 'free',
  isFeatured: false,
  ...initialData
});

/**
 * Генерирует slug из заголовка
 */
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^а-яa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Навигация по табам формы
 */
const FormTabs: React.FC<{
  activeTab: FormTab;
  onTabChange: (tab: FormTab) => void;
  hasErrors: boolean;
}> = ({ activeTab, onTabChange, hasErrors }) => {
  const tabs: Array<{ id: FormTab; label: string; icon: string }> = [
    { id: 'content', label: 'Содержание', icon: '📝' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'preview', label: 'Превью', icon: '👁️' }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
              transition-colors duration-200
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {hasErrors && tab.id === 'content' && (
              <span className="w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

/**
 * Основной компонент формы статьи
 */
export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialData,
  mode = 'create',
  className = '',
  onSubmit,
  onSaveDraft,
  onCancel,
  autoSave = true,
  autoSaveInterval = 30000
}) => {
  const [formState, setFormState] = useState<ArticleFormState>({
    data: createInitialFormData(initialData),
    errors: {},
    isLoading: false,
    isDirty: false,
    isValid: false
  });

  const [activeTab, setActiveTab] = useState<FormTab>('content');
  const [editorInstance, setEditorInstance] = useState<any>(null);

  const updateFormData = useCallback((field: keyof ArticleFormData, value: any) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      isDirty: true
    }));

    // Автогенерация slug из заголовка
    if (field === 'title' && typeof value === 'string') {
      const newSlug = generateSlug(value);
      setFormState(prev => ({
        ...prev,
        data: { ...prev.data, slug: newSlug }
      }));
    }
  }, []);

  const handleContentChange = useCallback((content: string) => {
    updateFormData('content', content);
    
    // Автогенерация excerpt из контента (первые 200 символов)
    if (content && !formState.data.excerpt) {
      const textContent = content.replace(/<[^>]*>/g, '').substring(0, 200);
      updateFormData('excerpt', textContent + (textContent.length === 200 ? '...' : ''));
    }
  }, [updateFormData, formState.data.excerpt]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await onSubmit(formState.data);
      setFormState(prev => ({ ...prev, isDirty: false }));
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formState.data, onSubmit]);

  const handleSaveDraft = useCallback(async () => {
    if (!onSaveDraft || !formState.isDirty) return;
    
    try {
      await onSaveDraft({ ...formState.data, status: 'draft' });
      setFormState(prev => ({ ...prev, isDirty: false }));
    } catch (error) {
      console.error('Ошибка сохранения черновика:', error);
    }
  }, [formState.data, formState.isDirty, onSaveDraft]);

  // Автосохранение
  useEffect(() => {
    if (!autoSave || !formState.isDirty) return;

    const timer = setTimeout(handleSaveDraft, autoSaveInterval);
    return () => clearTimeout(timer);
  }, [autoSave, autoSaveInterval, formState.isDirty, handleSaveDraft]);

  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <div className={`article-form max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit}>
        {/* Заголовок формы */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'create' ? 'Создать новую статью' : 'Редактировать статью'}
          </h1>
          <p className="text-gray-600">
            {formState.isDirty && '• Несохраненные изменения'}
            {formState.isLoading && '• Сохранение...'}
          </p>
        </div>

        {/* Навигация по табам */}
        <FormTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          hasErrors={hasErrors}
        />

        {/* Контент в зависимости от активного таба */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Заголовок статьи */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок статьи *
              </label>
              <input
                type="text"
                value={formState.data.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Введите заголовок статьи"
                className={`
                  w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2
                  ${formState.errors.title 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                  }
                `}
                required
              />
              {formState.errors.title && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL (slug)
              </label>
              <input
                type="text"
                value={formState.data.slug}
                onChange={(e) => updateFormData('slug', e.target.value)}
                placeholder="url-статьи"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Редактор контента */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Содержание статьи *
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <EditorMenuBar editor={editorInstance} />
                <TiptapEditor
                  content={formState.data.content}
                  onChange={handleContentChange}
                  onUpdate={setEditorInstance}
                  placeholder="Начните писать вашу статью..."
                  className="min-h-96"
                />
              </div>
              {formState.errors.content && (
                <p className="mt-1 text-sm text-red-600">{formState.errors.content}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Краткое описание
              </label>
              <textarea
                value={formState.data.excerpt}
                onChange={(e) => updateFormData('excerpt', e.target.value)}
                placeholder="Краткое описание статьи (будет сгенерировано автоматически)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Остальные табы TODO: будут реализованы в следующих компонентах */}
        {activeTab === 'settings' && (
          <div className="text-center py-8 text-gray-500">
            Настройки публикации (TODO: PublishSettings компонент)
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="text-center py-8 text-gray-500">
            SEO настройки (TODO: SEO компонент)
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="text-center py-8 text-gray-500">
            Превью статьи (TODO: EditorPreview компонент)
          </div>
        )}

        {/* Кнопки действий */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
            )}
            
            {onSaveDraft && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={!formState.isDirty}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Сохранить черновик
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={formState.isLoading || !formState.data.title || !formState.data.content}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {formState.isLoading ? 'Сохранение...' : 'Опубликовать'}
          </button>
        </div>
      </form>
    </div>
  );
}; 