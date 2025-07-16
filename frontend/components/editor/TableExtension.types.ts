/**
 * Типы для TableExtension компонента
 * Микромодуль для типизации таблиц в редакторе
 */

/**
 * Данные ячейки таблицы
 */
export interface TableCell {
  readonly content: string;
  readonly isHeader?: boolean;
  readonly align?: 'left' | 'center' | 'right';
  readonly colspan?: number;
  readonly rowspan?: number;
}

/**
 * Строка таблицы
 */
export interface TableRow {
  readonly cells: readonly TableCell[];
  readonly isHeader?: boolean;
}

/**
 * Структура таблицы
 */
export interface TableData {
  readonly rows: readonly TableRow[];
  readonly caption?: string;
  readonly hasHeader?: boolean;
}

/**
 * Настройки создания таблицы
 */
export interface TableCreationSettings {
  readonly rows: number;
  readonly columns: number;
  readonly includeHeader: boolean;
  readonly caption?: string;
}

/**
 * Пропсы для TableExtension
 */
export interface TableExtensionProps {
  readonly className?: string;
  readonly defaultRows?: number;
  readonly defaultColumns?: number;
  readonly maxRows?: number;
  readonly maxColumns?: number;
  readonly allowResizing?: boolean;
  readonly showBorders?: boolean;
}

/**
 * Пропсы для TableCreator
 */
export interface TableCreatorProps {
  readonly onCreateTable: (settings: TableCreationSettings) => void;
  readonly className?: string;
  readonly maxRows?: number;
  readonly maxColumns?: number;
}

/**
 * Пропсы для TableEditor
 */
export interface TableEditorProps {
  readonly tableData: TableData;
  readonly onTableChange: (data: TableData) => void;
  readonly className?: string;
  readonly allowResizing?: boolean;
  readonly showBorders?: boolean;
}

/**
 * Пропсы для TableToolbar
 */
export interface TableToolbarProps {
  readonly onAddRow: () => void;
  readonly onAddColumn: () => void;
  readonly onDeleteRow: () => void;
  readonly onDeleteColumn: () => void;
  readonly onToggleHeader: () => void;
  readonly className?: string;
  readonly disabled?: boolean;
}

/**
 * Действия с таблицей
 */
export type TableAction = 
  | 'addRowBefore'
  | 'addRowAfter'
  | 'addColumnBefore' 
  | 'addColumnAfter'
  | 'deleteRow'
  | 'deleteColumn'
  | 'toggleHeaderRow'
  | 'toggleHeaderColumn'
  | 'mergeCell'
  | 'splitCell';

/**
 * Позиция в таблице
 */
export interface TablePosition {
  readonly row: number;
  readonly column: number;
} 