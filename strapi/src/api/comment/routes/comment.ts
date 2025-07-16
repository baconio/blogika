/**
 * comment router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::comment.comment', {
  config: {
    find: {
      middlewares: ['api::comment.moderation-filter']
    },
    findOne: {
      middlewares: ['api::comment.moderation-filter']
    },
    create: {
      middlewares: ['api::comment.spam-detection']
    }
  }
}); 