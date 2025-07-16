/**
 * QueryProvider - провайдер React Query для блоговой платформы
 * Client Component для управления кэшированием и серверным состоянием
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Конфигурация React Query для блога
 */
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Кэширование на 5 минут для большинства запросов
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        // Повторные попытки для надежности
        retry: (failureCount, error: any) => {
          // Не повторяем 404 ошибки
          if (error?.status === 404) return false;
          // Максимум 3 попытки для других ошибок
          return failureCount < 3;
        },
        // Рефетч при фокусе окна
        refetchOnWindowFocus: false,
        // Рефетч при переподключении к сети
        refetchOnReconnect: true,
      },
      mutations: {
        // Повторные попытки для мутаций
        retry: (failureCount, error: any) => {
          // Не повторяем клиентские ошибки (4xx)
          if (error?.status >= 400 && error?.status < 500) return false;
          return failureCount < 2;
        },
        // Глобальные обработчики для мутаций
        onError: (error) => {
          console.error('Mutation error:', error);
          // Здесь можно добавить глобальную обработку ошибок
          // например, показ toast уведомлений
        },
      },
    },
  });
};

/**
 * Пропсы QueryProvider
 */
interface QueryProviderProps {
  readonly children: React.ReactNode;
}

/**
 * QueryProvider компонент
 * @param children - дочерние компоненты
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  // Создаем QueryClient один раз для избежания пересоздания
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools только в development режиме */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}; 