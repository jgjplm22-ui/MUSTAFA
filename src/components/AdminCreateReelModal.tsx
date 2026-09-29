import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Video,
  Film,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Trash2,
  Music,
  Play
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';

// Curated library of authentic short videos ready for instant publishing by admin
const PRESET_REEL_VIDEOS = [
  {
    titleAr: 'تقطيع لحم غنم طازج بالعظم',
    titleEn: 'Fresh Lamb Butchering Cut',
    videoUrl: '/videos/reel-meat.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&auto=format&fit=crop&q=80',
    productId: 'meat-01',
    soundTitle: 'صوت التقطيع المباشر - قسم الملحمة',
    captionAr: 'شاهدوا طزاجة لحم الغنم العراقي في ملحمة أسواق الشورجة. مذبوح اليوم ومقطع حسب رغبتكم.',
  },
  {
    titleAr: 'سكب زيت زيتون وبقوليات فاخرة',
    titleEn: 'Pouring Pure Oil & Pantry Essentials',
    videoUrl: '/videos/reel-rice.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    productId: 'groc-02',
    soundTitle: 'موسيقى هادئة للطبخ العراقي',
    captionAr: 'زيوت نقية ومؤونة غذائية بأفضل أسعار الجملة في بغداد. تمن عنبر وزيوت ومعجون أصلي.',
  },
  {
    titleAr: 'سكب حليب طازج وقيمر عرب',
    titleEn: 'Fresh Whole Milk & Qaimar Pour',
    videoUrl: '/videos/reel-dairy.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    productId: 'dairy-01',
    soundTitle: 'أجواء صباحية بغدادية',
    captionAr: 'حليب أبقار وجاموس طازج 100% مع قيمر عرب أصلي لريوق ولا أروع.',
  },
  {
    titleAr: 'تساقط وقرمشة شبس بطاطا ذهبي',
    titleEn: 'Crispy Potato Chips Falling',
    videoUrl: '/videos/reel-chips.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    productId: 'snack-01',
    soundTitle: 'صوت القرمشة الشهير',
    captionAr: 'تحدي قرمشة السناكات! تشكيلة واسعة من الشبس والمكسرات الطازجة متوفرة الآن.',
  },
];

export const AdminCreateReelModal: React.FC = () => {
  const {
    isCreateReelOpen,
    setIsCreateReelOpen,
    addReel,
    products,
    language,
  } = useMarket();

  const isAr = language === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [captionAr, setCaptionAr] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [soundTitle, setSoundTitle] = useState('صوت أصلي - أسواق الشورجة');
  const [videoSourceMode, setVideoSourceMode] = useState<'upload' | 'url' | 'presets'>('presets');
  const [previewError, setPreviewError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  if (!isCreateReelOpen) return null;

  // Handle local video file upload from device
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (< 25MB for browser local storage/data URLs)
    if (file.size > 25 * 1024 * 1024) {
      alert(isAr ? 'حجم الفيديو كبير جداً. يرجى اختيار فيديو أقل من 25 ميجابايت' : 'Video file too large (max 25MB)');
      return;
    }

    setPreviewError(false);
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
  };

  const handleSelectPreset = (preset: typeof PRESET_REEL_VIDEOS[0]) => {
    setVideoUrl(preset.videoUrl);
    setThumbnailUrl(preset.thumbnailUrl);
    setTitleAr(preset.titleAr);
    setTitleEn(preset.titleEn);
    setCaptionAr(preset.captionAr);
    setSoundTitle(preset.soundTitle);
    if (preset.productId && products.some((p) => p.id === preset.productId)) {
      setSelectedProductId(preset.productId);
    }
  };

  const handlePublishReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr.trim() || !videoUrl.trim()) {
      alert(isAr ? 'يرجى إدخال عنوان الريل واختيار الفيديو' : 'Please provide reel title and video');
      return;
    }

    const created = addReel({
      titleAr: titleAr.trim(),
      titleEn: titleEn.trim() || titleAr.trim(),
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      captionAr: captionAr.trim() || 'عرض حي ومباشر من أقسام أسواق الشورجة 🏪✨',
      captionEn: titleEn.trim() || 'Live showcase from Shorja Markets',
      authorName: 'إدارة أسواق الشورجة',
      authorRole: 'admin',
      productId: selectedProductId || undefined,
      soundTitle: soundTitle.trim() || 'صوت أصلي - أسواق الشورجة',
      duration: '0:25',
    });

    setToastMessage(isAr ? `تم نشر مقطع الريلز "${created.titleAr}" بنجاح!` : 'Reel published successfully!');
    
    setTimeout(() => {
      setToastMessage(null);
      setIsCreateReelOpen(false);
      // Reset form
      setTitleAr('');
      setTitleEn('');
      setCaptionAr('');
      setVideoUrl('');
      setSelectedProductId('');
    }, 1200);
  };

  const linkedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'نشر مقطع ريلز جديد (إدارة الشورجة)' : 'Publish New Reel (Admin)'}
                </h2>
                <span className="text-[10px] bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                  Reels Live
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {isAr
                  ? 'انشر مقاطع فيديو قصيرة وتفاعلية للزبائن مع إمكانية ربطها بالمنتج للشراء الفوري'
                  : 'Post short vertical video reels with 1-click product purchase'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateReelOpen(false)}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast Banner */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          <form onSubmit={handlePublishReel} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT / TOP: VIDEO SOURCE CONTROLS (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Video Mode Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  {isAr ? '1. مصدر مقطع الفيديو *' : '1. Video Source *'}
                </label>
                <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('presets')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                      videoSourceMode === 'presets'
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'مقاطع جاهزة مميزة' : 'Presets'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('upload')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                      videoSourceMode === 'upload'
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رفع من الجهاز' : 'Upload Video'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoSourceMode('url')}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                      videoSourceMode === 'url'
                        ? 'bg-stone-900 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رابط مباشر (URL)' : 'Video URL'}</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: Presets Gallery */}
              {videoSourceMode === 'presets' && (
                <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 animate-in fade-in">
                  <p className="text-xs font-bold text-stone-700">
                    {isAr ? 'اختر مقطعاً احترافياً جاهزاً من أسواق الشورجة:' : 'Select a ready-made Shorja clip:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PRESET_REEL_VIDEOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2.5 rounded-xl border text-start flex items-center gap-3 transition-all ${
                          videoUrl === preset.videoUrl
                            ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-500/20'
                            : 'border-stone-200 bg-white hover:bg-stone-100'
                        }`}
                      >
                        <div className="w-12 h-14 rounded-lg overflow-hidden bg-stone-200 shrink-0 relative">
                          <img
                            src={preset.thumbnailUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-stone-950/30 flex items-center justify-center text-white">
                            <Play className="w-3.5 h-3.5 fill-white" />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xs text-stone-900 truncate">
                            {isAr ? preset.titleAr : preset.titleEn}
                          </div>
                          <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                            {isAr ? preset.captionAr : preset.titleEn}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mode 2: Device File Upload */}
              {videoSourceMode === 'upload' && (
                <div className="bg-stone-50 p-5 rounded-2xl border-2 border-dashed border-stone-300 text-center space-y-2 animate-in fade-in">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    onChange={handleVideoFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {isAr ? 'اختر ملف فيديو من هاتفك أو حاسوبك' : 'Choose video file'}
                    </button>
                    <p className="text-[11px] text-stone-400 mt-2">
                      {isAr ? 'يدعم صيغ MP4 و WebM (يفضل أن يكون الفيديو عمودياً 9:16)' : 'Supports MP4, WebM (vertical 9:16 recommended)'}
                    </p>
                  </div>
                </div>
              )}

              {/* Mode 3: Direct URL */}
              {videoSourceMode === 'url' && (
                <div className="space-y-1.5 animate-in fade-in">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                  <p className="text-[11px] text-stone-400">
                    {isAr ? 'رابط مباشر لملف MP4 أو WebM يعمل على المتصفح' : 'Direct link to browser-compatible MP4/WebM'}
                  </p>
                </div>
              )}

              {/* Reel Title in Arabic & English */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? '2. عنوان الريل (بالعربية) *' : '2. Reel Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: وصول لحم الغنم الطازج اليوم 🥩"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'العنوان بالإنجليزية (اختياري)' : 'Reel Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Fresh Daily Lamb Shipment"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white"
                  />
                </div>
              </div>

              {/* Link to Product (Crucial e-commerce feature) */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isAr ? '3. ربط الريل بمنتج من المتجر (للشراء بنقرة واحدة)' : '3. Link to Store Product'}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-normal">اختياري</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-stone-800"
                >
                  <option value="">{isAr ? '-- بدون منتج مرتبط (عرض عام) --' : '-- No product link --'}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.category}] {isAr ? p.nameAr : p.nameEn} ({p.price.toLocaleString()} د.ع)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-stone-500 mt-1">
                  {isAr
                    ? 'عند ربط المنتج، سيظهر زر "إضافة للسلة" وشريط السعر فوق الفيديو مباشرة للزبائن أثناء المشاهدة!'
                    : 'When linked, customers will see an "Add to Cart" button directly on the video!'}
                </p>
              </div>

              {/* Caption & Sound */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                    <Music className="w-3 h-3 text-stone-500" />
                    <span>{isAr ? 'اسم الصوت أو الموسيقى' : 'Sound Track Title'}</span>
                  </label>
                  <input
                    type="text"
                    value={soundTitle}
                    onChange={(e) => setSoundTitle(e.target.value)}
                    placeholder="صوت أصلي - أسواق الشورجة"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {isAr ? 'رابط صورة الغلاف (اختياري)' : 'Cover Image URL'}
                  </label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {isAr ? 'وصف الريل (الكابشن) ومميزات العرض' : 'Caption / Details'}
                </label>
                <textarea
                  rows={2}
                  value={captionAr}
                  onChange={(e) => setCaptionAr(e.target.value)}
                  placeholder={isAr ? 'اكتب تفاصيل العرض، الطزاجة، أو دعوة الزبائن للطلب...' : 'Write video highlights...'}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                />
              </div>
            </div>

            {/* RIGHT: LIVE SMARTPHONE VERTICAL PREVIEW (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <label className="text-xs font-bold text-stone-800 mb-2 self-start">
                {isAr ? 'معاينة حية لشاشة الموبايل (Phone Preview):' : 'Live Phone Preview:'}
              </label>

              {/* Mock Phone Body */}
              <div className="w-[270px] h-[480px] bg-stone-950 rounded-[36px] p-3 shadow-2xl border-4 border-stone-800 relative flex flex-col overflow-hidden">
                {/* Dynamic Island / Speaker */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-stone-900 rounded-full z-30 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-800" />
                </div>

                {/* Video Playback Canvas */}
                <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-stone-900 flex items-center justify-center">
                  {videoUrl && !previewError ? (
                    <video
                      ref={videoPreviewRef}
                      src={videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      onError={() => setPreviewError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : previewError ? (
                    <div className="flex flex-col items-center justify-center text-center p-4 text-stone-400">
                      <Film className="w-10 h-10 mb-2 text-rose-500" />
                      <span className="text-xs font-bold text-rose-400">
                        {isAr ? 'تعذر تشغيل هذا الرابط' : 'Could not play this video'}
                      </span>
                      <span className="text-[10px] text-stone-500 mt-1">
                        {isAr ? 'يرجى اختيار مقطع جاهز أو رفع فيديو MP4' : 'Please choose a preset or MP4'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4 text-stone-500">
                      <Film className="w-10 h-10 mb-2 text-stone-600 animate-pulse" />
                      <span className="text-xs font-bold text-stone-400">
                        {isAr ? 'اختر أو ارفع فيديو لتظهر المعاينة' : 'Select or upload a video'}
                      </span>
                    </div>
                  )}

                  {/* Dark gradient overlay for bottom text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

                  {/* Overlay Top Tag */}
                  <div className="absolute top-10 start-3 end-3 flex items-center justify-between text-white text-[11px] font-bold z-10">
                    <span className="bg-rose-600/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px]">
                      ريلز الشورجة 🔴
                    </span>
                    <span className="text-[10px] text-white/80">0:25</span>
                  </div>

                  {/* Overlay Bottom Content */}
                  <div className="absolute bottom-3 start-3 end-3 space-y-2 z-10 text-white text-start">
                    {/* Linked Product Preview Pill */}
                    {linkedProduct && (
                      <div className="bg-stone-900/90 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-between gap-2 shadow-lg">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-white/10 p-0.5 shrink-0 overflow-hidden">
                            <ProductIllustration 
                              iconType={linkedProduct.iconType} 
                              imageUrl={linkedProduct.imageUrl} 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-white truncate">
                              {isAr ? linkedProduct.nameAr : linkedProduct.nameEn}
                            </div>
                            <div className="text-[9px] text-amber-300 font-mono font-bold">
                              {linkedProduct.price.toLocaleString()} د.ع
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-1 bg-emerald-600 text-white text-[9px] font-bold rounded-lg shrink-0">
                          {isAr ? 'شراء' : 'Buy'}
                        </span>
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">
                        {titleAr || (isAr ? 'عنوان الريل هنا...' : 'Reel Title...')}
                      </h4>
                      <p className="text-[10px] text-white/80 line-clamp-2 mt-0.5 leading-tight">
                        {captionAr || (isAr ? 'وصف وتفاصيل المنتج والعرض المباشر...' : 'Reel description...')}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] text-white/60">
                      <Music className="w-2.5 h-2.5" />
                      <span className="truncate">{soundTitle}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="lg:col-span-12 pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateReelOpen(false)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={!titleAr.trim() || !videoUrl.trim()}
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                <span>{isAr ? 'نشر الريل في المتجر الآن 🚀' : 'Publish Reel Now'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
