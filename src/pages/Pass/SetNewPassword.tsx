import React, { useState, useEffect } from 'react';
import { 
  LockKeyhole, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';

const COOLDOWN_SECONDS = 60;
const COOLDOWN_KEY = 'setNewPasswordCooldown';

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  
  const { t, isRTL } = useLanguage();
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate(); // Not used currently, but good to have

  // --- Cooldown Timer Logic ---
  useEffect(() => {
    let interval: number; // FIXED: Changed from NodeJS.Timeout to number for browser compatibility

    const checkCooldown = () => {
      const lastSubmitTime = localStorage.getItem(COOLDOWN_KEY);
      if (lastSubmitTime) {
        const timePassed = (Date.now() - parseInt(lastSubmitTime, 10)) / 1000;
        const timeLeft = COOLDOWN_SECONDS - timePassed;

        if (timeLeft > 0) {
          setCooldownTime(Math.ceil(timeLeft));
          interval = window.setInterval(() => { // Added window. to be explicit
            setCooldownTime((prevTime) => {
              if (prevTime <= 1) {
                clearInterval(interval);
                localStorage.removeItem(COOLDOWN_KEY);
                return 0;
              }
              return prevTime - 1;
            });
          }, 1000);
        } else {
          localStorage.removeItem(COOLDOWN_KEY);
        }
      }
    };

    checkCooldown();
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loading || cooldownTime > 0) return;

    // --- Validation ---
    if (newPassword.length < 8) {
      setError(t('setNewPassword.form.errorLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('setNewPassword.form.errorMatch'));
      return;
    }

    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    if (!token || !userId) {
      setError(t('setNewPassword.form.errorInvalidLink'));
      return;
    }

    setLoading(true);

    try {
      await userService.resetPassword({
        userId,
        token,
        newPassword: newPassword,
        newPasswordConfirmation: confirmPassword
      });
      
      setSubmitted(true);
      
      // --- Set cooldown on success ---
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      setCooldownTime(COOLDOWN_SECONDS);
      
    } catch (err: any) {
      console.error("Failed to reset password:", err);
      
 
      
      setError(err.response?.data?.details?.message ); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md">
          
          <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/"
            className={`inline-flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200`}
          >
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t('pages.login.backToHome')}</span>
          </Link>
        </motion.div>

        {submitted ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('setNewPassword.submitted.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('setNewPassword.submitted.message')}
            </p>
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t('setNewPassword.submitted.loginButton')}
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                <LockKeyhole className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('setNewPassword.form.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t('setNewPassword.form.subtitle')}
              </p>
            </div>
            
            {/* Inputs */}
            <div className="relative">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('setNewPassword.form.newPassword')}
              </label>
              <div className="relative">
                <span className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                  <LockKeyhole className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  required
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('setNewPassword.form.confirmPassword')}
              </label>
              <div className="relative">
                <span className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                  <LockKeyhole className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  required
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300`}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-500 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || cooldownTime > 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldownTime > 0 ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.wait')} ({cooldownTime}s)
                </>
              ) : (
                <Save className="w-5 h-5" />
              )}
              {!loading && cooldownTime <= 0 && t('setNewPassword.form.button')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SetNewPassword;