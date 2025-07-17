'use client';

import { useReadingProgress } from '@/hooks/useReadingProgress';

/**
 * Пропсы компонента прогресса чтения
 */
interface ReadingProgressProps {
  readonly targetSelector?: string;
  readonly showPercentage?: boolean;
  readonly position?: 'top' | 'bottom';
  readonly color?: string;
  readonly height?: number;
}

/**
 * Компонент индикатора прогресса чтения статьи
 * Отображает полосу прогресса на основе позиции скролла
 * @param targetSelector - CSS селектор контейнера для отслеживания
 * @param showPercentage - показывать ли процент прочитанного
 * @param position - позиция полосы прогресса
 * @param color - цвет полосы прогресса
 * @param height - высота полосы прогресса в пикселях
 * @returns JSX элемент прогресса чтения
 */
export const ReadingProgress = ({
  targetSelector = 'article',
  showPercentage = false,
  position = 'top',
  color = '#3b82f6',
  height = 3
}: ReadingProgressProps) => {
  const { progress, isVisible } = useReadingProgress({
    targetSelector,
    throttleMs: 50
  });

  if (!isVisible) return null;

  const positionClasses = position === 'top' 
    ? 'fixed top-0 left-0 right-0 z-50'
    : 'fixed bottom-0 left-0 right-0 z-50';

  return (
    <>
      {/* Полоса прогресса */}
      <div className={positionClasses}>
        <div 
          className="bg-gray-200 transition-opacity duration-300"
          style={{ height: `${height}px` }}
        >
          <div
            className="bg-current transition-all duration-150 ease-out h-full"
            style={{ 
              width: `${progress}%`,
              color: color 
            }}
          />
        </div>
      </div>

      {/* Процент прочитанного (опционально) */}
      {showPercentage && (
        <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-full px-3 py-1 text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </div>
      )}
    </>
  );
}; 