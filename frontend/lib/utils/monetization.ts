/**
 * Утилиты для монетизации блога
 * @description Микромодуль для расчета доходов, цен и платежей
 */

export type Maybe<T> = T | undefined;

export interface PricingTier {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly currency: string;
  readonly period: 'monthly' | 'yearly' | 'lifetime';
  readonly features: readonly string[];
}

export interface EarningsCalculation {
  readonly grossAmount: number;
  readonly platformFee: number;
  readonly taxAmount: number;
  readonly netAmount: number;
  readonly currency: string;
}

export interface SubscriptionMetrics {
  readonly totalSubscribers: number;
  readonly monthlyRevenue: number;
  readonly averageRevenuePerUser: number;
  readonly churnRate: number;
  readonly lifetimeValue: number;
}

/**
 * Рассчитывает чистую прибыль автора после всех комиссий
 * @param grossAmount - валовая сумма
 * @param platformFeePercent - процент комиссии платформы (по умолчанию 10%)
 * @param taxPercent - процент налога (по умолчанию 13% для РФ)
 * @returns расчет заработка
 * @example
 * const earnings = calculateAuthorEarnings(1000, 10, 13)
 * console.log(earnings.netAmount) // 783
 */
export const calculateAuthorEarnings = (
  grossAmount: number,
  platformFeePercent: number = 10,
  taxPercent: number = 13
): EarningsCalculation => {
  const platformFee = Math.round(grossAmount * (platformFeePercent / 100));
  const remainingAmount = grossAmount - platformFee;
  const taxAmount = Math.round(remainingAmount * (taxPercent / 100));
  const netAmount = remainingAmount - taxAmount;

  return {
    grossAmount,
    platformFee,
    taxAmount,
    netAmount,
    currency: 'RUB'
  };
};

/**
 * Рассчитывает рекомендуемую цену подписки на основе контента
 * @param averageArticlesPerMonth - среднее количество статей в месяц
 * @param averageReadingTime - среднее время чтения статьи в минутах
 * @param authorPopularity - популярность автора (1-10)
 * @returns рекомендуемую цену в рублях
 * @example
 * const price = calculateRecommendedSubscriptionPrice(8, 15, 7) // 450 руб/мес
 */
export const calculateRecommendedSubscriptionPrice = (
  averageArticlesPerMonth: number,
  averageReadingTime: number,
  authorPopularity: number
): number => {
  const basePrice = 100; // Базовая цена в рублях
  const contentValue = averageArticlesPerMonth * averageReadingTime * 2;
  const popularityMultiplier = 1 + (authorPopularity / 10);
  
  const recommendedPrice = Math.round(
    (basePrice + contentValue) * popularityMultiplier
  );

  // Округляем до красивых цифр
  return Math.ceil(recommendedPrice / 50) * 50;
};

/**
 * Создает ценовые планы для автора
 * @param basePrice - базовая месячная цена
 * @param features - список функций
 * @returns массив ценовых планов
 * @example
 * const tiers = generatePricingTiers(300, ['Доступ к статьям', 'Комментарии'])
 */
export const generatePricingTiers = (
  basePrice: number,
  features: readonly string[]
): readonly PricingTier[] => {
  const monthlyDiscount = 0;
  const yearlyDiscount = 0.15; // 15% скидка за годовую подписку
  const lifetimeMultiplier = 20; // Пожизненная = 20 месячных платежей

  return [
    {
      id: 'monthly',
      name: 'Месячная подписка',
      price: Math.round(basePrice * (1 - monthlyDiscount)),
      currency: 'RUB',
      period: 'monthly',
      features
    },
    {
      id: 'yearly',
      name: 'Годовая подписка',
      price: Math.round(basePrice * 12 * (1 - yearlyDiscount)),
      currency: 'RUB',
      period: 'yearly',
      features: [...features, 'Скидка 15%', 'Приоритетная поддержка']
    },
    {
      id: 'lifetime',
      name: 'Пожизненная подписка',
      price: Math.round(basePrice * lifetimeMultiplier),
      currency: 'RUB',
      period: 'lifetime',
      features: [...features, 'Навсегда', 'Все будущие функции', 'VIP статус']
    }
  ];
};

/**
 * Рассчитывает метрики подписок автора
 * @param subscribers - данные о подписчиках
 * @param monthlyRevenue - месячная выручка
 * @returns метрики подписок
 * @example
 * const metrics = calculateSubscriptionMetrics(subscribers, 15000)
 */
export const calculateSubscriptionMetrics = (
  totalSubscribers: number,
  monthlyRevenue: number,
  subscribersLastMonth: number = totalSubscribers
): SubscriptionMetrics => {
  const averageRevenuePerUser = totalSubscribers > 0 
    ? Math.round(monthlyRevenue / totalSubscribers)
    : 0;

  const churnRate = subscribersLastMonth > 0
    ? Math.max(0, (subscribersLastMonth - totalSubscribers) / subscribersLastMonth)
    : 0;

  // Упрощенный расчет LTV (можно улучшить)
  const lifetimeValue = churnRate > 0
    ? Math.round(averageRevenuePerUser / churnRate)
    : averageRevenuePerUser * 24; // 2 года если нет оттока

  return {
    totalSubscribers,
    monthlyRevenue,
    averageRevenuePerUser,
    churnRate,
    lifetimeValue
  };
};

/**
 * Форматирует цену для отображения
 * @param price - цена в копейках или рублях
 * @param currency - валюта
 * @returns отформатированную строку цены
 * @example
 * formatPrice(99900, 'RUB') // "999 ₽"
 * formatPrice(299, 'RUB', true) // "2,99 ₽"
 */
export const formatPrice = (
  price: number,
  currency: string = 'RUB',
  showKopecks: boolean = false
): string => {
  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: showKopecks ? 2 : 0,
    maximumFractionDigits: showKopecks ? 2 : 0
  };

  return new Intl.NumberFormat('ru-RU', formatOptions).format(price);
};

/**
 * Рассчитывает скидку между двумя ценами
 * @param originalPrice - оригинальная цена
 * @param discountedPrice - цена со скидкой
 * @returns процент скидки
 * @example
 * calculateDiscountPercent(1000, 800) // 20
 */
export const calculateDiscountPercent = (
  originalPrice: number,
  discountedPrice: number
): number => {
  if (originalPrice <= 0) return 0;
  
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Проверяет допустимость цены для российского рынка
 * @param price - цена для проверки
 * @returns true если цена в допустимом диапазоне
 * @example
 * isValidPrice(50) // false (слишком низкая)
 * isValidPrice(500) // true
 */
export const isValidPrice = (price: number): boolean => {
  const minPrice = 99; // Минимальная цена в рублях
  const maxPrice = 50000; // Максимальная цена в рублях
  
  return price >= minPrice && price <= maxPrice && price % 1 === 0;
}; 