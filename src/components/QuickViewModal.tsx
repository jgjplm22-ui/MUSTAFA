import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Heart, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  MessageSquarePlus,
  Send,
  Edit3,
  Camera,
  Trash2,
  Barcode
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';
import { ProductImageModal } from './ProductImageModal';
import { ProductDeleteConfirmModal } from './ProductDeleteConfirmModal';
import { BarcodeRenderer } from './BarcodeRenderer';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    language,
    formatPrice,
    addToCart,
    isFavorite,
    toggleFavorite,
    setIsCartOpen,
    addReview,
    isAdmin,
    updateProductName,
    updateProductImage,
    deleteProduct,
  } = useMarket();

  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Edit product name states
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempNameAr, setTempNameAr] = useState('');
  const [tempNameEn, setTempNameEn] = useState('');

  // Admin Image & Delete modals
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // New review form states
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!quickViewProduct) return null;

  const isAr = language === 'ar';
  const isFav = isFavorite(quickViewProduct.id);
  const reviews = quickViewProduct.reviews || [];

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, note);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickViewProduct(null);
      setIsCartOpen(true);
    }, 600);
  };

  const handleStartEditName = () => {
    if (!quickViewProduct) return;
    setTempNameAr(quickViewProduct.nameAr);
    setTempNameEn(quickViewProduct.nameEn || quickViewProduct.nameAr);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (!quickViewProduct || !tempNameAr.trim()) return;
    updateProductName(quickViewProduct.id, tempNameAr.trim(), tempNameEn.trim() || tempNameAr.trim());
    setIsEditingName(false);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview(quickViewProduct.id, {
      userName: reviewerName.trim() || (isAr ? 'زبون أسواق الشورجة' : 'Shorja Customer'),
      rating: newRating,
      comment: reviewComment.trim(),
    });

    setReviewSubmitted(true);
    setReviewComment('');
    setReviewerName('');
    setTimeout(() => {
      setReviewSubmitted(false);
    }, 4000);
  };

  // Calculate rating percentage breakdowns
  const totalReviewsCount = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
    return { star, count, percent };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 end-4 z-20 p-2 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left column: Visual preview */}
        <div className="md:w-5/12 bg-[#F9F9F8] p-6 sm:p-8 flex flex-col items-center justify-between relative border-b md:border-b-0 md:border-e border-stone-200">
          <div className="w-full flex justify-between items-center text-xs text-stone-500">
            <span className="font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
              {isAr ? quickViewProduct.originAr : quickViewProduct.originEn}
            </span>
            <button
              onClick={() => toggleFavorite(quickViewProduct.id)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-rose-500 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          <div className="relative w-40 h-40 sm:w-52 sm:h-52 my-4 flex items-center justify-center group">
            <ProductIllustration 
              iconType={quickViewProduct.iconType} 
              imageUrl={quickViewProduct.imageUrl} 
              alt={isAr ? quickViewProduct.nameAr : quickViewProduct.nameEn} 
              className="w-full h-full object-contain" 
            />
            {isAdmin && (
              <button
                onClick={() => setIsEditingImage(true)}
                className="absolute bottom-1 px-3 py-1.5 bg-stone-900/90 hover:bg-stone-900 text-amber-300 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
                title={isAr ? 'تعديل صورة المنتج' : 'Edit photo'}
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'تعديل الصورة' : 'Change Photo'}</span>
              </button>
            )}
          </div>

          {/* Quick Rating Summary in side card */}
          <div className="w-full bg-white rounded-2xl p-3 border border-stone-200 text-center shadow-2xs">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(quickViewProduct.rating) ? 'fill-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-stone-900 tabular-nums">
                {quickViewProduct.rating}
              </span>
              <span className="text-xs text-stone-400">/ 5</span>
            </div>
            <p className="text-[11px] text-stone-500">
              {totalReviewsCount} {isAr ? 'تقييم موثق من الزبائن' : 'verified ratings'}
            </p>
          </div>
        </div>

        {/* Right column: Content, Tabs & Rating submission */}
        <div className="md:w-7/12 flex flex-col justify-between overflow-y-auto">
          {/* Header area with tabs */}
          <div className="p-5 sm:p-6 pb-2">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-stone-900 tabular-nums">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
              <span className="text-xs text-stone-500">
                / {isAr ? quickViewProduct.unitAr : quickViewProduct.unitEn}
              </span>
            </div>

            {isEditingName ? (
              <div className="mb-3 p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 animate-in fade-in">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-0.5">{isAr ? 'الاسم بالعربية' : 'Arabic Name'}</label>
                  <input
                    type="text"
                    value={tempNameAr}
                    onChange={(e) => setTempNameAr(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                    autoFocus
                    placeholder={isAr ? 'اسم المنتج بالعربية' : 'Arabic Name'}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-0.5">{isAr ? 'الاسم بالإنجليزية (اختياري)' : 'English Name'}</label>
                  <input
                    type="text"
                    value={tempNameEn}
                    onChange={(e) => setTempNameEn(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-600"
                    placeholder={isAr ? 'اسم المنتج بالإنجليزية' : 'English Name'}
                  />
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-amber-200/60">
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? 'حفظ الاسم' : 'Save'}</span>
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2 mb-3 group/name">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {isAr ? quickViewProduct.nameAr : quickViewProduct.nameEn}
                </h2>
                {isAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handleStartEditName}
                      className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title={isAr ? 'تعديل اسم المنتج' : 'Edit product name'}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsEditingImage(true)}
                      className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                      title={isAr ? 'تعديل صورة المنتج' : 'Edit product photo'}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsConfirmingDelete(true)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title={isAr ? 'حذف هذا المنتج' : 'Delete product'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-stone-200 gap-4 mb-4">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {isAr ? 'تفاصيل ومواصفات المنتج' : 'Details & Specs'}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'reviews'
                    ? 'border-emerald-700 text-emerald-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>{isAr ? 'التقييمات والآراء' : 'Reviews & Ratings'}</span>
                <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {totalReviewsCount}
                </span>
              </button>
            </div>
          </div>

          {/* Tab 1: Details & Specs */}
          {activeTab === 'details' && (
            <div className="px-5 sm:px-6 flex-1 space-y-4">
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {isAr ? quickViewProduct.descriptionAr : quickViewProduct.descriptionEn}
              </p>

              {/* Technical Specifications */}
              {quickViewProduct.specs && Object.keys(quickViewProduct.specs).length > 0 && (
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200">
                  <h4 className="text-xs font-bold text-stone-800 mb-2">
                    {isAr ? 'المواصفات التقنية الفائقة:' : 'Technical Specifications:'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(quickViewProduct.specs).map(([key, val]) => (
                      <div key={key} className="bg-white p-2 rounded-xl border border-stone-200/80">
                        <span className="block text-[10px] text-stone-400">{key}</span>
                        <span className="font-semibold text-stone-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords / Tags badges */}
              {quickViewProduct.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quickViewProduct.tags.slice(0, 6).map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Cashier Supermarket Barcode Box (Admin & Cashier Only) */}
              {isAdmin && quickViewProduct.barcode && (
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex flex-col items-center justify-center">
                  <div className="flex items-center justify-between w-full mb-1 text-[11px] text-stone-500">
                    <span className="font-bold flex items-center gap-1 text-stone-700">
                      <Barcode className="w-4 h-4 text-amber-600" />
                      <span>{isAr ? 'باركود الكاشير والمحاسبة (لوحة الإدارة):' : 'Cashier / POS Barcode (Admin Only):'}</span>
                    </span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {isAr ? 'جاهز للمسح الضوئي' : 'Scan Ready'}
                    </span>
                  </div>
                  <div className="bg-white px-4 py-2.5 rounded-xl border border-stone-200/80 shadow-2xs w-full flex justify-center">
                    <BarcodeRenderer value={quickViewProduct.barcode} height={46} showText={true} />
                  </div>
                </div>
              )}

              {/* Special Note Input */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isAr ? 'ملاحظة خاصة بالطلب (اختياري)' : 'Special order note (optional)'}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مثال: تغليف كهدية، أو تسليم في وقت محدد'
                      : 'e.g., Gift wrapping or specific handling'
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Reviews & Interactive 1-5 Star Submission */}
          {activeTab === 'reviews' && (
            <div className="px-5 sm:px-6 flex-1 space-y-4">
              {/* Star Rating Breakdown Bar Chart */}
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-1.5">
                {ratingDistribution.map((row) => (
                  <div key={row.star} className="flex items-center gap-2 text-xs text-stone-600">
                    <span className="w-7 flex items-center gap-0.5 font-bold tabular-nums">
                      {row.star} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-end text-[10px] text-stone-400 tabular-nums">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Interactive Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isAr ? 'أضف تقييمك ورأيك بالمنتج:' : 'Rate this product:'}</span>
                  </span>
                  
                  {/* Clickable 1 to 5 Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 text-stone-300 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            star <= (hoverRating || newRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ms-1 tabular-nums">
                      {newRating} / 5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder={isAr ? 'اسمك (مثال: أبو فهد البغدادي)' : 'Your name (e.g. John Doe)'}
                    className="text-xs px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-800"
                  />
                  <input
                    type="text"
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={isAr ? 'اكتب رأيك وتجربتك هنا...' : 'Write your honest review...'}
                    className="text-xs px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {reviewSubmitted ? (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'شكراً! تم نشر تقييمك وحفظه بنجاح' : 'Thank you! Review published.'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400">
                      {isAr ? 'تقييمك يساعد باقي الزبائن في اتخاذ قرار الشراء' : 'Your review helps fellow shoppers'}
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={!reviewComment.trim()}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3 rtl:rotate-180" />
                    <span>{isAr ? 'نشر التقييم' : 'Submit Review'}</span>
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-stone-50/70 p-3 rounded-xl border border-stone-200/80 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-800">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>{isAr ? 'مشتري موثق' : 'Verified'}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating ? 'fill-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-stone-700 leading-relaxed">{rev.comment}</p>

                      <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-200/40">
                        <span>{rev.date}</span>
                        <button className="flex items-center gap-1 hover:text-stone-700 transition-colors">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{isAr ? 'مفيد' : 'Helpful'} ({rev.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 text-center py-4">
                    {isAr ? 'كن أول من يقيم هذا المنتج ويشارك تجربته!' : 'Be the first to review this product!'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Module (Add to Bag & Stepper) */}
          <div className="p-5 sm:p-6 pt-4 border-t border-stone-200 bg-white space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center bg-stone-100 rounded-xl p-1 border border-stone-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-2xs"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shadow-2xs"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2 active:scale-98"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isAr ? 'تمت الإضافة للسلة' : 'Added to Cart'}</span>
                  </>
                ) : (
                  <>
                    <span>{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
                    <span className="opacity-80">·</span>
                    <span className="tabular-nums font-bold">
                      {formatPrice(quickViewProduct.price * quantity)}
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {isAr
                  ? 'ضمان جودة وأصالة أسواق الشورجة 100% مع حق الاستبدال'
                  : '100% Shorja Quality Guarantee with Instant Replacement'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Modals for Image Editing & Product Deletion */}
      <ProductImageModal
        product={quickViewProduct}
        isOpen={isEditingImage}
        onClose={() => setIsEditingImage(false)}
        onSave={(id, imageUrl) => updateProductImage(id, imageUrl)}
        isAr={isAr}
      />

      <ProductDeleteConfirmModal
        product={quickViewProduct}
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={(id) => {
          deleteProduct(id);
          setQuickViewProduct(null);
        }}
        isAr={isAr}
      />
    </div>
  );
};
