import React from 'react';
import { MapPin, Tag, Building2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface RestaurantBranchDropdownItem {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  branchTag: string;
}

interface BranchCardProps {
  branch: RestaurantBranchDropdownItem;
}

export const BranchCard: React.FC<BranchCardProps> = ({ branch }) => {
  const { t } = useLanguage();
  
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        branch.isActive 
          ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500' 
          : 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600'
      }`} />

      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left Section - Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-4">
              {/* Icon */}
              <div className={`flex-shrink-0 p-3 rounded-xl shadow-lg ${
                branch.isActive
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                  : 'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}>
                <Building2 className="w-6 h-6 text-white" />
              </div>

              {/* Branch Name and Status */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {branch.name}
                </h3>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                    branch.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 ring-1 ring-green-500/20'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300 ring-1 ring-gray-500/20'
                  }`}>
                    {branch.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('branches.status.active')}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('branches.status.inactive')}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Type Info */}
              <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    {t('branches.fields.branchType')}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{branch.type}</p>
                </div>
              </div>

              {/* Tag Info */}
              <div className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    {t('branches.fields.branchTag')}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-lg shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      {branch.branchTag}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-indigo-500/20 dark:group-hover:border-indigo-400/20 transition-colors pointer-events-none" />
      
      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent opacity-50" />
    </div>
  );
};