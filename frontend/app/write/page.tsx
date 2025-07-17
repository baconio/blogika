import { Metadata } from 'next';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Написать статью | Новое поколение',
  description: 'Создайте новую статью в блоге Новое поколение',
  robots: 'noindex' // Закрыть от индексации
};

/**
 * Компонент настроек публикации статьи
 */
function PublishSettings() {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Настройки публикации
      </h3>
      
      {/* Статус публикации */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Статус
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="draft">Черновик</option>
          <option value="published">Опубликовано</option>
          <option value="scheduled">Запланировано</option>
        </select>
      </div>
      
      {/* Уровень доступа */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Доступ
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="free">Бесплатно</option>
          <option value="premium">Премиум</option>
          <option value="subscription_only">Только подписчики</option>
        </select>
      </div>
      
      {/* Рекомендуемая статья */}
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="featured"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="featured" className="text-sm text-gray-700">
          Рекомендуемая статья
        </label>
      </div>
      
      {/* Кнопки действий */}
      <div className="space-y-2 pt-4 border-t">
        <Button variant="default" size="sm" className="w-full">
          Сохранить черновик
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          Предварительный просмотр
        </Button>
        <Button variant="primary" size="sm" className="w-full">
          Опубликовать
        </Button>
      </div>
    </div>
  );
}

/**
 * Компонент селектора категории
 */
function CategorySelector() {
  const categories = [
    { id: '1', name: 'Технологии', color: '#3B82F6' },
    { id: '2', name: 'Дизайн', color: '#8B5CF6' },
    { id: '3', name: 'Бизнес', color: '#10B981' }
  ];
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Категория *
      </label>
      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="">Выберите категорию</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Компонент селектора тегов
 */
function TagsSelector() {
  const popularTags = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS', 'UI/UX'];
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Теги
      </label>
      
      <Input
        type="text"
        placeholder="Добавить тег..."
        className="w-full"
      />
      
      {/* Популярные теги */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">Популярные теги:</p>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer hover:bg-gray-100 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Выбранные теги */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">Выбранные теги:</p>
        <div className="flex flex-wrap gap-2">
          {/* Placeholder для выбранных тегов */}
          <Badge variant="default" className="text-xs">
            React ×
          </Badge>
        </div>
      </div>
    </div>
  );
}

/**
 * Компонент загрузки обложки
 */
function CoverImageUpload() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Обложка статьи
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <div className="space-y-2">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Загрузить изображение
            </span>
            {' '}или перетащите файл сюда
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF до 10MB
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Страница создания/редактирования статьи
 * @returns JSX элемент страницы написания статьи
 */
export default function WritePage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Панель автора', href: '/dashboard' },
    { label: 'Написать статью', href: '/write' }
  ];
  
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-3 space-y-6">
            {/* Заголовок */}
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Заголовок статьи..."
                className="text-2xl font-bold border-0 px-0 focus:ring-0 placeholder:text-gray-400"
                style={{ fontSize: '2rem', lineHeight: '2.5rem' }}
              />
              
              <Input
                type="text"
                placeholder="Краткое описание статьи..."
                className="text-lg text-gray-600 border-0 px-0 focus:ring-0 placeholder:text-gray-400"
              />
            </div>
            
            {/* Обложка */}
            <CoverImageUpload />
            
            {/* Редактор контента */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Содержание статьи *
              </label>
              
              {/* Временный текстовый редактор (будет заменен на Rich Text Editor в этапе 4) */}
              <div className="min-h-96 border border-gray-300 rounded-md p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                <textarea
                  placeholder="Начните писать вашу статью..."
                  className="w-full h-96 resize-none border-0 outline-none placeholder:text-gray-400"
                />
              </div>
              
              <p className="text-xs text-gray-500">
                💡 В следующем обновлении здесь будет Rich Text Editor с форматированием
              </p>
            </div>
          </div>
          
          {/* Боковая панель */}
          <div className="lg:col-span-1 space-y-6">
            {/* Настройки публикации */}
            <PublishSettings />
            
            {/* Выбор категории */}
            <div className="bg-white rounded-lg border p-6">
              <CategorySelector />
            </div>
            
            {/* Теги */}
            <div className="bg-white rounded-lg border p-6">
              <TagsSelector />
            </div>
            
            {/* SEO настройки */}
            <div className="bg-white rounded-lg border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                SEO настройки
              </h3>
              
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="SEO заголовок"
                  className="text-sm"
                />
                
                <textarea
                  placeholder="SEO описание"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                
                <Input
                  type="text"
                  placeholder="Ключевые слова через запятую"
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 