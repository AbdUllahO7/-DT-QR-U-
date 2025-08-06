import React from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface AddBranchCardProps {
  onClick: () => void;
}

const AddBranchCard: React.FC<AddBranchCardProps> = ({ onClick }) => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full max-w-xs h-[370px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-dashed border-blue-300 dark:border-blue-700/40 overflow-hidden group flex flex-col items-center justify-center transition-all duration-700 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-3xl`}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(31,38,135,0.12)' }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      type="button"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-blue-600/5 to-blue-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className={`absolute top-10 ${isRTL ? 'right-10' : 'left-10'} w-2 h-2 bg-blue-400/30 rounded-full animate-ping`}></div>
        <div className={`absolute top-20 ${isRTL ? 'left-20' : 'right-20'} w-1 h-1 bg-blue-500/40 rounded-full animate-pulse delay-300`}></div>
        <div className={`absolute bottom-20 ${isRTL ? 'right-20' : 'left-20'} w-1.5 h-1.5 bg-blue-600/35 rounded-full animate-ping delay-700`}></div>
      </div>
      
      {/* Icon Container */}
      <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:scale-110 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
        <Plus className="w-12 h-12 text-white drop-shadow-lg" />
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
        {t('addBranchCard.title')}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-4">
        {t('addBranchCard.description')}
      </p>
    </motion.button>
  );
};

export default AddBranchCard;