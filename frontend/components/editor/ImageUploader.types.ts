/**
 * Типы для ImageUploader компонента
 * Микромодуль для типизации загрузки изображений в редактор
 */

/**
 * Состояние загрузки изображения
 */
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * Информация о загруженном изображении
 */
export interface UploadedImage {
  readonly id: string;
  readonly url: string;
  readonly filename: string;
  readonly size: number;
  readonly width?: number;
  readonly height?: number;
  readonly alt?: string;
}

/**
 * Результат загрузки изображения
 */
export interface UploadResult {
  readonly success: boolean;
  readonly image?: UploadedImage;
  readonly error?: string;
}

/**
 * Обработчики загрузки
 */
export interface UploadHandlers {
  readonly onUploadStart?: (file: File) => void;
  readonly onUploadProgress?: (progress: number) => void;
  readonly onUploadSuccess?: (result: UploadedImage) => void;
  readonly onUploadError?: (error: string) => void;
}

/**
 * Конфигурация загрузки
 */
export interface UploadConfig {
  readonly maxFileSize?: number; // в байтах
  readonly allowedTypes?: readonly string[];
  readonly maxWidth?: number;
  readonly maxHeight?: number;
  readonly quality?: number; // 0-1 для сжатия
}

/**
 * Пропсы для ImageUploader
 */
export interface ImageUploaderProps extends UploadHandlers, UploadConfig {
  readonly className?: string;
  readonly variant?: 'default' | 'compact' | 'inline';
  readonly disabled?: boolean;
  readonly multiple?: boolean;
  readonly uploadUrl?: string;
  readonly children?: React.ReactNode;
}

/**
 * Пропсы для UploadButton
 */
export interface UploadButtonProps {
  readonly onFileSelect: (files: FileList) => void;
  readonly disabled?: boolean;
  readonly multiple?: boolean;
  readonly accept?: string;
  readonly className?: string;
  readonly children: React.ReactNode;
}

/**
 * Состояние процесса загрузки
 */
export interface UploadState {
  readonly status: UploadStatus;
  readonly progress: number;
  readonly filename?: string;
  readonly error?: string;
}

/**
 * Превью изображения перед загрузкой
 */
export interface ImagePreview {
  readonly file: File;
  readonly url: string;
  readonly width: number;
  readonly height: number;
} 