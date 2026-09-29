import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Product } from '../types/market';
import { ProductIllustration } from './ProductIllustrations';

interface ProductDeleteConfirmModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (productId: string) => void;
  isAr?: boolean;
}

export const ProductDeleteConfirmModal: React.FC<ProductDeleteConfirmModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  isAr = true,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon & Close */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Warning Text */}
        <div>
          <h3 className="text-lg font-black text-stone-900 leading-snug">
            {isAr ? 'تأكيد حذف المنتج' : 'Delete Product Confirmation'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            {isAr
              ? 'هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً من المتجر وقاعدة البيانات؟'
              : 'Are you sure you want to permanently delete this product from the store?'}
          </p>
        </div>

        {/* Product Card Preview */}
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3.5">
          <div className="w-14 h-14 bg-white rounded-xl border border-stone-200/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
            <ProductIllustration
              iconType={product.iconType}
              imageUrl={product.imageUrl}
              alt={isAr ? product.nameAr : product.nameEn}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-stone-900 text-sm truncate">
              {isAr ? product.nameAr : product.nameEn}
            </h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-stone-500">
              <span className="font-semibold text-stone-800">
                {product.price.toLocaleString()} د.ع
              </span>
              <span>•</span>
              <span>{isAr ? product.unitAr : product.unitEn}</span>
            </div>
          </div>
        </div>

        {/* Caution Notice */}
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            {isAr
              ? 'تنبيه: سيتم إزالة المنتج فوراً من متجر الزبائن ومن أي سلة تسوق نشطة.'
              : 'Notice: The product will be removed immediately from customer view and active carts.'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
          >
            {isAr ? 'إلغاء وتراجع' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(product.id);
              onClose();
            }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isAr ? 'نعم، احذف المنتج' : 'Yes, Delete Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
