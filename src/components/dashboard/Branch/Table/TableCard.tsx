import React from 'react';
import {
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UserX,
  UserCheck,
  Save,
  XCircle,
  QrCode,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { TableCardProps } from '../../../../types/BranchManagement/type';

const TableCard: React.FC<TableCardProps> = ({
  table,
  isEditing = false,
  isToggling = false,
  isClearing = false,
  categoryColor,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onToggleStatus,
  onToggleOccupation,
  onClearTable,
  onShowQRCode,
  onDownload,
  onTableChange
}) => {
  const { t, isRTL } = useLanguage();



  // Determine if this is a simple card (Table Management) or full-featured card (Branch Tables)
  const isSimpleCard = !onUpdate && !onCancelEdit && !onTableChange;

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
      style={categoryColor ? { borderTopColor: categoryColor, borderTopWidth: '4px' } : undefined}
    >
      {/* Header: Name & Actions */}
      <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {isEditing && !isSimpleCard ? (
          <div className={`flex-1 ${isRTL ? 'ml-2' : 'mr-2'}`}>
            <input
              type="text"
              value={table.menuTableName}
              onChange={(e) => onTableChange?.(table.id, { menuTableName: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder={t('BranchTableManagement.tableNamePlaceholder')}
            />
            <input
              type="number"
              value={table.capacity}
              onChange={(e) => onTableChange?.(table.id, { capacity: parseInt(e.target.value) || 1 })}
              min="1"
              className="w-full mt-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder={t('BranchTableManagement.capacityPlaceholder')}
            />
          </div>
        ) : (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {table.menuTableName}
            </h4>
            <p className="text-xs text-left text-gray-500 dark:text-gray-400 mt-1">
              {t('BranchTableManagement.capacityPlaceholder')}: {table.capacity}
            </p>
          </div>
        )}

        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isEditing && !isSimpleCard ? (
            <>
              <button
                onClick={() => onUpdate?.(table.id, table)}
                className="p-1 text-green-600 hover:text-green-800"
                title={t('BranchTableManagement.save')}
              >
                <Save className="h-3 w-3" />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1 text-gray-600 hover:text-gray-800"
                title={t('BranchTableManagement.cancel')}
              >
                <XCircle className="h-3 w-3" />
              </button>
            </>
          ) : (
            <>
              {(onShowQRCode || onDownload) && (
                <button
                  onClick={() => {
                    if (onShowQRCode) onShowQRCode(table);
                    if (onDownload) onDownload(table);
                  }}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title={t('BranchTableManagement.showQRCode')}
                >
                  <QrCode className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => onEdit(table)}
                className="p-1 text-yellow-600 hover:text-yellow-800"
                title={t('BranchTableManagement.edit')}
              >
                <Edit className="h-3 w-3" />
              </button>
              <button
                onClick={() => onDelete(table.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title={t('BranchTableManagement.delete')}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Indicators */}
      <div className={`flex items-center gap-4 mt-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        
        {/* Active/Inactive Indicator */}
        <div 
          onClick={() => onToggleStatus(table.id, !table.isActive)}
          className={`flex items-center gap-2 cursor-pointer select-none transition-opacity hover:opacity-80 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isToggling ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          ) : table.isActive ? (
            <ToggleRight className="h-5 w-5 text-green-500" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-gray-400" />
          )}
          <span className={`text-sm font-medium ${table.isActive ? 'text-green-600' : 'text-gray-500'}`}>
            {table.isActive ? t('BranchTableManagement.active') : t('BranchTableManagement.inactive')}
          </span>
        </div>

        {/* Occupied/Available Indicator */}
        {onToggleOccupation && (
          <div 
            onClick={() => onToggleOccupation(table.id, !table.isOccupied)}
            className={`flex items-center gap-2 cursor-pointer select-none transition-opacity hover:opacity-80 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {table.isOccupied ? (
              <UserX className="h-5 w-5 text-red-500" />
            ) : (
              <UserCheck className="h-5 w-5 text-green-500" />
            )}
            <span className={`text-sm font-medium ${table.isOccupied ? 'text-red-600' : 'text-green-600'}`}>
              {table.isOccupied ? t('BranchTableManagement.occupied') : t('BranchTableManagement.available')}
            </span>
          </div>
        )}
      </div>

      {/* Clear Table Button (Main Action) */}
      {onClearTable && (
        <div className={`pt-3 border-t border-gray-100 dark:border-gray-700`}>
          <button
            onClick={() => onClearTable(table.id)}
            disabled={!table.isActive || isClearing || isToggling}
            className={`w-full px-3 py-2 text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              table.isOccupied
                ? 'bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 dark:text-orange-400'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400'
            } flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            title={table.isOccupied ? t('BranchTableManagement.clearTable') : t('BranchTableManagement.refreshTable')}
          >
            {isClearing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {isClearing
              ? t('BranchTableManagement.clearing')
              : table.isOccupied
                ? t('BranchTableManagement.clearTable')
                : t('BranchTableManagement.refreshTable')
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default TableCard;