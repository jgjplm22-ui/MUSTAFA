import React, { useState, useRef, useEffect } from 'react';
import { 
  Headphones, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ShoppingBag, 
  Eye, 
  HelpCircle,
  Truck,
  CheckCircle2,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ProductIllustration } from './ProductIllustrations';

export const SupportChatbot: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    isChatLoading,
    sendChatMessage,
    clearChatHistory,
    language,
    products,
    addToCart,
    setQuickViewProduct,
    formatPrice,
    setIsCartOpen,
  } = useMarket();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAr = language === 'ar';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isChatLoading) return;
    sendChatMessage(text);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button on Desktop & Mobile */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 end-4 sm:bottom-6 sm:start-6 sm:end-auto z-40 group flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white p-2.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border border-stone-750 cursor-pointer"
          aria-label="Open Customer Support Chat"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
              <Headphones className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -end-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-stone-900 animate-pulse" />
          </div>
          <div className="hidden sm:flex flex-col text-start pe-1">
            <span className="text-xs font-bold leading-tight text-white">
              {isAr ? 'خدمة زبائن الشورجة' : 'Shorja Customer Support'}
            </span>
            <span className="text-[10px] text-amber-400 font-medium">
              {isAr ? 'محادثة فورية مباشرة' : 'Live Chat Support'}
            </span>
          </div>
        </button>
      )}

      {/* Slide-in Chat Drawer / Window with Fullscreen / Native Mobile Fit */}
      {isChatOpen && (
        <div className="fixed inset-0 sm:inset-y-auto sm:start-6 sm:bottom-6 z-50 w-full sm:w-[420px] h-[100dvh] sm:h-[600px] bg-white sm:rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-sm">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 end-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-stone-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">
                    {isAr ? 'خدمة زبائن أسواق الشورجة' : 'Shorja Customer Care'}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-700">
                    {isAr ? 'متصل الآن' : 'Online'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  {isAr ? 'فريق الدعم الفوري جاهز لمساعدتك في أي وقت' : 'Our team is here to assist you'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChatHistory}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                title={isAr ? 'مسح المحادثة والبدء من جديد' : 'Clear conversation'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
            {chatMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              // Find matching products if any
              const recommendedItems = (msg.recommendedProductIds || [])
                .map((id) => products.find((p) => p.id === id))
                .filter(Boolean);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-end gap-2 max-w-[88%]">
                    {isAssistant && (
                      <div className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mb-1 text-xs">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                        isAssistant
                          ? 'bg-white text-stone-800 border border-stone-200/80 rounded-es-xs'
                          : 'bg-stone-900 text-white rounded-ee-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>

                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>

                  {/* Action Suggestions (chips) */}
                  {msg.actionSuggestions && msg.actionSuggestions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-full">
                      {msg.actionSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(suggestion)}
                          className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 hover:border-emerald-300 rounded-xl px-2.5 py-1.5 transition-colors text-start shadow-2xs"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recommended Products Showcase Cards inside Chat */}
                  {recommendedItems.length > 0 && (
                    <div className="mt-3 w-full space-y-2">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{isAr ? 'منتجات مقترحة لك:' : 'Suggested for you:'}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {recommendedItems.map((prod) => (
                          <div
                            key={prod!.id}
                            className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-3 hover:border-emerald-600/40 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-12 h-12 bg-stone-50 rounded-lg p-1 shrink-0 flex items-center justify-center border border-stone-100 overflow-hidden">
                                <ProductIllustration 
                                  iconType={prod!.iconType} 
                                  imageUrl={prod!.imageUrl} 
                                  alt={isAr ? prod!.nameAr : prod!.nameEn} 
                                  className="w-full h-full object-contain" 
                                />
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-bold text-xs text-stone-900 truncate">
                                  {isAr ? prod!.nameAr : prod!.nameEn}
                                </h5>
                                <div className="text-xs font-bold text-emerald-800 tabular-nums">
                                  {formatPrice(prod!.price)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setQuickViewProduct(prod!)}
                                className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                                title={isAr ? 'معاينة' : 'Quick view'}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  addToCart(prod!, 1);
                                  setIsCartOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              >
                                <ShoppingBag className="w-3 h-3" />
                                <span>{isAr ? 'شراء' : 'Add'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isChatLoading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mb-1">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-es-xs border border-stone-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Support Prompts Bar */}
          <div className="px-4 py-2 bg-stone-100 border-t border-stone-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <button
              onClick={() => handleSend(isAr ? 'عندي مشكلة في طلبي وأريد المساعدة' : 'I have an issue with my order')}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 font-medium transition-colors"
            >
              {isAr ? '🚨 حل مشكلة طلب' : '🚨 Issue with Order'}
            </button>
            <button
              onClick={() => handleSend(isAr ? 'ما هي عروض الشورجة اليوم؟' : 'What are today’s deals?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 font-medium transition-colors"
            >
              {isAr ? '🏷️ عروض اليوم' : '🏷️ Today Deals'}
            </button>
            <button
              onClick={() => handleSend(isAr ? 'كيف يعمل الضمان والاسترجاع؟' : 'How does warranty work?')}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white hover:bg-stone-200 text-stone-700 border border-stone-200 font-medium transition-colors"
            >
              {isAr ? '🛡️ الضمان والاسترجاع' : '🛡️ Warranty'}
            </button>
          </div>

          {/* Message Input Form */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isAr
                  ? 'اكتب سؤالك أو استفسارك هنا...'
                  : 'Ask about products, orders, or assistance...'
              }
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-stone-100 hover:bg-stone-100/80 focus:bg-white text-stone-800 placeholder-stone-400 rounded-xl border border-transparent focus:border-emerald-600 focus:outline-none transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isChatLoading}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
