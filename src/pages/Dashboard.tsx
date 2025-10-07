import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { useLanguage } from '../contexts/LanguageContext';
import Navbar from '../components/dashboard/layout/Navbar';
import Sidebar from '../components/dashboard/layout/Sidebar';
import BranchManagement from '../components/dashboard/content/branch-management/BranchManagement';
import UserManagement from '../components/dashboard/content/UserManagement';
import Profile from '../components/dashboard/content/Profile';
import Settings from '../components/dashboard/content/Settings/ResturantSettings';
import Subscription from '../components/dashboard/content/Subscription';
import ProductsContent from '../components/dashboard/Porducts/ProductsContent';
import RestaurantManagement from '../components/dashboard/content/RestaurantManagement';
import NetworkStatus from '../components/NetworkStatus';
import { RestaurantManagementInfo } from '../types/api';
import { restaurantService } from '../services/restaurantService';
import { decodeToken } from '../utils/http';
import { sanitizePlaceholder } from '../utils/sanitize';
import { logger } from '../utils/logger';
import IngredientsContent from '../components/dashboard/Ingredients/Ingredients';
import SetupSidebar from '../components/dashboard/layout/SetupSidebar';
import BranchProducts from '../components/dashboard/Branch/Products/BranchProducts';
import BranchTableManagement from '../components/dashboard/Branch/Table/BranchTables';
import OrderTypeComponeent from '../components/dashboard/Branch/OrderType/Ordertype';
import Overview from '../components/dashboard/content/overview/Overview';
import TableManagement from '../components/dashboard/content/table-management/TableManagement';
import OrdersManager from '../components/dashboard/Branch/Orders/OrderManagement';
import { RestaurantBranchDropdownItem } from '../types/BranchManagement/type';
import OrderTypeResturantComponent from '../components/dashboard/content/OrderType/OrderTypeRestaurantComponent';
import OrdersManagerResturant from '../components/dashboard/content/ResturantOrders/OrdersManagerRestaurant';
import BranchSettings from '../components/dashboard/Branch/Settings/BranchSettings';
import ResturantSettings from '../components/dashboard/content/Settings/ResturantSettings';
import RecycleBin from '../components/dashboard/Porducts/RecycleBinProducts';
import RestaurantManagementSetting from '../components/dashboard/content/RestaurantManagement/RestaurantManagement';
import BranchManagementBranch from '../components/dashboard/Branch/BranchManagement/BranchManagement';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<RestaurantBranchDropdownItem | null>(null);
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.split('/')[2] || 'overview';
    return path;
  });

  // URL değiştikçe sekme güncelle
  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'overview';
    setActiveTab(path);
  }, [location.pathname]);

  // Restaurant info state (gerçek API'den alınacak)
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantManagementInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [infoError, setInfoError] = useState<string | null>(null);

  // İlk yüklemede restaurant bilgilerini al
  useEffect(() => {
    restaurantService
      .getRestaurantManagementInfo()
      .then(data => {
        setRestaurantInfo(data);
        setInfoLoading(false);
      })
      .catch(err => {
        logger.error('Restaurant bilgileri alınırken hata', err);
        setInfoError('Restaurant bilgileri alınamadı');
        setInfoLoading(false);
      });
  }, []);

  // Restaurant adı – placeholder'ı temizle ve olası yedek kaynaklardan al
  const resolvedRestaurantName = (() => {
    const nameFromInfo = sanitizePlaceholder(restaurantInfo?.restaurantName ?? '');
    if (nameFromInfo) return nameFromInfo;

    const storedName = sanitizePlaceholder(localStorage.getItem('restaurantName') ?? '');
    if (storedName) return storedName;

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      const tokenName = sanitizePlaceholder(decoded?.restaurant_name ?? '');
      if (tokenName) return tokenName;
    }

    return ''; 
  })();

  const branchName = selectedBranch?.name ?? null;
  const isBranchOnly = false;

  // Determine which sidebar to show
  const hasRestaurantInfo = !infoLoading && !infoError && restaurantInfo !== null;

  const handleLogout = () => {
    // Authentication durumunu temizle (token, localStorage vb.)
    clearAuth();
    // Landing page'e yönlendir
    navigate('/', { replace: true });
  };

  const handleSearch = (query: string) => {
    // Arama işlemleri burada yapılacak
    logger.info('Search query', { query });
  };

  const handleSearchResultClick = (result: any) => {
    // Arama sonucu tıklama işlemleri burada yapılacak
    logger.info('Search result clicked', { result });
  };

  // Profil Dropdown üzerinden tab değişikliği
  const handleTabChange = (tab: string) => {
    navigate(`/dashboard/${tab}`);
    setActiveTab(tab);
  };

  const handleSelectBranch = (item: RestaurantBranchDropdownItem) => {
    setSelectedBranch(item);
  };

  const handleBackToMain = () => {
    setSelectedBranch(null);
  };

  // Handle restaurant setup completion
  const handleRestaurantSetup = () => {
    // Refetch restaurant info after setup
    setInfoLoading(true);
    restaurantService
      .getRestaurantManagementInfo()
      .then(data => {
        setRestaurantInfo(data);
        setInfoLoading(false);
        setInfoError(null);
        // Navigate to overview after successful setup
        navigate('/dashboard/overview');
      })
      .catch(err => {
        logger.error('Restaurant bilgileri alınırken hata', err);
        setInfoError('Restaurant bilgileri alınamadı');
        setInfoLoading(false);
      });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Conditional Sidebar Rendering */}
      {hasRestaurantInfo ? (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          restaurantName={resolvedRestaurantName}
          branchName={branchName}
          isBranchOnly={isBranchOnly}
          onLogout={handleLogout}
          onSelectBranch={handleSelectBranch}
          onBackToMain={handleBackToMain}
        />
      ) : (
        <SetupSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab} restaurantName={''} branchName={null} isBranchOnly={false} onSelectBranch={function (item: RestaurantBranchDropdownItem): void {
              throw new Error('Function not implemented.');
            } } onBackToMain={function (): void {
              throw new Error('Function not implemented.');
            } }        />
      )}
      
      <div className={`flex-1 flex flex-col overflow-hidden ${isRTL ? 'lg:mr-64' : 'lg:ml-64'}`}>
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          branchName={branchName}
          onLogout={handleLogout}
          onSearch={handleSearch}
          onSearchResultClick={handleSearchResultClick}
          isBranchOnly={isBranchOnly}
          onTabChange={handleTabChange}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 pt-24">
          {/* Network Status Bileşeni */}
          <NetworkStatus showAlways={false} />
          
        
         
              {activeTab === 'overview' && <Overview />}
                            {activeTab === 'RestaurantManagement' && <RestaurantManagementSetting />}
              {activeTab === 'ResturantOrders' && <OrdersManagerResturant />}
              {activeTab === 'products' && <ProductsContent  />}
              {activeTab === 'ingredients' && <IngredientsContent />}
              {activeTab === 'branches' && <BranchManagement />}
              {activeTab === 'tables' && <TableManagement selectedBranch={selectedBranch} />}
              {activeTab === 'restaurant-management' && <RestaurantManagement />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'profile' && <Profile />}
              {activeTab === 'subscription' && <Subscription />}
              {activeTab === 'orderTypeResturant' && <OrderTypeResturantComponent />}
              {activeTab === 'ResturantSettings' && <ResturantSettings />}
              {activeTab === 'RecycleBin' && <RecycleBin />}

            {/* branch */}
              {activeTab === 'branchProducts' && <BranchProducts />}
              {activeTab === 'TableManagement' && <BranchTableManagement />}
              {activeTab === 'BranchManagement' && <BranchManagementBranch />}
              {activeTab === 'orderType' && <OrderTypeComponeent />}
              {activeTab === 'Branchorders' && <OrdersManager/>}
              {activeTab === 'BranchSettings' && <BranchSettings />}

      
        </main>
      </div>
    </div>
  );
};

export default Dashboard;