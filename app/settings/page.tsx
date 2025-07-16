import { Metadata } from 'next';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';

export const metadata: Metadata = {
  title: 'Настройки профиля | Новое поколение',
  description: 'Настройки вашего профиля в блоге',
  robots: 'noindex'
};

/**
 * Компонент настроек профиля
 */
function ProfileSettings() {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Настройки профиля
      </h2>
      
      {/* Аватар */}
      <div className="flex items-center gap-4">
        <Avatar
          src="/api/placeholder/80/80"
          alt="Ваш аватар"
          size="xl"
          fallback="А"
        />
        <div className="space-y-2">
          <Button variant="outline" size="sm">
            Изменить фото
          </Button>
          <p className="text-xs text-gray-500">
            JPG, GIF или PNG. Максимум 1MB.
          </p>
        </div>
      </div>
      
      {/* Основная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Отображаемое имя *
          </label>
          <Input
            type="text"
            placeholder="Ваше имя"
            defaultValue="Автор"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            type="email"
            placeholder="author@example.com"
            defaultValue="author@example.com"
          />
        </div>
      </div>
      
      {/* Биография */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Биография
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={4}
          placeholder="Расскажите о себе..."
        />
      </div>
      
      {/* Социальные сети */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Социальные сети
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram
            </label>
            <Input
              type="text"
              placeholder="@username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter/X
            </label>
            <Input
              type="text"
              placeholder="@username"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Компонент настроек уведомлений
 */
function NotificationSettings() {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Уведомления
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">
              Новые комментарии
            </h4>
            <p className="text-sm text-gray-600">
              Получать уведомления о новых комментариях к вашим статьям
            </p>
          </div>
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            defaultChecked
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">
              Новые подписчики
            </h4>
            <p className="text-sm text-gray-600">
              Уведомления о новых подписчиках
            </p>
          </div>
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            defaultChecked
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">
              Email рассылка
            </h4>
            <p className="text-sm text-gray-600">
              Еженедельная сводка и новости платформы
            </p>
          </div>
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Компонент настроек приватности
 */
function PrivacySettings() {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Приватность
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Видимость профиля
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="public">Публичный</option>
            <option value="private">Приватный</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">
              Показывать в поиске
            </h4>
            <p className="text-sm text-gray-600">
              Разрешить другим пользователям находить ваш профиль через поиск
            </p>
          </div>
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            defaultChecked
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Страница настроек профиля пользователя
 * @returns JSX элемент страницы настроек
 */
export default function SettingsPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Панель автора', href: '/dashboard' },
    { label: 'Настройки', href: '/settings' }
  ];
  
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Заголовок */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Настройки профиля
            </h1>
            <Button variant="primary">
              Сохранить изменения
            </Button>
          </div>
          
          {/* Настройки */}
          <div className="space-y-8">
            <ProfileSettings />
            <NotificationSettings />
            <PrivacySettings />
          </div>
          
          {/* Действия */}
          <div className="flex justify-between items-center pt-8 border-t">
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              Удалить аккаунт
            </Button>
            <div className="space-x-3">
              <Button variant="outline">
                Отменить
              </Button>
              <Button variant="primary">
                Сохранить изменения
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 