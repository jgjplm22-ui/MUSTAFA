import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Heart, Bot, AlertTriangle, ShieldCheck, Truck, Flame, Smartphone } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { WebsiteView } from './Navbar';
import { CategoryId } from '../types/market';
import { AndroidApkModal } from './AndroidApkModal';

interface FooterProps {
  setActiveView: (view: WebsiteView) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  const { language, setSelectedCategory, setIsChatOpen, setIsAuthModalOpen } = useMarket();
  const isAr = language === 'ar';
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  const handleCategoryClick = (cat: CategoryId) => {
    setSelectedCategory(cat);
    setActiveView('shop');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-14 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-stone-950 font-black text-xl">
                ش
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight block">
                  {isAr ? 'أسواق الشورجة الإلكترونية' : 'Shorja Markets Online'}
                </span>
                <span className="text-[11px] text-amber-400 font-bold block">
                  {isAr ? 'السوق المركزي العراقي للمؤونة واللحوم والسلع' : 'Central Iraqi Wholesale & Grocery Market'}
                </span>
              </div>
            </div>
            
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              {isAr
                ? 'متجر إلكتروني متكامل يوفر لحوم بلدية مذبوحة يومياً، تموين ومؤونة منزلية كاملة، ألبان وقيمر عرب، منظفات بأسعار الجملة، وسناكات عائلية تصلك بحوافظ مبردة إلى باب منزلك.'
                : 'A complete online supermarket providing daily fresh halal meats, pantry goods, authentic Iraqi qaimar, wholesale detergents, and snacks delivered in chilled storage.'}
            </p>

            <div className="space-y-2 text-xs text-stone-400 pt-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'الخدمة والتوصيل: يومياً 7:00 ص - 12:00 منتصف الليل' : 'Daily 7:00 AM - Midnight'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:07779648839" className="font-mono text-amber-300 hover:text-amber-200 font-bold transition-colors" dir="ltr">07779648839</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">orders@shorja-markets.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'بغداد - مركز التوزيع الرئيسي (تغطية الكرخ والرصافة)' : 'Baghdad - Main Distribution Hub'}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Shorja 5 Core Departments */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
              <span>{isAr ? 'أقسام المتجر المعتمدة' : 'Departments'}</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('meats')}
                  className="hover:text-amber-400 transition-colors text-start"
                >
                  {isAr ? '🥩 لحوم ودواجن طازجة يومياً' : 'Fresh Halal Meats & Poultry'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('groceries')}
                  className="hover:text-amber-400 transition-colors text-start"
                >
                  {isAr ? '🌾 مواد غذائية ومؤونة تموين' : 'Food Staples & Anbar Rice'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('dairy')}
                  className="hover:text-amber-400 transition-colors text-start"
                >
                  {isAr ? '🥛 ألبان وأجبان وقيمر عرب' : 'Dairy, Cheese & Qaimar'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('detergents')}
                  className="hover:text-amber-400 transition-colors text-start"
                >
                  {isAr ? '✨ منظفات ومعقمات بأسعار الجملة' : 'Wholesale Cleaners'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('snacks')}
                  className="hover:text-amber-400 transition-colors text-start"
                >
                  {isAr ? '🍪 سناكات ومسليات ومكسرات' : 'Snacks & Roasted Nuts'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Website Navigation & Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              {isAr ? 'صفحات وخدمات الموقع' : 'Website Services'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setActiveView('deals');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-amber-300 font-bold"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isAr ? 'عروض وسلات التوفير الكبرى' : 'Weekly Big Deals & Packs'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('tracking');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'تتبع مسار شحنتك المباشر' : 'Live Order Tracking'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('quality');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'عن الشورجة وضمان الفحص البيطري' : 'Heritage & Vet Certification'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('complaints');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-amber-400 font-bold"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'مركز الشكاوى وحماية المستهلك' : 'Complaints & Support Center'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-semibold"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>{isAr ? 'مساعد الشورجة الذكي (AI Chat)' : 'AI Support Assistant'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsApkModalOpen(true)}
                  className="hover:text-emerald-400 text-emerald-300 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'تطبيق أندرويد (تثبيت APK)' : 'Android App (Install APK)'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hover:text-white transition-colors text-start"
                >
                  {isAr ? 'بوابة دخول الزبائن والإدارة' : 'Customer & Admin Portal'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Delivery & Payment Methods */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              {isAr ? 'الدفع والتوصيل في بغداد' : 'Payment & Baghdad Delivery'}
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              {isAr
                ? 'الدفع نقداً بالدينار العراقي (IQD) عند استلام الطلب ومعاينته، أو عبر المحافظ الرقمية المعتمدة.'
                : 'Cash payment upon delivery (IQD) after physical inspection, or through verified e-wallets.'}
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-bold text-stone-300">
              <span className="px-2 py-1 bg-stone-800 rounded-lg border border-stone-700">دينار عراقي (IQD)</span>
              <span className="px-2 py-1 bg-stone-800 rounded-lg border border-stone-700">كاش عند الاستلام</span>
              <span className="px-2 py-1 bg-stone-800 rounded-lg border border-stone-700">ZainCash / زين كاش</span>
              <span className="px-2 py-1 bg-stone-800 rounded-lg border border-stone-700">Qi Card / كي كارد</span>
              <span className="px-2 py-1 bg-stone-800 rounded-lg border border-stone-700">Visa / Mastercard</span>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-500">
              <span>{isAr ? 'تغطية فورية: المنصور، الكرادة، اليرموك، الجادرية، الغزالية، زيونة، فلسطين، الدورة وكافة أحياء بغداد.' : 'Full coverage across all Baghdad districts.'}</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3 border-t border-stone-800/80 mt-2">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 text-center sm:text-start">
            <span className="font-bold text-amber-400/95">
              جميع الحقوق محفوظة لدى مصطفى بكر وفق القانون
            </span>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="text-stone-500">
              © {new Date().getFullYear()} {isAr ? 'أسواق الشورجة - الموقع الإلكتروني الرسمي' : 'Shorja Markets Official Platform'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <span>{isAr ? 'عراقة التجارة البغدادية الأصيلة وأسعار الجملة' : 'Authentic Baghdad Trade Heritage'}</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
        </div>
      </div>

      <AndroidApkModal isOpen={isApkModalOpen} onClose={() => setIsApkModalOpen(false)} />
    </footer>
  );
};
