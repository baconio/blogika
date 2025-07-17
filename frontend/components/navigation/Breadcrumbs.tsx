import Link from 'next/link';

/**
 * Элемент хлебных крошек
 */
interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
  readonly isActive?: boolean;
}

/**
 * Пропсы компонента хлебных крошек
 */
interface BreadcrumbsProps {
  readonly items: BreadcrumbItem[];
  readonly separator?: React.ReactNode;
  readonly showHome?: boolean;
  readonly maxItems?: number;
  readonly className?: string;
}

/**
 * Компонент хлебных крошек для навигации
 * Показывает путь пользователя по сайту
 * @param items - массив элементов хлебных крошек
 * @param separator - разделитель между элементами
 * @param showHome - показывать ли ссылку на главную
 * @param maxItems - максимальное количество видимых элементов
 * @param className - дополнительные CSS классы
 * @returns JSX элемент хлебных крошек
 */
export const Breadcrumbs = ({
  items,
  separator = (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  showHome = true,
  maxItems = 5,
  className = ''
}: BreadcrumbsProps) => {
  // Добавляем главную страницу если нужно
  const allItems = showHome
    ? [{ label: 'Главная', href: '/' }, ...items]
    : items;

  // Обрезаем список если слишком много элементов
  const displayItems = allItems.length > maxItems
    ? [
        allItems[0], // Первый элемент
        { label: '...', href: undefined }, // Многоточие
        ...allItems.slice(-maxItems + 2) // Последние элементы
      ]
    : allItems;

  return (
    <nav aria-label="Хлебные крошки" className={className}>
      <ol className="flex items-center space-x-2 text-sm">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';

          return (
            <li key={`${item.href}-${index}`} className="flex items-center">
              {/* Разделитель */}
              {index > 0 && (
                <span className="mx-2" aria-hidden="true">
                  {separator}
                </span>
              )}

              {/* Элемент крошки */}
              {isEllipsis ? (
                <span className="text-gray-500 px-2">...</span>
              ) : isLast || !item.href || item.isActive ? (
                <span
                  className="text-gray-900 font-medium"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}; 