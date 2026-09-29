import React from 'react';
import { Truck, ShieldCheck, BadgePercent, RotateCcw, Clock } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const StoreFeaturesBar: React.FC = () => {
  const { language } = useMarket();
  const isAr = language === 'ar';

  const features = [
    {
      icon: Clock,
      titleAr: 'توصيل مبرد وسريع',
      titleEn: 'Chilled Express Delivery',
      descAr: 'توصيل خلال 35-45 دقيقة بحوافظ مبردة مخصصة للحوم والألبان',
      descEn: 'Temperature-controlled delivery within 35-45 mins',
    },
    {
      icon: ShieldCheck,
      titleAr: 'لحوم بلدية مفحوصة بيطرياً',
      titleEn: 'Veterinary Certified Meats',
      descAr: 'ذبح حلال يومي مع إشراف صحي كامل وطزاجة مؤكدة 100%',
      descEn: '100% Halal fresh slaughter inspected by licensed vets',
    },
    {
      icon: BadgePercent,
      titleAr: 'أسعار جملة الشورجة الحقيقية',
      titleEn: 'Authentic Wholesale Prices',
      descAr: 'وفر في المؤونة والمنظفات والغذائيات بأسعار سوق الشورجة المباشرة',
      descEn: 'Direct wholesale pricing on pantry, detergents & staples',
    },
    {
      icon: RotateCcw,
      titleAr: 'دفع عند الاستلام وضمان استرجاع',
      titleEn: 'Cash on Delivery & Returns',
      descAr: 'عاين طلبك قبل الدفع، مع حق الاستبدال أو الإرجاع الفوري',
      descEn: 'Inspect before paying with instant replacement guarantee',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      {features.map((feat, idx) => {
        const IconComponent = feat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-2xs hover:shadow-sm hover:border-amber-400/50 transition-all flex items-start gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 transition-colors border border-amber-200/60">
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-stone-900 leading-tight">
                {isAr ? feat.titleAr : feat.titleEn}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 font-normal leading-relaxed">
                {isAr ? feat.descAr : feat.descEn}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
