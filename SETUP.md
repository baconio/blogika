# Настройка локального окружения разработки

## 🛠️ Требования

- **Node.js** 18+ и npm/yarn
- **Docker** и docker-compose
- **Git**

## 🚀 Быстрый старт

### 1. Клонирование проекта
```bash
git clone https://github.com/baconio/blogika.git
cd blogika
```

### 2. Запуск инфраструктуры
```bash
# Запуск всех сервисов в фоне
docker-compose up -d

# Проверка статуса сервисов
docker-compose ps
```

### 3. Настройка переменных окружения

Создайте файлы `.env` в соответствующих папках:

#### Корневой `.env`
```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/blogika_dev
REDIS_URL=redis://localhost:6379
ELASTICSEARCH_URL=http://localhost:9200
```

#### Frontend `.env.local`
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

#### Strapi `.env`
```env
HOST=0.0.0.0
PORT=1337
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/blogika_dev
ADMIN_JWT_SECRET=your-jwt-secret
API_TOKEN_SALT=your-token-salt
TRANSFER_TOKEN_SALT=your-transfer-salt
```

## 📋 Доступные сервисы

| Сервис | URL | Описание |
|--------|-----|----------|
| PostgreSQL | localhost:5432 | База данных |
| Redis | localhost:6379 | Кэширование |
| Elasticsearch | localhost:9200 | Поиск |
| MinIO | localhost:9000 | Хранилище медиа |
| MinIO Console | localhost:9001 | Админка MinIO |
| Adminer | localhost:8080 | Админка БД |

## 🗄️ Структура проекта

```
blogika/
├── frontend/           # Next.js приложение
│   ├── components/    # UI компоненты (микромодули)
│   │   ├── ui/       # Базовые компоненты
│   │   ├── forms/    # Формы
│   │   ├── layout/   # Layout компоненты
│   │   └── features/ # Бизнес-логика
│   ├── lib/          # Утилиты и API
│   │   ├── api/      # API клиенты
│   │   ├── utils/    # Утилиты
│   │   ├── validation/ # Схемы валидации
│   │   └── constants/ # Константы
│   ├── hooks/        # React хуки
│   ├── types/        # TypeScript типы
│   └── store/        # Состояние приложения
├── strapi/           # Strapi CMS
└── backend/          # Дополнительные backend сервисы
```

## 🧪 Разработка

### Принципы микромодульной архитектуры
- **Один файл = одна ответственность** (max 100 строк)
- **Функции max 20 строк**
- **Строгая типизация** TypeScript
- **JSDoc** для всех публичных функций
- **Unit тесты** для каждого модуля

### Создание компонента
```bash
# Генерация нового UI компонента
npm run generate:component Button

# Структура будет создана:
components/ui/Button/
├── Button.tsx      # Основной компонент
├── Button.types.ts # TypeScript типы
├── Button.test.tsx # Unit тесты
└── index.ts        # Экспорт
```

## 🔧 Полезные команды

```bash
# Запуск инфраструктуры
docker-compose up -d

# Остановка всех сервисов
docker-compose down

# Просмотр логов
docker-compose logs -f [service-name]

# Очистка всех данных
docker-compose down -v

# Пересборка образов
docker-compose build --no-cache
```

## 📚 Дополнительная настройка

### MinIO (хранилище медиафайлов)
1. Откройте http://localhost:9001
2. Логин: `minioadmin` / Пароль: `minioadmin123`
3. Создайте bucket `blogika-media`

### Elasticsearch (поиск)
1. Проверьте статус: `curl http://localhost:9200/_cluster/health`
2. Elasticsearch будет автоматически настроен при запуске Strapi

## ⚠️ Важные заметки

- Все сервисы запускаются в Docker для изоляции
- Базы данных и хранилища persist между перезапусками
- Для production используйте отдельные docker-compose файлы
- Не коммитьте файлы `.env` с реальными ключами 