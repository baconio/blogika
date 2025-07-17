/**
 * Центральный экспорт всех типов блоговой платформы
 * Следует принципу именованных экспортов для микромодульной архитектуры
 */

// Article types
export type {
  Article,
  ArticleStatus,
  ArticleAccessLevel,
  ArticleInput,
  ArticleUpdate,
  ArticleSearchParams
} from './Article';

// User types
export type {
  User,
  UserRole,
  UserRegistrationData,
  UserLoginData,
  UserProfileUpdate
} from './User';

// Author types
export type {
  Author,
  SocialLinks,
  ContentAccessLevel,
  AuthorProfileData,
  AuthorStats,
  AuthorAnalyticsSettings
} from './Author';

// Category types
export type {
  Category,
  CategoryWithStats,
  CategoryInput,
  CategoryUpdate,
  CategorySearchParams,
  CategoryColor,
  CATEGORY_COLORS
} from './Category';

// Tag types  
export type {
  Tag,
  TagWithUsage,
  TagInput,
  TagUpdate,
  TagSearchParams,
  TagColor,
  TAG_COLORS,
  TagCloud,
  TagStats
} from './Tag';

// Comment types
export type {
  Comment,
  ModerationStatus,
  CommentInput,
  CommentUpdate,
  CommentSearchParams,
  CommentLikeAction,
  CommentModerationData,
  CommentStats,
  CommentTree,
  CommentFormData,
  CommentDisplaySettings
} from './Comment';

// Subscription types
export type {
  Subscription,
  PlanType,
  SubscriptionStatus,
  PaymentSystem,
  PaymentStatus,
  SubscriptionInput,
  SubscriptionUpdate,
  SubscriptionSearchParams,
  SubscriptionCancellationData,
  AuthorSubscriptionStats,
  PricingPlan,
  SubscriptionCard,
  PaymentToken,
  PaymentResult,
  SubscriptionNotificationSettings
} from './Subscription';

// Component types
export type {
  SocialLink,
  SocialPlatform,
  SEOMeta,
  PaymentInfo,
  ExtendedSEOMeta,
  OpenGraphData,
  SocialCard,
  SEOUtils,
  SOCIAL_PLATFORMS_CONFIG
} from './Components';

// Search types
export type {
  SearchParams,
  SearchResult,
  SearchHighlight,
  SearchResponse,
  SearchFacets,
  FacetItem,
  AutocompleteResult
} from './Search';

// Analytics types
export type {
  ArticleMetrics,
  ReadingAnalytics,
  DeviceInfo,
  InteractionEvent,
  AuthorAnalytics,
  AuthorDashboardData,
  TimePeriod,
  DailyMetrics,
  TrafficSource,
  TopicMetrics,
  AnalyticsEvent
} from './Analytics';

// Recommendation types
export type {
  RecommendedArticle,
  RecommendationReason,
  RecommendationAlgorithm,
  RecommendationParams,
  RecommendationResult,
  UserInterestProfile,
  SimilarArticles,
  AuthorRecommendation,
  RecommendationExperiment,
  PersonalizationSettings
} from './Recommendation';

// Authentication types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserSession,
  ResetPasswordData,
  ConfirmResetPasswordData,
  ChangePasswordData,
  EmailVerificationData,
  AuthError,
  AuthErrorCode,
  AuthState,
  ContentPermissions,
  AuthSettings
} from './Auth'; 