/**
 * React хук для работы с Redis кэшем
 * @description Интеграция кэширования с React Query
 */
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cache, type CacheOptions } from '@/lib/cache/redis';

/**
 * Параметры хука useCache
 */
export interface UseCacheParams<T> {
  /** Ключ кэша */
  readonly key: string;
  /** Функция для получения данных при отсутствии в кэше */
  readonly fetcher?: () => Promise<T>;
  /** Настройки кэширования */
  readonly cacheOptions?: CacheOptions;
  /** Включен ли автоматический кэш */
  readonly enabled?: boolean;
  /** Время обновления в миллисекундах */
  readonly staleTime?: number;
}

/**
 * Результат хука useCache
 */
export interface UseCacheResult<T> {
  /** Данные из кэша */
  readonly data: T | null;
  /** Загружается ли */
  readonly isLoading: boolean;
  /** Ошибка */
  readonly error: Error | null;
  /** Установить данные в кэш */
  readonly setCache: (value: T, options?: CacheOptions) => Promise<void>;
  /** Удалить из кэша */
  readonly invalidate: () => Promise<void>;
  /** Проверить наличие в кэше */
  readonly exists: () => Promise<boolean>;
  /** Получить TTL */
  readonly getTTL: () => Promise<number>;
}

/**
 * Хук для работы с кэшем
 */
export const useCache = <T>(params: UseCacheParams<T>): UseCacheResult<T> => {
  const {
    key,
    fetcher,
    cacheOptions,
    enabled = true,
    staleTime = 5 * 60 * 1000 // 5 минут
  } = params;

  const queryClient = useQueryClient();

  // React Query для данных из кэша
  const { data, isLoading, error } = useQuery({
    queryKey: ['cache', key],
    queryFn: async () => {
      // Сначала пытаемся получить из Redis
      const cachedData = await cache.articles.get(key);
      if (cachedData) {
        return cachedData;
      }

      // Если нет в кэше и есть fetcher, получаем данные
      if (fetcher) {
        const freshData = await fetcher();
        // Сохраняем в кэш
        await cache.articles.set(key, freshData);
        return freshData;
      }

      return null;
    },
    enabled,
    staleTime,
    retry: 1
  });

  // Мутация для установки кэша
  const setCacheMutation = useMutation({
    mutationFn: async ({ value, options }: { value: T; options?: CacheOptions }) => {
      await cache.articles.set(key, value);
      // Обновляем React Query кэш
      queryClient.setQueryData(['cache', key], value);
    }
  });

  // Мутация для инвалидации кэша
  const invalidateMutation = useMutation({
    mutationFn: async () => {
      await cache.articles.invalidate(key);
      // Инвалидируем React Query кэш
      queryClient.invalidateQueries({ queryKey: ['cache', key] });
    }
  });

  const setCache = async (value: T, options?: CacheOptions): Promise<void> => {
    await setCacheMutation.mutateAsync({ value, options });
  };

  const invalidate = async (): Promise<void> => {
    await invalidateMutation.mutateAsync();
  };

  const exists = async (): Promise<boolean> => {
    // Проверяем в Redis кэше
    // Note: В продакшене это будет работать только на сервере
    try {
      const response = await fetch('/api/cache/exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      const result = await response.json();
      return result.exists;
    } catch {
      return false;
    }
  };

  const getTTL = async (): Promise<number> => {
    try {
      const response = await fetch('/api/cache/ttl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      const result = await response.json();
      return result.ttl;
    } catch {
      return -1;
    }
  };

  return {
    data: data || null,
    isLoading,
    error: error as Error | null,
    setCache,
    invalidate,
    exists,
    getTTL
  };
};

/**
 * Хук для кэширования статей
 */
export const useArticleCache = (articleId: string) => {
  return useCache({
    key: `article:${articleId}`,
    cacheOptions: {
      ttl: 1800, // 30 минут
      tags: ['articles', `article:${articleId}`]
    }
  });
};

/**
 * Хук для кэширования поисковых запросов
 */
export const useSearchCache = (query: string) => {
  return useCache({
    key: `search:${query}`,
    cacheOptions: {
      ttl: 600, // 10 минут
      tags: ['search']
    },
    staleTime: 10 * 60 * 1000 // 10 минут
  });
};

/**
 * Хук для кэширования пользовательских данных
 */
export const useUserCache = (userId: string) => {
  return useCache({
    key: `user:${userId}`,
    cacheOptions: {
      ttl: 3600, // 1 час
      tags: ['users', `user:${userId}`]
    }
  });
};

/**
 * Хук для массовой инвалидации кэша по тегам
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateByTags = async (tags: readonly string[]): Promise<void> => {
    try {
      // Инвалидируем в Redis
      const response = await fetch('/api/cache/invalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags })
      });

      if (response.ok) {
        // Инвалидируем соответствующие React Query кэши
        tags.forEach(tag => {
          queryClient.invalidateQueries({ 
            predicate: (query) => {
              return query.queryKey.includes(tag);
            }
          });
        });
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  };

  const invalidateAll = async (): Promise<void> => {
    try {
      await fetch('/api/cache/clear', { method: 'POST' });
      queryClient.clear();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  };

  return {
    invalidateByTags,
    invalidateAll
  };
}; 