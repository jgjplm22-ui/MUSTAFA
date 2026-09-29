import React, { useState } from 'react';
import { 
  Flame, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Percent, 
  Clock, 
  Plus, 
  Tag
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';

interface DealBundle {
  id: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  productIds: string[];
  discountPercent: number;
}

export const WeeklyDealsSection: React.FC = () => {
  const { products, addToCart, formatPrice, language, setIsCartOpen } = useMarket();
  const isAr = language === 'ar';
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  const bundles: DealBundle[] = [
    {
      id: 'family-basket',
      titleAr: 'سلة مؤونة العائلة الكبرى',
      titleEn: 'Grand Family Household Basket',
      badgeAr: 'الأكثر توفيراً ⚡',
      badgeEn: 'Best Value ⚡',
      descriptionAr: 'تشكيلة متكاملة من لحم غنم طازج، أرز عنبر المشخاب، قيمر عرب أصلي، وزيت طعام عالي النقاء.',
      descriptionEn: 'Complete basket with fresh lamb, Anbar rice, Iraqi qaimar cream, and premium cooking oil.',
      productIds: ['meat-01', 'groc-01', 'dairy-01', 'groc-02'],
      discountPercent: 20,
    },
    {
      id: 'bbq-meat-pack',
      titleAr: 'سلة اللحوم والمشاوي الطازجة',
      titleEn: 'Fresh Meat & BBQ Master Pack',
      badgeAr: 'طزاجة يومية 100%',
      badgeEn: '100% Fresh Daily',
      descriptionAr: 'لحم غنم بالعظم مع دجاج بلدي مبرد ومفروم كباب عراقي متبل ومجهز للشوي الفوري.',
      descriptionEn: 'Fresh bone-in lamb, chilled farm chicken, and seasoned minced Iraqi kebab for instant grilling.',
      productIds: ['meat-01', 'meat-03', 'meat-04'],
      discountPercent: 15,
    },
    {
      id: 'clean-home-pack',
      titleAr: 'سلة التوفير ونظافة المنزل',
      titleEn: 'Wholesale Home Cleanliness Pack',
      badgeAr: 'سعر جملة الشورجة',
      badgeEn: 'Shorja Wholesale Price',
      descriptionAr: 'مسحوق غسيل أوتوماتيك كيس كبير مع سائل جلي المركز وكلور معقم للأرضيات والأسطح.',
      descriptionEn: 'Large automatic laundry powder, concentrated dishwashing liquid, and disinfectant bleach.',
      productIds: ['det-01', 'det-02', 'det-03'],
      discountPercent: 18,
    },
  ];

  const handleAddBundle = (bundle: DealBundle) => {
    bundle.productIds.forEach((pid) => {
      const prod = products.find((p) => p.id === pid);
      if (prod) {
        addToCart(prod, 1);
      }
    });

    setAddedBundleId(bundle.id);
    setTimeout(() => {
      setAddedBundleId(null);
    }, 2000);
  };

  return (
    <section className="my-10 bg-gradient-to-b from-stone-50 to-white rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full mb-2 border border-amber-200">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>{isAr ? 'عروض الشورجة الأسبوعية وسلات الجملة' : 'Weekly Wholesale Deals & Family Packs'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {isAr ? 'وفر أكثر مع سلات التوفير الجاهزة' : 'Save More with Curated Family Bundles'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl font-normal">
            {isAr
              ? 'سلات متكاملة منتقاة بعناية بأسعار الجملة المباشرة، مع خصومات حصرية وتوصيل فوري مبرد إلى باب منزلك.'
              : 'Handpicked grocery baskets at direct wholesale prices with exclusive instant savings.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-end">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAr ? 'عروض سارية حتى نهاية الأسبوع' : 'Valid Until End of Week'}</span>
          </div>
        </div>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {bundles.map((bundle) => {
          const bundleProducts = bundle.productIds
            .map((pid) => products.find((p) => p.id === pid))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));

          const originalSum = bundleProducts.reduce((sum, p) => sum + (p.originalPrice || p.price), 0);
          const discountedSum = Math.round(originalSum * (1 - bundle.discountPercent / 100));
          const savingsAmount = originalSum - discountedSum;
          const isAdded = addedBundleId === bundle.id;

          return (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-amber-400/60 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Badge & Discount Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                    {isAr ? bundle.badgeAr : bundle.badgeEn}
                  </span>
                  <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    <span>{isAr ? `وفر ${bundle.discountPercent}%` : `Save ${bundle.discountPercent}%`}</span>
                  </span>
                </div>

                {/* Bundle Title */}
                <h3 className="text-base font-black text-stone-900 group-hover:text-amber-800 transition-colors mb-1.5">
                  {isAr ? bundle.titleAr : bundle.titleEn}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed mb-4">
                  {isAr ? bundle.descriptionAr : bundle.descriptionEn}
                </p>

                {/* Visual Included Items Carousel / Thumbnails */}
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 mb-4">
                  <div className="text-[11px] font-bold text-stone-600 mb-2 flex items-center justify-between">
                    <span>{isAr ? 'الأصناف المتضمنة في السلة:' : 'Items Included:'}</span>
                    <span className="text-stone-400">{bundleProducts.length} {isAr ? 'منتجات' : 'items'}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {bundleProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex flex-col items-center text-center p-1.5 bg-white rounded-lg border border-stone-200/80 shadow-2xs"
                        title={isAr ? prod.nameAr : prod.nameEn}
                      >
                        <div className="w-9 h-9 p-1 flex items-center justify-center">
                          <ProductIllustration
                            iconType={prod.iconType}
                            imageUrl={prod.imageUrl}
                            alt={isAr ? prod.nameAr : prod.nameEn}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-stone-800 truncate w-full mt-1">
                          {isAr ? prod.nameAr : prod.nameEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Calculation & Add Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-black text-stone-900 font-mono">
                      {formatPrice(discountedSum)}
                    </span>
                    <span className="text-xs text-stone-400 line-through font-mono">
                      {formatPrice(originalSum)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">
                    {isAr ? `توفير إجمالي: ${formatPrice(savingsAmount)}` : `Total Savings: ${formatPrice(savingsAmount)}`}
                  </span>
                </div>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 hover:bg-stone-800 text-amber-400'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{isAr ? 'تمت الإضافة للسلة' : 'Added to Cart'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isAr ? 'أضف السلة كاملة' : 'Add Bundle'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
