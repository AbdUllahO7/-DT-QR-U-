import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Download,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { TableData } from '../../../../types/BranchManagement/type';

// --- Reusable Toggle Switch Component ---
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

  const getKnobTransform = () => {
    if (isRTL) {
      return isOn
        ? `scaleX(-1) translateX(${currentSize.translateX}px)`
        : 'scaleX(-1) translateX(2px)';
    } else {
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
          ${isOn ? 'bg-green-500' : 'bg-gray-600'}
        `}
        style={isRTL ? { transform: 'scaleX(-1)' } : undefined}
      >
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
        <span className={`text-sm font-medium ${isOn ? 'text-green-500' : 'text-gray-400'}`}>
          {label}
        </span>
      )}
    </button>
  );
};

// --- Updated TableCard to match Screenshot ---

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

  const getStatusText = (isActive: boolean) => isActive ? t('TableCard.active') : t('TableCard.inactive');
  const getOccupancyText = (isOccupied: boolean) => isOccupied ? t('TableCard.occupied') : t('TableCard.empty');
  
  // Helper for capacity text
  const capacityText = `${table.capacity} ${table.capacity === 1 ? t('TableCard.people') : t('TableCard.people')}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Top Border Accent (Optional, matches the green line in similar designs) */}
      <div className="absolute top-0 inset-x-4 h-[2px] bg-emerald-500 rounded-t-full z-10 opacity-80" />

      {/* Main Card Container */}
      <div className="relative bg-[#0f1420] dark:bg-[#0f1420] border border-gray-800 rounded-[2rem] p-5 shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className={`flex justify-between items-start mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Title Area */}
          <div className="flex w-[100px] flex-col gap-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              {table.menuTableName}
            </h2>
            
            {/* Badges Row */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Capacity Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1e2538] rounded-full border border-gray-700/50">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-medium text-blue-100">
                   {/* Fallback text if translation fails/is simplistic */}
                   {table.capacity} People
                </span>
              </div>
              
              {/* Active Badge (Mini) */}
              <div className={`flex  items-center gap-1.5 px-3 py-1 rounded-full border border-gray-700/50 ${
                table.isActive ? 'bg-emerald-900/30' : 'bg-red-900/30'
              }`}>
                {table.isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                   <XCircle className="w-3.5 h-3.5 text-red-400" />
                )}
                <span className={`text-xs font-medium ${table.isActive ? 'text-emerald-100' : 'text-red-100'}`}>
                  {getStatusText(table.isActive)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Icons (Download prominent, others subtle) */}
          <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <button
              onClick={() => onDownload(table)}
              className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
              title={t('TableCard.downloadQR')}
            >
              <Download className="w-5 h-5" />
            </button>
            
            {/* Keeping Edit/Delete accessible but less prominent to match clean look */}
            <div className="flex gap-1 opacity-1 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={() => onEdit(table)} className="p-2 text-gray-500 hover:text-blue-400">
                    <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(table.id)} className="p-2 text-gray-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>

        {/* QR Code Section - The Glow Effect */}
        <div className="relative flex justify-center py-6">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          
          <a
            href={`/table/qr/${table.qrCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 p-1.5 bg-white rounded-xl shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300"
          >
            <img
              src={table.qrCodeUrl}
              alt="QR Code"
              className="w-32 h-32 rounded-lg object-cover"
            />
          </a>
        </div>
        

        {/* Footer Controls Section */}
        <div className="space-y-3 mt-2">
          
          {/* Status Row */}
          <div className={`flex items-center justify-between p-3 bg-[#161b2a] rounded-xl border border-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium text-gray-300">
              {t('BranchTableManagement.status')}
            </span>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ToggleSwitch
                isOn={table.isActive}
                onToggle={() => onToggleStatus(table.id)}
                disabled={isToggling}
                loading={isToggling}
                size="md"
              />
               <span className={`text-sm font-medium min-w-[3rem] ${isRTL ? 'text-right' : 'text-left'} ${
                table.isActive ? 'text-emerald-400' : 'text-gray-500'
              }`}>
                {getStatusText(table.isActive)}
              </span>
            </div>
          </div>

          {/* Occupation Row */}
          <div className={`flex items-center justify-between p-3 bg-[#161b2a] rounded-xl border border-gray-800 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium text-gray-300">
              {t('BranchTableManagement.occupation')}
            </span>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {table.isOccupied ? (
                <UserX className="h-4 w-4 text-red-400" />
              ) : (
                <UserCheck className="h-4 w-4 text-emerald-400" />
              )}
              <span className={`text-sm font-medium ${
                table.isOccupied ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {getOccupancyText(table.isOccupied)}
              </span>
            </div>
          </div>
          
        </div>

      </div>
    </motion.div>
  );
};

export default TableCard;

export type QRCodeData = TableData;
export { TableCard as QRCodeCard };