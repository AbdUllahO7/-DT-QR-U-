import React from 'react';
import { Building, Users, Info, Trash2, LucideIcon } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

type ActiveTab = 'restaurants' | 'branches' | 'management' | 'deleted';

interface Tab {
  id: ActiveTab;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const tabs: Tab[] = [
    { id: 'restaurants', label: t('tabs.restaurants'), icon: Building },
    { id: 'branches', label: t('tabs.branches'), icon: Users },
    { id: 'management', label: t('tabs.management'), icon: Info },
    { id: 'deleted', label: t('tabs.deleted'), icon: Trash2 }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === id
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};