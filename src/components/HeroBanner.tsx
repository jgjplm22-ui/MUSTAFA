import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  ArrowRight, 
  Copy, 
  Check, 
  Bot,
  Flame,
  ShoppingBag
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';

interface HeroBannerProps {
  onGoToDeals?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onGoToDeals }) => {
  const { language, setSelectedCategory, applyCoupon, setIsChatOpen } = useMarket();
  const isAr = language === 'ar';
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('SHORJA20');
    applyCoupon('SHORJA20');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white shadow-xl shadow-stone-950/20 mb-8 border border-stone-800">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -end-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -start-24 w-80 h-80 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5 text-start">
          {/* Header Tag */}
          <div className="flex items-center gap-2 text-xs font-medium text-amber-400/90 tracking-wide">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'عراقة الشورجة وأجود المنتجات' : 'Baghdad Heritage Quality'}</span>
            </span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-300">{isAr ? 'الموقع الإلكتروني الرسمي لأسواق الشورجة' : 'Shorja Markets Official Web Platform'}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.2] text-balance">
            {isAr ? (
              <>
                مؤونة بيتك كاملة من الشورجة، <br className="hidden sm:inline" />
                <span className="text-amber-400">لحوم طازجة، غذائية، ألبان، منظفات وسناكات.</span>
              </>
            ) : (
              <>
                Your Complete Grocery from Shorja, <br className="hidden sm:inline" />
                <span className="text-amber-400">Fresh Meats, Food Staples, Dairy, Detergents & Snacks.</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-xl font-normal leading-relaxed">
            {isAr
              ? 'لحوم بلدية مذبوحة يومياً بفحص بيطري، أرز عنبر المشخاب الأصلي، قيمر عرب، منظفات بأسعار الجملة، ومسليات محمصة تصلك طازجة إلى باب بيتك.'
              : 'Daily fresh halal meats, prime Anbar rice, pure Iraqi Qaimar cream, economy detergents, and roasted crunchy snacks delivered straight to your door.'}
          </p>

          {/* Action Row & Coupon Promo */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                setSelectedCategory('meats');
                scrollToCatalog();
              }}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <span>{isAr ? 'تسوق اللحوم والمؤونة الآن' : 'Shop Meats & Staples'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            {onGoToDeals && (
              <button
                onClick={onGoToDeals}
                className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span>{isAr ? 'عروض وسلات الجملة' : 'Wholesale Bundles'}</span>
              </button>
            )}

            {/* AI Assistant Chat Trigger */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'المساعد الذكي' : 'AI Assistant'}</span>
            </button>

            {/* Coupon Code Pill */}
            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/15 px-3 py-2 rounded-xl transition-colors">
              <span className="text-xs text-stone-300">
                {isAr ? 'كوبون الخصم:' : 'Coupon:'}
              </span>
              <code className="text-xs font-mono font-bold tracking-wider text-amber-300">
                SHORJA20
              </code>
              <button
                onClick={handleCopyCoupon}
                className="p-1 hover:bg-white/20 rounded-md transition-colors text-white"
                title={isAr ? 'نسخ الكوبون وتفعيله' : 'Copy and apply coupon'}
              >
                {copiedCoupon ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Proof points */}
          <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'توصيل فوري مبرد 35-45 دقيقة' : 'Chilled Express 35-45m'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'فحص بيطري وطزاجة مؤكدة 100%' : '100% Inspected Freshness'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'دفع عند الاستلام بأسعار الجملة' : 'Cash on Delivery'}</span>
            </div>
          </div>
        </div>

        {/* Right Showcase (5 cols) */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-stone-800/80 to-stone-900/90 border border-stone-700 rounded-3xl p-6 flex flex-col items-center justify-between shadow-2xl backdrop-blur-md">
            {/* Top badge */}
            <div className="self-start text-[11px] font-bold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'سلة البيت اليومية من الشورجة' : 'Daily Household Basket'}</span>
            </div>

            {/* Collage showcasing Meat, Rice, Dairy */}
            <div className="relative w-52 h-52 my-auto flex items-center justify-center">
              <div className="absolute -top-2 -start-2 w-28 h-28 transform -rotate-12 transition-transform hover:rotate-0">
                <ProductIllustration iconType="meat" />
              </div>
              <div className="absolute -bottom-2 -end-2 w-28 h-28 transform rotate-12 transition-transform hover:rotate-0">
                <ProductIllustration iconType="chips" />
              </div>
              <div className="relative z-10 w-32 h-32 transform transition-transform hover:scale-105">
                <ProductIllustration iconType="cream" />
              </div>
            </div>

            {/* Bottom mini highlight */}
            <div className="w-full bg-stone-950/80 border border-stone-800 rounded-2xl px-3.5 py-2.5 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-white">
                  {isAr ? 'الأقسام الخمسة المعتمدة' : '5 Core Departments'}
                </span>
                <span className="text-[11px] text-stone-400">
                  {isAr ? 'لحوم · غذائية · ألبان · منظفات · سناكات' : 'Meats, Staples, Dairy, Cleaning, Snacks'}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  scrollToCatalog();
                }}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
              >
                {isAr ? 'تصفح الكل' : 'Browse All'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
