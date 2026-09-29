import React from 'react';
import { X, Heart, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    favorites,
    toggleFavorite,
    addToCart,
    formatPrice,
    language,
    setIsCartOpen,
    products,
  } = useMarket();

  if (!isWishlistOpen) return null;

  const isAr = language === 'ar';
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 end-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                {isAr ? 'قائمة المفضلة' : 'Saved Favorites'}
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">
                ({favoriteProducts.length})
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favoriteProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-300 mb-4">
                  <Heart className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-1">
                  {isAr ? 'لا توجد منتجات محفوظة بعد' : 'No saved items yet'}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  {isAr
                    ? 'اضغط على رمز القلب بجانب أي منتج ترغب في حفظه لشرائه لاحقاً بسرعة.'
                    : 'Tap the heart icon on any product to save it here for fast reordering.'}
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  {isAr ? 'استكشف المنتجات' : 'Browse Items'}
                </button>
              </div>
            ) : (
              favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80 items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 bg-white rounded-xl p-1.5 shrink-0 border border-stone-200/60 flex items-center justify-center overflow-hidden">
                      <ProductIllustration 
                        iconType={product.iconType} 
                        imageUrl={product.imageUrl} 
                        alt={isAr ? product.nameAr : product.nameEn} 
                        className="w-full h-full object-contain" 
                      />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-semibold text-stone-900 text-xs sm:text-sm truncate">
                        {isAr ? product.nameAr : product.nameEn}
                      </h4>
                      <div className="text-xs font-bold text-emerald-800 tabular-nums mt-0.5">
                        {formatPrice(product.price)}
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {isAr ? product.unitAr : product.unitEn}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        setIsWishlistOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      title={isAr ? 'أضف للسلة' : 'Add to cart'}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isAr ? 'شراء' : 'Add'}</span>
                    </button>

                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-stone-200"
                      title={isAr ? 'إزالة' : 'Remove'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
