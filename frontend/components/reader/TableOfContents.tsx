'use client';

import { useState, useEffect } from 'react';

/**
 * Элемент оглавления
 */
interface TOCItem {
  readonly id: string;
  readonly text: string;
  readonly level: number;
  readonly element?: HTMLElement;
}

/**
 * Пропсы компонента оглавления
 */
interface TableOfContentsProps {
  readonly selector?: string;
  readonly minHeadings?: number;
  readonly maxLevel?: number;
  readonly position?: 'sidebar' | 'inline';
  readonly sticky?: boolean;
}

/**
 * Извлекает заголовки из контента и создает оглавление
 * @param selector - CSS селектор контейнера с контентом
 * @param maxLevel - максимальный уровень заголовков (1-6)
 * @returns массив элементов оглавления
 */
const extractHeadings = (selector: string, maxLevel: number): TOCItem[] => {
  if (typeof window === 'undefined') return [];

  const container = document.querySelector(selector);
  if (!container) return [];

  const headingSelectors = Array.from({ length: maxLevel }, (_, i) => `h${i + 1}`).join(', ');
  const headings = container.querySelectorAll(headingSelectors);

  return Array.from(headings).map((heading, index) => {
    const element = heading as HTMLElement;
    const level = parseInt(element.tagName.charAt(1));
    
    // Создаем ID если его нет
    if (!element.id) {
      const slug = element.textContent
        ?.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim() || `heading-${index}`;
      element.id = slug;
    }

    return {
      id: element.id,
      text: element.textContent || '',
      level,
      element
    };
  });
};

/**
 * Компонент оглавления для длинных статей
 * Автоматически извлекает заголовки и создает навигацию
 * @param selector - CSS селектор контейнера с контентом
 * @param minHeadings - минимальное количество заголовков для показа оглавления
 * @param maxLevel - максимальный уровень заголовков
 * @param position - позиция оглавления
 * @param sticky - делать ли оглавление липким
 * @returns JSX элемент оглавления
 */
export const TableOfContents = ({
  selector = 'article',
  minHeadings = 3,
  maxLevel = 3,
  position = 'sidebar',
  sticky = true
}: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Извлечение заголовков при монтировании
  useEffect(() => {
    const extractedHeadings = extractHeadings(selector, maxLevel);
    setHeadings(extractedHeadings);
  }, [selector, maxLevel]);

  // Отслеживание активного заголовка при скролле
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .map(entry => entry.target.id);

        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0]);
        }
      },
      {
        rootMargin: '-20% 0% -35% 0%'
      }
    );

    headings.forEach(heading => {
      if (heading.element) {
        observer.observe(heading.element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Не показываем оглавление если заголовков мало
  if (headings.length < minHeadings) {
    return null;
  }

  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const containerClasses = position === 'sidebar'
    ? `${sticky ? 'sticky top-8' : ''} bg-gray-50 rounded-lg p-4`
    : 'bg-white border rounded-lg p-4 mb-6';

  return (
    <nav className={containerClasses}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Содержание
      </h3>
      
      <ul className="space-y-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const indentClass = heading.level > 1 ? `ml-${(heading.level - 1) * 3}` : '';
          
          return (
            <li key={heading.id} className={indentClass}>
              <button
                onClick={() => handleHeadingClick(heading.id)}
                className={`text-left w-full text-sm transition-colors duration-200 hover:text-blue-600 ${
                  isActive 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600'
                }`}
                title={heading.text}
              >
                <span className="line-clamp-2 leading-relaxed">
                  {heading.text}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Прогресс чтения оглавления */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Прогресс:</span>
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{
                width: headings.length > 0 
                  ? `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%`
                  : '0%'
              }}
            />
          </div>
          <span>
            {headings.findIndex(h => h.id === activeId) + 1}/{headings.length}
          </span>
        </div>
      </div>
    </nav>
  );
}; 