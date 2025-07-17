import Link from 'next/link';

/**
 * Элемент навигации
 */
interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly isActive?: boolean;
  readonly badge?: string | number;
}

/**
 * Пропсы компонента главной навигации
 */
interface MainNavigationProps {
  readonly items?: NavigationItem[];
  readonly variant?: 'horizontal' | 'vertical';
  readonly className?: string;
}

/**
 * Стандартные элементы навигации для блога
 */
const defaultNavigationItems: NavigationItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Статьи', href: '/articles' },
  { label: 'Авторы', href: '/authors' },
  { label: 'Категории', href: '/categories' },
  { label: 'О нас', href: '/about' },
  { label: 'Контакты', href: '/contact' }
];

/**
 * Компонент главной навигации сайта
 * Отображает основные разделы блоговой платформы
 * @param items - массив элементов навигации
 * @param variant - вариант отображения (горизонтальный/вертикальный)
 * @param className - дополнительные CSS классы
 * @returns JSX элемент главной навигации
 */
export const MainNavigation = ({
  items = defaultNavigationItems,
  variant = 'horizontal',
  className = ''
}: MainNavigationProps) => {
  const containerClasses = variant === 'horizontal'
    ? 'flex space-x-8'
    : 'flex flex-col space-y-2';

  const linkClasses = variant === 'horizontal'
    ? 'text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative'
    : 'block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200';

  return (
    <nav className={`${containerClasses} ${className}`.trim()}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${linkClasses} ${
            item.isActive 
              ? variant === 'horizontal'
                ? 'text-blue-600 after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                : 'text-blue-600 bg-blue-50'
              : ''
          }`.trim()}
        >
          <span className="flex items-center gap-2">
            {item.label}
            {/* Бейдж для уведомлений */}
            {item.badge && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {item.badge}
              </span>
            )}
          </span>
        </Link>
      ))}
    </nav>
  );
}; 