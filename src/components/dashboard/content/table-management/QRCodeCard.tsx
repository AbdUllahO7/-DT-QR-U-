import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Users, Eye, Download, MoreVertical, Check, X, Circle } from 'lucide-react';
import { TableData } from '../../../../types/api';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface TableCardProps {
  table: TableData;
  onEdit: (table: TableData) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onDownload: (table: TableData) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onEdit, onDelete, onToggleStatus, onDownload }) => {
  const { t, isRTL } = useLanguage();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  const getOccupancyColor = (isOccupied: boolean) => {
    return isOccupied
      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
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
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 ${isRTL ? 'text-right' : 'text-left'}`}
      role="article"
      aria-label={t('TableCard.accessibility.tableCard')}
    >
      <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="space-y-4">
          <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <QrCode className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {table.menuTableName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {table.categoryName}
              </p>
            </div>
          </div>

          {/* QR Code Preview and Link */}
          <div className="mt-2">
            <a
              href={`/table/qr/${table.qrCode}`}
              target="_blank"
              rel="noopener noreferrer"
              title={t('TableCard.viewQRCode')}
              aria-label={t('TableCard.accessibility.qrCodePreview')}
              className="inline-block hover:opacity-80"
            >
              <img
                src={`/api/qr/${table.qrCode}`}
                alt={t('TableCard.viewQRCode')}
                className="w-20 h-20 rounded border border-gray-200 dark:border-gray-600 bg-white"
              />
            </a>
          </div>

          <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Users className={`h-4 w-4 text-gray-400 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getCapacityText(table.capacity)}
              </span>
            </div>
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Circle className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'} ${table.isOccupied ? 'text-orange-500' : 'text-blue-500'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getOccupancyText(table.isOccupied)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className={`flex space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(table.isActive)}`}
                aria-label={t('TableCard.accessibility.statusBadge')}
              >
                {getStatusText(table.isActive)}
              </span>
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(table.isOccupied)}`}
                aria-label={t('TableCard.accessibility.occupancyBadge')}
              >
                {getOccupancyText(table.isOccupied)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={t('TableCard.accessibility.actionsMenu')}
            aria-expanded={showDropdown}
            aria-haspopup="true"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showDropdown && (
            <div 
              className={`absolute mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10 ${isRTL ? 'left-0' : 'right-0'}`}
              role="menu"
              aria-label={t('TableCard.accessibility.actionsMenu')}
            >
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(table);
                    setShowDropdown(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}
                  role="menuitem"
                  aria-label={t('TableCard.accessibility.editButton')}
                >
                  {t('TableCard.edit')}
                </button>
                <button
                  onClick={() => {
                    onDownload(table);
                    setShowDropdown(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}
                  role="menuitem"
                  aria-label={t('TableCard.accessibility.downloadButton')}
                >
                  <Download className={`h-4 w-4 inline-block ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('TableCard.downloadQR')}
                </button>
                <button
                  onClick={() => {
                    onToggleStatus(table.id);
                    setShowDropdown(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    table.isActive
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  } ${isRTL ? 'text-right' : 'text-left'}`}
                  role="menuitem"
                  aria-label={t('TableCard.accessibility.toggleButton')}
                >
                  {table.isActive ? (
                    <>
                      <X className={`h-4 w-4 inline-block ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('TableCard.disable')}
                    </>
                  ) : (
                    <>
                      <Check className={`h-4 w-4 inline-block ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('TableCard.enable')}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    onDelete(table.id);
                    setShowDropdown(false);
                  }}
                  className={`block w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}
                  role="menuitem"
                  aria-label={t('TableCard.accessibility.deleteButton')}
                >
                  {t('TableCard.delete')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TableCard;

// Backward compatibility
export type QRCodeData = TableData;
export { TableCard as QRCodeCard };