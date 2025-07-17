import Link from 'next/link';
import { Tag } from '@/types/Tag';

/**
 * Пропсы компонента облака тегов
 */
interface TagCloudProps {
  readonly tags: Tag[];
  readonly maxTags?: number;
  readonly minSize?: number;
  readonly maxSize?: number;
  readonly showUsageCount?: boolean;
  readonly variant?: 'cloud' | 'list' | 'pills';
}

/**
 * Расчитывает размер шрифта для тега на основе его популярности
 * @param usageCount - количество использований тега
 * @param minUsage - минимальное количество использований среди всех тегов
 * @param maxUsage - максимальное количество использований среди всех тегов
 * @param minSize - минимальный размер шрифта
 * @param maxSize - максимальный размер шрифта
 * @returns размер шрифта в rem
 */
const calculateFontSize = (
  usageCount: number,
  minUsage: number,
  maxUsage: number,
  minSize: number,
  maxSize: number
): number => {
  if (maxUsage === minUsage) return minSize;
  
  const ratio = (usageCount - minUsage) / (maxUsage - minUsage);
  return minSize + (maxSize - minSize) * ratio;
};

/**
 * Генерирует цвет для тега на основе его популярности
 * @param usageCount - количество использований тега
 * @param maxUsage - максимальное количество использований
 * @returns объект со стилями цвета
 */
const getTagColor = (usageCount: number, maxUsage: number) => {
  const intensity = Math.max(0.3, usageCount / maxUsage);
  const baseHue = 210; // синий цвет
  
  return {
    color: `hsl(${baseHue}, ${50 + intensity * 20}%, ${40 + intensity * 20}%)`,
    backgroundColor: `hsl(${baseHue}, ${50 + intensity * 20}%, ${95 - intensity * 10}%)`
  };
};

/**
 * Компонент облака тегов с адаптивными размерами
 * Размер тега зависит от его популярности (usage count)
 * @param tags - массив тегов для отображения
 * @param maxTags - максимальное количество тегов
 * @param minSize - минимальный размер шрифта в rem
 * @param maxSize - максимальный размер шрифта в rem
 * @param showUsageCount - показывать ли количество использований
 * @param variant - вариант отображения
 * @returns JSX элемент облака тегов
 */
export const TagCloud = ({
  tags,
  maxTags = 20,
  minSize = 0.75,
  maxSize = 1.5,
  showUsageCount = false,
  variant = 'cloud'
}: TagCloudProps) => {
  // Сортируем теги по популярности и берем нужное количество
  const sortedTags = [...tags]
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, maxTags);

  if (sortedTags.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Теги не найдены</p>
      </div>
    );
  }

  const usageCounts = sortedTags.map(tag => tag.usageCount || 0);
  const minUsage = Math.min(...usageCounts);
  const maxUsage = Math.max(...usageCounts);

  // List variant - простой список
  if (variant === 'list') {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярные теги</h3>
        <ul className="space-y-1">
          {sortedTags.map((tag) => (
            <li key={tag.id}>
              <Link
                href={`/tag/${tag.slug}`}
                className="flex items-center justify-between py-1 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span>#{tag.name}</span>
                {showUsageCount && tag.usageCount && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {tag.usageCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Pills variant - таблетки одинакового размера
  if (variant === 'pills') {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Теги</h3>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              style={tag.color ? { 
                backgroundColor: `${tag.color}20`,
                color: tag.color 
              } : undefined}
            >
              <span>#{tag.name}</span>
              {showUsageCount && tag.usageCount && (
                <span className="text-xs opacity-75">
                  {tag.usageCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Cloud variant - облако с разными размерами
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Облако тегов</h3>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {sortedTags.map((tag) => {
          const fontSize = calculateFontSize(
            tag.usageCount || 0,
            minUsage,
            maxUsage,
            minSize,
            maxSize
          );
          
          const colorStyles = tag.color 
            ? { color: tag.color }
            : getTagColor(tag.usageCount || 0, maxUsage);

          return (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="inline-block font-medium hover:underline transition-all duration-200 hover:scale-110"
              style={{
                fontSize: `${fontSize}rem`,
                ...colorStyles
              }}
              title={showUsageCount && tag.usageCount ? `${tag.usageCount} статей` : undefined}
            >
              #{tag.name}
              {showUsageCount && tag.usageCount && (
                <span className="text-xs opacity-60 ml-1">
                  ({tag.usageCount})
                </span>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Легенда размеров */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-4 text-xs text-gray-500">
          <span style={{ fontSize: `${minSize}rem` }}>Менее популярные</span>
          <div className="flex-1 h-px bg-gray-300" />
          <span style={{ fontSize: `${maxSize}rem` }}>Более популярные</span>
        </div>
      </div>
    </div>
  );
}; 