import React from 'react';
import { Save, X } from 'lucide-react';
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

interface EditRestaurantModalProps {
  restaurant: RestaurantInfo | null;
  onClose: () => void;
  onSubmit: (id: string, formData: FormData) => void;
  loading: boolean;
}

export const EditRestaurantModal: React.FC<EditRestaurantModalProps> = ({ 
  restaurant, 
  onClose, 
  onSubmit, 
  loading 
}) => {
  const { t } = useLanguage();
  
  if (!restaurant) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(restaurant.restaurantId.toString(), formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('restaurantsTab.modal.editTitle')}
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t('restaurantsTab.modal.placeholders.restaurantName')}
            defaultValue={restaurant.restaurantName}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
          <input
            type="text"
            name="cuisineType"
            placeholder={t('restaurantsTab.modal.placeholders.cuisineType')}
            defaultValue={restaurant.cuisineType}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? t('restaurantsTab.modal.buttons.updating') : t('restaurantsTab.modal.buttons.update')}
          </button>
        </form>
      </div>
    </div>
  );
};