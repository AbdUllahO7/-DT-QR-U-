import React from 'react';
import { Edit2, Trash2, DollarSign, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Extra } from '../../../types/Extras/type';

interface ExtraCardProps {
  extra: Extra;
  onEdit: (extra: Extra) => void;
  onDelete: (extra: Extra) => void;
}

export const ExtraCard: React.FC<ExtraCardProps> = ({ extra, onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <div className="group relative flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-900 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
      {/* Image */}
      <div className="w-16 h-16 flex-shrink-0 rounded-md bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {extra.imageUrl ? (
          <img src={extra.imageUrl} alt={extra.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate pr-4" title={extra.name}>
            {extra.name}
          </h4>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${extra.status ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <p className="text-xs text-gray-500 truncate mb-1.5">
          {extra.description || t('extrasManagement.extras.noDescription')}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="w-3 h-3 mr-0.5 text-gray-400" />
            {extra.basePrice.toFixed(2)}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(extra)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-600"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(extra)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
