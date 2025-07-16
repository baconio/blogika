/**
 * subscription router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::subscription.subscription', {
  config: {
    find: {
      middlewares: ['api::subscription.access-control']
    },
    findOne: {
      middlewares: ['api::subscription.access-control']
    },
    create: {
      middlewares: ['api::subscription.payment-validation']
    },
    update: {
      middlewares: ['api::subscription.access-control']
    }
  }
}); 