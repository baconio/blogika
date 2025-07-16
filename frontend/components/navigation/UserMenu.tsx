'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

/**
 * Типы для меню пользователя
 */
interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatar?: string;
  readonly role: 'author' | 'reader' | 'admin';
  readonly isVerified?: boolean;
}

interface UserMenuProps {
  readonly user?: User;
  readonly onSignOut?: () => void;
  readonly showNotifications?: boolean;
  readonly notificationCount?: number;
}

/**
 * Компонент меню пользователя
 * @param user - данные пользователя
 * @param onSignOut - функция выхода из аккаунта
 * @param showNotifications - показывать ли уведомления
 * @param notificationCount - количество непрочитанных уведомлений
 * @returns JSX элемент меню пользователя
 */
export const UserMenu = ({
  user,
  onSignOut,
  showNotifications = true,
  notificationCount = 0
}: UserMenuProps) => {
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
  
  // Моковые данные для демонстрации
  const mockUser: User = {
    id: '1',
    name: 'Автор Блога',
    email: 'author@example.com',
    avatar: '/api/placeholder/40/40',
    role: 'author',
    isVerified: true
  };
  
  const currentUser = user || mockUser;
  
  const handleSignOut = () => {
    setIsOpen(false);
    onSignOut?.();
  };
  
  const menuItems = [
    {
      label: 'Мой профиль',
      href: `/author/${currentUser.name.toLowerCase().replace(/\s+/g, '-')}`,
      icon: '👤'
    },
    {
      label: 'Панель автора',
      href: '/dashboard',
      icon: '📊',
      show: currentUser.role === 'author' || currentUser.role === 'admin'
    },
    {
      label: 'Написать статью',
      href: '/write',
      icon: '✍️',
      show: currentUser.role === 'author' || currentUser.role === 'admin'
    },
    {
      label: 'Мои закладки',
      href: '/bookmarks',
      icon: '🔖'
    },
    {
      label: 'Настройки',
      href: '/settings',
      icon: '⚙️'
    }
  ];
  
  const visibleMenuItems = menuItems.filter(item => item.show !== false);
  
  // Если пользователь не авторизован
  if (!user && !mockUser) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          Войти
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Регистрация
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      {/* Уведомления */}
      {showNotifications && (
        <div className="relative">
          <button
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Уведомления"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
              />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>
      )}
      
      {/* Меню пользователя */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.name}
            size="sm"
            fallback={currentUser.name.charAt(0)}
          />
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
            {/* Информация о пользователе */}
            <div className="px-4 py-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  size="md"
                  fallback={currentUser.name.charAt(0)}
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 truncate">
                      {currentUser.name}
                    </p>
                    {currentUser.isVerified && (
                      <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs">
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role === 'author' ? 'Автор' : 'Читатель'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Пункты меню */}
            <div className="py-2">
              {visibleMenuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Выход */}
            <div className="border-t py-2">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="text-lg">🚪</span>
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 