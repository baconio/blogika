import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FollowButton } from '@/components/social/FollowButton';
import { SubscribeButton } from '@/components/social/SubscribeButton';
import { Author } from '@/types/Author';
import { formatDate } from '@/lib/utils/formatting';

/**
 * Пропсы компонента профиля автора
 */
interface AuthorProfileProps {
  readonly author: Author;
  readonly currentUserId?: string;
  readonly onFollow?: (authorId: string) => Promise<void>;
  readonly onSubscribe?: (authorId: string, plan: string) => Promise<void>;
  readonly onEditProfile?: () => void;
  readonly onManageSubscription?: (authorId: string) => void;
}

/**
 * Компонент полного профиля автора
 * Отображает детальную информацию об авторе с обложкой
 * @param author - данные автора
 * @param currentUserId - ID текущего пользователя
 * @param onFollow - обработчик подписки
 * @param onSubscribe - обработчик платной подписки
 * @param onEditProfile - обработчик редактирования профиля
 * @param onManageSubscription - обработчик управления подпиской
 * @returns JSX элемент полного профиля автора
 */
export const AuthorProfile = ({
  author,
  currentUserId,
  onFollow,
  onSubscribe,
  onEditProfile,
  onManageSubscription
}: AuthorProfileProps) => {
  const isOwnProfile = currentUserId === author.user?.id;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Обложка профиля */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        {author.coverImage && (
          <img
            src={author.coverImage}
            alt="Обложка профиля"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Градиент для лучшей читаемости */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        {/* Аватар поверх обложки */}
        <div className="absolute -bottom-16 left-6 md:left-8">
          <Avatar
            src={author.avatar}
            alt={author.displayName}
            size="2xl"
            className="border-4 border-white shadow-lg"
          />
        </div>

        {/* Кнопки действий */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwnProfile ? (
            <Button
              onClick={onEditProfile}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm border-white text-gray-700"
            >
              Редактировать
            </Button>
          ) : (
            <div className="flex gap-2">
              {onFollow && (
                <FollowButton
                  authorId={author.id}
                  isFollowing={author.isFollowing}
                  followersCount={author.subscriberCount}
                  onToggleFollow={onFollow}
                  size="sm"
                />
              )}
              
              {author.subscriptionPrice && author.subscriptionPrice > 0 && onSubscribe && (
                <SubscribeButton
                  authorId={author.id}
                  isSubscribed={author.isSubscribed}
                  monthlyPrice={author.subscriptionPrice}
                  onSubscribe={onSubscribe}
                  onManageSubscription={onManageSubscription}
                  size="sm"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Основная информация */}
      <div className="pt-20 px-6 md:px-8 pb-6">
        {/* Имя и верификация */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {author.displayName}
          </h1>
          
          {author.isVerified && (
            <Badge variant="success">
              ✓ Верифицирован
            </Badge>
          )}
        </div>

        {/* Username */}
        {author.user?.username && (
          <p className="text-gray-600 mb-4">
            @{author.user.username}
          </p>
        )}

        {/* Статистика */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div>
            <span className="font-semibold text-gray-900">
              {author.subscriberCount || 0}
            </span>
            <span className="text-gray-600 ml-1">подписчиков</span>
          </div>
          
          <div>
            <span className="font-semibold text-gray-900">
              {author.articlesCount || 0}
            </span>
            <span className="text-gray-600 ml-1">статей</span>
          </div>

          {author.totalEarnings && author.totalEarnings > 0 && (
            <div>
              <span className="font-semibold text-green-600">
                {author.totalEarnings}₽
              </span>
              <span className="text-gray-600 ml-1">заработано</span>
            </div>
          )}

          {author.user?.createdAt && (
            <div>
              <span className="text-gray-600">
                Присоединился {formatDate(author.user.createdAt)}
              </span>
            </div>
          )}
        </div>

        {/* Биография */}
        {author.bio && (
          <div className="mb-6">
            <div 
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: author.bio }}
            />
          </div>
        )}

        {/* Социальные ссылки */}
        {author.socialLinks && author.socialLinks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Социальные сети
            </h3>
            <div className="flex flex-wrap gap-3">
              {author.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  <span>
                    {link.platform === 'twitter' && '🐦'}
                    {link.platform === 'telegram' && '✈️'}
                    {link.platform === 'youtube' && '📺'}
                    {link.platform === 'instagram' && '📷'}
                    {link.platform === 'linkedin' && '💼'}
                    {link.platform === 'github' && '⚡'}
                  </span>
                  <span className="capitalize">{link.platform}</span>
                  {link.handle && (
                    <span className="text-gray-500">@{link.handle}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Информация о подписке */}
        {author.subscriptionPrice && author.subscriptionPrice > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  💎 Премиум подписка
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Получите доступ к эксклюзивному контенту от {author.displayName}
                </p>
                <p className="text-lg font-semibold text-purple-600">
                  {author.subscriptionPrice}₽ в месяц
                </p>
              </div>
              
              {!isOwnProfile && onSubscribe && (
                <SubscribeButton
                  authorId={author.id}
                  isSubscribed={author.isSubscribed}
                  monthlyPrice={author.subscriptionPrice}
                  onSubscribe={onSubscribe}
                  onManageSubscription={onManageSubscription}
                />
              )}
            </div>
          </div>
        )}

        {/* Уровень доступа к контенту */}
        {author.contentAccessLevel && author.contentAccessLevel !== 'free' && (
          <div className="flex items-center gap-2">
            <Badge 
              variant={
                author.contentAccessLevel === 'premium' ? 'warning' : 'info'
              }
            >
              {author.contentAccessLevel === 'premium' ? '👑 Премиум контент' : '💎 Подписка обязательна'}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}; 