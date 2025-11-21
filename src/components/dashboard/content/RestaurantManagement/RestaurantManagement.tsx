import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ActiveTab, DeletedRestaurant, RestaurantBranchDropdownItem,  RestaurantManagementInfo } from '../../../../types/RestaurantTypes';
import { restaurantService } from '../../../../services/restaurantService';
import { Notification } from './Notification';
import { TabNavigation } from './TabNavigation';
import { ManagementInfoPanel } from './ManagementInfoPanel';
import { BranchesTab } from './BranchesTab';
import { DeletedTab } from './DeletedTab';
import { LoadingOverlay } from './LoadingOverlay';
import { useLanguage } from '../../../../contexts/LanguageContext';



interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

const RestaurantManagement: React.FC = () => {
  // Tab and UI state
  const [activeTab, setActiveTab] = useState<ActiveTab>('branches');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const {t} = useLanguage()
  // Data state
  const [branches, setBranches] = useState<RestaurantBranchDropdownItem[]>([]);
  const [managementInfo, setManagementInfo] = useState<RestaurantManagementInfo | null>(null);
  const [deletedRestaurants, setDeletedRestaurants] = useState<DeletedRestaurant[]>([]);

  // Modal and form state
  const [editingManagement, setEditingManagement] = useState<boolean>(false);

  // Notification handler
  const showNotification = (message: string, type: 'success' | 'error' = 'success'): void => {
    setNotification({ message, type });
  };

  // Data fetching
  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [restaurantData, branchData, managementData, deletedData] = await Promise.all([
        restaurantService.getRestaurants(),
        restaurantService.getRestaurantBranchesDropdown(),
        restaurantService.getRestaurantManagementInfo(),
        restaurantService.getDeletedRestaurants()
      ]);

      setBranches(branchData);
      setManagementInfo(managementData);
      setDeletedRestaurants(deletedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to fetch data: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  const handleRestoreRestaurant = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await restaurantService.restoreRestaurant(id);
      showNotification('Restaurant restored successfully!');
      await fetchData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to restore restaurant: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateManagementInfo = async (formData: RestaurantManagementInfo): Promise<void> => {
    try {
      setLoading(true);
      await restaurantService.updateRestaurantManagementInfo(formData);
      showNotification('Management info updated successfully!');
      setEditingManagement(false);
      await fetchData();
    } catch (err) {
      console.log("errr",err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to update management info: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard.restaurant.title')}
          </h1>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t('dashboard.restaurant.refresh')}
          </button>
        </div>

        {/* Notifications */}
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      

        {activeTab === 'branches' && (
          <BranchesTab branches={branches} loading={loading} />
        )}

        {activeTab === 'management' && (
          <ManagementInfoPanel
            info={managementInfo}
            onEdit={() => setEditingManagement(!editingManagement)}
            onSubmit={handleUpdateManagementInfo}
            editing={editingManagement}
            loading={loading}
          />
        )}

        {activeTab === 'deleted' && (
          <DeletedTab
            deletedRestaurants={deletedRestaurants}
            onRestore={handleRestoreRestaurant}
            loading={loading}
          />
        )}

       

        {/* Loading Overlay */}
        {loading && <LoadingOverlay />}
      </div>
    </div>
  );
};

export default RestaurantManagement;