/**
 * @fileoverview EditorPreview component for article preview and auto-save
 * Features: responsive preview, auto-save, content statistics, draft recovery
 */

'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { 
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DevicePhoneIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '@/lib/utils/formatting';
import { calculateReadingTime, generateExcerpt } from '@/lib/utils/content';
import type { 
  EditorPreviewProps,
  AutoSaveState,
  ContentStatistics,
  DEFAULT_AUTOSAVE_CONFIG,
  DEFAULT_PREVIEW_OPTIONS,
  PREVIEW_DEVICES 
} from './EditorPreview.types';

/**
 * EditorPreview component for article preview with auto-save
 * Supports responsive preview modes and automatic content saving
 */
export const EditorPreview: React.FC<EditorPreviewProps> = ({
  article,
  previewMode,
  onPreviewModeChange,
  autoSaveConfig = {},
  renderOptions = {},
  onSave,
  onPublish,
  isVisible,
  className = ''
}) => {
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    status: 'idle',
    hasChanges: false,
    retryCount: 0
  });

  const lastContentRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const autoSaveIntervalRef = useRef<NodeJS.Timeout>();

  const config = { ...DEFAULT_AUTOSAVE_CONFIG, ...autoSaveConfig };
  const renderOpts = { ...DEFAULT_PREVIEW_OPTIONS, ...renderOptions };

  /**
   * Calculates content statistics
   */
  const contentStats = useMemo((): ContentStatistics => {
    const content = article.content || '';
    const text = content.replace(/<[^>]*>/g, ''); // Strip HTML
    
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characterCount = text.length;
    const paragraphCount = content.split(/<\/p>/gi).length - 1;
    const imageCount = (content.match(/<img[^>]*>/gi) || []).length;
    const linkCount = (content.match(/<a[^>]*>/gi) || []).length;
    const readingTime = calculateReadingTime(content);

    return {
      wordCount,
      characterCount,
      paragraphCount,
      imageCount,
      linkCount,
      readingTime
    };
  }, [article.content]);

  /**
   * Performs auto-save operation
   */
  const performAutoSave = useCallback(async () => {
    if (!onSave || !config.enabled) return;

    setAutoSaveState(prev => ({ 
      ...prev, 
      status: 'saving' 
    }));

    try {
      await onSave();
      setAutoSaveState(prev => ({ 
        ...prev, 
        status: 'saved',
        lastSaved: new Date(),
        hasChanges: false,
        error: undefined,
        retryCount: 0
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка сохранения';
      setAutoSaveState(prev => ({ 
        ...prev, 
        status: 'error',
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }));

      // Retry if under max retries
      if (autoSaveState.retryCount < config.maxRetries) {
        setTimeout(() => {
          performAutoSave();
        }, 5000); // Retry after 5 seconds
      }
    }
  }, [onSave, config.enabled, config.maxRetries, autoSaveState.retryCount]);

  /**
   * Handles content changes for auto-save
   */
  const handleContentChange = useCallback(() => {
    const currentContent = JSON.stringify(article);
    
    if (currentContent !== lastContentRef.current) {
      lastContentRef.current = currentContent;
      setAutoSaveState(prev => ({ 
        ...prev, 
        hasChanges: true,
        status: 'idle'
      }));

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new debounced save
      saveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, config.debounceMs);
    }
  }, [article, performAutoSave, config.debounceMs]);

  /**
   * Renders auto-save indicator
   */
  const renderAutoSaveIndicator = useCallback(() => {
    const { status, lastSaved, hasChanges, error } = autoSaveState;

    let icon, text, color;

    switch (status) {
      case 'saving':
        icon = <CloudArrowUpIcon className="w-4 h-4 animate-spin" />;
        text = 'Сохранение...';
        color = 'text-blue-600';
        break;
      case 'saved':
        icon = <CheckCircleIcon className="w-4 h-4" />;
        text = lastSaved ? `Сохранено ${formatDate(lastSaved, 'time')}` : 'Сохранено';
        color = 'text-green-600';
        break;
      case 'error':
        icon = <ExclamationTriangleIcon className="w-4 h-4" />;
        text = error || 'Ошибка сохранения';
        color = 'text-red-600';
        break;
      default:
        if (hasChanges) {
          icon = <ClockIcon className="w-4 h-4" />;
          text = 'Есть несохраненные изменения';
          color = 'text-yellow-600';
        } else {
          return null;
        }
    }

    return (
      <div className={`flex items-center gap-2 text-sm ${color}`}>
        {icon}
        <span>{text}</span>
      </div>
    );
  }, [autoSaveState]);

  /**
   * Renders preview device selector
   */
  const renderDeviceSelector = useCallback(() => (
    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
      {Object.entries(PREVIEW_DEVICES).map(([mode, device]) => (
        <button
          key={mode}
          type="button"
          onClick={() => onPreviewModeChange(mode as any)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-r border-gray-300 last:border-r-0 ${
            previewMode === mode
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title={device.name}
        >
          <span>{device.icon}</span>
          <span className="hidden sm:inline">{device.name}</span>
        </button>
      ))}
    </div>
  ), [previewMode, onPreviewModeChange]);

  /**
   * Renders content statistics
   */
  const renderContentStats = useCallback(() => (
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <span>{contentStats.wordCount} слов</span>
      <span>{contentStats.readingTime} мин чтения</span>
      <span>{contentStats.paragraphCount} абзацев</span>
      {contentStats.imageCount > 0 && (
        <span>{contentStats.imageCount} изображений</span>
      )}
    </div>
  ), [contentStats]);

  /**
   * Renders article preview content
   */
  const renderPreviewContent = useCallback(() => {
    const deviceConfig = PREVIEW_DEVICES[previewMode];
    
    return (
      <div 
        className="mx-auto bg-white border border-gray-200 rounded-lg shadow-sm"
        style={{ 
          width: deviceConfig.width,
          maxWidth: deviceConfig.maxWidth 
        }}
      >
        {/* Article header */}
        <div className="p-6 pb-4 border-b border-gray-200">
          {article.coverImageUrl && (
            <img
              src={article.coverImageUrl}
              alt="Cover"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          )}
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {article.title || 'Заголовок статьи'}
          </h1>
          
          {renderOpts.showMetadata && (
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {article.category && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {article.category.name}
                </span>
              )}
              
              {renderOpts.showReadingTime && (
                <span>{contentStats.readingTime} мин чтения</span>
              )}
              
              {renderOpts.showWordCount && (
                <span>{contentStats.wordCount} слов</span>
              )}
              
              {renderOpts.showPublishDate && article.publishedAt && (
                <span>{formatDate(article.publishedAt)}</span>
              )}
            </div>
          )}
          
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Article content */}
        <div className="p-6">
          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: article.content || '<p class="text-gray-500">Начните писать...</p>' 
            }}
          />
        </div>
      </div>
    );
  }, [article, previewMode, renderOpts, contentStats]);

  // Set up auto-save interval
  useEffect(() => {
    if (config.enabled && config.intervalMs > 0) {
      autoSaveIntervalRef.current = setInterval(() => {
        if (autoSaveState.hasChanges && autoSaveState.status !== 'saving') {
          performAutoSave();
        }
      }, config.intervalMs);

      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [config.enabled, config.intervalMs, autoSaveState.hasChanges, autoSaveState.status, performAutoSave]);

  // Track content changes
  useEffect(() => {
    handleContentChange();
  }, [handleContentChange]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`editor-preview h-full flex flex-col bg-gray-50 ${className}`}>
      {/* Preview toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <EyeIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900">Превью</span>
          </div>
          
          {renderDeviceSelector()}
        </div>
        
        <div className="flex items-center gap-4">
          {config.enabled && renderAutoSaveIndicator()}
          
          <div className="flex gap-2">
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={autoSaveState.status === 'saving'}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Сохранить
              </button>
            )}
            
            {onPublish && (
              <button
                type="button"
                onClick={onPublish}
                disabled={autoSaveState.status === 'saving'}
                className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Опубликовать
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content statistics */}
      <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
        {renderContentStats()}
      </div>
      
      {/* Preview content */}
      <div className="flex-1 overflow-auto p-6">
        {renderPreviewContent()}
      </div>
    </div>
  );
}; 