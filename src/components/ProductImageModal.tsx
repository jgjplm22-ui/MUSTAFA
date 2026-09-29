import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Sparkles, Camera, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { Product, CategoryId } from '../types/market';
import { ProductIllustration } from './ProductIllustrations';

// High-definition curated photos tailored for product departments
const PRESET_PRODUCT_IMAGES: Record<CategoryId, { titleAr: string; titleEn: string; url: string }[]> = {
  all: [],
  meats: [
    {
      titleAr: 'لحم غنم عراقي طازج',
      titleEn: 'Fresh Lamb Chops',
      url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'دجاج مبرد وطازج',
      titleEn: 'Chilled Chicken',
      url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'ستيك بقري تندرلوين',
      titleEn: 'Beef Tenderloin Steak',
      url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'لحم مفروم للشواء والكباب',
      titleEn: 'Minced Meat for Kebab',
      url: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'سمك مسكوف نهري طازج',
      titleEn: 'Fresh River Fish',
      url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&auto=format&fit=crop&q=80',
    },
  ],
  groceries: [
    {
      titleAr: 'تمن عنبر عراقي درجة أولى',
      titleEn: 'Iraqi Amber Rice',
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'زيت طبخ نقي وصحي',
      titleEn: 'Pure Cooking Oil',
      url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'معجون طماطم مركز',
      titleEn: 'Rich Tomato Paste',
      url: 'https://images.unsplash.com/photo-1534940562423-f27a69634b86?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'شاي عراقي فاخر مهيل',
      titleEn: 'Cardamom Loose Tea',
      url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'سكر أبيض نقي',
      titleEn: 'Pure White Sugar',
      url: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'طحين أبيض ناعم للخبز',
      titleEn: 'Fine Baking Flour',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    },
  ],
  dairy: [
    {
      titleAr: 'قيمر عرب حليب جاموس',
      titleEn: 'Buffalo Milk Qaimar',
      url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'حليب مبستر كامل الدسم',
      titleEn: 'Whole Fresh Milk',
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'جبن أبيض مملح بالحبة السوداء',
      titleEn: 'Salted White Cheese',
      url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'طبق بيض مزارع طازج',
      titleEn: 'Farm Fresh Table Eggs',
      url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'لبن زبادي عراقي رايب',
      titleEn: 'Fresh Yogurt',
      url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    },
  ],
  detergents: [
    {
      titleAr: 'مسحوق غسيل أوتوماتيك عملاق',
      titleEn: 'Automatic Laundry Powder',
      url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'سائل جلي صحون بالليمون',
      titleEn: 'Lemon Dishwashing Liquid',
      url: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'معقم ومطهر أرضيات بالصنوبر',
      titleEn: 'Pine Floor Cleaner',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'مناديل ورقية فاخرة',
      titleEn: 'Premium Facial Tissues',
      url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    },
  ],
  snacks: [
    {
      titleAr: 'بطاطا شبس مقرمشة ذهبية',
      titleEn: 'Crispy Potato Chips',
      url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'مكسرات مشكلة محمصة ومملحة',
      titleEn: 'Deluxe Roasted Mixed Nuts',
      url: 'https://images.unsplash.com/photo-1536591375315-198993c9d747?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'تمر خستاوي عراقي فاخر',
      titleEn: 'Premium Iraqi Dates',
      url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80',
    },
    {
      titleAr: 'ويفر شوكولاتة بالبندق',
      titleEn: 'Hazelnut Chocolate Wafers',
      url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    },
  ],
};

interface ProductImageModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (productId: string, imageUrl: string) => void;
  isAr?: boolean;
}

export const ProductImageModal: React.FC<ProductImageModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
  isAr = true,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [method, setMethod] = useState<'upload' | 'url' | 'presets'>('upload');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize selectedUrl whenever product changes or modal opens
  React.useEffect(() => {
    if (product) {
      setSelectedUrl(product.imageUrl || '');
      setUploadError(null);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(isAr ? 'يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)' : 'Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(isAr ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت' : 'Image is too large (max 5MB)');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(product.id, selectedUrl.trim());
    onClose();
  };

  const presets = PRESET_PRODUCT_IMAGES[product.category] || [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
              <Camera className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-stone-900">
                {isAr ? 'تعديل صورة المنتج' : 'Edit Product Image'}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {isAr ? product.nameAr : product.nameEn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Screen */}
        <div className="relative w-full h-44 bg-[#FBFBFA] rounded-2xl border-2 border-dashed border-stone-200 p-4 flex flex-col items-center justify-center overflow-hidden">
          {selectedUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedUrl}
                alt="Preview"
                className="w-full h-full object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={() => setSelectedUrl('')}
                className="absolute top-1 end-1 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm text-xs flex items-center gap-1 transition-colors"
                title={isAr ? 'إزالة الصورة الحالية والرجوع للأيقونة' : 'Remove photo'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">{isAr ? 'إزالة' : 'Remove'}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <ProductIllustration 
                iconType={product.iconType} 
                className="w-24 h-24 object-contain mb-1 opacity-80" 
              />
              <span className="text-[11px] font-bold text-stone-400">
                {isAr ? 'يتم استخدام الأيقونة التوضيحية الافتراضية حالياً' : 'Using default illustration icon'}
              </span>
            </div>
          )}
        </div>

        {/* Method Picker Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setMethod('upload')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              method === 'upload'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isAr ? 'رفع من الجهاز' : 'Upload File'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('url')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              method === 'url'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>{isAr ? 'رابط مباشر' : 'Image URL'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('presets')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              method === 'presets'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? 'صور مقترحة' : 'Presets'}</span>
          </button>
        </div>

        {/* Method Content */}
        {method === 'upload' && (
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 px-4 border-2 border-dashed border-emerald-500/50 hover:border-emerald-600 bg-emerald-50/70 hover:bg-emerald-50 text-emerald-950 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <div className="p-2.5 bg-emerald-600 text-white rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-emerald-900">
                  {isAr ? 'اضغط لاختيار صورة من هاتفك أو جهازك' : 'Click to choose image from device'}
                </p>
                <p className="text-[10px] text-emerald-700/80 mt-0.5">
                  {isAr ? 'يدعم PNG, JPG, WebP بحجم حتى 5MB' : 'Supports PNG, JPG, WebP up to 5MB'}
                </p>
              </div>
            </button>
            {uploadError && (
              <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg text-center">
                {uploadError}
              </p>
            )}
          </div>
        )}

        {method === 'url' && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              {isAr ? 'أدخل رابط الصورة المباشر من الإنترنت:' : 'Enter direct image URL:'}
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 font-mono"
              />
            </div>
            <p className="text-[10px] text-stone-400">
              {isAr ? 'يمكنك نسخ رابط أي صورة وإلصاقه هنا للمعانية الفورية' : 'Paste any image link to preview immediately'}
            </p>
          </div>
        )}

        {method === 'presets' && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-700">
              {isAr ? 'اختر صورة احترافية مناسبة لهذا القسم:' : 'Choose from high-definition presets:'}
            </p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {presets.map((preset, idx) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedUrl(preset.url)}
                    className={`p-2 rounded-xl border text-start flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 shadow-2xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.titleAr}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-stone-900 truncate">
                        {isAr ? preset.titleAr : preset.titleEn}
                      </p>
                      {isSelected && (
                        <span className="text-[9px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                          <span>{isAr ? 'محدد' : 'Selected'}</span>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-2">
          <button
            type="button"
            onClick={() => setSelectedUrl('')}
            className="text-xs font-bold text-stone-500 hover:text-rose-600 transition-colors py-2 px-1"
          >
            {isAr ? 'الرجوع للأيقونة' : 'Reset to Icon'}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isAr ? 'حفظ الصورة للمنتج' : 'Save Image'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
