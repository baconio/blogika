/**
 * PageLayout компонент - базовый layout для всех страниц блога
 * Server Component с композицией Header и Footer
 */

import Link from 'next/link';
import { cn } from '@/components/ui';
import { Header } from '../Header';
import { Footer } from '../Footer';
import type { PageLayoutProps, BreadcrumbsProps } from './PageLayout.types';

/**
 * Компонент хлебных крошек для навигации
 */
const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Хлебные крошки" className={cn('py-4', className)}>
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={item.href || item.label} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-base-content/40">/</span>
              )}
              {item.href && !item.isActive ? (
                <Link
                  href={item.href}
                  className="text-base-content/70 hover:text-base-content transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={cn(
                    'text-base-content',
                    { 'font-medium': item.isActive }
                  )}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

/**
 * Базовый layout для всех страниц блога
 * @param children - содержимое страницы
 * @param currentUser - текущий пользователь
 * @param className - дополнительные CSS классы для main
 * @param headerProps - пропсы для Header компонента
 * @param footerProps - пропсы для Footer компонента
 * @param showBreadcrumbs - показать хлебные крошки
 * @param breadcrumbs - данные для хлебных крошек
 */
export const PageLayout = ({
  children,
  currentUser,
  className,
  headerProps = {},
  footerProps = {},
  showBreadcrumbs = false,
  breadcrumbs = []
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <Header 
        currentUser={currentUser}
        {...headerProps}
      />

      {/* Хлебные крошки */}
      {showBreadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs 
          items={breadcrumbs}
          className="border-b border-base-300"
        />
      )}

      {/* Основной контент */}
      <main 
        className={cn(
          'flex-1 w-full',
          className
        )}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer {...footerProps} />
    </div>
  );
}; 