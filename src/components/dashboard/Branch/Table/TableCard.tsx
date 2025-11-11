import React from 'react';
import {
  Edit,
  Trash2,
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

// Modern Toggle Switch Component
const ToggleSwitch: React.FC<{
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ isOn, onToggle, disabled = false, loading = false, label, size = 'md' }) => {
  const { isRTL } = useLanguage();
  
  const sizes = {
    sm: { switch: 'w-10 h-5', knob: 'w-4 h-4', translateX: 20 },
    md: { switch: 'w-12 h-6', knob: 'w-5 h-5', translateX: 24 },
    lg: { switch: 'w-14 h-7', knob: 'w-6 h-6', translateX: 28 }
  };

  const currentSize = sizes[size];

  // Calculate transform for knob based on state and direction
  const getKnobTransform = () => {
    if (isRTL) {
      // RTL: flip the whole switch, so active means knob on left
      return isOn 
        ? `scaleX(-1) translateX(${currentSize.translateX}px)` 
        : 'scaleX(-1) translateX(2px)';
    } else {
      // LTR: normal behavior
      return isOn 
        ? `translateX(${currentSize.translateX}px)` 
        : 'translateX(2px)';
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled || loading}
      className={`flex items-center gap-2 group ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`
          ${currentSize.switch}
          relative inline-flex items-center rounded-full
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOn 
            ? 'bg-green-500 dark:bg-green-600' 
            : 'bg-gray-300 dark:bg-gray-600'
          }
        `}
        style={isRTL ? { transform: 'scaleX(-1)' } : undefined}
      >
        {/* Sliding Knob */}
        <span
          className={`
            ${currentSize.knob}
            inline-block rounded-full bg-white
            shadow-lg transition-transform duration-300 ease-in-out
            flex items-center justify-center
          `}
          style={{ transform: getKnobTransform() }}
        >
          {loading && (
            <Loader2 className="h-full w-full p-0.5 animate-spin text-gray-400" />
          )}
        </span>
      </div>
      
      {label && (
        <span
          className={`
            text-sm font-medium transition-colors whitespace-nowrap
            ${isOn 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-500 dark:text-gray-400'
            }
            ${disabled ? 'opacity-50' : 'group-hover:text-gray-700 dark:group-hover:text-gray-300'}
          `}
        >
          {label}
        </span>
      )}
    </button>
  );
};

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
          <div className={`flex-1 space-y-2 ${isRTL ? 'ml-2' : 'mr-2'}`}>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t('BranchTableManagement.tableNameLabel')}
              </label>
              <input
                type="text"
                value={table.menuTableName}
                onChange={(e) => onTableChange(table.id, { menuTableName: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder={t('BranchTableManagement.tableNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                {t('BranchTableManagement.capacityLabel')}
              </label>
              <input
                type="number"
                value={table.capacity}
                onChange={(e) => onTableChange(table.id, { capacity: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder={t('BranchTableManagement.capacityPlaceholder')}
              />
            </div>
          </div>
        ) : (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {table.menuTableName}
            </h4>
            <p className="text-sm text-left text-gray-500 dark:text-gray-400">
              {t('BranchTableManagement.capacityLabel')}: {table.capacity}
            </p>
          </div>
        )}

        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isEditing ? (
            <>
              <button
                onClick={() => onUpdate(table.id, table)}
                className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                title={t('BranchTableManagement.save')}
              >
                <Save className="h-5 w-5" />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                title={t('BranchTableManagement.cancel')}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onShowQRCode(table)}
                className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                title={t('BranchTableManagement.showQRCode')}
              >
                <QrCode className="h-5 w-5" />
              </button>
              <button
                onClick={onEdit}
                className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                title={t('BranchTableManagement.edit')}
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(table.id)}
                className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                title={t('BranchTableManagement.delete')}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Active Status Toggle - Enhanced with Modern Switch */}
        <div className={`flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('BranchTableManagement.status')}
          </span>
          <ToggleSwitch
            isOn={table.isActive}
            onToggle={() => onToggleStatus(table.id, !table.isActive)}
            disabled={isToggling}
            loading={isToggling}
            label={table.isActive ? t('BranchTableManagement.active') : t('BranchTableManagement.inactive')}
            size="md"
          />
        </div>

        {/* Occupation Status - Also with Modern Switch */}
        <div className={`flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('BranchTableManagement.occupation')}
          </span>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {table.isOccupied ? (
              <UserX className="h-4 w-4 text-red-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-500" />
            )}
            <button
              onClick={() => onToggleOccupation(table.id, !table.isOccupied)}
              disabled={!table.isActive || isToggling}
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${table.isOccupied 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {table.isOccupied ? t('BranchTableManagement.occupied') : t('BranchTableManagement.available')}
            </button>
          </div>
        </div>

        {/* Clear/Refresh Table Button */}
        <div className={`flex items-center justify-center pt-2 border-t border-gray-200 dark:border-gray-700`}>
          <button
            onClick={() => onClearTable(table.id)}
            disabled={!table.isActive || isClearing || isToggling}
            className={`
              w-full px-3 py-2 text-xs font-medium rounded-lg transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
              ${isRTL ? 'flex-row-reverse' : ''}
              ${table.isOccupied 
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md'
              }
            `}
            title={table.isOccupied ? t('BranchTableManagement.clearTable') : t('BranchTableManagement.refreshTable')}
          >
            {isClearing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>
              {isClearing 
                ? t('BranchTableManagement.clearing') 
                : table.isOccupied 
                  ? t('BranchTableManagement.clearTable') 
                  : t('BranchTableManagement.refreshTable')
              }
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableCard;