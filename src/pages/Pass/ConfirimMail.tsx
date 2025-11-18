import React, { useState, useEffect } from 'react'; // --- UPDATED ---
import { 
  Mail, 
  Send, 
  CheckCircle, 
  ArrowLeft, 
  Loader2,
  AlertCircle 
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { userService } from '../../services/userService';

const COOLDOWN_SECONDS = 60;
const COOLDOWN_KEY = 'confirmMailCooldown';

const ConfirmMail = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0); 
  const { t, isRTL } = useLanguage();
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  useEffect(() => {
   let interval: number;

    const checkCooldown = () => {
      const lastSubmitTime = localStorage.getItem(COOLDOWN_KEY);
      if (lastSubmitTime) {
        const timePassed = (Date.now() - parseInt(lastSubmitTime, 10)) / 1000;
        const timeLeft = COOLDOWN_SECONDS - timePassed;

        if (timeLeft > 0) {
          setCooldownTime(Math.ceil(timeLeft));
          interval = setInterval(() => {
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
    if (loading || cooldownTime > 0) return; 

    setLoading(true);
    setError(null);

    try {
      await userService.resendConfirmation(email);
      setSubmitted(true);
      
      localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
      setCooldownTime(COOLDOWN_SECONDS);
      const interval = setInterval(() => {
        setCooldownTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            localStorage.removeItem(COOLDOWN_KEY);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

    } catch (err : any) {
      console.error('Failed to resend confirmation:', err);
      setError(err.response.data.details.message); 
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
            <Mail className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('confirmMail.submitted.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('confirmMail.submitted.line1')}
              <span className="font-medium text-gray-900 dark:text-white"> {email}</span>.
              {' '}
              {t('confirmMail.submitted.line2')}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('confirmMail.form.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t('confirmMail.form.subtitle')}
              </p>
            </div>
            
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

            <div className="relative">
              <label
                htmlFor="email-confirm"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t('common.emailAddress')}
              </label>
              <div className="relative">
                <span className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center`}>
                  <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </span>
                <input
                  type="email"
                  id="email-confirm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('common.emailPlaceholder')}
                  required
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cooldownTime > 0} 
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldownTime > 0 ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('common.wait')} ({cooldownTime}s)
                </>
              ) : (
                <Send className="w-5 h-5" />
              )}
              {!loading && cooldownTime <= 0 && t('confirmMail.form.button')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConfirmMail;