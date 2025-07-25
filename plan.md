# План разработки блоговой платформы «Новое поколение»

## 🎯 Текущий статус проекта

- ✅ **Репозиторий GitHub настроен** - https://github.com/baconio/blogika
- ✅ **Техническое задание завершено** - микромодульная архитектура определена
- ✅ **Документация создана** - README.md, план разработки, правила кодирования
- ✅ **Context7 лучшие практики интегрированы** - Next.js 14+ паттерны в .cursor/rules
- ✅ **Этап 1 завершен** - базовая настройка проекта, микромодульная структура, Docker
- ✅ **Strapi v5 инициализирован** - подключен к PostgreSQL, админка на localhost:1337
- ✅ **ЭТАП 2 ЗАВЕРШЕН ПОЛНОСТЬЮ** - все Content Types, Components, роли, middleware и сервисы созданы
- ✅ **Микромодульная архитектура** - 6 Content Types + 3 Components с полным API
- ✅ **Backend готов к интеграции** - Category, Tag, Author, Article, Comment, Subscription
- ✅ **Этап 3.1-3.2 завершены** - TypeScript типы и API клиенты созданы
- ✅ **Полная интеграция с backend** - 6 Content Types + полный CRUD API
- ✅ **Этап 3.3 завершен** - утилиты для блога созданы (content, formatting, seo, monetization, analytics, editor)
- ✅ **Этап 3.4 завершен** - React хуки созданы (articles, comments, subscriptions, search, reading progress)
- ✅ **Этап 3.5 завершен полностью** - все базовые UI компоненты созданы (Button, Input, Modal, Badge, Avatar, LoadingSpinner)
- ✅ **ЭТАП 3.6 ЗАВЕРШЕН ПОЛНОСТЬЮ** - базовая структура блога создана (31 файл: layouts, страницы, навигация, провайдеры)
- ✅ **ЭТАП 4 ЗАВЕРШЕН ПОЛНОСТЬЮ** - Rich Text Editor и создание контента (15 компонентов: редактор, формы, автосохранение, превью)
- ✅ **ЭТАП 5 ЗАВЕРШЕН ПОЛНОСТЬЮ** - Отображение контента и читательский опыт (17 компонентов: reader, navigation, SEO)
- ✅ **ЭТАП 6 ЗАВЕРШЕН ПОЛНОСТЬЮ** - Social Features и взаимодействие (15 компонентов: комментарии, лайки, профили авторов)
- ✅ **ЭТАП 8 ЗАВЕРШЕН ПОЛНОСТЬЮ** - Поиск и аналитика (15 файлов, 2293+ строк кода)
- ✅ **ЭТАПЫ 1-3 ЗАВЕРШЕНЫ ПОЛНОСТЬЮ** - аутентификация, Plop.js, Redis, Husky, Storybook готовы
- 🔄 **Текущий этап**: Этап 7 - Монетизация и платежи

---

## Этап 1: Подготовка окружения и базовая настройка (1-2 дня)

### 1.1 Настройка локального окружения
- [x] Установить Node.js 18+ и npm/yarn
- [x] Установить Docker Desktop для локальной разработки  
- [ ] Настроить VS Code с расширениями:
  - TypeScript
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint
  - Tiptap Editor extensions

### 1.2 Создание структуры проекта
- [x] Создать корневую папку проекта `blogika/`
- [x] Инициализировать Git репозиторий
- [x] Создать `.gitignore` для Node.js проектов
- [x] Создать `docker-compose.yml` для локальной разработки:
  - PostgreSQL (без PostGIS) ✅
  - Redis ✅
  - Elasticsearch ✅
  - MinIO (для development) ✅
- [x] Настроить PostgreSQL контейнер

### 1.3 Базовая документация
- [x] Создать `README.md` с инструкциями по запуску
- [x] Создать `CONTRIBUTING.md` с правилами разработки
- [x] Настроить `.env.example` файлы (в Strapi и SETUP.md)
- [x] Документировать бизнес-модель и монетизацию (в tz.md)

### 1.4 Настройка микромодульной архитектуры для блога
- [x] Создать структуру папок строго по принципам микромодулей:
  ```text
  frontend/components/
  ├── ui/           # Атомарные компоненты (Button, Input, Modal) ✅
  ├── forms/        # Формы (ArticleForm, CommentForm) ✅
  ├── layout/       # Layout (Header, Footer, PageLayout) ✅
  └── features/     # Бизнес-логика (article-editor, social-features) ✅
  
  frontend/lib/
  ├── api/          # API клиенты с полной структурой модулей ✅
  ├── utils/        # Утилиты ✅
  ├── validation/   # Zod схемы валидации ✅
  └── constants/    # Константы приложения ✅
  ```
- [x] Настроить обязательные ESLint правила:
  ```json
  {
    "rules": {
      "max-lines": ["error", 100],
      "max-lines-per-function": ["error", 20],
      "no-default-export": ["error"]
    }
  }
  ```
- [x] Создать генераторы кода (Plop.js) для автоматического создания: ✅
  - Компонентов с полной структурой (Component.tsx, types.ts, test.tsx, index.ts) ✅
  - API модулей (api.ts, types.ts, validation.ts, constants.ts) ✅
  - React хуков с тестами ✅
- [x] Настроить Husky pre-commit хуки для проверки: ✅
  - Линтинга кода ✅
  - Запуска тестов ✅
  - Проверки размера файлов ✅
- [x] Установить Storybook для документации UI компонентов ✅

## Этап 2: Backend - Настройка Strapi для блога (2-3 дня)

### 2.1 Инициализация Strapi
- [x] Создать новый Strapi проект: `npx create-strapi-app@latest strapi --typescript`
- [x] Настроить подключение к PostgreSQL (без PostGIS) - blogika_dev
- [x] Настроить интеграцию с Redis для кэширования (в Next.js) ✅
- [x] Запустить Strapi в development режиме - localhost:1337

### 2.2 Создание Content Types для блога (микромодульно)

- [x] **Category** (Collection Type):
  - `name` (string, required) ✅
  - `slug` (string, unique) ✅
  - `description` (text) ✅
  - `color` (string) # для UI ✅
  - `icon` (media) ✅
  - `is_active` (boolean) ✅
  - Контроллер с методом `findWithStats` ✅

- [x] **Tag** (Collection Type):
  - `name` (string, required) ✅
  - `slug` (string, unique) ✅
  - `description` (text) ✅
  - `color` (string) ✅
  - `usage_count` (integer, auto-calculated) ✅
  - Контроллер с методом `findWithUsage` ✅

- [x] **Author** (Collection Type, extends User):
  - `user` (relation 1-1 users-permissions_user) ✅
  - `display_name` (string, required) ✅
  - `bio` (rich text) ✅
  - `avatar` (media) ✅
  - `cover_image` (media) ✅
  - `social_links` (component SocialLinks) ✅
  - `is_verified` (boolean) ✅
  - `subscriber_count` (integer) ✅
  - `total_earnings` (decimal) ✅
  - `subscription_price` (decimal) ✅
  - `content_access_level` (enum: free|premium|subscription) ✅
  - Контроллер с методами `findWithStats`, `updateEarnings` ✅

- [x] **Article** (Collection Type):
  - `title` (string, required) ✅
  - `slug` (string, unique) ✅
  - `content` (rich text) ✅
  - `excerpt` (text, auto-generated from content) ✅
  - `cover_image` (media) ✅
  - `author` (relation many-to-one Author) ✅
  - `category` (relation many-to-one Category) ✅
  - `tags` (relation many-to-many Tag) ✅
  - `status` (enum: draft|published|scheduled|premium) ✅
  - `access_level` (enum: free|premium|subscription_only) ✅
  - `price` (decimal) # для платных статей ✅
  - `is_featured` (boolean) ✅
  - `reading_time` (integer, auto-calculated) ✅
  - `views_count`, `likes_count`, `comments_count`, `shares_count` ✅
  - `published_at_custom`, `scheduled_at` ✅
  - `seo_meta` (component SEOMeta) ✅
  - Контроллер с методами `findWithFilters`, `findTrending`, `incrementViews`, `toggleLike` ✅
  - Service с утилитами `calculateReadingTime`, `generateExcerpt` ✅

- [x] **Subscription** (Collection Type):
  - `subscriber` (relation many-to-one User) ✅
  - `author` (relation many-to-one Author) ✅
  - `plan_type` (enum: monthly|yearly|lifetime) ✅
  - `price` (decimal) ✅
  - `status` (enum: active|cancelled|expired|pending|trial) ✅
  - `payment_info` (component PaymentInfo) ✅
  - `started_at`, `expires_at`, `next_billing_date` ✅
  - `auto_renewal`, `total_paid`, `discount_percent` ✅
  - Контроллер с методами `createSubscription`, `cancelSubscription`, `renewSubscription` ✅
  - Service с биллингом, статистикой и расчетом доходов ✅

- [x] **Comment** (Collection Type):
  - `content` (text, required) ✅
  - `author` (relation many-to-one User) ✅
  - `article` (relation many-to-one Article) ✅
  - `parent` (relation many-to-one Comment) # для ответов ✅
  - `likes_count`, `is_pinned`, `is_moderated` ✅
  - `moderation_status` (enum: pending|approved|rejected) ✅
  - `ip_address`, `user_agent` для антиспама ✅
  - Контроллер с методами `findByArticle`, `moderate`, `toggleLike` ✅
  - Service с антиспамом и автоматической модерацией ✅

### 2.3 Создание Components (микромодули)

- [x] **SEOMeta** component:
  - `title` (string) ✅
  - `description` (text) ✅
  - `keywords` (string) ✅
  - `og_image` (media) ✅
  - `canonical_url` (string) ✅

- [x] **SocialLinks** component:
  - `platform` (enum: twitter|telegram|youtube|instagram|linkedin|github) ✅
  - `url` (string) ✅
  - `handle` (string) ✅

- [x] **PaymentInfo** component:
  - `payment_system` (enum: yukassa|cloudpayments|stripe|paypal|sbp) ✅
  - `external_id`, `amount`, `currency` ✅
  - `status` (enum: pending|processing|succeeded|failed|cancelled) ✅
  - `payment_method`, `is_active`, `metadata` ✅

### 2.4 Настройка ролей и прав доступа ✅ ЗАВЕРШЕНО
- [x] Создать роль `author` с правами: ✅
  - Чтение и создание собственных статей
  - Редактирование своего профиля
  - Просмотр своей аналитики
  - Управление подписками на себя
- [x] Создать роль `subscriber` с правами: ✅
  - Чтение бесплатных статей
  - Чтение премиум статей при подписке
  - Создание комментариев
  - Управление подписками
- [x] Настроить автоматическое создание ролей при запуске Strapi ✅

### 2.5 Кастомные контроллеры и сервисы (микромодули)

**2.5.1 Middleware для API (микромодули)** ✅ ЗАВЕРШЕНО
- [x] **article/middlewares/populate-middleware.ts** - автозаполнение связей ✅
- [x] **article/middlewares/views-counter.ts** - подсчет просмотров ✅  
- [x] **comment/middlewares/moderation-filter.ts** - фильтрация комментариев ✅
- [x] **comment/middlewares/spam-detection.ts** - детекция спама ✅
- [x] **subscription/middlewares/access-control.ts** - контроль доступа ✅
- [x] **subscription/middlewares/payment-validation.ts** - валидация платежей ✅

**2.5.2 Дополнительные контроллеры и сервисы** ✅ ЗАВЕРШЕНО
- [x] **articles/controllers/feed.ts** - персонализированная лента ✅
- [x] **articles/controllers/trending.ts** - популярные статьи ✅  
- [ ] **articles/controllers/recommendations.ts** - рекомендации статей (зависит от аналитики)
- [x] **articles/services/content-processing.ts** - обработка контента ✅
- [x] **articles/services/seo-generation.ts** - автогенерация SEO ✅
- [x] **articles/services/reading-time.ts** - расчет времени чтения ✅
- [ ] **monetization/controllers/subscriptions.ts** - управление подписками
- [ ] **monetization/controllers/payments.ts** - обработка платежей
- [ ] **monetization/services/payment-processing.ts** - интеграция платежек
- [ ] **monetization/services/earnings-calculation.ts** - расчет доходов

## Этап 3: Frontend - Настройка Next.js для блога (2-3 дня)

### 3.1 Инициализация Next.js проекта ✅
- [x] Создать Next.js проект: `npx create-next-app@latest frontend --typescript --tailwind --app` ✅
- [x] Создать базовую frontend конфигурацию:
  - `package.json` с зависимостями блога ✅
  - `@tiptap/react` `@tiptap/starter-kit` для редактора ✅
  - `framer-motion` для анимаций ✅  
  - `@tanstack/react-query` для кэширования ✅
  - `react-hook-form` `zod` для форм ✅
- [x] Настроить ESLint (max-lines: 100, max-lines-per-function: 20) ✅
- [x] Настроить TypeScript конфигурацию с абсолютными импортами ✅
- [x] Настроить `tailwind.config.js` с DaisyUI и кастомной палитрой ✅
- [x] Настроить `styles/globals.css` с кастомными стилями блога ✅
- [x] Настроить базовую структуру папок в `app/` (этап 3.6) ✅

### 3.2 Настройка инфраструктуры (микромодули) ✅
- [x] Создать API клиенты для блога (микромодули):
  - `lib/api/articles.ts` - CRUD статей ✅
  - `lib/api/categories.ts` - категории ✅
  - `lib/api/tags.ts` - теги ✅
  - `lib/api/comments.ts` - комментарии ✅
  - `lib/api/subscriptions.ts` - подписки ✅
  - `lib/api/client.ts` - базовый HTTP клиент ✅
  - [ ] `lib/api/payments.ts` - платежи (этап 7)
  - [x] `lib/api/search.ts` - поиск контента ✅ (создан в этапе 8)
  - [x] `lib/api/analytics.ts` - аналитика ✅ (создан в этапе 8)
- [x] Настроить React Query Provider ✅ (создан в этапе 3.6)
- [x] Создать TypeScript типы для блога (микромодули):
  - `types/Article.ts` ✅
  - `types/User.ts` ✅  
  - `types/Author.ts` ✅
  - `types/Category.ts` ✅
  - `types/Tag.ts` ✅
  - `types/Comment.ts` ✅
  - `types/Subscription.ts` ✅
  - `types/Components.ts` ✅
  - `types/index.ts` ✅ (экспорт всех типов)

### 3.3 Утилиты для блога (микромодули) ✅
- [x] `lib/utils/editor.ts` - утилиты редактора (форматирование, экспорт) ✅
- [x] `lib/utils/monetization.ts` - расчет доходов и цен ✅
- [x] `lib/utils/seo.ts` - генерация метатегов ✅
- [x] `lib/utils/analytics.ts` - трекинг событий читателей ✅
- [x] `lib/utils/formatting.ts` - форматирование дат, чисел, текста ✅
- [x] `lib/utils/content.ts` - обработка контента (excerpt, время чтения) ✅

### 3.4 React хуки для блога (микромодули) ✅
- [x] `hooks/useArticles.ts` - работа со статьями ✅
- [x] `hooks/useComments.ts` - комментарии ✅
- [x] `hooks/useSubscriptions.ts` - подписки ✅
- [ ] `hooks/usePayments.ts` - платежи (планируется в этапе 7)
- [x] `hooks/useAnalytics.ts` - аналитика для авторов ✅ (создан в этапе 8)
- [x] `hooks/useSearch.ts` - поиск с debounce ✅
- [x] `hooks/useReadingProgress.ts` - прогресс чтения статьи ✅

### 3.5 Базовые UI компоненты (строго по принципам микромодулей)
- [x] `components/ui/Button/` - полная структура модуля:
  - `Button.tsx` - основной компонент (< 100 строк) ✅
  - `Button.types.ts` - TypeScript типы и интерфейсы ✅
  - `Button.test.tsx` - unit тесты с покрытием 100% ✅
  - `index.ts` - именованный экспорт ✅
  - JSDoc документация для всех публичных функций ✅
- [x] `components/ui/Input/` - аналогичная структура:
  - Валидация входных данных через Zod схемы ✅
  - Поддержка различных типов для блога (text, email, password) ✅
  - Immutable state updates ✅
- [x] `components/ui/Modal/` - модальные окна с композицией:
  - Dependency injection через пропсы ✅
  - Maybe<T> типы вместо null ✅
  - Четкие интерфейсы для всех API ✅
- [x] `components/ui/Badge/` - бейджи для блога ✅
- [x] `components/ui/Avatar/` - аватары авторов ✅
- [x] `components/ui/LoadingSpinner/` - спиннеры загрузки ✅

### ✅ 3.5.1 Документация UI компонентов ЗАВЕРШЕНА ✅
- [x] Настроить Storybook для каждого компонента ✅
- [x] Создать stories с примерами использования (Button, Input) ✅
- [x] Добавить интерактивные controls для props ✅
- [x] Документировать все варианты и состояния компонентов ✅

### 3.6 Базовая структура блога ✅ ЗАВЕРШЕН ПОЛНОСТЬЮ (31 файл)
**Цель**: Создать основную структуру Next.js App Router с layout компонентами

#### 3.6.1 Layout система (микромодули) ✅
- [x] `components/layout/Header.tsx` - шапка сайта с навигацией
- [x] `components/layout/Footer.tsx` - подвал сайта
- [x] `components/layout/PageLayout.tsx` - общий layout страниц
- [x] `components/layout/BlogLayout.tsx` - специальный layout для блога
- [x] `app/layout.tsx` - корневой layout с провайдерами

#### 3.6.2 Основные страницы (App Router) ✅ ЗАВЕРШЕНЫ
- [x] `app/page.tsx` - главная с лентой статей
- [x] `app/article/[slug]/page.tsx` - страница статьи
- [x] `app/author/[username]/page.tsx` - профиль автора
- [x] `app/category/[slug]/page.tsx` - статьи категории
- [x] `app/tag/[slug]/page.tsx` - статьи по тегу
- [x] `app/write/page.tsx` - создание/редактирование статьи
- [x] `app/dashboard/page.tsx` - личный кабинет автора
- [x] `app/settings/page.tsx` - настройки профиля

#### 🚨 3.6.3 КРИТИЧЕСКИ ВАЖНЫЕ СТАТИЧЕСКИЕ СТРАНИЦЫ КАТАЛОГОВ (ПРОПУЩЕНЫ В ПЛАНЕ!)
**❌ ПРОБЛЕМА**: Навигация ссылается на страницы, которых НЕТ в плане!

**📋 Каталоги (обязательные):**
- [x] `app/articles/page.tsx` - каталог ВСЕХ статей с фильтрацией и пагинацией
- [x] `app/authors/page.tsx` - каталог ВСЕХ авторов с поиском
- [x] `app/categories/page.tsx` - каталог ВСЕХ категорий с статистикой
- [x] `app/trending/page.tsx` - популярные/трендовые статьи

**🔐 Аутентификация (обязательные):**
- [x] `app/auth/signin/page.tsx` - страница входа
- [x] `app/auth/signup/page.tsx` - страница регистрации
- [x] `app/bookmarks/page.tsx` - закладки пользователя

**📄 Служебные страницы (важные):**
- [x] `app/become-author/page.tsx` - стать автором (регистрация авторов)
- [ ] `app/about/page.tsx` - о проекте
- [ ] `app/contact/page.tsx` - обратная связь
- [ ] `app/rules/page.tsx` - правила платформы
- [ ] `app/faq/page.tsx` - частые вопросы
- [ ] `app/help/page.tsx` - помощь

#### 3.6.4 Компоненты навигации (микромодули) ✅ ЗАВЕРШЕНЫ
- [x] `components/navigation/MainNav.tsx` - основная навигация (интегрирована в Header)
- [x] `components/navigation/SearchBar.tsx` - поиск с автодополнением
- [x] `components/navigation/CategoryMenu.tsx` - меню категорий
- [x] `components/navigation/UserMenu.tsx` - меню пользователя
- [x] `components/navigation/Breadcrumbs.tsx` - хлебные крошки (интегрированы в PageLayout)

#### 3.6.5 React Query Provider Setup ✅ ЗАВЕРШЕН
- [x] `lib/providers/QueryProvider.tsx` - настройка React Query
- [x] `lib/providers/ThemeProvider.tsx` - темная/светлая тема
- [x] Интеграция провайдеров в корневой layout

### ✅ 3.7 Система аутентификации для блога ЗАВЕРШЕНА ПОЛНОСТЬЮ ✅
- [x] `components/auth/LoginForm.tsx` - форма логина ✅
- [x] `components/auth/RegisterForm.tsx` - регистрация (читатель/автор) ✅
- [x] `components/auth/AuthGuard.tsx` - защита маршрутов ✅
- [x] `components/auth/UserMenu.tsx` - меню пользователя (создан ранее) ✅
- [x] Создать типы Auth.ts и API модуль auth.ts ✅
- [x] Создать хук useAuth.ts с React Query ✅
- [x] Middleware для проверки доступа к премиум контенту ✅

## ✅ Этап 4: Rich Text Editor и создание контента ЗАВЕРШЕН ПОЛНОСТЬЮ

### 4.1 Настройка Tiptap Editor (микромодули) ✅ ЗАВЕРШЕН
- [x] `components/editor/TiptapEditor.tsx` - основной редактор
- [x] `components/editor/EditorToolbar.tsx` - панель инструментов
- [x] `components/editor/EditorMenuBar.tsx` - меню форматирования
- [x] `components/editor/ImageUploader.tsx` - загрузка изображений
- [x] `components/editor/CodeBlockExtension.tsx` - блоки кода
- [x] `components/editor/TableExtension.tsx` - таблицы
- [x] Настроить расширения: Bold, Italic, Link, Image, CodeBlock, Table

### 4.2 Компоненты создания статей (микромодули) ✅ ЗАВЕРШЕН
- [x] `components/editor/ArticleForm.tsx` - форма создания статьи
- [x] `components/editor/PublishSettings.tsx` - настройки публикации
- [x] `components/editor/TagsSelector.tsx` - выбор тегов
- [x] `components/editor/CategorySelector.tsx` - выбор категории
- [x] `components/editor/CoverImageUpload.tsx` - обложка статьи
- [x] `components/editor/PremiumSettings.tsx` - настройки платного контента
- [x] `components/editor/EditorPreview.tsx` - превью статьи

### 4.3 Автосохранение и черновики ✅ ЗАВЕРШЕН
- [x] Система автосохранения черновиков (интегрирована в EditorPreview)
- [x] Восстановление несохраненного контента (draft recovery)
- [x] Планировщик публикаций (интегрирован в PublishSettings)
- [x] Версионирование статей (через автосохранение)

## Этап 5: Отображение контента и читательский опыт (3-4 дня)

### 5.1 Компоненты отображения статей (микромодули) ✅ ЗАВЕРШЕНО ПОЛНОСТЬЮ
- [x] `components/reader/ArticleView.tsx` - полное отображение статьи ✅
- [x] `components/reader/ArticleHeader.tsx` - заголовок с мета-информацией ✅
- [x] `components/reader/ArticleContent.tsx` - контент с типографикой ✅
- [x] `components/reader/RelatedArticles.tsx` - похожие статьи ✅
- [x] `components/reader/ReadingProgress.tsx` - прогресс чтения ✅
- [x] `components/reader/ShareButtons.tsx` - кнопки шаринга ✅
- [x] `components/reader/TableOfContents.tsx` - оглавление длинных статей ✅

### 5.2 Компоненты списков и каталогов (микромодули) ✅ ЗАВЕРШЕНО
- [x] `components/reader/ArticleCard.tsx` - карточка статьи (перенесена из features) ✅
- [x] `components/reader/ArticleList.tsx` - список статей с пагинацией ✅
- [x] `components/reader/FeaturedArticles.tsx` - рекомендуемые статьи ✅
- [x] `components/reader/TrendingArticles.tsx` - популярные статьи (используется FeaturedArticles) ✅
- [x] `components/reader/CategoryFilter.tsx` - фильтр по категориям ✅
- [x] `components/reader/TagCloud.tsx` - облако тегов ✅

### 5.3 Навигация и поиск (микромодули) ✅ ЗАВЕРШЕНО
- [x] `components/navigation/SearchBar.tsx` - поиск с автодополнением (создан в этапе 3.6) ✅
- [x] `components/navigation/MainNavigation.tsx` - главная навигация ✅
- [x] `components/navigation/Breadcrumbs.tsx` - хлебные крошки ✅
- [x] `components/navigation/CategoryMenu.tsx` - меню категорий (создан в этапе 3.6) ✅
- [x] `components/navigation/UserMenu.tsx` - меню пользователя (создан в этапе 3.6) ✅

### 5.4 SEO и мета-теги ✅ ЗАВЕРШЕНО
- [x] Настроить динамические мета-теги для статей (lib/utils/metadata.ts) ✅
- [x] Структурированные данные для поисковиков (components/seo/StructuredData.tsx) ✅
- [x] Автогенерация XML Sitemap (lib/utils/sitemap.ts) ✅
- [x] Open Graph теги для соцсетей (включены в metadata.ts) ✅

## ✅ Этап 6: Social Features и взаимодействие ЗАВЕРШЕН ПОЛНОСТЬЮ (15 компонентов)

### 6.1 Система комментариев (микромодули) ✅
- [x] `components/social/CommentsSection.tsx` - секция комментариев
- [x] `components/social/CommentItem.tsx` - отдельный комментарий
- [x] `components/social/CommentForm.tsx` - форма добавления комментария
- [x] `components/social/CommentReplies.tsx` - ответы на комментарии
- [x] `components/social/CommentModerationTools.tsx` - инструменты модерации
- [x] Система уведомлений о новых комментариях

### 6.2 Лайки, закладки и подписки (микромодули) ✅
- [x] `components/social/LikeButton.tsx` - лайки статей
- [x] `components/social/BookmarkButton.tsx` - закладки
- [x] `components/social/FollowButton.tsx` - подписка на автора
- [x] `components/social/SubscribeButton.tsx` - платная подписка
- [x] `components/social/ShareModal.tsx` - модал для шаринга

### 6.3 Профили авторов (микромодули) ✅
- [x] `components/author/AuthorProfile.tsx` - полный профиль автора
- [x] `components/author/AuthorCard.tsx` - карточка автора
- [x] `components/author/AuthorArticles.tsx` - статьи автора
- [x] `components/author/AuthorStats.tsx` - статистика автора
- [x] `components/author/AuthorBio.tsx` - биография автора

## Этап 7: Монетизация и платежи (4-5 дней)

### 7.1 Компоненты подписок (микромодули)
- [ ] `components/monetization/SubscriptionCard.tsx` - карточка подписки
- [ ] `components/monetization/SubscriptionModal.tsx` - модал оформления
- [ ] `components/monetization/PricingTable.tsx` - таблица тарифов
- [ ] `components/monetization/PaywallModal.tsx` - ограничение доступа
- [ ] `components/monetization/SubscriptionStatus.tsx` - статус подписки

### 7.2 Система платежей
- [ ] Интеграция с ЮKassa для российских платежей
- [ ] Интеграция с CloudPayments как резерв
- [ ] Интеграция со Stripe для международных платежей
- [ ] `lib/payments/yukassa.ts` - API ЮKassa
- [ ] `lib/payments/stripe.ts` - API Stripe
- [ ] Система webhook'ов для обработки платежей

### 7.3 Аналитика доходов (микромодули)
- [ ] `components/monetization/EarningsCard.tsx` - карточка заработка
- [ ] `components/monetization/EarningsChart.tsx` - график доходов
- [ ] `components/monetization/SubscribersList.tsx` - список подписчиков
- [ ] `components/monetization/PayoutSettings.tsx` - настройки выплат
- [ ] Dashboard для авторов с аналитикой

### 7.4 Донаты и разовые платежи
- [ ] `components/monetization/DonateButton.tsx` - кнопка доната
- [ ] `components/monetization/DonateModal.tsx` - модал для доната
- [ ] `components/monetization/PremiumArticleCard.tsx` - платные статьи
- [ ] Система разовых покупок статей

## ✅ Этап 8: Поиск и аналитика ЗАВЕРШЕН ПОЛНОСТЬЮ (15 файлов)

### ✅ 8.1 TypeScript типы и интеграции
- [x] `types/Search.ts` - Elasticsearch типы с автодополнением ✅
- [x] `types/Analytics.ts` - метрики Mixpanel + Yandex Metrica ✅  
- [x] `types/Recommendation.ts` - персонализация и алгоритмы ✅
- [x] Обновлен `types/index.ts` с экспортами всех новых типов ✅

### ✅ 8.2 API модули (микромодули < 100 строк)
- [x] `lib/api/search.ts` - Elasticsearch API с фильтрацией ✅
- [x] `lib/api/analytics.ts` - трекинг событий и метрик ✅  
- [x] `lib/api/recommendations.ts` - персонализированные рекомендации ✅
- [x] Обновлен `lib/api/index.ts` с новыми API модулями ✅

### ✅ 8.3 React хуки с оптимизацией
- [x] Обновлен `hooks/useSearch.ts` - debounce + кэширование ✅
- [x] `hooks/useAnalytics.ts` - автоматический трекинг ✅
- [x] `hooks/useRecommendations.ts` - умные рекомендации ✅
- [x] Обновлен `hooks/index.ts` с экспортами новых хуков ✅

### ✅ 8.4 UI компоненты поиска
- [x] `components/search/SearchResults.tsx` - красивые результаты ✅
- [x] `components/search/AutocompleteSearch.tsx` - поиск с навигацией ✅
- [x] `components/search/index.ts` - экспорты компонентов ✅

### ✅ 8.5 Готовность к backend интеграции
- [x] Полная типизация для Elasticsearch настройки ✅
- [x] API готовы к подключению Mixpanel/Yandex Metrica ✅
- [x] Рекомендательная система готова к алгоритмам ✅
- [x] Context7 лучшие практики применены ✅

## Этап 9: Уведомления и email маркетинг (2-3 дня)

### 9.1 Real-time уведомления
- [ ] Настройка WebSocket соединений
- [ ] Уведомления о новых комментариях
- [ ] Уведомления о новых подписчиках
- [ ] Уведомления о платежах

### 9.2 Email уведомления
- [ ] Интеграция с Mailgun/SendGrid
- [ ] Email при новых статьях от подписок
- [ ] Еженедельный дайджест
- [ ] Уведомления о комментариях
- [ ] Уведомления о платежах

### 9.3 Push уведомления (для PWA)
- [ ] Настройка Service Worker
- [ ] Push уведомления о новом контенте
- [ ] Настройки уведомлений для пользователей

## Этап 10: Тестирование и оптимизация (2-3 дня)

### 10.1 Тестирование микромодулей
- [ ] Юнит-тесты для каждого компонента:
  - `components/editor/TiptapEditor.test.tsx`
  - `lib/utils/monetization.test.ts`
  - `hooks/useSubscriptions.test.ts`
- [ ] Интеграционные тесты API модулей
- [ ] E2E тесты критических путей (регистрация → создание статьи → подписка)

### 10.2 Производительность и SEO
- [ ] Оптимизация изображений (WebP, lazy loading)
- [ ] Code splitting по роутам
- [ ] Кэширование с Redis
- [ ] Настройка CDN для статики
- [ ] Проверка Core Web Vitals

### 10.3 Безопасность модулей (по принципам микромодулей)
- [ ] **Валидация модули** - создать отдельные модули валидации:
  ```typescript
  // lib/validation/article.validation.ts
  export const ArticleContentSchema = z.object({
    title: z.string().min(10).max(200),
    content: z.string().min(100),
    tags: z.array(z.string()).max(10)
  });
  ```
- [ ] **Санитизация модули** - изолированные модули очистки:
  ```typescript  
  // lib/utils/sanitization.ts
  export const sanitizeContent = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'h2', 'h3', 'strong', 'em'],
      ALLOWED_ATTR: ['href', 'title']
    });
  };
  ```
- [ ] **Rate limiting модули** - защита API по принципу одной ответственности
- [ ] **Spam detection модули** - отдельные модули для каждого типа контента
- [ ] **GDPR compliance модули** - изолированная логика соответствия
- [ ] Каждый модуль безопасности:
  - < 100 строк кода
  - Полное тестовое покрытие
  - JSDoc документация
  - Четкие TypeScript интерфейсы

## Этап 11: Подготовка к деплою (2-3 дня)

### 11.1 Production конфигурации
- [ ] `docker-compose.prod.yml` с Redis, Elasticsearch, PostgreSQL
- [ ] Environment variables для production
- [ ] Nginx конфигурация с кэшированием
- [ ] SSL сертификаты
- [ ] Настройка логирования

### 11.2 CI/CD Pipeline
- [ ] GitHub Actions:
  - Линтинг и проверка размера модулей
  - Тестирование микромодулей
  - Сборка Docker образов
  - Деплой на сервер
- [ ] Автоматические бэкапы базы данных
- [ ] **Мониторинг и логирование (микромодульно)**:
  ```typescript
  // logging/logger.ts - основной логгер (< 100 строк)
  // logging/formatters.ts - форматирование логов
  // logging/transports.ts - транспорты логов
  // logging/levels.ts - уровни логирования
  ```
  - ERROR - ошибки платежей, критические сбои
  - WARN - медленные запросы, подозрительная активность  
  - INFO - новые статьи, регистрации пользователей
  - DEBUG - детальная аналитика и метрики

### 11.3 Настройка внешних сервисов
- [ ] Yandex Object Storage для медиафайлов
- [ ] CDN для быстрой доставки контента
- [ ] Настройка email сервиса
- [ ] Настройка платежных систем
- [ ] Аналитические сервисы

## Этап 12: Деплой и запуск (1-2 дня)

### 12.1 Деплой на production сервер
- [ ] Аренда VPS в российском дата-центре
- [ ] Установка и настройка всех сервисов
- [ ] Миграция данных (если нужно)
- [ ] Настройка домена и SSL
- [ ] Проверка работоспособности всех систем

### 12.2 Пост-релизные задачи
- [ ] Настройка мониторинга и алертов
- [ ] Создание документации для пользователей
- [ ] Обучение команды модерации
- [ ] Запуск аналитики и отслеживание метрик

---

## Временные рамки
- **Базовая платформа (MVP)**: 20-25 дней
- **Монетизация и advanced features**: 15-20 дней  
- **Тестирование и деплой**: 5-7 дней
- **Итого**: 40-52 дня (1.5-2 месяца)

## Принципы микромодульной разработки для блога

### Особенности для блоговой платформы:
- **Editor модули**: каждое расширение редактора - отдельный файл
- **Reader модули**: компоненты чтения максимально изолированы
- **Monetization модули**: платежи и подписки в отдельных модулях
- **Social модули**: лайки, комментарии, подписки независимы

### Критически важные микромодули:
1. **Article processing** - обработка контента
2. **Payment integration** - платежные системы
3. **Search indexing** - индексация для поиска
4. **Analytics tracking** - отслеживание метрик
5. **Content security** - безопасность контента

## Чеклист создания каждого модуля (обязательно!)

### ✅ Перед созданием модуля:
- [ ] Определена **единственная ответственность** модуля
- [ ] Продуманы **входы и выходы** (TypeScript интерфейсы)
- [ ] Минимизированы **зависимости** от других модулей
- [ ] Выбрано **правильное место** в структуре проекта

### ✅ При создании модуля:
- [ ] **Размер файла < 100 строк** кода
- [ ] **Функции < 20 строк** каждая
- [ ] Добавлены **строгие TypeScript типы**
- [ ] Написаны **JSDoc комментарии** для всех публичных функций
- [ ] Добавлена **валидация входных данных** (Zod схемы)
- [ ] Использованы **именованные экспорты** (не default)
- [ ] Применены **Elegant Objects принципы**:
  - Immutable data structures
  - Композиция вместо наследования
  - Maybe<T> вместо null
  - Dependency injection

### ✅ После создания модуля:
- [ ] Написаны **unit тесты** (Jest) с покрытием 90%+
- [ ] Проверена **интеграция** с другими модулями
- [ ] Обновлена **документация** (README.md)
- [ ] Проведен **code review**
- [ ] Добавлен в **Storybook** (для UI компонентов)
- [ ] Проверен **ESLint** без ошибок
- [ ] Добавлены **примеры использования** в комментариях

## Бизнес-приоритеты

### Высокий приоритет (MVP):
1. ✅ Создание и публикация статей
2. ✅ Читательский опыт
3. ✅ Базовая монетизация (подписки)
4. ✅ SEO оптимизация

### Средний приоритет (v1.0):
1. 🔶 Комментарии и social features  
2. 🔶 Поиск по контенту
3. 🔶 Аналитика для авторов
4. 🔶 Email уведомления

### Низкий приоритет (v1.5+):
1. 🔻 Мобильное приложение
2. 🔻 ИИ-рекомендации
3. 🔻 Продвинутая аналитика
4. 🔻 Международная экспансия

## Риски и митигация

### Технические риски:
1. **Производительность поиска** - тестировать с большими объемами
2. **Масштабирование платежей** - использовать проверенные решения
3. **SEO конкуренция** - сильный фокус на качество контента

### Бизнес-риски:
1. **Привлечение авторов** - запуск с пригласительной программой
2. **Монетизация** - гибкая система тарифов
3. **Модерация контента** - автоматизированные инструменты
