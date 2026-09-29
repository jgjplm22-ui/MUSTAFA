import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useMarket } from '../context/MarketContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useMarket();
  const isAr = language === 'ar';

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-2xl bg-stone-900/95 border border-amber-500/40 px-3.5 py-2 text-xs font-bold text-amber-300 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-4 h-4 text-amber-400" />
      <span>
        {isAr 
          ? 'وضع عدم الاتصال — يتم استخدام بيانات التطبيق المخزنة محلياً (Offline)' 
          : 'Offline mode — Serving cached product data.'}
      </span>
    </div>
  );
};
