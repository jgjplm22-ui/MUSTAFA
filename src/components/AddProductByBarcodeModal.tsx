import React, { useState, useEffect, useRef } from 'react';
import { 
  Barcode, 
  X, 
  Camera, 
  CameraOff, 
  SwitchCamera, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Zap, 
  Plus, 
  Image as ImageIcon, 
  Upload, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Package,
  Layers,
  Tag,
  DollarSign
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useMarket } from '../context/MarketContext';
import { CategoryId, IconType, Product } from '../types/market';
import { CATEGORIES } from '../data/marketData';
import { BarcodeRenderer } from './BarcodeRenderer';
import { ProductIllustration } from './ProductIllustrations';

// High-definition curated photos tailored for product presets
const PRESET_PHOTOS: Record<CategoryId, { titleAr: string; titleEn: string; url: string }[]> = {
  all: [],
  meats: [
    { titleAr: 'لحم غنم طازج بالعظم', titleEn: 'Fresh Lamb with Bone', url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'دجاج مبرد طازج', titleEn: 'Fresh Chilled Chicken', url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'لحم عجل مفروم', titleEn: 'Minced Veal Meat', url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'سمك طازج منظف', titleEn: 'Fresh Cleaned Fish', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80' },
  ],
  groceries: [
    { titleAr: 'أرز عراقي عنبر', titleEn: 'Aromatic Anbar Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'زيت دوار الشمس', titleEn: 'Sunflower Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'معجون طماطم طبيعي', titleEn: 'Tomato Paste', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'شاي عراقي فاخر', titleEn: 'Premium Iraqi Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80' },
  ],
  dairy: [
    { titleAr: 'قيمر عرب عراقي', titleEn: 'Iraqi Buffalo Cream', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'حليب كامل الدسم', titleEn: 'Full Cream Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'جبن أبيض مالح', titleEn: 'White Salted Cheese', url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'طبق بيض مائدة', titleEn: 'Farm Eggs Tray', url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80' },
  ],
  detergents: [
    { titleAr: 'مسحوق غسيل أوتوماتيك', titleEn: 'Laundry Detergent Powder', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'سائل جلي صحون ليمون', titleEn: 'Dishwashing Liquid Lemon', url: 'https://images.unsplash.com/photo-1585670270608-b404fb0802b6?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'معقم ومطهر أرضيات', titleEn: 'Floor Cleaner Disinfectant', url: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'مناديل ورقية ناعمة', titleEn: 'Soft Facial Tissues', url: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&w=600&q=80' },
  ],
  snacks: [
    { titleAr: 'بطاطا شبس مقرمشة', titleEn: 'Crispy Potato Chips', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'مكسرات مشكلة فاخرة', titleEn: 'Deluxe Mixed Nuts', url: 'https://images.unsplash.com/photo-1536591375315-1b83681e581a?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'تمر خستاوي عراقي', titleEn: 'Iraqi Khasstawi Dates', url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=600&q=80' },
    { titleAr: 'بسكويت ويفر كاكاو', titleEn: 'Chocolate Crispy Wafers', url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80' },
  ],
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialBarcode?: string;
  onProductAdded?: (newProduct: Product) => void;
}

export const AddProductByBarcodeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialBarcode = '',
  onProductAdded,
}) => {
  const { products, addProduct, language, addToCart } = useMarket();
  const isAr = language === 'ar';

  // Scanner States
  const [barcode, setBarcode] = useState(initialBarcode);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [lookupFeedback, setLookupFeedback] = useState<string | null>(null);

  // Form States
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<CategoryId>('groceries');
  const [subcategoryId, setSubcategoryId] = useState<string>('all_groceries');
  const [price, setPrice] = useState<number>(2500);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [unitAr, setUnitAr] = useState('قطعة');
  const [unitEn, setUnitEn] = useState('Piece');
  const [originAr, setOriginAr] = useState('محلي أصلي');
  const [originEn, setOriginEn] = useState('Local Original');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iconType, setIconType] = useState<IconType>('rice');
  const [inStock, setInStock] = useState(true);
  const [alsoAddToInvoice, setAlsoAddToInvoice] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if barcode already exists in products list
  const existingProduct = React.useMemo(() => {
    if (!barcode.trim()) return null;
    const cleanDigits = barcode.replace(/\D/g, '');
    return products.find((p) => {
      if (!p.barcode) return false;
      const pDigits = p.barcode.replace(/\D/g, '');
      return pDigits === cleanDigits || p.barcode.trim() === barcode.trim();
    });
  }, [barcode, products]);

  // Sync initial barcode prop when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialBarcode) {
        setBarcode(initialBarcode);
        fetchOnlineBarcodeInfo(initialBarcode);
      } else {
        // Automatically start camera on open if no barcode provided
        setIsCameraActive(true);
      }
    } else {
      stopCamera();
    }
  }, [isOpen, initialBarcode]);

  // Audio Beep
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext could be restricted
    }
  };

  // Try fetching product metadata online via Open Food Facts
  const fetchOnlineBarcodeInfo = async (code: string) => {
    const clean = code.replace(/\D/g, '');
    if (clean.length < 8) return;

    setIsSearchingOnline(true);
    setLookupFeedback(isAr ? 'جارٍ البحث عن الصنف في قاعدة بيانات الباركود العالمية...' : 'Looking up barcode...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s max
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${clean}.json`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.status === 1 && data.product) {
          const p = data.product;
          const foundTitleAr = p.product_name_ar || p.product_name || p.generic_name_ar || '';
          const foundTitleEn = p.product_name_en || p.product_name || '';
          const foundImg = p.image_front_url || p.image_url || '';

          if (foundTitleAr && !nameAr) {
            setNameAr(foundTitleAr);
          }
          if (foundTitleEn && !nameEn) {
            setNameEn(foundTitleEn);
          }
          if (foundImg && !imageUrl) {
            setImageUrl(foundImg);
          }

          setLookupFeedback(
            isAr 
              ? `✓ تم العثور على الصنف: "${foundTitleAr || foundTitleEn}"` 
              : `✓ Found item details: "${foundTitleEn || foundTitleAr}"`
          );
        } else {
          setLookupFeedback(isAr ? 'لم يُعثر على صنف جاهز، يمكنك كتابة الاسم والسعر أدناه.' : 'No pre-existing catalog match.');
        }
      }
    } catch {
      setLookupFeedback(null);
    } finally {
      setIsSearchingOnline(false);
      setTimeout(() => setLookupFeedback(null), 4000);
    }
  };

  // Handle Barcode Scanned by Camera
  const handleBarcodeCaptured = (decodedCode: string) => {
    playBeep();
    setBarcode(decodedCode);
    setIsCameraActive(false);
    stopCamera();
    fetchOnlineBarcodeInfo(decodedCode);
  };

  // Camera Management
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch {
        // ignore
      }
    }

    const container = document.getElementById('add-product-scanner-box');
    if (!container) return;

    try {
      const html5QrCode = new Html5Qrcode('add-product-scanner-box', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
        ],
        verbose: false,
      });

      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: mode },
        {
          fps: 15,
          qrbox: { width: 280, height: 160 },
          aspectRatio: 1.333,
        },
        (decodedText) => {
          handleBarcodeCaptured(decodedText);
        },
        () => {
          // ignore frames
        }
      );
    } catch (err: unknown) {
      console.warn('Camera start error in AddProduct:', err);
      setCameraError(
        isAr 
          ? 'تعذر الوصول إلى الكاميرا. يمكنك إدخال الباركود يدوياً أو رفع صورة الباركود.' 
          : 'Could not access camera.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
  };

  useEffect(() => {
    if (isCameraActive) {
      const timer = setTimeout(() => {
        startCamera(facingMode);
      }, 250);
      return () => {
        clearTimeout(timer);
        stopCamera();
      };
    } else {
      stopCamera();
    }
  }, [isCameraActive, facingMode]);

  // Clean on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Update default subcategory when category changes
  const availableSubcategories = React.useMemo(() => {
    const catObj = CATEGORIES.find((c) => c.id === category);
    return catObj ? catObj.subcategories : [];
  }, [category]);

  useEffect(() => {
    if (availableSubcategories.length > 0) {
      setSubcategoryId(availableSubcategories[0].id);
    }
  }, [category, availableSubcategories]);

  // Form submission: save product to store
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!barcode.trim()) {
      alert(isAr ? 'يرجى مسح أو إدخال رقم الباركود' : 'Please provide a barcode');
      return;
    }

    if (!nameAr.trim()) {
      alert(isAr ? 'يرجى كتابة اسم المنتج بالعربية' : 'Please provide product name in Arabic');
      return;
    }

    if (price <= 0) {
      alert(isAr ? 'يرجى إدخال سعر صحيح للمنتج' : 'Please enter a valid price');
      return;
    }

    const created = addProduct({
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || nameAr.trim(),
      barcode: barcode.trim(),
      category,
      subcategoryId,
      price: Number(price),
      originalPrice: originalPrice > price ? Number(originalPrice) : undefined,
      unitAr: unitAr.trim() || 'قطعة',
      unitEn: unitEn.trim() || 'Piece',
      originAr: originAr.trim() || 'محلي أصلي',
      originEn: originEn.trim() || 'Local Original',
      descriptionAr: descriptionAr.trim() || `صنف طازج ومضمون من أسواق الشورجة برقم باركود ${barcode.trim()}`,
      descriptionEn: descriptionEn.trim() || `Fresh quality item from Shorja Markets with barcode ${barcode.trim()}`,
      imageUrl: imageUrl.trim() || undefined,
      iconType,
      inStock,
      stockCount: 50,
      badgeAr: 'جديد بالباركود',
      badgeEn: 'New by Barcode',
      tags: [category, 'جديد', 'باركود'],
    });

    if (alsoAddToInvoice) {
      addToCart(created, 1);
    }

    if (onProductAdded) {
      onProductAdded(created);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Barcode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'إضافة منتج جديد بواسطة الباركود' : 'Add New Product by Barcode'}
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded-full">
                  {isAr ? 'مسح سريع' : 'Fast Scan'}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {isAr ? 'امسح باركود العلبة أو الكيس بالكاميرا لربط السعر والاسم والمخزون' : 'Scan packaging barcode to register product & price'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Form */}
        <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* STEP 1: SCANNER & BARCODE DIGITS BOX */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'الخطوة 1: مسح أو تحديد رقم الباركود' : 'Step 1: Scan or Set Barcode'}</span>
              </label>

              <div className="flex items-center gap-1.5">
                {/* Camera Toggle */}
                <button
                  type="button"
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isCameraActive 
                      ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' 
                      : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-2xs'
                  }`}
                >
                  {isCameraActive ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                  <span>{isCameraActive ? (isAr ? 'إغلاق الكاميرا' : 'Close Cam') : (isAr ? 'فتح الكاميرا للمسح' : 'Open Camera')}</span>
                </button>

                {/* Random Generator */}
                <button
                  type="button"
                  onClick={() => {
                    const randomCode = '628' + Math.floor(100000000 + Math.random() * 900000000).toString();
                    setBarcode(randomCode);
                  }}
                  className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title={isAr ? 'توليد باركود تلقائي' : 'Generate random code'}
                >
                  {isAr ? 'توليد كود' : 'Generate'}
                </button>
              </div>
            </div>

            {/* Live Camera Viewfinder */}
            {isCameraActive && (
              <div className="relative bg-stone-950 rounded-2xl overflow-hidden aspect-[4/3] max-h-[220px] border-2 border-stone-800 shadow-inner flex items-center justify-center animate-in fade-in">
                <div id="add-product-scanner-box" className="w-full h-full object-cover" />

                {/* Laser Targeting Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-[85%] max-w-[280px] h-[55%] max-h-[140px] border-2 border-amber-400 rounded-2xl relative shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[10px] text-white/90 font-bold bg-black/70 px-2.5 py-0.5 rounded-full mt-2">
                    {isAr ? 'ضع خطوط الباركود داخل الإطار' : 'Fit barcode inside frame'}
                  </span>
                </div>

                {/* Switch Camera */}
                <button
                  type="button"
                  onClick={() => {
                    const next = facingMode === 'environment' ? 'user' : 'environment';
                    setFacingMode(next);
                  }}
                  className="absolute bottom-2 end-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg text-xs"
                >
                  <SwitchCamera className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Barcode Input & Live Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => {
                    setBarcode(e.target.value);
                    if (e.target.value.length >= 8) {
                      fetchOnlineBarcodeInfo(e.target.value);
                    }
                  }}
                  placeholder="مثال: 628100200201..."
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-300 focus:border-stone-800 rounded-xl text-sm font-mono font-black text-stone-900 focus:outline-none"
                />
              </div>

              <div className="bg-white p-2 rounded-xl border border-stone-200 flex items-center justify-center min-h-[44px]">
                {barcode.trim() ? (
                  <BarcodeRenderer value={barcode.trim()} height={26} showText={true} />
                ) : (
                  <span className="text-xs text-stone-400 font-medium">
                    {isAr ? 'معاينة خطوط الباركود ستظهر هنا' : 'Barcode zebra preview'}
                  </span>
                )}
              </div>
            </div>

            {/* Duplicate Notice or Online Info */}
            {existingProduct && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs font-bold flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    {isAr 
                      ? `تنبيه: هذا الباركود مسجل مسبقاً لـ "${existingProduct.nameAr}" (السعر: ${existingProduct.price} د.ع)` 
                      : `Warning: Barcode already registered for "${existingProduct.nameEn}"`}
                  </span>
                </div>
              </div>
            )}

            {lookupFeedback && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lookupFeedback}</span>
              </div>
            )}
          </div>

          {/* STEP 2: PRODUCT BASIC INFO */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-600" />
              <span>{isAr ? 'الخطوة 2: تفاصيل المنتج وتحديد السعر' : 'Step 2: Product Name & Price'}</span>
            </h3>

            {/* Arabic & English Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'اسم المنتج بالعربية *' : 'Product Name (Arabic) *'}
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder={isAr ? 'مثال: شاي عراقي مهيل خلطة ملكية' : 'e.g. Royal Cardamom Iraqi Tea'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'اسم المنتج بالإنجليزية (اختياري)' : 'Product Name (English)'}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Royal Cardamom Iraqi Tea"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                />
              </div>
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'القسم التجاري الرئيسي *' : 'Main Department *'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white cursor-pointer"
                >
                  <option value="groceries">{isAr ? 'غذائية ومؤونة (بقالة)' : 'Groceries & Staples'}</option>
                  <option value="meats">{isAr ? 'لحوم ودواجن وأسماك' : 'Meats & Poultry'}</option>
                  <option value="dairy">{isAr ? 'ألبان وأجبان وبيض' : 'Dairy & Cheese'}</option>
                  <option value="detergents">{isAr ? 'منظفات وعناية منزلية' : 'Detergents & Cleaners'}</option>
                  <option value="snacks">{isAr ? 'سكاكر ومكسرات وتسالي' : 'Snacks & Nuts'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'التصنيف الفرعي' : 'Subcategory'}
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white cursor-pointer"
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
                  {isAr ? 'سعر البيع (دينار عراقي) *' : 'Selling Price (IQD) *'}
                </label>
                <input
                  type="number"
                  required
                  min={250}
                  step={250}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-black text-amber-950 focus:outline-none focus:border-stone-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'السعر الأصلي قبل الخصم (اختياري)' : 'Original Price (Optional)'}
                </label>
                <input
                  type="number"
                  min={0}
                  step={250}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono text-stone-500 focus:outline-none focus:border-stone-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'الوحدة (كغم، علبة، لتر)' : 'Unit'}
                </label>
                <input
                  type="text"
                  value={unitAr}
                  onChange={(e) => setUnitAr(e.target.value)}
                  placeholder="علبة / كغم / باكيت"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                />
              </div>
            </div>

            {/* Product Image Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                <span>{isAr ? 'صورة المنتج المعروضة:' : 'Product Photo:'}</span>
                <span className="text-[10px] text-stone-400">{isAr ? 'اختر صورة جاهزة أو الصق رابط' : 'Pick preset or enter URL'}</span>
              </label>

              {/* Presets for this category */}
              <div className="grid grid-cols-4 gap-2 mb-2">
                {(PRESET_PHOTOS[category] || []).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`p-1 rounded-xl border transition-all overflow-hidden flex flex-col items-center cursor-pointer ${
                      imageUrl === preset.url
                        ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50'
                    }`}
                  >
                    <img src={preset.url} alt={preset.titleAr} className="w-full h-12 object-cover rounded-lg mb-1" />
                    <span className="text-[9px] font-bold text-stone-800 truncate w-full text-center">
                      {isAr ? preset.titleAr : preset.titleEn}
                    </span>
                  </button>
                ))}
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-800 focus:outline-none focus:bg-white"
              />
            </div>

            {/* Checkbox: Also add to invoice */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-2.5">
              <input
                type="checkbox"
                id="also-add-to-pos"
                checked={alsoAddToInvoice}
                onChange={(e) => setAlsoAddToInvoice(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="also-add-to-pos" className="text-xs font-bold text-stone-900 cursor-pointer">
                {isAr ? 'إضافة المنتج فوراً إلى فاتورة الكاشير الحالية بعد الحفظ' : 'Immediately add 1 qty to current POS bill after saving'}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isAr ? 'حفظ الصنف بالباركود' : 'Save Product by Barcode'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
