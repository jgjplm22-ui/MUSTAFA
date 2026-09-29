import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShoppingBag, 
  Settings, 
  KeyRound, 
  Phone, 
  User, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';

export const AuthGatewayModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    loginCustomer,
    loginAdmin,
    adminLockoutRemaining,
    adminFailedAttempts,
    language,
  } = useMarket();

  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');

  // Customer form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Admin form fields
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginCustomer(
      customerName.trim() || (isAr ? 'زبون الشورجة' : 'Valued Customer'),
      customerPhone.trim() || '07701234567'
    );
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (adminLockoutRemaining > 0) {
      setAdminError(
        isAr 
          ? `تم قفل تسجيل الدخول مؤقتاً لحماية المتجر! يرجى الانتظار ${adminLockoutRemaining} ثانية.`
          : `Temporarily locked out for security. Try again in ${adminLockoutRemaining}s.`
      );
      return;
    }

    const success = loginAdmin(adminPin);
    if (!success) {
      const remainingAttempts = 5 - (adminFailedAttempts + 1);
      if (remainingAttempts <= 0) {
        setAdminError(
          isAr 
            ? 'تم تجاوز الحد الأقصى للمحاولات! تم قفل الحساب مؤقتاً لمدة 3 دقائق.' 
            : 'Too many incorrect attempts! Temporarily locked for 3 minutes.'
        );
      } else {
        setAdminError(
          isAr 
            ? `رمز الأمان غير صحيح! (متبقي ${remainingAttempts} محاولات قبل القفل المؤقت).` 
            : `Incorrect PIN! (${remainingAttempts} attempts remaining before lockout).`
        );
      }
    }
  };

  const handleQuickCustomer = () => {
    loginCustomer(isAr ? 'حيدر البغدادي (زبون)' : 'Haydar Al-Baghdadi', '07701234567');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button if user already logged in */}
        {currentUser && (
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 end-4 z-20 p-2 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Header Banner */}
        <div className="bg-stone-900 text-white p-6 sm:p-7 border-b border-stone-800 text-center relative overflow-hidden">
          <div className="absolute -top-12 -end-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -start-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 bg-stone-800/80 border border-stone-700 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'بوابة الدخول الموحدة' : 'Unified Access Portal'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isAr ? 'أهلاً بك في أسواق الشورجة' : 'Welcome to Shorja Markets'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-md mx-auto">
            {isAr 
              ? 'اختر نوع الحساب للمتابعة: حساب الزبائن للتسوق أو حساب الإدارة للتحكم بالمنتجات والأسعار'
              : 'Select your portal: Customer login for shopping or Admin login to manage products and prices'}
          </p>

          {/* Section Switcher Tabs */}
          <div className="mt-5 grid grid-cols-2 max-w-md mx-auto bg-stone-800 p-1 rounded-2xl border border-stone-700 text-xs sm:text-sm font-bold">
            <button
              onClick={() => {
                setActiveTab('customer');
                setAdminError('');
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'customer'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isAr ? '1. تسجيل دخول الزبائن' : '1. Customer Login'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setAdminError('');
              }}
              className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>{isAr ? '2. تسجيل دخول الإداريين' : '2. Admin Portal'}</span>
            </button>
          </div>
        </div>

        {/* Portal Bodies */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* SECTION 1: CUSTOMER LOGIN */}
          {activeTab === 'customer' && (
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in duration-150">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {isAr ? 'دخول الزبائن للتسوق والطلبات' : 'Customer Shopping Access'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {isAr
                      ? 'تصفح أقسام اللحوم، الغذائية، الألبان، المنظفات، والسناكات، مع تتبع حالة الشحنة لحظة بلحظة.'
                      : 'Shop fresh meats, pantry goods, dairy, detergents, and snacks with live order tracking.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'الاسم الكريم' : 'Your Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isAr ? 'مثال: حيدر البغدادي أو أم أحمد' : 'e.g., John Doe'}
                      className="w-full ps-9 pe-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'رقم الهاتف (للتوصيل والتواصل)' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={isAr ? '0770 123 4567' : '+964 770 123 4567'}
                      className="w-full ps-9 pe-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white transition-all font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>{isAr ? 'دخول وبدء التسوق في الشورجة' : 'Log In & Start Shopping'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Quick 1-Click shortcut */}
              <div className="pt-2 border-t border-stone-100 flex flex-col items-center gap-2 text-center">
                <span className="text-[11px] text-stone-400">
                  {isAr ? 'أو يمكنك التجربة الفورية بنقرة واحدة:' : 'Or enter instantly as guest customer:'}
                </span>
                <button
                  type="button"
                  onClick={handleQuickCustomer}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? '⚡ دخول فوري كزبون تجريبي' : '⚡ Instant Demo Customer Login'}</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2: ADMIN / MERCHANT LOGIN */}
          {activeTab === 'admin' && (
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in duration-150">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-stone-900">
                      {isAr ? 'لوحة تحكم إداريي المتجر' : 'Store Administrator Portal'}
                    </h3>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                      Admin
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {isAr
                      ? 'صلاحيات كاملة: إضافة منتجات جديدة للأقسام، تعديل أسعار المواد فورياً، وتعديل المخزون.'
                      : 'Full privileges: add new products, edit live prices instantly, and toggle item availability.'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-stone-800">
                      {isAr ? 'رمز الأمان / كلمة سر الإدارة (PIN)' : 'Admin Security PIN'}
                    </label>
                  </div>

                  <div className="relative">
                    <KeyRound className="absolute inset-y-0 start-3 my-auto w-4 h-4 text-stone-400" />
                    <input
                      type="password"
                      disabled={adminLockoutRemaining > 0}
                      value={adminPin}
                      onChange={(e) => {
                        setAdminPin(e.target.value);
                        setAdminError('');
                      }}
                      placeholder="••••"
                      autoComplete="current-password"
                      className={`w-full ps-9 pe-3 py-2.5 rounded-xl text-sm transition-all font-mono tracking-widest text-center ${
                        adminLockoutRemaining > 0
                          ? 'bg-stone-100 border-rose-300 text-stone-400 cursor-not-allowed'
                          : 'bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white'
                      }`}
                    />
                  </div>

                  {adminLockoutRemaining > 0 && (
                    <div className="p-2.5 mt-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between font-bold animate-pulse">
                      <span>{isAr ? '🔒 الحساب مقفل مؤقتاً لحماية المتجر' : '🔒 Temporarily locked'}</span>
                      <span className="font-mono bg-rose-200 text-rose-950 px-2 py-0.5 rounded-lg">
                        {adminLockoutRemaining}s
                      </span>
                    </div>
                  )}

                  {adminError && !adminLockoutRemaining && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  {/* Security Badge */}
                  <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-center gap-1 text-center">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{isAr ? 'محمي ضد هجمات القوة الغاشمة والتخمين (OWASP Top 10)' : 'Protected against brute-force attacks'}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={adminLockoutRemaining > 0 || !adminPin.trim()}
                  className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
                    adminLockoutRemaining > 0 || !adminPin.trim()
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-emerald-800 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>{isAr ? 'دخول لوحة إدارة المنتجات والأسعار' : 'Log In to Admin Dashboard'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer info line */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
          {isAr
            ? '💡 يمكنك في أي وقت التبديل بين حساب الزبون وحساب الإدارة من أعلى الصفحة.'
            : '💡 You can switch between Customer and Admin accounts anytime from the top bar.'}
        </div>
      </div>
    </div>
  );
};
