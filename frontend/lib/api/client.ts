/**
 * Базовый API клиент для блоговой платформы
 * Интеграция с Strapi v5 backend
 */

/**
 * Конфигурация API
 */
export interface ApiConfig {
  readonly baseUrl: string;
  readonly timeout: number;
  readonly retries: number;
}

/**
 * Стандартный ответ Strapi API
 */
export interface StrapiResponse<T> {
  readonly data: T;
  readonly meta?: {
    readonly pagination?: {
      readonly page: number;
      readonly pageSize: number;
      readonly pageCount: number;
      readonly total: number;
    };
  };
}

/**
 * Ошибка API
 */
export interface ApiError {
  readonly status: number;
  readonly message: string;
  readonly details?: any;
}

/**
 * Параметры запроса
 */
export interface RequestParams {
  readonly populate?: string | string[];
  readonly filters?: Record<string, any>;
  readonly sort?: string | string[];
  readonly pagination?: {
    readonly page?: number;
    readonly pageSize?: number;
  };
}

/**
 * Базовый HTTP клиент
 */
class ApiClient {
  private readonly config: ApiConfig;
  private authToken: string | null = null;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Установка токена аутентификации
   * @param token - JWT токен
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Получение заголовков запроса
   * @returns объект заголовков
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Построение URL с параметрами
   * @param endpoint - эндпоинт API
   * @param params - параметры запроса
   * @returns полный URL
   */
  private buildUrl(endpoint: string, params?: RequestParams): string {
    const url = new URL(`${this.config.baseUrl}${endpoint}`);

    if (params) {
      if (params.populate) {
        const populate = Array.isArray(params.populate) 
          ? params.populate 
          : [params.populate];
        populate.forEach((field, index) => {
          url.searchParams.append(`populate[${index}]`, field);
        });
      }

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          url.searchParams.append(`filters[${key}]`, String(value));
        });
      }

      if (params.sort) {
        const sortFields = Array.isArray(params.sort) ? params.sort : [params.sort];
        sortFields.forEach(field => {
          url.searchParams.append('sort', field);
        });
      }

      if (params.pagination) {
        if (params.pagination.page) {
          url.searchParams.append('pagination[page]', String(params.pagination.page));
        }
        if (params.pagination.pageSize) {
          url.searchParams.append('pagination[pageSize]', String(params.pagination.pageSize));
        }
      }
    }

    return url.toString();
  }

  /**
   * Выполнение HTTP запроса
   * @param method - HTTP метод
   * @param endpoint - эндпоинт API
   * @param data - данные для отправки
   * @param params - параметры запроса
   * @returns результат запроса
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    params?: RequestParams
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(this.config.timeout),
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify({ data });
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Network Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * GET запрос
   * @param endpoint - эндпоинт API
   * @param params - параметры запроса
   * @returns результат запроса
   */
  async get<T>(endpoint: string, params?: RequestParams): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>('GET', endpoint, undefined, params);
  }

  /**
   * POST запрос
   * @param endpoint - эндпоинт API
   * @param data - данные для создания
   * @returns результат запроса
   */
  async post<T>(endpoint: string, data: any): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>('POST', endpoint, data);
  }

  /**
   * PUT запрос
   * @param endpoint - эндпоинт API
   * @param data - данные для обновления
   * @returns результат запроса
   */
  async put<T>(endpoint: string, data: any): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>('PUT', endpoint, data);
  }

  /**
   * DELETE запрос
   * @param endpoint - эндпоинт API
   * @returns результат запроса
   */
  async delete<T>(endpoint: string): Promise<StrapiResponse<T>> {
    return this.request<StrapiResponse<T>>('DELETE', endpoint);
  }
}

/**
 * Конфигурация по умолчанию
 */
const defaultConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
  timeout: 10000,
  retries: 3,
};

/**
 * Экземпляр API клиента
 */
export const apiClient = new ApiClient(defaultConfig);

/**
 * Типы для экспорта
 */
export type { StrapiResponse, ApiError, RequestParams }; 