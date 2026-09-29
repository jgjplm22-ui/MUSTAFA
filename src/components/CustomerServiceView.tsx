import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Headphones
} from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { ComplaintCategory, ComplaintStatus } from '../types/market';

export const CustomerServiceView: React.FC = () => {
  const { 
    language, 
    orders, 
    complaints, 
    addComplaint, 
    selectedAddress,
    currentUser,
    setIsChatOpen 
  } = useMarket();

  const isAr = language === 'ar';

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phoneOrEmail || '');
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(orders.length > 0 ? orders[0].orderNumber : '');
  const [category, setCategory] = useState<ComplaintCategory>('item_quality');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newTicketNumber, setNewTicketNumber] = useState('');

  const categories: { key: ComplaintCategory; labelAr: string; labelEn: string }[] = [
    { key: 'item_quality', labelAr: 'جودة اللحوم أو المواد الغذائية', labelEn: 'Product/Meat Quality' },
    { key: 'delivery_delay', labelAr: 'تأخير في موعد التوصيل', labelEn: 'Delivery Delay' },
    { key: 'missing_items', labelAr: 'نقص أو خطأ في الأصناف المستلمة', labelEn: 'Missing / Wrong Items' },
    { key: 'pricing_dispute', labelAr: 'استفسار أو خطأ في الفاتورة والأسعار', labelEn: 'Billing / Pricing Question' },
    { key: 'courier_issue', labelAr: 'ملاحظة تخص مندوب التوصيل', labelEn: 'Courier Note' },
    { key: 'suggestion_other', labelAr: 'مقترح لتطوير خدمات أسواق الشورجة', labelEn: 'Suggestion or Feedback' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !description) return;

    const result = addComplaint({
      orderNumber: selectedOrderNumber || undefined,
      category,
      customerName,
      customerPhone,
      addressDistrict: selectedAddress.districtAr || 'بغداد',
      description,
    });

    setNewTicketNumber(result.ticketNumber || result.id);
    setIsSubmitted(true);
    setDescription('');
  };

  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-stone-800 shadow-xl">
        <div className="absolute top-0 end-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'قسم حماية المستهلك وضمان رضا الزبون' : 'Consumer Protection & Quality Assurance'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            {isAr ? 'مركز خدمة العملاء والشكاوى والمقترحات' : 'Customer Service & Complaints Center'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            {isAr
              ? 'صوتك مسموع مباشرة لدى إدارة أسواق الشورجة. نلتزم بالرد والحل الفوري خلال 30 دقيقة على أي ملاحظة تخص الطزاجة، التوصيل، أو الفواتير.'
              : 'Direct communication with Shorja Markets management. Guaranteed resolution within 30 minutes.'}
          </p>
        </div>
      </div>

      {/* Grid: Form Left, Hotlines & Status Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Submission Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-2xs">
          <h2 className="text-base sm:text-lg font-black text-stone-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>{isAr ? 'تقديم بلاغ أو استفسار رسمي' : 'Submit an Official Inquiry / Complaint'}</span>
          </h2>

          {isSubmitted ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-emerald-950">
                {isAr ? 'تم استلام بلاغك بنجاح' : 'Inquiry Received Successfully'}
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                {isAr
                  ? `تم تسجيل بلاغك برقم مرجعي (${newTicketNumber}). سيتواصل معك مسؤول حماية المستهلك على رقمك خلال دقائق لمعالجة الأمر فوراً.`
                  : `Your report has been logged with reference ID (${newTicketNumber}). Our support officer will call you shortly.`}
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {isAr ? 'تقديم بلاغ آخر' : 'Submit Another'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isAr ? 'نوع الشكوى أو الملاحظة:' : 'Inquiry Category:'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full text-xs sm:text-sm p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800 font-bold cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {isAr ? c.labelAr : c.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order selector (optional) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isAr ? 'رقم الطلب المرتبط (إن وجد):' : 'Linked Order Reference (optional):'}
                </label>
                <select
                  value={selectedOrderNumber}
                  onChange={(e) => setSelectedOrderNumber(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800 font-mono cursor-pointer"
                >
                  <option value="">{isAr ? '-- غير مرتبطة بطلب محدد --' : '-- General Inquiry --'}</option>
                  {orders.map((ord) => (
                    <option key={ord.id} value={ord.orderNumber}>
                      {ord.orderNumber} ({ord.createdAt})
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isAr ? 'الاسم الكامل:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={isAr ? 'مثال: أبو فهد' : 'Your Name'}
                    className="w-full text-xs sm:text-sm p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isAr ? 'رقم الهاتف للتواصل الفوري:' : 'Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0770xxxxxxx"
                    className="w-full text-xs sm:text-sm p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {isAr ? 'تفاصيل الملاحظة أو الشكوى:' : 'Description of the Issue:'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isAr
                      ? 'يرجى كتابة تفاصيل ما حدث بدقة لنتمكن من تعويضك وحل المسألة فوراً...'
                      : 'Please describe the issue in detail...'
                  }
                  className="w-full text-xs sm:text-sm p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-800 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? 'إرسال الشكوى لقسم الجودة' : 'Submit to Quality Assurance'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Support Channels & Live Complaints Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Contact Box */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 border border-stone-800 space-y-4">
            <h3 className="text-sm font-black text-amber-400">
              {isAr ? 'قنوات الاتصال المباشرة للإدارة' : 'Direct Management Channels'}
            </h3>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">{isAr ? 'الخط الساخن المباشر:' : 'Hotline:'}</span>
                  <a href="tel:07779648839" className="font-mono font-bold text-white hover:text-amber-400 transition-colors text-sm" dir="ltr">07779648839</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">{isAr ? 'البريد الإلكتروني للشكاوى:' : 'Complaints Email:'}</span>
                  <span className="font-mono text-white text-xs">complaints@shorja-markets.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">{isAr ? 'أوقات الاستجابة الفورية:' : 'Working Hours:'}</span>
                  <span className="text-white text-xs">{isAr ? 'يومياً من 7:00 صباحاً حتى منتصف الليل' : 'Daily 7 AM - Midnight'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Headphones className="w-4 h-4" />
                <span>{isAr ? 'بدء محادثة مباشرة مع خدمة الزبائن' : 'Start Live Support Chat'}</span>
              </button>
            </div>
          </div>

          {/* Past Complaints History */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs">
            <h3 className="text-xs font-black text-stone-900 mb-3 flex items-center justify-between">
              <span>{isAr ? 'سجل البلاغات المسجلة:' : 'Recorded Complaints Log:'}</span>
              <span className="text-[11px] text-stone-400 font-mono">({complaints.length})</span>
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {complaints.map((comp) => (
                <div key={comp.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-800">{comp.ticketNumber || comp.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      comp.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : comp.status === 'in_review'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-800'
                    }`}>
                      {comp.status === 'resolved'
                        ? isAr ? 'تم الحل' : 'Resolved'
                        : comp.status === 'in_review'
                        ? isAr ? 'قيد المتابعة' : 'Under Review'
                        : isAr ? 'جديد' : 'New'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">{comp.description}</p>
                  <span className="text-[10px] text-stone-400 block font-mono">{comp.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
