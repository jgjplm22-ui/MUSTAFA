import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Check, 
  Truck
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    grandTotal,
    formatPrice,
    language,
    setIsCheckoutOpen,
  } = useMarket();

  const [couponInput, setCouponInput] = useState('');
  const isAr = language === 'ar';

  if (!isCartOpen) return null;

  const freeDeliveryRemaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {isAr ? 'سلة التسوق' : 'Shopping Cart'}
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">
                ({cart.reduce((s, i) => s + i.quantity, 0)} {isAr ? 'أصناف' : 'items'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors p-1"
                  title={isAr ? 'إفراغ السلة' : 'Clear cart'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free delivery tracker progress bar */}
          <div className="px-6 py-3 bg-emerald-50/70 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs font-medium text-emerald-900 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {freeDeliveryRemaining === 0
                    ? isAr
                      ? 'مبروك! طلبك مؤهل للتوصيل المجاني 🎉'
                      : 'You unlocked Free Express Delivery! 🎉'
                    : isAr
                    ? `أضف بقيمة ${formatPrice(freeDeliveryRemaining)} للحصول على توصيل مجاني`
                    : `Add ${formatPrice(freeDeliveryRemaining)} more for Free Delivery`}
                </span>
              </div>
              <span className="tabular-nums font-bold text-[11px] text-emerald-700">
                {freeDeliveryPercent}%
              </span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeDeliveryPercent}%` }}
              />
            </div>
          </div>

          {/* Content area: Cart items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-1">
                  {isAr ? 'سلتك فارغة حالياً' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  {isAr
                    ? 'تصفح تشكيلة الخضار والفواكه والمخبوزات الطازجة وأضف طلباتك المفضلة.'
                    : 'Browse through fresh fruits, farm dairy, and artisan bakery to fill your basket.'}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  {isAr ? 'ابدأ التسوق الآن' : 'Start Shopping'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-stone-50/80 rounded-2xl border border-stone-200/80 hover:border-stone-300 transition-colors"
                >
                  {/* Thumbnail illustration */}
                  <div className="w-16 h-16 bg-white rounded-xl p-2 shrink-0 border border-stone-200/60 flex items-center justify-center overflow-hidden">
                    <ProductIllustration 
                      iconType={item.product.iconType} 
                      imageUrl={item.product.imageUrl} 
                      alt={isAr ? item.product.nameAr : item.product.nameEn} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  {/* Info & stepper */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-stone-900 text-xs sm:text-sm truncate">
                          {isAr ? item.product.nameAr : item.product.nameEn}
                        </h4>
                        <span className="text-[11px] text-stone-400">
                          {isAr ? item.product.unitAr : item.product.unitEn}
                        </span>
                        {item.itemNote && (
                          <p className="text-[10px] text-emerald-700 italic truncate mt-0.5">
                            "{item.itemNote}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                        title={isAr ? 'حذف' : 'Remove'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <div className="flex items-center bg-white rounded-lg p-0.5 border border-stone-200">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-stone-100 text-stone-700 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-stone-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-end">
                        <span className="font-bold text-xs sm:text-sm text-stone-900 tabular-nums">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer calculation & checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50/70 space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-100/60 border border-emerald-300/60 rounded-xl px-3 py-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{appliedCoupon}</span>
                      <span className="text-[11px] text-emerald-700">
                        (-{formatPrice(couponDiscount)})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-rose-600 hover:underline font-medium"
                    >
                      {isAr ? 'إلغاء' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute inset-y-0 start-2.5 my-auto w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder={isAr ? 'رمز الكوبون (جرب MARKET20)' : 'Coupon code (try MARKET20)'}
                          className="w-full ps-8 pe-3 py-1.5 bg-white text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        {isAr ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-rose-600 font-medium ps-1">
                        {couponError}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Price summary table */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-semibold text-stone-800 tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{isAr ? 'خصم الكوبون' : 'Coupon Discount'}</span>
                    <span className="tabular-nums">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">{isAr ? 'مجاني' : 'Free'}</span>
                  ) : (
                    <span className="font-semibold text-stone-800 tabular-nums">
                      {formatPrice(deliveryFee)}
                    </span>
                  )}
                </div>

                <div className="flex justify-between text-stone-400 text-[11px]">
                  <span>{isAr ? 'شامل ضريبة القيمة المضافة (15%)' : 'Includes 15% VAT'}</span>
                  <span className="tabular-nums">{formatPrice(subtotal * 0.15)}</span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>{isAr ? 'الإجمالي النهائي' : 'Total'}</span>
                  <span className="tabular-nums text-emerald-800">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>{isAr ? 'متابعة الدفع وتأكيد الطلب' : 'Proceed to Checkout'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
