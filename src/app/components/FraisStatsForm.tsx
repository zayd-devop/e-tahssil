import React, { useState } from 'react';
import { Save, Calendar, BarChart3, FileText, Scale, FileSpreadsheet, Calculator, ScrollText } from 'lucide-react';

interface FraisStatsFormProps {}

export function FraisStatsForm({}: FraisStatsFormProps = {}) {
  const language = 'ar';
  const isRTL = true;

  const [formData, setFormData] = useState({
    month: '',
    year: '2026',
    
    extraits_dossiers: '',
    extraits_montant: '',
    
    frais_dossiers: '',
    frais_montant: '',
    
    assist_dossiers: '',
    assist_montant: '',
    
    injonc_dossiers: '',
    injonc_montant: '',

    titres_dossiers: '',
    titres_montant: ''
  });

  const translations = {
    ar: {
      pageTitle: 'إدخال الإحصائيات الشهرية',
      pageSubtitle: 'لوحة إدخال البيانات المجمعة لوحدة تصفية الصوائر',
      
      periodTitle: 'تحديد الفترة',
      month: 'الشهر',
      year: 'السنة',
      selectMonth: '--- اختر الشهر ---',
      months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'],
      
      card1Title: 'المختصرات',
      card2Title: 'الرسوم التكميلية',
      card3Title: 'المساعدة القضائية',
      card4Title: 'الأوامر بالدفع',
      card5Title: 'السندات',
      
      dossiersCount: 'عدد الملفات المستخلصة',
      montantTotal: 'المبالغ المستخلصة (درهم)',
      
      saveBtn: 'حفظ الإحصاء الشهري',
      successMsg: 'تم حفظ الإحصائيات بنجاح'
    },
    fr: {
      pageTitle: 'Saisie des Statistiques Mensuelles',
      pageSubtitle: 'Tableau de saisie agrégée pour la liquidation des frais',
      
      periodTitle: 'Sélection de la période',
      month: 'Mois',
      year: 'Année',
      selectMonth: '--- Sélectionner le mois ---',
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      
      card1Title: 'Extraits',
      card2Title: 'Frais Supplémentaires',
      card3Title: 'Assistance Judiciaire',
      card4Title: 'Injonctions de Payer',
      card5Title: 'Titres',
      
      dossiersCount: 'Nombre de dossiers',
      montantTotal: 'Montant total (MAD)',
      
      saveBtn: 'Enregistrer le mois',
      successMsg: 'Statistiques enregistrées avec succès'
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

  const inputClassName = "w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-gray-50 transition-all outline-none font-medium text-[#003366] placeholder-gray-500";
  const labelClassName = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

  const renderCard = (title: string, icon: React.ReactNode, prefix: string) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-[#003366] to-[#004080] px-4 py-3 flex items-center gap-3">
        <div className="text-[#D4AF37]">{icon}</div>
        <h3 className="text-white font-bold text-base md:text-lg">{title}</h3>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className={labelClassName}>{t.dossiersCount}</label>
          <input 
            type="number" 
            name={`${prefix}_dossiers`} 
            value={formData[`${prefix}_dossiers` as keyof typeof formData]} 
            onChange={handleChange} 
            className={inputClassName} 
            placeholder="0"
            required 
          />
        </div>
        <div>
          <label className={labelClassName}>{t.montantTotal}</label>
          <div className="relative">
            <input 
              type="number" 
              step="0.01" 
              name={`${prefix}_montant`} 
              value={formData[`${prefix}_montant` as keyof typeof formData]} 
              onChange={handleChange} 
              className={`${inputClassName} font-mono text-base font-bold text-[#003366]`} 
              placeholder="0.00"
              required 
            />
            <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm ${isRTL ? 'left-3' : 'right-3'}`}>
              {language === 'ar' ? 'درهم' : 'MAD'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-[#F8F9FA] px-6 py-6 border-b border-gray-200 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#003366] rounded-xl shadow-md flex items-center justify-center border border-[#D4AF37]/30">
          <BarChart3 className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="text-2xl font-black text-[#003366] tracking-tight">{t.pageTitle}</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">{t.pageSubtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* Top Section: Period Selection */}
        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-[#003366]">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold">{t.periodTitle}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className={labelClassName}>{t.month}</label>
              <select name="month" value={formData.month} onChange={handleChange} className={inputClassName} required>
                <option value="">{t.selectMonth}</option>
                {t.months.map((m, idx) => (
                  <option key={idx} value={String(idx + 1).padStart(2, '0')}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>{t.year}</label>
              <select name="year" value={formData.year} onChange={handleChange} className={inputClassName} required>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Form Area: 2 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Column 1: Stack of 3 */}
          <div className="flex flex-col gap-6">
            {renderCard(t.card1Title, <FileText className="w-5 h-5" />, 'extraits')}
            {renderCard(t.card2Title, <Calculator className="w-5 h-5" />, 'frais')}
            {renderCard(t.card3Title, <Scale className="w-5 h-5" />, 'assist')}
          </div>
          
          {/* Column 2: Stack of 2 */}
          <div className="flex flex-col gap-6">
            {renderCard(t.card4Title, <FileSpreadsheet className="w-5 h-5" />, 'injonc')}
            {renderCard(t.card5Title, <ScrollText className="w-5 h-5" />, 'titres')}
          </div>
        </div>

        {/* Bottom Action */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3.5 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] focus:ring-4 focus:ring-[#003366]/30 transition-all shadow-md hover:shadow-lg"
          >
            <Save className="w-5 h-5" />
            <span>{t.saveBtn}</span>
          </button>
        </div>
        
      </form>
    </div>
  );
}