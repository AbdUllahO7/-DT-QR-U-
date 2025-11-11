import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Save,
  XCircle,
  Grid,
  Users,
  Building,
  Settings,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import TableCard from './TableCard';
import { TableData } from '../../../../types/BranchManagement/type';

interface CategoryData {
  id: number;
  categoryName: string;
  colorCode: string;
  iconClass: string;
  displayOrder: number;
  isActive: boolean;
  branchId: number;
  tableCount?: number;
}

interface CategorySectionProps {
  category: CategoryData;
  tables: TableData[];
  isExpanded: boolean;
  isEditing: boolean;
  isToggling: boolean;
  editingTable: number | null;
  showAddTable: number | null;
  toggleLoading: { tables: Set<number> };
  onToggleExpansion: (categoryId: number) => void;
  onStartEditing: (categoryId: number) => void;
  onCancelEditing: () => void;
  onUpdateCategory: (categoryId: number, updatedData: Partial<CategoryData>) => Promise<void>;
  onDeleteCategory: (categoryId: number) => Promise<void>;
  onToggleCategoryStatus: (categoryId: number, newStatus: boolean) => Promise<void>;
  onCategoryChange: (categoryId: number, updatedData: Partial<CategoryData>) => void;
  onShowAddTable: (categoryId: number) => void;
  onHideAddTable: () => void;
  onAddTable: (categoryId: number) => Promise<void>;
  onStartTableEdit: (tableId: number) => void;
  onCancelTableEdit: () => void;
  onUpdateTable: (tableId: number, updatedData: Partial<TableData>) => Promise<void>;
  onDeleteTable: (tableId: number) => Promise<void>;
  onToggleTableStatus: (tableId: number, newStatus: boolean) => Promise<void>;
  onToggleTableOccupation: (tableId: number, isOccupied: boolean) => Promise<void>;
  onShowQRCode: (table: TableData) => void;
  onTableChange: (tableId: number, updatedData: Partial<TableData>) => void;
  onClearTable: (tableId: number) => Promise<void>;
  newTable: {
    menuTableName: string;
    capacity: number;
    isActive: boolean;
  };
  onNewTableChange: (updatedData: Partial<{
    menuTableName: string;
    capacity: number;
    isActive: boolean;
  }>) => void;
}

// Modern Toggle Switch Component
const ToggleSwitch: React.FC<{
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  onLabel?: string;
  offLabel?: string;
}> = ({ 
  isOn, 
  onToggle, 
  disabled = false, 
  loading = false, 
  size = 'md',
  showLabel = false,
  onLabel = 'Active',
  offLabel = 'Inactive'
}) => {
  const { isRTL } = useLanguage();
  
  const sizes = {
    sm: { switch: 'w-9 h-5', knob: 'w-4 h-4', translateX: 16 },
    md: { switch: 'w-11 h-6', knob: 'w-5 h-5', translateX: 20 },
    lg: { switch: 'w-14 h-7', knob: 'w-6 h-6', translateX: 28 }
  };

  const currentSize = sizes[size];

  // Calculate transform for knob based on state and direction
  const getKnobTransform = () => {
    if (isRTL) {
      // RTL: flip the whole switch, so active means knob on left
      return isOn 
        ? `scaleX(-1) translateX(${currentSize.translateX}px)` 
        : 'scaleX(-1) translateX(2px)';
    } else {
      // LTR: normal behavior
      return isOn 
        ? `translateX(${currentSize.translateX}px)` 
        : 'translateX(2px)';
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled || loading}
      className={`flex items-center gap-2 group ${isRTL ? 'flex-row-reverse' : ''}`}
      title={isOn ? onLabel : offLabel}
    >
      <div
        className={`
          ${currentSize.switch}
          relative inline-flex items-center rounded-full
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOn 
            ? 'bg-green-500 dark:bg-green-600' 
            : 'bg-gray-300 dark:bg-gray-600'
          }
        `}
        style={isRTL ? { transform: 'scaleX(-1)' } : undefined}
      >
        {/* Sliding Knob */}
        <span
          className={`
            ${currentSize.knob}
            rounded-full bg-white
            shadow-lg transition-transform duration-300 ease-in-out
            flex items-center justify-center
          `}
          style={{ transform: getKnobTransform() }}
        >
          {loading && (
            <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
          )}
        </span>
      </div>
      
      {showLabel && (
        <span
          className={`
            text-xs font-medium transition-colors whitespace-nowrap
            ${isOn 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-500 dark:text-gray-400'
            }
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {isOn ? onLabel : offLabel}
        </span>
      )}
    </button>
  );
};

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  tables,
  isExpanded,
  isEditing,
  isToggling,
  editingTable,
  showAddTable,
  toggleLoading,
  onToggleExpansion,
  onStartEditing,
  onCancelEditing,
  onUpdateCategory,
  onDeleteCategory,
  onToggleCategoryStatus,
  onCategoryChange,
  onShowAddTable,
  onHideAddTable,
  onAddTable,
  onStartTableEdit,
  onCancelTableEdit,
  onUpdateTable,
  onDeleteTable,
  onToggleTableStatus,
  onToggleTableOccupation,
  onShowQRCode,
  onTableChange,
  newTable,
  onNewTableChange,
  onClearTable
}) => {
  const { t, isRTL } = useLanguage();

  const getIconComponent = (iconClass: string): JSX.Element => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      table: Grid,
      users: Users,
      grid: Building,
      building: Building,
      settings: Settings
    };
    const IconComponent = iconMap[iconClass] || Grid;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={() => !isEditing && onToggleExpansion(category.id)}
      >
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
              <div 
                className="p-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${category.colorCode}20`, color: category.colorCode }}
              >
                {getIconComponent(category.iconClass)}
              </div>
            </div>

            {isEditing ? (
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <input
                  type="text"
                  value={category.categoryName}
                  onChange={(e) => onCategoryChange(category.id, { categoryName: e.target.value })}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onClick={(e) => e.stopPropagation()}
                  placeholder={t('BranchTableManagement.categoryNamePlaceholder')}
                />
                <input
                  title='colorCode'
                  type="color"
                  value={category.colorCode}
                  onChange={(e) => onCategoryChange(category.id, { colorCode: e.target.value })}
                  className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {category.categoryName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tables.length} {t('BranchTableManagement.tablesCount')}
                </p>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Enhanced Toggle Switch for Category Status */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center"
            >
              <ToggleSwitch
                isOn={category.isActive}
                onToggle={() => onToggleCategoryStatus(category.id, !category.isActive)}
                disabled={isToggling}
                loading={isToggling}
                size="md"
                showLabel={true}
                onLabel={t('BranchTableManagement.active')}
                offLabel={t('BranchTableManagement.inactive')}
              />
            </div>

            {isEditing ? (
              <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateCategory(category.id, category);
                  }}
                  className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                  title={t('BranchTableManagement.save')}
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelEditing();
                  }}
                  className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  title={t('BranchTableManagement.cancel')}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEditing(category.id);
                  }}
                  className="p-1.5 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded transition-colors"
                  title={t('BranchTableManagement.edit')}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                  }}
                  className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                  title={t('BranchTableManagement.delete')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onShowAddTable(category.id)}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 text-sm transition-colors shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="h-4 w-4" />
              {t('BranchTableManagement.addTable')}
            </button>
          </div>

          {showAddTable === category.id && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('BranchTableManagement.tableNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={newTable.menuTableName}
                    onChange={(e) => onNewTableChange({ menuTableName: e.target.value })}
                    placeholder={t('BranchTableManagement.tableNamePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('BranchTableManagement.capacityLabel')}
                  </label>
                  <input
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) => onNewTableChange({ capacity: parseInt(e.target.value) || 1 })}
                    placeholder={t('BranchTableManagement.capacityPlaceholder')}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className={`flex gap-2 items-end ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => onAddTable(category.id)}
                    className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 flex items-center gap-2 transition-colors shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Save className="h-4 w-4" />
                    {t('BranchTableManagement.save')}
                  </button>
                  <button
                    onClick={onHideAddTable}
                    className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 flex items-center gap-2 transition-colors shadow-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <XCircle className="h-4 w-4" />
                    {t('BranchTableManagement.cancel')}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="p-4">
            {tables.length === 0 ? (
              <div className="text-center py-8">
                <Grid className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">{t('BranchTableManagement.noTables')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onClearTable={onClearTable}
                    isEditing={editingTable === table.id}
                    isToggling={toggleLoading.tables.has(table.id)}
                    onEdit={() => onStartTableEdit(table.id)}
                    onCancelEdit={onCancelTableEdit}
                    onUpdate={onUpdateTable}
                    onDelete={onDeleteTable}
                    onToggleStatus={onToggleTableStatus}
                    onToggleOccupation={onToggleTableOccupation}
                    onShowQRCode={onShowQRCode}
                    onTableChange={onTableChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySection;