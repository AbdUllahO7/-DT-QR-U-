import React, { useState } from 'react';
import { Mail, Send, LockKeyhole } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
// Assuming this is the correct path - path corrected

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t, isRTL } = useLanguage(); // --- NEW ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4"
      dir={isRTL ? 'rtl' : 'ltr'} 
    >
      <div className="w-full max-w-md">
        {submitted ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <Mail className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('resetPassword.submitted.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t('resetPassword.submitted.line1')}
              <span className="font-medium text-gray-900 dark:text-white"> {email}</span>.
              {' '}
              {t('resetPassword.submitted.line2')}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-4">
                <LockKeyhole className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('resetPassword.form.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t('resetPassword.form.subtitle')}
              </p>
            </div>
            
            <div className="relative">
              <label
                htmlFor="email-reset"
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
                  id="email-reset"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('common.emailPlaceholder')}
                  required
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <Send className="w-5 h-5" />
              {t('resetPassword.form.button')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;