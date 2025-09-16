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
import { TableCardProps, TableData } from '../../../../types/BranchManagement/type';




const TableCard: React.FC<TableCardProps> = ({
  table,
  isEditing,
  isToggling,
  isClearing = false,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onToggleStatus,
  onToggleOccupation,
  onClearTable,
  onShowQRCode,
  onTableChange
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {isEditing ? (
          <div className={`flex-1 ${isRTL ? 'ml-2' : 'mr-2'}`}>
            <input
              type="text"
              value={table.menuTableName}
              onChange={(e) => onTableChange(table.id, { menuTableName: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              placeholder={t('BranchTableManagement.tableNamePlaceholder')}
            />
            <input
              type="number"
              value={table.capacity}
              onChange={(e) => onTableChange(table.id, { capacity: parseInt(e.target.value) || 1 })}
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
            <p className="text-sm text-left text-gray-500 dark:text-gray-400">
              {t('BranchTableManagement.capacityPlaceholder')}: {table.capacity}
            </p>
          </div>
        )}

        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isEditing ? (
            <>
              <button
                onClick={() => onUpdate(table.id, table)}
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
              <button
                onClick={() => onShowQRCode(table)}
                className="p-1 text-blue-600 hover:text-blue-800"
                title={t('BranchTableManagement.showQRCode')}
              >
                <QrCode className="h-3 w-3" />
              </button>
              <button
                onClick={onEdit}
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

      <div className="space-y-2">
        <div className={`flex items-center justify-between`}>
          <button
            onClick={() => onToggleStatus(table.id, !table.isActive)}
            disabled={isToggling}
            className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isToggling ? (
              <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
            ) : table.isActive ? (
              <ToggleRight className="h-4 w-4 text-green-500" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            )}
            <span className={`text-xs ${table.isActive ? 'text-green-600' : 'text-gray-500'}`}>
              {table.isActive ? t('BranchTableManagement.active') : t('BranchTableManagement.inactive')}
            </span>
          </button>
        </div>

        <div className={`flex items-center justify-between`}>
          <button
            onClick={() => onToggleOccupation(table.id, !table.isOccupied)}
            disabled={!table.isActive || isToggling}
            className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {table.isOccupied ? (
              <UserX className="h-4 w-4 text-red-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-500" />
            )}
            <span className={`text-xs ${table.isOccupied ? 'text-red-600' : 'text-green-600'}`}>
              {table.isOccupied ? t('BranchTableManagement.occupied') : t('BranchTableManagement.available')}
            </span>
          </button>
        </div>

        {/* Clear Table Button - New Addition */}
        <div className={`flex items-center justify-center pt-2 border-t border-gray-200 dark:border-gray-700`}>
          <button
            onClick={() => onClearTable(table.id)}
            disabled={!table.isActive || isClearing || isToggling}
            className={`w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              table.isOccupied 
                ? 'bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-300' 
                : 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300'
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
      </div>
    </div>
  );
};

export default TableCard;