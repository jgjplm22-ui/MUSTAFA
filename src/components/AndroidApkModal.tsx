import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Zap, 
  ShieldCheck, 
  WifiOff, 
  Sparkles, 
  CheckCircle2, 
  Share2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useMarket } from '../context/MarketContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language } = useMarket();
  const isAr = language === 'ar';
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  // Official PWABuilder direct generator link for standalone APK / AAB
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDirectInstall = async () => {
    setInstalling(true);
    try {
      const result = await install();
      if (result) {
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Android & Brand styling */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-emerald-950 text-white p-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold shadow-lg shrink-0">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'تطبيق أسواق الشورجة (Android APK)' : 'Shorja Markets Android APK'}
                </h2>
                <span className="text-[10px] bg-emerald-400 text-stone-950 font-black px-2 py-0.5 rounded-full">
                  APK / PWA
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {isAr ? 'تثبيت فوري على هواتف أندرويد مع دعم العمل دون إنترنت وقارئ الباركود' : 'Native Android app with offline & barcode support'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Status Badge */}
          {isInstalled ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold">{isAr ? 'التطبيق مثبت بالفعل على جهازك!' : 'App is already installed!'}</h4>
                <p className="text-[11px] text-emerald-700">
                  {isAr ? 'أنت تستخدم التطبيق الآن كبرنامج أندرويد مستقل وشامل.' : 'You are currently running the installed standalone app.'}
                </p>
              </div>
            </div>
          ) : (
            /* Primary 1-Click Install Card */
            <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-stone-950 text-white rounded-3xl p-5 shadow-lg border border-emerald-500/30 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black text-emerald-400 tracking-wider">
                      {isAr ? 'الطريقة 1: التثبيت الفوري (WebAPK)' : 'Method 1: Instant Install (WebAPK)'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    {isAr ? 'تثبيت التطبيق على هاتفك بنقرة واحدة' : 'Install Directly to Android'}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {isAr
                      ? 'يقوم نظام أندرويد ومتصفح كروم تلقائياً بتغليف وتثبيت حزمة APK حقيقية مع أيقونة على شاشة هاتفك الرئيسية، وتعمل بملء الشاشة دون شريط المتصفح.'
                      : 'Android will automatically generate and install a native APK package with an app icon on your home screen.'}
                  </p>
                </div>
              </div>

              {/* Install Action Button */}
              {isInstallable ? (
                <button
                  onClick={handleDirectInstall}
                  disabled={installing}
                  className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>
                    {installing 
                      ? (isAr ? 'جارٍ التثبيت على الهاتف...' : 'Installing on device...') 
                      : (isAr ? 'تثبيت تطبيق أندرويد الآن (APK)' : 'Install Android App Now')}
                  </span>
                </button>
              ) : (
                <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700/80 text-xs text-stone-300 space-y-2">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isAr ? 'طريقة التثبيت السريعة من المتصفح:' : 'Quick Browser Install:'}</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-stone-200">
                    <li>
                      {isAr 
                        ? 'اضغط على زر الخيارات ( الثلاث نقاط ⋮ ) في أعلى متصفح Chrome أو Samsung Internet.'
                        : 'Tap the (⋮) menu in Chrome or Samsung Internet.'}
                    </li>
                    <li>
                      {isAr 
                        ? 'اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية" (Install App).' 
                        : 'Select "Install app" or "Add to Home screen".'}
                    </li>
                    <li>
                      {isAr 
                        ? 'سيقوم أندرويد بتحميل ملف الـ APK وتثبيته كبرنامج دائم على الهاتف.' 
                        : 'Android will automatically install the APK package.'}
                    </li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* Advantages of the APK */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-1">
              <Zap className="w-5 h-5 text-amber-600 mx-auto" />
              <h5 className="text-xs font-bold text-stone-900">{isAr ? 'سرعة فائقة' : 'High Speed'}</h5>
              <p className="text-[10px] text-stone-500">{isAr ? 'تشغيل فوري بملء الشاشة' : 'Instant launch'}</p>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-1">
              <WifiOff className="w-5 h-5 text-emerald-600 mx-auto" />
              <h5 className="text-xs font-bold text-stone-900">{isAr ? 'تخزين أوفلاين' : 'Offline Mode'}</h5>
              <p className="text-[10px] text-stone-500">{isAr ? 'يعمل حتى عند ضعف النت' : 'Caches product data'}</p>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-center space-y-1 col-span-2 sm:col-span-1">
              <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto" />
              <h5 className="text-xs font-bold text-stone-900">{isAr ? 'آمن 100%' : '100% Safe'}</h5>
              <p className="text-[10px] text-stone-500">{isAr ? 'بدون إعلانات وموقع ومحمي' : 'Verified Google WebAPK'}</p>
            </div>
          </div>

          {/* Method 2: Download Standalone .APK File for Google Play / Sideloading */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-700" />
                <h4 className="text-xs font-bold text-stone-900">
                  {isAr ? 'الطريقة 2: إنشاء ملف حزمة APK كاملة (.apk / .aab)' : 'Method 2: Standalone .APK File'}
                </h4>
              </div>
              <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">
                Google Play Ready
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {isAr
                ? 'إذا أردت الحصول على ملف APK مستقل لتوزيعه عبر الواتساب أو تيليغرام أو رفعه على متجر Google Play، يمكنك استخدام منصة PWABuilder (المدعومة من Google و Microsoft) لإنشاء ملف APK جاهز بضغطة زر واحدة:'
                : 'If you want a downloadable .apk file to distribute or publish to Google Play, use PWABuilder to package it:'}
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={pwaBuilderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{isAr ? 'توليد ملف APK عبر PWABuilder' : 'Build .APK via PWABuilder'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                title={isAr ? 'نسخ رابط التطبيق' : 'Copy App Link'}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

          {/* iOS Safari instructions if on Apple device */}
          {isIOS && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5">
              <h5 className="font-bold flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'لأجهزة آيفون / آيباد (iOS):' : 'For iPhone / iPad (iOS):'}</span>
              </h5>
              <p className="text-[11px] text-amber-800">
                {isAr
                  ? 'اضغط على زر المشاركة (Share ⎋) في أسفل متصفح Safari، ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).'
                  : 'Tap Share in Safari, then select "Add to Home Screen".'}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-mono">
            v1.2.0 · Progressive WebAPK
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
