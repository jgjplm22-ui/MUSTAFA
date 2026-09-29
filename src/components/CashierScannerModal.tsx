import React, { useState, useEffect, useRef } from 'react';
import { 
  Barcode, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Printer, 
  Check, 
  Camera, 
  CameraOff, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  SwitchCamera,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useMarket } from '../context/MarketContext';
import { Product } from '../types/market';
import { BarcodeRenderer } from './BarcodeRenderer';
import { ProductIllustration } from './ProductIllustrations';
import { AddProductByBarcodeModal } from './AddProductByBarcodeModal';

export const CashierScannerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    clearCart,
    grandTotal, 
    formatPrice, 
    language,
    setIsCheckoutOpen 
  } = useMarket();

  const isAr = language === 'ar';
  
  // States
  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'catalog'>('camera');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [lastScannedProduct, setLastScannedProduct] = useState<Product | null>(null);
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isProcessingCode, setIsProcessingCode] = useState(false);
  const [isAddByBarcodeOpen, setIsAddByBarcodeOpen] = useState(false);
  const [unrecognizedBarcode, setUnrecognizedBarcode] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const lastScannedCodeRef = useRef<string>('');

  // Audio Beep generator using Web Audio API (identical to supermarket POS beeps)
  const playCashierBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime); // crisp supermarket high beep
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // AudioContext could be blocked by browser policy without user gesture
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(80);
      } catch {
        // ignore
      }
    }
  };

  // Find product by barcode query
  const findProductByBarcode = (query: string): Product | undefined => {
    const rawDigits = query.replace(/\D/g, '');
    const cleanQuery = query.trim().toLowerCase();

    return products.find((p) => {
      if (!p.barcode) return false;
      const pDigits = p.barcode.replace(/\D/g, '');
      
      // Match exact digits or clean query
      if (p.barcode.toLowerCase() === cleanQuery) return true;
      if (rawDigits && pDigits === rawDigits) return true;
      
      // If code has leading/trailing zeros or sub-code
      if (rawDigits.length >= 6 && (pDigits.includes(rawDigits) || rawDigits.includes(pDigits))) {
        return true;
      }
      return false;
    });
  };

  // Core handler when any code is scanned (via camera, gun, upload, or manual)
  const handleScannedCode = (code: string) => {
    const now = Date.now();
    // Debounce duplicate scans within 1.5 seconds of same code
    if (code === lastScannedCodeRef.current && now - lastScannedTimeRef.current < 1500) {
      return;
    }
    lastScannedCodeRef.current = code;
    lastScannedTimeRef.current = now;

    setIsProcessingCode(true);
    playCashierBeep();

    const product = findProductByBarcode(code);

    if (product) {
      setUnrecognizedBarcode(null);
      addToCart(product, 1);
      setLastScannedProduct(product);
      setScanMessage({
        text: isAr 
          ? `✓ تم مسح [${code}] - تمت إضافة "${product.nameAr}" إلى الفاتورة!` 
          : `✓ Scanned [${code}] - Added "${product.nameEn}" to invoice!`,
        type: 'success',
      });
    } else {
      setUnrecognizedBarcode(code);
      setScanMessage({
        text: isAr 
          ? `الرمز [${code}] غير مسجل كباركود لمنتج في المتجر! اضغط أدناه لإضافته.` 
          : `Barcode [${code}] not found in catalog! Click below to add it.`,
        type: 'error',
      });
    }

    setTimeout(() => {
      setIsProcessingCode(false);
    }, 400);

    setTimeout(() => {
      setScanMessage(null);
    }, 4000);
  };

  // Initialize and start live camera scanner
  const startCameraScanner = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);

    // Stop existing scanner instance if running
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch {
        // ignore cleanup error
      }
    }

    const container = document.getElementById('camera-preview-container');
    if (!container) return;

    try {
      const html5QrCode = new Html5Qrcode('camera-preview-container', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.DATA_MATRIX
        ],
        verbose: false,
      });

      scannerRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
          // Optimal barcode scanner box (wider than tall for 1D zebra barcodes)
          const width = Math.min(viewfinderWidth * 0.85, 340);
          const height = Math.min(viewfinderHeight * 0.55, 180);
          return { width, height };
        },
        aspectRatio: 1.333,
      };

      await html5QrCode.start(
        { facingMode: mode },
        config,
        (decodedText) => {
          handleScannedCode(decodedText);
        },
        () => {
          // Frame parsed with no code, continuous scanning
        }
      );

      setIsScanning(true);
    } catch (err: unknown) {
      console.warn('Camera barcode start error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('NotAllowedError') || errMsg.includes('Permission')) {
        setCameraError(
          isAr 
            ? 'تم رفض إذن الكاميرا. يرجى السماح بالوصول للكاميرا من إعدادات المتصفح أو استخدام الإدخال اليدوي أو مسدس الباركود.' 
            : 'Camera permission denied. Please allow camera access in browser settings.'
        );
      } else if (errMsg.includes('NotFoundError') || errMsg.includes('DevicesNotFoundError')) {
        setCameraError(
          isAr 
            ? 'لم يتم العثور على كاميرا في هذا الجهاز. يمكنك إدخال الباركود يدوياً أو رفع صورة.' 
            : 'No camera found on this device.'
        );
      } else {
        setCameraError(
          isAr 
            ? 'تعذر تشغيل الكاميرا حالياً. تأكد من إغلاق أي تطبيق آخر يستخدم الكاميرا.' 
            : 'Unable to start camera scanner.'
        );
      }
      setIsScanning(false);
    }
  };

  const stopCameraScanner = async () => {
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
    setIsScanning(false);
  };

  // Switch facing mode (Front / Back camera)
  const toggleCameraFacingMode = async () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    await stopCameraScanner();
    setTimeout(() => {
      startCameraScanner(nextMode);
    }, 200);
  };

  // Handle image file upload scan
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScanMessage({
        text: isAr ? 'جارٍ تحليل صورة الباركود...' : 'Scanning uploaded image...',
        type: 'info',
      });

      // Temporary scanner instance for file analysis
      const tempScanner = new Html5Qrcode('file-scan-temp-box', {
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

      const decoded = await tempScanner.scanFile(file, true);
      tempScanner.clear();
      handleScannedCode(decoded);
    } catch {
      setScanMessage({
        text: isAr 
          ? 'لم يتم العثور على باركود واضح في الصورة المرفوعة. حاول التقاط صورة أقرب للخطوط.' 
          : 'Could not detect a clear barcode in the image.',
        type: 'error',
      });
      setTimeout(() => setScanMessage(null), 3500);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Hardware barcode scanner support (USB / Bluetooth scanner guns send rapid keypresses + Enter)
  useEffect(() => {
    if (!isOpen) return;

    let buffer = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing inside an input other than our barcode input
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      const isOurInput = target && target.id === 'manual-barcode-input-field';

      if (isInput && !isOurInput) {
        return;
      }

      const now = Date.now();
      // Hardware barcode scanners send keystrokes within 20-50ms of each other
      if (now - lastKeyTime > 250) {
        buffer = '';
      }
      lastKeyTime = now;

      if (e.key === 'Enter') {
        if (buffer.trim().length >= 3) {
          e.preventDefault();
          handleScannedCode(buffer.trim());
          buffer = '';
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        buffer += e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, products, soundEnabled]);

  // Start / stop camera depending on modal state and active tab
  useEffect(() => {
    if (isOpen && activeTab === 'camera') {
      const timer = setTimeout(() => {
        startCameraScanner(facingMode);
      }, 300);
      return () => {
        clearTimeout(timer);
        stopCameraScanner();
      };
    } else {
      stopCameraScanner();
    }
  }, [isOpen, activeTab]);

  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop();
          }
          scannerRef.current.clear();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Hidden container for image file scanning */}
      <div id="file-scan-temp-box" className="hidden" aria-hidden="true" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-stone-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md font-bold shrink-0">
              <Barcode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'ماسح باركود الكاشير والمحاسبة الفورية' : 'Cashier Barcode Scanner Station'}
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isScanning ? 'bg-emerald-500 text-stone-950' : 'bg-amber-400 text-stone-950'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-emerald-950 animate-ping' : 'bg-amber-950'}`} />
                  {isScanning 
                    ? (isAr ? 'الكاميرا نشطة للمسح' : 'Live Camera Active') 
                    : (isAr ? 'قارئ نشط' : 'Ready')}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                {isAr ? 'يدعم كاميرا الهاتف والكمبيوتر، مسدس الباركود (USB/BT)، وإدخال الأرقام' : 'Supports Camera, Barcode Gun & manual input'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                soundEnabled 
                  ? 'bg-stone-800 text-amber-400 border-stone-700 hover:bg-stone-700' 
                  : 'bg-stone-800 text-stone-500 border-stone-700 hover:text-stone-400'
              }`}
              title={soundEnabled ? (isAr ? 'كتم صوت الصافرة' : 'Mute beep') : (isAr ? 'تفعيل صوت الكاشير' : 'Enable beep')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Camera className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'كاميرا المسح المباشر' : 'Live Camera'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'مسدس الباركود / يدوي' : 'Barcode Gun / Manual'}</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Barcode className="w-4 h-4 text-amber-600" />
            <span>{isAr ? 'كتالوج الباركودات' : 'Quick Barcodes'}</span>
          </button>

          <button
            onClick={() => {
              setUnrecognizedBarcode('');
              setIsAddByBarcodeOpen(true);
            }}
            className="py-2 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-2xs shrink-0"
            title={isAr ? 'إضافة منتج جديد بواسطة الباركود' : 'Add new product by barcode'}
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? '+ إضافة صنف بالباركود' : '+ Add Item'}</span>
          </button>
        </div>

        {/* Scan Feedback Banner */}
        {scanMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between border-b transition-all ${
              scanMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200 animate-in fade-in slide-in-from-top-1'
                : scanMessage.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200 animate-in shake'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {scanMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {scanMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {scanMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />}
              <span>{scanMessage.text}</span>
            </div>
            <button
              onClick={() => setScanMessage(null)}
              className="text-stone-400 hover:text-stone-700 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Unrecognized Barcode Immediate Registration Prompt */}
        {unrecognizedBarcode && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 px-4 py-3 border-b border-amber-600 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              <Barcode className="w-6 h-6 shrink-0 text-stone-950" />
              <div className="min-w-0">
                <p className="text-xs font-black truncate">
                  {isAr ? `الباركود [${unrecognizedBarcode}] غير مسجل بعد!` : `Barcode [${unrecognizedBarcode}] is not registered!`}
                </p>
                <p className="text-[11px] text-stone-900 font-medium line-clamp-1">
                  {isAr ? 'اضغط لإدخال اسم الصنف وسعره وإضافته للمتجر والفاتورة مباشرة.' : 'Click to register item name & price into catalog.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAddByBarcodeOpen(true)}
              className="px-3.5 py-2 bg-stone-950 hover:bg-stone-800 text-amber-400 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm shrink-0 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة الصنف الآن' : 'Add Item Now'}</span>
            </button>
          </div>
        )}

        {/* Content Body: 2 Main Columns */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x md:divide-stone-200 divide-x-reverse">
          {/* Main Left Action Area */}
          <div className="md:w-7/12 p-3 sm:p-5 flex flex-col space-y-4">
            
            {/* TAB 1: LIVE CAMERA SCANNER */}
            {activeTab === 'camera' && (
              <div className="space-y-3">
                {/* Camera Viewfinder Box */}
                <div className="relative bg-stone-950 rounded-2xl overflow-hidden aspect-[4/3] max-h-[300px] border-2 border-stone-800 shadow-inner flex items-center justify-center">
                  
                  {/* html5-qrcode viewfinder target */}
                  <div id="camera-preview-container" className="w-full h-full object-cover" />

                  {/* Laser Scanning Animation Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      {/* Targeting Reticle */}
                      <div className={`w-[85%] max-w-[320px] h-[55%] max-h-[170px] border-2 rounded-2xl relative transition-all duration-300 ${
                        isProcessingCode ? 'border-emerald-400 bg-emerald-500/20 scale-105' : 'border-amber-400/90 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                      }`}>
                        {/* Corner markers */}
                        <div className="absolute -top-1 -start-1 w-4 h-4 border-t-4 border-s-4 border-amber-400" />
                        <div className="absolute -top-1 -end-1 w-4 h-4 border-t-4 border-e-4 border-amber-400" />
                        <div className="absolute -bottom-1 -start-1 w-4 h-4 border-b-4 border-s-4 border-amber-400" />
                        <div className="absolute -bottom-1 -end-1 w-4 h-4 border-b-4 border-e-4 border-amber-400" />

                        {/* Animated Red Laser Beam */}
                        <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse top-1/2 -translate-y-1/2" />
                      </div>
                      
                      <p className="text-[11px] text-white/90 font-bold bg-black/60 px-3 py-1 rounded-full mt-2 backdrop-blur-xs">
                        {isAr ? 'وجه خط الليزر الأحمر نحو خطوط الباركود' : 'Align red line with barcode lines'}
                      </p>
                    </div>
                  )}

                  {/* Fallback Error / Permission prompt */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-stone-900/95 p-4 flex flex-col items-center justify-center text-center text-white space-y-2 z-10">
                      <CameraOff className="w-8 h-8 text-rose-400" />
                      <p className="text-xs font-bold text-rose-200 max-w-xs">{cameraError}</p>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => startCameraScanner(facingMode)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-black transition-colors"
                        >
                          {isAr ? 'إعادة المحاولة' : 'Retry Camera'}
                        </button>
                        <button
                          onClick={() => setActiveTab('manual')}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-colors"
                        >
                          {isAr ? 'استخدام اليدوي' : 'Use Manual'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Control Toolbar */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-1.5">
                    {/* Switch Camera Front/Back */}
                    <button
                      onClick={toggleCameraFacingMode}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={isAr ? 'تبديل الكاميرا (أمامية / خلفية)' : 'Switch Camera'}
                    >
                      <SwitchCamera className="w-3.5 h-3.5 text-amber-600" />
                      <span>{facingMode === 'environment' ? (isAr ? 'كاميرا خلفية' : 'Rear') : (isAr ? 'كاميرا أمامية' : 'Front')}</span>
                    </button>

                    {/* Upload barcode photo */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title={isAr ? 'مسح باركود من صورة محفوظة' : 'Scan from image'}
                    >
                      <Upload className="w-3.5 h-3.5 text-stone-600" />
                      <span>{isAr ? 'رفع صورة باركود' : 'Upload Image'}</span>
                    </button>
                  </div>

                  {/* Manual trigger camera toggle */}
                  <button
                    onClick={() => isScanning ? stopCameraScanner() : startCameraScanner(facingMode)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isScanning 
                        ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' 
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    {isScanning ? <CameraOff className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                    <span>{isScanning ? (isAr ? 'إيقاف الكاميرا' : 'Pause Camera') : (isAr ? 'تشغيل الكاميرا' : 'Start Camera')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL / BARCODE GUN INPUT */}
            {activeTab === 'manual' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{isAr ? 'جاهز لاستقبال إشارات مسدس الباركود (USB / Bluetooth):' : 'Ready for Barcode Gun Scanner:'}</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      {isAr 
                        ? 'فقط وجه مسدس الباركود واضغط الزناد، وسيتعرف النظام على المنتج وينزله في الفاتورة تلقائياً.' 
                        : 'Point your barcode gun and pull the trigger; items will be added instantly.'}
                    </p>
                  </div>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (barcodeInput.trim()) {
                      handleScannedCode(barcodeInput.trim());
                      setBarcodeInput('');
                    }
                  }} 
                  className="space-y-2"
                >
                  <label className="block text-xs font-bold text-stone-800">
                    {isAr ? 'أو اكتب رقم الباركود يدوياً:' : 'Or enter barcode number:'}
                  </label>
                  <div className="relative">
                    <Barcode className="w-5 h-5 text-stone-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="manual-barcode-input-field"
                      type="text"
                      autoFocus
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder={isAr ? 'مثال: 628100100101...' : 'e.g. 628100100101...'}
                      className="w-full ps-11 pe-24 py-3 bg-stone-50 border-2 border-stone-800 rounded-2xl text-sm font-mono font-bold text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white shadow-inner"
                    />
                    <button
                      type="submit"
                      disabled={!barcodeInput.trim()}
                      className="absolute end-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-amber-400 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      {isAr ? 'إدخال' : 'Enter'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: QUICK CATALOG TEST BARCODES */}
            {activeTab === 'catalog' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">
                    {isAr ? 'باركودات منتجات الشورجة الجاهزة للمسح أو النقر:' : 'Ready Barcodes to Scan or Click:'}
                  </span>
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full font-bold">
                    {products.length} {isAr ? 'صنف' : 'items'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => p.barcode && handleScannedCode(p.barcode)}
                      className="p-2.5 bg-stone-50 hover:bg-amber-50/80 border border-stone-200 hover:border-amber-300 rounded-2xl flex flex-col justify-between transition-all active:scale-[0.98] cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 p-0.5 shrink-0 flex items-center justify-center">
                          <ProductIllustration
                            iconType={p.iconType}
                            imageUrl={p.imageUrl}
                            alt={p.nameAr}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-amber-950">
                            {isAr ? p.nameAr : p.nameEn}
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-amber-800">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                      </div>

                      {/* Barcode visual preview on card */}
                      {p.barcode ? (
                        <div className="bg-white p-1.5 rounded-xl border border-stone-200 flex flex-col items-center">
                          <BarcodeRenderer value={p.barcode} height={26} showText={true} />
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-400 text-center">-</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scanned Item Spotlight Card */}
            {lastScannedProduct && (
              <div className="p-3 bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white border border-amber-200 p-1 shrink-0 flex items-center justify-center shadow-2xs">
                    <ProductIllustration
                      iconType={lastScannedProduct.iconType}
                      imageUrl={lastScannedProduct.imageUrl}
                      alt={lastScannedProduct.nameAr}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-amber-800 font-bold block">
                      {isAr ? 'آخر منتج تم مسحه:' : 'Last Scanned Item:'}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {isAr ? lastScannedProduct.nameAr : lastScannedProduct.nameEn}
                    </h4>
                    <span className="text-xs font-mono font-bold text-stone-800">
                      {formatPrice(lastScannedProduct.price)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  <button
                    onClick={() => handleScannedCode(lastScannedProduct.barcode || lastScannedProduct.id)}
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة ثانية' : 'Add another'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Right Column: Live POS Invoice & Checkout */}
          <div className="md:w-5/12 p-3 sm:p-5 bg-stone-50/70 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-stone-800" />
                  <h3 className="font-black text-stone-900 text-sm">
                    {isAr ? 'فاتورة الكاشير الحالية' : 'Live POS Receipt'}
                  </h3>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer"
                  >
                    {isAr ? 'تفريغ الفاتورة' : 'Clear All'}
                  </button>
                )}
              </div>

              {/* Items in Cart */}
              {cart.length === 0 ? (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <Barcode className="w-12 h-12 mx-auto opacity-30 text-stone-700" />
                  <p className="text-xs font-bold text-stone-600">
                    {isAr ? 'الفاتورة فارغة' : 'Receipt is empty'}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    {isAr ? 'وجه الكاميرا أو مسدس الباركود نحو المنتجات للبدء' : 'Scan items with camera to add'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto divide-y divide-stone-100 pe-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-2 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {isAr ? item.product.nameAr : item.product.nameEn}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                          <span>{formatPrice(item.product.price)}</span>
                          {item.product.barcode && (
                            <span className="text-stone-400">· #{item.product.barcode.slice(-6)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item.product, 1)}
                          className="w-6 h-6 rounded bg-stone-900 hover:bg-stone-800 text-amber-400 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Total & Actions */}
            <div className="pt-4 border-t border-stone-200 mt-4 space-y-3">
              <div className="flex items-center justify-between font-black text-stone-900">
                <span className="text-xs sm:text-sm">{isAr ? 'إجمالي الحساب المطلوب:' : 'Grand Total:'}</span>
                <span className="text-lg font-mono text-amber-900">{formatPrice(grandTotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isAr ? 'طباعة الوصل' : 'Print POS'}</span>
                </button>

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => {
                    onClose();
                    setIsCheckoutOpen(true);
                  }}
                  className="py-2.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-amber-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إتمام المحاسبة (Pay)' : 'Pay Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Product by Barcode Modal */}
      <AddProductByBarcodeModal
        isOpen={isAddByBarcodeOpen}
        onClose={() => setIsAddByBarcodeOpen(false)}
        initialBarcode={unrecognizedBarcode || ''}
        onProductAdded={(newProduct) => {
          addToCart(newProduct, 1);
          setLastScannedProduct(newProduct);
          setUnrecognizedBarcode(null);
          setScanMessage({
            text: isAr 
              ? `✓ تمت إضافة منتج جديد: "${newProduct.nameAr}" وتم تنزيله في الفاتورة!` 
              : `✓ Added new product: "${newProduct.nameEn}" to invoice!`,
            type: 'success',
          });
        }}
      />
    </div>
  );
};
