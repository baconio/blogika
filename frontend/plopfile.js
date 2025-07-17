/**
 * Plop.js конфигурация для генерации микромодулей
 * @description Автоматическое создание компонентов, API модулей и хуков
 */

module.exports = function (plop) {
  // Хелперы для именования
  plop.setHelper('capitalize', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  });

  plop.setHelper('camelCase', (text) => {
    return text.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  });

  plop.setHelper('kebabCase', (text) => {
    return text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  });

  // 1. Генератор UI компонентов
  plop.setGenerator('component', {
    description: 'Создать новый UI компонент (микромодуль)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Название компонента (PascalCase):',
        validate: (value) => {
          if (!value) return 'Название обязательно';
          if (!/^[A-Z][a-zA-Z]*$/.test(value)) {
            return 'Используйте PascalCase (например, Button, UserCard)';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'category',
        message: 'Категория компонента:',
        choices: ['ui', 'forms', 'layout', 'features', 'auth', 'social']
      },
      {
        type: 'input',
        name: 'description',
        message: 'Описание компонента:'
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Создать тестовый файл?',
        default: true
      },
      {
        type: 'confirm',
        name: 'withStorybook',
        message: 'Создать Storybook story?',
        default: true
      }
    ],
    actions: [
      // Основной компонент
      {
        type: 'add',
        path: 'components/{{category}}/{{name}}/{{name}}.tsx',
        templateFile: 'plop-templates/component.tsx.hbs'
      },
      // TypeScript типы
      {
        type: 'add',
        path: 'components/{{category}}/{{name}}/{{name}}.types.ts',
        templateFile: 'plop-templates/component.types.ts.hbs'
      },
      // Index файл
      {
        type: 'add',
        path: 'components/{{category}}/{{name}}/index.ts',
        templateFile: 'plop-templates/component.index.ts.hbs'
      },
      // Тесты (опционально)
      {
        type: 'add',
        path: 'components/{{category}}/{{name}}/{{name}}.test.tsx',
        templateFile: 'plop-templates/component.test.tsx.hbs',
        skip: (data) => !data.withTests && 'Тесты пропущены'
      },
      // Storybook story (опционально)
      {
        type: 'add',
        path: 'components/{{category}}/{{name}}/{{name}}.stories.tsx',
        templateFile: 'plop-templates/component.stories.tsx.hbs',
        skip: (data) => !data.withStorybook && 'Storybook story пропущен'
      }
    ]
  });

  // 2. Генератор API модулей
  plop.setGenerator('api', {
    description: 'Создать новый API модуль (микромодуль)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Название API модуля (camelCase):',
        validate: (value) => {
          if (!value) return 'Название обязательно';
          if (!/^[a-z][a-zA-Z]*$/.test(value)) {
            return 'Используйте camelCase (например, users, articles)';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'entityName',
        message: 'Название сущности (PascalCase):',
        default: (answers) => answers.name.charAt(0).toUpperCase() + answers.name.slice(1)
      },
      {
        type: 'input',
        name: 'description',
        message: 'Описание API модуля:'
      },
      {
        type: 'checkbox',
        name: 'methods',
        message: 'Какие методы CRUD включить?',
        choices: [
          { name: 'create', checked: true },
          { name: 'getById', checked: true },
          { name: 'getAll', checked: true },
          { name: 'update', checked: true },
          { name: 'delete', checked: true }
        ]
      },
      {
        type: 'confirm',
        name: 'withValidation',
        message: 'Создать Zod схемы валидации?',
        default: true
      }
    ],
    actions: [
      // Основной API модуль
      {
        type: 'add',
        path: 'lib/api/{{name}}.ts',
        templateFile: 'plop-templates/api.ts.hbs'
      },
      // TypeScript типы
      {
        type: 'add',
        path: 'types/{{entityName}}.ts',
        templateFile: 'plop-templates/api.types.ts.hbs'
      },
      // Zod схемы валидации (опционально)
      {
        type: 'add',
        path: 'lib/validation/{{name}}.ts',
        templateFile: 'plop-templates/validation.ts.hbs',
        skip: (data) => !data.withValidation && 'Валидация пропущена'
      },
      // Обновить index.ts в api
      {
        type: 'modify',
        path: 'lib/api/index.ts',
        pattern: /(\/\/ Recommendation API[\s\S]*?from '.\/recommendations';)/,
        template: '$1\n\n// {{entityName}} API\nexport * as {{name}}Api from \'./{{name}}\';'
      }
    ]
  });

  // 3. Генератор React хуков
  plop.setGenerator('hook', {
    description: 'Создать новый React хук (микромодуль)',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Название хука (без use префикса):',
        validate: (value) => {
          if (!value) return 'Название обязательно';
          if (!/^[A-Z][a-zA-Z]*$/.test(value)) {
            return 'Используйте PascalCase (например, Articles, UserProfile)';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Описание хука:'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Тип хука:',
        choices: [
          { name: 'Data fetching (с React Query)', value: 'query' },
          { name: 'State management', value: 'state' },
          { name: 'Effect hook', value: 'effect' },
          { name: 'Custom logic', value: 'custom' }
        ]
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Создать тестовый файл?',
        default: true
      }
    ],
    actions: [
      // Основной хук
      {
        type: 'add',
        path: 'hooks/use{{name}}.ts',
        templateFile: 'plop-templates/hook.ts.hbs'
      },
      // Тесты (опционально)
      {
        type: 'add',
        path: 'hooks/use{{name}}.test.ts',
        templateFile: 'plop-templates/hook.test.ts.hbs',
        skip: (data) => !data.withTests && 'Тесты пропущены'
      },
      // Обновить index.ts в hooks
      {
        type: 'modify',
        path: 'hooks/index.ts',
        pattern: /(\/\/ Хук для аутентификации[\s\S]*?} from '.\/useAuth';)/,
        template: '$1\n\n// Хук {{description}}\nexport {\n  use{{name}}\n} from \'./use{{name}}\';'
      }
    ]
  });

  // 4. Генератор страниц Next.js
  plop.setGenerator('page', {
    description: 'Создать новую страницу Next.js',
    prompts: [
      {
        type: 'input',
        name: 'route',
        message: 'Маршрут страницы (например, /about, /users/[id]):',
        validate: (value) => {
          if (!value) return 'Маршрут обязателен';
          if (!value.startsWith('/')) return 'Маршрут должен начинаться с /';
          return true;
        }
      },
      {
        type: 'input',
        name: 'title',
        message: 'Заголовок страницы:'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Описание страницы:'
      },
      {
        type: 'list',
        name: 'type',
        message: 'Тип страницы:',
        choices: [
          { name: 'Static (без данных)', value: 'static' },
          { name: 'Server Side Rendering', value: 'ssr' },
          { name: 'Client Side (с аутентификацией)', value: 'client' }
        ]
      },
      {
        type: 'confirm',
        name: 'withAuth',
        message: 'Требует аутентификации?',
        default: false
      }
    ],
    actions: [
      // Основная страница
      {
        type: 'add',
        path: 'app{{route}}/page.tsx',
        templateFile: 'plop-templates/page.tsx.hbs'
      },
      // Layout (если нужен)
      {
        type: 'add',
        path: 'app{{route}}/layout.tsx',
        templateFile: 'plop-templates/layout.tsx.hbs',
        skip: (data) => data.route.split('/').length <= 2 && 'Layout не нужен для простых страниц'
      },
      // Loading page
      {
        type: 'add',
        path: 'app{{route}}/loading.tsx',
        templateFile: 'plop-templates/loading.tsx.hbs'
      }
    ]
  });

  // 5. Генератор утилит
  plop.setGenerator('util', {
    description: 'Создать новую утилитарную функцию',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Название утилиты (camelCase):',
        validate: (value) => {
          if (!value) return 'Название обязательно';
          if (!/^[a-z][a-zA-Z]*$/.test(value)) {
            return 'Используйте camelCase (например, formatDate, calculatePrice)';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'category',
        message: 'Категория утилиты:',
        choices: ['formatting', 'validation', 'content', 'analytics', 'monetization', 'seo']
      },
      {
        type: 'input',
        name: 'description',
        message: 'Описание утилиты:'
      },
      {
        type: 'confirm',
        name: 'withTests',
        message: 'Создать тестовый файл?',
        default: true
      }
    ],
    actions: [
      // Основная утилита
      {
        type: 'add',
        path: 'lib/utils/{{category}}.ts',
        templateFile: 'plop-templates/util.ts.hbs'
      },
      // Тесты (опционально)
      {
        type: 'add',
        path: 'lib/utils/{{category}}.test.ts',
        templateFile: 'plop-templates/util.test.ts.hbs',
        skip: (data) => !data.withTests && 'Тесты пропущены'
      }
    ]
  });

  // 6. Генератор Strapi content types
  plop.setGenerator('strapi-content', {
    description: 'Создать новый Strapi Content Type',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Название Content Type (kebab-case):',
        validate: (value) => {
          if (!value) return 'Название обязательно';
          if (!/^[a-z][a-z-]*[a-z]$/.test(value)) {
            return 'Используйте kebab-case (например, blog-post, user-profile)';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'displayName',
        message: 'Отображаемое название:',
        default: (answers) => answers.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      },
      {
        type: 'list',
        name: 'type',
        message: 'Тип коллекции:',
        choices: [
          { name: 'Collection Type (множественный)', value: 'collectionType' },
          { name: 'Single Type (одиночный)', value: 'singleType' }
        ]
      },
      {
        type: 'confirm',
        name: 'withApi',
        message: 'Создать API эндпоинты?',
        default: true
      }
    ],
    actions: [
      // Schema файл
      {
        type: 'add',
        path: '../strapi/src/api/{{name}}/content-types/{{name}}/schema.json',
        templateFile: 'plop-templates/strapi-schema.json.hbs'
      },
      // Controller (если нужен API)
      {
        type: 'add',
        path: '../strapi/src/api/{{name}}/controllers/{{name}}.ts',
        templateFile: 'plop-templates/strapi-controller.ts.hbs',
        skip: (data) => !data.withApi && 'API контроллер пропущен'
      },
      // Routes (если нужен API)
      {
        type: 'add',
        path: '../strapi/src/api/{{name}}/routes/{{name}}.ts',
        templateFile: 'plop-templates/strapi-routes.ts.hbs',
        skip: (data) => !data.withApi && 'API маршруты пропущены'
      },
      // Services (если нужен API)
      {
        type: 'add',
        path: '../strapi/src/api/{{name}}/services/{{name}}.ts',
        templateFile: 'plop-templates/strapi-service.ts.hbs',
        skip: (data) => !data.withApi && 'API сервис пропущен'
      }
    ]
  });
}; 