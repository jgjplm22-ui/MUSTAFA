import React from 'react';
import { X, ReceiptText, Clock, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Order } from '../types/market';
import { ProductIllustration } from './ProductIllustrations';

export const OrdersModal: React.FC = () => {
  const {
    isOrdersModalOpen,
    setIsOrdersModalOpen,
    orders,
    setActiveTrackingOrder,
    reorder,
    formatPrice,
    language,
    setIsComplaintsModalOpen,
    setSelectedOrderForComplaint,
  } = useMarket();

  if (!isOrdersModalOpen) return null;

  const isAr = language === 'ar';

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return isAr ? 'تم استلام الطلب' : 'Received';
      case 'preparing':
        return isAr ? 'جاري التجهيز' : 'Preparing';
      case 'on_the_way':
        return isAr ? 'في الطريق' : 'On the way';
      case 'delivered':
        return isAr ? 'تم التوصيل' : 'Delivered';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ReceiptText className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {isAr ? 'سجل طلباتي' : 'Order History'}
            </h2>
            <span className="text-xs text-stone-500 tabular-nums">
              ({orders.length})
            </span>
          </div>
          <button
            onClick={() => setIsOrdersModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-3">
                <ReceiptText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-800 mb-1">
                {isAr ? 'لا توجد طلبات سابقة' : 'No previous orders'}
              </h3>
              <p className="text-xs text-stone-500">
                {isAr ? 'ستظهر جميع طلباتك هنا لتتمكن من تتبعها أو تكرارها بضغطة زر.' : 'Your placed orders will show up here for live tracking and 1-click reorder.'}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/90 hover:border-emerald-600/40 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-stone-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-stone-400">·</span>
                    <span className="text-xs text-stone-500">
                      {order.createdAt}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                {/* Items thumbnails preview */}
                <div className="py-3 flex items-center gap-2 overflow-x-auto">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 bg-white rounded-xl p-1 border border-stone-200/60 shrink-0 flex items-center justify-center relative overflow-hidden"
                      title={isAr ? item.product.nameAr : item.product.nameEn}
                    >
                      <ProductIllustration 
                        iconType={item.product.iconType} 
                        imageUrl={item.product.imageUrl} 
                        alt={isAr ? item.product.nameAr : item.product.nameEn} 
                        className="w-full h-full object-contain" 
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -bottom-1 -end-1 bg-stone-800 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="text-xs text-stone-500 ps-2">
                    {order.items.length} {isAr ? 'أصناف مختلفة' : 'items'}
                  </div>
                </div>

                {/* Action & Total bar */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block">
                      {isAr ? 'الإجمالي' : 'Total'}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-stone-900 tabular-nums">
                      {formatPrice(order.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrderForComplaint(order.orderNumber);
                        setIsComplaintsModalOpen(true);
                        setIsOrdersModalOpen(false);
                      }}
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title={isAr ? 'تقديم شكوى على هذا الطلب' : 'Report Issue'}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span className="hidden sm:inline">{isAr ? 'شكوى' : 'Issue'}</span>
                    </button>

                    <button
                      onClick={() => {
                        reorder(order);
                        setIsOrdersModalOpen(false);
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إعادة الطلب' : 'Reorder'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTrackingOrder(order);
                        setIsOrdersModalOpen(false);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>{isAr ? 'تتبع الطلب' : 'Track Order'}</span>
                      {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
