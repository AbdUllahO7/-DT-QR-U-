import React from 'react';
import { DeletedRestaurantCard } from './DeletedRestaurantCard';

interface DeletedRestaurant {
  id: string;
  name: string;
  description?: string;
  deletedAt: string;
  userId: string;
}

interface DeletedTabProps {
  deletedRestaurants: DeletedRestaurant[];
  onRestore: (id: string) => void;
  loading: boolean;
}

export const DeletedTab: React.FC<DeletedTabProps> = ({ deletedRestaurants, onRestore, loading }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {deletedRestaurants.map((restaurant) => (
          <DeletedRestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onRestore={onRestore}
          />
        ))}
        {deletedRestaurants.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No deleted restaurants found.
          </div>
        )}
      </div>
    </div>
  );
};