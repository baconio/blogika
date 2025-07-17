import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { FollowButton } from '@/components/social/FollowButton';
import { Author } from '@/types/Author';

/**
 * Пропсы компонента карточки автора
 */
interface AuthorCardProps {
  readonly author: Author;
  readonly currentUserId?: string;
  readonly variant?: 'default' | 'compact' | 'detailed';
  readonly showFollowButton?: boolean;
  readonly showStats?: boolean;
  readonly onFollow?: (authorId: string) => Promise<void>;
}

/**
 * Компонент карточки автора
 * Отображает основную информацию об авторе в компактном виде
 * @param author - данные автора
 * @param currentUserId - ID текущего пользователя
 * @param variant - вариант отображения карточки
 * @param showFollowButton - показывать ли кнопку подписки
 * @param showStats - показывать ли статистику
 * @param onFollow - обработчик подписки
 * @returns JSX элемент карточки автора
 */
export const AuthorCard = ({
  author,
  currentUserId,
  variant = 'default',
  showFollowButton = true,
  showStats = true,
  onFollow
}: AuthorCardProps) => {
  const isOwnProfile = currentUserId === author.user?.id;

  // Размеры в зависимости от варианта
  const variants = {
    compact: {
      card: 'p-4',
      avatar: 'md' as const,
      title: 'text-base',
      description: 'text-sm'
    },
    default: {
      card: 'p-6',
      avatar: 'lg' as const,
      title: 'text-lg',
      description: 'text-base'
    },
    detailed: {
      card: 'p-8',
      avatar: 'xl' as const,
      title: 'text-xl',
      description: 'text-base'
    }
  };

  const currentVariant = variants[variant];

  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200
      ${currentVariant.card}
    `}>
      <div className="flex items-start gap-4">
        {/* Аватар автора */}
        <Link href={`/author/${author.user?.username || author.id}`}>
          <Avatar
            src={author.avatar}
            alt={author.displayName}
            size={currentVariant.avatar}
            className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
          />
        </Link>

        {/* Основная информация */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-grow">
              {/* Имя и верификация */}
              <div className="flex items-center gap-2 mb-1">
                <Link 
                  href={`/author/${author.user?.username || author.id}`}
                  className={`font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate ${currentVariant.title}`}
                >
                  {author.displayName}
                </Link>
                
                {author.isVerified && (
                  <Badge variant="success" size="sm">
                    ✓ Верифицирован
                  </Badge>
                )}
              </div>

              {/* Username */}
              {author.user?.username && (
                <p className="text-sm text-gray-500 mb-2">
                  @{author.user.username}
                </p>
              )}
            </div>

            {/* Кнопка подписки */}
            {showFollowButton && !isOwnProfile && onFollow && (
              <FollowButton
                authorId={author.id}
                isFollowing={author.isFollowing}
                followersCount={author.subscriberCount}
                onToggleFollow={onFollow}
                size={variant === 'compact' ? 'sm' : 'md'}
              />
            )}
          </div>

          {/* Биография */}
          {author.bio && (
            <p className={`text-gray-700 mb-3 line-clamp-2 ${currentVariant.description}`}>
              {author.bio.replace(/<[^>]*>/g, '')} {/* Удаляем HTML теги */}
            </p>
          )}

          {/* Статистика */}
          {showStats && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <strong>{author.subscriberCount || 0}</strong> подписчиков
              </span>
              <span>
                <strong>{author.articlesCount || 0}</strong> статей
              </span>
              {author.totalEarnings && author.totalEarnings > 0 && (
                <span className="text-green-600">
                  <strong>{author.totalEarnings}₽</strong> заработано
                </span>
              )}
            </div>
          )}

          {/* Платная подписка */}
          {author.subscriptionPrice && author.subscriptionPrice > 0 && (
            <div className="mt-3 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 font-medium">
                    Платная подписка
                  </p>
                  <p className="text-sm text-gray-700">
                    {author.subscriptionPrice}₽ в месяц
                  </p>
                </div>
                <div className="text-lg">👑</div>
              </div>
            </div>
          )}

          {/* Социальные ссылки */}
          {author.socialLinks && author.socialLinks.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {author.socialLinks.slice(0, 3).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title={link.platform}
                >
                  {link.platform === 'twitter' && '🐦'}
                  {link.platform === 'telegram' && '✈️'}
                  {link.platform === 'youtube' && '📺'}
                  {link.platform === 'instagram' && '📷'}
                  {link.platform === 'linkedin' && '💼'}
                  {link.platform === 'github' && '⚡'}
                </a>
              ))}
              {author.socialLinks.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{author.socialLinks.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Уровень доступа */}
          {author.contentAccessLevel && author.contentAccessLevel !== 'free' && (
            <div className="mt-2">
              <Badge 
                variant={
                  author.contentAccessLevel === 'premium' ? 'warning' : 'info'
                }
                size="sm"
              >
                {author.contentAccessLevel === 'premium' ? '👑 Премиум' : '💎 Подписка'}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 