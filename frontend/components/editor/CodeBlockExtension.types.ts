/**
 * Типы для CodeBlockExtension компонента
 * Микромодуль для типизации блоков кода в редакторе
 */

/**
 * Поддерживаемые языки программирования
 */
export type SupportedLanguage = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'html'
  | 'css'
  | 'json'
  | 'xml'
  | 'bash'
  | 'sql'
  | 'php'
  | 'plaintext';

/**
 * Информация о языке программирования
 */
export interface LanguageInfo {
  readonly name: string;
  readonly label: string;
  readonly aliases: readonly string[];
  readonly extensions: readonly string[];
}

/**
 * Настройки блока кода
 */
export interface CodeBlockSettings {
  readonly language: SupportedLanguage;
  readonly showLineNumbers?: boolean;
  readonly highlightLines?: readonly number[];
  readonly filename?: string;
  readonly caption?: string;
}

/**
 * Пропсы для CodeBlockExtension
 */
export interface CodeBlockExtensionProps {
  readonly className?: string;
  readonly defaultLanguage?: SupportedLanguage;
  readonly showLanguageSelector?: boolean;
  readonly showLineNumbers?: boolean;
  readonly allowFilename?: boolean;
  readonly theme?: 'light' | 'dark' | 'auto';
}

/**
 * Пропсы для LanguageSelector
 */
export interface LanguageSelectorProps {
  readonly selectedLanguage: SupportedLanguage;
  readonly onLanguageChange: (language: SupportedLanguage) => void;
  readonly className?: string;
  readonly disabled?: boolean;
}

/**
 * Пропсы для CodeBlock
 */
export interface CodeBlockProps {
  readonly code: string;
  readonly language: SupportedLanguage;
  readonly showLineNumbers?: boolean;
  readonly highlightLines?: readonly number[];
  readonly filename?: string;
  readonly className?: string;
  readonly editable?: boolean;
  readonly onCodeChange?: (code: string) => void;
}

/**
 * Конфигурация подсветки синтаксиса
 */
export interface SyntaxHighlightConfig {
  readonly theme: 'light' | 'dark' | 'auto';
  readonly tabSize: number;
  readonly wrapLines: boolean;
  readonly showInvisibles: boolean;
} 