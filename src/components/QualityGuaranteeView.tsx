import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Beef, 
  Clock, 
  Truck, 
  RotateCcw, 
  HeartHandshake, 
  CheckCircle2,
  FileCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';

interface Props {
  onGoToShop: () => void;
}

export const QualityGuaranteeView: React.FC<Props> = ({ onGoToShop }) => {
  const { language } = useMarket();
  const isAr = language === 'ar';

  const pillars = [
    {
      icon: Beef,
      titleAr: 'إشراف بيطري وختم صحي معتمد',
      titleEn: 'Veterinary Supervised & Health Stamped',
      descAr: 'تخضع جميع الذبائح (لحم الغنم العراقي ولحم العجل والطيور المبردة) لفحص بيطري دقيق قبل وبعد الذبح للتأكد من سلامتها التامة 100%.',
      descEn: 'All fresh lamb, veal, and chilled poultry undergo rigorous veterinary inspection pre- and post-slaughter.',
    },
    {
      icon: Clock,
      titleAr: 'سلسلة تبريد مغلقة (Cold Chain)',
      titleEn: 'Continuous Cold-Chain Logistics',
      descAr: 'يتم نقل اللحوم والألبان (القيمر، الحليب، الأجبان) في صناديق حرارية مبردة مخصصة تحافظ على درجة حرارة مثالية بين 2 إلى 4 درجات مئوية.',
      descEn: 'Strict cold-chain logistics from butcher shop to your kitchen door between 2°C and 4°C.',
    },
    {
      icon: Award,
      titleAr: 'عراقة سوق الشورجة وأسعار الجملة',
      titleEn: 'Shorja Heritage & True Wholesale Rates',
      descAr: 'سوق الشورجة التاريخي هو قلب التجارة العراقية منذ عقود. ننقل لك هذه التجربة الأصلية بالأسعار المباشرة بدون زيادات المحلات الفرعية.',
      descEn: 'Baghdads historic wholesale heartland brought to your fingertips with no retail markups.',
    },
    {
      icon: RotateCcw,
      titleAr: 'حق المعاينة والاستبدال الفوري',
      titleEn: 'Instant Inspection & Return Policy',
      descAr: 'ثقتك هي أولويتنا. إذا لم يطابق اللحم أو أي منتج غذائي توقعاتك عند وصول المندوب، يحق لك إرجاعه أو استبداله فوراً دون أي تعقيد.',
      descEn: 'Inspect your order upon delivery. Instant replacement or refund if any item fails your satisfaction.',
    },
  ];

  return (
    <div className="py-6 space-y-10 animate-in fade-in duration-200">
      {/* Editorial Hero Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-stone-800 shadow-xl">
        <div className="absolute top-0 end-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'ميثاق الجودة والأمانة المهنية' : 'The Shorja Quality Covenant'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {isAr ? (
              <>
                عراقة الشورجة البغدادية.. <br />
                <span className="text-amber-400">بمعايير صحية وفحص بيطري لا يقبل المساومة.</span>
              </>
            ) : (
              <>
                Authentic Baghdad Heritage, <br />
                <span className="text-amber-400">Uncompromising Veterinary & Hygiene Standards.</span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base text-stone-300 leading-relaxed font-normal">
            {isAr
              ? 'نحن لا نقدم مجرد توصيل طلبات؛ بل ننقل لك ثقة سوق الشورجة العريق من خلال انتقاء أجود أنواع الذبائح البلدية، أرز العنبر العراقي الأصلي، ألبان الجاموس الطازجة، والمنظفات التوفيرية الأصلية 100%.'
              : 'More than grocery delivery: we bring you decades of Baghdad trade excellence with inspected fresh halal meats, prime Anbar rice, and authentic goods.'}
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onGoToShop}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md active:scale-95"
            >
              {isAr ? 'تسوق الأقسام المعتمدة الآن' : 'Explore Certified Departments'}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pil, idx) => {
          const IconComp = pil.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center mb-4">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-stone-900 mb-2">
                  {isAr ? pil.titleAr : pil.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {isAr ? pil.descAr : pil.descEn}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-bold text-amber-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'معيار جودة معتمد في أسواق الشورجة' : 'Certified Quality Standard'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Numbers & Baghdad Coverage */}
      <div className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-stone-900 font-mono">100%</span>
          <span className="text-xs text-stone-500 font-bold">{isAr ? 'ذبح حلال مفحوص' : 'Halal Inspected'}</span>
        </div>
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-stone-900 font-mono">35-45 د</span>
          <span className="text-xs text-stone-500 font-bold">{isAr ? 'سرعة التوصيل المبرد' : 'Chilled Delivery Time'}</span>
        </div>
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-stone-900 font-mono">24/7</span>
          <span className="text-xs text-stone-500 font-bold">{isAr ? 'دعم وحماية مستهلك' : 'Support & Consumer Care'}</span>
        </div>
        <div>
          <span className="block text-2xl sm:text-3xl font-black text-stone-900 font-mono">+12,000</span>
          <span className="text-xs text-stone-500 font-bold">{isAr ? 'عائلة مستفيدة شهرياً' : 'Satisfied Families'}</span>
        </div>
      </div>
    </div>
  );
};
