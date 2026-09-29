import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { ComplaintCategory, ComplaintStatus } from '../types/market';
import { sanitizeInput, isSafeUrl } from '../utils/security';
import {
  X,
  AlertTriangle,
  Clock,
  Beef,
  PackageX,
  Bike,
  Receipt,
  Lightbulb,
  CheckCircle2,
  Phone,
  MessageCircle,
  ShieldCheck,
  Send,
  Building,
  User,
  MapPin,
  ChevronRight,
  ArrowRight,
  FileText,
  BadgeAlert,
  Headphones,
  Check,
  Sparkles
} from 'lucide-react';

interface CategoryOption {
  key: ComplaintCategory;
  labelAr: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeAr: string;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    key: 'delivery_delay',
    labelAr: 'تأخير في موعد التوصيل',
    labelEn: 'Delivery Delay',
    icon: Clock,
    color: 'bg-amber-500/10 text-amber-700 border-amber-200',
    badgeAr: 'التوصيل والوقت',
  },
  {
    key: 'item_quality',
    labelAr: 'جودة المواد أو اللحوم',
    labelEn: 'Meat / Product Quality',
    icon: Beef,
    color: 'bg-rose-500/10 text-rose-700 border-rose-200',
    badgeAr: 'الجودة والطزاجة',
  },
  {
    key: 'missing_items',
    labelAr: 'نقص أو خطأ في الأصناف المستلمة',
    labelEn: 'Missing / Wrong Items',
    icon: PackageX,
    color: 'bg-orange-500/10 text-orange-700 border-orange-200',
    badgeAr: 'مراجعة السلة',
  },
  {
    key: 'courier_issue',
    labelAr: 'مشكلة مع مندوب التوصيل',
    labelEn: 'Courier / Driver Issue',
    icon: Bike,
    color: 'bg-purple-500/10 text-purple-700 border-purple-200',
    badgeAr: 'الخدمة الميدانية',
  },
  {
    key: 'pricing_dispute',
    labelAr: 'خلاف في الفاتورة أو الحساب',
    labelEn: 'Billing / Invoice Dispute',
    icon: Receipt,
    color: 'bg-blue-500/10 text-blue-700 border-blue-200',
    badgeAr: 'الحسابات والدفع',
  },
  {
    key: 'suggestion_other',
    labelAr: 'مقترح لتطوير الخدمة أو أمر آخر',
    labelEn: 'Suggestion or Other Inquiry',
    icon: Lightbulb,
    color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    badgeAr: 'صوت الزبون',
  },
];

export const ComplaintsModal: React.FC = () => {
  const {
    isComplaintsModalOpen,
    setIsComplaintsModalOpen,
    complaints,
    addComplaint,
    updateComplaintStatus,
    selectedOrderForComplaint,
    setSelectedOrderForComplaint,
    orders,
    selectedAddress,
    currentUser,
    isAdmin,
    language,
  } = useMarket();

  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'new' | 'list' | 'hotline'>('new');

  // Form State
  const [category, setCategory] = useState<ComplaintCategory>('delivery_delay');
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [addressDistrict, setAddressDistrict] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Admin reply inline states
  const [adminReplyTexts, setAdminReplyTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isComplaintsModalOpen) {
      if (selectedOrderForComplaint) {
        setOrderNumber(selectedOrderForComplaint);
      }
      if (currentUser) {
        setCustomerName(currentUser.name);
        setCustomerPhone(currentUser.phoneOrEmail);
      }
      if (selectedAddress) {
        setAddressDistrict(isAr ? selectedAddress.districtAr : selectedAddress.districtEn);
      }
    }
  }, [isComplaintsModalOpen, selectedOrderForComplaint, currentUser, selectedAddress, isAr]);

  if (!isComplaintsModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const cleanPhoto = photoUrl.trim();
    const safePhotoUrl = cleanPhoto && isSafeUrl(cleanPhoto) ? cleanPhoto : undefined;

    const newTicket = addComplaint({
      category,
      orderNumber: sanitizeInput(orderNumber, 30) || undefined,
      customerName: sanitizeInput(customerName, 80) || (isAr ? 'زبون أسواق الشورجة' : 'Valued Customer'),
      customerPhone: sanitizeInput(customerPhone, 20) || '07701234567',
      addressDistrict: sanitizeInput(addressDistrict, 100) || (isAr ? 'بغداد - الدورة' : 'Baghdad - Dora'),
      description: sanitizeInput(description, 1000),
      photoUrl: safePhotoUrl,
    });

    setSubmittedTicket(newTicket.ticketNumber);
    setDescription('');
    setPhotoUrl('');
    setSelectedOrderForComplaint(null);
  };

  const handleClose = () => {
    setIsComplaintsModalOpen(false);
    setSubmittedTicket(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white p-5 sm:p-6 border-b border-stone-800 relative overflow-hidden shrink-0">
          <div className="absolute -top-12 -end-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -start-10 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 end-4 z-20 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold text-amber-300 mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isAr ? 'قسم الشكاوى والمقترحات وحماية المستهلك' : 'Complaints & Consumer Protection'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{isAr ? 'صوتك مسموع وحقك مضمون في الشورجة' : 'Your Voice is Heard at Shorja'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                {isAr
                  ? 'نحرص على رضاك التام. في حال حدوث أي تأخير أو ملاحظة على الجودة، نلتزم بالمعالجة والتعويض الفوري.'
                  : 'We are committed to total satisfaction. Immediate review and compensation for any delivery or quality issue.'}
              </p>
            </div>

            {/* Quick Hotline Badge */}
            <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[10px] text-stone-400 font-bold uppercase">
                  {isAr ? 'الخط الساخن المباشر' : 'Emergency Hotline'}
                </span>
                <span className="text-sm font-black text-white font-mono tracking-wider">
                  6608 <span className="text-[11px] text-emerald-400 font-sans font-bold">({isAr ? 'مجاني' : 'Free'})</span>
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 border-t border-stone-800/80 pt-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setActiveTab('new');
                setSubmittedTicket(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'new'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'تقديم شكوى أو مقترح' : 'Submit Ticket'}</span>
            </button>

            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'list'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? 'سجل الشكاوى والمتابعة' : 'Track Tickets'}</span>
              <span className="px-1.5 py-0.2 bg-stone-900 text-white text-[10px] rounded-full font-mono">
                {complaints.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hotline')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'hotline'
                  ? 'bg-amber-400 text-stone-950 shadow-sm'
                  : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>{isAr ? 'التواصل المباشر والواتساب' : 'Direct Call & WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {/* TAB 1: SUBMIT NEW COMPLAINT */}
          {activeTab === 'new' && (
            <div>
              {submittedTicket ? (
                /* Success Confirmation View */
                <div className="max-w-lg mx-auto text-center py-6 sm:py-10 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                    {isAr ? 'تم استلام شكواك بنجاح' : 'Ticket Submitted Successfully'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                    {isAr
                      ? 'تم تسجيل تذكرتك وإشعار مسؤول الجودة والإدارة. سنقوم بالتواصل معك هاتفياً أو عبر الواتساب في غضون 30 دقيقة.'
                      : 'Your complaint has been forwarded to store management. A quality representative will contact you within 30 minutes.'}
                  </p>

                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 my-6 inline-block">
                    <span className="block text-xs text-stone-500 font-semibold mb-1">
                      {isAr ? 'رقم تذكرة المتابعة:' : 'Ticket Number:'}
                    </span>
                    <span className="text-xl font-mono font-black text-emerald-800 tracking-wider">
                      {submittedTicket}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('list')}
                      className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                    >
                      {isAr ? 'عرض الشكوى في قائمة المتابعة' : 'View in Tickets List'}
                    </button>
                    <button
                      onClick={() => setSubmittedTicket(null)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs transition-all"
                    >
                      {isAr ? 'تقديم بلاغ أو استفسار آخر' : 'Submit Another Ticket'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Submission Form */
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-2">
                      {isAr ? '1. اختر نوع الشكوى أو الملاحظة:' : '1. Select Category:'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {CATEGORY_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = category === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => setCategory(opt.key)}
                            className={`p-3 rounded-2xl border text-right rtl:text-right ltr:text-left transition-all flex flex-col justify-between gap-2.5 relative group ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                                : 'bg-stone-50/80 border-stone-200 hover:bg-white hover:border-stone-300'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                                  isSelected ? 'bg-amber-500 text-stone-950 font-bold' : opt.color
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  isSelected ? 'bg-amber-200 text-amber-900' : 'bg-stone-200/70 text-stone-600'
                                }`}
                              >
                                {isAr ? opt.badgeAr : opt.labelEn}
                              </span>
                            </div>
                            <span
                              className={`text-xs font-bold leading-tight ${
                                isSelected ? 'text-stone-950' : 'text-stone-700'
                              }`}
                            >
                              {isAr ? opt.labelAr : opt.labelEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Information & Address Details */}
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-700" />
                      <span>{isAr ? '2. بيانات التواصل وموقع التوصيل' : '2. Contact & Delivery Info'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          {isAr ? 'الاسم الكريم' : 'Your Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder={isAr ? 'مثال: أبو سجاد الدليمي' : 'e.g. John Doe'}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-800"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          {isAr ? 'رقم الهاتف للتواصل المباشر' : 'Phone Number'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="0770xxxxxxx"
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:border-stone-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Delivery Address District */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{isAr ? 'منطقة التوصيل' : 'Delivery District'}</span>
                        </label>
                        <input
                          type="text"
                          value={addressDistrict}
                          onChange={(e) => setAddressDistrict(e.target.value)}
                          placeholder={isAr ? 'بغداد - الدورة - المهدية الأولى' : 'Baghdad - Dora'}
                          className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-medium focus:outline-none focus:border-stone-800"
                        />
                      </div>

                      {/* Order Number (Optional) */}
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          {isAr ? 'رقم الطلب ذو الصلة (اختياري)' : 'Related Order # (Optional)'}
                        </label>
                        {orders.length > 0 ? (
                          <div className="flex gap-2">
                            <select
                              value={orderNumber}
                              onChange={(e) => setOrderNumber(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-800 font-mono"
                            >
                              <option value="">{isAr ? '-- اختر من طلباتك السابقة --' : '-- Choose recent order --'}</option>
                              {orders.map((ord) => (
                                <option key={ord.id} value={ord.orderNumber}>
                                  {ord.orderNumber} ({isAr ? ord.createdAt : 'Recent'})
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder={isAr ? 'مثال: #SQ-8941' : 'e.g. #SQ-8941'}
                            className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:border-stone-800"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Complaint Description */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold text-stone-800">
                        {isAr ? '3. وضح تفاصيل المشكلة أو المقترح بالتفصيل:' : '3. Complaint Details:'}
                      </label>
                      <span className="text-[11px] text-stone-400">
                        {isAr ? 'نضمن لك الرد العاجل' : 'Guaranteed rapid review'}
                      </span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        isAr
                          ? 'يرجى كتابة ما حدث بدقة (مثال: تأخر الطلب 30 دقيقة عن الموعد، أو تم استلام صنف ناقص من لحم العجل، أو مقترح لإضافة علامات تجارية جديدة)...'
                          : 'Describe clearly what happened so our team can resolve it immediately...'
                      }
                      className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-stone-800 focus:bg-white transition-all leading-relaxed"
                    />
                  </div>

                  {/* Attach Photo URL (Optional Mockup) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isAr ? 'رابط صورة للمنتج أو الفاتورة إن وجد (اختياري)' : 'Photo URL proof (Optional)'}
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or paste image link"
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-stone-800"
                    />
                  </div>

                  {/* Submit Button & Customer Guarantee Notice */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'إرسال الشكوى رسمياً للإدارة' : 'Submit Ticket to Management'}</span>
                    </button>

                    <div className="flex items-center justify-center gap-2 text-center text-[11px] text-stone-500 mt-3">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        {isAr
                          ? 'ضمان الشورجة: في حال ثبوت أي تلف أو نقص يتم إعادة إرسال المادة مجاناً أو استرداد المبلغ فوراً.'
                          : 'Shorja Guarantee: Any verified defect or delay guarantees immediate free replacement or refund.'}
                      </span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: TRACK PREVIOUS COMPLAINTS */}
          {activeTab === 'list' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    {isAr ? 'سجل الشكاوى والمقترحات المفتوحة' : 'Complaints History'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {isAr
                      ? 'يمكنك متابعة حالة تذاكرك هنا ومطالعة ردود الإدارة المباشرة'
                      : 'Track the status and management responses for your tickets'}
                  </p>
                </div>

                {isAdmin && (
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 self-start">
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    <span>{isAr ? 'وضع الإدارة: يمكنك تغيير الحالة والرد' : 'Admin Mode: Update & Reply'}</span>
                  </span>
                )}
              </div>

              {complaints.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <FileText className="w-12 h-12 stroke-[1.2] mx-auto mb-2 text-stone-300" />
                  <p className="text-sm font-bold text-stone-700">
                    {isAr ? 'لا توجد شكاوى مسجلة حالياً' : 'No complaints recorded'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    {isAr ? 'إذا واجهتك أي مشكلة، لا تتردد في فتح تذكرة جديدة.' : 'Feel free to submit a ticket anytime.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {complaints.map((item) => {
                    const statusConfig = {
                      pending: {
                        labelAr: 'قيد الانتظار والمراجعة',
                        labelEn: 'Pending Review',
                        badge: 'bg-amber-100 text-amber-900 border-amber-200',
                      },
                      in_review: {
                        labelAr: 'جارٍ المتابعة مع المندوب / الإدارة',
                        labelEn: 'In Review',
                        badge: 'bg-blue-100 text-blue-900 border-blue-200',
                      },
                      resolved: {
                        labelAr: 'تم الحل وإرضاء الزبون ✅',
                        labelEn: 'Resolved & Closed',
                        badge: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                      },
                    }[item.status];

                    const catOption = CATEGORY_OPTIONS.find((c) => c.key === item.category);

                    return (
                      <div
                        key={item.id}
                        className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3 transition-all hover:bg-stone-50/90"
                      >
                        {/* Header line */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-xs font-mono font-bold">
                              {item.ticketNumber}
                            </span>
                            <span className="text-xs text-stone-500 font-medium">{item.createdAt}</span>
                            {item.orderNumber && (
                              <span className="text-xs text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded font-mono">
                                {item.orderNumber}
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full border ${statusConfig.badge}`}
                          >
                            {isAr ? statusConfig.labelAr : statusConfig.labelEn}
                          </span>
                        </div>

                        {/* Customer & Location */}
                        <div className="text-xs text-stone-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="font-bold text-stone-900">{item.customerName}</span>
                          <span className="font-mono">{item.customerPhone}</span>
                          <span className="text-stone-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-600" />
                            {item.addressDistrict}
                          </span>
                        </div>

                        {/* Category & Description */}
                        <div>
                          <div className="inline-block text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded mb-1 border border-amber-200/60">
                            {isAr ? catOption?.labelAr : catOption?.labelEn}
                          </div>
                          <p className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/80">
                            {item.description}
                          </p>
                        </div>

                        {/* Admin Official Response */}
                        {item.adminResponse ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                              <span>{isAr ? 'رد إدارة أسواق الشورجة:' : 'Management Official Response:'}</span>
                            </div>
                            <p className="text-emerald-800 leading-relaxed ps-5">
                              {item.adminResponse}
                            </p>
                          </div>
                        ) : (
                          <div className="text-[11px] text-stone-400 italic">
                            {isAr ? '⏳ بانتظار رد وتوجيه مسؤول قسم الجودة...' : '⏳ Waiting for management response...'}
                          </div>
                        )}

                        {/* Admin Action Bar (Only visible if logged in as Admin) */}
                        {isAdmin && (
                          <div className="mt-3 pt-3 border-t border-stone-200 flex flex-col gap-2">
                            <span className="text-[11px] font-bold text-stone-700">
                              {isAr ? 'إجراء الإدارة:' : 'Admin Action:'}
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() => updateComplaintStatus(item.id, 'in_review')}
                                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-lg text-xs font-bold transition-colors"
                              >
                                {isAr ? 'تحويل إلى قيد المتابعة' : 'Set to In Review'}
                              </button>
                              <button
                                onClick={() => updateComplaintStatus(item.id, 'resolved')}
                                className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-xs font-bold transition-colors"
                              >
                                {isAr ? 'وضع علامة تم الحل ✅' : 'Mark as Resolved'}
                              </button>
                            </div>

                            {/* Custom reply field */}
                            <div className="flex gap-2 mt-1">
                              <input
                                type="text"
                                placeholder={isAr ? 'اكتب رد الإدارة أو تفاصيل التعويض هنا...' : 'Type admin resolution notes...'}
                                value={adminReplyTexts[item.id] || ''}
                                onChange={(e) =>
                                  setAdminReplyTexts({ ...adminReplyTexts, [item.id]: e.target.value })
                                }
                                className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-stone-800"
                              />
                              <button
                                onClick={() => {
                                  if (adminReplyTexts[item.id]?.trim()) {
                                    updateComplaintStatus(item.id, item.status, adminReplyTexts[item.id].trim());
                                    setAdminReplyTexts({ ...adminReplyTexts, [item.id]: '' });
                                  }
                                }}
                                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors"
                              >
                                {isAr ? 'حفظ الرد' : 'Save Reply'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIRECT HOTLINE & WHATSAPP */}
          {activeTab === 'hotline' && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-3">
                  <Headphones className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  {isAr ? 'قنوات الاتصال المباشر والشكاوى الفورية' : 'Immediate Contact Channels'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto">
                  {isAr
                    ? 'فريق خدمة زبائن أسواق الشورجة جاهز لاستقبال اتصالاتكم ورسائلكم طيلة أيام الأسبوع من 7:00 صباحاً حتى 11:30 مساءً'
                    : 'Customer care is active 7 days a week from 7:00 AM to 11:30 PM'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Free Hotline */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-1">
                      <Phone className="w-4 h-4 text-emerald-700" />
                      <span>{isAr ? 'الرقم المجاني الموحد' : 'Unified Free Hotline'}</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">
                      {isAr ? 'لجميع شبكات زين العراق، آسيا سيل وكورك مجاناً' : 'Free across Zain, Asiacell, Korek'}
                    </p>
                    <span className="text-2xl font-black font-mono text-stone-900 tracking-wider">
                      6608
                    </span>
                  </div>
                  <a
                    href="tel:6608"
                    className="mt-4 w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-400 rounded-xl text-center font-bold text-xs shadow-sm transition-all"
                  >
                    {isAr ? '📞 اتصال هاتفي الآن' : 'Call Now'}
                  </a>
                </div>

                {/* WhatsApp Direct Care */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-1">
                      <MessageCircle className="w-4 h-4 text-emerald-700" />
                      <span>{isAr ? 'واتساب شكاوى الإدارة' : 'Direct WhatsApp'}</span>
                    </div>
                    <p className="text-xs text-stone-600 mb-3">
                      {isAr ? 'لإرسال صور الفواتير، مقاطع الفيديو والموقع المباشر' : 'Send invoice photos, videos and live location'}
                    </p>
                    <span className="text-base sm:text-lg font-black font-mono text-emerald-900">
                      +964 770 123 4567
                    </span>
                  </div>
                  <a
                    href="https://wa.me/9647701234567"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isAr ? 'فتح محادثة واتساب فورية' : 'Open WhatsApp'}</span>
                  </a>
                </div>
              </div>

              {/* Physical Branch & Warehouse */}
              <div className="bg-stone-100/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-stone-600 border border-stone-200">
                <Building className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block mb-0.5">
                    {isAr ? 'المقر الرئيسي ومستودعات التوزيع المركزي:' : 'Main Office & Distribution Hub:'}
                  </span>
                  <span>
                    {isAr
                      ? 'بغداد - شارع الرشيد، قرب سوق الشورجة التراثي، مجمع الشورجة المركزي للمؤونة واللحوم الطازجة.'
                      : 'Baghdad - Al-Rasheed St, near Heritage Shorja Market, Shorja Central Hub.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500 shrink-0">
          {isAr
            ? '💡 نحفظ جميع الشكاوى لضمان حقك وتطوير خدمات التوصيل وجودة اللحوم في بغداد والمحافظات.'
            : '💡 Every complaint is archived to ensure your full consumer rights and service excellence.'}
        </div>
      </div>
    </div>
  );
};
