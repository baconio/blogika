/**
 * Экспорт всех утилит блога
 * @description Централизованный экспорт микромодулей утилит
 */

// Утилиты для обработки контента
export {
  calculateReadingTime,
  generateExcerpt,
  stripHtmlTags,
  isValidHtmlContent,
  extractFirstImage,
  type ReadingTimeResult,
  type ExcerptOptions,
  type Maybe
} from './content';

// Утилиты форматирования
export {
  formatDate,
  getRelativeTime,
  formatNumber,
  pluralize,
  truncateText,
  capitalize,
  type FormatDateOptions,
  type FormatNumberOptions
} from './formatting';

// SEO утилиты
export {
  generateArticleSeo,
  generateArticleStructuredData,
  generateDescription,
  generateSlug,
  truncateTitle,
  truncateDescription,
  type SeoMeta,
  type ArticleSeoData,
  type SeoConfig
} from './seo';

// Утилиты монетизации
export {
  calculateAuthorEarnings,
  calculateRecommendedSubscriptionPrice,
  generatePricingTiers,
  calculateSubscriptionMetrics,
  formatPrice,
  calculateDiscountPercent,
  isValidPrice,
  type PricingTier,
  type EarningsCalculation,
  type SubscriptionMetrics
} from './monetization';

// Утилиты аналитики
export {
  trackEvent,
  trackArticleView,
  trackReadingProgress,
  trackArticleCompletion,
  trackContentInteraction,
  calculateEngagementScore,
  calculateConversionMetrics,
  type AnalyticsEvent,
  type ReadingSession,
  type ConversionMetrics
} from './analytics';

// Утилиты редактора
export {
  sanitizeHtml,
  htmlToMarkdown,
  markdownToHtml,
  analyzeContent,
  exportContent,
  validateContent,
  optimizeImages,
  type EditorContent,
  type ExportOptions,
  type ImageUploadResult
} from './editor'; 