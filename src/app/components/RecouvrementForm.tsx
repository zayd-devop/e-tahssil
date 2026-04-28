import React, { useState } from 'react';
import { Save, FileText, User, Briefcase, CreditCard, Scale, LayoutList } from 'lucide-react';

interface RecouvrementFormProps {}

export function RecouvrementForm({}: RecouvrementFormProps = {}) {
  const language = 'ar';
  const isRTL = true;

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

  const translations = {
    ar: {
      pageTitle: 'إدخال إجراءات التحصيل',
      pageSubtitle: 'سجل إجراءات التحصيل الرقمي',
      card1Title: 'المراجع القانونية',
      extraitNum: 'رقم المستخرج',
      extraitDate: 'تاريخ المستخرج',
      jugementNum: 'رقم المقرر القضائي',
      jugementDate: 'تاريخ المقرر القضائي',
      
      card2Title: 'المدين والمبالغ المحكوم بها',
      condamneNom: 'اسم المحكوم عليه',
      typeDette: 'نوع الدين',
      amende: 'غرامة',
      frais: 'صوائر قضائية',
      montantAmende: 'مبلغ الغرامة',
      montantFrais: 'مبلغ الصوائر',
      total: 'المجموع الإجمالي',
      
      card3Title: 'الإسناد والإجراءات المتخذة',
      agent: 'المكلف بالتحصيل',
      selectAgent: '--- اختر المكلف ---',
      agentsList: ['أحمد بن علي', 'عمار خجوي', 'فاطمة الزهراء', 'كريم العلوي'],
      action: 'الإجراء المتخذ',
      selectAction: '--- اختر الإجراء ---',
      actionsList: ['الإشعار بدون صائر', 'إنذار', 'حجز تنفيذي', 'إكراه بدني'],
      actionDate: 'تاريخ الإجراء',
      
      card4Title: 'مآل المبالغ - الأداء',
      recuNum: 'رقم وصل الأداء',
      paiementDate: 'تاريخ الأداء',
      montantPaye: 'المبلغ المؤدى',
      
      saveBtn: 'حفظ الإجراء',
      successMsg: 'تم حفظ الإجراء بنجاح'
    },
    fr: {
      pageTitle: 'Saisie des Procédures de Recouvrement',
      pageSubtitle: 'Registre digital des procédures de recouvrement',
      card1Title: 'Références Légales',
      extraitNum: 'N° de l\'extrait',
      extraitDate: 'Date de l\'extrait',
      jugementNum: 'N° du jugement',
      jugementDate: 'Date du jugement',
      
      card2Title: 'Débiteur & Montants',
      condamneNom: 'Nom du condamné',
      typeDette: 'Type de dette',
      amende: 'Amende',
      frais: 'Frais judiciaires',
      montantAmende: 'Montant de l\'amende',
      montantFrais: 'Montant des frais',
      total: 'Montant Total',
      
      card3Title: 'Assignation & Actions',
      agent: 'Agent en charge',
      selectAgent: '--- Sélectionner l\'agent ---',
      agentsList: ['Ahmed Ben Ali', 'Ammar Khajoui', 'Fatima Zahra', 'Karim Alaoui'],
      action: 'Action entreprise',
      selectAction: '--- Sélectionner l\'action ---',
      actionsList: ['Avis sans frais', 'Mise en demeure', 'Saisie exécution', 'Contrainte par corps'],
      actionDate: 'Date de l\'action',
      
      card4Title: 'Paiement & Issue',
      recuNum: 'N° du reçu de paiement',
      paiementDate: 'Date de paiement',
      montantPaye: 'Montant payé',
      
      saveBtn: 'Enregistrer la procédure',
      successMsg: 'Procédure enregistrée avec succès'
    }
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.successMsg);
    // Reset form or handle navigation
  };

  const montantTotal = (parseFloat(formData.montantAmende) || 0) + (parseFloat(formData.montantFrais) || 0);

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
          
          {/* Card 1: Références Légales */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <Scale className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card1Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>{t.extraitNum}</label>
                <input type="text" name="extraitNum" value={formData.extraitNum} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.extraitDate}</label>
                <input type="date" name="extraitDate" value={formData.extraitDate} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.jugementNum}</label>
                <input type="text" name="jugementNum" value={formData.jugementNum} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.jugementDate}</label>
                <input type="date" name="jugementDate" value={formData.jugementDate} onChange={handleChange} className={inputClassName} required />
              </div>
            </div>
          </div>

          {/* Card 2: Débiteur & Montants */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <User className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card2Title}</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClassName}>{t.condamneNom}</label>
                  <input type="text" name="condamneNom" value={formData.condamneNom} onChange={handleChange} className={inputClassName} required />
                </div>
                <div>
                  <label className={labelClassName}>{t.typeDette}</label>
                  <div className="flex items-center gap-6 h-[50px] px-4 rounded-lg border border-gray-300 bg-gray-50">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="typeAmende" checked={formData.typeAmende} onChange={handleChange} className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]" />
                      <span className="text-sm font-semibold text-gray-700">{t.amende}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="typeFrais" checked={formData.typeFrais} onChange={handleChange} className="w-4 h-4 text-[#003366] border-gray-300 rounded focus:ring-[#003366]" />
                      <span className="text-sm font-semibold text-gray-700">{t.frais}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className={labelClassName}>{t.montantAmende}</label>
                  <div className="relative">
                    <input type="number" step="0.01" min="0" name="montantAmende" value={formData.montantAmende} onChange={handleChange} className={`${inputClassName} font-mono ${isRTL ? 'pl-16' : 'pr-16'}`} disabled={!formData.typeAmende} />
                    <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 font-bold bg-gray-200/50 px-2 py-1 rounded text-xs`}>MAD</span>
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>{t.montantFrais}</label>
                  <div className="relative">
                    <input type="number" step="0.01" min="0" name="montantFrais" value={formData.montantFrais} onChange={handleChange} className={`${inputClassName} font-mono ${isRTL ? 'pl-16' : 'pr-16'}`} disabled={!formData.typeFrais} />
                    <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 font-bold bg-gray-200/50 px-2 py-1 rounded text-xs`}>MAD</span>
                  </div>
                </div>
                <div>
                  <label className={labelClassName}>{t.total}</label>
                  <div className="relative">
                    <div className={`w-full p-3.5 text-lg font-mono font-bold text-[#003366] bg-[#D4AF37]/10 border-2 border-[#D4AF37] rounded-lg shadow-inner flex items-center ${isRTL ? 'justify-end pl-16' : 'justify-start pr-16'}`}>
                      {montantTotal.toFixed(2)}
                    </div>
                    <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-[#003366] font-bold bg-[#D4AF37]/30 px-2 py-1 rounded text-xs`}>MAD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Assignation & Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card3Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClassName}>{t.agent}</label>
                <select name="agent" value={formData.agent} onChange={handleChange} className={inputClassName} required>
                  <option value="">{t.selectAgent}</option>
                  {t.agentsList.map((ag, idx) => <option key={idx} value={ag}>{ag}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClassName}>{t.action}</label>
                <select name="action" value={formData.action} onChange={handleChange} className={inputClassName} required>
                  <option value="">{t.selectAction}</option>
                  {t.actionsList.map((act, idx) => <option key={idx} value={act}>{act}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClassName}>{t.actionDate}</label>
                <input type="date" name="actionDate" value={formData.actionDate} onChange={handleChange} className={inputClassName} required />
              </div>
            </div>
          </div>

          {/* Card 4: Paiement & Issue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card4Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClassName}>{t.recuNum}</label>
                <input type="text" name="recuNum" value={formData.recuNum} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>{t.paiementDate}</label>
                <input type="date" name="paiementDate" value={formData.paiementDate} onChange={handleChange} className={inputClassName} />
              </div>
              <div>
                <label className={labelClassName}>{t.montantPaye}</label>
                <div className="relative">
                  <input type="number" step="0.01" min="0" name="montantPaye" value={formData.montantPaye} onChange={handleChange} className={`${inputClassName} font-mono ${isRTL ? 'pl-16' : 'pr-16'}`} />
                  <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-gray-400 font-bold bg-gray-200/50 px-2 py-1 rounded text-xs`}>MAD</span>
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
              <span>{t.saveBtn}</span>
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
