import React, { useState } from 'react';
import { Smartphone, Download, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useMarket } from '../context/MarketContext';
import { AndroidApkModal } from './AndroidApkModal';

export const PWAInstallButton: React.FC<{
  variant?: 'compact' | 'prominent' | 'mobile-bar';
  className?: string;
}> = ({ variant = 'compact', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useMarket();
  const isAr = language === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already installed and running standalone, suppress
  if (isInstalled) {
    return null;
  }

  // Variant: Prominent banner or button
  if (variant === 'prominent') {
    return (
      <>
        <button
          onClick={() => {
            if (isInstallable) {
              install();
            } else {
              setIsModalOpen(true);
            }
          }}
          className={`flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer ${className}`}
          title={isAr ? 'تثبيت تطبيق أندرويد (APK / PWA)' : 'Install Android App (APK)'}
        >
          <Smartphone className="w-4 h-4 text-emerald-200" />
          <span>{isAr ? 'تطبيق APK' : 'APK App'}</span>
        </button>

        <AndroidApkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Mobile Top / Nav button
  if (variant === 'mobile-bar') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-2xs font-bold flex items-center justify-center cursor-pointer ${className}`}
          title={isAr ? 'تثبيت تطبيق أندرويد APK' : 'Install Android APK'}
          aria-label="Install Android APK"
        >
          <Smartphone className="w-4 h-4 text-white" />
        </button>

        <AndroidApkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Default compact button for header / navigation bar
  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`px-3 py-2 bg-emerald-700/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs transition-all active:scale-95 cursor-pointer border border-emerald-500/30 ${className}`}
        title={isAr ? 'تطبيق أندرويد APK للتثبيت على الهاتف' : 'Android APK App Install'}
      >
        <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
        <span>{isAr ? 'تطبيق APK' : 'APK App'}</span>
      </button>

      <AndroidApkModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
