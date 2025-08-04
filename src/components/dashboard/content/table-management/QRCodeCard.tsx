import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Users, Eye, Download, MoreVertical, Check, X, Circle } from 'lucide-react';
import { TableData } from '../../../../types/api';

interface TableCardProps {
  table: TableData;
  onEdit: (table: TableData) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onDownload: (table: TableData) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onEdit, onDelete, onToggleStatus, onDownload }) => {
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
    return isActive ? 'Aktif' : 'Pasif';
  };

  const getOccupancyText = (isOccupied: boolean) => {
    return isOccupied ? 'Dolu' : 'Boş';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
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

          {/* QR Kod Önizleme ve Link */}
          <div className="mt-2">
            <a
              href={`/table/qr/${table.qrCode}`}
              target="_blank"
              rel="noopener noreferrer"
              title="QR Kodunu Görüntüle"
              className="inline-block hover:opacity-80"
            >
              <img
                src={`/api/qr/${table.qrCode}`}
                alt="QR Kod"
                className="w-20 h-20 rounded border border-gray-200 dark:border-gray-600 bg-white"
              />
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {table.capacity} Kişi
              </span>
            </div>
            <div className="flex items-center">
              <Circle className={`h-4 w-4 mr-1 ${table.isOccupied ? 'text-orange-500' : 'text-blue-500'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getOccupancyText(table.isOccupied)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(table.isActive)}`}>
                {getStatusText(table.isActive)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOccupancyColor(table.isOccupied)}`}>
                {getOccupancyText(table.isOccupied)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(table);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => {
                    onDownload(table);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <Download className="h-4 w-4 inline-block mr-2" />
                  QR Kodu İndir
                </button>
                <button
                  onClick={() => {
                    onToggleStatus(table.id);
                    setShowDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    table.isActive
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}
                >
                  {table.isActive ? (
                    <>
                      <X className="h-4 w-4 inline-block mr-2" />
                      Devre Dışı Bırak
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 inline-block mr-2" />
                      Aktifleştir
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    onDelete(table.id);
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Sil
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