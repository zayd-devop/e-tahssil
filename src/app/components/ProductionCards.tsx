import React, { useState } from 'react';
import { Save, Activity, Info, Mail, ShieldAlert, DollarSign, Zap, ChevronDown } from 'lucide-react';

interface ProductionCardsProps {}

export function ProductionCards({}: ProductionCardsProps = {}) {
  const language = 'ar';
  const isRTL = true;
  const todayDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    employeeName: '',
    section: '',
    registre: '',
    detailedAction: '',
    dossiersNotifies: '',
    dossiersExecutes: '',
    montantRecouvre: '',
    pvRecherche: '',
    pvCarence: '',
    contrainte: '',
    dossiersAnnulation: '',
    montantDelegations: ''
  });

  const translations = {
    ar: {
      title: 'إدخال الحصيلة اليومية',
      subtitle: 'إدخال البيانات اليومية للإنجازات',
      employeeLabel: 'اختر اسم الموظف',
      selectEmployee: '--- الرجاء الاختيار ---',
      employees: ['عمار خجوي', 'سعيدة العاطفي', 'كريم العلوي', 'فاطمة الزهراء', 'أحمد بن علي'],
      save: 'حفظ البطاقة',
      successMsg: 'تم حفظ البطاقة بنجاح',
      
      card1Title: 'معلومات عامة',
      dateLabel: 'تاريخ اليوم',
      sectionLabel: 'الشعبة',
      sections: ['شعبة التبليغ الزجري', 'شعبة التنفيذ الزجري', 'تصفية الصوائر'],
      registresLabel: 'مسك السجلات',
      registres: ['سجل العقوبات البدنية 512', 'سجل التنفيذات 604', 'سجل الانابات الواردة و الصادرة'],

      card2Title: 'العمل الإداري والتبليغ (الإجراءات المنجزة)',
      detailedActionLabel: 'تفاصيل الإجراءات المنجزة',
      dynamicBadge: 'ديناميكي: تتغير حسب الشعبة',
      detailedActionsHelper: 'الرجاء اختيار نوع الإجراء (مفتوح للتوضيح):',
      detailedActions: [
        'الاستقبالات والاجراءات + ضبط وفرز الملفات المحالة + تفصيل الاحكام بالنظام المعلوماتي',
        'إنجاز طيات التبليغ + إرسالها إلى المفوضين القضائيين + تتبع مآل الإنجاز',
        'تحرير محاضر الحجز التنفيذي + المتابعة مع مأمور الإجراءات + تصفية الصوائر'
      ],
      dependentFieldsHint: 'الحقول التالية مرتبطة بالإجراء المختار أعلاه:',
      dossiersNotifiesLabel: 'الملفات المبلغة',
      dossiersExecutesLabel: 'عدد الملفات المنفذة',
      montantRecouvreLabel: 'المبالغ المستخلصة (د.م)',

      card3Title: 'الإجراءات الجبرية والمحاضر',
      pvRechercheLabel: 'محضر تحري',
      pvCarenceLabel: 'محضر امتناع وعدم التنفيذ',
      contrainteLabel: 'الإكراهات البدنية',

      card4Title: 'تتمة التنفيذات والتحصيل',
      dossiersAnnulationLabel: 'عدد الإلغاءات والإسقاطات',
      montantDelegationsLabel: 'مبالغ الإنابات الواردة (د.م)',
    },
    fr: {
      title: 'Saisie de la Production Journalière',
      subtitle: 'Saisie quotidienne des réalisations',
      employeeLabel: 'Sélectionner l\'employé',
      selectEmployee: '--- Veuillez sélectionner ---',
      employees: ['Ammar Khajoui', 'Saida El Atifi', 'Karim Alaoui', 'Fatima Zahra', 'Ahmed Ben Ali'],
      save: 'Enregistrer la fiche',
      successMsg: 'Fiche enregistrée avec succès',

      card1Title: 'Informations Générales',
      dateLabel: 'Date du jour',
      sectionLabel: 'Section',
      sections: ['Section de Notification Pénale', 'Section d\'Exécution Pénale', 'Liquidation des Frais'],
      registresLabel: 'Tenue des registres',
      registres: ['Registre des contraintes par corps 512', 'Registre des exécutions 604', 'Registre des délégations entrantes/sortantes'],

      card2Title: 'Procédures et Travail Administratif',
      detailedActionLabel: 'Type d\'action détaillée',
      dynamicBadge: 'Dynamique : Change selon la section',
      detailedActionsHelper: 'Veuillez sélectionner le type d\'action (développé pour démo) :',
      detailedActions: [
        'Réceptions et procédures + tri et affectation des dossiers + détail des jugements dans le SI',
        'Préparation des plis de notification + envoi aux huissiers + suivi d\'exécution',
        'Rédaction des PV de saisie + suivi avec l\'agent d\'exécution + liquidation des frais'
      ],
      dependentFieldsHint: 'Les champs suivants sont liés à l\'action sélectionnée ci-dessus :',
      dossiersNotifiesLabel: 'Dossiers Notifiés',
      dossiersExecutesLabel: 'Dossiers Exécutés',
      montantRecouvreLabel: 'Montant Recouvré (MAD)',

      card3Title: 'Mesures Coercitives & PVs',
      pvRechercheLabel: 'PV de recherche',
      pvCarenceLabel: 'PV de carence/refus',
      contrainteLabel: 'Contrainte par corps',

      card4Title: 'Suite Exécutions & Recouvrements',
      dossiersAnnulationLabel: 'Dossiers d\'Annulation/Chute',
      montantDelegationsLabel: 'Montant des Délégations (MAD)',
    }
  };

  const t = translations[language];

  // Make sure the first section is selected by default if not set
  const currentSection = formData.section || t.sections[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.successMsg);
    setFormData({
      employeeName: '', section: '', registre: '', detailedAction: '', dossiersNotifies: '',
      dossiersExecutes: '', montantRecouvre: '', pvRecherche: '', pvCarence: '', contrainte: '',
      dossiersAnnulation: '', montantDelegations: ''
    });
  };

  const inputClassName = `w-full p-3.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-gray-50 transition-all text-[#003366] placeholder-gray-500 ${isRTL ? 'text-right' : 'text-left'}`;
  const labelClassName = `block text-sm font-semibold text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`;

  return (
    <div className="bg-transparent max-w-5xl mx-auto mt-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
          <Activity className="w-7 h-7 text-[#003366]" />
        </div>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="text-3xl font-bold text-[#003366]">{t.title}</h2>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Prominent Employee Selection */}
        <div className={`p-6 bg-white rounded-xl shadow-sm border-t border-b border-gray-100 ${isRTL ? 'border-r-4 border-r-[#003366] border-l' : 'border-l-4 border-l-[#003366] border-r'}`}>
          <label className={`block text-lg font-bold text-[#003366] mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t.employeeLabel} <span className="text-red-500">*</span>
          </label>
          <select
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className={`w-full p-4 text-base border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] bg-gray-50 transition-all font-medium text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}
            required
          >
            <option value="">{t.selectEmployee}</option>
            {t.employees.map((emp, idx) => (
              <option key={idx} value={emp}>{emp}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Informations Générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <Info className="w-5 h-5 text-[#003366]" />
              <h3 className="text-lg font-bold text-gray-800">{t.card1Title}</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className={labelClassName}>{t.dateLabel}</label>
                <input
                  type="date"
                  value={todayDate}
                  readOnly
                  className={`${inputClassName} bg-gray-100 text-gray-500 cursor-not-allowed`}
                />
              </div>
              <div>
                <label className={labelClassName}>{t.sectionLabel}</label>
                <select
                  name="section"
                  value={currentSection}
                  onChange={handleChange}
                  className={inputClassName}
                  required
                >
                  {t.sections.map((sec, idx) => (
                    <option key={idx} value={sec}>{sec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClassName}>{t.registresLabel}</label>
                <select
                  name="registre"
                  value={formData.registre}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">{isRTL ? 'اختر السجل...' : 'Sélectionnez le registre...'}</option>
                  {t.registres.map((reg, idx) => (
                    <option key={idx} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Travail Administratif & Notifications (Expanded Dropdown) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#003366]" />
                <h3 className="text-lg font-bold text-gray-800">{t.card2Title}</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Dynamic Multiline Dropdown Wrapper */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <label className={`block text-base font-bold text-[#003366] ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t.detailedActionLabel}
                  </label>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md flex items-center gap-1.5 border border-blue-200">
                    <Zap className="w-3.5 h-3.5 fill-blue-700" />
                    {t.dynamicBadge}
                  </span>
                </div>
                
                <div className="relative">
                  <select
                    name="detailedAction"
                    value={formData.detailedAction}
                    onChange={handleChange}
                    className={`${inputClassName} appearance-none truncate ${isRTL ? 'pl-10 pr-3' : 'pr-10 pl-3'}`}
                  >
                    <option value="">{isRTL ? 'اختر الإجراء...' : 'Sélectionnez l\'action...'}</option>
                    {t.detailedActions.map((action, idx) => (
                      <option key={idx} value={action}>{action}</option>
                    ))}
                  </select>
                  <div className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`}>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Dependent Numeric Inputs */}
              <div className={`bg-gray-50 p-6 rounded-xl border border-gray-200 ${isRTL ? 'border-r-4 border-r-[#D4AF37]' : 'border-l-4 border-l-[#D4AF37]'}`}>
                <p className={`text-sm text-gray-600 font-medium mb-5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.dependentFieldsHint}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClassName}>{t.dossiersNotifiesLabel}</label>
                    <input
                      type="number"
                      name="dossiersNotifies"
                      min="0"
                      value={formData.dossiersNotifies}
                      onChange={handleChange}
                      className={`${inputClassName} bg-white`}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>{t.dossiersExecutesLabel}</label>
                    <input
                      type="number"
                      name="dossiersExecutes"
                      min="0"
                      value={formData.dossiersExecutes}
                      onChange={handleChange}
                      className={`${inputClassName} bg-white`}
                    />
                  </div>
                  <div>
                    <label className={labelClassName}>{t.montantRecouvreLabel}</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="montantRecouvre"
                        min="0"
                        step="0.01"
                        value={formData.montantRecouvre}
                        onChange={handleChange}
                        className={`${inputClassName} bg-white font-mono ${isRTL ? 'pl-14' : 'pr-14'}`}
                      />
                      <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded text-xs`}>
                        MAD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Mesures Coercitives & PVs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-800">{t.card3Title}</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className={labelClassName}>{t.pvRechercheLabel}</label>
                <input
                  type="number"
                  name="pvRecherche"
                  min="0"
                  value={formData.pvRecherche}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>{t.pvCarenceLabel}</label>
                <input
                  type="number"
                  name="pvCarence"
                  min="0"
                  value={formData.pvCarence}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>{t.contrainteLabel}</label>
                <input
                  type="number"
                  name="contrainte"
                  min="0"
                  value={formData.contrainte}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Exécutions & Recouvrements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-800">{t.card4Title}</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className={labelClassName}>{t.dossiersAnnulationLabel}</label>
                <input
                  type="number"
                  name="dossiersAnnulation"
                  min="0"
                  value={formData.dossiersAnnulation}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className={labelClassName}>{t.montantDelegationsLabel}</label>
                <div className="relative">
                  <input
                    type="number"
                    name="montantDelegations"
                    min="0"
                    step="0.01"
                    value={formData.montantDelegations}
                    onChange={handleChange}
                    className={`${inputClassName} font-mono ${isRTL ? 'pl-14' : 'pr-14'}`}
                  />
                  <span className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded text-xs`}>
                    MAD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-3 px-10 py-4 bg-[#003366] text-white rounded-xl text-lg font-bold hover:bg-[#004080] transition-colors shadow-lg hover:shadow-xl"
          >
            <Save className="w-6 h-6" />
            <span>{t.save}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
