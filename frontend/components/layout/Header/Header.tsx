/**
 * Header компонент для блоговой платформы "Новое поколение"
 * Server Component с композицией Client Components для интерактивности
 */

import Link from 'next/link';
import { cn } from '@/components/ui';
import { SearchBar } from '@/components/navigation/SearchBar';
import type { HeaderProps, NavItem } from './Header.types';
import { MAIN_NAV_ITEMS } from './Header.types';

/**
 * Компонент логотипа блога
 */
const BlogLogo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
      <span className="text-primary-content font-bold text-sm">НП</span>
    </div>
    <span className="text-xl font-bold text-base-content">
      Новое поколение
    </span>
  </Link>
);

/**
 * Компонент главной навигации
 */
const MainNavigation = ({ items }: { readonly items: readonly NavItem[] }) => (
  <nav className="hidden md:flex items-center space-x-6">
    {items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="text-base-content/70 hover:text-base-content transition-colors duration-200"
        {...(item.isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {item.label}
      </Link>
    ))}
  </nav>
);

/**
 * Header компонент с адаптивной навигацией
 * @param currentUser - текущий пользователь (если авторизован)
 * @param className - дополнительные CSS классы
 * @param hideSearch - скрыть поиск
 * @param variant - вариант отображения Header
 */
export const Header = ({
  currentUser,
  className,
  hideSearch = false,
  variant = 'default'
}: HeaderProps) => {
  const headerStyles = cn(
    'sticky top-0 z-50 w-full border-b border-base-300 bg-base-100/80 backdrop-blur-md',
    {
      'bg-transparent border-transparent': variant === 'transparent',
      'border-none shadow-none': variant === 'minimal',
    },
    className
  );

  return (
    <header className={headerStyles}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Логотип */}
          <BlogLogo />
          
          {/* Главная навигация */}
          <MainNavigation items={MAIN_NAV_ITEMS} />
          
          {/* Правая часть - поиск и профиль */}
          <div className="flex items-center space-x-4">
            {/* Поиск */}
            {!hideSearch && (
              <div className="hidden lg:block">
                <SearchBar
                  variant="minimal"
                  placeholder="Поиск..."
                />
              </div>
            )}
            
            {/* Меню пользователя */}
            <div>
              {/* UserMenu Client Component будет добавлен отдельно */}
              {currentUser ? (
                <div className="text-sm text-base-content">
                  {currentUser.email}
                </div>
              ) : (
                <Link 
                  href="/auth/login"
                  className="btn btn-primary btn-sm"
                >
                  Войти
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 