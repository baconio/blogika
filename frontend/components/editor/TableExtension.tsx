'use client';

/**
 * TableExtension - компонент для создания и редактирования таблиц
 * Микромодуль с интерактивным редактором таблиц
 */

import { useState, useCallback } from 'react';
import type { 
  TableExtensionProps,
  TableCreatorProps,
  TableEditorProps,
  TableToolbarProps,
  TableData,
  TableCreationSettings,
  TableCell,
  TableRow
} from './TableExtension.types';

/**
 * Панель инструментов таблицы
 */
const TableToolbar: React.FC<TableToolbarProps> = ({
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
  onToggleHeader,
  className = '',
  disabled = false
}) => {
  const buttonClass = `
    px-3 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <div className={`table-toolbar flex items-center gap-2 mb-3 ${className}`}>
      <button
        type="button"
        onClick={onAddRow}
        disabled={disabled}
        className={buttonClass}
        title="Добавить строку"
      >
        ➕ Строка
      </button>
      
      <button
        type="button"
        onClick={onAddColumn}
        disabled={disabled}
        className={buttonClass}
        title="Добавить столбец"
      >
        ➕ Столбец
      </button>
      
      <div className="w-px h-4 bg-gray-300" />
      
      <button
        type="button"
        onClick={onDeleteRow}
        disabled={disabled}
        className={buttonClass}
        title="Удалить строку"
      >
        ➖ Строка
      </button>
      
      <button
        type="button"
        onClick={onDeleteColumn}
        disabled={disabled}
        className={buttonClass}
        title="Удалить столбец"
      >
        ➖ Столбец
      </button>
      
      <div className="w-px h-4 bg-gray-300" />
      
      <button
        type="button"
        onClick={onToggleHeader}
        disabled={disabled}
        className={buttonClass}
        title="Переключить заголовок"
      >
        📋 Заголовок
      </button>
    </div>
  );
};

/**
 * Создатель новой таблицы
 */
const TableCreator: React.FC<TableCreatorProps> = ({
  onCreateTable,
  className = '',
  maxRows = 10,
  maxColumns = 8
}) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [includeHeader, setIncludeHeader] = useState(true);
  const [caption, setCaption] = useState('');

  const handleCreate = useCallback(() => {
    onCreateTable({
      rows,
      columns,
      includeHeader,
      caption: caption.trim() || undefined
    });
  }, [rows, columns, includeHeader, caption, onCreateTable]);

  return (
    <div className={`table-creator space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Строки:
          </label>
          <input
            type="number"
            min="1"
            max={maxRows}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Столбцы:
          </label>
          <input
            type="number"
            min="1"
            max={maxColumns}
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeHeader}
            onChange={(e) => setIncludeHeader(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Включить заголовок</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Подпись таблицы (необязательно):
        </label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Подпись к таблице"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="button"
        onClick={handleCreate}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Создать таблицу {rows}×{columns}
      </button>
    </div>
  );
};

/**
 * Редактор таблицы
 */
const TableEditor: React.FC<TableEditorProps> = ({
  tableData,
  onTableChange,
  className = '',
  showBorders = true
}) => {
  const handleCellChange = useCallback((rowIndex: number, cellIndex: number, content: string) => {
    const newRows = tableData.rows.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        const newCells = row.cells.map((cell, cIdx) => {
          if (cIdx === cellIndex) {
            return { ...cell, content };
          }
          return cell;
        });
        return { ...row, cells: newCells };
      }
      return row;
    });

    onTableChange({ ...tableData, rows: newRows });
  }, [tableData, onTableChange]);

  const borderClass = showBorders ? 'border border-gray-300' : '';

  return (
    <div className={`table-editor ${className}`}>
      {tableData.caption && (
        <div className="text-center text-sm text-gray-600 mb-2 font-medium">
          {tableData.caption}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className={`w-full ${borderClass}`}>
          <tbody>
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.cells.map((cell, cellIndex) => {
                  const CellComponent = cell.isHeader || row.isHeader ? 'th' : 'td';
                  
                  return (
                    <CellComponent
                      key={cellIndex}
                      className={`
                        ${borderClass} p-2 min-w-24
                        ${cell.isHeader || row.isHeader ? 'bg-gray-50 font-medium' : ''}
                      `}
                      style={{ textAlign: cell.align || 'left' }}
                    >
                      <input
                        type="text"
                        value={cell.content}
                        onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                        className="w-full bg-transparent outline-none"
                        placeholder={cell.isHeader || row.isHeader ? 'Заголовок' : 'Содержимое'}
                      />
                    </CellComponent>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Создает пустую таблицу по настройкам
 */
const createEmptyTable = (settings: TableCreationSettings): TableData => {
  const rows: TableRow[] = [];
  
  for (let i = 0; i < settings.rows; i++) {
    const cells: TableCell[] = [];
    const isHeaderRow = settings.includeHeader && i === 0;
    
    for (let j = 0; j < settings.columns; j++) {
      cells.push({
        content: '',
        isHeader: isHeaderRow
      });
    }
    
    rows.push({
      cells,
      isHeader: isHeaderRow
    });
  }
  
  return {
    rows,
    caption: settings.caption,
    hasHeader: settings.includeHeader
  };
};

/**
 * Основной компонент расширения таблиц
 */
export const TableExtension: React.FC<TableExtensionProps> = ({
  className = '',
  defaultRows = 3,
  defaultColumns = 3,
  maxRows = 10,
  maxColumns = 8,
  allowResizing = true,
  showBorders = true
}) => {
  const [currentTable, setCurrentTable] = useState<TableData | null>(null);
  const [isCreating, setIsCreating] = useState(true);

  const handleCreateTable = useCallback((settings: TableCreationSettings) => {
    const newTable = createEmptyTable(settings);
    setCurrentTable(newTable);
    setIsCreating(false);
  }, []);

  const handleTableChange = useCallback((tableData: TableData) => {
    setCurrentTable(tableData);
  }, []);

  const handleStartNew = useCallback(() => {
    setCurrentTable(null);
    setIsCreating(true);
  }, []);

  const handleInsertTable = useCallback(() => {
    if (currentTable) {
      // В реальном проекте здесь будет интеграция с Tiptap редактором
      console.log('Вставка таблицы:', currentTable);
    }
  }, [currentTable]);

  return (
    <div className={`table-extension ${className}`}>
      {isCreating || !currentTable ? (
        <div>
          <h3 className="text-lg font-medium mb-4">Создать новую таблицу</h3>
          <TableCreator
            onCreateTable={handleCreateTable}
            maxRows={maxRows}
            maxColumns={maxColumns}
          />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Редактирование таблицы</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStartNew}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Новая таблица
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Вставить таблицу
              </button>
            </div>
          </div>

          {allowResizing && (
            <TableToolbar
              onAddRow={() => {/* TODO: реализовать */}}
              onAddColumn={() => {/* TODO: реализовать */}}
              onDeleteRow={() => {/* TODO: реализовать */}}
              onDeleteColumn={() => {/* TODO: реализовать */}}
              onToggleHeader={() => {/* TODO: реализовать */}}
            />
          )}

          <TableEditor
            tableData={currentTable}
            onTableChange={handleTableChange}
            showBorders={showBorders}
          />
        </div>
      )}
    </div>
  );
}; 