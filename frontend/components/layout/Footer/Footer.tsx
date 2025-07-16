/**
 * Footer компонент для блоговой платформы "Новое поколение"
 * Server Component с полной навигацией и информацией о проекте
 */

import Link from 'next/link';
import { cn } from '@/components/ui';
import type { FooterProps, FooterSection, SocialLink } from './Footer.types';
import { FOOTER_SECTIONS, SOCIAL_LINKS } from './Footer.types';

/**
 * Секция навигационных ссылок
 */
const FooterNavigationSection = ({ section }: { readonly section: FooterSection }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider">
      {section.title}
    </h3>
    <ul className="space-y-2">
      {section.links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-sm text-base-content/70 hover:text-base-content transition-colors duration-200"
            {...(link.isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/**
 * Социальные сети
 */
const SocialLinks = ({ links }: { readonly links: readonly SocialLink[] }) => (
  <div className="flex space-x-4">
    {links.map((social) => (
      <Link
        key={social.platform}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-base-200 rounded-full flex items-center justify-center hover:bg-base-300 transition-colors duration-200"
        title={social.label}
      >
        <span className="text-lg">{social.icon}</span>
      </Link>
    ))}
  </div>
);

/**
 * Подписка на новости (заглушка для будущего функционала)
 */
const NewsletterSection = () => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider">
      Подписка
    </h3>
    <p className="text-sm text-base-content/70">
      Получайте уведомления о новых статьях от лучших авторов
    </p>
    <div className="flex space-x-2">
      <input
        type="email"
        placeholder="Ваш email"
        className="flex-1 input input-sm input-bordered"
        disabled
      />
      <button className="btn btn-primary btn-sm" disabled>
        Подписаться
      </button>
    </div>
    <p className="text-xs text-base-content/50">
      Функция будет доступна в следующих версиях
    </p>
  </div>
);

/**
 * Footer компонент с адаптивной навигацией и информацией
 * @param className - дополнительные CSS классы
 * @param variant - вариант отображения Footer
 * @param hideNewsletter - скрыть секцию подписки
 */
export const Footer = ({
  className,
  variant = 'default',
  hideNewsletter = false
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  const footerStyles = cn(
    'bg-base-200 border-t border-base-300',
    {
      'py-6': variant === 'minimal',
      'py-12': variant === 'default',
    },
    className
  );

  if (variant === 'minimal') {
    return (
      <footer className={footerStyles}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-base-content/70">
              © {currentYear} Новое поколение. Все права защищены.
            </p>
            <SocialLinks links={SOCIAL_LINKS} />
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={footerStyles}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Логотип и описание */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-content font-bold text-sm">НП</span>
              </div>
              <span className="text-xl font-bold text-base-content">
                Новое поколение
              </span>
            </div>
            <p className="text-sm text-base-content/70 max-w-md">
              Платформа для авторов и читателей. Создавайте качественный контент, 
              монетизируйте знания и находите единомышленников.
            </p>
            <SocialLinks links={SOCIAL_LINKS} />
          </div>

          {/* Навигационные секции */}
          {FOOTER_SECTIONS.map((section) => (
            <FooterNavigationSection key={section.title} section={section} />
          ))}
        </div>

        {/* Подписка на новости */}
        {!hideNewsletter && (
          <div className="mt-8 pt-8 border-t border-base-300">
            <div className="max-w-md">
              <NewsletterSection />
            </div>
          </div>
        )}

        {/* Копирайт */}
        <div className="mt-8 pt-8 border-t border-base-300">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-base-content/70">
              © {currentYear} Новое поколение. Все права защищены.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-base-content/70 hover:text-base-content">
                Конфиденциальность
              </Link>
              <Link href="/terms" className="text-base-content/70 hover:text-base-content">
                Условия использования
              </Link>
              <Link href="/cookie" className="text-base-content/70 hover:text-base-content">
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}; 