import React from 'react';
import { ShieldCheck, HeartHandshake, Truck, Clock, Award, Sparkles } from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const TrustStorySection: React.FC = () => {
  const { language } = useMarket();
  const isAr = language === 'ar';

  const pillars = [
    {
      icon: Sparkles,
      titleAr: 'طزاجة اللحوم والألبان',
      titleEn: 'Fresh Daily Meats & Dairy',
      descAr: 'لحوم بلدية مذبوحة ومبردة يومياً، وقيمر عرب طازج من حليب الجاموس مفحوص بيطرياً وصحي 100%.',
      descEn: 'Daily slaughtered fresh meats and authentic Iraqi buffalo cream, inspected and certified.',
    },
    {
      icon: Clock,
      titleAr: 'توصيل مبرد وسريع',
      titleEn: 'Temperature Controlled Delivery',
      descAr: 'سيارات ودراجات مجهزة بحافظات تبريد لضمان وصول اللحوم، الألبان، والمؤونة طازجة كأنك اشتريتها للتو.',
      descEn: 'Chilled delivery boxes keeping meats and dairy in optimal fresh conditions till your door.',
    },
    {
      icon: ShieldCheck,
      titleAr: 'أسعار الجملة والتوفير',
      titleEn: 'Wholesale Savings',
      descAr: 'نقدم لك أسعار سوق الشورجة الحقيقية في المنظفات، المواد الغذائية، والمسليات بدون وسطاء.',
      descEn: 'Real wholesale pricing on pantry goods, bulk detergents, and snacks without middlemen.',
    },
    {
      icon: Award,
      titleAr: 'فحص الجودة والاستبدال',
      titleEn: '100% Quality Guarantee',
      descAr: 'إذا لم يعجبك أي صنف أو لم يكن مطابقاً لتوقعاتك، يحق لك الاستبدال أو الإرجاع الفوري عند الاستلام.',
      descEn: 'Instant return and replacement upon delivery if any item doesn’t meet your expectations.',
    },
  ];

  return (
    <section className="my-14 rounded-3xl bg-stone-900 text-stone-100 p-8 sm:p-12 relative overflow-hidden border border-stone-800">
      {/* Background accents */}
      <div className="absolute top-0 end-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 start-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider uppercase">
          <HeartHandshake className="w-4 h-4" />
          <span>{isAr ? 'ميثاق الجودة والثقة في أسواق الشورجة' : 'The Shorja Quality Covenant'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-balance">
          {isAr
            ? 'لحوم، مؤونة، ألبان، منظفات وسناكات.. بأمانة سوق الشورجة'
            : 'Meats, Pantry, Dairy, Cleaning & Snacks with Shorja Integrity'}
        </h2>

        <p className="text-sm text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
          {isAr
            ? 'نضمن لك جودة كل كيلو لحم، وأصالة أرز العنبر، ونظافة الألبان، وتوفير المنظفات، مع إمكانية إدارة الأسعار والمنتجات بكل مرونة.'
            : 'Guaranteeing peak freshness for every cut of meat, authentic staples, and honest wholesale prices.'}
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 hover:bg-white/8 transition-all flex flex-col items-start text-start"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="font-bold text-sm sm:text-base text-white mb-2">
                {isAr ? pillar.titleAr : pillar.titleEn}
              </h3>

              <p className="text-xs text-stone-400 leading-relaxed">
                {isAr ? pillar.descAr : pillar.descEn}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
