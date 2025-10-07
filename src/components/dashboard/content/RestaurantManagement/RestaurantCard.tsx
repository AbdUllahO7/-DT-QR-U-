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
    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        restaurant.restaurantStatus 
          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
          : 'bg-gradient-to-r from-red-400 to-rose-500'
      }`} />

      <div className="relative p-6">
        <div className="flex items-start gap-5">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {restaurant.restaurantLogoPath ? (
              <div className="relative group/logo">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover/logo:opacity-50 transition-opacity" />
                <img
                  src={restaurant.restaurantLogoPath}
                  alt={`${restaurant.restaurantName} logo`}
                  className="relative w-24 h-24 object-cover rounded-2xl border-4 border-white dark:border-gray-700 shadow-lg"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700">
                <Store className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {restaurant.restaurantName}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm">
                    {restaurant.cuisineType}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    restaurant.restaurantStatus
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {restaurant.restaurantStatus ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        {t('restaurantsTab.status.active')}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        {t('restaurarestaurantsTabnts.status.inactive')}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(restaurant)}
                  className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md"
                  title={t('restaurantsTab.actions.edit')}
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(restaurant.restaurantId.toString())}
                  className="p-2.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md"
                  title={t('restaurantsTab.actions.delete')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {/* Total Branches */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t('restaurantsTab.stats.totalBranches')}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white ml-8">{restaurant.branchCount}</p>
              </div>

              {/* Active Branches */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t('restaurantsTab.stats.active')}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white ml-8">{restaurant.activeBranchCount}</p>
              </div>

              {/* Inactive Branches */}
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700/30 rounded-lg">
                    <XCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {t('restaurantsTab.stats.inactive')}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white ml-8">
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