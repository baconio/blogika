'use client';

/**
 * ImageUploader - компонент для загрузки изображений в редактор
 * Микромодуль с поддержкой drag & drop и превью
 */

import { useState, useCallback, useRef, DragEvent } from 'react';
import type { 
  ImageUploaderProps, 
  UploadState, 
  ImagePreview,
  UploadButtonProps 
} from './ImageUploader.types';

/**
 * Кнопка для выбора файлов
 */
const UploadButton: React.FC<UploadButtonProps> = ({
  onFileSelect,
  disabled = false,
  multiple = false,
  accept = 'image/*',
  className = '',
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

/**
 * Проверяет валидность файла изображения
 */
const validateImageFile = (
  file: File,
  config: {
    maxFileSize?: number;
    allowedTypes?: readonly string[];
  }
): string | null => {
  const { maxFileSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = config;

  if (!allowedTypes.includes(file.type)) {
    return `Неподдерживаемый тип файла. Разрешены: ${allowedTypes.join(', ')}`;
  }

  if (file.size > maxFileSize) {
    const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
    return `Файл слишком большой. Максимальный размер: ${maxSizeMB} МБ`;
  }

  return null;
};

/**
 * Создает превью изображения
 */
const createImagePreview = (file: File): Promise<ImagePreview> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = (e) => {
      const url = e.target?.result as string;
      img.onload = () => {
        resolve({
          file,
          url,
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
      img.src = url;
    };

    reader.onerror = () => reject(new Error('Ошибка чтения файла'));
    reader.readAsDataURL(file);
  });
};

/**
 * Основной компонент загрузки изображений
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  className = '',
  variant = 'default',
  disabled = false,
  multiple = false,
  maxFileSize = 5 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  uploadUrl = '/api/upload',
  onUploadStart,
  onUploadProgress,
  onUploadSuccess,
  onUploadError,
  children
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<ImagePreview | null>(null);

  const handleFileSelect = useCallback(async (files: FileList) => {
    const file = files[0];
    if (!file) return;

    const validationError = validateImageFile(file, { maxFileSize, allowedTypes });
    if (validationError) {
      setUploadState({ status: 'error', progress: 0, error: validationError });
      onUploadError?.(validationError);
      return;
    }

    try {
      const imagePreview = await createImagePreview(file);
      setPreview(imagePreview);
      
      setUploadState({ status: 'uploading', progress: 0, filename: file.name });
      onUploadStart?.(file);

      // Симуляция загрузки (в реальном проекте здесь будет API вызов)
      const mockUpload = () => {
        return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadState(prev => ({ ...prev, progress }));
            onUploadProgress?.(progress);
            
            if (progress >= 100) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      };

      await mockUpload();

      const uploadedImage = {
        id: `img_${Date.now()}`,
        url: imagePreview.url,
        filename: file.name,
        size: file.size,
        width: imagePreview.width,
        height: imagePreview.height,
        alt: file.name
      };

      setUploadState({ status: 'success', progress: 100, filename: file.name });
      onUploadSuccess?.(uploadedImage);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки';
      setUploadState({ status: 'error', progress: 0, error: errorMessage });
      onUploadError?.(errorMessage);
    }
  }, [maxFileSize, allowedTypes, onUploadStart, onUploadProgress, onUploadSuccess, onUploadError]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const variantClasses = {
    default: 'p-6 border-2 border-dashed border-gray-300 rounded-lg',
    compact: 'p-4 border border-gray-200 rounded',
    inline: 'p-2'
  };

  return (
    <div
      className={`
        image-uploader
        ${variantClasses[variant]}
        ${isDragOver ? 'border-blue-400 bg-blue-50' : ''}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {uploadState.status === 'uploading' && (
        <div className="text-center">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadState.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Загрузка {uploadState.filename}... {uploadState.progress}%
          </p>
        </div>
      )}

      {uploadState.status === 'success' && preview && (
        <div className="text-center">
          <img 
            src={preview.url} 
            alt="Загруженное изображение" 
            className="max-h-32 mx-auto mb-2 rounded"
          />
          <p className="text-sm text-green-600">
            ✓ Изображение загружено успешно
          </p>
        </div>
      )}

      {uploadState.status === 'error' && (
        <div className="text-center text-red-600">
          <p className="text-sm">❌ {uploadState.error}</p>
        </div>
      )}

      {(uploadState.status === 'idle' || uploadState.status === 'error') && (
        <div className="text-center">
          {children || (
            <>
              <p className="text-gray-600 mb-4">
                Перетащите изображение сюда или
              </p>
              <UploadButton
                onFileSelect={handleFileSelect}
                disabled={disabled}
                multiple={multiple}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Выберите файл
              </UploadButton>
            </>
          )}
        </div>
      )}
    </div>
  );
}; 