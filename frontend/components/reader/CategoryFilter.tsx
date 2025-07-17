'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/Category';
import { Button } from '@/components/ui/Button';

/**
 * Пропсы компонента фильтра категорий
 */
interface CategoryFilterProps {
  readonly categories: Category[];
  readonly activeCategory?: string;
  readonly onCategoryChange?: (categorySlug: string | null) => void;
  readonly variant?: 'tabs' | 'pills' | 'dropdown';
  readonly showAll?: boolean;
  readonly maxVisible?: number;
}

/**
 * Компонент для фильтрации статей по категориям
 * Поддерживает различные варианты отображения
 * @param categories - массив доступных категорий
 * @param activeCategory - slug активной категории
 * @param onCategoryChange - обработчик изменения категории
 * @param variant - вариант отображения фильтра
 * @param showAll - показывать ли опцию "Все категории"
 * @param maxVisible - максимальное количество видимых категорий
 * @returns JSX элемент фильтра категорий
 */
export const CategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  variant = 'tabs',
  showAll = true,
  maxVisible = 6
}: CategoryFilterProps) => {
  const [showMore, setShowMore] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const visibleCategories = showMore ? categories : categories.slice(0, maxVisible);
  const hasMoreCategories = categories.length > maxVisible;

  const handleCategoryClick = (categorySlug: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(categorySlug);
    }
    setIsDropdownOpen(false);
  };

  // Tabs variant
  if (variant === 'tabs') {
    return (
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {/* Все категории */}
          {showAll && (
            <button
              onClick={() => handleCategoryClick(null)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                !activeCategory
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Все статьи
            </button>
          )}

          {/* Категории */}
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeCategory === category.slug
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}

          {/* Показать больше */}
          {hasMoreCategories && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              {showMore ? 'Скрыть' : `+${categories.length - maxVisible}`}
            </button>
          )}
        </nav>
      </div>
    );
  }

  // Pills variant
  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-2">
        {/* Все категории */}
        {showAll && (
          <Button
            variant={!activeCategory ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(null)}
          >
            Все
          </Button>
        )}

        {/* Категории */}
        {visibleCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.slug ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(category.slug)}
            style={
              activeCategory === category.slug
                ? { backgroundColor: category.color, borderColor: category.color }
                : { borderColor: category.color, color: category.color }
            }
          >
            {category.name}
          </Button>
        ))}

        {/* Показать больше */}
        {hasMoreCategories && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Скрыть' : `+${categories.length - maxVisible}`}
          </Button>
        )}
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2"
      >
        <span>
          {activeCategory
            ? categories.find(c => c.slug === activeCategory)?.name || 'Категория'
            : 'Все категории'
          }
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {/* Все категории */}
            {showAll && (
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  !activeCategory
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Все категории
              </button>
            )}

            {/* Категории */}
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                  activeCategory === category.slug
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {/* Цветовой индикатор */}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color || '#6b7280' }}
                />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}; 