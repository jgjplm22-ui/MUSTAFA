import React from 'react';
import { Play, Heart, Eye, Plus, Film, ShoppingBag, Sparkles } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Reel } from '../types/market';
import { ProductIllustration } from './ProductIllustrations';

export const ReelsSection: React.FC = () => {
  const {
    reels,
    setActiveReel,
    setIsCreateReelOpen,
    isAdmin,
    products,
    language,
    formatPrice,
  } = useMarket();

  const isAr = language === 'ar';

  if (!reels || reels.length === 0) return null;

  return (
    <section className="mb-10 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
              <Film className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900">
              {isAr ? 'ريلز الشورجة المباشرة' : 'Shorja Live Reels'}
            </h2>
            <span className="text-[10px] bg-rose-500/10 text-rose-700 font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
              LIVE 🔴
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {isAr
              ? 'مقاطع فيديو حية لطازجية اللحوم، البضائع الجديدة، وتجارب المنتجات مع الشراء بنقرة واحدة'
              : 'Short video clips showing fresh cuts, new shipments, and instant 1-click buy'}
          </p>
        </div>

        {/* Admin Publish Reel Trigger Button */}
        {isAdmin && (
          <button
            onClick={() => setIsCreateReelOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'نشر مقطع ريلز جديد (إدارة)' : 'Publish New Reel'}</span>
          </button>
        )}
      </div>

      {/* Reels Horizontal Scroll Reel Bar */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x snap-mandatory">
        {reels.map((reel) => {
          const linkedProduct = reel.productId 
            ? products.find((p) => p.id === reel.productId) 
            : null;

          return (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="group relative w-40 sm:w-48 aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer shrink-0 snap-start shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-stone-900 border border-stone-200/80"
            >
              {/* Thumbnail Background */}
              {reel.thumbnailUrl ? (
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : linkedProduct?.imageUrl ? (
                <img
                  src={linkedProduct.imageUrl}
                  alt={reel.titleAr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-950 flex items-center justify-center p-4">
                  <Film className="w-12 h-12 text-rose-500/40" />
                </div>
              )}

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/30 group-hover:from-black/95 transition-colors" />

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 group-hover:scale-110 group-hover:bg-rose-600 transition-all shadow-lg">
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                </div>
              </div>

              {/* Top Bar: View Count */}
              <div className="absolute top-3 start-3 end-3 flex items-center justify-between text-white text-[11px] font-bold">
                <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                  <Eye className="w-3 h-3 text-amber-300" />
                  <span>{reel.viewsCount}</span>
                </span>

                <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                  <span>{reel.likesCount}</span>
                </span>
              </div>

              {/* Bottom Info: Title & Linked Product */}
              <div className="absolute bottom-3 start-3 end-3 space-y-1.5 text-white text-start">
                {/* Linked Product Micro Badge */}
                {linkedProduct && (
                  <div className="bg-stone-900/85 backdrop-blur-xs px-2 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 shadow-sm">
                    <div className="w-5 h-5 rounded-md bg-white p-0.5 shrink-0 overflow-hidden">
                      <ProductIllustration
                        iconType={linkedProduct.iconType}
                        imageUrl={linkedProduct.imageUrl}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 font-mono truncate">
                      {formatPrice(linkedProduct.price)}
                    </span>
                  </div>
                )}

                <h3 className="text-xs font-bold text-white line-clamp-2 leading-tight drop-shadow">
                  {isAr ? reel.titleAr : (reel.titleEn || reel.titleAr)}
                </h3>

                <p className="text-[10px] text-white/70 line-clamp-1">
                  {reel.authorName}
                </p>
              </div>
            </div>
          );
        })}

        {/* Extra Card: Quick admin add reel placeholder card */}
        {isAdmin && (
          <div
            onClick={() => setIsCreateReelOpen(true)}
            className="w-40 sm:w-48 aspect-[9/16] rounded-3xl border-2 border-dashed border-rose-300 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-500 cursor-pointer shrink-0 snap-start flex flex-col items-center justify-center p-4 text-center text-rose-700 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center transition-colors mb-2 shadow-xs">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-black">
              {isAr ? 'نشر ريلز جديد' : 'New Reel'}
            </span>
            <span className="text-[10px] text-rose-500 mt-1">
              {isAr ? 'فيديو من الهاتف أو رابط' : 'Upload or URL'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
