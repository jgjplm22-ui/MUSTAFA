import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { PaymentMethodType } from '../types/market';
import { sanitizeInput } from '../utils/security';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    language,
    formatPrice,
    subtotal,
    deliveryFee,
    couponDiscount,
    grandTotal,
    selectedAddress,
    setIsAddressModalOpen,
    placeOrder,
  } = useMarket();

  const isAr = language === 'ar';

  const [deliverySlot, setDeliverySlot] = useState<'express' | 'evening' | 'tomorrow'>('express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash');
  const [courierNotes, setCourierNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const deliverySlots = [
    {
      id: 'express' as const,
      titleAr: 'توصيل فوري فائق السرعة',
      titleEn: 'Ultra Express Delivery',
      timeAr: 'خلال 25-35 دقيقة',
      timeEn: 'Within 25-35 mins',
      tagAr: 'الأسرع ⚡',
      tagEn: 'Fastest ⚡',
    },
    {
      id: 'evening' as const,
      titleAr: 'المساء اليوم',
      titleEn: 'This Evening',
      timeAr: '6:00 م - 9:00 م',
      timeEn: '6:00 PM - 9:00 PM',
    },
    {
      id: 'tomorrow' as const,
      titleAr: 'صباح الغد',
      titleEn: 'Tomorrow Morning',
      timeAr: '8:00 ص - 11:00 ص',
      timeEn: '8:00 AM - 11:00 AM',
    },
  ];

  const paymentOptions = [
    {
      id: 'cash' as PaymentMethodType,
      titleAr: 'الدفع عند الاستلام (كاش أو مدى مع المندوب)',
      titleEn: 'Cash or POS on Delivery',
      icon: <Banknote className="w-5 h-5 text-emerald-700" />,
      descAr: 'ادفع نقداً أو بجهاز مدى اللاسلكي عند استلام طلبك',
      descEn: 'Pay cash or contactless card when your order arrives',
    },
    {
      id: 'apple_pay' as PaymentMethodType,
      titleAr: 'Apple Pay',
      titleEn: 'Apple Pay',
      icon: (
        <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-xs">
           Pay
        </span>
      ),
      descAr: 'دفع فوري وآمن بنقرة واحدة',
      descEn: 'One-click instant and secure checkout',
    },
    {
      id: 'card' as PaymentMethodType,
      titleAr: 'بطاقة مدى / ائتمانية (Visa / Mastercard)',
      titleEn: 'Credit / Mada Card',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      descAr: 'دفع مشفر ومحمي بمعايير 3D Secure',
      descEn: 'Encrypted payment compliant with 3D Secure',
    },
  ];

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const selectedSlotObj = deliverySlots.find((s) => s.id === deliverySlot)!;
      placeOrder({
        address: selectedAddress,
        slotAr: `${selectedSlotObj.titleAr} (${selectedSlotObj.timeAr})`,
        slotEn: `${selectedSlotObj.titleEn} (${selectedSlotObj.timeEn})`,
        paymentMethod,
        notes: sanitizeInput(courierNotes, 300),
      });
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              {isAr ? 'إتمام الطلب وتحديد موعد التوصيل' : 'Checkout & Delivery Schedule'}
            </h2>
            <p className="text-xs text-stone-500">
              {isAr ? 'مراجعة العنوان، الموعد وطريقة الدفع' : 'Review address, timing, and payment'}
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{isAr ? '1. عنوان التوصيل' : '1. Delivery Address'}</span>
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                {isAr ? 'تغيير أو إضافة عنوان' : 'Change Address'}
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-stone-900 text-sm">
                  {isAr ? selectedAddress.labelAr : selectedAddress.labelEn}
                </div>
                <div className="text-xs text-stone-600">
                  {isAr ? selectedAddress.districtAr : selectedAddress.districtEn}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  {selectedAddress.street}
                </div>
                {selectedAddress.notes && (
                  <div className="text-[11px] text-emerald-700 mt-1">
                    {isAr ? 'ملاحظة:' : 'Note:'} {selectedAddress.notes}
                  </div>
                )}
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>
          </div>

          {/* Section 2: Delivery Slot */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isAr ? '2. موعد التوصيل' : '2. Delivery Time Slot'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {deliverySlots.map((slot) => {
                const isSelected = deliverySlot === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setDeliverySlot(slot.id)}
                    className={`cursor-pointer p-3 rounded-2xl border transition-all text-start relative ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    {slot.tagAr && (
                      <span className="absolute top-2.5 end-2.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {isAr ? slot.tagAr : slot.tagEn}
                      </span>
                    )}
                    <div className="font-semibold text-xs text-stone-900 mb-1">
                      {isAr ? slot.titleAr : slot.titleEn}
                    </div>
                    <div className="text-[11px] text-stone-600 font-medium">
                      {isAr ? slot.timeAr : slot.timeEn}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Courier Instructions */}
          <div>
            <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-1.5">
              {isAr ? '3. تعليمات التوصيل للمندوب (اختياري)' : '3. Courier Instructions (Optional)'}
            </label>
            <input
              type="text"
              value={courierNotes}
              onChange={(e) => setCourierNotes(e.target.value)}
              placeholder={
                isAr
                  ? 'مثال: لا تقرع الجرس، الطفل نائم - أو اترك الأغراض عند الباب'
                  : 'e.g., Please ring the bell and leave at door'
              }
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>

          {/* Section 4: Payment Method */}
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isAr ? '4. طريقة الدفع' : '4. Payment Method'}</span>
            </h3>

            <div className="space-y-2.5">
              {paymentOptions.map((opt) => {
                const isSelected = paymentMethod === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`cursor-pointer p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-stone-900">
                          {isAr ? opt.titleAr : opt.titleEn}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {isAr ? opt.descAr : opt.descEn}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-700'
                          : 'border-stone-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Summary & Confirmation */}
        <div className="p-6 border-t border-stone-200 bg-stone-50/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col text-start w-full sm:w-auto">
            <span className="text-xs text-stone-500">
              {isAr ? 'المبلغ الإجمالي للدفع' : 'Total Amount Payable'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-stone-900 tabular-nums">
                {formatPrice(grandTotal)}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                {deliveryFee === 0 ? (isAr ? 'شحن مجاني' : 'Free Shipping') : ''}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isAr ? 'جاري تأكيد الطلب...' : 'Confirming...'}</span>
              </span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? 'تأكيد وإرسال الطلب الآن' : 'Place Order Now'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
