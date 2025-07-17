import type { Schema, Struct } from '@strapi/strapi';

export interface MonetizationPaymentInfo extends Struct.ComponentSchema {
  collectionName: 'components_monetization_payment_infos';
  info: {
    description: '\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u043F\u043B\u0430\u0442\u0435\u0436\u0430\u0445 \u0438 \u0432\u044B\u043F\u043B\u0430\u0442\u0430\u0445';
    displayName: 'Payment Info';
  };
  attributes: {
    amount: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    currency: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 3;
      }> &
      Schema.Attribute.DefaultTo<'RUB'>;
    external_id: Schema.Attribute.String & Schema.Attribute.Required;
    is_active: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    metadata: Schema.Attribute.JSON;
    payment_method: Schema.Attribute.String;
    payment_system: Schema.Attribute.Enumeration<
      ['yukassa', 'cloudpayments', 'stripe', 'paypal', 'sbp']
    > &
      Schema.Attribute.Required;
    status: Schema.Attribute.Enumeration<
      ['pending', 'processing', 'succeeded', 'failed', 'cancelled']
    > &
      Schema.Attribute.DefaultTo<'pending'>;
  };
}

export interface SharedSeoMeta extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_metas';
  info: {
    description: 'SEO \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u0441\u0442\u0430\u0442\u0435\u0439';
    displayName: 'SEO Meta';
  };
  attributes: {
    canonical_url: Schema.Attribute.String;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 120;
      }>;
    keywords: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    og_image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
        minLength: 30;
      }>;
  };
}

export interface SharedSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: '\u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438 \u0430\u0432\u0442\u043E\u0440\u0430';
    displayName: 'Social Links';
  };
  attributes: {
    handle: Schema.Attribute.String;
    platform: Schema.Attribute.Enumeration<
      ['twitter', 'telegram', 'youtube', 'instagram', 'linkedin', 'github']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'monetization.payment-info': MonetizationPaymentInfo;
      'shared.seo-meta': SharedSeoMeta;
      'shared.social-links': SharedSocialLinks;
    }
  }
}
