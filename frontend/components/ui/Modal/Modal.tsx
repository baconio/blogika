/**
 * Modal компонент с полной поддержкой DaisyUI
 * Поддерживает композицию и управление состоянием
 */

'use client';

import React, { useCallback, useEffect } from 'react';
import { cn } from '../index';
import type { ModalProps, ModalHeaderProps, ModalFooterProps, ModalSize } from './Modal.types';

/**
 * Получить CSS классы для размера модала
 */
const getModalSizeClass = (size: ModalSize): string => {
  const sizeClasses: Record<ModalSize, string> = {
    sm: 'modal-box w-80 max-w-sm',
    md: 'modal-box w-96 max-w-md', 
    lg: 'modal-box w-[32rem] max-w-2xl',
    xl: 'modal-box w-[48rem] max-w-4xl',
    full: 'modal-box w-11/12 max-w-5xl h-5/6'
  };
  return sizeClasses[size];
};

/**
 * Заголовок модала с кнопкой закрытия
 */
const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose, showCloseButton }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-bold">{title}</h3>
    {showCloseButton && (
      <button
        className="btn btn-sm btn-circle btn-ghost"
        onClick={onClose}
        aria-label="Закрыть модал"
      >
        ✕
      </button>
    )}
  </div>
);

/**
 * Футер модала для кнопок действий
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({ children, className }) => (
  <div className={cn('modal-action', className)}>
    {children}
  </div>
);

/**
 * Основной компонент модала
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  analyticsEvent,
  analyticsData
}) => {
  /**
   * Обработка закрытия модала с аналитикой
   */
  const handleClose = useCallback(() => {
    if (analyticsEvent && typeof window !== 'undefined') {
      // Отправка аналитики закрытия модала
      console.log('Modal closed:', analyticsEvent, analyticsData);
    }
    onClose();
  }, [onClose, analyticsEvent, analyticsData]);

  /**
   * Обработка клика по backdrop
   */
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      handleClose();
    }
  }, [closeOnBackdrop, handleClose]);

  /**
   * Обработка нажатия клавиш
   */
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, handleClose]);

  /**
   * Управление скроллом body
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" onClick={handleBackdropClick}>
      <div className={cn(getModalSizeClass(size), className)}>
        {title && (
          <ModalHeader 
            title={title} 
            onClose={handleClose} 
            showCloseButton={showCloseButton} 
          />
        )}
        
        <div className="py-4">
          {children}
        </div>
      </div>
    </div>
  );
}; 