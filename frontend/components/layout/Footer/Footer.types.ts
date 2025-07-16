/**
 * Типы для Footer компонента блоговой платформы
 */

/**
 * Ссылка в Footer
 */
export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly isExternal?: boolean;
}

/**
 * Группа ссылок в Footer
 */
export interface FooterSection {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

/**
 * Социальная сеть
 */
export interface SocialLink {
  readonly platform: 'telegram' | 'twitter' | 'youtube' | 'github' | 'discord';
  readonly url: string;
  readonly label: string;
  readonly icon: string;
}

/**
 * Пропсы компонента Footer
 */
export interface FooterProps {
  readonly className?: string;
  readonly variant?: 'default' | 'minimal';
  readonly hideNewsletter?: boolean;
}

/**
 * Разделы навигации в Footer
 */
export const FOOTER_SECTIONS: readonly FooterSection[] = [
  {
    title: 'Блог',
    links: [
      { label: 'Статьи', href: '/articles' },
      { label: 'Авторы', href: '/authors' },
      { label: 'Категории', href: '/categories' },
      { label: 'Популярные', href: '/trending' },
    ]
  },
  {
    title: 'Сообщество',
    links: [
      { label: 'Написать статью', href: '/write' },
      { label: 'Стать автором', href: '/become-author' },
      { label: 'Правила', href: '/rules' },
      { label: 'FAQ', href: '/faq' },
    ]
  },
  {
    title: 'Поддержка',
    links: [
      { label: 'Помощь', href: '/help' },
      { label: 'Обратная связь', href: '/contact' },
      { label: 'Баг-репорты', href: '/bugs' },
      { label: 'API', href: '/api-docs' },
    ]
  }
] as const;

/**
 * Социальные сети блога
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    platform: 'telegram',
    url: 'https://t.me/novoe_pokolenie',
    label: 'Telegram канал',
    icon: '📱'
  },
  {
    platform: 'twitter',
    url: 'https://twitter.com/novoe_pokolenie',
    label: 'Twitter',
    icon: '🐦'
  },
  {
    platform: 'github',
    url: 'https://github.com/baconio/blogika',
    label: 'GitHub',
    icon: '��'
  }
] as const; 