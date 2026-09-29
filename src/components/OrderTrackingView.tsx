import React, { useState } from 'react';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  ReceiptText, 
  RotateCcw, 
  AlertTriangle,
  ShoppingBag,
  Barcode,
  Printer
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Order } from '../types/market';
import { ProductIllustration } from './ProductIllustrations';
import { BarcodeRenderer } from './BarcodeRenderer';

interface Props {
  onBackToShop: () => void;
}

export const OrderTrackingView: React.FC<Props> = ({ onBackToShop }) => {
  const { 
    orders, 
    activeTrackingOrder, 
    setActiveTrackingOrder, 
    language, 
    formatPrice, 
    reorder, 
    setIsComplaintsModalOpen, 
    setSelectedOrderForComplaint 
  } = useMarket();

  const isAr = language === 'ar';
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchError, setSearchError] = useState('');

  // Default to active tracking order or most recent order
  const currentOrder = activeTrackingOrder || (orders.length > 0 ? orders[0] : null);

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
      descAr: 'الموظف يختار الخضار واللحوم الطازجة بعناية تامة',
      descEn: 'Our staff is selecting and carefully bagging fresh goods',
      icon: Package,
    },
    {
      id: 'on_the_way',
      labelAr: 'مع المندوب في الطريق',
      labelEn: 'Out for Delivery',
      descAr: 'المندوب في طريقه إلى عنوانك المسجل في بغداد',
      descEn: 'Courier is heading towards your location',
      icon: Truck,
    },
    {
      id: 'delivered',
      labelAr: 'تم التوصيل بنجاح',
      labelEn: 'Delivered',
      descAr: 'بالعافية عليك! تم تسليم الطلب بحالة ممتازة ومبردة',
      descEn: 'Delivered in pristine condition',
      icon: CheckCircle2,
    },
  ];

  const getStepIndex = (status: Order['status']) => {
    return steps.findIndex((s) => s.id === status);
  };

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const query = searchOrderId.trim().toUpperCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === query ||
        o.id.toUpperCase() === query ||
        o.orderNumber.toUpperCase().includes(query)
    );

    if (found) {
      setActiveTrackingOrder(found);
      setSearchOrderId('');
    } else {
      setSearchError(isAr ? `لم يتم العثور على طلب برقم "${query}"` : `No order found with ID "${query}"`);
    }
  };

  const handleOpenComplaint = (order: Order) => {
    setSelectedOrderForComplaint(order.orderNumber || order.id);
    setIsComplaintsModalOpen(true);
  };

  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Search */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-stone-800 shadow-xl">
        <div className="absolute top-0 end-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
            <Truck className="w-4 h-4" />
            <span>{isAr ? 'نظام التتبع المباشر لشحنات أسواق الشورجة' : 'Live Order Tracking System'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
            {isAr ? 'تتبع مسار شحنتك لحظة بلحظة' : 'Track Your Shipment in Real-Time'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mb-6 leading-relaxed">
            {isAr
              ? 'أدخل رقم الطلب لمعرفة حالة التجهيز، وقت الوصول المتوقع، وبيانات مندوب التوصيل المباشر.'
              : 'Enter your order reference to check preparation status, estimated arrival, and courier info.'}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder={isAr ? 'أدخل رقم الطلب: مثلاً SHR-1042...' : 'Order number e.g. SHR-1042...'}
                className="w-full text-xs sm:text-sm ps-10 pe-4 py-3 bg-stone-800/90 text-white placeholder-stone-400 rounded-2xl border border-stone-700 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
            >
              {isAr ? 'بحث عن الطلب' : 'Track Order'}
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-400 mt-2 font-medium">{searchError}</p>
          )}
        </div>
      </div>

      {/* Orders Selector Ribbon (if multiple orders exist) */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 whitespace-nowrap">
            {isAr ? 'طلباتك المسجلة:' : 'Your Orders:'}
          </span>
          {orders.map((ord) => {
            const isSelected = currentOrder?.id === ord.id;
            return (
              <button
                key={ord.id}
                onClick={() => setActiveTrackingOrder(ord)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border font-mono flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-amber-300 border-stone-900 shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <span>{ord.orderNumber || ord.id}</span>
                <span className="text-[10px] opacity-70">
                  ({formatPrice(ord.total)})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Order Details Card */}
      {currentOrder ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs space-y-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-black text-lg sm:text-xl text-stone-900">
                  {currentOrder.orderNumber || currentOrder.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
                  {currentOrder.status === 'delivered'
                    ? isAr ? 'مكتمل ومسلّم' : 'Delivered'
                    : currentOrder.status === 'on_the_way'
                    ? isAr ? 'مع المندوب في الطريق' : 'On the Way'
                    : currentOrder.status === 'preparing'
                    ? isAr ? 'قيد التجهيز والتقطيع' : 'Preparing'
                    : isAr ? 'تم الاستلام' : 'Received'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {isAr ? 'تاريخ ووقت الطلب:' : 'Order Date:'} {currentOrder.createdAt} · {currentOrder.deliverySlotAr}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenComplaint(currentOrder)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isAr ? 'تقديم شكوى على هذا الطلب' : 'File Inquiry'}</span>
              </button>
              <button
                onClick={() => reorder(currentOrder)}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة طلب نفس الأصناف' : 'Reorder'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress */}
          <div>
            <h3 className="text-sm font-black text-stone-900 mb-6">
              {isAr ? 'مراحل تجهيز وتوصيل الشحنة:' : 'Delivery Progress Pipeline:'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {steps.map((st, idx) => {
                const currentIdx = getStepIndex(currentOrder.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                const IconComponent = st.icon;

                return (
                  <div
                    key={st.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                        : isPassed
                        ? 'bg-stone-50 border-stone-200'
                        : 'bg-white border-stone-200/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isPassed
                            ? 'bg-stone-900 text-amber-400'
                            : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold font-mono text-stone-400">
                        0{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-black text-stone-900 mb-1">
                      {isAr ? st.labelAr : st.labelEn}
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      {isAr ? st.descAr : st.descEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courier & Delivery Address Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
            {/* Courier Info */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 font-bold block">
                    {isAr ? 'مندوب التوصيل المخصص:' : 'Assigned Courier:'}
                  </span>
                  <span className="text-sm font-black text-stone-900">
                    {currentOrder.courierName || (isAr ? 'كابتن وسام العراقي' : 'Captain Wisam')}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    {isAr ? 'دراجة شحن مبردة مخصصة' : 'Temperature-controlled delivery'}
                  </span>
                </div>
              </div>

              {currentOrder.courierPhone && (
                <a
                  href={`tel:${currentOrder.courierPhone}`}
                  className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isAr ? 'اتصال بالمندوب' : 'Call'}</span>
                </a>
              )}
            </div>

            {/* Address Info */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-200/80 text-stone-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-stone-700" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-stone-500 font-bold block">
                  {isAr ? 'عنوان التوصيل المسجل:' : 'Delivery Address:'}
                </span>
                <span className="text-xs sm:text-sm font-black text-stone-900 block truncate">
                  {isAr ? currentOrder.address.districtAr : currentOrder.address.districtEn} - {currentOrder.address.street}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  {currentOrder.address.labelAr || currentOrder.address.labelEn}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Order List */}
          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-sm font-black text-stone-900 mb-3 flex items-center justify-between">
              <span>{isAr ? 'الأصناف المطلوبة في هذه الفاتورة:' : 'Order Items:'}</span>
              <span className="text-xs font-normal text-stone-500 font-mono">
                {currentOrder.items.length} {isAr ? 'أصناف' : 'items'}
              </span>
            </h3>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-white hover:bg-stone-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 p-1 flex items-center justify-center shrink-0">
                      <ProductIllustration
                        iconType={item.product.iconType}
                        imageUrl={item.product.imageUrl}
                        alt={isAr ? item.product.nameAr : item.product.nameEn}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {isAr ? item.product.nameAr : item.product.nameEn}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-stone-500 font-mono">
                          {item.quantity} × {formatPrice(item.product.price)}
                        </span>
                        {item.product.barcode && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                            <Barcode className="w-3 h-3 text-stone-600" />
                            <span>{item.product.barcode}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs sm:text-sm font-black text-stone-900 font-mono shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Receipt Summary Totals */}
            <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 max-w-sm ms-auto space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span className="font-mono">{formatPrice(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>{isAr ? 'أجور التوصيل:' : 'Delivery Fee:'}</span>
                <span className="font-mono">
                  {currentOrder.deliveryFee === 0 ? (isAr ? 'مجاني' : 'Free') : formatPrice(currentOrder.deliveryFee)}
                </span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{isAr ? 'خصم الكوبون:' : 'Discount:'}</span>
                  <span className="font-mono">-{formatPrice(currentOrder.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-stone-900">
                <span>{isAr ? 'الإجمالي النهائي:' : 'Total Amount:'}</span>
                <span className="font-mono text-amber-900 text-base">{formatPrice(currentOrder.total)}</span>
              </div>
              <div className="text-[11px] text-stone-500 pt-1">
                <span>{isAr ? 'طريقة الدفع:' : 'Payment Method:'}</span>{' '}
                <span className="font-bold text-stone-700">
                  {currentOrder.paymentMethod === 'cash'
                    ? isAr ? 'نقداً عند الاستلام (كاش بالدينار العراقي)' : 'Cash on Delivery (IQD)'
                    : isAr ? 'دفع إلكتروني (بطاقة / محفظة)' : 'Electronic Payment'}
                </span>
              </div>

              {/* Cashier Order Barcode for POS checkout */}
              <div className="pt-3 border-t border-stone-200 flex flex-col items-center justify-center bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 font-bold mb-1 flex items-center gap-1">
                  <Barcode className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isAr ? 'باركود وصل الكاشير والمحاسبة:' : 'Cashier POS Receipt Barcode:'}</span>
                </span>
                <BarcodeRenderer 
                  value={currentOrder.orderNumber.replace(/[^0-9A-Z]/gi, '') || currentOrder.id} 
                  height={38} 
                  showText={true} 
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-stone-900">
            {isAr ? 'لا توجد طلبات مسجلة حالياً' : 'No Active Orders Recorded'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isAr
              ? 'تسوق من أقسام اللحوم، الغذائية، الألبان، والمنظفات لإتمام أول طلب لك ومتابعته هنا.'
              : 'Browse our departments to place your first order and track it right here.'}
          </p>
          <button
            onClick={onBackToShop}
            className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            {isAr ? 'تصفح المتجر الآن' : 'Browse Store'}
          </button>
        </div>
      )}
    </div>
  );
};
