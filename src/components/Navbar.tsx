import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  ReceiptText, 
  Globe, 
  X,
  Bot,
  User,
  ShieldCheck,
  LogOut,
  SlidersHorizontal,
  AlertTriangle,
  ArrowDown,
  Sparkles,
  Plus,
  Flame,
  Truck,
  Phone,
  Clock,
  Headphones,
  LayoutGrid,
  Beef,
  PackageOpen,
  Milk,
  Cookie,
  Barcode
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { CurrencyCode, CategoryId } from '../types/market';
import { CATEGORIES } from '../data/marketData';
import { ProductIllustration } from './ProductIllustrations';
import { matchesProductSearch } from '../utils/searchHelper';
import { CashierScannerModal } from './CashierScannerModal';
import { PWAInstallButton } from './PWAInstallButton';

export type WebsiteView = 'shop' | 'deals' | 'tracking' | 'quality' | 'complaints';

interface NavbarProps {
  activeView: WebsiteView;
  setActiveView: (view: WebsiteView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView }) => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    selectedAddress,
    setIsAddressModalOpen,
    searchQuery,
    setSearchQuery,
    cartTotalCount,
    grandTotal,
    setIsCartOpen,
    favorites,
    setIsWishlistOpen,
    orders,
    selectedCategory,
    setSelectedCategory,
    setIsChatOpen,
    currentUser,
    setIsAuthModalOpen,
    setIsAdminPanelOpen,
    isAdmin,
    logout,
    products,
    formatPrice,
    setQuickViewProduct,
    addToCart,
  } = useMarket();

  const isAr = language === 'ar';
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick suggestions for one-click search
  const popularKeywords = isAr
    ? ['لحم غنم', 'دجاج مبرد', 'تمن عنبر', 'قيمر عرب', 'سائل جلي', 'مسحوق غسيل', 'شاي مهيل', 'شبس مقرمش']
    : ['Lamb Chops', 'Chicken', 'Anbar Rice', 'Qaimar Cream', 'Dish Soap', 'Laundry Powder', 'Tea', 'Chips'];

  // Matches across all products
  const liveSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter((p) => matchesProductSearch(p, searchQuery));
  }, [products, searchQuery]);

  const scrollToCatalog = () => {
    setIsSearchOpen(false);
    setActiveView('shop');
    setTimeout(() => {
      const element = document.getElementById('catalog-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const navLinks: { view?: WebsiteView; category?: CategoryId; labelAr: string; labelEn: string; icon?: any; badge?: string }[] = [
    { view: 'shop', category: 'all', labelAr: 'الرئيسية والمتجر', labelEn: 'Storefront', icon: LayoutGrid },
    { view: 'shop', category: 'meats', labelAr: 'لحوم ودواجن', labelEn: 'Meats', icon: Beef },
    { view: 'shop', category: 'groceries', labelAr: 'غذائية ومؤونة', labelEn: 'Staples', icon: PackageOpen },
    { view: 'shop', category: 'dairy', labelAr: 'ألبان وأجبان', labelEn: 'Dairy', icon: Milk },
    { view: 'shop', category: 'detergents', labelAr: 'منظفات وعناية', labelEn: 'Detergents', icon: Sparkles },
    { view: 'shop', category: 'snacks', labelAr: 'سناكات ومسليات', labelEn: 'Snacks', icon: Cookie },
    { view: 'deals', labelAr: 'عروض الجملة', labelEn: 'Deals & Packs', icon: Flame, badge: 'خصم 20%' },
    { view: 'tracking', labelAr: 'تتبع الطلب', labelEn: 'Track Order', icon: Truck },
    { view: 'quality', labelAr: 'عن أسواق الشورجة', labelEn: 'About & Quality', icon: ShieldCheck },
    { view: 'complaints', labelAr: 'مركز الشكاوى', labelEn: 'Complaints', icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs">
      {/* 1. Top Utility & Announcement Bar (Full width e-commerce header bar) */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-3 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
          {/* Left: Hotline & Working hours */}
          <div className="flex items-center gap-2 sm:gap-4 text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5 text-stone-300">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">{isAr ? 'هاتف الطلبات والدعم:' : 'Support Hotline:'}</span>
              <a href="tel:07779648839" className="font-mono font-bold text-amber-400 hover:text-amber-300 transition-colors" dir="ltr">07779648839</a>
            </div>

            <span className="hidden md:inline text-stone-700">|</span>

            <div className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{isAr ? 'الخدمة يومياً: 7:00 ص - 12:00 منتصف الليل' : 'Daily: 7 AM - Midnight'}</span>
            </div>

            <span className="hidden lg:inline text-stone-700">|</span>

            <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>{isAr ? 'توصيل مبرد لكافة مناطق بغداد' : 'Express Chilled Delivery in Baghdad'}</span>
            </div>
          </div>

          {/* Right: Location, Currency, Language & User Gateway */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ms-auto">
            {/* Delivery address button */}
            <button 
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center gap-1 hover:text-amber-400 transition-colors text-left rtl:text-right group"
              title={isAr ? 'تغيير عنوان التوصيل' : 'Change delivery address'}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-white text-[11px] truncate max-w-[90px] sm:max-w-xs">
                {isAr ? selectedAddress.districtAr : selectedAddress.districtEn}
              </span>
            </button>

            <span className="text-stone-700">|</span>

            {/* Currency selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] rounded px-1.5 py-0.5 border border-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer font-medium"
              aria-label="Currency"
            >
              <option value="IQD">IQD (د.ع عراقي)</option>
              <option value="SAR">SAR (ر.س)</option>
              <option value="USD">USD ($)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="EGP">EGP (ج.م)</option>
            </select>

            <span className="text-stone-700">|</span>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="flex items-center gap-1 text-stone-300 hover:text-white transition-colors text-[11px] font-medium px-1.5 py-0.5 rounded hover:bg-stone-800"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3 h-3" />
              <span>{isAr ? 'English' : 'العربية'}</span>
            </button>

            <span className="text-stone-700">|</span>

            {/* User Account / Admin Status */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (isAdmin) {
                      setIsAdminPanelOpen(true);
                    } else {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    isAdmin
                      ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                      : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                  }`}
                >
                  {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  <span className="truncate max-w-[100px]">{currentUser.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-stone-400 hover:text-rose-400 p-0.5 transition-colors"
                  title={isAr ? 'تسجيل الخروج' : 'Logout'}
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold text-[11px] px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-750 transition-colors"
              >
                <User className="w-3 h-3" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Web Store Bar: Brand Wordmark — Central Search — Action Buttons */}
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('shop');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-stone-900 flex items-center justify-center text-amber-400 shadow-sm border border-stone-800 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl sm:text-2xl font-['Cairo']">ش</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors leading-tight">
                {isAr ? 'أسواق الشورجة' : 'Shorja Markets'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-500 font-bold tracking-wide">
                {isAr ? 'السوق المركزي الإلكتروني للمؤونة والجملة' : 'Central E-Grocery & Wholesale Market'}
              </span>
            </div>
          </a>

          {/* Action Hub on Mobile: Android APK, Cashier POS Barcode, Live Chat, Cart */}
          <div className="flex items-center gap-1.5 md:hidden shrink-0">
            {/* Android APK Button Mobile */}
            <PWAInstallButton variant="mobile-bar" />

            {/* Cashier Barcode Button Mobile (Admin Only) */}
            {isAdmin && (
              <button
                onClick={() => setIsCashierModalOpen(true)}
                className="p-2 text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-2xs font-bold"
                title={isAr ? 'قارئ باركود الكاشير' : 'Cashier Barcode POS'}
                aria-label="Cashier Barcode POS"
              >
                <Barcode className="w-4 h-4 text-stone-950" />
              </button>
            )}

            {/* Live Chat Mobile Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="p-2 text-stone-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors relative"
              title={isAr ? 'خدمة الزبائن والمحادثة المباشرة' : 'Customer Support'}
              aria-label="Customer Support"
            >
              <Headphones className="w-4 h-4 text-amber-700" />
              <span className="absolute -top-1 -end-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border border-white" />
            </button>

            {/* Shopping Cart Button Mobile */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartTotalCount > 0 && (
                <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Instant Search Bar with Live Overlay (Full Width on Mobile & Desktop) */}
        <div ref={searchRef} className="flex-1 max-w-xl mx-auto w-full relative">
          <div className="relative">
            <Search className="absolute inset-y-0 start-3.5 my-auto w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  scrollToCatalog();
                } else if (e.key === 'Escape') {
                  setIsSearchOpen(false);
                }
              }}
              placeholder={
                isAr
                  ? 'ابحث بالاسم أو الصنف (لحم غنم، تمن عنبر، قيمر، زاهي، شاي، مسحوق)...'
                  : 'Search by item (meat, rice, qaimar, soap, tea, powder)...'
              }
              className="w-full ps-10 pe-16 py-2.5 bg-stone-100 hover:bg-stone-50 focus:bg-white text-stone-800 placeholder-stone-400 text-xs sm:text-sm rounded-2xl border border-stone-200 focus:border-stone-800 focus:outline-none transition-all shadow-inner focus:shadow-none font-medium"
            />
            <div className="absolute inset-y-0 end-2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/70"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Live Search Popup Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full start-0 end-0 mt-2 z-50 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              {searchQuery.trim() ? (
                <div>
                  <div className="p-3.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800">
                      <Search className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isAr ? 'نتائج البحث الفورية:' : 'Instant Results:'}</span>
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                        {liveSearchResults.length} {isAr ? 'منتج' : 'items'}
                      </span>
                    </div>
                    {liveSearchResults.length > 0 && (
                      <button
                        onClick={scrollToCatalog}
                        className="text-stone-500 hover:text-stone-900 font-bold flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <span>{isAr ? 'عرض في المعرض' : 'View in Catalog'}</span>
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {liveSearchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 p-1">
                      {liveSearchResults.slice(0, 6).map((product) => {
                        const catObj = CATEGORIES.find((c) => c.id === product.category);
                        return (
                          <div
                            key={product.id}
                            className="p-2 sm:p-2.5 rounded-2xl hover:bg-amber-50/50 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                            onClick={() => {
                              setQuickViewProduct(product);
                              setIsSearchOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-100 p-1 flex items-center justify-center shrink-0">
                                <ProductIllustration
                                  iconType={product.iconType}
                                  imageUrl={product.imageUrl}
                                  alt={isAr ? product.nameAr : product.nameEn}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate group-hover:text-amber-800 transition-colors">
                                  {isAr ? product.nameAr : product.nameEn}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                                  <span className="px-1.5 py-0.2 bg-stone-100 rounded text-[10px] font-bold text-stone-700">
                                    {isAr ? catObj?.nameAr : catObj?.nameEn}
                                  </span>
                                  <span>•</span>
                                  <span>{isAr ? product.unitAr : product.unitEn}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs sm:text-sm font-black text-stone-900 font-mono">
                                {formatPrice(product.price)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product, 1);
                                }}
                                className="p-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl transition-all active:scale-95 shadow-2xs"
                                title={isAr ? 'أضف للسلة فوراً' : 'Add to cart'}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {liveSearchResults.length > 6 && (
                        <div className="p-2.5 text-center">
                          <button
                            onClick={scrollToCatalog}
                            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>
                              {isAr
                                ? `عرض جميع الـ ${liveSearchResults.length} نتائج في الأسفل`
                                : `View all ${liveSearchResults.length} results below`}
                            </span>
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-2">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-stone-800 mb-1">
                        {isAr ? `لم نجد نتائج مطابقة لـ "${searchQuery}"` : `No results matching "${searchQuery}"`}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                        {popularKeywords.map((kw) => (
                          <button
                            key={kw}
                            onClick={() => setSearchQuery(kw)}
                            className="text-[11px] px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 rounded-xl font-medium transition-colors"
                          >
                            {kw}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isAr ? 'الأكثر بحثاً في أسواق الشورجة:' : 'Popular Searches:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularKeywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => {
                          setSearchQuery(kw);
                          setIsSearchOpen(true);
                        }}
                        className="text-xs px-3 py-1.5 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-800 rounded-xl font-semibold transition-all"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Hub Desktop: Android APK, Cashier POS Barcode (Admin Only), Admin Price Manager, Support, Orders, Wishlist, Cart */}
        <div className="hidden md:flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Android APK Install Button */}
          <PWAInstallButton variant="compact" />

          {/* Cashier Barcode Station Button (Admin / Management Only) */}
          {isAdmin && (
            <button
              onClick={() => setIsCashierModalOpen(true)}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm border border-amber-500/30 transition-all active:scale-95 cursor-pointer"
              title={isAr ? 'فتح محطة باركود الكاشير والمحاسبة الفورية' : 'Open Cashier POS Barcode Station'}
            >
              <Barcode className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'باركود الكاشير' : 'POS Barcode'}</span>
            </button>
          )}

          {/* Admin Product & Price Manager */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              title={isAr ? 'إدارة المنتجات وتعديل الأسعار' : 'Manage Products & Prices'}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{isAr ? 'إدارة الأسعار' : 'Manage Prices'}</span>
            </button>
          )}

          {/* Customer Service Live Chat */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2 sm:px-3 sm:py-2 text-stone-800 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold border border-amber-500/30 bg-amber-50/40"
            title={isAr ? 'خدمة العملاء والمحادثة المباشرة' : 'Live Customer Support'}
          >
            <Headphones className="w-4 h-4 text-amber-700" />
            <span className="hidden lg:inline">{isAr ? 'خدمة الزبائن' : 'Support Chat'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping hidden sm:inline" />
          </button>

          {/* Orders Tracking */}
          <button
            onClick={() => setActiveView('tracking')}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              activeView === 'tracking'
                ? 'bg-stone-900 text-white'
                : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
            }`}
            title={isAr ? 'تتبع الطلبات' : 'Orders'}
          >
            <ReceiptText className="w-4 h-4" />
            <span className="hidden md:inline">{isAr ? 'تتبع الطلب' : 'Track Order'}</span>
            {orders.length > 0 && (
              <span className="hidden md:inline text-[11px] font-mono opacity-70">({orders.length})</span>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 sm:px-3 sm:py-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
            title={isAr ? 'المفضلة' : 'Wishlist'}
          >
            <Heart className="w-4 h-4 text-stone-600" />
            <span className="hidden lg:inline">{isAr ? 'المفضلة' : 'Wishlist'}</span>
            {favorites.length > 0 && (
              <span className="w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all active:scale-95"
            aria-label="Open cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-2 -end-2 bg-amber-400 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </div>
            <div className="flex flex-col text-start">
              <span className="hidden sm:inline text-[11px] text-stone-400 leading-none">
                {isAr ? 'سلة التسوق' : 'My Cart'}
              </span>
              <span className="text-xs sm:text-sm font-mono text-amber-300 leading-none mt-0.5">
                {grandTotal > 0 ? formatPrice(grandTotal) : (isAr ? 'فارغة' : 'Empty')}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Secondary Department & Website Navigation Bar (Full Width Web Menu) */}
      <nav className="bg-stone-50 border-t border-stone-200/80 px-4 sm:px-8 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5">
          {navLinks.map((link, idx) => {
            const isCategoryLink = Boolean(link.category);
            const isActive = isCategoryLink
              ? activeView === 'shop' && selectedCategory === link.category
              : activeView === link.view;

            const IconComp = link.icon;

            return (
              <button
                key={idx}
                onClick={() => {
                  if (link.view) {
                    setActiveView(link.view);
                  }
                  if (link.category) {
                    setSelectedCategory(link.category);
                  }
                  if (link.view === 'shop') {
                    const el = document.getElementById('catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-amber-300 shadow-2xs'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/70'
                }`}
              >
                {IconComp && (
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-500'}`} />
                )}
                <span>{isAr ? link.labelAr : link.labelEn}</span>
                {link.badge && (
                  <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded-md">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Cashier Barcode POS Modal */}
      <CashierScannerModal 
        isOpen={isCashierModalOpen} 
        onClose={() => setIsCashierModalOpen(false)} 
      />
    </header>
  );
};
