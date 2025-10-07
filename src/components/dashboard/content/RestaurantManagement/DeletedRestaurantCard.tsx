import React from 'react';
import { RotateCcw } from 'lucide-react';

interface DeletedRestaurant {
  id: string;
  name: string;
  description?: string;
  deletedAt: string;
  userId: string;
}

interface DeletedRestaurantCardProps {
  restaurant: DeletedRestaurant;
  onRestore: (id: string) => void;
}

export const DeletedRestaurantCard: React.FC<DeletedRestaurantCardProps> = ({ restaurant, onRestore }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-red-200 dark:border-red-800">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{restaurant.name}</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          <div>Deleted: {new Date(restaurant.deletedAt).toLocaleString()}</div>
          {restaurant.description && <div>Description: {restaurant.description}</div>}
        </div>
      </div>
      <button
        onClick={() => onRestore(restaurant.id)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Restore
      </button>
    </div>
  </div>
);