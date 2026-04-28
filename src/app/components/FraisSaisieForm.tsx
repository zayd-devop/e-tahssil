import React, { useState } from 'react';
import { Save, FolderOpen, User, Calculator, Receipt, LayoutList } from 'lucide-react';

interface FraisSaisieFormProps {}

export function FraisSaisieForm({}: FraisSaisieFormProps = {}) {
  const language = 'ar';
  const isRTL = true;

  const [formData, setFormData] = useState({
    ordreNum: '',
    dossierNum: '',
    jugementDate: '',
    contrevenantNom: '',
    typeInfraction: '',
    montantAmende: '',
    montantFrais: '',
    recuNum: '',
    recuDate: ''
  });

  const translations = {
    ar: {
      pageTitle: 'إدخال الصوائر والغرامات',
      pageSubtitle: 'السجل المالي الرقمي لتصفية الصوائر',
      
      card1Title: 'مراجع الملف',
      ordreNum: 'الرقم الترتيبي',
      dossierNum: 'رقم الملف',
      jugementDate: 'تاريخ الحكم',
      
      card2Title: 'معلومات المعني بالأمر',
      contrevenantNom: 'اسم المعني بالأمر',
      typeInfraction: 'نوع المخالفة',
      selectInfraction: '--- اختر نوع المخالفة ---',
      infractionList: ['رادار ثابت', 'جنحة سير', 'مخالفة سير عادية', 'أخرى'],
      
      card3Title: 'التفاصيل المالية',
      montantAmende: 'مبلغ الغرامة (درهم)',
      montantFrais: 'الصوائر (درهم)',
      total: 'المجموع الإجمالي (درهم)',
      
      card4Title: 'بيانات الوصل',
      recuNum: 'رقم الوصل',
      recuDate: 'تاريخ الوصل',
      
      saveBtn: 'حفظ العملية',
      successMsg: 'تم حفظ العملية بنجاح'
    },
    fr: {
      pageTitle: 'Saisie des Frais et Amendes',
      pageSubtitle: 'Registre financier digital de liquidation',
      
      card1Title: 'Références du Dossier',
      ordreNum: 'N° d\'Ordre',
      dossierNum: 'N° du Dossier',
      jugementDate: 'Date du Jugement',
      
      card2Title: 'Informations du Contrevenant',
      contrevenantNom: 'Nom complet',
      typeInfraction: 'Type d\'infraction',
      selectInfraction: '--- Sélectionner l\'infraction ---',
      infractionList: ['Radar fixe', 'Délit routier', 'Infraction simple', 'Autre'],
      
      card3Title: 'Détails Financiers',
      montantAmende: 'Montant de l\'amende (MAD)',
      montantFrais: 'Frais judiciaires (MAD)',
      total: 'Total (MAD)',
      
      card4Title: 'Quittance de Paiement',
      recuNum: 'N° du Reçu',
      recuDate: 'Date du Reçu',
      
      saveBtn: 'Enregistrer l\'opération',
      successMsg: 'Opération enregistrée avec succès'
    }
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.successMsg);
  };

  const calculatedTotal = (parseFloat(formData.montantAmende) || 0) + (parseFloat(formData.montantFrais) || 0);
  const formattedTotal = new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(calculatedTotal);

  const inputClassName = "w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-gray-50 transition-all outline-none text-[#003366] placeholder-gray-500";
  const labelClassName = "block text-sm font-bold text-[#003366] mb-2";

  return (
    <div className="bg-gray-50/50 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
          <div className="w-16 h-16 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
            <LayoutList className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">{t.pageTitle}</h1>
            <p className="text-gray-500 mt-1 font-medium">{t.pageSubtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Références du Dossier */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card1Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClassName}>{t.ordreNum}</label>
                <input type="number" name="ordreNum" value={formData.ordreNum} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.dossierNum}</label>
                <input type="text" name="dossierNum" value={formData.dossierNum} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.jugementDate}</label>
                <input type="date" name="jugementDate" value={formData.jugementDate} onChange={handleChange} className={inputClassName} required />
              </div>
            </div>
          </div>

          {/* Card 2: Informations du Contrevenant */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <User className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card2Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>{t.contrevenantNom}</label>
                <input type="text" name="contrevenantNom" value={formData.contrevenantNom} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.typeInfraction}</label>
                <select name="typeInfraction" value={formData.typeInfraction} onChange={handleChange} className={inputClassName} required>
                  <option value="">{t.selectInfraction}</option>
                  {t.infractionList.map((type, idx) => <option key={idx} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Détails Financiers (CRITICAL) */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-[#D4AF37]/50 overflow-hidden relative shadow-[#D4AF37]/10">
            <div className={`absolute top-0 w-2 h-full bg-gradient-to-b from-[#D4AF37] to-[#C5A028] ${isRTL ? 'right-0' : 'left-0'}`} />
            <div className="bg-gradient-to-r from-white to-[#D4AF37]/10 px-6 py-4 border-b border-[#D4AF37]/20 flex items-center gap-3">
              <Calculator className="w-6 h-6 text-[#003366]" />
              <h2 className="text-xl font-black text-[#003366]">{t.card3Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className={labelClassName}>{t.montantAmende}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01" 
                    name="montantAmende" 
                    value={formData.montantAmende} 
                    onChange={handleChange} 
                    className={`${inputClassName} font-mono text-lg`} 
                    required 
                  />
                  <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 font-bold ${isRTL ? 'left-4' : 'right-4'}`}>
                    {language === 'ar' ? 'درهم' : 'MAD'}
                  </span>
                </div>
              </div>
              <div>
                <label className={labelClassName}>{t.montantFrais}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="0.01" 
                    name="montantFrais" 
                    value={formData.montantFrais} 
                    onChange={handleChange} 
                    className={`${inputClassName} font-mono text-lg`} 
                    required 
                  />
                  <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 font-bold ${isRTL ? 'left-4' : 'right-4'}`}>
                    {language === 'ar' ? 'درهم' : 'MAD'}
                  </span>
                </div>
              </div>
              <div>
                <label className={labelClassName}>{t.total}</label>
                <div className="w-full p-4 text-xl sm:text-2xl font-black rounded-lg border-2 border-[#D4AF37] bg-[#D4AF37]/10 text-[#003366] flex items-center justify-between shadow-inner transition-all">
                  <span className="font-mono tracking-tight">{formattedTotal}</span>
                  <span className="text-[#D4AF37] text-sm">{language === 'ar' ? 'درهم' : 'MAD'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Quittance de Paiement */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <Receipt className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card4Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>{t.recuNum}</label>
                <input type="text" name="recuNum" value={formData.recuNum} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.recuDate}</label>
                <input type="date" name="recuDate" value={formData.recuDate} onChange={handleChange} className={inputClassName} required />
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
              <span>{t.saveBtn}</span>
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}