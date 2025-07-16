/**
 * @fileoverview TypeScript types for CoverImageUpload component
 * Handles cover image upload, validation, cropping, and optimization
 */

/** Upload state management */
export interface UploadState {
  readonly isUploading: boolean;
  readonly uploadProgress: number;
  readonly error?: string;
  readonly previewUrl?: string;
  readonly uploadedImageId?: string;
}

/** Image file validation configuration */
export interface ImageValidationConfig {
  readonly maxSizeBytes: number;
  readonly allowedFormats: readonly string[];
  readonly minWidth: number;
  readonly minHeight: number;
  readonly maxWidth: number;
  readonly maxHeight: number;
  readonly aspectRatio?: {
    readonly width: number;
    readonly height: number;
  };
}

/** Crop area coordinates */
export interface CropArea {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** Image optimization settings */
export interface ImageOptimization {
  readonly quality: number;
  readonly format: 'webp' | 'jpeg' | 'png';
  readonly maxWidth: number;
  readonly maxHeight: number;
  readonly enableCrop: boolean;
}

/** Upload handlers */
export interface UploadHandlers {
  readonly onFileSelect: (file: File) => void;
  readonly onUploadStart: () => void;
  readonly onUploadProgress: (progress: number) => void;
  readonly onUploadSuccess: (imageId: string, url: string) => void;
  readonly onUploadError: (error: string) => void;
  readonly onImageRemove: () => void;
  readonly onCropChange?: (crop: CropArea) => void;
}

/** Image metadata */
export interface ImageMetadata {
  readonly filename: string;
  readonly size: number;
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly lastModified: number;
}

/** Props for the main CoverImageUpload component */
export interface CoverImageUploadProps {
  readonly currentImageId?: string;
  readonly currentImageUrl?: string;
  readonly onImageChange: (imageId?: string, imageUrl?: string) => void;
  readonly validationConfig?: Partial<ImageValidationConfig>;
  readonly optimizationConfig?: Partial<ImageOptimization>;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly error?: string;
  readonly className?: string;
}

/** Props for drag and drop area */
export interface DropZoneProps {
  readonly onFileSelect: (file: File) => void;
  readonly accept: string;
  readonly disabled: boolean;
  readonly isDragActive: boolean;
  readonly className?: string;
}

/** Props for image preview component */
export interface ImagePreviewProps {
  readonly imageUrl: string;
  readonly imageMetadata?: ImageMetadata;
  readonly onRemove: () => void;
  readonly onEdit?: () => void;
  readonly showMetadata: boolean;
  readonly className?: string;
}

/** Props for upload progress component */
export interface UploadProgressProps {
  readonly progress: number;
  readonly fileName: string;
  readonly onCancel?: () => void;
  readonly className?: string;
}

/** Props for crop editor component */
export interface CropEditorProps {
  readonly imageUrl: string;
  readonly aspectRatio?: number;
  readonly onCropChange: (crop: CropArea) => void;
  readonly onSave: (croppedImage: Blob) => void;
  readonly onCancel: () => void;
  readonly isVisible: boolean;
  readonly className?: string;
}

/** File validation result */
export interface FileValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly metadata?: ImageMetadata;
}

/** Default validation configuration */
export const DEFAULT_IMAGE_VALIDATION: ImageValidationConfig = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  minWidth: 800,
  minHeight: 400,
  maxWidth: 2400,
  maxHeight: 1600,
  aspectRatio: { width: 16, height: 9 }
} as const;

/** Default optimization settings */
export const DEFAULT_OPTIMIZATION: ImageOptimization = {
  quality: 85,
  format: 'webp',
  maxWidth: 1200,
  maxHeight: 800,
  enableCrop: true
} as const;

/** Supported image formats with extensions */
export const SUPPORTED_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp']
} as const; 