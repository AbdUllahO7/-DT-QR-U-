import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Save, 
  X, 
  RefreshCw, 
  Building, 
  Users, 
  Info,
  Upload,
  Eye,
  RotateCcw,
  Moon,
  Sun
} from 'lucide-react';
import { restaurantService } from '../../../../services/restaurantService';

// Import types from the service file - these should match exactly
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

interface DeletedRestaurant {
  id: string;
  name: string;
  description?: string;
  deletedAt: string;
  userId: string;
}

interface RestaurantBranchDropdownItem {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  branchTag: string;
}

interface CreateRestaurantDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  creatorUserId: string;
}

interface RestaurantManagementInfo {
  restaurantId: string;
  restaurantName: string;
  restaurantLogoPath: string;
  cuisineTypeId: number | null;
  hasAlcoholService: boolean;
  companyTitle: string;
  taxNumber: string;
  taxOffice: string;
  mersisNumber: string;
  tradeRegistryNumber: string;
  legalType: string;
  workPermitFilePath: string;
  foodCertificateFilePath: string;
  restaurantStatus: string;
  about: string;
}

interface CreateAboutDto {
  restaurantId: string;
  about: string;
}

interface AboutInfo {
  restaurantId: string;
  about: string;
}

interface RestaurantFormData {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  userId: string;
}

type ActiveTab = 'restaurants' | 'branches' | 'management' | 'deleted' | 'about';

const RestaurantManagement: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('restaurants');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Restaurant states
  const [restaurants, setRestaurants] = useState<RestaurantInfo[]>([]);
  const [deletedRestaurants, setDeletedRestaurants] = useState<DeletedRestaurant[]>([]);
  const [branches, setBranches] = useState<RestaurantBranchDropdownItem[]>([]);
  const [managementInfo, setManagementInfo] = useState<RestaurantManagementInfo | null>(null);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

  // Form states
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [editingRestaurant, setEditingRestaurant] = useState<RestaurantInfo | null>(null);
  const [editingManagement, setEditingManagement] = useState<boolean>(false);
  const [editingAbout, setEditingAbout] = useState<boolean>(false);

  const [createForm, setCreateForm] = useState<RestaurantFormData>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    userId: ''
  });

  const [managementForm, setManagementForm] = useState<RestaurantManagementInfo>({
    restaurantId: '',
    restaurantName: '',
    restaurantLogoPath: '',
    cuisineTypeId: null,
    hasAlcoholService: false,
    companyTitle: '',
    taxNumber: '',
    taxOffice: '',
    mersisNumber: '',
    tradeRegistryNumber: '',
    legalType: '',
    workPermitFilePath: '',
    foodCertificateFilePath: '',
    restaurantStatus: 'active',
    about: ''
  });

  const [aboutForm, setAboutForm] = useState<CreateAboutDto>({
    restaurantId: '',
    about: ''
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  // Utility functions
  const showNotification = (message: string, type: 'success' | 'error' = 'success'): void => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 3000);
  };

  // Data fetching functions
  const fetchRestaurants = async (): Promise<void> => {
    try {
      setLoading(true);
      const restaurantData = await restaurantService.getRestaurants();
      setRestaurants(restaurantData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to fetch restaurants: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async (): Promise<void> => {
    try {
      setLoading(true);
      const branchData = await restaurantService.getRestaurantBranchesDropdown();
      setBranches(branchData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to fetch branches: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagementInfo = async (): Promise<void> => {
    try {
      setLoading(true);
      const info = await restaurantService.getRestaurantManagementInfo();
      if (info) {
        setManagementInfo(info);
        setManagementForm({ ...info });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to fetch management info: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletedRestaurants = async (): Promise<void> => {
    try {
      setLoading(true);
      const deleted = await restaurantService.getDeletedRestaurants();
      setDeletedRestaurants(deleted);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to fetch deleted restaurants: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAbout = async (restaurantId: string): Promise<void> => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const about = await restaurantService.getAbout(parseInt(restaurantId));
      if (about) {
        setAboutInfo(about);
        setAboutForm({ restaurantId: about.restaurantId, about: about.about });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to fetch about info: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // CRUD operations
  const handleCreateRestaurant = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const apiData: CreateRestaurantDto = {
        name: createForm.name,
        description: createForm.description || undefined,
        address: createForm.address || undefined,
        phone: createForm.phone || undefined,
        email: createForm.email || undefined,
        website: createForm.website || undefined,
        creatorUserId: createForm.userId
      };

      await restaurantService.createRestaurant(apiData);
      showNotification('Restaurant created successfully!');
      setShowCreateForm(false);
      
      setCreateForm({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        userId: ''
      });
      
      await fetchRestaurants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to create restaurant: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRestaurant = async (id: string, formData: FormData): Promise<void> => {
    try {
      setLoading(true);
      
      const data: Partial<CreateRestaurantDto> = {
        name: formData.get('name') as string,
        description: (formData.get('description') as string) || undefined,
        address: (formData.get('address') as string) || undefined,
        phone: (formData.get('phone') as string) || undefined,
        email: (formData.get('email') as string) || undefined,
        website: (formData.get('website') as string) || undefined,
        creatorUserId: editingRestaurant?.restaurantId.toString() || ''
      };
      
      await restaurantService.updateRestaurant(id, data);
      showNotification('Restaurant updated successfully!');
      setEditingRestaurant(null);
      
      await fetchRestaurants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to update restaurant: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      setLoading(true);
      await restaurantService.deleteRestaurant(id);
      showNotification('Restaurant deleted successfully!');
      setRestaurants(prev => prev.filter(r => r.restaurantId.toString() !== id));
      await fetchDeletedRestaurants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to delete restaurant: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreRestaurant = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await restaurantService.restoreRestaurant(id);
      showNotification('Restaurant restored successfully!');
      await fetchDeletedRestaurants();
      await fetchRestaurants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to restore restaurant: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateManagementInfo = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await restaurantService.updateRestaurantManagementInfo(managementForm);
      showNotification('Management info updated successfully!');
      setEditingManagement(false);
      await fetchManagementInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to update management info: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAbout = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await restaurantService.createAbout(aboutForm);
      showNotification('About info created successfully!');
      setEditingAbout(false);
      await fetchAbout(aboutForm.restaurantId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to create about info: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAbout = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      await restaurantService.updateAbout(aboutForm);
      showNotification('About info updated successfully!');
      setEditingAbout(false);
      await fetchAbout(aboutForm.restaurantId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      showNotification('Failed to update about info: ' + errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof RestaurantManagementInfo): void => {
    const file = e.target.files?.[0];
    if (file) {
      setManagementForm(prev => ({ ...prev, [field]: file.name }));
    }
  };

  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      try {
        await Promise.all([
          fetchRestaurants(),
          fetchBranches(),
          fetchManagementInfo(),
          fetchDeletedRestaurants()
        ]);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (managementInfo?.restaurantId) {
      fetchAbout(managementInfo.restaurantId);
    }
  }, [managementInfo]);

  const baseClasses = darkMode ? 'dark' : '';

  return (
    <div className={`${baseClasses} min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Restaurant Management
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <button
              onClick={async () => {
                try {
                  await Promise.all([
                    fetchRestaurants(),
                    fetchBranches(),
                    fetchManagementInfo(),
                    fetchDeletedRestaurants()
                  ]);
                } catch (err) {
                  console.error('Error refreshing data:', err);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Notifications */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'restaurants' as const, label: 'Restaurants', icon: Building },
            { id: 'branches' as const, label: 'Branches', icon: Users },
            { id: 'management' as const, label: 'Management Info', icon: Info },
            { id: 'deleted' as const, label: 'Deleted', icon: Trash2 },
            { id: 'about' as const, label: 'About', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search restaurants..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Restaurant
              </button>
            </div>

            {/* Create Form Modal */}
            {showCreateForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Restaurant</h3>
                    <button onClick={() => setShowCreateForm(false)}>
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateRestaurant} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Restaurant Name"
                      value={createForm.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCreateForm(prev => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={createForm.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCreateForm(prev => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={createForm.address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCreateForm(prev => ({ ...prev, address: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={createForm.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCreateForm(prev => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={createForm.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCreateForm(prev => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="url"
                      placeholder="Website"
                      value={createForm.website}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCreateForm(prev => ({ ...prev, website: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="User ID"
                      value={createForm.userId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCreateForm(prev => ({ ...prev, userId: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Creating...' : 'Create Restaurant'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Restaurants List */}
            <div className="grid gap-4">
              {restaurants
                .filter((r) =>
                  r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((restaurant) => (
                  <div
                    key={restaurant.restaurantId}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {restaurant.restaurantName}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div><strong>Cuisine Type:</strong> {restaurant.cuisineType}</div>
                          <div><strong>Branches:</strong> {restaurant.branchCount}</div>
                          <div><strong>Active Branches:</strong> {restaurant.activeBranchCount}</div>
                          <div><strong>Alcohol Service:</strong> {restaurant.hasAlcoholService ? 'Yes' : 'No'}</div>
                          <div><strong>Status:</strong> {restaurant.restaurantStatus ? 'Active' : 'Inactive'}</div>
                          {restaurant.restaurantLogoPath && (
                            <div>
                              <strong>Logo:</strong>
                              <img
                                src={restaurant.restaurantLogoPath}
                                alt="Restaurant Logo"
                                className="w-16 h-16 object-cover mt-1"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => setEditingRestaurant(restaurant)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRestaurant(restaurant.restaurantId.toString())}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {restaurants.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No restaurants found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Branches Tab */}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{branch.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>Type: {branch.type}</span>
                        <span>Tag: {branch.branchTag}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            branch.isActive
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}
                        >
                          {branch.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {branches.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No branches found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Management Info Tab */}
        {activeTab === 'management' && (
          <div className="space-y-6">
            {managementInfo ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Management Information</h3>
                  <button
                    onClick={() => setEditingManagement(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                {editingManagement ? (
                  <form onSubmit={handleUpdateManagementInfo} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Restaurant Name"
                      value={managementForm.restaurantName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setManagementForm(prev => ({ ...prev, restaurantName: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        title='restaurantLogo'
                        type="file"
                        id="restaurantLogo"
                        onChange={(e) => handleFileUpload(e, 'restaurantLogoPath')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <label htmlFor="restaurantLogo">
                        <Upload className="w-4 h-4 text-gray-500" />
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Company Title"
                      value={managementForm.companyTitle}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setManagementForm(prev => ({ ...prev, companyTitle: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Tax Number"
                      value={managementForm.taxNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setManagementForm(prev => ({ ...prev, taxNumber: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Tax Office"
                      value={managementForm.taxOffice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setManagementForm(prev => ({ ...prev, taxOffice: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="MERSIS Number"
                      value={managementForm.mersisNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setManagementForm(prev => ({ ...prev, mersisNumber: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Trade Registry Number"
                      value={managementForm.tradeRegistryNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setManagementForm(prev => ({ ...prev, tradeRegistryNumber: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <select
                    title='legalType'
                      value={managementForm.legalType}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setManagementForm(prev => ({ ...prev, legalType: e.target.value }))
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Legal Type</option>
                      <option value="LLC">LLC</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="alcoholService"
                        checked={managementForm.hasAlcoholService}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setManagementForm(prev => ({ ...prev, hasAlcoholService: e.target.checked }))
                        }
                        className="mr-2"
                      />
                      <label htmlFor="alcoholService" className="text-gray-900 dark:text-white">
                        Has Alcohol Service
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                      title='workPermit'
                        type="file"
                        id="workPermit"
                        onChange={(e) => handleFileUpload(e, 'workPermitFilePath')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <label htmlFor="workPermit">
                        <Upload className="w-4 h-4 text-gray-500" />
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        title='foodCertificate'
                        type="file"
                        id="foodCertificate"
                        onChange={(e) => handleFileUpload(e, 'foodCertificateFilePath')}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <label htmlFor="foodCertificate">
                        <Upload className="w-4 h-4 text-gray-500" />
                      </label>
                    </div>
                    <textarea
                      placeholder="About"
                      value={managementForm.about}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setManagementForm(prev => ({ ...prev, about: e.target.value }))
                      }
                      className="col-span-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={4}
                    />
                    <div className="col-span-full flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingManagement(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Restaurant Name:</strong> {managementInfo.restaurantName || 'N/A'}</div>
                    <div><strong>Company Title:</strong> {managementInfo.companyTitle || 'N/A'}</div>
                    <div><strong>Tax Number:</strong> {managementInfo.taxNumber || 'N/A'}</div>
                    <div><strong>Tax Office:</strong> {managementInfo.taxOffice || 'N/A'}</div>
                    <div><strong>MERSIS Number:</strong> {managementInfo.mersisNumber || 'N/A'}</div>
                    <div><strong>Trade Registry:</strong> {managementInfo.tradeRegistryNumber || 'N/A'}</div>
                    <div><strong>Legal Type:</strong> {managementInfo.legalType || 'N/A'}</div>
                    <div><strong>Alcohol Service:</strong> {managementInfo.hasAlcoholService ? 'Yes' : 'No'}</div>
                    <div className="col-span-full">
                      <strong>About:</strong>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">{managementInfo.about || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No management information found.
              </div>
            )}
          </div>
        )}

        {/* Deleted Restaurants Tab */}
        {activeTab === 'deleted' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {deletedRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{restaurant.name}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <div>Deleted: {new Date(restaurant.deletedAt).toLocaleString()}</div>
                        {restaurant.description && <div>Description: {restaurant.description}</div>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestoreRestaurant(restaurant.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                  </div>
                </div>
              ))}
              {deletedRestaurants.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No deleted restaurants found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            {aboutInfo || editingAbout ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">About Information</h3>
                  <button
                    onClick={() => setEditingAbout(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    {aboutInfo ? 'Edit' : 'Create'}
                  </button>
                </div>

                {editingAbout ? (
                  <form
                    onSubmit={aboutInfo ? handleUpdateAbout : handleCreateAbout}
                    className="space-y-4"
                  >
                    <input
                      type="text"
                      placeholder="Restaurant ID"
                      value={aboutForm.restaurantId}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setAboutForm(prev => ({ ...prev, restaurantId: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <textarea
                      placeholder="About text..."
                      value={aboutForm.about}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setAboutForm(prev => ({ ...prev, about: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={6}
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {loading ? 'Saving...' : aboutInfo ? 'Update About' : 'Create About'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingAbout(false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div><strong>Restaurant ID:</strong> {aboutInfo?.restaurantId || 'N/A'}</div>
                    <div>
                      <strong>About:</strong>
                      <p className="mt-2 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {aboutInfo?.about || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No about information found.</p>
                <button
                  onClick={() => {
                    setEditingAbout(true);
                    if (managementInfo?.restaurantId) {
                      setAboutForm(prev => ({ ...prev, restaurantId: managementInfo.restaurantId }));
                    }
                  }}
                  className="flex items-center gap-2 mx-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create About
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit Restaurant Modal */}
        {editingRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Restaurant</h3>
                <button onClick={() => setEditingRestaurant(null)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateRestaurant(editingRestaurant.restaurantId.toString(), formData);
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Restaurant Name"
                  defaultValue={editingRestaurant.restaurantName}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  name="cuisineType"
                  placeholder="Cuisine Type"
                  defaultValue={editingRestaurant.cuisineType}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex items-center">
                  <input
                    title='hasAlcoholService'
                    type="checkbox"
                    name="hasAlcoholService"
                    defaultChecked={editingRestaurant.hasAlcoholService}
                    className="mr-2"
                  />
                  <label htmlFor="hasAlcoholService" className="text-gray-900 dark:text-white">
                    Has Alcohol Service
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Updating...' : 'Update Restaurant'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center gap-3">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-900 dark:text-white">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantManagement;
