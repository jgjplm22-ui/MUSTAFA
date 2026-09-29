import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Check,
  Music,
  Trash2,
  Plus,
  Play,
  Pause,
  Film
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { Reel } from '../types/market';
import { ProductIllustration } from './ProductIllustrations';

export const ReelViewerModal: React.FC = () => {
  const {
    activeReel,
    setActiveReel,
    reels,
    likeReel,
    deleteReel,
    isAdmin,
    products,
    addToCart,
    formatPrice,
    setIsCreateReelOpen,
    language,
  } = useMarket();

  const isAr = language === 'ar';
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [cartAddedToast, setCartAddedToast] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const currentIndex = activeReel ? reels.findIndex((r) => r.id === activeReel.id) : -1;
  const linkedProduct = activeReel?.productId 
    ? products.find((p) => p.id === activeReel.productId)
    : null;

  // Sync muted property directly to DOM element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Reset states and attempt playback when active reel changes
  useEffect(() => {
    setHasLiked(false);
    setHasVideoError(false);
    setIsPlaying(true);

    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;

    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.debug('Autoplay policy check:', error);
          // If browser prevents sound autoplay without interaction, mute and play
          if (videoRef.current && !isMuted) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
    }
  }, [activeReel?.id]);

  // Toggle Mute / Unmute
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Next / Previous Reel navigation
  const handleNext = () => {
    if (!reels.length) return;
    if (currentIndex >= 0 && currentIndex < reels.length - 1) {
      setActiveReel(reels[currentIndex + 1]);
    } else {
      // Loop to beginning
      setActiveReel(reels[0]);
    }
  };

  const handlePrev = () => {
    if (!reels.length) return;
    if (currentIndex > 0) {
      setActiveReel(reels[currentIndex - 1]);
    } else {
      // Loop to end
      setActiveReel(reels[reels.length - 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!activeReel) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveReel(null);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReel, currentIndex, reels]);

  if (!activeReel) return null;

  const togglePlayPause = () => {
    if (!videoRef.current || hasVideoError) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.debug('Video play caught:', err);
        setIsPlaying(false);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      likeReel(activeReel.id);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeReel.titleAr,
        text: activeReel.captionAr,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleAddToCart = () => {
    if (!linkedProduct) return;
    addToCart(linkedProduct, 1);
    setCartAddedToast(true);
    setTimeout(() => setCartAddedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-stone-950/90 backdrop-blur-md animate-in fade-in select-none">
      
      {/* Close button (top right/left depending on direction) */}
      <button
        onClick={() => setActiveReel(null)}
        className="absolute top-4 end-4 z-50 p-2.5 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all border border-white/10"
        title={isAr ? 'إغلاق' : 'Close'}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Admin: Create New Reel shortcut directly from Viewer */}
      {isAdmin && (
        <button
          onClick={() => {
            setActiveReel(null);
            setIsCreateReelOpen(true);
          }}
          className="absolute top-4 start-4 z-50 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 shadow-lg"
          title={isAr ? 'نشر ريلز جديد' : 'New Reel'}
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'نشر ريلز كإدارة' : 'Post Reel'}</span>
        </button>
      )}

      {/* Main Vertical Reel Player Canvas */}
      <div className="relative w-full max-w-[390px] h-full sm:h-[92vh] max-h-[820px] bg-black sm:rounded-[36px] overflow-hidden shadow-2xl flex flex-col items-center justify-center border sm:border-stone-800">
        
        {/* Video Canvas or High-Fidelity Poster Fallback */}
        {!hasVideoError ? (
          <video
            ref={videoRef}
            key={activeReel.id}
            src={activeReel.videoUrl}
            autoPlay
            loop
            playsInline
            muted={isMuted}
            onClick={togglePlayPause}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => {
              setHasVideoError(true);
              setIsPlaying(false);
            }}
            className="w-full h-full object-cover cursor-pointer"
          />
        ) : (
          <div 
            onClick={togglePlayPause}
            className="relative w-full h-full overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-black flex items-center justify-center cursor-pointer"
          >
            {activeReel.thumbnailUrl || linkedProduct?.imageUrl ? (
              <img
                src={activeReel.thumbnailUrl || linkedProduct?.imageUrl}
                alt=""
                className="w-full h-full object-cover opacity-80 scale-105 transition-transform duration-1000 animate-pulse"
              />
            ) : (
              <div className="text-center p-6 text-stone-500">
                <Film className="w-16 h-16 mx-auto mb-3 text-rose-500/60" />
              </div>
            )}
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px]" />
          </div>
        )}

        {/* Play/Pause Overlay indicator on click */}
        {!isPlaying && (
          <div 
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer pointer-events-auto"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Gradient dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

        {/* Top Control Bar: Audio mute, reel index, admin delete */}
        <div className="absolute top-4 start-4 end-4 flex items-center justify-between z-20 pointer-events-auto text-white">
          <button
            onClick={toggleMute}
            className="px-2.5 py-1.5 bg-black/50 hover:bg-black/80 rounded-full border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-xs active:scale-95 shadow-md"
            title={isMuted ? (isAr ? 'تشغيل الصوت' : 'Turn Sound On') : (isAr ? 'كتم الصوت' : 'Mute Sound')}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span className="text-[11px] font-bold text-rose-300">{isAr ? 'تشغيل الصوت' : 'Unmute'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-300">{isAr ? 'الصوت يعمل' : 'Sound On'}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-black/40 px-2.5 py-1 rounded-full text-white/90 border border-white/10 font-mono">
              {currentIndex + 1} / {reels.length}
            </span>

            {/* Admin Delete Action */}
            {isAdmin && (
              <button
                onClick={() => {
                  if (confirm(isAr ? 'هل أنت متأكد من حذف مقطع الريلز هذا؟' : 'Delete this reel?')) {
                    deleteReel(activeReel.id);
                  }
                }}
                className="p-2 bg-rose-600/80 hover:bg-rose-700 text-white rounded-full transition-colors border border-white/10"
                title={isAr ? 'حذف مقطع الريلز (خاص بالإدارة)' : 'Delete Reel'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Side Floating Action Rail (Like, Share, Next/Prev) */}
        <div className="absolute end-3 bottom-24 flex flex-col items-center gap-4 z-20 pointer-events-auto">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              hasLiked
                ? 'bg-rose-600 text-white'
                : 'bg-black/40 text-white hover:bg-rose-600/80'
            }`}>
              <Heart className={`w-5 h-5 ${hasLiked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[11px] font-bold text-white shadow-xs">
              {activeReel.likesCount + (hasLiked ? 1 : 0)}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-white shadow-xs">
              {isAr ? 'مشاركة' : 'Share'}
            </span>
          </button>

          {/* Next Reel Indicator */}
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10 mt-2"
            title={isAr ? 'المقطع التالي' : 'Next'}
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors border border-white/10"
            title={isAr ? 'المقطع السابق' : 'Previous'}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Overlay Content */}
        <div className="absolute bottom-4 start-4 end-16 space-y-2.5 z-20 pointer-events-auto text-start">
          
          {/* LINKED PRODUCT SHOPPING PILL (1-Click Buy) */}
          {linkedProduct && (
            <div className="bg-stone-900/90 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-2xl animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white p-1 shrink-0 overflow-hidden border border-stone-200">
                  <ProductIllustration
                    iconType={linkedProduct.iconType}
                    imageUrl={linkedProduct.imageUrl}
                    alt={isAr ? linkedProduct.nameAr : linkedProduct.nameEn}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {isAr ? linkedProduct.nameAr : linkedProduct.nameEn}
                  </div>
                  <div className="text-[11px] text-amber-300 font-mono font-bold mt-0.5">
                    {formatPrice(linkedProduct.price)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-md"
              >
                {cartAddedToast ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تمت الإضافة!' : 'Added!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Author & Verified Tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-white flex items-center gap-1.5 drop-shadow">
              <span>{activeReel.authorName}</span>
              <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[9px] font-black">
                ✓
              </span>
            </span>
            <span className="text-[10px] text-white/60">· {activeReel.createdAt}</span>
          </div>

          {/* Title & Caption */}
          <div>
            <h3 className="text-sm font-bold text-white line-clamp-1 drop-shadow">
              {isAr ? activeReel.titleAr : (activeReel.titleEn || activeReel.titleAr)}
            </h3>
            <p className="text-xs text-white/90 line-clamp-2 mt-0.5 leading-snug drop-shadow-sm">
              {isAr ? activeReel.captionAr : (activeReel.captionEn || activeReel.captionAr)}
            </p>
          </div>

          {/* Sound / Music Track */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-1.5 text-[11px] text-white/80 hover:text-white transition-colors text-start group active:scale-95"
            title={isMuted ? (isAr ? 'اضغط لتشغيل الصوت' : 'Click to unmute') : (isAr ? 'اضغط لكتم الصوت' : 'Click to mute')}
          >
            <Music className={`w-3.5 h-3.5 ${!isMuted ? 'text-emerald-400 animate-spin' : 'text-amber-300'} shrink-0`} />
            <span className="truncate group-hover:underline">
              {activeReel.soundTitle || (isAr ? 'صوت أصلي - أسواق الشورجة' : 'Original Sound')}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-amber-200 shrink-0">
              {isMuted ? (isAr ? 'مكتوم 🔇' : 'Muted') : (isAr ? 'يعمل 🔊' : 'Playing')}
            </span>
          </button>
        </div>

        {/* Floating Unmute Hint if currently muted */}
        {isMuted && !hasVideoError && (
          <button
            onClick={toggleMute}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full text-xs font-black border border-white/30 shadow-xl flex items-center gap-2 animate-bounce transition-all active:scale-95 pointer-events-auto"
          >
            <VolumeX className="w-4 h-4" />
            <span>{isAr ? 'اضغط هنا لتشغيل الصوت 🔊' : 'Tap here for Sound 🔊'}</span>
          </button>
        )}

        {/* Share Feedback Toast */}
        {shareToast && (
          <div className="absolute top-16 bg-black/80 text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 z-30 animate-in fade-in">
            {isAr ? 'تم نسخ رابط الريل بنجاح! 📋' : 'Reel link copied! 📋'}
          </div>
        )}
      </div>
    </div>
  );
};
