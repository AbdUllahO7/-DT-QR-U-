import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, MoreVertical, Building2, Clock, CheckCircle, XCircle, EyeOff, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { BranchInfo } from '../../../../types/api';

interface BranchCardProps {
  branch: BranchInfo;
  onEdit: (branch: BranchInfo) => void;
  onDelete: (branch: BranchInfo) => void;
  onPurge: (branch: BranchInfo) => void;
  onToggleTemporaryClose: (branchId: number, isTemporarilyClosed: boolean) => void;
}

const BranchCard: React.FC<BranchCardProps> = ({ branch, onEdit, onDelete, onPurge, onToggleTemporaryClose }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  // Status helpers
  const getStatusBadge = () => {
    if (branch.isTemporarilyClosed) {
      return {
        color: 'bg-amber-500/90 text-white border-amber-400/50 shadow-amber-500/25',
        icon: <Clock className="w-4 h-4" />, 
        text: t('branchCard.status.temporaryClosed'),
      };
    }
    if (branch.isOpenNow) {
      return {
        color: 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-emerald-500/25',
        icon: <CheckCircle className="w-4 h-4" />, 
        text: t('branchCard.status.open'),
      };
    }
    return {
      color: 'bg-green-500/90 text-white border-green-400/50 shadow-green-500/25',
      icon: <XCircle className="w-4 h-4" />, 
      text: t('branchCard.status.open'),
    };
  };

  const statusBadge = getStatusBadge();

  // Aktiflik badge
  const activeBadge = branch.branchStatus
    ? ' text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';

  // Switch
  const handleSwitch = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggleTemporaryClose(branch.branchId, checked);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <motion.div
      className={`relative w-full max-w-xs h-[370px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden group hover:shadow-3xl hover:border-white/30 dark:hover:border-gray-600/40 transition-all duration-700 flex flex-col cursor-pointer`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.12)' }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Status Badge */}
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10`}>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-3 py-2 rounded-full text-xs font-semibold backdrop-blur-md border shadow-lg ${statusBadge.color} transform transition-all duration-300 group-hover:scale-105`}>
          {statusBadge.icon}
          <span>{statusBadge.text}</span>
        </div>
      </div>

      {/* Menü */}
      <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} z-10`}>
        <button
          onClick={e => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10`}
            >
              <button
                onClick={() => { onEdit(branch); setIsMenuOpen(false); }}
                className={`w-full flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <Edit2 className="h-4 w-4" />
                <span>{t('branchCard.actions.edit')}</span>
              </button>
              <button
                onClick={() => { onDelete(branch); setIsMenuOpen(false); }}
                className={`w-full flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('branchCard.actions.delete')}</span>
              </button>
              <button
                onClick={() => { onPurge(branch); setIsMenuOpen(false); }}
                className={`w-full flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border-t border-gray-200 dark:border-gray-700 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <AlertTriangle className="h-4 w-4" />
                <span>{t('branchCard.actions.purge') || 'Permanent Delete'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logo ve başlık */}
      <div className="flex flex-col items-center justify-center flex-1 pt-12 pb-4 px-6">
        <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:scale-110 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
          {branch.branchLogoPath ? (
            <img
              src={branch.branchLogoPath}
              alt={`${branch.branchName} ${t('branchCard.alt.logo')}`}
              className="w-12 h-12 object-cover rounded-2xl bg-white/10"
            />
          ) : (
            <Building2 className="w-10 h-10 text-white drop-shadow-lg" />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
          {branch.branchName}
        </h2>
        <div className="flex items-center justify-center mb-4">
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} px-4 py-3 rounded-2xl border backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${branch.isTemporarilyClosed ? 'bg-amber-50/80 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300' : branch.isOpenNow ? 'bg-emerald-50/80 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300' : 'bg-red-50/80 dark:bg-green-900/30 border-green-200/50 dark:border-green-700/50 text-green-700 dark:text-green-300'}`}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">
              {branch.isTemporarilyClosed ? t('branchCard.status.temporaryClosed') : (branch.isOpenNow ? t('branchCard.status.open') : t('branchCard.status.open'))}
            </span>
          </div>
        </div>
        {/* Geçici Kapalı Switch */}
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mt-2`}>
         
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              title='isTemporarilyClosed'
              type="checkbox"
              className="sr-only peer"
              checked={branch.isTemporarilyClosed}
              onChange={e => handleSwitch(e.target.checked)}
              disabled={isToggling}
            />
            <div className={`w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 transition-colors duration-200 ${branch.isTemporarilyClosed ? 'bg-amber-500 dark:bg-amber-600' : 'bg-emerald-500 dark:bg-emerald-600'}`}></div>
            <div className={`absolute ${isRTL ? 'right-1' : 'left-1'} top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${branch.isTemporarilyClosed ? (isRTL ? '-translate-x-5' : 'translate-x-5') : ''} ${isToggling ? 'animate-pulse' : ''}`}></div>
          </label>
          {branch.isTemporarilyClosed && (
            <span className={`text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'} ${isRTL ? 'mr-1' : 'ml-1'}`}>
              <EyeOff className="w-3 h-3" /> 
            </span>
          )}
        </div>
      </div>
      {/* Alt bilgi: Aktiflik */}
      <div className="flex items-center justify-center pb-4 flex-col gap-1">
        <div className={`rounded-full px-3 py-1 text-xs font-semibold ${activeBadge}`}>
          {branch.branchStatus ? t('branchCard.status.active') : t('branchCard.status.inactive')}
        </div>
        {/* API'den dönen BranchIsOpen bilgisi */}
        {branch.BranchIsOpen !== undefined && (
          <div className="mt-1 text-xs text-blue-600 dark:text-blue-300 font-semibold">
            {t('branchCard.labels.apiBranchOpen')} {String(branch.BranchIsOpen)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BranchCard;