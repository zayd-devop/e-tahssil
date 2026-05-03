import React, { useState } from 'react';
import { FileText, Download, Car, Search, Gavel, ChevronDown, FolderOpen } from 'lucide-react';

export function DocumentGenerator() {
  // --- 1. ÉTATS ---
  const [activeCategory, setActiveCategory] = useState('vehicles');
  const [activeDoc, setActiveDoc] = useState(null); // On met ton document par défaut
  
  // État pour les données générales (qui restent en mémoire)
  const [generalData, setGeneralData] = useState({
    dossierNum: '',
    debtorName: '',
    debtorCIN: '',
    debtorAddress: '',
    debtAmount: ''
  });

  // État pour les données spécifiques (qui se vident quand on change de doc)
  const [specificData, setSpecificData] = useState({});

  // --- 2. LE DICTIONNAIRE DES CHAMPS DYNAMIQUES ---
  const fieldDictionary = {
    narsa_center: { label: 'مركز تسجيل السيارات (المدينة)', type: 'text', placeholder: 'مثال: طنجة' },
    vehicle_type: { label: 'نوع السيارة (العلامة)', type: 'text', placeholder: 'مثال: Dacia Logan' },
    vehicle_color: { label: 'لون السيارة', type: 'text', placeholder: 'مثال: أبيض' },
    vehicle_reg: { label: 'رقم التسجيل (الماتريكول)', type: 'text', placeholder: 'مثال: 12345 | أ | 1' },
    decision_num: { label: 'رقم المقرر القضائي', type: 'text', placeholder: 'مثال: 45/2026' },
    decision_date: { label: 'تاريخ المقرر القضائي', type: 'date' },
    notification_method: { 
      label: 'طريقة التبليغ', 
      type: 'select', 
      options: ['عن طريق المفوض القضائي', 'عن طريق البريد المضمون', 'بالطريق الإداري'] 
    },
    old_declaration_date: { label: 'تاريخ التصريح الأول (المراد تجديده)', type: 'date' },

    destinataire_name: { 
      label: 'الجهة الموجه إليها الطلب (المرسل إليه)', 
      type: 'select', 
      options: ['الوكالة الوطنية للسلامة الطرقية (NARSA)', 'الصندوق الوطني للضمان الاجتماعي (CNSS)', 'بنك المغرب', 'المحافظة العقارية (ANCFCC)', 'إدارة الضرائب', 'مؤسسة بنكية أخرى'] 
    },
    requested_info: { 
      label: 'طبيعة الوثائق أو المعلومات المطلوبة', 
      type: 'textarea', // 👈 Nouveau type !
      placeholder: 'مثال: كشف لجميع الحسابات البنكية المفتوحة باسم المدين...' 
    },

    judgment_num: { label: 'رقم الحكم أو القرار', type: 'text', placeholder: 'مثال: 638' },
    judgment_date: { label: 'تاريخ الحكم أو القرار', type: 'date' },
    warning_date: { label: 'تاريخ تبليغ الإنذار القانوني', type: 'date' },

    // 👇 Champs pour le الرهن الجبري (Hypothèque forcée)
    conservation_fonciere: { 
      label: 'المحافظة العقارية الموجه إليها الطلب', 
      type: 'text', 
      placeholder: 'مثال: طنجة المدينة' 
    },
    titre_foncier: { 
      label: 'رقم الرسم العقاري', 
      type: 'text', 
      placeholder: 'مثال: 06/98544/T',
      dir: 'ltr' // Très utile pour que les numéros s'affichent correctement (de gauche à droite)
    },
    debt_amount_letters: { 
      label: 'المبلغ المستحق بالحروف', 
      type: 'text', 
      placeholder: 'مثال: خمسون ألف درهم' 
    },

    // 👇 حقول إشعار الغير الحائز (ATD)
    atd_destinataire: { 
      label: 'الجهة الموجه إليها الإشعار (الغير الحائز)', 
      type: 'text', 
      placeholder: 'مثال: المدير الجهوي لوكالة التجاري وفابنك بطنجة' 
    },
    debtor_bank_accounts: { 
      label: 'أرقام الحسابات البنكية للمدين (إن وجدت)', 
      type: 'textarea', 
      placeholder: 'مثال: 007640000332200030107623\n(يمكن إدخال عدة حسابات بالضغط على Entrée)' 
    },

    // 👇 Nouveaux champs pour l'Ordre de Paiement (أمر بالدفع)
    dossier_recouvrement: { label: 'رقم ملف التحصيل', type: 'text', placeholder: 'مثال: 123/2026' },
    financial_year: { label: 'السنة المالية', type: 'text', placeholder: 'مثال: 2026' },
    order_num: { label: 'رقم الأمر بالدفع', type: 'text', placeholder: 'رقم الترتيب...' },
    judgment_type: { 
      label: 'وصف الحكم', 
      type: 'select', 
      options: ['حضوري', 'غيابي', 'بمثابة حضوري'] 
    },
    case_type: { 
      label: 'نوع الملف', 
      type: 'select', 
      options: ['مخالفة', 'جنحة', 'جناية'] 
    },
    amende_amount: { label: 'مبلغ الغرامة الأصلية (درهم)', type: 'number', placeholder: '0.00' },
    frais_amount: { label: 'مبلغ الصوائر القضائية (درهم)', type: 'number', placeholder: '0.00' },
  };

  // --- 3. CONFIGURATION DES DOCUMENTS ---
  const docConfigs = {
    'car_opp_declare': {
      title: 'نموذج تصريح بمثابة تعرض لدى مركز تسجيل السيارات',
      // On liste ici les IDs des champs dont ce document a besoin :
      fields: ['narsa_center', 'vehicle_type', 'vehicle_color', 'vehicle_reg', 'decision_num', 'decision_date', 'notification_method']
    },
    // Les autres documents seront ajoutés ici plus tard...
    'car_opp_renew': { 
      title: 'نموذج تجديد التصريح بالتعرض لدى مركز تسجيل السيارات', 
      // Remarque : on réutilise les anciens champs, on ajoute la nouvelle date, et on enlève la méthode de notification !
      fields: ['decision_num', 'decision_date', 'narsa_center', 'old_declaration_date', 'vehicle_type', 'vehicle_color', 'vehicle_reg'] 
    },
    
    'car_opp_lift': { 
      title: 'نموذج رفع اليد عن التعرض لدى مركز تسجيل السيارات', 
      fields: ['decision_num', 'decision_date', 'narsa_center', 'old_declaration_date', 'vehicle_type', 'vehicle_color', 'vehicle_reg', 'notification_method'] 
    },

    'info_request': {
      title: 'نموذج طلب حق الاطلاع (مؤسسات مختلفة)',
      fields: ['destinataire_name', 'requested_info']
    },
    
    // On préparera la catégorie 3 plus tard...
    'pv_carence': { title: 'محضر عدم امكانية التنفيذ على أموال المدين', fields: ['judgment_num', 'judgment_date', 'warning_date'] },
    'mortgage': { title: 'الرهن الجبري', 
      fields: ['conservation_fonciere', 'titre_foncier', 'debt_amount_letters'],
    },
    'atd': { title: 'إشعار الغير الحائز', fields: ['atd_destinataire', 'judgment_num', 'judgment_date', 'warning_date', 'debtor_bank_accounts'] },
    'payment_order': { 
      title: 'نموذج أمر بالدفع', 
      fields: [
        'order_num', 
        'financial_year', 
        'dossier_recouvrement', 
        'case_type',
        'judgment_type',
        'judgment_num', 
        'judgment_date', 
        'amende_amount', 
        'frais_amount', 
        'debt_amount_letters'
      ] 
    },
  };

  // --- 4. CATÉGORIES (Menu) ---
  const categories = [
    {
      id: 'vehicles',
      title: 'إجراءات مراكز تسجيل السيارات',
      icon: <Car className="w-5 h-5" />,
      docs: [
        { id: 'car_opp_declare', title: 'نموذج تصريح بمثابة تعرض لدى مركز تسجيل السيارات' },
        { id: 'car_opp_renew', title: 'نموذج تجديد التصريح بالتعرض لدى مركز تسجيل السيارات' },
        { id: 'car_opp_lift', title: 'نموذج رفع اليد عن التعرض لدى مركز تسجيل السيارات' },
      ]
    },
    { id: 'search', title: 'طلبات حق الاطلاع', 
      icon: <Search className="w-5 h-5" />, 
      docs: [{ id: 'info_request', title: 'نموذج طلب حق الاطلاع' }, ]},
    { id: 'execution', title: 'إجراءات التنفيذ الجبري', icon: <Gavel className="w-5 h-5" />, 
      docs: [
        { id: 'pv_carence', title: 'محضر عدم امكانية التنفيذ على أموال المدين' }, 
        { id: 'mortgage', title: 'الرهن الجبري' },
        { id: 'atd', title: 'إشعار الغير الحائز' },
        { id: 'payment_order', title: 'نموذج أمر بالدفع' },
      ] }
  ];

  // --- 5. HANDLERS ---
  const toggleCategory = (categoryId) => setActiveCategory(activeCategory === categoryId ? null : categoryId);
  
  const handleDocChange = (docId) => {
    setActiveDoc(docId);
    setSpecificData({}); // On vide les champs spécifiques quand on change de document
  };

  const handleGeneralChange = (e) => setGeneralData({ ...generalData, [e.target.name]: e.target.value });
  const handleSpecificChange = (e) => setSpecificData({ ...specificData, [e.target.name]: e.target.value });

  const handleGenerate = (e) => {
    e.preventDefault();
    console.log("Génération du document avec :", { ...generalData, ...specificData });
    alert('جاري تحميل المستند...');
  };

  const currentConfig = docConfigs[activeDoc] || { title: 'وثيقة غير متوفرة', fields: [] };
  const inputClassName = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] outline-none text-[#003366] bg-white";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-6xl mx-auto mt-6 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#003366]">توليد الوثائق الرسمية</h2>
            <p className="text-gray-500 mt-1 font-medium">نماذج احترافية للقرارات القضائية وإجراءات التحصيل</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Colonne Droite : Accordéon */}
        <div className="w-full lg:w-1/3 space-y-3">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${activeCategory === cat.id ? 'bg-[#003366] text-white' : 'bg-gray-50 text-[#003366] hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">{cat.icon}<span className="font-bold text-sm">{cat.title}</span></div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${activeCategory === cat.id ? 'rotate-180 text-[#D4AF37]' : 'text-gray-400'}`} />
              </button>

              {activeCategory === cat.id && (
                <div className="p-2 bg-white">
                  {cat.docs.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleDocChange(doc.id)}
                      className={`w-full text-right p-3 rounded-lg flex items-start gap-3 transition-all mb-1 last:mb-0 ${activeDoc === doc.id ? 'bg-[#D4AF37]/10 text-[#003366] border border-[#D4AF37]/30 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-[#003366] font-medium'}`}
                    >
                      <FolderOpen className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activeDoc === doc.id ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                      <span className="text-sm leading-relaxed">{doc.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Colonne Gauche : Formulaire Central */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {activeDoc ? (
            /* ===== LE FORMULAIRE S'AFFICHE SI UN DOCUMENT EST SÉLECTIONNÉ ===== */
            <>
              <div className="bg-gray-50 border-b border-gray-200 p-4">
                <h3 className="font-bold text-[#003366] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                  الوثيقة المحددة: {currentConfig.title}
                </h3>
              </div>

              <form onSubmit={handleGenerate} className="p-6">
            
            {/* SECTION 1 : معلومات عامة */}
            <div className="mb-8">
              <h4 className="text-lg font-bold text-gray-800 border-b-2 border-[#D4AF37] pb-2 mb-5 inline-block">معلومات عامة</h4>
              <p className="text-xs text-gray-500 mb-4">* هذه المعلومات ستبقى محفوظة لتسهيل استخراج وثائق أخرى لنفس الملف.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الملف / المرجع</label>
                  <input type="text" name="dossierNum" value={generalData.dossierNum} onChange={handleGeneralChange} className={inputClassName} placeholder="مثال: 123/2026" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل للمدين</label>
                  <input type="text" name="debtorName" value={generalData.debtorName} onChange={handleGeneralChange} className={inputClassName} placeholder="الاسم الشخصي والعائلي" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم البطاقة الوطنية</label>
                  <input type="text" name="debtorCIN" value={generalData.debtorCIN} onChange={handleGeneralChange} className={inputClassName} placeholder="رقم ب.ت.و" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المبلغ المستحق (درهم)</label>
                  <input type="number" step="0.01" name="debtAmount" value={generalData.debtAmount} onChange={handleGeneralChange} className={inputClassName} placeholder="0.00" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">عنوان المدين</label>
                  <input type="text" name="debtorAddress" value={generalData.debtorAddress} onChange={handleGeneralChange} className={inputClassName} placeholder="العنوان الكامل" />
                </div>
              </div>
            </div>

            {/* SECTION 2 : معلومات خاصة بالوثيقة (GÉNÉRÉE DYNAMIQUEMENT !) */}
            <div className="mb-8 bg-[#F8F9FA] p-5 rounded-xl border border-blue-50 shadow-inner">
              <h4 className="text-lg font-bold text-[#003366] mb-5">معلومات خاصة بالوثيقة</h4>
              
              {currentConfig.fields.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {currentConfig.fields.map(fieldKey => {
                    const field = fieldDictionary[fieldKey];
                    if (!field) return null;

                   return (
                      <div key={fieldKey}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                        
                        {/* 1. Affichage du champ normal (Select, Textarea ou Input) */}
                        {field.type === 'select' ? (
                          <select name={fieldKey} value={specificData[fieldKey] || ''} onChange={handleSpecificChange} className={inputClassName} required>
                            <option value="">--- اختر ---</option>
                            {field.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea name={fieldKey} value={specificData[fieldKey] || ''} onChange={handleSpecificChange} className={`${inputClassName} resize-none`} placeholder={field.placeholder || ''} rows="3" required />
                        ) : (
                          <input type={field.type} name={fieldKey} value={specificData[fieldKey] || ''} onChange={handleSpecificChange} className={inputClassName} placeholder={field.placeholder || ''} required />
                        )}

                        {/* 👇 2. L'ASTUCE : Le champ conditionnel qui s'affiche juste en dessous */}
                        {fieldKey === 'destinataire_name' && specificData[fieldKey] === 'مؤسسة بنكية أخرى' && (
                          <div className="mt-3">
                            <input 
                              type="text" 
                              name="custom_destinataire_name" // Un nouveau nom pour sauvegarder cette valeur spécifiquement
                              value={specificData['custom_destinataire_name'] || ''} 
                              onChange={handleSpecificChange} 
                              className={inputClassName} 
                              placeholder="المرجو إدخال اسم المؤسسة..." 
                              required 
                            />
                          </div>
                        )}
                        
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>يرجى اختيار وثيقة أخرى لعرض حقولها</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] text-white rounded-xl font-bold hover:bg-[#C5A028] transition-all shadow-lg active:scale-95">
                <Download className="w-5 h-5" />
                <span>توليد المستند (Word)</span>
              </button>
            </div>

          </form>
            </>
          ) : (
            /* ===== L'ÉTAT VIDE S'AFFICHE PAR DÉFAUT ===== */
            <div className="flex flex-col items-center justify-center flex-1 p-12 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">لم يتم تحديد أي وثيقة</h3>
              <p className="text-gray-500">المرجو اختيار وثيقة من القائمة الجانبية للبدء في تعبئة المعلومات وتوليد المستند.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}