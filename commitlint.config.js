/**
 * Конфигурация commitlint для проверки формата коммитов
 * Следует Conventional Commits стандарту
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Тип коммита должен быть одним из указанных
    'type-enum': [
      2,
      'always',
      [
        'feat',     // новая функциональность
        'fix',      // исправление бага
        'docs',     // документация
        'style',    // форматирование, отсутствующие точки с запятой и т.д.
        'refactor', // рефакторинг кода
        'perf',     // улучшение производительности
        'test',     // добавление тестов
        'build',    // изменения системы сборки или внешних зависимостей
        'ci',       // изменения файлов и скриптов CI
        'chore',    // другие изменения, которые не модифицируют src или test файлы
        'revert'    // отмена предыдущего коммита
      ]
    ],
    // Длина заголовка
    'header-max-length': [2, 'always', 72],
    // Заголовок не может быть пустым
    'subject-empty': [2, 'never'],
    // Заголовок должен начинаться со строчной буквы
    'subject-case': [2, 'always', 'lower-case'],
    // Заголовок не должен заканчиваться точкой
    'subject-full-stop': [2, 'never', '.'],
    // Тело коммита должно начинаться с пустой строки
    'body-leading-blank': [1, 'always'],
    // Максимальная длина строки в теле коммита
    'body-max-line-length': [1, 'always', 100],
    // Footer должен начинаться с пустой строки
    'footer-leading-blank': [1, 'always']
  }
}; 