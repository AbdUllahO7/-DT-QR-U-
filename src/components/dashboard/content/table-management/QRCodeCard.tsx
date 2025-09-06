import React from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Users, 
  Download, 
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UserX,
  UserCheck,
  Circle,
  Loader2
} from 'lucide-react';
import { TableData } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';

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
  isToggling = false
}) => {
  const { t, isRTL } = useLanguage();

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'text-green-600 dark:text-green-400'
      : 'text-gray-500 dark:text-gray-400';
  };

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
      {/* Header Section */}
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

        {/* Action Buttons */}
        <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => onDownload(table)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title={t('TableCard.downloadQR')}
            aria-label={t('TableCard.accessibility.downloadButton')}
          >
            <Download className="h-3 w-3" />
          </button>
          <button
            onClick={() => onEdit(table)}
            className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
            title={t('TableCard.edit')}
            aria-label={t('TableCard.accessibility.editButton')}
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(table.id)}
            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            title={t('TableCard.delete')}
            aria-label={t('TableCard.accessibility.deleteButton')}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* QR Code Preview */}
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

      {/* Capacity Info */}
      <div className={`flex items-center mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Users className={`h-4 w-4 text-gray-400 ${isRTL ? 'ml-1' : 'mr-1'}`} />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {getCapacityText(table.capacity)}
        </span>
      </div>

      {/* Status Controls */}
      <div className="space-y-2">
        {/* Active/Inactive Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onToggleStatus(table.id)}
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
            <span className={`text-xs ${getStatusColor(table.isActive)}`}>
              {getStatusText(table.isActive)}
            </span>
          </button>
        </div>

        {/* Occupancy Status */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {table.isOccupied ? (
              <UserX className="h-4 w-4 text-red-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-green-500" />
            )}
            <span className={`text-xs ${getOccupancyColor(table.isOccupied)}`}>
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