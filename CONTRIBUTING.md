# Руководство по разработке Blogika

## 🎯 Принципы разработки

Этот проект следует **микромодульной архитектуре** для создания поддерживаемого, тестируемого и масштабируемого кода.

### Основные принципы
- **Один файл = одна ответственность** (максимум 50-100 строк)
- **Функции максимум 20 строк** каждая  
- **Минимум зависимостей** между модулями
- **Строгая типизация** TypeScript
- **JSDoc** для всех публичных функций

## 📁 Структура модулей

### Frontend (Next.js)
```
frontend/
├── components/
│   ├── ui/          # Button, Input, Modal (атомарные)
│   ├── forms/       # ArticleForm, CommentForm
│   ├── layout/      # Header, Footer, PageLayout
│   └── features/    # article-editor, social-features
├── lib/
│   ├── api/         # API клиенты
│   ├── utils/       # Утилиты
│   ├── validation/  # Zod схемы
│   └── constants/   # Константы
├── hooks/           # React хуки
├── types/           # TypeScript типы
└── store/           # Состояние (Zustand/Redux)
```

### Backend (Strapi)
```
strapi/
├── src/api/
│   ├── controllers/ # API контроллеры
│   ├── services/    # Бизнес-логика
│   ├── routes/      # Маршруты
│   └── middlewares/ # Промежуточное ПО
└── config/          # Конфигурация
```

## 🧩 Создание нового модуля

### Обязательные файлы для компонента:
```
Component.tsx      # Основной компонент (< 100 строк)
Component.types.ts # TypeScript типы
Component.test.tsx # Unit тесты
index.ts          # Именованный экспорт
```

### Обязательные файлы для API модуля:
```
api.ts            # API функции
types.ts          # Типы данных
validation.ts     # Zod схемы
constants.ts      # Константы модуля
```

## ✅ Чеклист создания модуля

### Перед созданием:
- [ ] Определена единственная ответственность модуля
- [ ] Продуманы входы и выходы (TypeScript интерфейсы)
- [ ] Минимизированы зависимости от других модулей
- [ ] Выбрано правильное место в структуре проекта

### При создании:
- [ ] Размер файла < 100 строк кода
- [ ] Функции < 20 строк каждая
- [ ] Добавлены строгие TypeScript типы
- [ ] Написаны JSDoc комментарии для всех публичных функций
- [ ] Добавлена валидация входных данных (Zod схемы)
- [ ] Использованы именованные экспорты

### После создания:
- [ ] Написаны unit тесты с покрытием 90%+
- [ ] Проверена интеграция с другими модулями
- [ ] Обновлена документация
- [ ] Проведен code review
- [ ] Добавлен в Storybook (для UI компонентов)

## 🎨 Стандарты кода

### TypeScript
```typescript
/**
 * Вычисляет время чтения статьи
 * @param content - текст статьи
 * @param wordsPerMinute - скорость чтения (по умолчанию 200)
 * @returns время чтения в минутах
 * @example
 * const time = calculateReadingTime(article.content, 250)
 */
export const calculateReadingTime = (
  content: string, 
  wordsPerMinute: number = 200
): number => {
  const wordCount = content.split(/\\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
```

### React компоненты
```typescript
// ArticleCard.tsx
interface ArticleCardProps {
  readonly article: Article;
  readonly onSelect?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect
}) => {
  const handleClick = () => {
    onSelect?.(article);
  };

  return (
    <article onClick={handleClick} className="article-card">
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
    </article>
  );
};
```

### Валидация данных
```typescript
// validation/article.validation.ts
import { z } from 'zod';

export const ArticleSchema = z.object({
  title: z.string().min(10).max(200),
  content: z.string().min(100),
  tags: z.array(z.string()).max(10)
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
```

## 🛠️ Инструменты разработки

### ESLint правила
```json
{
  "rules": {
    "max-lines": ["error", 100],
    "max-lines-per-function": ["error", 20],
    "no-default-export": ["error"]
  }
}
```

### Скрипты package.json
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "build": "next build",
    "storybook": "storybook dev -p 6006"
  }
}
```

## 🔄 Процесс разработки

### Git Flow
1. Создайте feature branch: `git checkout -b feature/article-editor`
2. Разрабатывайте в микромодулях
3. Добавьте тесты для всех модулей
4. Обновите документацию
5. Создайте Pull Request

### Коммиты
Используйте [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: добавлен компонент ArticleEditor
fix: исправлена валидация в CommentForm  
docs: обновлена документация API
test: добавлены тесты для AuthService
```

### Code Review
- Проверьте соответствие принципам микромодулей
- Убедитесь в наличии тестов (покрытие > 90%)
- Проверьте TypeScript типы
- Убедитесь в наличии JSDoc комментариев

## 🧪 Тестирование

### Unit тесты
```typescript
// Button.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration тесты
Тестируйте взаимодействие между модулями:
```typescript
// ArticleEditor.integration.test.tsx
describe('ArticleEditor Integration', () => {
  it('should save article through API', async () => {
    // тест полного workflow
  });
});
```

## 🔒 Безопасность

### Валидация входных данных
```typescript
// Всегда валидируйте входящие данные
export const createArticle = (data: unknown): Article => {
  const validatedData = ArticleSchema.parse(data);
  return processArticle(validatedData);
};
```

### Санитизация контента
```typescript
// Очищайте HTML контент
export const sanitizeContent = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'h2', 'h3', 'strong', 'em'],
    ALLOWED_ATTR: ['href', 'title']
  });
};
```

## 📚 Документация

### Storybook для UI компонентов
```typescript
// Button.stories.tsx
export default {
  title: 'UI/Button',
  component: Button,
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};
```

### README для сложных модулей
Создавайте README.md для модулей с более чем 3 файлами.

## ⚡ Performance

### Оптимизация React
```typescript
// Используйте React.memo для предотвращения re-renders
export const ArticleCard = React.memo<ArticleCardProps>(({ article }) => {
  // component logic
});

// Мемоизируйте тяжелые вычисления
const readingTime = useMemo(() => 
  calculateReadingTime(article.content), 
  [article.content]
);
```

### Lazy loading
```typescript
// Динамический импорт для больших компонентов
const ArticleEditor = lazy(() => import('./ArticleEditor'));
```

## 🚀 Деплой

### Production сборка
```bash
# Проверьте все тесты
npm run test

# Проверьте типы
npm run type-check

# Соберите проект
npm run build

# Запустите production сервер
npm start
```

## 📞 Помощь

- **Вопросы по архитектуре**: создайте Issue с тегом `architecture`
- **Bugs**: используйте шаблон bug report
- **Feature requests**: используйте шаблон feature request

---

**Помните**: Микромодульность - это не просто организация кода, это философия разработки для создания качественного, поддерживаемого и масштабируемого продукта. 