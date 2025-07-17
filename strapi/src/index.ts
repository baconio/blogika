import type { Core } from '@strapi/strapi';

/**
 * Создание кастомных ролей для блога
 * @param strapi - экземпляр Strapi
 */
const createCustomRoles = async (strapi: Core.Strapi) => {
  const roleService = strapi.service('plugin::users-permissions.role');
  
  try {
    // Проверяем существуют ли уже роли
    const existingRoles = await roleService.find();
    const roleNames = existingRoles.map((role: any) => role.name);
    
    // Создаем роль Author если не существует
    if (!roleNames.includes('author')) {
      await roleService.create({
        name: 'author',
        description: 'Роль для авторов статей - создание и управление собственным контентом',
        type: 'author',
        permissions: {
          // Права на статьи
          'api::article.article': ['find', 'findOne', 'create', 'update'],
          // Права на комментарии (только свои)
          'api::comment.comment': ['find', 'findOne'],
          // Права на подписки (только просмотр своих подписчиков)
          'api::subscription.subscription': ['find', 'findOne'],
          // Права на свой профиль автора
          'api::author.author': ['find', 'findOne', 'update'],
          // Права на категории и теги (только чтение)
          'api::category.category': ['find', 'findOne'],
          'api::tag.tag': ['find', 'findOne']
        }
      });
      strapi.log.info('✅ Role "author" created successfully');
    }
    
    // Создаем роль Subscriber если не существует  
    if (!roleNames.includes('subscriber')) {
      await roleService.create({
        name: 'subscriber',
        description: 'Роль для подписчиков - чтение контента и управление подписками',
        type: 'subscriber',
        permissions: {
          // Права на чтение статей
          'api::article.article': ['find', 'findOne'],
          // Права на создание комментариев
          'api::comment.comment': ['find', 'findOne', 'create', 'update'],
          // Права на управление своими подписками
          'api::subscription.subscription': ['find', 'findOne', 'create', 'update'],
          // Права на чтение категорий и тегов
          'api::category.category': ['find', 'findOne'],
          'api::tag.tag': ['find', 'findOne'],
          // Права на чтение профилей авторов
          'api::author.author': ['find', 'findOne']
        }
      });
      strapi.log.info('✅ Role "subscriber" created successfully');
    }
    
  } catch (error) {
    strapi.log.error('❌ Error creating custom roles:', error);
  }
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Создаем кастомные роли при запуске
    await createCustomRoles(strapi);
    
    strapi.log.info('🚀 Blog platform bootstrap completed');
  },
};
