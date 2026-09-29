import React, { useState } from 'react';
import { X, MapPin, Check, Plus, Building2, Home, Briefcase } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { DeliveryAddress } from '../types/market';

export const AddressModal: React.FC = () => {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    language,
  } = useMarket();

  const isAr = language === 'ar';
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [labelAr, setLabelAr] = useState('');
  const [districtAr, setDistrictAr] = useState('');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');

  if (!isAddressModalOpen) return null;

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelAr || !districtAr || !street) return;

    const districtFullAr = districtAr.includes('بغداد') ? districtAr : `بغداد - ${districtAr}`;
    const districtFullEn = districtAr.includes('Baghdad') ? districtAr : `Baghdad - ${districtAr}`;

    addAddress({
      labelAr,
      labelEn: labelAr,
      districtAr: districtFullAr,
      districtEn: districtFullEn,
      street,
      notes,
      isDefault: false,
    });

    setIsAddingNew(false);
    setLabelAr('');
    setDistrictAr('');
    setStreet('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {isAr ? 'عناوين التوصيل' : 'Delivery Addresses'}
            </h2>
          </div>
          <button
            onClick={() => setIsAddressModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!isAddingNew ? (
            <>
              <div className="space-y-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress.id === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setIsAddressModalOpen(false);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/60 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          <Home className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-stone-900 flex items-center gap-2">
                            <span>{isAr ? addr.labelAr : addr.labelEn}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded">
                                {isAr ? 'الافتراضي' : 'Default'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-600 mt-0.5">
                            {isAr ? addr.districtAr : addr.districtEn} - {addr.street}
                          </div>
                          {addr.notes && (
                            <div className="text-[11px] text-emerald-800 mt-1 italic">
                              "{addr.notes}"
                            </div>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full py-3 border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-2xl text-xs font-semibold text-stone-700 hover:text-emerald-700 flex items-center justify-center gap-2 transition-colors mt-4"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة عنوان توصيل جديد' : 'Add New Address'}</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleSaveNewAddress} className="space-y-4">
              <h3 className="font-bold text-sm text-stone-900">
                {isAr ? 'بيانات العنوان الجديد' : 'New Address Details'}
              </h3>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isAr ? 'اسم العنوان (مثال: شقة الأصدقاء، الاستراحة)' : 'Address Label (e.g. Friends Apt)'}
                </label>
                <input
                  type="text"
                  required
                  value={labelAr}
                  onChange={(e) => setLabelAr(e.target.value)}
                  placeholder={isAr ? 'المنزل 2، العمل، المزرعة...' : 'Home 2, Studio...'}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isAr ? 'الحي' : 'District'}
                </label>
                <input
                  type="text"
                  required
                  value={districtAr}
                  onChange={(e) => setDistrictAr(e.target.value)}
                  placeholder={isAr ? 'الدورة - المهدية الأولى، الكرادة، المنصور...' : 'Dora, Karrada, Mansour...'}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isAr ? 'الشارع ورقم المبنى' : 'Street & Building'}
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder={isAr ? 'الشارع العام، قرب جامع المهدية، زقاق 12' : 'Main Street, near Al-Mahdiya, Alley 12'}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  {isAr ? 'ملاحظات إضافية للمندوب (اختياري)' : 'Courier Notes'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'بجوار المسجد، الدور الثاني' : 'Next to landmark, 2nd floor'}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  {isAr ? 'حفظ واختيار العنوان' : 'Save & Select'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
