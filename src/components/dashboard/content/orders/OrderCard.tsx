import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, MapPin, ShoppingCart, MoreVertical, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { OrderCardProps, OrderData } from '../../../../types/BranchManagement/type';



const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onStatusChange }) => {
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const getStatusColor = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusText = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return t('orders.status.pending');
      case 'preparing':
        return t('orders.status.preparing');
      case 'ready':
        return t('orders.status.ready');
      case 'delivered':
        return t('orders.status.delivered');
      case 'cancelled':
        return t('orders.status.cancelled');
      default:
        return status;
    }
  };

  const getStatusIcon = (status: OrderData['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'preparing':
        return <Clock className="h-3 w-3" />;
      case 'ready':
        return <CheckCircle className="h-3 w-3" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <motion.div 
              className="flex items-center space-x-4"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {order.customerName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('orders.orderNumber')} #{order.orderNumber}
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-3">
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(order.orderTime)}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('orders.table')} {order.table}
                  </span>
                </div>
                <div className="flex items-center">
                  <ShoppingCart className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {order.items} {t('orders.items')}
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
              >
                {getStatusIcon(order.status)}
                <span className="ml-1">{getStatusText(order.status)}</span>
              </motion.span>
              <motion.span 
                className="text-lg font-bold text-gray-900 dark:text-white"
                whileHover={{ scale: 1.05 }}
              >
                ₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </motion.span>
            </div>
          </div>

          <div className="relative ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <MoreVertical className="h-5 w-5" />
            </motion.button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-20 border border-gray-200 dark:border-gray-600"
                >
                  <div className="py-1">
                    <motion.button
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      onClick={() => {
                        onViewDetails(order);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t('orders.actions.viewDetails')}
                    </motion.button>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <>
                        {order.status === 'pending' && (
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            onClick={() => {
                              onStatusChange(order.id, 'preparing');
                              setShowDropdown(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {t('dashboard.orders.status.preparing')}
                          </motion.button>
                        )}
                        {order.status === 'preparing' && (
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                            onClick={() => {
                              onStatusChange(order.id, 'ready');
                              setShowDropdown(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t('dashboard.orders.status.ready')}
                          </motion.button>
                        )}
                        {order.status === 'ready' && (
                          <motion.button
                            whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                            onClick={() => {
                              onStatusChange(order.id, 'delivered');
                              setShowDropdown(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Teslim Edildi
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                          onClick={() => {
                            onStatusChange(order.id, 'cancelled');
                            setShowDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          İptal Et
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full -translate-y-10 translate-x-10"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default OrderCard; 