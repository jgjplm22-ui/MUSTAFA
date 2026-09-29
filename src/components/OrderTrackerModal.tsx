import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  ReceiptText, 
  RotateCcw,
  Sparkles,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Order } from '../types/market';
import { ProductIllustration } from './ProductIllustrations';

export const OrderTrackerModal: React.FC = () => {
  const {
    activeTrackingOrder,
    setActiveTrackingOrder,
    language,
    formatPrice,
    reorder,
    setIsComplaintsModalOpen,
    setSelectedOrderForComplaint,
  } = useMarket();

  const isAr = language === 'ar';
  const [currentStatus, setCurrentStatus] = useState<Order['status']>('received');

  useEffect(() => {
    if (activeTrackingOrder) {
      setCurrentStatus(activeTrackingOrder.status);
    }
  }, [activeTrackingOrder]);

  if (!activeTrackingOrder) return null;

  const steps: { id: Order['status']; labelAr: string; labelEn: string; descAr: string; descEn: string; icon: any }[] = [
    {
      id: 'received',
      labelAr: 'تم استلام الطلب',
      labelEn: 'Order Received',
      descAr: 'تم تسجيل طلبك وإرساله لمركز تجهيز أسواق الشورجة',
      descEn: 'Your order is recorded and sent to Shorja fulfillment',
      icon: ReceiptText,
    },
    {
      id: 'preparing',
      labelAr: 'جاري التجهيز والفرز',
      labelEn: 'Packing Fresh Items',
      descAr: 'الموظف يختار الخضار والمنتجات الطازجة بعناية تامة',
      descEn: 'Our staff is selecting and carefully bagging fresh goods',
      icon: Package,
    },
    {
      id: 'on_the_way',
      labelAr: 'مع المندوب في الطريق',
      labelEn: 'Out for Delivery',
      descAr: 'المندوب في طريقه إلى عنوانك المسجل',
      descEn: 'Courier is heading towards your location',
      icon: Truck,
    },
    {
      id: 'delivered',
      labelAr: 'تم التوصيل بنجاح',
      labelEn: 'Delivered',
      descAr: 'بالعافية عليك! تم تسليم الطلب بحالة ممتازة',
      descEn: 'Bon appétit! Delivered in pristine condition',
      icon: CheckCircle2,
    },
  ];

  const getStepIndex = (status: Order['status']) => {
    return steps.findIndex((s) => s.id === status);
  };

  const currentIndex = getStepIndex(currentStatus);

  const advanceStatus = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStatus(steps[currentIndex + 1].id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Order ID */}
        <div className="px-6 py-4 border-b border-stone-200 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {isAr ? 'متابعة وتتبع حالة الطلب' : 'Live Order Tracking'}
                </h2>
                <span className="font-mono text-xs bg-emerald-950 px-2 py-0.5 rounded text-emerald-200">
                  {activeTrackingOrder.orderNumber}
                </span>
              </div>
              <span className="text-xs text-emerald-300">
                {isAr ? `تاريخ الطلب: ${activeTrackingOrder.createdAt}` : `Ordered at: ${activeTrackingOrder.createdAt}`}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status banner */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-start">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-stone-500 font-medium">
                  {isAr ? 'الوقت المتوقع للوصول:' : 'Estimated Delivery Time:'}
                </span>
                <div className="text-base font-bold text-emerald-950">
                  {currentStatus === 'delivered'
                    ? (isAr ? 'تم التوصيل بنجاح ✅' : 'Delivered Successfully ✅')
                    : activeTrackingOrder.estimatedDeliveryTime}
                </div>
              </div>
            </div>

            {/* Test Simulation Button to advance state */}
            {currentIndex < steps.length - 1 && (
              <button
                onClick={advanceStatus}
                className="text-xs bg-white hover:bg-stone-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs transition-colors shrink-0"
                title="Simulate courier progress"
              >
                {isAr ? 'محاكاة المرحلة التالية ⏩' : 'Simulate Next Step ⏩'}
              </button>
            )}
          </div>

          {/* Stepper progress visual */}
          <div className="py-2">
            <div className="relative flex flex-col sm:flex-row justify-between gap-4">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex-1 flex sm:flex-col items-center gap-3 text-start sm:text-center relative">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/30 ring-4 ring-emerald-100'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>

                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isPassed ? 'text-stone-900' : 'text-stone-400'
                        }`}
                      >
                        {isAr ? step.labelAr : step.labelEn}
                      </h4>
                      <p className="text-[11px] text-stone-500 hidden sm:block max-w-[130px] mx-auto mt-0.5">
                        {isAr ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier info card */}
          {activeTrackingOrder.courierName && (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  {activeTrackingOrder.courierName[0]}
                </div>
                <div>
                  <div className="text-xs text-stone-400">
                    {isAr ? 'مندوب التوصيل المعتمد' : 'Assigned Courier'}
                  </div>
                  <div className="font-bold text-stone-900 text-sm">
                    {activeTrackingOrder.courierName}
                  </div>
                </div>
              </div>

              <a
                href={`tel:${activeTrackingOrder.courierPhone}`}
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isAr ? 'اتصال بالمندوب' : 'Call'}</span>
              </a>
            </div>
          )}

          {/* Destination Address */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 text-xs text-stone-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">
                {isAr ? activeTrackingOrder.address.labelAr : activeTrackingOrder.address.labelEn}:
              </span>{' '}
              {activeTrackingOrder.address.street} -{' '}
              {isAr ? activeTrackingOrder.address.districtAr : activeTrackingOrder.address.districtEn}
            </div>
          </div>

          {/* Itemized summary */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              {isAr ? 'محتويات الطلب' : 'Ordered Items'}
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pe-1">
              {activeTrackingOrder.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-2.5 bg-stone-50/60 rounded-xl border border-stone-200/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white p-1 border border-stone-200/50 flex items-center justify-center shrink-0 overflow-hidden">
                      <ProductIllustration 
                        iconType={item.product.iconType} 
                        imageUrl={item.product.imageUrl} 
                        alt={isAr ? item.product.nameAr : item.product.nameEn} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900">
                        {isAr ? item.product.nameAr : item.product.nameEn}
                      </span>
                      <span className="text-stone-400 ms-1">
                        × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-800 tabular-nums">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total balance */}
            <div className="pt-3 mt-3 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
              <span>{isAr ? 'الإجمالي المدفوع' : 'Total Paid'}</span>
              <span className="tabular-nums text-emerald-800">
                {formatPrice(activeTrackingOrder.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                reorder(activeTrackingOrder);
                setActiveTrackingOrder(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة طلب نفس المنتجات' : 'Reorder Items'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedOrderForComplaint(activeTrackingOrder.orderNumber);
                setIsComplaintsModalOpen(true);
                setActiveTrackingOrder(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold transition-colors"
              title={isAr ? 'تقديم شكوى أو ملاحظة على هذا الطلب' : 'Report an issue on this order'}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>{isAr ? 'تقديم شكوى على الطلب' : 'Report Issue'}</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            {isAr ? 'حسناً، تم' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
