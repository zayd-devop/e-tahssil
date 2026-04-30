import React, { useState } from 'react';
import { Save, User, Briefcase, CreditCard, Scale, LayoutList, Search, Loader2, AlertCircle} from 'lucide-react';

export function RecouvrementForm() {
  const isRTL = true;
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    extraitNum: '',
    extraitDate: '',
    jugementNum: '',
    jugementDate: '',
    condamneNom: '',
    typeAmende: false,
    typeFrais: false,
    montantAmende: '',
    montantFrais: '',
    agent: '',
    action: '',
    actionDate: '',
    recuNum: '',
    paiementDate: '',
    montantPaye: ''
  });
  const successMsg = 'تم حفظ الإجراء بنجاح';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'jugementNum') {
      setSearchResult(null);
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSearch = () => {
    if (!formData.jugementNum.trim()) return;
    
    setIsSearching(true);
    setSearchResult(null);
    
    // Simulation de recherche API
    setTimeout(() => {
      setIsSearching(false);
      if (formData.jugementNum.includes('404')) {
        setSearchResult('not_found');
      } else {
        setSearchResult('found');
      }
    }, 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(successMsg);
  };

  const montantTotal = (parseFloat(formData.montantAmende) || 0) + (parseFloat(formData.montantFrais) || 0);

  const inputClassName = "w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-gray-50 transition-all outline-none text-[#003366] placeholder-gray-500";
  const labelClassName = "block text-sm font-bold text-[#003366] mb-2";

  return (
    <div className="bg-gray-50/50 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
          <div className="w-16 h-16 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
            <LayoutList className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">إدخال إجراءات التحصيل</h1>
            <p className="text-gray-500 mt-1 font-medium">سجل إجراءات التحصيل الرقمي</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Références Légales */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <Scale className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">المراجع القانونية</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>رقم المستخرج</label>
                <input type="text" name="extraitNum" value={formData.extraitNum} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>تاريخ المستخرج</label>
                <input type="date" name="extraitDate" value={formData.extraitDate} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>رقم الملف</label>
                <div className="flex gap-2">
                <input type="text" name="jugementNum" value={formData.jugementNum} onChange={handleChange} className={inputClassName} required />
                <button 
                    type="button" 
                    onClick={handleSearch} 
                    disabled={isSearching || !formData.jugementNum}
                    title = "بحث"
                    className="px-4 py-2 bg-[#D4AF37] text-[#003366] rounded-lg hover:bg-[#C5A028] disabled:opacity-50 transition-colors flex items-center justify-center font-bold"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
              </div>
              {searchResult === 'not_found' && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    لم يتم العثور على المقرر القضائي بهذا الرقم
                  </p>
                )}
              <p className="text-xs text-gray-500 mt-1">أدخل رقم الملف </p>
              </div>
              <div>
                <label className={labelClassName}>تاريخ الملف</label>
                <input type="date" name="jugementDate" value={formData.jugementDate} onChange={handleChange} className={inputClassName} required />
              </div>
            </div>
          </div>
          {searchResult === 'found' && (
            <>
          {/* Card 2: Débiteur & Montants */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <User className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">المدين والمبالغ المحكوم بها</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClassName}>اسم المحكوم عليه </label>
                  <input type="text" name="condamneNom" value={formData.condamneNom} onChange={handleChange} className={inputClassName} required />
                </div>
                <div>
                  <label className={labelClassName}>نوع الدين</label>
                  <div className="flex items-center gap-6 h-[50px] px-4 rounded-lg border border-gray-300 bg-gray-50">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="typeAmende" checked={formData.typeAmende} onChange={handleChange} className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]" />
                      <span className="text-sm font-semibold text-gray-700">غرامة</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="typeFrais" checked={formData.typeFrais} onChange={handleChange} className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]" />
                      <span className="text-sm font-semibold text-gray-700">صوائر قضائية</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className={labelClassName}>مبلغ الغرامة</label>
                  <div className="relative">
                    <input type="number" step="0.01" min="0" name="montantAmende" value={formData.montantAmende} onChange={handleChange} className={`${inputClassName} font-mono pl-16`} disabled={!formData.typeAmende} />
                    <span className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 font-bold bg-gray-200/50 px-2 py-1 rounded text-xs">MAD</span>
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>مبلغ الصوائر</label>
                  <div className="relative">
                    <input type="number" step="0.01" min="0" name="montantFrais" value={formData.montantFrais} onChange={handleChange} className={`${inputClassName} font-mono pl-16`} disabled={!formData.typeFrais} />
                    <span className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 font-bold bg-gray-200/50 px-2 py-1 rounded text-xs">MAD</span>
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>المجموع الاجمالي  </label>
                  <div className="relative">
                    <div className="w-full p-3.5 text-lg font-mono font-bold text-[#003366] bg-[#D4AF37]/10 border-2 border-[#D4AF37] rounded-lg shadow-inner flex items-center justify-end pl-16">
                      {montantTotal.toFixed(2)}
                    </div>
                    <span className="absolute top-1/2 -translate-y-1/2 left-4 text-[#003366] font-bold bg-[#D4AF37]/30 px-2 py-1 rounded text-xs">MAD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Assignation & Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">الإجراءات المتخذة</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClassName}>المكلف بالتحصيل</label>
                <select name="agent" value={formData.agent} onChange={handleChange} className={inputClassName} required>
                  <option value="">--- اختر المكلف ---</option>
                  <option value="Saida El Atfi">سعيدة العاطفي</option>
                  <option value="Mohamed bennour">محمد بنور</option>
                  <option value="Adnane chakour">عدنان شقور</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>الإجراء المتخذ</label>
                <select name="action" value={formData.action} onChange={handleChange} className={inputClassName} required>
                  <option value="">--- اختر الإجراء ---</option>
                  <option value="Notification sans frais">الإشعار بدون صائر</option>
                  <option value="Mise en demeure">تجزئة الأداء</option>
                  <option value="Saisie exécutoire">المقاصة من الكفالة</option>
                  <option value="alert">الإنذار</option>
                  <option value="Saisie exécutoire">الحجز</option>
                  <option value="vente aux enchères">البيع بالمزاد العلني</option>
                  <option value="Forcer corporel">الإكراه البدني</option>
                  <option value="consultation compte">حق الاطلاع</option>
                  <option value="">إشعار الغير الحائز</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>تاريخ الإجراء</label>
                <input type="date" name="actionDate" value={formData.actionDate} onChange={handleChange} className={inputClassName} required />
              </div>
            </div>
          </div>

          {/* Card 4: Paiement & Issue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">الأداء</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClassName}>رقم وصل الأداء</label>
                <input type="text" name="recuNum" value={formData.recuNum} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>تاريخ الأداء</label>
                <input type="date" name="paiementDate" value={formData.paiementDate} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>المبلغ المؤدى</label>
                <div className="relative">
                  <input type="number" step="0.01" min="0" name="montantPaye" value={formData.montantPaye} onChange={handleChange} className={`${inputClassName} font-mono pl-16`} />
                  <span className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400 font-bold bg-gray-200/50 px-2 py-1 rounded text-xs">MAD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-3 px-8 py-4 bg-[#003366] text-white rounded-xl text-lg font-bold hover:bg-[#002244] focus:ring-4 focus:ring-[#003366]/30 transition-all shadow-lg hover:shadow-xl"
            >
              <Save className="w-6 h-6" />
              <span>حفظ الإجراء</span>
            </button>
          </div>
          </>
          )}
        </form>
      </div>
    </div>
  );
}