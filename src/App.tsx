import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Navbar, WebsiteView } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StoreFeaturesBar } from './components/StoreFeaturesBar';
import { WeeklyDealsSection } from './components/WeeklyDealsSection';
import { CategorySelector } from './components/CategorySelector';
import { ProductCatalog } from './components/ProductCatalog';
import { TrustStorySection } from './components/TrustStorySection';
import { OrderTrackingView } from './components/OrderTrackingView';
import { QualityGuaranteeView } from './components/QualityGuaranteeView';
import { CustomerServiceView } from './components/CustomerServiceView';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AddressModal } from './components/AddressModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { OrdersModal } from './components/OrdersModal';
import { SupportChatbot } from './components/SupportChatbot';
import { AuthGatewayModal } from './components/AuthGatewayModal';
import { AdminProductManagerModal } from './components/AdminProductManagerModal';
import { ComplaintsModal } from './components/ComplaintsModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ChevronLeft, ChevronRight, Home, Flame } from 'lucide-react';

const MarketApp: React.FC = () => {
  const { language } = useMarket();
  const isAr = language === 'ar';
  const [activeView, setActiveView] = useState<WebsiteView>('shop');

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-stone-800 antialiased font-['Cairo',sans-serif]">
      {/* 1. Website Top Navigation Bar with Department Mega-Links & Utilities */}
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* Dynamic Website View Routing */}
        {activeView === 'shop' && (
          <div className="space-y-6">
            {/* Editorial Hero Banner */}
            <HeroBanner onGoToDeals={() => setActiveView('deals')} />

            {/* 4 Trust & Guarantee Pillars */}
            <StoreFeaturesBar />

            {/* Curated Wholesale Baskets & Weekly Hot Deals */}
            <WeeklyDealsSection />

            {/* 5 Core Departments Tabs */}
            <CategorySelector />

            {/* Comprehensive Product Catalog with Filters and Sorting */}
            <ProductCatalog />

            {/* Shorja Heritage Story & Quality Pledge */}
            <TrustStorySection />
          </div>
        )}

        {activeView === 'deals' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-stone-500 pb-2 border-b border-stone-200">
              <button
                onClick={() => setActiveView('shop')}
                className="hover:text-stone-900 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>
              {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span className="font-bold text-stone-900 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>{isAr ? 'عروض وسلات التوفير الأسبوعية' : 'Weekly Big Deals & Family Packs'}</span>
              </span>
            </div>

            {/* Weekly Deals Component */}
            <WeeklyDealsSection />

            {/* Filter by Categories & Discounted Products */}
            <CategorySelector />
            <ProductCatalog />
          </div>
        )}

        {activeView === 'tracking' && (
          <div className="animate-in fade-in duration-150">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-stone-500 pb-2 mb-4 border-b border-stone-200">
              <button
                onClick={() => setActiveView('shop')}
                className="hover:text-stone-900 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>
              {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span className="font-bold text-stone-900">
                {isAr ? 'نظام التتبع المباشر للطلبات' : 'Live Order Tracking'}
              </span>
            </div>

            <OrderTrackingView onBackToShop={() => setActiveView('shop')} />
          </div>
        )}

        {activeView === 'quality' && (
          <div className="animate-in fade-in duration-150">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-stone-500 pb-2 mb-4 border-b border-stone-200">
              <button
                onClick={() => setActiveView('shop')}
                className="hover:text-stone-900 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>
              {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span className="font-bold text-stone-900">
                {isAr ? 'عن أسواق الشورجة وميثاق الجودة' : 'About & Quality Standards'}
              </span>
            </div>

            <QualityGuaranteeView onGoToShop={() => setActiveView('shop')} />
          </div>
        )}

        {activeView === 'complaints' && (
          <div className="animate-in fade-in duration-150">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-stone-500 pb-2 mb-4 border-b border-stone-200">
              <button
                onClick={() => setActiveView('shop')}
                className="hover:text-stone-900 flex items-center gap-1 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>
              {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              <span className="font-bold text-stone-900">
                {isAr ? 'مركز الشكاوى والمقترحات وحماية المستهلك' : 'Complaints & Support Center'}
              </span>
            </div>

            <CustomerServiceView />
          </div>
        )}
      </main>

      {/* 3. Comprehensive E-Commerce Website Footer */}
      <Footer setActiveView={setActiveView} />

      {/* 4. Full-Featured Web Overlays & Functional Drawers */}
      <AuthGatewayModal />
      <AdminProductManagerModal />
      <SupportChatbot />
      <QuickViewModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackerModal />
      <AddressModal />
      <WishlistDrawer />
      <OrdersModal />
      <ComplaintsModal />
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <MarketApp />
    </MarketProvider>
  );
}
