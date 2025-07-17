import { Article } from '@/types/Article';
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';
import { ReadingProgress } from './ReadingProgress';
import { ShareButtons } from './ShareButtons';
import { RelatedArticles } from './RelatedArticles';

/**
 * Пропсы компонента отображения статьи
 */
interface ArticleViewProps {
  readonly article: Article;
  readonly relatedArticles?: Article[];
  readonly showRelated?: boolean;
  readonly showProgress?: boolean;
  readonly showShare?: boolean;
}

/**
 * Основной компонент для отображения полной статьи
 * Включает заголовок, контент, прогресс чтения и связанные статьи
 * @param article - данные статьи
 * @param relatedArticles - связанные статьи
 * @param showRelated - показывать ли связанные статьи
 * @param showProgress - показывать ли прогресс чтения
 * @param showShare - показывать ли кнопки шаринга
 * @returns JSX элемент полного отображения статьи
 */
export const ArticleView = ({
  article,
  relatedArticles = [],
  showRelated = true,
  showProgress = true,
  showShare = true
}: ArticleViewProps) => {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Прогресс чтения */}
      {showProgress && <ReadingProgress />}
      
      {/* Заголовок статьи */}
      <ArticleHeader article={article} />
      
      {/* Основной контент */}
      <ArticleContent content={article.content} />
      
      {/* Кнопки шаринга */}
      {showShare && (
        <div className="my-8 flex justify-center">
          <ShareButtons 
            url={`/article/${article.slug}`}
            title={article.title}
          />
        </div>
      )}
      
      {/* Связанные статьи */}
      {showRelated && relatedArticles.length > 0 && (
        <div className="mt-12">
          <RelatedArticles articles={relatedArticles} />
        </div>
      )}
    </article>
  );
}; 