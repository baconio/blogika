'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

/**
 * Типы для меню категорий
 */
interface Category {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly color?: string;
  readonly description?: string;
  readonly articleCount?: number;
}

interface CategoryMenuProps {
  readonly categories?: Category[];
  readonly variant?: 'dropdown' | 'horizontal' | 'vertical';
  readonly showCounts?: boolean;
  readonly maxItems?: number;
}

/**
 * Компонент выпадающего меню категорий
 * @param categories - список категорий
 * @param variant - вариант отображения меню
 * @param showCounts - показывать ли количество статей
 * @param maxItems - максимальное количество отображаемых категорий
 * @returns JSX элемент меню категорий
 */
export const CategoryMenu = ({
  categories = [],
  variant = 'dropdown',
  showCounts = false,
  maxItems = 10
}: CategoryMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Моковые данные для демонстрации (в реальном приложении будут загружаться с API)
  const mockCategories: Category[] = [
    { id: '1', name: 'Технологии', slug: 'tech', color: '#3B82F6', articleCount: 45 },
    { id: '2', name: 'Дизайн', slug: 'design', color: '#8B5CF6', articleCount: 32 },
    { id: '3', name: 'Бизнес', slug: 'business', color: '#10B981', articleCount: 28 },
    { id: '4', name: 'Саморазвитие', slug: 'self-development', color: '#F59E0B', articleCount: 21 },
    { id: '5', name: 'Наука', slug: 'science', color: '#EF4444', articleCount: 16 }
  ];
  
  const displayCategories = (categories.length > 0 ? categories : mockCategories)
    .slice(0, maxItems);
  
  if (variant === 'horizontal') {
    return (
      <nav className="flex flex-wrap gap-2">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors hover:bg-gray-100"
            style={{ 
              borderColor: category.color,
              color: category.color 
            }}
          >
            <span>{category.name}</span>
            {showCounts && category.articleCount && (
              <Badge variant="outline" className="text-xs">
                {category.articleCount}
              </Badge>
            )}
          </Link>
        ))}
      </nav>
    );
  }
  
  if (variant === 'vertical') {
    return (
      <nav className="space-y-2">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-50 group"
          >
            <div className="flex items-center gap-3">
              {category.color && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
              <span className="font-medium text-gray-900 group-hover:text-blue-600">
                {category.name}
              </span>
            </div>
            {showCounts && category.articleCount && (
              <Badge variant="outline" className="text-xs">
                {category.articleCount}
              </Badge>
            )}
          </Link>
        ))}
      </nav>
    );
  }
  
  // Dropdown variant
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Категории
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-50">
          <div className="py-2">
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  {category.color && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600">
                      {category.name}
                    </div>
                    {category.description && (
                      <div className="text-xs text-gray-500 mt-1">
                        {category.description}
                      </div>
                    )}
                  </div>
                </div>
                {showCounts && category.articleCount && (
                  <Badge variant="outline" className="text-xs">
                    {category.articleCount}
                  </Badge>
                )}
              </Link>
            ))}
            
            <div className="border-t mt-2 pt-2">
              <Link
                href="/categories"
                className="block px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Все категории →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 