import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  List, 
  LayoutGrid, 
  Loader2, 
  RefreshCw, 
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  ShoppingCart,
  ChevronDown,
  Eye,
  Edit3,
  Plus,
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Order, OrderStatus } from '../../../../types/dashboard';
import { logger } from '../../../../utils/logger';
import { orderService } from '../../../../services/orderService';

const Orders: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: 'all', label: t('dashboard.orders.tabs.all'), count: orders.length, icon: ShoppingCart },
    { id: 'pending', label: t('dashboard.orders.tabs.pending'), count: orders.filter(o => o.status === 'pending').length, icon: Clock },
    { id: 'preparing', label: t('dashboard.orders.tabs.preparing'), count: orders.filter(o => o.status === 'preparing').length, icon: AlertCircle },
    { id: 'ready', label: t('dashboard.orders.tabs.ready'), count: orders.filter(o => o.status === 'ready').length, icon: CheckCircle },
    { id: 'delivered', label: t('dashboard.orders.tabs.delivered'), count: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle },
  ];

  const handleViewDetails = (order: Order) => {
    logger.info('View details', { order });
  };


  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const newOrders = await orderService.getOrders();
      setOrders(newOrders);
    } catch (error) {
      logger.error('Error refreshing orders', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Yardımcı: Duruma göre renk sınıfı
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'preparing':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return t('dashboard.orders.status.pending');
      case 'preparing':
        return t('dashboard.orders.status.preparing');
      case 'ready':
        return t('dashboard.orders.status.ready');
      case 'delivered':
        return t('dashboard.orders.status.delivered');
     
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const filteredOrders = orders.filter(order => {
    // Status filter
    if (selectedStatus && order.status !== selectedStatus) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.customerName.toLowerCase().includes(searchLower) ||
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.table.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // İstatistikler
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    avgOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Loader2 className="h-8 w-8 text-primary-500" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400">{t('dashboard.orders.loading')}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('orders.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('orders.description')}
          </p>
        </div>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
            </motion.div>
            {t('dashboard.orders.refresh')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('dashboard.orders.newOrder')}
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.orders.stats.totalOrders')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.orders.stats.totalRevenue')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₺{stats.totalRevenue.toLocaleString('tr-TR')}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.orders.stats.pendingOrders')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ortalama Sipariş</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₺{stats.avgOrderValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Sipariş ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                showFilters
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtreler
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' 
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              <List className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Durum
                  </label>
                  <select
                    title='selectedStatus'
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                  >
                    <option value="">{t('orders.filters.status')}</option>
                    <option value="pending">{t('orders.status.pending')}</option>
                    <option value="preparing">{t('orders.status.preparing')}</option>
                    <option value="ready">{t('orders.status.ready')}</option>
                    <option value="delivered">{t('orders.status.delivered')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('orders.filters.dateRange')}
                  </label>
                  <select
                    title='selectedDateRange'
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                  >
                    <option value="today">{t('orders.filters.today')}</option>
                    <option value="week">{t('orders.filters.lastWeek')}</option>
                    <option value="month">{t('orders.filters.lastMonth')}</option>
                    <option value="year">{t('orders.filters.custom')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('orders.filters.paymentType')}
                  </label>
                  <select
                    title='selectedPaymentType'
                    value={selectedPaymentType}
                    onChange={(e) => setSelectedPaymentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                  >
                    <option value="">Tüm Ödeme Türleri</option>
                    <option value="cash">Nakit</option>
                    <option value="card">Kart</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Orders List/Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {order.customerName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        #{order.orderNumber}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewDetails(order)}
                        className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Masa:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{order.table}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Ürün Sayısı:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{order.items}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Zaman:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(order.orderTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </motion.span>
                    <motion.span 
                      className="text-lg font-bold text-gray-900 dark:text-white"
                      whileHover={{ scale: 1.05 }}
                    >
                      ₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Sipariş #</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Müşteri</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Durum</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Ürün</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Tutar</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Masa</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">Zaman</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          backgroundColor: 'rgba(59, 130, 246, 0.05)',
                          transition: { duration: 0.2 }
                        }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/40"
                      >
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">{order.orderNumber}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{order.customerName}</td>
                        <td className="px-4 py-3">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </motion.span>
                        </td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{order.items}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-semibold">₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{order.table}</td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{formatDate(order.orderTime)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleViewDetails(order)}
                              className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      <AnimatePresence>
        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="mb-4"
            >
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
            </motion.div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm
                ? 'Arama kriterlerinize uygun sipariş bulunamadı.'
                : 'Henüz sipariş bulunmuyor.'}
            </p>
            {searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Aramayı Temizle
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders; 