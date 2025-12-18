import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Shield, Calendar, Lock, Eye, Cookie, AlertCircle } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('legal.privacy.title')}
          </h1>
          <div className={`flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400`}>
            <Calendar className="w-4 h-4" />
            <span>{t('legal.privacy.lastUpdated')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 space-y-8">

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('legal.privacy.sections.introduction.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.privacy.sections.introduction.content')}
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <div className={`flex items-center gap-3 mb-4 `}>
                <Eye className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('legal.privacy.sections.dataCollection.title')}
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.sections.dataCollection.content')}
              </p>
              <ul className={`space-y-2 ${isRTL ? 'mr-6' : 'ml-6'}`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isRTL ? '•' : '•'} {t(`legal.privacy.sections.dataCollection.items.${i}`)}
                  </li>
                ))}
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('legal.privacy.sections.dataUsage.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.sections.dataUsage.content')}
              </p>
              <ul className={`space-y-2 ${isRTL ? 'mr-6' : 'ml-6'}`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isRTL ? '•' : '•'} {t(`legal.privacy.sections.dataUsage.items.${i}`)}
                  </li>
                ))}
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <div className={`flex items-center gap-3 mb-4 `}>
                <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('legal.privacy.sections.dataSecurity.title')}
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.privacy.sections.dataSecurity.content')}
              </p>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('legal.privacy.sections.dataSharing.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.sections.dataSharing.content')}
              </p>
              <ul className={`space-y-2 ${isRTL ? 'mr-6' : 'ml-6'}`}>
                {[0, 1, 2].map((i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isRTL ? '•' : '•'} {t(`legal.privacy.sections.dataSharing.items.${i}`)}
                  </li>
                ))}
              </ul>
            </section>

            {/* Cookies */}
            <section>
              <div className={`flex items-center gap-3 mb-4 `}>
                <Cookie className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('legal.privacy.sections.cookies.title')}
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.privacy.sections.cookies.content')}
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('legal.privacy.sections.userRights.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.sections.userRights.content')}
              </p>
              <ul className={`space-y-2 ${isRTL ? 'mr-6' : 'ml-6'}`}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isRTL ? '•' : '•'} {t(`legal.privacy.sections.userRights.items.${i}`)}
                  </li>
                ))}
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('legal.privacy.sections.childrenPrivacy.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.privacy.sections.childrenPrivacy.content')}
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('legal.privacy.sections.changes.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('legal.privacy.sections.changes.content')}
              </p>
            </section>

            {/* Contact */}
            <section className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6">
                <div className={`flex items-start gap-4 `}>
                  <AlertCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t('legal.privacy.sections.contact.title')}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {t('legal.privacy.sections.contact.content')}
                    </p>
                    <p className="text-primary-600 dark:text-primary-400 mt-2">
                      {t('footer.contact.email')}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
