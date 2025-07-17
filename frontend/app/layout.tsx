/**
 * Корневой layout для блоговой платформы "Новое поколение"
 * Содержит HTML структуру, метаданные и провайдеры
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import '@/styles/globals.css';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Метаданные приложения
 */
export const metadata: Metadata = {
  title: {
    default: 'Новое поколение',
    template: '%s | Новое поколение',
  },
  description: 'Платформа для авторов и читателей. Создавайте качественный контент, монетизируйте знания и находите единомышленников.',
  keywords: [
    'блог',
    'авторы',
    'статьи',
    'контент',
    'монетизация',
    'подписки',
    'новое поколение',
  ],
  authors: [{ name: 'Команда Новое поколение' }],
  creator: 'Новое поколение',
  publisher: 'Новое поколение',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    title: 'Новое поколение',
    description: 'Платформа для авторов и читателей',
    siteName: 'Новое поколение',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Новое поколение - Платформа для авторов',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Новое поколение',
    description: 'Платформа для авторов и читателей',
    images: ['/og-image.jpg'],
    creator: '@novoe_pokolenie',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

/**
 * Корневой layout компонент
 * @param children - дочерние компоненты приложения
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <head>
        {/* Дополнительные мета-теги */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Новое поколение" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect для внешних ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-base-100 text-base-content">
        <QueryProvider>
          {children}
        </QueryProvider>
        
        {/* Скрипты аналитики */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics будет добавлен позже */}
            {/* Yandex Metrica будет добавлена позже */}
          </>
        )}
      </body>
    </html>
  );
} 