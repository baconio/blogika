'use client';

/**
 * CodeBlockExtension - компонент для блоков кода в редакторе
 * Микромодуль с подсветкой синтаксиса и выбором языка
 */

import { useState, useCallback } from 'react';
import type { 
  CodeBlockExtensionProps, 
  LanguageSelectorProps,
  CodeBlockProps,
  SupportedLanguage,
  LanguageInfo
} from './CodeBlockExtension.types';

/**
 * Конфигурация поддерживаемых языков
 */
const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageInfo> = {
  javascript: { name: 'javascript', label: 'JavaScript', aliases: ['js'], extensions: ['js'] },
  typescript: { name: 'typescript', label: 'TypeScript', aliases: ['ts'], extensions: ['ts'] },
  python: { name: 'python', label: 'Python', aliases: ['py'], extensions: ['py'] },
  java: { name: 'java', label: 'Java', aliases: [], extensions: ['java'] },
  cpp: { name: 'cpp', label: 'C++', aliases: ['c++'], extensions: ['cpp', 'cxx'] },
  html: { name: 'html', label: 'HTML', aliases: [], extensions: ['html', 'htm'] },
  css: { name: 'css', label: 'CSS', aliases: [], extensions: ['css'] },
  json: { name: 'json', label: 'JSON', aliases: [], extensions: ['json'] },
  xml: { name: 'xml', label: 'XML', aliases: [], extensions: ['xml'] },
  bash: { name: 'bash', label: 'Bash', aliases: ['sh'], extensions: ['sh', 'bash'] },
  sql: { name: 'sql', label: 'SQL', aliases: [], extensions: ['sql'] },
  php: { name: 'php', label: 'PHP', aliases: [], extensions: ['php'] },
  plaintext: { name: 'plaintext', label: 'Обычный текст', aliases: ['text'], extensions: ['txt'] }
};

/**
 * Селектор языка программирования
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = useCallback((language: SupportedLanguage) => {
    onLanguageChange(language);
    setIsOpen(false);
  }, [onLanguageChange]);

  const selectedLangInfo = SUPPORTED_LANGUAGES[selectedLanguage];

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          px-3 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded
          hover:bg-gray-200 transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {selectedLangInfo.label} ▼
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
          {Object.entries(SUPPORTED_LANGUAGES).map(([key, lang]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleLanguageSelect(key as SupportedLanguage)}
              className={`
                w-full px-3 py-2 text-left text-sm hover:bg-gray-50
                ${key === selectedLanguage ? 'bg-blue-50 text-blue-700' : ''}
              `}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Компонент блока кода с подсветкой
 */
const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  showLineNumbers = false,
  filename,
  className = '',
  editable = false,
  onCodeChange
}) => {
  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCodeChange?.(e.target.value);
  }, [onCodeChange]);

  const lines = code.split('\n');

  return (
    <div className={`code-block bg-gray-900 text-gray-100 rounded-lg overflow-hidden ${className}`}>
      {filename && (
        <div className="bg-gray-800 px-4 py-2 text-sm font-mono border-b border-gray-700">
          📄 {filename}
        </div>
      )}
      
      <div className="relative">
        {showLineNumbers && (
          <div className="absolute left-0 top-0 bottom-0 bg-gray-800 px-3 py-4 text-xs text-gray-400 font-mono select-none">
            {lines.map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>
        )}
        
        <div className={`${showLineNumbers ? 'ml-12' : ''}`}>
          {editable ? (
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="w-full h-full bg-transparent text-gray-100 font-mono text-sm leading-6 p-4 resize-none outline-none"
              style={{ minHeight: '200px' }}
              spellCheck={false}
            />
          ) : (
            <pre className="p-4 overflow-x-auto">
              <code className={`language-${language} text-sm leading-6`}>
                {code}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Основной компонент расширения для блоков кода
 */
export const CodeBlockExtension: React.FC<CodeBlockExtensionProps> = ({
  className = '',
  defaultLanguage = 'javascript',
  showLanguageSelector = true,
  showLineNumbers = true,
  allowFilename = true,
  theme = 'dark'
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(defaultLanguage);
  const [code, setCode] = useState('// Введите ваш код здесь\nconsole.log("Hello, World!");');
  const [filename, setFilename] = useState('');

  const handleInsertCodeBlock = useCallback(() => {
    // В реальном проекте здесь будет интеграция с Tiptap редактором
    console.log('Вставка блока кода:', {
      language: selectedLanguage,
      code,
      filename: filename || undefined,
      showLineNumbers
    });
  }, [selectedLanguage, code, filename, showLineNumbers]);

  return (
    <div className={`code-block-extension ${className}`}>
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          {showLanguageSelector && (
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          )}
          
          {allowFilename && (
            <input
              type="text"
              placeholder="Имя файла (необязательно)"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="px-3 py-1 text-xs border border-gray-300 rounded"
            />
          )}
          
          <button
            type="button"
            onClick={handleInsertCodeBlock}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Вставить код
          </button>
        </div>
      </div>

      <CodeBlock
        code={code}
        language={selectedLanguage}
        showLineNumbers={showLineNumbers}
        filename={filename || undefined}
        editable={true}
        onCodeChange={setCode}
      />
    </div>
  );
}; 