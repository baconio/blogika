/**
 * Страница "Стать автором"
 * Server Component с информацией о возможностях авторства
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Badge } from '@/components/ui/Badge';

/**
 * Метаданные страницы
 */
export const metadata: Metadata = {
  title: 'Стать автором - Новое поколение',
  description: 'Присоединяйтесь к сообществу авторов платформы "Новое поколение". Создавайте контент, монетизируйте знания и находите аудиторию.',
  keywords: 'стать автором, создание контента, монетизация, блоггинг, заработок',
  openGraph: {
    title: 'Стать автором - Новое поколение',
    description: 'Присоединяйтесь к сообществу авторов и начните монетизировать свои знания',
    type: 'website',
  },
};

/**
 * Компонент с преимуществами авторства
 */
const AuthorBenefits = () => {
  const benefits = [
    {
      icon: '💰',
      title: 'Монетизация контента',
      description: 'Зарабатывайте на подписках, платных статьях и донатах от читателей'
    },
    {
      icon: '📈',
      title: 'Аналитика и метрики',
      description: 'Отслеживайте просмотры, лайки, доходы и рост аудитории'
    },
    {
      icon: '🎯',
      title: 'Целевая аудитория',
      description: 'Находите читателей, которые интересуются вашей тематикой'
    },
    {
      icon: '🛠️',
      title: 'Удобный редактор',
      description: 'Создавайте красивые статьи с изображениями, кодом и таблицами'
    },
    {
      icon: '📱',
      title: 'Мобильная оптимизация',
      description: 'Ваш контент отлично выглядит на всех устройствах'
    },
    {
      icon: '🌟',
      title: 'Верификация авторов',
      description: 'Получите статус верифицированного автора и повысьте доверие'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {benefits.map((benefit, index) => (
        <div key={index} className="bg-base-200 rounded-lg p-6 text-center hover:bg-base-300 transition-colors">
          <div className="text-4xl mb-4">{benefit.icon}</div>
          <h3 className="text-lg font-semibold text-base-content mb-2">
            {benefit.title}
          </h3>
          <p className="text-base-content/70 text-sm">
            {benefit.description}
          </p>
        </div>
      ))}
    </div>
  );
};

/**
 * Компонент с планами монетизации
 */
const MonetizationPlans = () => {
  const plans = [
    {
      name: 'Бесплатный',
      price: '0₽',
      description: 'Для начинающих авторов',
      features: [
        'Публикация статей',
        'Базовая аналитика',
        'Комментарии читателей',
        'Социальные функции'
      ],
      highlight: false
    },
    {
      name: 'Премиум',
      price: 'от 10%',
      description: 'Комиссия с доходов',
      features: [
        'Платные статьи',
        'Подписки читателей',
        'Расширенная аналитика',
        'Приоритетная поддержка',
        'Верификация автора'
      ],
      highlight: true
    },
    {
      name: 'Про',
      price: 'от 5%',
      description: 'Для опытных авторов',
      features: [
        'Минимальная комиссия',
        'Персональный менеджер',
        'Промо в рекомендациях',
        'Эксклюзивные функции',
        'API доступ'
      ],
      highlight: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, index) => (
        <div 
          key={index} 
          className={`bg-base-200 rounded-lg p-6 ${plan.highlight ? 'ring-2 ring-primary scale-105' : ''}`}
        >
          {plan.highlight && (
            <Badge variant="default" className="mb-4">
              Популярный
            </Badge>
          )}
          <h3 className="text-xl font-bold text-base-content mb-2">
            {plan.name}
          </h3>
          <div className="text-2xl font-bold text-primary mb-2">
            {plan.price}
          </div>
          <p className="text-base-content/70 text-sm mb-4">
            {plan.description}
          </p>
          <ul className="space-y-2 mb-6">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center gap-2 text-sm">
                <span className="text-success">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

/**
 * Компонент с шагами становления автором
 */
const BecomeAuthorSteps = () => {
  const steps = [
    {
      step: '1',
      title: 'Регистрация',
      description: 'Создайте аккаунт и выберите роль "Автор"'
    },
    {
      step: '2',
      title: 'Заполните профиль',
      description: 'Добавьте фото, биографию и ссылки на соцсети'
    },
    {
      step: '3',
      title: 'Первая статья',
      description: 'Напишите и опубликуйте свой первый материал'
    },
    {
      step: '4',
      title: 'Развивайте аудиторию',
      description: 'Привлекайте читателей и монетизируйте контент'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((stepItem, index) => (
        <div key={index} className="text-center">
          <div className="w-12 h-12 bg-primary text-primary-content rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
            {stepItem.step}
          </div>
          <h3 className="text-lg font-semibold text-base-content mb-2">
            {stepItem.title}
          </h3>
          <p className="text-base-content/70 text-sm">
            {stepItem.description}
          </p>
        </div>
      ))}
    </div>
  );
};

/**
 * Основной компонент страницы "Стать автором"
 */
export default function BecomeAuthorPage() {
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Стать автором', isActive: true }
  ];

  return (
    <PageLayout 
      showBreadcrumbs={true}
      breadcrumbs={breadcrumbs}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Hero секция */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-base-content mb-6">
            Станьте автором 
            <span className="text-primary block">Нового поколения</span>
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-8">
            Присоединяйтесь к сообществу талантливых авторов. Создавайте качественный контент, 
            монетизируйте свои знания и находите единомышленников.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Начать сейчас
            </Link>
            <Link href="/authors" className="btn btn-outline btn-lg">
              Посмотреть авторов
            </Link>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-base-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-base-content/70">Активных авторов</div>
          </div>
          <div className="bg-base-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-success">₽2.5M</div>
            <div className="text-sm text-base-content/70">Выплачено авторам</div>
          </div>
          <div className="bg-base-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-info">10K+</div>
            <div className="text-sm text-base-content/70">Статей опубликовано</div>
          </div>
          <div className="bg-base-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-warning">95%</div>
            <div className="text-sm text-base-content/70">Довольных авторов</div>
          </div>
        </div>

        {/* Преимущества */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-base-content text-center mb-8">
            Почему выбирают нас?
          </h2>
          <AuthorBenefits />
        </div>

        {/* Планы монетизации */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-base-content text-center mb-8">
            Планы монетизации
          </h2>
          <MonetizationPlans />
        </div>

        {/* Шаги */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-base-content text-center mb-8">
            Как стать автором?
          </h2>
          <BecomeAuthorSteps />
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-base-content text-center mb-8">
            Частые вопросы
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Сколько я могу заработать?
              </div>
              <div className="collapse-content">
                <p>Доходы зависят от качества контента и размера аудитории. Наши топ-авторы зарабатывают от 50,000₽ до 500,000₽ в месяц.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Какая комиссия платформы?
              </div>
              <div className="collapse-content">
                <p>Комиссия варьируется от 5% до 15% в зависимости от тарифного плана и объемов продаж.</p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Нужен ли опыт создания контента?
              </div>
              <div className="collapse-content">
                <p>Нет, мы принимаем авторов любого уровня. У нас есть обучающие материалы и поддержка для новичков.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы начать свой путь автора?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Присоединяйтесь к тысячам авторов, которые уже зарабатывают на своих знаниях
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn btn-secondary btn-lg">
              Стать автором
            </Link>
            <Link href="/contact" className="btn btn-outline btn-lg text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
              Связаться с нами
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 