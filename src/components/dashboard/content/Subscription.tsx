import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Plus, 
  Check, 
  Star, 
  Crown, 
  Zap, 
  Shield, 
  Clock,
  ChevronRight,
  Trash2,
  Edit3,
  CreditCard as CreditCardIcon,
  Calendar,
  Lock,
  AlertCircle,
  Download,
  Receipt,
  TrendingUp,
  Users,
  Settings,
  FileText,
  DollarSign,
  ArrowRight,
  CheckCircle,
  XCircle,
  Info,
  QrCode,
  ShoppingCart,
  HardDrive
} from 'lucide-react';
import Pricing from '../../LandingPage/Pricing';
import { useLanguage } from '../../../contexts/LanguageContext';
import { logger } from '../../../utils/logger';
import { CardData, InvoiceData } from '../../../types/BranchManagement/type';


const Subscription: React.FC = () => {
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';
  const [cards] = useState<CardData[]>([
    {
      id: 1,
      last4: '4242',
      brand: 'Visa',
      expMonth: 12,
      expYear: 2024,
      isDefault: true
    },
    {
      id: 2,
      last4: '8888',
      brand: 'Mastercard',
      expMonth: 6,
      expYear: 2025,
      isDefault: false
    }
  ]);

  const [invoices] = useState<InvoiceData[]>([
    {
      id: 'INV-2024-001',
      date: '2024-12-01',
      amount: 199,
      status: 'paid',
      plan: 'Pro Plan',
      description: 'Aralık 2024 - Pro Plan Aboneliği'
    },
    {
      id: 'INV-2024-002',
      date: '2024-11-01',
      amount: 199,
      status: 'paid',
      plan: 'Pro Plan',
      description: 'Kasım 2024 - Pro Plan Aboneliği'
    },
    {
      id: 'INV-2024-003',
      date: '2024-10-01',
      amount: 199,
      status: 'paid',
      plan: 'Pro Plan',
      description: 'Ekim 2024 - Pro Plan Aboneliği'
    }
  ]);

  const [currentPlan] = useState<string>('pro');
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'usage'>('overview');

  const handleAddCard = () => {
    setIsAddCardModalOpen(true);
  };

  const handleDeleteCard = (id: number) => {
    logger.info('Delete card', { id });
  };

  const handleSetDefault = (id: number) => {
    logger.info('Set default card', { id });
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'basic':
        return <Zap className="h-5 w-5" />;
      case 'pro':
        return <Crown className="h-5 w-5" />;
      case 'enterprise':
        return <Shield className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pro':
        return 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400';
      case 'enterprise':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const tabs = [
    { id: 'overview', label: t('subscription.tabs.overview'), icon: TrendingUp },
    { id: 'billing', label: t('subscription.tabs.billing'), icon: Receipt },
    { id: 'usage', label: t('subscription.tabs.usage'), icon: Users }
  ];

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('subscription.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('subscription.description')}
          </p>
        </div>
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
          <button className={`inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
            <Settings className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('subscription.actions.settings')}
          </button>
          <button className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg transition-colors`}>
            <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('subscription.actions.upgrade')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className={`flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Current Plan Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${getPlanColor(currentPlan)}`}>
                    {getPlanIcon(currentPlan)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                      {currentPlan} Plan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Aktif aboneliğiniz
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">₺199</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">aylık</div>
                </div>
              </div>

              {/* Plan Features */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Durum</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Aktif</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{t('subscription.renewal')}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">15 Aralık 2024</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Kullanıcı</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sınırsız</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Güvenlik</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">SSL korumalı</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  <span>{t('subscription.changePlan')}</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Kullanım Raporu
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CreditCardIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Ödeme Yöntemleri
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Güvenli ödeme kartlarınızı yönetin
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleAddCard}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Kart Ekle
                </button>
              </div>

              <div className="space-y-3">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                      card.isDefault 
                        ? 'border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                    }`}
                    onMouseEnter={() => setSelectedCard(card.id)}
                    onMouseLeave={() => setSelectedCard(null)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        card.isDefault 
                          ? 'bg-primary-100 dark:bg-primary-900/30' 
                          : 'bg-gray-100 dark:bg-gray-600'
                      }`}>
                        <CreditCard className={`h-5 w-5 ${
                          card.isDefault 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {card.brand} •••• {card.last4}
                          </p>
                          {card.isDefault && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
                              <Check className="h-3 w-3 mr-1" />
                              Varsayılan
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Son Kullanma: {card.expMonth}/{card.expYear}
                        </p>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {selectedCard === card.id && (
                        <motion.div 
                          className="flex items-center space-x-1"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                        >
                          {!card.isDefault && (
                            <button
                              onClick={() => handleSetDefault(card.id)}
                              className="p-1.5 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-md transition-colors"
                              title="Varsayılan yap"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCard(card.id)}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors"
                            title="Kartı sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {cards.length === 0 && (
                <div className="text-center py-8">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full w-fit mx-auto mb-3">
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Henüz ödeme kartı eklenmemiş
                  </p>
                  <button
                    onClick={handleAddCard}
                    className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    İlk kartınızı ekleyin
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Ödeme</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₺597</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sonraki Fatura</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">₺199</p>
                  </div>
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kullanım</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">%85</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'billing' && (
          <motion.div
            key="billing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Billing Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fatura Özeti</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Son 12 ayın fatura geçmişi
                  </p>
                </div>
                <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Tümünü İndir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">₺597</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Ödeme</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Fatura</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">3</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ödenen</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bekleyen</div>
                </div>
              </div>
            </div>

            {/* Invoice List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Fatura Geçmişi</h3>
              
              <div className="space-y-4">
                {invoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status === 'paid' ? 'Ödendi' : invoice.status === 'pending' ? 'Bekliyor' : 'Başarısız'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">₺{invoice.amount}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{invoice.plan}</div>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium">
                        <Download className="h-4 w-4" />
                        <span>{t('common.download') || 'Download'}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'usage' && (
          <motion.div
            key="usage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">QR Taramaları</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">1,847</p>
                    <p className="text-xs text-green-600 dark:text-green-400">+12% geçen aya göre</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <QrCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Siparişler</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">234</p>
                    <p className="text-xs text-green-600 dark:text-green-400">+8% geçen aya göre</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kullanıcılar</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Aktif kullanıcı</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Depolama</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">2.1GB / 5GB</p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <HardDrive className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Available Plans */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('subscription.availablePlans')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {t('subscription.selectPlan')}
                  </p>
                </div>
              </div>
              <Pricing />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Card Modal */}
      <AnimatePresence>
        {isAddCardModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div 
                className="fixed inset-0 bg-black/50" 
                onClick={() => setIsAddCardModalOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              
              <motion.div 
                className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Yeni Kart Ekle
                  </h3>
                </div>
                
                <form className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kart Numarası
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Son Kullanma
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        placeholder="123"
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsAddCardModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                    >
                      Ekle
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Subscription; 