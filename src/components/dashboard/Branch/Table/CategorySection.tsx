import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
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
import { CreateMenuTableDto, UpdateTableCategoryDto } from '../../../../services/Branch/branchTableService';
import { useLanguage } from '../../../../contexts/LanguageContext';
import TableCard from './TableCard';

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

interface TableData {
  id: number;
  menuTableName: string;
  menuTableCategoryId: number;
  capacity: number;
  isActive: boolean;
  isOccupied: boolean;
  displayOrder: number;
  rowVersion?: string;
  qrCodeUrl?: string;
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
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
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
                  className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded"
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

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCategoryStatus(category.id, !category.isActive);
              }}
              disabled={isToggling}
              className="flex items-center gap-1"
              title={category.isActive ? t('BranchTableManagement.deactivate') : t('BranchTableManagement.activate')}
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              ) : category.isActive ? (
                <ToggleRight className="h-5 w-5 text-green-500" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {isEditing ? (
              <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateCategory(category.id, category);
                  }}
                  className="p-1 text-green-600 hover:text-green-800"
                  title={t('BranchTableManagement.save')}
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelEditing();
                  }}
                  className="p-1 text-gray-600 hover:text-gray-800"
                  title={t('BranchTableManagement.cancel')}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className={`flex gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEditing(category.id);
                  }}
                  className="p-1 text-yellow-600 hover:text-yellow-800"
                  title={t('BranchTableManagement.edit')}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCategory(category.id);
                  }}
                  className="p-1 text-red-600 hover:text-red-800"
                  title={t('BranchTableManagement.delete')}
                >
                  <Trash2 className="h-4 w-4" />
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
              className={`px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="h-4 w-4" />
              {t('BranchTableManagement.addTable')}
            </button>
          </div>

          {showAddTable === category.id && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    value={newTable.menuTableName}
                    onChange={(e) => onNewTableChange({ menuTableName: e.target.value })}
                    placeholder={t('BranchTableManagement.tableNamePlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) => onNewTableChange({ capacity: parseInt(e.target.value) || 1 })}
                    placeholder={t('BranchTableManagement.capacityPlaceholder')}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => onAddTable(category.id)}
                    className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <Save className="h-4 w-4" />
                    {t('BranchTableManagement.save')}
                  </button>
                  <button
                    onClick={onHideAddTable}
                    className={`px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
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
                <Grid className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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