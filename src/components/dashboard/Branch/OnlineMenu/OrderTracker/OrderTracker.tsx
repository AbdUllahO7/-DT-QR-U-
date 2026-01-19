import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  RefreshCw,
  ArrowLeft,
  Receipt,
  Calendar,
  MapPin,
  User,
  FileText,
  Home,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { orderService } from '../../../../../services/Branch/OrderService';
import { OrderTrackingInfo } from '../../../../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../../../../types/Orders/type';
import OrderStatusTimeline from './OrderStatusTimeline';
import EstimatedTimeDisplay from './EstimatedTimeDisplay';
import OrderItemsList from './OrderItemsList';

const OrderTracker: React.FC = () => {
  const { orderTag } = useParams<{ orderTag: string }>();
  const navigate = useNavigate();
  const { t, language, isRTL } = useLanguage();

  const [trackingInfo, setTrackingInfo] = useState<OrderTrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Default estimated time if not provided
  const DEFAULT_ESTIMATED_MINUTES = 20;

  const fetchTrackingInfo = useCallback(async (showRefreshIndicator = false) => {
    if (!orderTag) {
      setError(t('orderTracker.error.noOrderTag'));
      setLoading(false);
      return;
    }

    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await orderService.trackOrder(orderTag);
      setTrackingInfo(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching tracking info:', err);
      setError(err.message || t('orderTracker.error.fetchFailed'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderTag, t]);

  // Initial fetch
  useEffect(() => {
    fetchTrackingInfo();
  }, [fetchTrackingInfo]);

  // Auto-refresh every 15 seconds for active orders
  useEffect(() => {
    if (!trackingInfo) return;

    const status = trackingInfo.statusCode as OrderStatusEnums;

    // FIX APPLIED HERE:
    // We removed 'Delivered' (4) from this list so the tracker continues 
    // to refresh until it reaches 'Completed' (5).
    const isTerminalState =
      status === OrderStatusEnums.Completed || // 5
      status === OrderStatusEnums.Cancelled || // 6
      status === OrderStatusEnums.Rejected;    // 7

    // If the order is truly finished, stop refreshing
    if (isTerminalState) return;

    const interval = setInterval(() => {
      fetchTrackingInfo(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [trackingInfo, fetchTrackingInfo]);

  const handleCopyOrderTag = async () => {
    if (!orderTag) return;
    try {
      await navigator.clipboard.writeText(orderTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  // Loading State
  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('orderTracker.loading.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('orderTracker.loading.subtitle')}
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {t('orderTracker.error.title')}
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => fetchTrackingInfo()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('orderTracker.error.retry')}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              {t('orderTracker.error.goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!trackingInfo) return null;

  const currentStatus = trackingInfo.statusCode as OrderStatusEnums;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('orderTracker.back')}</span>
            </button>

            <button
              onClick={() => fetchTrackingInfo(true)}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-sm">{t('orderTracker.refresh')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Order Tag Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500 rounded-3xl p-6 text-white shadow-xl"
        >
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="text-orange-100 text-sm mb-1">{t('orderTracker.orderNumber')}</p>
              <h1 className="text-3xl font-bold tracking-wider">#{trackingInfo.orderTag}</h1>
            </div>
            <button
              onClick={handleCopyOrderTag}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              title={t('orderTracker.copyOrderTag')}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-orange-100 text-xs mt-4">
              {t('orderTracker.lastUpdated')}: {formatDate(lastUpdated.toISOString())}
            </p>
          )}
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <h2 className={`text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 ${isRTL ? 'text-right' : ''}`}>
            {t('orderTracker.statusTitle')}
          </h2>
          <OrderStatusTimeline
            currentStatus={currentStatus}
            isRTL={isRTL}
            t={t}
          />
        </motion.div>

        {/* Estimated Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EstimatedTimeDisplay
            orderCreatedAt={trackingInfo.createdAt}
            estimatedMinutes={DEFAULT_ESTIMATED_MINUTES}
            currentStatus={currentStatus}
            t={t}
            isRTL={isRTL}
          />
        </motion.div>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Order Type */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('orderTracker.orderType')}</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{trackingInfo.orderTypeName}</p>
              </div>
            </div>

            {/* Order Date */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('orderTracker.orderDate')}</p>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {formatDate(trackingInfo.createdAt)}
                </p>
              </div>
            </div>

            {/* Customer Name */}
            {trackingInfo.customerName && (
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('orderTracker.customerName')}</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{trackingInfo.customerName}</p>
                </div>
              </div>
            )}

            {/* Table */}
            {trackingInfo.tableName && (
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('orderTracker.table')}</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{trackingInfo.tableName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {trackingInfo.notes && (
            <div className={`mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 ${isRTL ? 'text-right' : ''}`}>
              <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <FileText className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('orderTracker.notes')}</p>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                {trackingInfo.notes}
              </p>
            </div>
          )}
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <OrderItemsList
            items={trackingInfo.items}
            currency="TRY"
            t={t}
            isRTL={isRTL}
          />

          {/* Total */}
          <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t('orderTracker.total')}
            </span>
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatPrice(trackingInfo.totalPrice)}
            </span>
          </div>
        </motion.div>

        {/* Back to Menu Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className={`w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl font-semibold hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-lg ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Home className="w-5 h-5" />
            <span>{t('orderTracker.backToMenu')}</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracker;