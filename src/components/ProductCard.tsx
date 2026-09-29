import React, { useState } from 'react';
import { Plus, Minus, Heart, Eye, Star, Edit3, Check, X, Camera, Trash2, Barcode } from 'lucide-react';
import { Product } from '../types/market';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';
import { ProductImageModal } from './ProductImageModal';
import { ProductDeleteConfirmModal } from './ProductDeleteConfirmModal';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const {
    language,
    formatPrice,
    cart,
    addToCart,
    updateCartQuantity,
    isFavorite,
    toggleFavorite,
    setQuickViewProduct,
    isAdmin,
    updateProductPrice,
    updateProductName,
    updateProductImage,
    deleteProduct,
    setIsAdminPanelOpen,
  } = useMarket();

  const isAr = language === 'ar';
  const cartItem = cart.find((i) => i.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isFav = isFavorite(product.id);

  // Admin Quick Inline Price Editor
  const [isQuickEditingPrice, setIsQuickEditingPrice] = useState(false);
  const [quickPrice, setQuickPrice] = useState<number>(product.price);

  // Admin Quick Inline Name Editor
  const [isQuickEditingName, setIsQuickEditingName] = useState(false);
  const [quickName, setQuickName] = useState<string>(product.nameAr);

  // Admin Image & Deletion Modals
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleSaveQuickPrice = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quickPrice > 0) {
      updateProductPrice(product.id, quickPrice);
      setIsQuickEditingPrice(false);
    }
  };

  const handleSaveQuickName = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quickName.trim()) {
      updateProductName(product.id, quickName.trim());
      setIsQuickEditingName(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-stone-200/90 hover:border-stone-800 hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-200 p-3.5 sm:p-4">
      {/* Top Bar on Card: Badge & Wishlist Button (Plus Admin Price Tag) */}
      <div className="flex items-center justify-between gap-2 mb-2 z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.badgeAr ? (
            <span className="text-[11px] font-bold text-amber-900 bg-amber-100/90 border border-amber-200 px-2 py-0.5 rounded-lg">
              {isAr ? product.badgeAr : product.badgeEn}
            </span>
          ) : (
            <span className="text-[11px] text-stone-400">
              {isAr ? product.originAr.split('-')[0] : product.originEn.split('-')[0]}
            </span>
          )}

          {isAdmin && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black bg-stone-900 text-amber-400 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <span>إدارة</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingImage(true);
                }}
                className="p-1 rounded-md bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 transition-colors"
                title={isAr ? 'تعديل صورة المنتج' : 'Edit photo'}
              >
                <Camera className="w-3 h-3 text-amber-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingDelete(true);
                }}
                className="p-1 rounded-md bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-600 transition-colors"
                title={isAr ? 'حذف المنتج' : 'Delete product'}
              >
                <Trash2 className="w-3 h-3 text-rose-500" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`p-1.5 rounded-full transition-colors ${
            isFav
              ? 'text-rose-500 bg-rose-50 hover:bg-rose-100'
              : 'text-stone-400 hover:text-rose-500 hover:bg-stone-100'
          }`}
          aria-label={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isAr ? 'حفظ في المفضلة' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Visual Canvas Area */}
      <div
        onClick={() => setQuickViewProduct(product)}
        className="relative w-full aspect-square bg-[#FBFBFA] rounded-2xl p-4 flex items-center justify-center cursor-pointer overflow-hidden group-hover:bg-amber-50/20 transition-colors mb-3 border border-stone-100"
      >
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingImage(true);
            }}
            className="absolute top-2.5 start-2.5 z-20 px-2.5 py-1 bg-stone-900/90 hover:bg-stone-900 text-amber-300 rounded-xl text-[11px] font-bold shadow-md backdrop-blur-xs flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
            title={isAr ? 'تغيير صورة المنتج' : 'Change photo'}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'تغيير الصورة' : 'Photo'}</span>
          </button>
        )}

        <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <ProductIllustration 
            iconType={product.iconType} 
            imageUrl={product.imageUrl} 
            alt={isAr ? product.nameAr : product.nameEn} 
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain" 
          />
        </div>

        {/* Quick View Floating Hint */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-2.5 inset-x-4 py-1.5 bg-white/95 hover:bg-white text-stone-800 text-xs font-bold rounded-xl shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 border border-stone-200"
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          <span>{isAr ? 'نظرة سريعة والتقييم' : 'Quick View & Reviews'}</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Unit & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">{isAr ? product.unitAr : product.unitEn}</span>
            <div className="flex items-center gap-1 text-stone-700 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums text-[11px]">{product.rating}</span>
              <span className="text-[10px] text-stone-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          {isQuickEditingName ? (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="flex items-center gap-1 my-1 p-1 bg-amber-50 rounded-xl border border-amber-300 animate-in fade-in z-20"
            >
              <input
                type="text"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="w-full px-2 py-1 bg-white rounded-lg border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                placeholder={isAr ? 'اسم المنتج' : 'Product name'}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveQuickName(e as unknown as React.MouseEvent);
                  if (e.key === 'Escape') {
                    setIsQuickEditingName(false);
                    setQuickName(product.nameAr);
                  }
                }}
              />
              <button
                onClick={handleSaveQuickName}
                className="p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shrink-0"
                title={isAr ? 'حفظ الاسم' : 'Save Name'}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickEditingName(false);
                  setQuickName(product.nameAr);
                }}
                className="p-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors shrink-0"
                title={isAr ? 'إلغاء' : 'Cancel'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-1 mb-1 group/title">
              <h3
                onClick={() => setQuickViewProduct(product)}
                className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-amber-700 cursor-pointer transition-colors flex-1"
                title={isAr ? product.nameAr : product.nameEn}
              >
                {isAr ? product.nameAr : product.nameEn}
              </h3>
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsQuickEditingName(true);
                    setQuickName(product.nameAr);
                  }}
                  className="p-1 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors shrink-0"
                  title={isAr ? 'تعديل اسم المنتج مباشرة' : 'Edit product name'}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Description snippet & Cashier Barcode */}
          <p className="text-xs text-stone-500 line-clamp-1 mb-2">
            {isAr ? product.descriptionAr : product.descriptionEn}
          </p>

          {/* Cashier Barcode Tag (Admin & Cashier Only) */}
          {isAdmin && product.barcode && (
            <div 
              onClick={() => setQuickViewProduct(product)}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-stone-100/90 hover:bg-stone-200/80 rounded-md text-[10px] font-mono text-stone-600 mb-2.5 transition-colors cursor-pointer border border-stone-200/60"
              title={isAr ? 'باركود الكاشير للمسح السريع' : 'Cashier Barcode for POS scanner'}
            >
              <Barcode className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              <span className="font-bold tracking-wider">{product.barcode}</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
          {/* Price lockup / Admin inline editor */}
          {isQuickEditingPrice ? (
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-300 animate-in fade-in">
              <input
                type="number"
                value={quickPrice}
                onChange={(e) => setQuickPrice(Number(e.target.value))}
                className="w-20 px-1.5 py-0.5 bg-white rounded border border-stone-400 text-xs font-mono font-bold text-stone-900"
                autoFocus
              />
              <button
                onClick={handleSaveQuickPrice}
                className="p-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded transition-colors"
                title={isAr ? 'حفظ السعر' : 'Save'}
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuickEditingPrice(false);
                  setQuickPrice(product.price);
                }}
                className="p-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition-colors"
                title={isAr ? 'إلغاء' : 'Cancel'}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-stone-900 tabular-nums">
                  {formatPrice(product.price)}
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsQuickEditingPrice(true);
                        setQuickPrice(product.price);
                      }}
                      className="p-1 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                      title={isAr ? 'تعديل هذا السعر مباشرة' : 'Edit this price directly'}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingImage(true);
                      }}
                      className="p-1 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                      title={isAr ? 'تعديل صورة المنتج' : 'Change product photo'}
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsConfirmingDelete(true);
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title={isAr ? 'حذف المنتج نهائياً' : 'Delete product'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          )}

          {/* Stepper or Add to Bag Button */}
          {quantityInCart > 0 ? (
            <div className="flex items-center gap-1.5 bg-stone-100 rounded-xl p-1 border border-stone-200">
              <button
                onClick={() => updateCartQuantity(product.id, quantityInCart - 1)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-2xs active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-stone-900 tabular-nums min-w-[20px] text-center">
                {quantityInCart}
              </span>
              <button
                onClick={() => updateCartQuantity(product.id, quantityInCart + 1)}
                className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-400 flex items-center justify-center transition-colors shadow-2xs active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product, 1)}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'أضف' : 'Add'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Modals for Photo Editing & Product Deletion */}
      <ProductImageModal
        product={product}
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        onSave={(id, imageUrl) => updateProductImage(id, imageUrl)}
        isAr={isAr}
      />

      <ProductDeleteConfirmModal
        product={product}
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={(id) => deleteProduct(id)}
        isAr={isAr}
      />
    </div>
  );
};
