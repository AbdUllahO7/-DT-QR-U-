import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { nanoid } from 'nanoid';
import {
  Users,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  QrCode,
  Wifi,
  Clock,
  MapPin,
  Smartphone,
  Utensils,
  Moon,
  Sun
} from 'lucide-react';
import MenuComponent from "../components/dashboard/Branch/Menu/MenuComponent";
import { httpClient } from "../utils/http";
import LanguageSelector from "../components/LanguageSelector";

interface TableInfo {
  valid: boolean;
  tableId: number;
  tableName: string;
  branchId: number;
  isOccupied: boolean;
  capacity: number;
  message: string;
  nextStep: string;
  tokenInfo: {
    issuedAt: string;
    expiresAt: string | null;
  };
}

const TableQR = () => {
  const { qrToken } = useParams();
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [tableInfo, setTableInfo] = useState<TableInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const hasRun = useRef(false);
  const isRTL = language === 'ar';
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const validateAndStartSession = async () => {
      if (!qrToken) return;
      setLoading(true);
      setError(null);

      try {
        // 1. QR doğrulama
        const res = await httpClient.get(`/api/table/qr/${qrToken}`);
        const data = res.data;
        if (!data.valid) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setTableInfo(data);

        // 2. Fingerprint ve customerIdentifier
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const deviceFingerprint = result.visitorId;
        // Get language from localStorage instead of context to ensure consistency
        const preferredLanguage = localStorage.getItem('language') || 'en';
        let customerIdentifier = localStorage.getItem('customerIdentifier');
        if (!customerIdentifier) {
          customerIdentifier = nanoid();
          localStorage.setItem('customerIdentifier', customerIdentifier);
        }

        const sessionRes = await httpClient.post('/api/session/start', {
          qrToken,
          deviceFingerprint,
          preferredLanguage,
          customerIdentifier,
        });

        if (sessionRes.status === 200) {
          const sessionData = sessionRes.data;
          // Using namespaced key to avoid conflicts with dashboard and online menu sessions
          localStorage.setItem('table_session_token', sessionData.sessionToken);
          setSessionStarted(true);
        } else if (sessionRes.status === 404) {
          setError(t('tableQR.error.sessionFeatureComingSoon'));
        } else {
          const sessionData = sessionRes.data;
          setError(sessionData.message || t('tableQR.error.sessionStartFailed'));
        }
      } catch (e: any) {
        console.error('TableQR error:', e);
        if (e?.response?.status === 404) {
          setError(t('tableQR.error.sessionFeatureComingSoon'));
        } else {
          setError(e?.response?.data?.message || t('tableQR.error.sessionStartFailed'));
        }
      } finally {
        setLoading(false);
      }
    };

    validateAndStartSession();
  }, [qrToken, language, t]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <QrCode className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('tableQR.loading.validatingQR')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('tableQR.loading.fetchingTableInfo')}
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            {t('tableQR.error.title')}
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('tableQR.error.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (!tableInfo) return null;

  // If showMenu is true, only show the menu
  if (showMenu) {
    return <MenuComponent branchId={tableInfo.branchId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Utensils className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  {t('tableQR.header.title')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('tableQR.header.subtitle')}
                </p>
              </div>
            </div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">{t('tableQR.header.active')}</span>
              </div>
                 <button
                           onClick={toggleTheme}
                           className="min-w-[44px] min-h-[44px] p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center"
                           title={isDark ? t('theme.toggleToLight') : t('theme.toggleToDark')}
                           aria-label={t('accessibility.theme')}
                         >
                           {isDark ? (
                             <Sun className="h-5 w-5" />
                           ) : (
                             <Moon className="h-5 w-5" />
                           )}
                         </button>
              <LanguageSelector branchId={tableInfo.branchId} useMenuLanguages={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white text-center">
            <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
              <MapPin className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{t('tableQR.welcome.greeting')}</h2>
            <p className="text-blue-100 text-lg">
              {isRTL 
                ? `${t('tableQR.welcome.connectedToTable')} ${tableInfo.tableName}`
                : `${t('tableQR.welcome.connectedToTable')} ${tableInfo.tableName}`
              }
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Table Status */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  tableInfo.isOccupied 
                    ? 'bg-red-100 dark:bg-red-900/30' 
                    : 'bg-green-100 dark:bg-green-900/30'
                }`}>
                  {tableInfo.isOccupied ? (
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('tableQR.welcome.tableStatus')}</h3>
                <p className={`font-medium ${
                  tableInfo.isOccupied 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {tableInfo.isOccupied ? t('tableQR.welcome.occupied') : t('tableQR.welcome.available')}
                </p>
              </div>

              {/* Capacity */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('tableQR.welcome.capacity')}</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {tableInfo.capacity} {tableInfo.capacity === 1 ? t('tableQR.welcome.person') : t('tableQR.welcome.people')}
                </p>
              </div>

              {/* Session Status */}
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  sessionStarted 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  {sessionStarted ? (
                    <Wifi className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('tableQR.welcome.session')}</h3>
                <p className={`font-medium ${
                  sessionStarted 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {sessionStarted ? t('tableQR.welcome.sessionActive') : t('tableQR.welcome.sessionPending')}
                </p>
              </div>
            </div>

            {/* Message */}
         
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => setShowMenu(true)}
            className={`bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}
          >
            <Utensils className="h-5 w-5" />
            <span>{t('tableQR.actions.viewMenu')}</span>
          </button>
          
          <button className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-4 px-6 rounded-2xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <Smartphone className="h-5 w-5" />
            <span>{t('tableQR.actions.callWaiter')}</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <div className={`inline-flex items-center bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <QrCode className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('tableQR.footer.connectedViaQR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableQR;