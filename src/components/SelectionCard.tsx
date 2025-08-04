import React from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, ChevronRight, Building2, Clock, AlertCircle, Check, Zap } from 'lucide-react';

interface SelectionCardProps {
  item: {
    type: 'restaurant' | 'branch';
    id: number | string;
    name: string;
    status: boolean;
    logoPath?: string;
    canAccess?: boolean;
    isOpenNow?: boolean;
    isTemporarilyClosed?: boolean;
  };
  isActive: boolean;
  index: number;
  onClick: () => void;
  onSelect: (id: number | string) => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ 
  item, 
  isActive, 
  index, 
  onClick, 
  onSelect 
}) => {
  const cardClasses = `
    relative w-80 h-[520px] transition-all duration-700 ease-out cursor-pointer
    ${isActive 
      ? 'z-20 scale-100 opacity-100' 
      : 'scale-[0.85] opacity-70 hover:opacity-90 hover:scale-[0.87]'
    }
    bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl
    border border-white/20 dark:border-gray-700/30
    overflow-hidden group
    hover:shadow-3xl hover:border-white/30 dark:hover:border-gray-600/40
  `;

  const getStatusIcon = () => {
    if (item.type === 'branch' && item.isTemporarilyClosed) {
      return <AlertCircle className="w-4 h-4" />;
    }
    return item.status ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (item.type === 'branch' && item.isTemporarilyClosed) {
      return 'Geçici Kapalı';
    }
    return item.status ? 'Aktif' : 'Pasif';
  };

  const getStatusColors = () => {
    if (item.type === 'branch' && item.isTemporarilyClosed) {
      return 'bg-amber-500/90 text-white border-amber-400/50 shadow-amber-500/25';
    }
    return item.status 
      ? 'bg-emerald-500/90 text-white border-emerald-400/50 shadow-emerald-500/25'
      : 'bg-red-500/90 text-white border-red-400/50 shadow-red-500/25';
  };

  const getOpenStatusColors = () => {
    if (item.isTemporarilyClosed) {
      return 'bg-amber-50/80 dark:bg-amber-900/30 border-amber-200/50 dark:border-amber-700/50 text-amber-700 dark:text-amber-300';
    }
    return item.isOpenNow 
      ? 'bg-emerald-50/80 dark:bg-emerald-900/30 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300'
      : 'bg-red-50/80 dark:bg-red-900/30 border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-300';
  };

  const getIconColors = () => {
    return item.type === 'restaurant' 
      ? 'from-primary-500 via-primary-600 to-primary-700'
      : 'from-blue-500 via-blue-600 to-blue-700';
  };

  const getButtonColors = () => {
    return item.type === 'restaurant'
      ? 'from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500/30'
      : 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500/30';
  };

  return (
    <motion.div
      className={cardClasses}
      initial={false}
      animate={{ 
        scale: isActive ? 1 : 0.85,
        opacity: isActive ? 1 : 0.7
      }}
      whileHover={{ 
        scale: isActive ? 1.02 : 0.87,
        opacity: isActive ? 1 : 0.9
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
      onClick={onClick}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-primary-600/5 to-primary-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Floating Particles Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary-400/30 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-primary-500/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-primary-600/35 rounded-full animate-ping delay-700"></div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold 
          backdrop-blur-md border shadow-lg ${getStatusColors()}
          transform transition-all duration-300 group-hover:scale-105
        `}>
          {getStatusIcon()}
          <span>{getStatusText()}</span>
        </div>
      </div>

      {/* Lightning Effect for Active Status */}
      {item.status && isActive && (
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
          >
            <Zap className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      )}

      <div className="p-6 flex flex-col h-full relative z-10">
        <div className="flex-1">
          {/* Icon Container */}
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl group-hover:scale-110">
            <div className={`
              w-full h-full rounded-3xl bg-gradient-to-br ${getIconColors()}
              flex items-center justify-center
              transform transition-all duration-500 group-hover:rotate-3
              overflow-hidden
            `}>
              {item.logoPath ? (
                <img 
                  src={item.logoPath} 
                  alt={`${item.name} logo`}
                  className="w-12 h-12 object-cover rounded-2xl bg-white/10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={item.logoPath ? 'hidden' : ''}>
                {item.type === 'restaurant' ? (
                  <Store className="w-10 h-10 text-white drop-shadow-lg" />
                ) : (
                  <MapPin className="w-10 h-10 text-white drop-shadow-lg" />
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-500">
            {item.name}
          </h2>

          {/* Branch Status */}
          {item.type === 'branch' && (
            <div className="flex items-center justify-center mb-6">
              <div className={`
                flex items-center gap-2 px-4 py-3 rounded-2xl border backdrop-blur-sm
                transition-all duration-300 group-hover:scale-105 ${getOpenStatusColors()}
              `}>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {item.isTemporarilyClosed ? 'Geçici Kapalı' : (item.isOpenNow ? 'Açık' : 'Kapalı')}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {item.type === 'restaurant' 
                ? 'Tüm restoran operasyonlarınızı yönetin, menülerinizi düzenleyin ve genel ayarlarınızı kontrol edin.'
                : 'Bu şubenin siparişlerini takip edin, masa durumlarını görüntüleyin ve günlük operasyonları yönetin.'
              }
            </p>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.id);
          }}
          className={`
            w-full flex items-center justify-center px-6 py-4 rounded-2xl text-white font-semibold
            bg-gradient-to-r ${getButtonColors()}
            transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4
            shadow-lg hover:shadow-2xl relative overflow-hidden group/button
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Button Background Effect */}
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/button:translate-x-full transition-transform duration-700"></div>
          
          {item.type === 'restaurant' ? (
            <>
              <Building2 className="w-5 h-5 mr-3 transition-transform duration-300 group-hover/button:scale-110" />
              <span>Restoran Yönetimine Git</span>
            </>
          ) : (
            <>
              <ChevronRight className="w-5 h-5 mr-3 transition-transform duration-300 group-hover/button:translate-x-1" />
              <span>Şubeyi Seç</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SelectionCard; 