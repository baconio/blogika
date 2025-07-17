import { Metadata } from 'next';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Панель автора | Новое поколение',
  description: 'Личный кабинет автора блога',
  robots: 'noindex' // Закрыть от индексации
};

/**
 * Компонент статистических карточек
 */
function StatsCards() {
  const stats = [
    {
      title: 'Просмотры',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      description: 'За последние 30 дней'
    },
    {
      title: 'Статьи',
      value: '15',
      change: '+2',
      trend: 'up',
      description: '3 в черновиках'
    },
    {
      title: 'Подписчики',
      value: '1,245',
      change: '+5%',
      trend: 'up',
      description: '+67 за месяц'
    },
    {
      title: 'Доходы',
      value: '₽12,450',
      change: '+8%',
      trend: 'up',
      description: 'В этом месяце'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
            <div className={`px-2 py-1 text-xs font-medium rounded-full ${
              stat.trend === 'up' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {stat.change}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Компонент быстрых действий
 */
function QuickActions() {
  const actions = [
    {
      title: 'Написать статью',
      description: 'Создать новую публикацию',
      href: '/write',
      icon: '✍️',
      primary: true
    },
    {
      title: 'Настройки профиля',
      description: 'Редактировать информацию',
      href: '/settings',
      icon: '⚙️',
      primary: false
    }
  ];
  
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Быстрые действия
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`block p-4 rounded-lg border transition-colors ${
              action.primary
                ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl">{action.icon}</div>
              <h3 className="font-medium text-gray-900 text-sm">
                {action.title}
              </h3>
              <p className="text-xs text-gray-600">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Страница панели автора с аналитикой и управлением
 * @returns JSX элемент страницы панели автора
 */
export default function DashboardPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Панель автора', href: '/dashboard' }
  ];
  
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Заголовок */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                src="/api/placeholder/64/64"
                alt="Ваш профиль"
                size="lg"
                fallback="А"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Добро пожаловать, Автор!
                </h1>
                <p className="text-gray-600">
                  Управляйте своими статьями и отслеживайте статистику
                </p>
              </div>
            </div>
            
            <Link href="/write">
              <Button variant="primary">
                Написать статью
              </Button>
            </Link>
          </div>
          
          {/* Статистика */}
          <StatsCards />
          
          {/* Быстрые действия */}
          <QuickActions />
        </div>
      </div>
    </PageLayout>
  );
} 