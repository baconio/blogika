/**
 * Статистика автора
 */
interface AuthorStatsData {
  readonly articlesCount: number;
  readonly subscribersCount: number;
  readonly totalViews: number;
  readonly totalLikes: number;
  readonly totalComments: number;
  readonly totalShares: number;
  readonly totalEarnings: number;
  readonly averageReadingTime: number;
  readonly popularArticles: Array<{
    id: string;
    title: string;
    views: number;
  }>;
  readonly monthlyStats?: Array<{
    month: string;
    articles: number;
    views: number;
    earnings: number;
  }>;
}

/**
 * Пропсы компонента статистики автора
 */
interface AuthorStatsProps {
  readonly authorId: string;
  readonly stats: AuthorStatsData;
  readonly isOwner?: boolean;
  readonly timeframe?: '7d' | '30d' | '90d' | '1y' | 'all';
  readonly onTimeframeChange?: (timeframe: string) => void;
}

/**
 * Компонент статистики автора
 * Отображает детальную аналитику для автора
 * @param authorId - ID автора
 * @param stats - данные статистики
 * @param isOwner - является ли текущий пользователь владельцем
 * @param timeframe - временной период
 * @param onTimeframeChange - обработчик изменения периода
 * @returns JSX элемент статистики автора
 */
export const AuthorStats = ({
  authorId,
  stats,
  isOwner = false,
  timeframe = '30d',
  onTimeframeChange
}: AuthorStatsProps) => {
  // Форматирование чисел
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Временные периоды
  const timeframes = [
    { key: '7d', label: '7 дней' },
    { key: '30d', label: '30 дней' },
    { key: '90d', label: '3 месяца' },
    { key: '1y', label: '1 год' },
    { key: 'all', label: 'Все время' }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок и фильтр */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">
          📊 Статистика автора
        </h2>

        {/* Фильтр по времени */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {timeframes.map((tf) => (
            <button
              key={tf.key}
              onClick={() => onTimeframeChange?.(tf.key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeframe === tf.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📝</span>
            <span className="text-sm font-medium text-gray-600">Статьи</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.articlesCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            опубликовано
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👥</span>
            <span className="text-sm font-medium text-gray-600">Подписчики</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.subscribersCount)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            человек
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👁️</span>
            <span className="text-sm font-medium text-gray-600">Просмотры</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.totalViews)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            всего
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">❤️</span>
            <span className="text-sm font-medium text-gray-600">Лайки</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.totalLikes)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            получено
          </div>
        </div>
      </div>

      {/* Дополнительные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💬</span>
            <span className="text-sm font-medium text-gray-600">Комментарии</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatNumber(stats.totalComments)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📤</span>
            <span className="text-sm font-medium text-gray-600">Репосты</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatNumber(stats.totalShares)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⏱️</span>
            <span className="text-sm font-medium text-gray-600">Время чтения</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {stats.averageReadingTime} мин
          </div>
          <div className="text-xs text-gray-500 mt-1">
            в среднем
          </div>
        </div>
      </div>

      {/* Заработок (только для владельца) */}
      {isOwner && stats.totalEarnings > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💰</span>
            <span className="text-sm font-medium text-green-700">Доходы</span>
          </div>
          <div className="text-3xl font-bold text-green-800">
            {stats.totalEarnings.toLocaleString('ru-RU')} ₽
          </div>
          <div className="text-sm text-green-600 mt-1">
            заработано за {timeframe === 'all' ? 'все время' : timeframes.find(t => t.key === timeframe)?.label}
          </div>
        </div>
      )}

      {/* Популярные статьи */}
      {stats.popularArticles && stats.popularArticles.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔥 Популярные статьи
          </h3>
          <div className="space-y-3">
            {stats.popularArticles.slice(0, 5).map((article, index) => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {article.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>👁️</span>
                  <span>{formatNumber(article.views)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* График по месяцам (упрощенный) */}
      {stats.monthlyStats && stats.monthlyStats.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Динамика по месяцам
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-600">Месяц</th>
                  <th className="text-right py-2 font-medium text-gray-600">Статьи</th>
                  <th className="text-right py-2 font-medium text-gray-600">Просмотры</th>
                  {isOwner && (
                    <th className="text-right py-2 font-medium text-gray-600">Доходы</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {stats.monthlyStats.map((month, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-gray-900">{month.month}</td>
                    <td className="py-2 text-right text-gray-700">{month.articles}</td>
                    <td className="py-2 text-right text-gray-700">{formatNumber(month.views)}</td>
                    {isOwner && (
                      <td className="py-2 text-right text-green-600 font-medium">
                        {month.earnings.toLocaleString('ru-RU')} ₽
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}; 