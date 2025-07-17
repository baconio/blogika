/**
 * Пропсы компонента структурированных данных
 */
interface StructuredDataProps {
  readonly data: object;
}

/**
 * Компонент для вставки структурированных данных JSON-LD
 * Используется для SEO и лучшего понимания контента поисковиками
 * @param data - объект структурированных данных
 * @returns JSX элемент с JSON-LD скриптом
 */
export const StructuredData = ({ data }: StructuredDataProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  );
}; 