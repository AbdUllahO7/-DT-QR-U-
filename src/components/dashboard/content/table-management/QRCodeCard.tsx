import React from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Users,
  Download,
  Edit,
  Trash2,
  // Removed old toggles
  UserX,
  UserCheck,
  // Added for new switch
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { TableData } from '../../../../types/BranchManagement/type';

// --- Modern Toggle Switch Component (Copied from your second file) ---

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
    lg: { switch: 'w-14 h-7', knob: 'w-6 h-6', translateX: 28 },
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

// --- Updated TableCard (QRCodeCard) ---

interface TableCardProps {
  table: TableData;
  onEdit: (table: TableData) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onDownload: (table: TableData) => void;
  isToggling?: boolean;
}

const TableCard: React.FC<TableCardProps> = ({
  table,
  onEdit,
  onDelete,
  onToggleStatus,
  onDownload,
  isToggling = false,
}) => {
  const { t, isRTL } = useLanguage();

  const getOccupancyColor = (isOccupied: boolean) => {
    return isOccupied
      ? 'text-red-600 dark:text-red-400'
      : 'text-green-600 dark:text-green-400';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? t('TableCard.active') : t('TableCard.inactive');
  };

  const getOccupancyText = (isOccupied: boolean) => {
    return isOccupied ? t('TableCard.occupied') : t('TableCard.empty');
  };

  const getCapacityText = (capacity: number) => {
    return capacity === 1
      ? `${capacity} ${t('TableCard.capacity')}`
      : `${capacity} ${t('TableCard.capacityPlural')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
      role="article"
      aria-label={t('TableCard.accessibility.tableCard')}
    >
      {/* Header Section (Unchanged) */}
      <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <QrCode className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {table.menuTableName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {table.categoryName}
            </p>
          </div>
        </div>

        {/* Action Buttons (Unchanged) */}
        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => onDownload(table)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title={t('TableCard.downloadQR')}
            aria-label={t('TableCard.accessibility.downloadButton')}
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => onEdit(table)}
            className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
            title={t('TableCard.edit')}
            aria-label={t('TableCard.accessibility.editButton')}
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(table.id)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title={t('TableCard.delete')}
            aria-label={t('TableCard.accessibility.deleteButton')}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* QR Code Preview (Unchanged) */}
      <div className="mb-3">
        <a
          href={`/table/qr/${table.qrCode}`}
          target="_blank"
          rel="noopener noreferrer"
          title={t('TableCard.viewQRCode')}
          aria-label={t('TableCard.accessibility.qrCodePreview')}
          className="inline-block hover:opacity-80"
        >
          <img
            src={`${table.qrCodeUrl}`}
            alt={t('TableCard.viewQRCode')}
            className="w-16 h-16 rounded border border-gray-200 dark:border-gray-600 bg-white"
          />
        </a>
      </div>

      {/* Capacity Info (Unchanged) */}
      <div className={`flex items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Users className={`h-4 w-4 text-gray-400 ${isRTL ? 'ml-1' : 'mr-1'}`} />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {getCapacityText(table.capacity)}
        </span>
      </div>

      {/* --- REFACTORED Status Controls --- */}
      <div className="space-y-2">
        {/* Active Status Toggle - Enhanced with Modern Switch */}
        <div className={`flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('BranchTableManagement.status')} {/* Assumes this translation exists */}
          </span>
          <ToggleSwitch
            isOn={table.isActive}
            onToggle={() => onToggleStatus(table.id)}
            disabled={isToggling}
            loading={isToggling}
            label={getStatusText(table.isActive)}
            size="md"
          />
        </div>

        {/* Occupancy Status - Restyled */}
        <div className={`flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('BranchTableManagement.occupation')} {/* Assumes this translation exists */}
          </span>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {table.isOccupied ? (
              <UserX className="h-4 w-4 text-red-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-500" />
            )}
            <span className={`text-sm font-medium ${getOccupancyColor(table.isOccupied)}`}>
              {getOccupancyText(table.isOccupied)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TableCard;

// Backward compatibility
export type QRCodeData = TableData;
export { TableCard as QRCodeCard };