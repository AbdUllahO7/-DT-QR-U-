"use client" // Assuming this is needed as per your other file

import type React from "react"
import { useState } from "react" // Removed useEffect as it wasn't used
import { Clock, CheckCircle, ClipboardList, Loader2, Edit, X, Save, AlertCircle, RefreshCw, Plus, Minus, Trash2 } from "lucide-react"
import { useLanguage } from "../../../../../contexts/LanguageContext"
import { OrderCardProps, OrdersTabProps } from "../../../../../types/menu/carSideBarTypes"
import { orderService } from "../../../../../services/Branch/OrderService"
import { UpdatableOrder, UpdatePendingOrderDto, UpdatePendingOrderItemDto, CancelOrderDto } from "../../../../../types/Orders/type"
import { OrderItem } from "../../../../../types/BranchManagement/type"

interface ExtendedOrdersTabProps extends OrdersTabProps {
  updatableOrders: UpdatableOrder[]
  onRefreshUpdatableOrders: () => Promise<void>
}

interface ExtendedOrderCardProps extends OrderCardProps {
  updatableOrders: UpdatableOrder[]
  onUpdateOrder: (orderTag: string) => Promise<void>
}

interface EditableOrderItem extends OrderItem {
  isDeleted?: boolean
  originalCount?: number
  editedNote?: string
}

const OrdersTab: React.FC<ExtendedOrdersTabProps> = ({
  trackedOrders,
  trackingLoading,
  onLoadOrderTracking,
  onRemoveOrderFromTracking,
  updatableOrders,
  onRefreshUpdatableOrders
}) => {
  const handleUpdateOrder = async (orderTag: string) => {
    await onRefreshUpdatableOrders()
    await onLoadOrderTracking(orderTag)
  }

  console.log("updatableOrders",updatableOrders)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800'
      case 'preparing':
        return 'text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30 dark:border-orange-800'
      case 'ready':
        return 'text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800'
      case 'completed':
        return 'text-green-700 bg-green-200 border-green-300 dark:text-green-300 dark:bg-green-800/30 dark:border-green-700'
      case 'cancelled':
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-gray-800/30 dark:border-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'confirmed':
      case 'preparing':
      case 'ready':
        return <Clock className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
      case 'rejected':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (trackedOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
          No Orders Yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Your orders will appear here once you place them
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {trackedOrders.map((order) => {
        return (
          <OrderCard
            key={order.orderTag}
            order={order}
            trackingLoading={trackingLoading}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            onLoadOrderTracking={onLoadOrderTracking}
            onRemoveOrderFromTracking={onRemoveOrderFromTracking}
            updatableOrders={updatableOrders}
            onUpdateOrder={handleUpdateOrder}
          />
        )
      })}
    </div>
  )
}


const OrderCard: React.FC<ExtendedOrderCardProps> = ({
  order,
  trackingLoading,
  getStatusColor,
  getStatusIcon,
  onLoadOrderTracking,
  onRemoveOrderFromTracking,
  updatableOrders,
  onUpdateOrder
}) => {
  const { t } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateReason, setUpdateReason] = useState('')
  const [editableItems, setEditableItems] = useState<EditableOrderItem[]>([])
  
  const [alertModal, setAlertModal] = useState<{ isOpen: boolean, title: string, message: string }>({ isOpen: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [promptModal, setPromptModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: (value: string) => void }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const updatableOrder = updatableOrders.find(u => u.orderTag === order.orderTag)
  const isPending = order.trackingInfo.orderStatus.toLowerCase() === 'pending'
  const canEdit = isPending && updatableOrder?.isUpdatable

  const canCancel = updatableOrder && orderService.canCancelOrder(order.trackingInfo.orderStatus);

  const getTimeRemaining = () => {
    if (!updatableOrder?.updateDeadline) return null
    
    const deadline = new Date(updatableOrder.updateDeadline)
    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    return `${minutes}m ${seconds}s`
  }

  const handleEdit = () => {
    if (!updatableOrder?.items) {
      setAlertModal({ isOpen: true, title: t('menu.cart.error') || 'Error', message: t('menu.cart.order_items_not_available') || 'Order items not available' });
      return
    }

    // Initialize editable items from updatableOrder.items
    const items: EditableOrderItem[] = []
    updatableOrder.items.forEach(item => {
      // 1. Add the parent item
      items.push({
        ...item,
        orderDetailId: item.id, // <-- ** ADD THIS LINE FOR THE PARENT **
        originalCount: item.count,
        editedNote: item.note || ''
      })
      
      // 2. Add its addon items
      if (item.addonItems && item.addonItems.length > 0) {
        item.addonItems.forEach(addon => {
          items.push({
            ...addon,
            orderDetailId: addon.id, // The addon's own unique OrderItem ID
            
            // --- THIS IS THE CRITICAL FIX ---
            parentOrderDetailId: addon.parentOrderItemId, 
            // --- END OF FIX ---

            originalCount: addon.count,
            editedNote: addon.note || ''
          })
        })
      }
    })
    
    console.log('Initialized editable items (with correct parent links):', items)
    setEditableItems(items)
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setUpdateReason('')
    setEditableItems([])
  }

  const handleQuantityChange = (itemId: number, change: number) => {
    setEditableItems(prev => prev.map(item => {
      if (item.orderDetailId === itemId) {
        const newCount = Math.max(0, (item.count || 0) + change)
        return { ...item, count: newCount }
      }
      return item
    }))
  }

  const handleNoteChange = (itemId: number, note: string) => {
    setEditableItems(prev => prev.map(item => {
      if (item.orderDetailId === itemId) {
        return { ...item, editedNote: note, note }
      }
      return item
    }))
  }

  // --- *** FIXED DELETE LOGIC *** ---
  const handleDeleteItem = (itemId: number) => {
    setEditableItems(prev => {
      const itemToDelete = prev.find(item => item.orderDetailId === itemId);
      // Check if it's a parent item
      const isParent = itemToDelete && !itemToDelete.parentOrderDetailId;

      return prev.map(item => {
        // Case 1: The item itself
        if (item.orderDetailId === itemId) {
          return { ...item, isDeleted: true, count: 0 };
        }
        // Case 2: A child of the item being deleted
        if (isParent && item.parentOrderDetailId === itemId) {
          return { ...item, isDeleted: true, count: 0 };
        }
        return item;
      });
    });
  };

  // --- *** FIXED RESTORE LOGIC *** ---
  const handleRestoreItem = (itemId: number) => {
    setEditableItems(prev => {
      const itemToRestore = prev.find(item => item.orderDetailId === itemId);
      if (!itemToRestore) return prev;

      let parentIdToRestore: number | null = null;
      // If restoring a child, also restore its parent if deleted
      if (itemToRestore.parentOrderDetailId) {
        const parent = prev.find(p => p.orderDetailId === itemToRestore.parentOrderDetailId);
        if (parent && parent.isDeleted) {
          parentIdToRestore = parent.orderDetailId;
        }
      }
      
      // Check if restoring a parent
      const isParentRestore = !itemToRestore.parentOrderDetailId;

      return prev.map(item => {
        // Restore the clicked item
        if (item.orderDetailId === itemId) {
          return { ...item, isDeleted: false, count: item.originalCount || 1 };
        }
        // Restore its parent if needed
        if (parentIdToRestore && item.orderDetailId === parentIdToRestore) {
          return { ...item, isDeleted: false, count: item.originalCount || 1 };
        }
        // Restore its children if it's a parent
        if (isParentRestore && item.parentOrderDetailId === itemId) {
          // Only restore children that weren't *individually* deleted
          // (This logic assumes restoring parent restores all children)
          return { ...item, isDeleted: false, count: item.originalCount || 1 };
        }
        return item;
      });
    });
  };

  const hasChanges = () => {
    return editableItems.some(item => 
      item.count !== item.originalCount || 
      item.editedNote !== (item.note || '') ||
      item.isDeleted
    )
  }

  const handleUpdateRetry = async (updateDto: UpdatePendingOrderDto) => {
    try {
      const dtoWithConfirm: UpdatePendingOrderDto = {
        ...updateDto,
        priceChangesConfirmed: true
      };
      await orderService.updatePendingOrder(dtoWithConfirm)
      setAlertModal({ isOpen: true, title: t('menu.cart.success') || 'Success', message: t('menu.cart.order_updated_success') || 'Order updated successfully!'});
      handleCancelEdit()
      await onUpdateOrder(order.orderTag)
    } catch (retryError: any) {
      setAlertModal({ isOpen: true, title: t('menu.cart.error') || 'Error', message: retryError.message || (t('menu.cart.order_update_failed') || 'Failed to update order') });
    }
  }

  const handleUpdate = async () => {
    if (!updatableOrder) {
      setAlertModal({ isOpen: true, title: t('menu.cart.error') || 'Error', message: 'Updatable order information not found' });
      return
    }
    
    if (!hasChanges()) {
      setAlertModal({ isOpen: true, title: t('menu.cart.info') || 'Info', message: t('menu.cart.no_changes_detected') || 'No changes detected. Please modify items before updating.'});
      return
    }

    const items: UpdatePendingOrderItemDto[] = editableItems
      .filter(item => {
        // We send items that are NOT deleted AND have a count > 0
        const shouldInclude = !item.isDeleted && item.count && item.count > 0
        return shouldInclude
      })
      .map(item => ({
        // Map all properties, ensuring correct types
        orderDetailId: item.orderDetailId || 0,
        branchProductId: item.branchProductId,
        count: item.count || 0,
        note: item.editedNote || null,
        isAddon: item.isAddon || false,
        parentOrderDetailId: item.parentOrderDetailId || null
      }));

    const updateDto: UpdatePendingOrderDto = {
      orderId: updatableOrder.orderId,
      items,
      updateReason: updateReason.trim(),
      priceChangesConfirmed: false,
      rowVersion: updatableOrder.rowVersion
    }

    try {
      setUpdating(true)
      console.log('Update DTO:', updateDto)
      await orderService.updatePendingOrder(updateDto)
      
      setAlertModal({ isOpen: true, title: t('menu.cart.success') || 'Success', message: t('menu.cart.order_updated_success') || 'Order updated successfully!'});
      handleCancelEdit()
      await onUpdateOrder(order.orderTag)
      
    } catch (error: any) {
      console.error('Failed to update order:', error)
      
      if (error?.response?.status === 409 && 
          error?.response?.data?.message?.toLowerCase().includes('price changes')) {
        
        setConfirmModal({
          isOpen: true,
          title: t('menu.cart.price_change_title') || 'Price Change',
          message: t('menu.cart.price_change_confirm') || 'Some prices have changed since you placed the order. Do you want to proceed with the update?',
          onConfirm: () => handleUpdateRetry(updateDto)
        });

      } else {
        setAlertModal({ isOpen: true, title: t('menu.cart.error') || 'Error', message: error.message || (t('menu.cart.order_update_failed') || 'Failed to update order')});
      }
    } finally {
      setUpdating(false)
    }
  }

  const executeCancelOrder = async (reason: string) => {
    if (!updatableOrder) return;

    try {
      setUpdating(true);

      const cancelDto: CancelOrderDto = {
        orderId: updatableOrder.orderId,
        cancellationReason: reason.trim(),
        rowVersion: updatableOrder.rowVersion
      };

      await orderService.cancelOrder(cancelDto);
      
      setAlertModal({ isOpen: true, title: t('menu.cart.success') || 'Success', message: t('menu.cart.order_cancelled_success') || 'Order cancelled successfully!'});
      
      await onUpdateOrder(order.orderTag);

    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      setAlertModal({ isOpen: true, title: t('menu.cart.error') || 'Error', message: error.message || (t('menu.cart.order_cancel_failed') || 'Failed to cancel order.')});
    } finally {
      setUpdating(false);
    }
  }

  const handleCancelOrder = async () => {
    if (!updatableOrder) {
      setAlertModal({ isOpen: true, title: t('menu.cart.error') || 'Error', message: t('menu.cart.order_data_unavailable') || 'Order data not available for cancellation.'});
      return;
    }
    
    setPromptModal({
      isOpen: true,
      title: t('menu.cart.cancel_reason_prompt_title') || 'Cancel Order',
      message: "",
      onConfirm: (reason) => {
        setConfirmModal({
          isOpen: true,
          title: t('menu.cart.confirm_cancel_title') || 'Confirm Cancellation',
          message: t('menu.cart.cancel_order_confirm') || 'Are you sure you want to cancel this order?',
          onConfirm: () => executeCancelOrder(reason)
        })
      }
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Order Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {order.orderTag}
          </div>
          <div className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.trackingInfo.orderStatus)}`}>
            {getStatusIcon(order.trackingInfo.orderStatus)}
            <span>{order.trackingInfo.orderStatus}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(order.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Updatable Order Info */}
      {canEdit && updatableOrder && (
        <div className="px-4 pt-3 pb-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  {t('menu.cart.order_can_be_updated') || 'Order can be updated'}
                </span>
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {t('menu.cart.time_remaining') || 'Time remaining'}: {getTimeRemaining()}
              </div>
              {updatableOrder.hasBeenModified && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  {t('menu.cart.modified_times', { count: updatableOrder.modificationCount }) || 
                    `Modified ${updatableOrder.modificationCount} time(s)`}
                </div>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800/30 rounded-lg transition-colors"
                title={t('menu.cart.edit_order') || 'Edit order'}
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{t('menu.cart.edit_order_items') || 'Edit Order Items'}</span>
            </div>

            {/* Items List */}
            {editableItems.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {/* 1. Loop over PARENT items only */}
                {editableItems.filter(item => !item.parentOrderDetailId).map((item) => (
                  <div
                    key={item.orderDetailId}
                    className={`p-3 bg-white dark:bg-slate-700 rounded-lg border ${
                      item.isDeleted 
                        ? 'border-red-300 dark:border-red-700 opacity-50' 
                        : 'border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {/* --- Start of Parent Item --- */}
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {item.productName}
                          </span>
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            ${(item.price * (item.count || 0)).toFixed(2)}
                          </span>
                        </div>

                        {!item.isDeleted && (
                          <>
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                onClick={() => handleQuantityChange(item.orderDetailId, -1)}
                                disabled={item.count === 0}
                                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-medium min-w-[2rem] text-center">
                                {item.count}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.orderDetailId, 1)}
                                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                ({t('menu.cart.was') || 'was'}: {item.originalCount})
                              </span>
                            </div>

                            {/* Note Input */}
                            <input
                              type="text"
                              value={item.editedNote}
                              onChange={(e) => handleNoteChange(item.orderDetailId, e.target.value)}
                              placeholder={t('menu.cart.add_note') || 'Add note...'}
                              className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              maxLength={200}
                            />
                          </>
                        )}

                        {item.isDeleted && (
                          <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                            {t('menu.cart.marked_for_deletion') || 'Marked for deletion'}
                          </div>
                        )}
                      </div>

                      {/* Delete/Restore Button */}
                      <button
                        onClick={() => item.isDeleted ? handleRestoreItem(item.orderDetailId) : handleDeleteItem(item.orderDetailId)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isDeleted
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200'
                        }`}
                        title={item.isDeleted ? (t('menu.cart.restore_item') || 'Restore item') : (t('menu.cart.delete_item') || 'Delete item')}
                      >
                        {item.isDeleted ? (
                          <RefreshCw className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {/* --- End of Parent Item --- */}

                    {/* 2. Find and render all addons for THIS parent item */}
                    {editableItems.filter(addon => addon.parentOrderDetailId === item.orderDetailId).length > 0 && (
                      <div className="pl-6 mt-3 space-y-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2 pt-3">
                        {editableItems
                          .filter(addon => addon.parentOrderDetailId === item.orderDetailId)
                          .map((addon) => (
                            <div
                              key={addon.orderDetailId}
                              className={`relative ${addon.isDeleted ? 'opacity-50' : ''}`}
                            >
                              {/* Indent line visual */}
                              <div className="absolute -left-[18px] top-2.5 h-px w-3 bg-slate-300 dark:bg-slate-500"></div>
                              
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  {/* Addon Name & Price */}
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                      {addon.productName} 
                                      <span className="text-xs text-slate-500 dark:text-slate-400"> (Addon)</span>
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                      ${(addon.price * (addon.count || 0)).toFixed(2)}
                                    </span>
                                  </div>

                                  {/* Addon Controls (if not deleted) */}
                                  {!addon.isDeleted && (
                                    <>
                                      <div className="flex items-center gap-2 mb-2">
                                        <button
                                          onClick={() => handleQuantityChange(addon.orderDetailId, -1)}
                                          disabled={addon.count === 0}
                                          className="p-1 rounded-lg bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-sm font-medium min-w-[2rem] text-center">
                                          {addon.count}
                                        </span>
                                        <button
                                          onClick={() => handleQuantityChange(addon.orderDetailId, 1)}
                                          className="p-1 rounded-lg bg-slate-100 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-500"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </button>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                          ({t('menu.cart.was') || 'was'}: {addon.originalCount})
                                        </span>
                                      </div>
                                      
                                      <input
                                        type="text"
                                        value={addon.editedNote}
                                        onChange={(e) => handleNoteChange(addon.orderDetailId, e.target.value)}
                                        placeholder={t('menu.cart.add_note') || 'Add note...'}
                                        className="w-full px-2 py-1 text-xs border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                        maxLength={200}
                                      />
                                    </>
                                  )}
                                  {addon.isDeleted && (
                                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                                      {t('menu.cart.marked_for_deletion') || 'Marked for deletion'}
                                    </div>
                                  )}
                                </div>

                                {/* Addon Delete/Restore Button */}
                                <button
                                  onClick={() => addon.isDeleted ? handleRestoreItem(addon.orderDetailId) : handleDeleteItem(addon.orderDetailId)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    addon.isDeleted
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200'
                                  }`}
                                  title={addon.isDeleted ? (t('menu.cart.restore_item') || 'Restore item') : (t('menu.cart.delete_item') || 'Delete item')}
                                >
                                  {addon.isDeleted ? <RefreshCw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    
                  </div>
                ))}
              </div>
            )}

            {/* No Items Message */}
            {editableItems.length === 0 && (
              <div className="text-center py-4 text-sm text-slate-500">
                No items to edit
              </div>
            )}

{/* Update Reason */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('menu.cart.update_reason') || 'Update Reason'}
              </label>
              <textarea
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder={t('menu.cart.update_reason_placeholder') || 'Why are you updating this order?'}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg 
                  bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                maxLength={500}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {updateReason.length}/500 {t('menu.cart.characters') || 'characters'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={updating || !hasChanges()}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('menu.cart.updating') || 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t('menu.cart.update_order') || 'Update Order'}
                  </>
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={updating}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t('menu.cart.orderType')}</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {order.trackingInfo.orderTypeName}
          </span>
        </div>
        
        {order.trackingInfo.tableName && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t('menu.cart.table')}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {order.trackingInfo.tableName}
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t('menu.cart.total')}</span>
          <span className="font-semibold text-green-600 dark:text-green-400">
            ${order.trackingInfo.totalPrice.toFixed(2)}
          </span>
        </div>

        {updatableOrder && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">{t('menu.cart.items') || 'Items'}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {updatableOrder.itemCount}
            </span>
          </div>
        )}
        
        {order.trackingInfo.notes && (
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-2 rounded">
            <strong>{t('menu.cart.notes')}</strong> {order.trackingInfo.notes}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-600 flex space-x-2">
        {canCancel && !isEditing && (
          <button
            onClick={handleCancelOrder}
            disabled={updating}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {updating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <X className="h-3 w-3" />
            )}
            {t('menu.cart.cancel_order') || 'Cancel Order'}
          </button>
        )}

        {isPending && !isEditing && !canCancel && (
          <button
            onClick={() => onLoadOrderTracking(order.orderTag)}
            disabled={trackingLoading || updating}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {trackingLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                {t('menu.cart.refreshing')}
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3" />
                {t('menu.cart.refresh')}
              </>
            )}
          </button>
        )}
        
        {!isEditing && (
          <button
            onClick={() => onRemoveOrderFromTracking(order.orderTag)}
            disabled={updating}
            className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 text-xs transition-colors disabled:opacity-50"
          >
            {t('menu.cart.remove')}
          </button>
        )}
      </div>

      {/* Modals */}
      {alertModal.isOpen && (
        <AlertModal
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => setAlertModal({ isOpen: false, title: '', message: '' })}
        />
      )}
      {confirmModal.isOpen && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
          onConfirm={confirmModal.onConfirm}
        />
      )}
      {promptModal.isOpen && (
        <PromptModal
          title={promptModal.title}
          message={promptModal.message}
          onClose={() => setPromptModal({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
          onConfirm={promptModal.onConfirm}
          promptLabel={t('menu.cart.reason') || 'Reason'}
        />
      )}
    </div>
  )
}

export default OrdersTab

// --- MODAL COMPONENTS ---

interface ModalProps {
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<ModalProps> = ({ title, message, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full">
      <div className="p-4 border-b dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <div className="p-4">
        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{message}</p>
      </div>
      <div className="p-4 flex justify-end bg-slate-50 dark:bg-slate-700/50 rounded-b-lg">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

interface ConfirmModalProps extends ModalProps {
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ title, message, onClose, onConfirm }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full">
        <div className="p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{message}</p>
        </div>
        <div className="p-4 flex justify-end gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500"
          >
            {t('menu.cart.cancel') || 'Cancel'}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
          >
            {t('menu.cart.confirm') || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface PromptModalProps extends ModalProps {
  onConfirm: (value: string) => void;
  promptLabel?: string;
}

const PromptModal: React.FC<PromptModalProps> = ({ title, message, onClose, onConfirm, promptLabel }) => {
  const [value, setValue] = useState('');
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full">
        <div className="p-4 border-b dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{message}</p>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            {promptLabel || (t('menu.cart.reason') || 'Reason')}
          </label>
          <textarea
            title="value" // Added title for accessibility
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg 
                bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            maxLength={500}
          />
        </div>
        <div className="p-4 flex justify-end gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500"
          >
            {t('menu.cart.cancel') || 'Cancel'}
          </button>
          <button
            onClick={() => {
              onConfirm(value);
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
          >
            {t('menu.cart.submit') || 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}