import React, { useState } from 'react';
import {
  Eye, XCircle, Clock, Package, AlertCircle, MapPin, Phone, User, Truck,
  Home, CheckCircle, Printer, Calendar, Hash, ShoppingBag, MessageSquare,
  DollarSign, TrendingUp, Type, Maximize2, ChevronDown, ChevronUp,
  Settings, EyeOff, Droplets, Plus
} from 'lucide-react';
import { orderService } from '../../../../services/Branch/OrderService';
import { BranchOrder, Order } from '../../../../types/BranchManagement/type';
import { OrderStatusEnums } from '../../../../types/Orders/type';
import OrderStatusUtils from '../../../../utils/OrderStatusUtils';
import { OrderPrintService } from './OrderPrintService';
import { useCurrency } from '../../../../hooks/useCurrency';

interface OrderDetailsModalProps {
  show: boolean;
  order: Order | null;
  viewMode: 'pending' | 'branch' | 'deletedOrders';
  lang: string;
  onClose: () => void;
  t: (key: string) => string;
}

type ViewDensity = 'compact' | 'comfortable' | 'spacious';
type BlurIntensity = 'none' | 'light' | 'medium' | 'heavy';

interface SectionVisibility {
  stats: boolean;
  customer: boolean;
  delivery: boolean;
  notes: boolean;
  items: boolean;
  pricing: boolean;
  timeline: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  show,
  order,
  viewMode,
  lang,
  onClose,
  t
}) => {
  const currency = useCurrency();

  // Font size state
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // View density state
  const [viewDensity, setViewDensity] = useState<ViewDensity>('comfortable');
  
  // Blur intensity state
  const [blurIntensity, setBlurIntensity] = useState<BlurIntensity>('medium');
  
  // Section visibility state
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({
    stats: true,
    customer: true,
    delivery: true,
    notes: true,
    items: true,
    pricing: true,
    timeline: true
  });
  
  // Settings panel toggle
  const [showSettings, setShowSettings] = useState(false);
  
  const fontSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };
  
  const densityClasses = {
    compact: 'space-y-2 p-3',
    comfortable: 'space-y-4 p-4',
    spacious: 'space-y-6 p-6'
  };
  
  const densityPadding = {
    compact: 'p-2',
    comfortable: 'p-3',
    spacious: 'p-4'
  };
  
  const densityGap = {
    compact: 'gap-1',
    comfortable: 'gap-2',
    spacious: 'gap-3'
  };
  
  const blurClasses = {
    none: 'backdrop-blur-none',
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl'
  };
  
  const blurOpacity = {
    none: 'bg-black/40',
    light: 'bg-black/50',
    medium: 'bg-black/60',
    heavy: 'bg-black/70'
  };
  
  const cycleFontSize = () => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'small';
    });
  };
  
  const cycleViewDensity = () => {
    setViewDensity(prev => {
      if (prev === 'compact') return 'comfortable';
      if (prev === 'comfortable') return 'spacious';
      return 'compact';
    });
  };
  
  const cycleBlurIntensity = () => {
    setBlurIntensity(prev => {
      if (prev === 'none') return 'light';
      if (prev === 'light') return 'medium';
      if (prev === 'medium') return 'heavy';
      return 'none';
    });
  };
  
  const toggleSection = (section: keyof SectionVisibility) => {
    setSectionVisibility(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const toggleAllSections = (visible: boolean) => {
    setSectionVisibility({
      stats: visible,
      customer: visible,
      delivery: visible,
      notes: visible,
      items: visible,
      pricing: visible,
      timeline: visible
    });
  };
  
  if (!show || !order) return null;
  
  const status = viewMode === 'branch' 
    ? orderService.parseOrderStatus((order as unknown as BranchOrder).status)
    : OrderStatusEnums.Pending;

  // Parse metadata from notes
  const parseMetadata = (notes: string | null) => {
    if (!notes) return null;
    const metadataMatch = notes.match(/\[METADATA:(.*?)\]/);
    if (metadataMatch) {
      try {
        return JSON.parse(metadataMatch[1]);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getCleanNotes = (notes: string | null) => {
    if (!notes) return null;
    return notes.replace(/\[METADATA:.*?\]/, '').trim() || null;
  };

  const cleanNotes = getCleanNotes((order as any).notes);

  // Handle print using the service
  const handlePrint = () => {
    OrderPrintService.print({ order, status, lang, t });
  };

  // Render Items Function (Updated to handle Extras and correct Pricing)
  const renderItems = (itemList: any[], isAddon = false, level = 0) => {
    return itemList.map((item, index) => {
      // Calculate Extras Total for this specific item
      const extrasTotal = item.extras?.reduce((sum: number, extra: any) => sum + (extra.totalPrice || 0), 0) || 0;
      
      // Calculate the display price (Item Total + Extras Total) to match the Order Total
      // Use item.totalPrice if it exists, otherwise count * price
      const baseTotal = item.totalPrice !== undefined ? item.totalPrice : (item.price * item.count);
      const displayTotal = baseTotal + extrasTotal;

      return (
        <div 
          key={`${level}-${index}`} 
          className={`group transition-all duration-200 ${isAddon ? 'ml-4' : ''}`}
        >
          <div 
            className={`relative ${densityPadding[viewDensity]} rounded-lg border transition-all hover:shadow-md ${
              isAddon 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-600' 
                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600'
            } ${item.isProductDeleted ? 'opacity-60 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' : ''}`}
          >
            {isAddon && (
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-blue-300 dark:bg-blue-600"></div>
            )}
            
            <div className={`flex justify-between items-start ${densityGap[viewDensity]}`}>
              <div className="flex-1 min-w-0">
                <div className={`flex items-center ${densityGap[viewDensity]} mb-2`}>
                  <div className={`p-1.5 rounded-md ${
                    isAddon 
                      ? 'bg-blue-100 dark:bg-blue-800' 
                      : 'bg-indigo-100 dark:bg-indigo-800'
                  }`}>
                    <ShoppingBag className={`w-3 h-3 ${
                      isAddon 
                        ? 'text-blue-600 dark:text-blue-300' 
                        : 'text-indigo-600 dark:text-indigo-300'
                    }`} />
                  </div>
                  <h5 className={`font-semibold text-gray-900 dark:text-gray-100 text-sm truncate ${
                    item.isProductDeleted ? 'line-through text-red-600 dark:text-red-400' : ''
                  }`}>
                    {item.productName || item.extraName} {/* Handle extraName if rendering extras recursively */}
                  </h5>
                  {item.isProductDeleted && (
                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] rounded-full font-medium">
                      {t('ordersManager.deleted') || 'Deleted'}
                    </span>
                  )}
                  {isAddon && !item.isProductDeleted && (
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-[10px] rounded-full font-medium">
                      Add-on
                    </span>
                  )}
                </div>
                
                <div className={`grid grid-cols-2 md:grid-cols-3 ${densityGap[viewDensity]} mb-2`}>
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-3 h-3 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Qty</p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {item.count || item.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3 h-3 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Unit</p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {currency.symbol}{(item.price || item.unitPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {item.addonPrice && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-blue-500" />
                      <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">Addon</p>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {currency.symbol}{item.addonPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {(item.note || item.addonNote) && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-700">
                    <div className="flex items-start gap-1.5">
                      <MessageSquare className="w-3 h-3 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-semibold text-amber-900 dark:text-amber-200 mb-0.5">
                          Note:
                        </p>
                        <p className="text-xs text-amber-800 dark:text-amber-300">
                          {item.note || item.addonNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Total</p>
                <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {/* Display calculated total including extras if valid, else fallback */}
                  {currency.symbol}{!isAddon && !Number.isNaN(displayTotal) ? displayTotal.toFixed(2) : (item.totalPrice || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {/* RENDER EXTRAS */}
          {item.extras && item.extras.length > 0 && (
            <div className="mt-2 ml-4 relative space-y-2">
               <div className="absolute left-[-16px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-300 to-transparent dark:from-green-600"></div>
               {item.extras.map((extra: any, extraIndex: number) => {
                 const isRemoval = extra.isRemoval === true;
                 return (
                 <div key={`extra-${extraIndex}`} className={`relative ${densityPadding[viewDensity]} rounded-lg border ${
                   isRemoval
                     ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-600'
                     : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600'
                 }`}>
                   <div className={`absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-0.5 ${
                     isRemoval ? 'bg-red-300 dark:bg-red-600' : 'bg-green-300 dark:bg-green-600'
                   }`}></div>

                   <div className={`flex justify-between items-center ${densityGap[viewDensity]}`}>
                     <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${
                          isRemoval ? 'bg-red-100 dark:bg-red-800' : 'bg-green-100 dark:bg-green-800'
                        }`}>
                          <Plus className={`w-3 h-3 ${
                            isRemoval ? 'text-red-600 dark:text-red-300' : 'text-green-600 dark:text-green-300'
                          }`} />
                        </div>
                        <div>
                          <h6 className="text-xs font-semibold text-gray-800 dark:text-gray-200">{extra.extraName}</h6>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400  px-1.5 rounded">{extra.extraCategoryName}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500">Qty</p>
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100">{extra.quantity}</p>
                        </div>
                        <div className="text-right min-w-[3rem]">
                           <p className="text-[10px] text-gray-500">Price</p>
                           <p className={`text-xs font-bold ${
                             isRemoval ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                           }`}>
                              {currency.symbol}{extra.totalPrice > 0 ? `+${extra.totalPrice.toFixed(2)}` : 'Free'}
                           </p>
                        </div>
                     </div>
                   </div>
                 </div>
                 );
               })}
            </div>
          )}

          {/* RENDER ADDONS (Existing Logic) */}
          {item.addonItems && item.addonItems.length > 0 && (
            <div className={`mt-2 space-y-2 relative`}>
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-transparent dark:from-blue-600"></div>
              {renderItems(item.addonItems, true, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`fixed inset-0 dark:bg-black/80 flex items-center justify-center z-50 p-3 animate-fadeIn transition-all duration-300 ${blurOpacity[blurIntensity]} ${blurClasses[blurIntensity]}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {t('ordersManager.orderDetailsTitle')}
                </h3>
                <p className="text-indigo-100 text-xs">
                  Order #{order.orderTag}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 backdrop-blur-sm rounded-md transition-all text-white ${
                  showSettings ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              
              <button
                onClick={cycleBlurIntensity}
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all text-white flex items-center gap-1"
                title={`Blur: ${blurIntensity}`}
              >
                <Droplets className="w-4 h-4" />
                <span className="text-[10px] font-semibold uppercase">{blurIntensity[0]}</span>
              </button>
              
              <button
                onClick={cycleFontSize}
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all text-white flex items-center gap-1"
                title={`Font Size: ${fontSize}`}
              >
                <Type className="w-4 h-4" />
                <span className="text-[10px] font-semibold uppercase">{fontSize[0]}</span>
              </button>
              
              <button
                onClick={cycleViewDensity}
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all text-white flex items-center gap-1"
                title={`Density: ${viewDensity}`}
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-[10px] font-semibold uppercase">{viewDensity[0]}</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all text-white"
                title="Print Order"
              >
                <Printer className="w-4 h-4" />
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md transition-all text-white"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-3 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Background Blur</span>
                </div>
                <div className="flex gap-1">
                  {(['none', 'light', 'medium', 'heavy'] as BlurIntensity[]).map((blur) => (
                    <button
                      key={blur}
                      onClick={() => setBlurIntensity(blur)}
                      className={`px-2 py-1 text-[10px] rounded transition-all ${
                        blurIntensity === blur
                          ? 'bg-white/30 text-white font-bold border border-white/40'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {blur}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">Section Visibility</h4>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleAllSections(true)}
                    className="px-2 py-1 text-[10px] bg-white/20 hover:bg-white/30 rounded text-white transition-all"
                  >
                    Show All
                  </button>
                  <button
                    onClick={() => toggleAllSections(false)}
                    className="px-2 py-1 text-[10px] bg-white/20 hover:bg-white/30 rounded text-white transition-all"
                  >
                    Hide All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(sectionVisibility).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => toggleSection(key as keyof SectionVisibility)}
                    className={`px-2 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-1.5 ${
                      value 
                        ? 'bg-white/20 text-white border border-white/30' 
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }`}
                  >
                    {value ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{(order as any).orderTypeIcon || '📦'}</span>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {(order as any).orderTypeName || 'Order'}
                </h4>
                <p className="text-xs text-indigo-100">
                  {(order as any).orderTypeCode}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${OrderStatusUtils.getStatusBadgeClass(status)}`}>
              <span>{OrderStatusUtils.getStatusIcon(status)}</span>
              <span className="ml-1">
                {orderService.getOrderStatusText(status, lang)}
              </span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto ${densityClasses[viewDensity]} ${fontSizeClasses[fontSize]}`}>
          
          {/* Quick Stats */}
          {sectionVisibility.stats && (
            <div className={`grid grid-cols-2 md:grid-cols-4 ${densityGap[viewDensity]}`}>
              <div className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 ${densityPadding[viewDensity]} rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all`}>
                <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.OrderTag')}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                  {order.orderTag}
                </p>
              </div>
              
              <div className={`bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 ${densityPadding[viewDensity]} rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all`}>
                <Package className="w-4 h-4 text-purple-600 dark:text-purple-400 mb-1" />
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.ItemCount')}</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {(order as any).itemCount || (order as any).items?.length || 0}
                </p>
              </div>
              
              <div className={`bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 ${densityPadding[viewDensity]} rounded-lg border border-amber-200 dark:border-amber-700 hover:shadow-md transition-all`}>
                <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-1" />
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.quantity')}</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {(() => {
                    const items = (order as any).items;
                    if (items) {
                      let totalCount = 0;
                      const countItems = (itemList: any[]) => {
                        itemList.forEach(item => {
                          totalCount += item.count || 1;
                          if (item.addonItems && item.addonItems.length > 0) {
                            countItems(item.addonItems);
                          }
                        });
                      };
                      countItems(items);
                      return totalCount;
                    }
                    return 0;
                  })()}
                </p>
              </div>
              
              <div className={`bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 ${densityPadding[viewDensity]} rounded-lg border border-green-200 dark:border-green-700 hover:shadow-md transition-all`}>
                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" />
                <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-0.5">{t('ordersManager.total')}</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {currency.symbol}{order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Customer Information */}
          {sectionVisibility.customer && (
            <div className={`bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-lg ${densityPadding[viewDensity]} border border-blue-200 dark:border-blue-700`}>
              <button
                onClick={() => toggleSection('customer')}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-md">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {t('ordersManager.CustomerInformation')}
                  </h4>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" />
              </button>
              <div className={`grid grid-cols-1 md:grid-cols-2 ${densityGap[viewDensity]}`}>
                <div className={`flex items-start gap-2 ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                      {t('ordersManager.CustomerName')}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      {order.customerName || 'N/A'}
                    </p>
                  </div>
                </div>
                {(order as any).customerPhone && (
                  <div className={`flex items-start gap-2 ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <Phone className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        {t('ordersManager.PhoneNumber')}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {(order as any).customerPhone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delivery/Table Information */}
          {sectionVisibility.delivery && ((order as any).deliveryAddress || (order as any).tableName || (order as any).tableId) && (
            <div className={`bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-lg ${densityPadding[viewDensity]} border border-green-200 dark:border-green-700`}>
              <button
                onClick={() => toggleSection('delivery')}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-100 dark:bg-green-800 rounded-md">
                    {(order as any).deliveryAddress ? (
                      <Truck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Home className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {(order as any).deliveryAddress 
                      ? t('ordersManager.DeliveryInformation')
                      : t('ordersManager.TableInformation')
                    }
                  </h4>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-green-600 transition-colors" />
              </button>
              <div className={`space-y-2`}>
                {(order as any).deliveryAddress && (
                  <div className={`flex items-start gap-2 ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <MapPin className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        {t('ordersManager.DeliveryAddress')}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {(order as any).deliveryAddress}
                      </p>
                    </div>
                  </div>
                )}
                {(order as any).tableName && (
                  <div className={`flex items-start gap-2 ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                    <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <Home className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                        {t('ordersManager.table')}
                      </p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {(order as any).tableName} {(order as any).tableId && `(ID: ${(order as any).tableId})`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Notes */}
          {sectionVisibility.notes && cleanNotes && (
            <div className={`bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg ${densityPadding[viewDensity]} border border-amber-200 dark:border-amber-700`}>
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-amber-100 dark:bg-amber-800 rounded-md">
                  <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
                    {t('ordersManager.OrderNotes')}
                  </p>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {cleanNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          {sectionVisibility.items && (
            <div className={`bg-gray-50 dark:bg-gray-900/50 rounded-lg ${densityPadding[viewDensity]} border border-gray-200 dark:border-gray-700`}>
              <button
                onClick={() => toggleSection('items')}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-100 dark:bg-indigo-800 rounded-md">
                    <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {t('ordersManager.orderItems')}
                  </h4>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </button>
              
              {(() => {
                const items = (order as any).items;
                
                if (!items || items.length === 0) {
                  return (
                    <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div className="flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mb-3" />
                        <p className="text-yellow-900 dark:text-yellow-200 font-semibold text-sm">
                          No items data available
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                          This order doesn't contain any items yet
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    {renderItems(items)}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Modification History */}
          {sectionVisibility.timeline && (order as any).lastModifiedAt && (
            <div className={`bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg ${densityPadding[viewDensity]} border border-amber-200 dark:border-amber-700`}>
              <button
                onClick={() => toggleSection('timeline')}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-800 rounded-md">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {t('ordersManager.modificationHistory') || 'Modification History'}
                  </h4>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-amber-600 transition-colors" />
              </button>

              <div className="space-y-2">
                <div className={`flex items-start gap-2 ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <Calendar className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                      {t('ordersManager.lastModifiedAt') || 'Last Modified'}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 font-mono">
                      {new Date((order as any).lastModifiedAt).toLocaleString(
                        lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                        { dateStyle: 'short', timeStyle: 'short' }
                      )}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-start gap-2 ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                  <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                      {t('ordersManager.modifiedBy') || 'Modified By'}
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 break-all">
                      {(order as any).lastModifiedBy}
                    </p>
                  </div>
                </div>

                {/* Parsed Log */}
                {(() => {
                  try {
                    const logs = JSON.parse((order as any).modificationLog);
                    if (Array.isArray(logs) && logs.length > 0) {
                      return (
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-2">
                            {t('ordersManager.modificationDetails') || 'Modification Details'}
                          </h5>
                          {logs.map((log, index) => (
                            <div key={index} className={`p-2 rounded-md bg-amber-50 dark:bg-amber-900/30 ${densityPadding[viewDensity]} border border-amber-200 dark:border-amber-700`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Calendar className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 font-mono">
                                  {new Date(log.Timestamp).toLocaleString(
                                    lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                                    { dateStyle: 'short', timeStyle: 'short' }
                                  )}
                                </p>
                              </div>
                              {log.ModifiedBy && (
                                <div className="flex items-center gap-1.5 mb-1">
                                  <User className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                                    {t('ordersManager.modifiedBy') || 'By'}: {log.ModifiedBy}
                                  </p>
                                </div>
                              )}
                              {log.Reason && (
                                <div className="flex items-start gap-1.5 mb-1">
                                  <MessageSquare className="w-3 h-3 text-amber-700 dark:text-amber-400 mt-0.5" />
                                  <p className="text-xs text-amber-800 dark:text-amber-300">
                                    {t('ordersManager.reason') || 'Reason'}: {log.Reason || 'N/A'}
                                  </p>
                                </div>
                              )}
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 pt-2 border-t border-amber-200 dark:border-amber-600">
                                <p className="text-xs text-amber-800 dark:text-amber-300">
                                  {t('ordersManager.total') || 'Total'}: <span className="font-semibold">{currency.symbol}{log.OldTotalPrice?.toFixed(2)} → {currency.symbol}{log.NewTotalPrice?.toFixed(2)}</span>
                                </p>
                                <p className="text-xs text-amber-800 dark:text-amber-300">
                                  {t('ordersManager.items') || 'Items'}: <span className="font-semibold">{log.OldItemCount} → {log.NewItemCount}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                  } catch (e) {
                    // Fallback for non-JSON or malformed log
                    return (
                      <div className={`flex items-start gap-2 ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                        <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                          <AlertCircle className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                            {t('ordersManager.modificationLog') || 'Raw Log'}
                          </p>
                          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 break-all">
                            {(order as any).modificationLog}
                          </p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          {sectionVisibility.pricing && (
            <div className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg ${densityPadding[viewDensity]} border border-gray-200 dark:border-gray-600`}>
              <button
                onClick={() => toggleSection('pricing')}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-md">
                    <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Pricing
                  </h4>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 transition-colors" />
              </button>
              <div className="space-y-2">
                <div className={`flex justify-between items-center ${densityPadding[viewDensity]} bg-white dark:bg-gray-800 rounded-md`}>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                    {t('ordersManager.subTotal')}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {currency.symbol}{(order.subTotal || 0).toFixed(2)}
                  </span>
                </div>
                
                {order.serviceFeeApplied !== undefined && order.serviceFeeApplied > 0 && (
                  <div className={`flex justify-between items-center ${densityPadding[viewDensity]} bg-blue-50 dark:bg-blue-900/20 rounded-md`}>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {t('ordersManager.serviceFeeApplied')}
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      +{currency.symbol}{order.serviceFeeApplied.toFixed(2)}
                    </span>
                  </div>
                )}
                
             
                
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-2"></div>
                
                <div className={`flex justify-between items-center ${densityPadding[viewDensity]} bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-md border border-green-200 dark:border-green-700`}>
                  <span className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {t('ordersManager.total')}
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {currency.symbol}{order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          {sectionVisibility.timeline && (
            <div className={`bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-800/50 rounded-lg ${densityPadding[viewDensity]} border border-slate-200 dark:border-slate-700`}>
              <button
                onClick={() => toggleSection('timeline')}
                className="flex items-center justify-between w-full mb-3 group"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-md">
                    <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {t('ordersManager.OrderTimeline')}
                  </h4>
                </div>
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-slate-600 transition-colors" />
              </button>
              
              <div className="space-y-3">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0.5 w-5 h-5 bg-indigo-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center">
                    <Clock className="w-2.5 h-2.5 text-white" />
                  </div>
                  {(order as any).confirmedAt && (
                    <div className="absolute left-2.5 top-5 w-0.5 h-full bg-gradient-to-b from-indigo-300 to-green-300 dark:from-indigo-600 dark:to-green-600"></div>
                  )}
                  <div className={`bg-white dark:bg-gray-800 rounded-md ${densityPadding[viewDensity]} border border-indigo-200 dark:border-indigo-700`}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                        {t('ordersManager.createdAt')}
                      </p>
                    </div>
                    <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                      {new Date(order.createdAt).toLocaleString(
                        lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                        { dateStyle: 'short', timeStyle: 'short' }
                      )}
                    </p>
                  </div>
                </div>
                
                {(order as any).confirmedAt && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                    {(order as any).completedAt && (
                      <div className="absolute left-2.5 top-5 w-0.5 h-full bg-gradient-to-b from-green-300 to-blue-300 dark:from-green-600 dark:to-blue-600"></div>
                    )}
                    <div className={`bg-white dark:bg-gray-800 rounded-md ${densityPadding[viewDensity]} border border-green-200 dark:border-green-700`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Calendar className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <p className="text-xs font-bold text-green-900 dark:text-green-200">
                          {t('ordersManager.confirmedAt')}
                        </p>
                      </div>
                      <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                        {new Date((order as any).confirmedAt).toLocaleString(
                          lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                          { dateStyle: 'short', timeStyle: 'short' }
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {(order as any).completedAt && (
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0.5 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center">
                      <CheckCircle className="w-2.5 h-2.5 text-white" />
                    </div>
                    <div className={`bg-white dark:bg-gray-800 rounded-md ${densityPadding[viewDensity]} border border-blue-200 dark:border-blue-700`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <p className="text-xs font-bold text-blue-900 dark:text-blue-200">
                          {t('ordersManager.CompletedAt')}
                        </p>
                      </div>
                      <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                        {new Date((order as any).completedAt).toLocaleString(
                          lang === 'tr' ? 'tr-TR' : lang === 'ar' ? 'ar-SA' : 'en-US',
                          { dateStyle: 'short', timeStyle: 'short' }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderDetailsModal;