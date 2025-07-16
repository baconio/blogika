/**
 * Comment типы для блоговой платформы
 * Соответствует Strapi Content Type Comment
 */

import type { User } from './User';
import type { Article } from './Article';

/**
 * Статусы модерации комментариев
 */
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

/**
 * Базовый комментарий
 */
export interface Comment {
  readonly id: number;
  readonly documentId: string;
  readonly content: string;
  readonly author: User;
  readonly article: Pick<Article, 'id' | 'title' | 'slug'>;
  readonly parent?: Pick<Comment, 'id' | 'content' | 'author'>;
  readonly replies?: Comment[];
  readonly likes_count: number;
  readonly is_pinned: boolean;
  readonly is_moderated: boolean;
  readonly moderation_status: ModerationStatus;
  readonly ip_address?: string;
  readonly user_agent?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Данные для создания комментария
 */
export interface CommentInput {
  readonly content: string;
  readonly article: number; // ID статьи
  readonly parent?: number; // ID родительского комментария
}

/**
 * Данные для обновления комментария
 */
export interface CommentUpdate {
  readonly id: number;
  readonly content?: string;
  readonly moderation_status?: ModerationStatus;
  readonly is_pinned?: boolean;
}

/**
 * Параметры поиска комментариев
 */
export interface CommentSearchParams {
  readonly articleId?: number;
  readonly authorId?: number;
  readonly status?: ModerationStatus;
  readonly sort?: 'createdAt' | 'likes_count';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
  readonly onlyTopLevel?: boolean; // только комментарии верхнего уровня
}

/**
 * Действие с лайком комментария
 */
export interface CommentLikeAction {
  readonly commentId: number;
  readonly action: 'like' | 'unlike';
}

/**
 * Данные модерации комментария
 */
export interface CommentModerationData {
  readonly commentId: number;
  readonly status: ModerationStatus;
  readonly reason?: string;
}

/**
 * Статистика комментариев статьи
 */
export interface CommentStats {
  readonly total: number;
  readonly approved: number;
  readonly pending: number;
  readonly rejected: number;
}

/**
 * Дерево комментариев для отображения
 */
export interface CommentTree {
  readonly comment: Comment;
  readonly children: CommentTree[];
  readonly depth: number;
}

/**
 * Форма комментария для UI
 */
export interface CommentFormData {
  readonly content: string;
  readonly parentId?: number;
  readonly isReply: boolean;
}

/**
 * Настройки отображения комментариев
 */
export interface CommentDisplaySettings {
  readonly showPending: boolean;
  readonly showRejected: boolean;
  readonly maxDepth: number;
  readonly sortBy: 'newest' | 'oldest' | 'popular';
} 