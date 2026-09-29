import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Search, 
  Check, 
  Trash2, 
  Edit3, 
  Package, 
  Sparkles, 
  Layers, 
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  RefreshCw,
  Camera,
  Film,
  Type,
  Barcode
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { CategoryId, IconType, Product } from '../types/market';
import { CATEGORIES } from '../data/marketData';
import { ProductIllustration } from './ProductIllustrations';
import { ProductDeleteConfirmModal } from './ProductDeleteConfirmModal';
import { BarcodeRenderer } from './BarcodeRenderer';
import { AddProductByBarcodeModal } from './AddProductByBarcodeModal';

// High-definition curated photos tailored specifically for the 5 departments
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

export const AdminProductManagerModal: React.FC = () => {
  const {
    isAdminPanelOpen,
    setIsAdminPanelOpen,
    products,
    addProduct,
    updateProductPrice,
    updateProductName,
    updateProduct,
    deleteProduct,
    toggleStock,
    formatPrice,
    language,
    setIsCreateReelOpen,
    reels,
  } = useMarket();

  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [filterCategory, setFilterCategory] = useState<CategoryId>('all');
  const [adminSearch, setAdminSearch] = useState('');

  // Inline price editing states
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempOrigPrice, setTempOrigPrice] = useState<number | undefined>(undefined);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Inline product name editing states
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [tempNameAr, setTempNameAr] = useState('');
  const [tempNameEn, setTempNameEn] = useState('');

  // Comprehensive Product Edit Modal (Name, Specs, Unit, Badge, Barcode)
  const [editingDetailsProduct, setEditingDetailsProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [detailNameAr, setDetailNameAr] = useState('');
  const [detailNameEn, setDetailNameEn] = useState('');
  const [detailBarcode, setDetailBarcode] = useState('');
  const [detailUnitAr, setDetailUnitAr] = useState('');
  const [detailBadgeAr, setDetailBadgeAr] = useState('');
  const [detailDescAr, setDetailDescAr] = useState('');

  // New Product Form State
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('meats');
  const [newSubcategory, setNewSubcategory] = useState<string>('fresh_beef_lamb');
  const [newPrice, setNewPrice] = useState<number>(5000);
  const [newOrigPrice, setNewOrigPrice] = useState<number>(0);
  const [newUnitAr, setNewUnitAr] = useState('1 كجم');
  const [newUnitEn, setNewUnitEn] = useState('1 kg');
  const [newIconType, setNewIconType] = useState<IconType>('meat');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [imageMethod, setImageMethod] = useState<'upload' | 'url' | 'presets'>('upload');
  const [newBadgeAr, setNewBadgeAr] = useState('طازج جديد');
  const [newOriginAr, setNewOriginAr] = useState('العراق - مزارع معتمدة');
  const [newStockCount, setNewStockCount] = useState<number>(50);
  const [newDescAr, setNewDescAr] = useState('');
  const [newTags, setNewTags] = useState('');

  // Edit existing product image modal state
  const [editingImageProduct, setEditingImageProduct] = useState<Product | null>(null);
  const [editingProductImageUrl, setEditingProductImageUrl] = useState<string>('');
  const [editImageMethod, setEditImageMethod] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isAddByBarcodeModalOpen, setIsAddByBarcodeModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminPanelOpen) return null;

  // Filter products for the admin table
  const displayedProducts = products.filter((p) => {
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch = 
      !adminSearch.trim() ||
      p.nameAr.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartEditPrice = (product: Product) => {
    setEditingPriceId(product.id);
    setTempPrice(product.price);
    setTempOrigPrice(product.originalPrice);
  };

  const handleSavePrice = (productId: string) => {
    if (tempPrice <= 0) return;
    updateProductPrice(productId, tempPrice, tempOrigPrice && tempOrigPrice > tempPrice ? tempOrigPrice : undefined);
    setEditingPriceId(null);
    showToast(isAr ? 'تم تحديث السعر بنجاح!' : 'Price updated successfully!');
  };

  const handleStartEditName = (product: Product) => {
    setEditingNameId(product.id);
    setTempNameAr(product.nameAr);
    setTempNameEn(product.nameEn || product.nameAr);
  };

  const handleSaveName = (productId: string) => {
    if (!tempNameAr.trim()) return;
    updateProductName(productId, tempNameAr.trim(), tempNameEn.trim() || tempNameAr.trim());
    setEditingNameId(null);
    showToast(isAr ? `تم حفظ اسم المنتج بنجاح: "${tempNameAr.trim()}"` : 'Product name updated successfully!');
  };

  const handleOpenEditDetails = (product: Product) => {
    setEditingDetailsProduct(product);
    setDetailNameAr(product.nameAr);
    setDetailNameEn(product.nameEn || product.nameAr);
    setDetailBarcode(product.barcode || '');
    setDetailUnitAr(product.unitAr || '');
    setDetailBadgeAr(product.badgeAr || '');
    setDetailDescAr(product.descriptionAr || '');
  };

  const handleSaveDetails = () => {
    if (!editingDetailsProduct || !detailNameAr.trim()) return;
    updateProduct(editingDetailsProduct.id, {
      nameAr: detailNameAr.trim(),
      nameEn: detailNameEn.trim() || detailNameAr.trim(),
      barcode: detailBarcode.trim() || undefined,
      unitAr: detailUnitAr.trim() || editingDetailsProduct.unitAr,
      badgeAr: detailBadgeAr.trim() || undefined,
      descriptionAr: detailDescAr.trim() || editingDetailsProduct.descriptionAr,
    });
    showToast(isAr ? `تم حفظ تعديلات "${detailNameAr.trim()}" بنجاح!` : 'Product details saved successfully!');
    setEditingDetailsProduct(null);
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  // Handle image upload from file system
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditingExisting = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(isAr ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت' : 'Image is too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isEditingExisting) {
        setEditingProductImageUrl(dataUrl);
      } else {
        setNewImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveExistingProductImage = () => {
    if (!editingImageProduct) return;
    updateProduct(editingImageProduct.id, {
      imageUrl: editingProductImageUrl.trim() || undefined,
    });
    showToast(isAr ? `تم تحديث صورة "${editingImageProduct.nameAr}" بنجاح!` : 'Product image updated successfully!');
    setEditingImageProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr.trim() || newPrice <= 0) return;

    const created = addProduct({
      nameAr: newNameAr.trim(),
      nameEn: newNameEn.trim() || newNameAr.trim(),
      barcode: newBarcode.trim() || undefined,
      category: newCategory,
      subcategoryId: newSubcategory,
      price: Number(newPrice),
      originalPrice: newOrigPrice > 0 ? Number(newOrigPrice) : undefined,
      unitAr: newUnitAr.trim() || 'قطعة',
      unitEn: newUnitEn.trim() || 'item',
      iconType: newIconType,
      imageUrl: newImageUrl.trim() || undefined,
      badgeAr: newBadgeAr.trim() || undefined,
      originAr: newOriginAr.trim() || 'أسواق الشورجة',
      originEn: 'Shorja Markets',
      inStock: true,
      stockCount: Number(newStockCount) || 50,
      descriptionAr: newDescAr.trim() || 'منتج عالي الجودة متوفر لدى أسواق الشورجة.',
      descriptionEn: 'Premium quality grocery available at Shorja Markets.',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    showToast(isAr ? `تمت إضافة المنتج "${created.nameAr}" مع الصورة والباركود بنجاح!` : 'Product created successfully!');
    
    // Reset form
    setNewNameAr('');
    setNewNameEn('');
    setNewBarcode('');
    setNewPrice(5000);
    setNewOrigPrice(0);
    setNewImageUrl('');
    setNewDescAr('');
    setActiveTab('list');
  };

  // Get subcategories for currently selected newCategory
  const currentCategoryObj = CATEGORIES.find((c) => c.id === newCategory);
  const availableSubcategories = currentCategoryObj?.subcategories.filter((s) => s.id !== `all_${newCategory}`) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-sm">
              ش
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'لوحة تحكم الإدارة: إدارة المنتجات، الصور، وتعديل الأسعار' : 'Admin: Products, Images & Prices'}
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-extrabold px-2 py-0.5 rounded-full">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {isAr
                  ? 'أقسام المتجر: لحوم، غذائية، ألبان، منظفات، سناكات | رفع الصور والتحكم الفوري بالأسعار'
                  : 'Departments: Meats, Groceries, Dairy, Detergents, Snacks | Upload photos & live prices'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminPanelOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toast Banner */}
        {saveToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Tab Switcher & Stats Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isAr ? 'قائمة المنتجات وتعديل الأسعار' : 'Products & Price Editor'}</span>
              <span className="bg-amber-400 text-stone-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? '+ إضافة منتج جديد مع الصورة' : '+ Add Product & Photo'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddByBarcodeModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm cursor-pointer"
              title={isAr ? 'مسح باركود المنتج بالكاميرا وإضافته فوراً' : 'Scan barcode to add product'}
            >
              <Barcode className="w-4 h-4 text-stone-950" />
              <span>{isAr ? '📷 مسح باركود لإضافة منتج' : '📷 Add by Barcode'}</span>
            </button>

            <button
              onClick={() => {
                setIsAdminPanelOpen(false);
                setIsCreateReelOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-rose-100 text-rose-800 hover:bg-rose-200"
            >
              <Film className="w-3.5 h-3.5 text-rose-600" />
              <span>{isAr ? '🎬 نشر مقطع ريلز' : '🎬 Post Reel'}</span>
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {reels.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            {isAr ? 'إجمالي المنتجات المسجلة: ' : 'Total Catalog: '}
            <strong className="text-stone-900 font-mono">{products.length}</strong>
          </div>
        </div>

        {/* TAB 1: PRODUCT LIST & INLINE PRICE & IMAGE EDITING */}
        {activeTab === 'list' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {/* Search & Category Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      filterCategory === cat.id
                        ? 'bg-stone-900 text-amber-400'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {isAr ? cat.nameAr : cat.nameEn}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder={isAr ? 'بحث سريع في المنتجات...' : 'Search items...'}
                  className="w-full ps-8 pe-3 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* Product Table / Cards */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 font-bold">
                    <tr>
                      <th className="p-3 text-start">{isAr ? 'المنتج والصورة' : 'Product & Photo'}</th>
                      <th className="p-3 text-start">{isAr ? 'الباركود' : 'Barcode'}</th>
                      <th className="p-3 text-start">{isAr ? 'القسم' : 'Category'}</th>
                      <th className="p-3 text-start">{isAr ? 'السعر الحالي (د.ع)' : 'Current Price'}</th>
                      <th className="p-3 text-center">{isAr ? 'المخزون' : 'Stock'}</th>
                      <th className="p-3 text-center">{isAr ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {displayedProducts.map((product) => {
                      const isEditing = editingPriceId === product.id;
                      const isEditingName = editingNameId === product.id;
                      return (
                        <tr key={product.id} className="hover:bg-stone-50/70 transition-colors">
                          {/* Product Image & Info */}
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              {/* Thumbnail with quick photo change overlay */}
                              <div className="relative group shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-stone-100 p-1 flex items-center justify-center border border-stone-200 overflow-hidden">
                                  <ProductIllustration 
                                    iconType={product.iconType} 
                                    imageUrl={product.imageUrl} 
                                    alt={isAr ? product.nameAr : product.nameEn}
                                    className="w-full h-full object-contain" 
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    setEditingImageProduct(product);
                                    setEditingProductImageUrl(product.imageUrl || '');
                                  }}
                                  className="absolute inset-0 bg-stone-950/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                  title={isAr ? 'تغيير صورة المنتج' : 'Change photo'}
                                >
                                  <Camera className="w-4 h-4 text-amber-300" />
                                </button>
                              </div>

                              {isEditingName ? (
                                <div className="flex flex-col gap-1.5 min-w-[210px] p-2 bg-amber-50/80 border border-amber-200 rounded-xl shadow-2xs animate-in fade-in">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-stone-500 shrink-0">{isAr ? 'عربي:' : 'AR:'}</span>
                                    <input
                                      type="text"
                                      value={tempNameAr}
                                      onChange={(e) => setTempNameAr(e.target.value)}
                                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
                                      placeholder={isAr ? 'اسم المنتج بالعربية' : 'Arabic Name'}
                                      autoFocus
                                    />
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-stone-500 shrink-0">{isAr ? 'إنكليزي:' : 'EN:'}</span>
                                    <input
                                      type="text"
                                      value={tempNameEn}
                                      onChange={(e) => setTempNameEn(e.target.value)}
                                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 focus:outline-none focus:border-emerald-600"
                                      placeholder={isAr ? 'اسم المنتج بالإنجليزية' : 'English Name'}
                                    />
                                  </div>
                                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-amber-200/60">
                                    <button
                                      onClick={() => handleSaveName(product.id)}
                                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                                      title={isAr ? 'حفظ الاسم' : 'Save Name'}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{isAr ? 'حفظ' : 'Save'}</span>
                                    </button>
                                    <button
                                      onClick={() => setEditingNameId(null)}
                                      className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                      title={isAr ? 'إلغاء' : 'Cancel'}
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-1.5 group/name">
                                    <span>{isAr ? product.nameAr : product.nameEn}</span>
                                    {product.imageUrl && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                                        {isAr ? 'صورة خاصة' : 'Photo'}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => handleStartEditName(product)}
                                      className="p-1 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                                      title={isAr ? 'تعديل اسم المنتج المباشر' : 'Edit Product Name'}
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  <div className="text-[11px] text-stone-400 mt-0.5">
                                    {isAr ? product.unitAr : product.unitEn} · {product.rating}★ ({product.reviewsCount})
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Barcode Column for Cashier / POS scanner */}
                          <td className="p-3">
                            {product.barcode ? (
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-mono font-bold text-xs text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                                  {product.barcode}
                                </span>
                                <div className="hidden sm:block opacity-75 hover:opacity-100 transition-opacity">
                                  <BarcodeRenderer value={product.barcode} height={20} showText={false} />
                                </div>
                              </div>
                            ) : (
                              <span className="text-stone-400 text-[11px]">-</span>
                            )}
                          </td>

                          {/* Category */}
                          <td className="p-3">
                            <span className="inline-block px-2.5 py-1 bg-stone-100 text-stone-800 rounded-lg font-semibold text-[11px]">
                              {isAr
                                ? CATEGORIES.find((c) => c.id === product.category)?.nameAr || product.category
                                : product.category}
                            </span>
                          </td>

                          {/* Price & Inline Edit Field */}
                          <td className="p-3">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5 animate-in fade-in">
                                <div className="flex flex-col">
                                  <label className="text-[9px] text-stone-400">{isAr ? 'سعر البيع' : 'Sale Price'}</label>
                                  <input
                                    type="number"
                                    value={tempPrice}
                                    onChange={(e) => setTempPrice(Number(e.target.value))}
                                    className="w-24 px-2 py-1 bg-white border border-stone-800 rounded-lg text-xs font-bold text-stone-900 font-mono"
                                    autoFocus
                                  />
                                </div>

                                <div className="flex flex-col">
                                  <label className="text-[9px] text-stone-400">{isAr ? 'قبل الخصم (اختياري)' : 'Original'}</label>
                                  <input
                                    type="number"
                                    value={tempOrigPrice || ''}
                                    onChange={(e) => setTempOrigPrice(e.target.value ? Number(e.target.value) : undefined)}
                                    placeholder="اختياري"
                                    className="w-20 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-mono text-stone-500"
                                  />
                                </div>

                                <button
                                  onClick={() => handleSavePrice(product.id)}
                                  className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors mt-3"
                                  title={isAr ? 'حفظ السعر' : 'Save price'}
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingPriceId(null)}
                                  className="p-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition-colors mt-3"
                                  title={isAr ? 'إلغاء' : 'Cancel'}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="font-bold text-stone-900 font-mono text-xs sm:text-sm">
                                    {formatPrice(product.price)}
                                  </div>
                                  {product.originalPrice && product.originalPrice > product.price && (
                                    <div className="text-[10px] text-stone-400 line-through font-mono">
                                      {formatPrice(product.originalPrice)}
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleStartEditPrice(product)}
                                  className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                                  title={isAr ? 'تعديل السعر المباشر' : 'Edit price'}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Stock Toggle */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => toggleStock(product.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                product.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              }`}
                            >
                              {product.inStock
                                ? isAr ? 'متوفر بالمخزن' : 'In Stock'
                                : isAr ? 'نفد المخزون' : 'Out of Stock'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Edit Name Button */}
                              <button
                                onClick={() => handleOpenEditDetails(product)}
                                className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1"
                                title={isAr ? 'تعديل اسم ومواصفات المنتج' : 'Edit name & details'}
                              >
                                <Type className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold">{isAr ? 'الاسم' : 'Name'}</span>
                              </button>

                              {/* Edit Image Button */}
                              <button
                                onClick={() => {
                                  setEditingImageProduct(product);
                                  setEditingProductImageUrl(product.imageUrl || '');
                                }}
                                className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1"
                                title={isAr ? 'تعديل صورة المنتج' : 'Edit photo'}
                              >
                                <Camera className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-bold">{isAr ? 'صورة' : 'Photo'}</span>
                              </button>

                              <button
                                onClick={() => handleStartEditPrice(product)}
                                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
                                title={isAr ? 'تعديل السعر' : 'Edit price'}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setProductToDelete(product)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title={isAr ? 'حذف المنتج' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW PRODUCT WITH COMPREHENSIVE IMAGE UPLOAD */}
        {activeTab === 'add' && (
          <div className="p-5 sm:p-7 flex-1 overflow-y-auto">
            <form onSubmit={handleCreateProduct} className="max-w-3xl mx-auto space-y-6">
              
              {/* SECTION: PRODUCT PHOTO (صورة المنتج) */}
              <div className="bg-stone-50 p-5 rounded-3xl border-2 border-dashed border-stone-300">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-black text-stone-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-700" />
                    <span>{isAr ? 'صورة المنتج (اختر أو ارفع صورة للمنتج)' : 'Product Photo'}</span>
                  </label>
                  {newImageUrl && (
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{isAr ? 'إزالة الصورة الحالية' : 'Remove Image'}</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-5 items-center">
                  {/* Live Preview Square */}
                  <div className="w-36 h-36 rounded-2xl bg-white border border-stone-200 shadow-sm p-2 flex flex-col items-center justify-center shrink-0 overflow-hidden relative group">
                    {newImageUrl ? (
                      <img
                        src={newImageUrl}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2">
                        <ProductIllustration iconType={newIconType} className="w-16 h-16 object-contain" />
                        <span className="text-[10px] text-stone-400 mt-1 font-medium">
                          {isAr ? 'أيقونة افتراضية' : 'Default Icon'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Image Source Method Controls */}
                  <div className="flex-1 w-full space-y-3">
                    {/* Mode Tabs */}
                    <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setImageMethod('upload')}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                          imageMethod === 'upload' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isAr ? 'رفع من الجهاز' : 'Upload File'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageMethod('url')}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                          imageMethod === 'url' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>{isAr ? 'رابط مباشر' : 'Image URL'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageMethod('presets')}
                        className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                          imageMethod === 'presets' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{isAr ? 'معرض صور مقترحة' : 'Presets'}</span>
                      </button>
                    </div>

                    {/* Method 1: File Upload */}
                    {imageMethod === 'upload' && (
                      <div className="animate-in fade-in">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-3 px-4 border border-emerald-600/40 hover:border-emerald-600 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-900 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                        >
                          <Upload className="w-4 h-4 text-emerald-700" />
                          <span>{isAr ? 'اضغط لاختيار صورة من هاتفك أو حاسوبك' : 'Choose photo from device'}</span>
                        </button>
                        <p className="text-[11px] text-stone-400 mt-1.5 text-center">
                          {isAr ? 'يدعم PNG و JPG و WebP (يتم حفظها محلياً وبشكل دائم)' : 'Supports PNG, JPG, WebP (stored locally)'}
                        </p>
                      </div>
                    )}

                    {/* Method 2: Image URL */}
                    {imageMethod === 'url' && (
                      <div className="space-y-1.5 animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://example.com/product-image.jpg"
                            className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                          />
                        </div>
                        <p className="text-[11px] text-stone-400">
                          {isAr ? 'الصق أي رابط صورة مباشر من الإنترنت للمنتج' : 'Paste any direct web image link'}
                        </p>
                      </div>
                    )}

                    {/* Method 3: Presets Gallery */}
                    {imageMethod === 'presets' && (
                      <div className="space-y-2 animate-in fade-in">
                        <p className="text-[11px] font-bold text-stone-600">
                          {isAr ? 'اختر صورة احترافية مطابقة للقسم الحالي:' : 'Pick a photo matching category:'}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {(PRESET_PRODUCT_IMAGES[newCategory] || []).map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setNewImageUrl(preset.url)}
                              className={`p-1.5 rounded-xl border text-start flex items-center gap-2 transition-all ${
                                newImageUrl === preset.url
                                  ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                                  : 'border-stone-200 bg-white hover:bg-stone-50'
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.titleAr}
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                              />
                              <span className="text-[10px] font-bold text-stone-800 truncate">
                                {isAr ? preset.titleAr : preset.titleEn}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: لحم غنم طازج بالعظم"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'الاسم بالإنجليزية (اختياري)' : 'Product Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="e.g. Fresh Local Lamb"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                    <span>{isAr ? 'باركود الكاشير (Barcode)' : 'Cashier Barcode'}</span>
                    <span className="text-[10px] text-amber-600 font-normal">{isAr ? 'اختياري / تلقائي' : 'Optional'}</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newBarcode}
                      onChange={(e) => setNewBarcode(e.target.value)}
                      placeholder="مثال: 628100100109"
                      className="w-full ps-3.5 pe-28 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                    />
                    <div className="absolute end-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setIsAddByBarcodeModalOpen(true)}
                        className="text-[10px] bg-amber-400 hover:bg-amber-300 text-stone-950 px-2 py-1 rounded-lg font-bold flex items-center gap-0.5 cursor-pointer shadow-2xs"
                        title={isAr ? 'مسح بالكاميرا' : 'Scan with camera'}
                      >
                        <Camera className="w-3 h-3" />
                        <span>{isAr ? 'مسح' : 'Scan'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewBarcode('628' + Math.floor(100000000 + Math.random() * 900000000).toString())}
                        className="text-[10px] bg-stone-200 hover:bg-stone-300 text-stone-700 px-1.5 py-1 rounded-lg font-bold cursor-pointer"
                        title={isAr ? 'توليد باركود تلقائي' : 'Generate random'}
                      >
                        {isAr ? 'توليد' : 'Gen'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories & Subcategories (Strictly the 5 departments) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'القسم الرئيسي للمنتج *' : 'Department *'}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const cat = e.target.value as CategoryId;
                      setNewCategory(cat);
                      const catObj = CATEGORIES.find((c) => c.id === cat);
                      if (catObj?.subcategories.length) {
                        setNewSubcategory(catObj.subcategories[1]?.id || catObj.subcategories[0]?.id || '');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-stone-800"
                  >
                    <option value="meats">{isAr ? '🥩 لحوم ودواجن' : 'Meats & Poultry'}</option>
                    <option value="groceries">{isAr ? '🌾 غذائية ومؤونة' : 'Groceries & Pantry'}</option>
                    <option value="dairy">{isAr ? '🥛 ألبان وأجبان وبيض' : 'Dairy & Eggs'}</option>
                    <option value="detergents">{isAr ? '✨ منظفات ومستلزمات' : 'Detergents'}</option>
                    <option value="snacks">{isAr ? '🍪 سناكات ومسليات' : 'Snacks'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'القسم الفرعي' : 'Subcategory'}
                  </label>
                  <select
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-stone-800"
                  >
                    {availableSubcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {isAr ? sub.nameAr : sub.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'سعر البيع (د.ع عراقي) *' : 'Sale Price (IQD) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min="250"
                    step="250"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    placeholder="15000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold font-mono text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'السعر قبل الخصم (اختياري)' : 'Original Price (Optional)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="250"
                    value={newOrigPrice || ''}
                    onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                    placeholder="18000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono text-stone-600 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'وحدة البيع' : 'Unit (e.g. 1 kg)'}
                  </label>
                  <input
                    type="text"
                    value={newUnitAr}
                    onChange={(e) => setNewUnitAr(e.target.value)}
                    placeholder="1 كجم، علبة، كيس 5 كجم"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Visual Fallback Icon & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'الأيقونة التوضيحية (بديلة)' : 'Illustration Icon (Fallback)'}
                  </label>
                  <select
                    value={newIconType}
                    onChange={(e) => setNewIconType(e.target.value as IconType)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-stone-800"
                  >
                    <option value="meat">لحم وستيك (Meat / Steak)</option>
                    <option value="chicken">دجاج ودواجن (Chicken)</option>
                    <option value="mince">مفروم وكباب (Minced)</option>
                    <option value="fish">سمك مسكوف (Fish)</option>
                    <option value="rice">أرز وتمن وحبوب (Rice / Flour)</option>
                    <option value="oil">زيت وسمن (Cooking Oil)</option>
                    <option value="tomato_paste">معجون طماطم ومعلبات (Paste)</option>
                    <option value="chai">شاي عراقي مهيل (Iraqi Tea)</option>
                    <option value="milk">حليب مبستر (Fresh Milk)</option>
                    <option value="cheese">جبن أبيض (Cheese)</option>
                    <option value="eggs">بيض مائدة (Eggs)</option>
                    <option value="cream">قيمر عرب وقشطة (Qaimar)</option>
                    <option value="detergent_powder">مسحوق غسيل (Detergent)</option>
                    <option value="dish_soap">سائل جلي صحون (Dish Soap)</option>
                    <option value="bleach">معقم ومطهر (Disinfectant)</option>
                    <option value="tissues">مناديل ورقية (Tissues)</option>
                    <option value="chips">شبس ومقرمشات (Chips)</option>
                    <option value="nuts">مكسرات مشكلة (Nuts)</option>
                    <option value="dates">تمور عراقية (Dates)</option>
                    <option value="chocolate">شوكولاتة وبسكويت (Chocolate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'وسام أو شريط ترويجي (Badge)' : 'Badge Label'}
                  </label>
                  <input
                    type="text"
                    value={newBadgeAr}
                    onChange={(e) => setNewBadgeAr(e.target.value)}
                    placeholder="طازج اليوم، الأكثر مبيعاً، خصم خاص"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'وصف المنتج ومميزاته' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={newDescAr}
                  onChange={(e) => setNewDescAr(e.target.value)}
                  placeholder={isAr ? 'اكتب وصفاً مختصراً يوضح طازجية المنتج وجودته...' : 'Brief product highlights...'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'حفظ وإضافة المنتج للمتجر' : 'Publish Product to Store'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: CHANGE/UPDATE IMAGE FOR EXISTING PRODUCT */}
        {editingImageProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-500" />
                  <h3 className="font-black text-sm text-stone-900">
                    {isAr ? 'تحديث صورة المنتج:' : 'Update Product Photo:'} {isAr ? editingImageProduct.nameAr : editingImageProduct.nameEn}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingImageProduct(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Preview */}
              <div className="w-full h-40 bg-stone-50 rounded-2xl border border-stone-200 p-3 flex items-center justify-center overflow-hidden">
                {editingProductImageUrl ? (
                  <img
                    src={editingProductImageUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <ProductIllustration iconType={editingImageProduct.iconType} className="w-24 h-24 object-contain" />
                )}
              </div>

              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setEditImageMethod('upload')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    editImageMethod === 'upload' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isAr ? 'رفع من الجهاز' : 'Upload'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditImageMethod('url')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    editImageMethod === 'url' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{isAr ? 'رابط مباشر' : 'URL'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditImageMethod('presets')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    editImageMethod === 'presets' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isAr ? 'صور مقترحة' : 'Presets'}</span>
                </button>
              </div>

              {editImageMethod === 'upload' && (
                <div>
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="w-full py-3 px-4 border border-emerald-600/40 hover:border-emerald-600 bg-emerald-50 text-emerald-900 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                  >
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>{isAr ? 'اختر صورة من هاتفك أو حاسوبك' : 'Browse photo from device'}</span>
                  </button>
                </div>
              )}

              {editImageMethod === 'url' && (
                <div>
                  <input
                    type="url"
                    value={editingProductImageUrl}
                    onChange={(e) => setEditingProductImageUrl(e.target.value)}
                    placeholder="https://example.com/product.jpg"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
              )}

              {editImageMethod === 'presets' && (
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                  {(PRESET_PRODUCT_IMAGES[editingImageProduct.category] || []).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingProductImageUrl(preset.url)}
                      className={`p-1.5 rounded-xl border text-start flex items-center gap-2 transition-all ${
                        editingProductImageUrl === preset.url
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.titleAr}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <span className="text-[10px] font-bold text-stone-800 truncate">
                        {isAr ? preset.titleAr : preset.titleEn}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingProductImageUrl('')}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  {isAr ? 'حذف الصورة والرجوع للأيقونة' : 'Reset to Icon'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingImageProduct(null)}
                    className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveExistingProductImage}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {isAr ? 'حفظ الصورة الجديدة' : 'Save Photo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT PRODUCT NAME & DETAILS */}
        {editingDetailsProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {isAr ? 'تعديل اسم ومواصفات المنتج' : 'Edit Product Name & Details'}
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      {isAr ? 'تحديث مسمى المنتج في المتجر والسلة فوراً' : 'Instant update across store and cart'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingDetailsProduct(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Product preview banner */}
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center border border-stone-200 shrink-0">
                  <ProductIllustration
                    iconType={editingDetailsProduct.iconType}
                    imageUrl={editingDetailsProduct.imageUrl}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {detailNameAr || editingDetailsProduct.nameAr}
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    {formatPrice(editingDetailsProduct.price)} · {detailUnitAr || editingDetailsProduct.unitAr}
                  </div>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={detailNameAr}
                    onChange={(e) => setDetailNameAr(e.target.value)}
                    placeholder={isAr ? 'مثال: لحم غنم عراقي طازج فاخر' : 'Arabic Name'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'اسم المنتج بالإنجليزية (اختياري)' : 'Product Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={detailNameEn}
                    onChange={(e) => setDetailNameEn(e.target.value)}
                    placeholder="Fresh Iraqi Lamb"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Barcode className="w-3.5 h-3.5 text-amber-600" />
                        <span>{isAr ? 'باركود الكاشير للمسح' : 'Cashier Barcode'}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setDetailBarcode('628' + Math.floor(100000000 + Math.random() * 900000000).toString())}
                        className="text-[10px] text-amber-700 hover:underline font-bold"
                      >
                        {isAr ? 'توليد جديد' : 'Generate'}
                      </button>
                    </label>
                    <input
                      type="text"
                      value={detailBarcode}
                      onChange={(e) => setDetailBarcode(e.target.value)}
                      placeholder="628100100101"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'معاينة خطوط الباركود' : 'Barcode Preview'}
                    </label>
                    <div className="bg-stone-50 border border-stone-200 rounded-xl px-2 py-1 flex items-center justify-center min-h-[38px]">
                      {detailBarcode ? (
                        <BarcodeRenderer value={detailBarcode} height={24} showText={false} />
                      ) : (
                        <span className="text-[10px] text-stone-400">{isAr ? 'لا يوجد باركود' : 'No barcode'}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'وحدة القياس / البيع' : 'Unit'}
                    </label>
                    <input
                      type="text"
                      value={detailUnitAr}
                      onChange={(e) => setDetailUnitAr(e.target.value)}
                      placeholder="1 كجم، 500 غم، علبة..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'الشارة الترويجية (Badge)' : 'Badge (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={detailBadgeAr}
                      onChange={(e) => setDetailBadgeAr(e.target.value)}
                      placeholder="طازج اليوم، عرض خاص..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isAr ? 'الوصف المختصر' : 'Short Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={detailDescAr}
                    onChange={(e) => setDetailDescAr(e.target.value)}
                    placeholder={isAr ? 'وصف للمنتج يظهر للزبائن...' : 'Product description...'}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingDetailsProduct(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetails}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حفظ تعديل الاسم والبيانات' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* MODAL: DELETE PRODUCT CONFIRMATION */}
        <ProductDeleteConfirmModal
          product={productToDelete}
          isOpen={Boolean(productToDelete)}
          onClose={() => setProductToDelete(null)}
          onConfirm={(id) => {
            deleteProduct(id);
            showToast(isAr ? 'تم حذف المنتج بنجاح!' : 'Product deleted successfully!');
          }}
          isAr={isAr}
        />

        {/* MODAL: ADD PRODUCT BY BARCODE */}
        <AddProductByBarcodeModal
          isOpen={isAddByBarcodeModalOpen}
          onClose={() => setIsAddByBarcodeModalOpen(false)}
          onProductAdded={(newP) => {
            showToast(
              isAr 
                ? `تمت إضافة المنتج بالباركود: "${newP.nameAr}" بنجاح!` 
                : `Product "${newP.nameEn}" added by barcode!`
            );
          }}
        />
      </div>
    </div>
  );
};
