import React from 'react';
import { Edit3, Trash2, MapPin, Users, CheckCircle2, XCircle, Wine, Store } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface RestaurantInfo {
  restaurantId: number;
  restaurantName: string;
  cuisineType: string;
  branchCount: number;
  activeBranchCount: number;
  hasAlcoholService: boolean;
  restaurantStatus: boolean;
  restaurantLogoPath: string;
}

interface RestaurantCardProps {
  restaurant: RestaurantInfo;
  onEdit: (restaurant: RestaurantInfo) => void;
  onDelete: (id: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onEdit, onDelete }) => {
  const { t } = useLanguage();
  
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl md:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        restaurant.restaurantStatus
          ? 'bg-gradient-to-r from-green-400 to-emerald-500'
          : 'bg-gradient-to-r from-red-400 to-rose-500'
      }`} />

      <div className="relative p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-5">
          {/* Logo Section - Responsive Size */}
          <div className="flex-shrink-0">
            {restaurant.restaurantLogoPath ? (
              <div className="relative group/logo">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl md:rounded-2xl blur opacity-30 group-hover/logo:opacity-50 transition-opacity" />
                <img
                  src={restaurant.restaurantLogoPath}
                  alt={`${restaurant.restaurantName} logo`}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-xl md:rounded-2xl border-2 md:border-4 border-white dark:border-gray-700 shadow-lg"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-2 md:border-4 border-white dark:border-gray-700">
                <Store className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 md:mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {restaurant.restaurantName}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm whitespace-nowrap">
                    {restaurant.cuisineType}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    restaurant.restaurantStatus
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {restaurant.restaurantStatus ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="hidden sm:inline">{t('restaurantsTab.status.active')}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span className="hidden sm:inline">{t('restaurarestaurantsTabnts.status.inactive')}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons - 44px touch targets */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(restaurant)}
                  className="min-w-[44px] min-h-[44px] p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center"
                  title={t('restaurantsTab.actions.edit')}
                  aria-label="Edit restaurant"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(restaurant.restaurantId.toString())}
                  className="min-w-[44px] min-h-[44px] p-2.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md flex items-center justify-center"
                  title={t('restaurantsTab.actions.delete')}
                  aria-label="Delete restaurant"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Grid - Responsive with md breakpoint */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mt-3 md:mt-4">
              {/* Total Branches */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                    {t('restaurantsTab.stats.totalBranches')}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white ml-6 md:ml-8">{restaurant.branchCount}</p>
              </div>

              {/* Active Branches */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                    {t('restaurantsTab.stats.active')}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white ml-6 md:ml-8">{restaurant.activeBranchCount}</p>
              </div>

              {/* Inactive Branches */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg md:rounded-xl p-2.5 md:p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700/30 rounded-lg flex-shrink-0">
                    <XCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                    {t('restaurantsTab.stats.inactive')}
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white ml-6 md:ml-8">
                  {restaurant.branchCount - restaurant.activeBranchCount}
                </p>
              </div>

             
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 dark:group-hover:border-blue-400/20 transition-colors pointer-events-none" />
    </div>
  );
};