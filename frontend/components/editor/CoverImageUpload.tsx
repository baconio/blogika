/**
 * @fileoverview CoverImageUpload component for article cover image management
 * Features: drag & drop, validation, progress tracking, preview
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { 
  PhotoIcon, 
  XMarkIcon, 
  PencilIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon 
} from '@heroicons/react/24/outline';
import type { 
  CoverImageUploadProps, 
  UploadState,
  ImageMetadata,
  FileValidationResult,
  DEFAULT_IMAGE_VALIDATION,
  DEFAULT_OPTIMIZATION
} from './CoverImageUpload.types';

/**
 * CoverImageUpload component for managing article cover images
 * Supports drag & drop, validation, progress tracking, and preview
 */
export const CoverImageUpload: React.FC<CoverImageUploadProps> = ({
  currentImageId,
  currentImageUrl,
  onImageChange,
  validationConfig = {},
  optimizationConfig = {},
  disabled = false,
  required = false,
  error,
  className = ''
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0
  });
  const [isDragActive, setIsDragActive] = useState(false);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata>();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  const config = { ...DEFAULT_IMAGE_VALIDATION, ...validationConfig };
  const optimization = { ...DEFAULT_OPTIMIZATION, ...optimizationConfig };

  /**
   * Validates image file against configuration
   */
  const validateImageFile = useCallback(async (file: File): Promise<FileValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // File size validation
    if (file.size > config.maxSizeBytes) {
      errors.push(`Размер файла превышает ${Math.round(config.maxSizeBytes / 1024 / 1024)}MB`);
    }
    
    // Format validation
    if (!config.allowedFormats.includes(file.type)) {
      errors.push('Неподдерживаемый формат файла');
    }
    
    // Get image dimensions
    let metadata: ImageMetadata | undefined;
    try {
      const img = new Image();
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
      
      metadata = {
        filename: file.name,
        size: file.size,
        width: dimensions.width,
        height: dimensions.height,
        format: file.type,
        lastModified: file.lastModified
      };
      
      // Dimension validation
      if (dimensions.width < config.minWidth) {
        errors.push(`Минимальная ширина: ${config.minWidth}px`);
      }
      if (dimensions.height < config.minHeight) {
        errors.push(`Минимальная высота: ${config.minHeight}px`);
      }
      if (dimensions.width > config.maxWidth) {
        warnings.push(`Изображение будет сжато до ${config.maxWidth}px по ширине`);
      }
      if (dimensions.height > config.maxHeight) {
        warnings.push(`Изображение будет сжато до ${config.maxHeight}px по высоте`);
      }
      
      // Aspect ratio validation
      if (config.aspectRatio) {
        const imageRatio = dimensions.width / dimensions.height;
        const expectedRatio = config.aspectRatio.width / config.aspectRatio.height;
        const tolerance = 0.1;
        
        if (Math.abs(imageRatio - expectedRatio) > tolerance) {
          warnings.push(
            `Рекомендуемое соотношение сторон: ${config.aspectRatio.width}:${config.aspectRatio.height}`
          );
        }
      }
      
      URL.revokeObjectURL(img.src);
    } catch (error) {
      errors.push('Не удалось обработать изображение');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata
    };
  }, [config]);

  /**
   * Uploads image to server with progress tracking
   */
  const uploadImage = useCallback(async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'articles/covers');
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadState(prev => ({ ...prev, uploadProgress: progress }));
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({ id: response.id, url: response.url });
          } catch (error) {
            reject(new Error('Ошибка обработки ответа сервера'));
          }
        } else {
          reject(new Error(`Ошибка загрузки: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Ошибка сети'));
      });
      
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  }, []);

  /**
   * Handles file selection and upload
   */
  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled) return;
    
    // Validate file
    const validation = await validateImageFile(file);
    
    if (!validation.isValid) {
      setUploadState(prev => ({ 
        ...prev, 
        error: validation.errors.join(', ') 
      }));
      return;
    }
    
    setImageMetadata(validation.metadata);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadState(prev => ({ 
      ...prev, 
      previewUrl,
      error: undefined,
      isUploading: true,
      uploadProgress: 0
    }));
    
    try {
      const { id, url } = await uploadImage(file);
      
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false,
        uploadedImageId: id
      }));
      
      onImageChange(id, url);
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      setUploadState(prev => ({ 
        ...prev, 
        isUploading: false,
        error: error instanceof Error ? error.message : 'Ошибка загрузки'
      }));
      URL.revokeObjectURL(previewUrl);
    }
  }, [disabled, validateImageFile, uploadImage, onImageChange]);

  /**
   * Handles image removal
   */
  const handleImageRemove = useCallback(() => {
    if (disabled) return;
    
    setUploadState({
      isUploading: false,
      uploadProgress: 0
    });
    setImageMetadata(undefined);
    onImageChange(undefined, undefined);
  }, [disabled, onImageChange]);

  /**
   * Handles drag and drop events
   */
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    dragCounterRef.current = 0;
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  }, [disabled, handleFileSelect]);

  /**
   * Handles file input change
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  /**
   * Opens file picker
   */
  const openFilePicker = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  const hasImage = currentImageUrl || uploadState.previewUrl;
  const acceptedTypes = config.allowedFormats.join(',');

  return (
    <div className={`cover-image-upload ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleInputChange}
        className="hidden"
      />

      {hasImage ? (
        // Image preview
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <img
              src={currentImageUrl || uploadState.previewUrl}
              alt="Cover preview"
              className="w-full h-48 object-cover"
            />
            
            {uploadState.isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <CloudArrowUpIcon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">Загрузка {uploadState.uploadProgress}%</div>
                  <div className="w-32 h-2 bg-gray-600 rounded-full mt-2">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${uploadState.uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {!disabled && !uploadState.isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                    title="Заменить изображение"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleImageRemove}
                    className="p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                    title="Удалить изображение"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {imageMetadata && (
            <div className="mt-2 text-xs text-gray-500">
              {imageMetadata.filename} • {Math.round(imageMetadata.size / 1024)}KB • {imageMetadata.width}×{imageMetadata.height}
            </div>
          )}
        </div>
      ) : (
        // Drop zone
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-gray-400'
          } ${error ? 'border-red-500' : ''}`}
          onClick={openFilePicker}
        >
          <PhotoIcon className={`w-12 h-12 mx-auto mb-4 ${
            disabled ? 'text-gray-300' : 'text-gray-400'
          }`} />
          
          <div className={`text-lg font-medium mb-2 ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {isDragActive ? 'Отпустите для загрузки' : 'Добавить обложку'}
          </div>
          
          <div className={`text-sm mb-4 ${
            disabled ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Перетащите изображение или нажмите для выбора
          </div>
          
          <div className={`text-xs ${
            disabled ? 'text-gray-400' : 'text-gray-400'
          }`}>
            Поддерживаются: JPEG, PNG, WebP до {Math.round(config.maxSizeBytes / 1024 / 1024)}MB
            {config.aspectRatio && (
              <div className="mt-1">
                Рекомендуемое соотношение: {config.aspectRatio.width}:{config.aspectRatio.height}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {(error || uploadState.error) && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error || uploadState.error}
        </div>
      )}
      
      {/* Required indicator */}
      {required && !hasImage && (
        <div className="text-red-600 text-xs mt-1">
          * Обложка обязательна
        </div>
      )}
    </div>
  );
}; 