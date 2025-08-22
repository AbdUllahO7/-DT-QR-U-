import React from 'react';
import { QrCode, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: t('footer.sections.product.links.features'), href: '#features' },
      { label: t('footer.sections.product.links.pricing'), href: '#pricing' },
      { label: t('footer.sections.product.links.demo'), href: '#contact' },
      { label: t('footer.sections.product.links.api'), href: '#' }
    ],
    company: [
      { label: t('footer.sections.company.links.about'), href: '#' },
      { label: t('footer.sections.company.links.blog'), href: '#' },
      { label: t('footer.sections.company.links.careers'), href: '#' },
      { label: t('footer.sections.company.links.contact'), href: '#contact' }
    ],
    support: [
      { label: t('footer.sections.support.links.helpCenter'), href: '#' },
      { label: t('footer.sections.support.links.faq'), href: '#faq' },
      { label: t('footer.sections.support.links.liveSupport'), href: '#' },
      { label: t('footer.sections.support.links.tutorials'), href: '#' }
    ],
    legal: [
      { label: t('footer.sections.legal.links.privacy'), href: '#' },
      { label: t('footer.sections.legal.links.terms'), href: '#' },
      { label: t('footer.sections.legal.links.cookies'), href: '#' },
      { label: t('footer.sections.legal.links.gdpr'), href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const handleLinkClick = (href: string): void => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} mb-6`}>
              <QrCode className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">{t('brand.name')}</span>
            </div>
            
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              {t('footer.description')}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">{t('footer.contact.phone')}</span>
              </div>
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">{t('footer.contact.email')}</span>
              </div>
              <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-400">{t('footer.contact.address')}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''} mt-6`}>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.sections.product.title')}</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.sections.company.title')}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.sections.support.title')}</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-6 mt-8">{t('footer.sections.legal.title')}</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container-max py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('footer.newsletter.title')}</h3>
              <p className="text-gray-400">{t('footer.newsletter.subtitle')}</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className={`flex-1 md:w-80 px-4 py-3 bg-gray-700 border border-gray-600 ${
                  isRTL ? 'rounded-r-lg' : 'rounded-l-lg'
                } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
              />
              <button className={`px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white ${
                isRTL ? 'rounded-l-lg' : 'rounded-r-lg'
              } transition-colors duration-300`}>
                {t('footer.newsletter.button')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container-max py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} {t('brand.name')}. {t('footer.bottom.copyright')}
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>{t('footer.bottom.madeWith')}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 