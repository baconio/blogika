/**
 * Экспорт всех React хуков блога
 * @description Централизованный экспорт микромодулей хуков
 */

// Хуки для работы со статьями
export {
  useArticles,
  useArticle,
  useArticleSearch,
  useRelatedArticles,
  useTrendingArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  useToggleArticleLike,
  useToggleArticleBookmark,
  type UseArticlesOptions,
  type UseArticleOptions,
  type ArticleFilters
} from './useArticles';

// Хуки для работы с комментариями
export {
  useComments,
  useComment,
  useCommentReplies,
  useUserComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useToggleCommentLike,
  useModerateComment,
  useModerationComments,
  usePinComment,
  type UseCommentsOptions,
  type CreateCommentData,
  type CommentFilters
} from './useComments';

// Хуки для работы с подписками
export {
  useUserSubscriptions,
  useAuthorSubscribers,
  useSubscription,
  useSubscriptionStatus,
  useSubscriptionStats,
  useCreateSubscription,
  useCancelSubscription,
  useRenewSubscription,
  useUpdateSubscription,
  useToggleAutoRenewal,
  useSubscriptionPayments,
  useApplyPromoCode,
  type CreateSubscriptionData,
  type SubscriptionFilters,
  type SubscriptionStats
} from './useSubscriptions';

// Хуки для поиска
export {
  useSearch,
  useTrendingSearches,
  type SearchFilters,
  type SearchResult,
  type SearchSuggestion,
  type UseSearchOptions
} from './useSearch';

// Хук для отслеживания прогресса чтения
export {
  useReadingProgress,
  type ReadingProgressData,
  type UseReadingProgressOptions,
  type ReadingMilestone
} from './useReadingProgress'; 