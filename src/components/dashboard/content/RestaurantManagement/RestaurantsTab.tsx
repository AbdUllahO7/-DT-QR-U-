import React from 'react';
import { Search, Plus } from 'lucide-react';
import { RestaurantCard } from './RestaurantCard';

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

interface RestaurantsTabProps {
  restaurants: RestaurantInfo[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateClick: () => void;
  onEdit: (restaurant: RestaurantInfo) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const RestaurantsTab: React.FC<RestaurantsTabProps> = ({
  restaurants,
  searchQuery,
  onSearchChange,
  onCreateClick,
  onEdit,
  onDelete,
  loading
}) => {
  const filteredRestaurants = restaurants.filter(r =>
    r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Restaurant
        </button>
      </div>

      <div className="grid gap-4">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.restaurantId}
            restaurant={restaurant}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {filteredRestaurants.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No restaurants found.
          </div>
        )}
      </div>
    </div>
  );
};