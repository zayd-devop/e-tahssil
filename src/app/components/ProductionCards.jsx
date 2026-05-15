import React, { useState, useEffect } from 'react';
import { Save, Activity, Info, Mail, ShieldAlert, DollarSign, ChevronDown, X, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export function ProductionCards() {

  // حالات جلب البيانات من الخادم
  const [hierarchyData, setHierarchyData] = useState([]);
  const [isLoadingHierarchy, setIsLoadingHierarchy] = useState(true);

  const [formData, setFormData] = useState({
    employeeName: '',
    section: '',
    registre: '',
    todayDate: new Date().toISOString().split('T')[0], // التاريخ الافتراضي هو اليوم، لكنه الآن قابل للتعديل
    selectedActions: [], 
    dossiersNotifies: '',
    dossiersExecutes: '',
    montantRecouvre: '',
    pvPositif: false,
    pvPositifCount: '',
    pvNegatif: false,
    pvNegatifCount: '',
    contrainte: '',
    dossiersAnnulation: '',
    dossiersIskatat: '',
    montantDelegations: '',
    contrePersonnes: false,
    montantPersonnes: '',
    contreSocietes: false,
    montantSocietes: ''
  });

  const [currentCategory, setCurrentCategory] = useState('');

  const t = {
    title: 'إدخال الحصيلة اليومية',
    subtitle: 'إدخال البيانات اليومية للإنجازات',
    employeeLabel: 'اسم الموظف',
    save: 'حفظ البطاقة',
    successMsg: 'تم حفظ البطاقة بنجاح',
    
    card1Title: 'معلومات عامة',
    dateLabel: 'تاريخ الإنجاز', // تم تعديل التسمية قليلاً لتناسب أي تاريخ
    sectionLabel: 'الشعبة',

    card2Title: 'العمل الإداري والتبليغ (الإجراءات المنجزة)',
    actionCategoryLabel: 'فئة الإجراءات',
    dependentFieldsHint: 'الحقول المرتبطة بالإنجازات اليومية:',
    dossiersNotifiesLabel: 'الملفات المبلغة',
    dossiersExecutesLabel: 'عدد الملفات المنفذة',
    montantRecouvreLabel: 'المبالغ المستخلصة (د.م)',

    card3Title: 'الإجراءات الجبرية والمحاضر',
    nombrePVsLabel: 'عدد المحاضر',
    pvPositifLabel: 'إيجابي',
    pvNegatifLabel: 'سلبي',
    contrainteLabel: ' عدد طلبات الاكراه البدني ',

    card4Title: 'تتمة التنفيذات والتحصيل',
    dossiersAnnulationLabel: 'عدد الإلغاءات',
    dossiersIskatatLabel: 'عدد الإسقاطات',
    montantDelegationsLabel: 'عدد الإستردادات',
    montantRecouvreSuiteLabel: 'المبالغ المستخلصة',
    contrePersonnesLabel: 'ضد الأشخاص',
    contreSocietesLabel: 'ضد الشركات',
  };

  const getToken = () => sessionStorage.getItem('token') || localStorage.getItem('token');

  // جلب معلومات المستخدم
  useEffect(() => {
    const userStorage = sessionStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      const prenom = userData.prenom || userData?.clerk?.prenom || userData?.admin?.prenom || '';
      const nom = userData.nom || userData?.clerk?.nom || userData?.admin?.nom || '';
      let fullName = 'مستخدم';
      if (prenom || nom) {
        fullName = `${prenom} ${nom}`.trim();
      } else if (userData.name) {
        fullName = userData.name; 
      }
      setFormData(prev => ({ ...prev, employeeName: fullName }));
    }
  }, []);

  // --- جلب هيكلة الشُعب والإجراءات من الخادم ---
  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/sections-hierarchy', {
          headers: { 'Authorization': `Bearer ${getToken()}`, 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setHierarchyData(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, section: data[0].name }));
          }
        }
      } catch (error) {
        console.error("Erreur de chargement des sections:", error);
      } finally {
        setIsLoadingHierarchy(false);
      }
    };
    fetchHierarchy();
  }, []);

  // استخراج الفئات والمهام بناءً على الاختيار الحالي
  const selectedSectionData = hierarchyData.find(s => s.name === formData.section);
  const availableCategories = selectedSectionData ? selectedSectionData.categories : [];
  const selectedCategoryData = availableCategories.find(c => c.name === currentCategory);
  const currentTasks = selectedCategoryData ? selectedCategoryData.actions : [];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      if (name === 'section') {
        updatedData.selectedActions = [];
        setCurrentCategory('');
      }
      if (name === 'pvPositif' && !checked) updatedData.pvPositifCount = '';
      if (name === 'pvNegatif' && !checked) updatedData.pvNegatifCount = '';
      if (name === 'contrePersonnes' && !checked) updatedData.montantPersonnes = '';
      if (name === 'contreSocietes' && !checked) updatedData.montantSocietes = '';

      return updatedData;
    });
  };

  const toggleAction = (actionName) => {
    setFormData(prev => {
      const isSelected = prev.selectedActions.includes(actionName);
      return {
        ...prev,
        selectedActions: isSelected 
          ? prev.selectedActions.filter(a => a !== actionName) 
          : [...prev.selectedActions, actionName]              
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'جاري الحفظ...',
      text: 'الرجاء الانتظار',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/production-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: t.successMsg,
          confirmButtonColor: '#003366',
          timer: 2000
        });

        // مسح الحقول بعد الحفظ مع الاحتفاظ بالتاريخ المختار واسم الموظف
        setFormData(prev => ({
          ...prev, 
          registre: '', selectedActions: [], dossiersNotifies: '',
          dossiersExecutes: '', montantRecouvre: '', 
          pvPositif: false, pvPositifCount: '', 
          pvNegatif: false, pvNegatifCount: '', 
          contrainte: '', dossiersAnnulation: '', dossiersIskatat: '',
          montantDelegations: '', contrePersonnes: false, montantPersonnes: '', 
          contreSocietes: false, montantSocietes: ''
        }));
        setCurrentCategory('');
      } else {
        const errorData = await response.json();
        Swal.fire({ icon: 'error', title: 'خطأ', text: errorData.message || 'حدث خطأ أثناء الحفظ', confirmButtonColor: '#003366' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', text: 'تعذر الاتصال بالخادم', confirmButtonColor: '#003366' });
    }
  };

  

  const inputClassName = "w-full p-3.5 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-gray-50 transition-all text-[#003366] placeholder-gray-500 text-right";
  const labelClassName = "block text-sm font-semibold text-gray-700 mb-2 text-right";

  if (isLoadingHierarchy) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-[#003366]" /></div>;
  }


  return (
    <div className="bg-transparent max-w-5xl mx-auto mt-6" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
          <Activity className="w-7 h-7 text-[#003366]" />
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-[#003366]">{t.title}</h2>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="p-6 bg-white rounded-xl shadow-sm border-t border-b border-gray-100 border-r-4 border-r-[#003366] border-l">
          <label className="block text-lg font-bold text-[#003366] mb-3 text-right">
            {t.employeeLabel} <span className="text-red-500">*</span>
          </label>
          <input type="text" name="employeeName" value={formData.employeeName} readOnly disabled className="w-full p-4 text-base border-2 border-gray-200 rounded-lg bg-gray-100 text-[#003366] font-bold cursor-not-allowed transition-all text-right" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Informations Générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <Info className="w-5 h-5 text-[#003366]" />
              <h3 className="text-lg font-bold text-gray-800">{t.card1Title}</h3>
            </div>
            
            {/* 🔥 MODIFICATION ICI : md:grid-cols-3 au lieu de md:grid-cols-2 */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* 🔥 La date prend 1 seule colonne */}
              <div className="md:col-span-1">
                <label className={labelClassName}>{t.dateLabel}</label>
                <input 
                  type="date" 
                  name="todayDate"
                  value={formData.todayDate} 
                  onChange={handleChange}
                  className={`${inputClassName} bg-white cursor-pointer`}
                  required
                />
              </div>

              {/* 🔥 La section (شعبة) prend 2 colonnes pour avoir plus d'espace */}
              <div className="md:col-span-2">
                <label className={labelClassName}>{t.sectionLabel}</label>
                <select name="section" value={formData.section} onChange={handleChange} className={`${inputClassName} bg-white cursor-pointer`} required>
                  {hierarchyData.map((sec) => (<option key={sec.id} value={sec.name}>{sec.name}</option>))}
                </select>
              </div>

            </div>
          </div>

          {/* Card 2: Travail Administratif */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#003366]" />
                <h3 className="text-lg font-bold text-gray-800">{t.card2Title}</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-bold text-[#003366] text-right mb-2">
                    {t.actionCategoryLabel}
                  </label>
                  <div className="relative">
                    <select value={currentCategory} onChange={(e) => setCurrentCategory(e.target.value)} className={`${inputClassName} bg-white appearance-none truncate pl-10 cursor-pointer`}>
                      <option value="">اختر الفئة...</option>
                      {availableCategories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                    </select>
                    <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none left-4">
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3 bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[5rem]">
                  {!currentCategory ? (
                    <p className="text-gray-400 text-sm text-center mt-2">الرجاء اختيار فئة لعرض المهام المتاحة...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentTasks.map((task) => (
                        <label key={task.id} className="flex items-start gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
                          <input type="checkbox" checked={formData.selectedActions.includes(task.name)} onChange={() => toggleAction(task.name)} className="mt-1 w-5 h-5 rounded border-gray-300 text-[#003366] focus:ring-[#003366]" />
                          <span className="text-sm font-medium text-gray-700 leading-tight">{task.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {formData.selectedActions.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 mb-2 text-right">المهام المحددة ({formData.selectedActions.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedActions.map((action, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#003366]/10 text-[#003366] text-xs font-bold border border-[#003366]/20">
                        {action}
                        <button type="button" onClick={() => toggleAction(action)} className="hover:text-red-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 border-r-4 border-r-[#D4AF37]">
                <p className="text-sm text-gray-600 font-medium mb-5 text-right">{t.dependentFieldsHint}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClassName}>{t.dossiersNotifiesLabel}</label>
                    <input type="number" name="dossiersNotifies" min="0" value={formData.dossiersNotifies} onChange={handleChange} className={`${inputClassName} bg-white`} />
                  </div>
                  <div>
                    <label className={labelClassName}>{t.dossiersExecutesLabel}</label>
                    <input type="number" name="dossiersExecutes" min="0" value={formData.dossiersExecutes} onChange={handleChange} className={`${inputClassName} bg-white`} />
                  </div>
                  <div>
                    <label className={labelClassName}>{t.montantRecouvreLabel}</label>
                    <div className="relative">
                      <input type="number" name="montantRecouvre" min="0" step="0.01" value={formData.montantRecouvre} onChange={handleChange} className={`${inputClassName} bg-white font-mono pl-14`} />
                      <span className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded text-xs">MAD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Mesures Coercitives & PVs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-800">{t.card3Title}</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
                <label className={labelClassName}>{t.nombrePVsLabel}</label>
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer w-24">
                      <input type="checkbox" name="pvPositif" checked={formData.pvPositif} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                      <span className="font-bold text-gray-700">{t.pvPositifLabel}</span>
                    </label>
                    {formData.pvPositif && (
                      <input type="number" name="pvPositifCount" min="0" placeholder="العدد..." value={formData.pvPositifCount} onChange={handleChange} className={`${inputClassName} py-2 bg-white flex-1`} />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer w-24">
                      <input type="checkbox" name="pvNegatif" checked={formData.pvNegatif} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                      <span className="font-bold text-gray-700">{t.pvNegatifLabel}</span>
                    </label>
                    {formData.pvNegatif && (
                      <input type="number" name="pvNegatifCount" min="0" placeholder="العدد..." value={formData.pvNegatifCount} onChange={handleChange} className={`${inputClassName} py-2 bg-white flex-1`} />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
                <label className={labelClassName}>{t.contrainteLabel}</label>
                <div className="mt-1">
                  <input type="number" name="contrainte" min="0" value={formData.contrainte} onChange={handleChange} className={`${inputClassName} bg-white`} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Exécutions & Recouvrements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-800">{t.card4Title}</h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
                <label className={labelClassName}>{t.dossiersAnnulationLabel}</label>
                <div className="mt-1">
                  <input type="number" name="dossiersAnnulation" min="0" value={formData.dossiersAnnulation} onChange={handleChange} className={`${inputClassName} bg-white`} />
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
                <label className={labelClassName}>{t.dossiersIskatatLabel}</label>
                <div className="mt-1">
                  <input type="number" name="dossiersIskatat" min="0" value={formData.dossiersIskatat} onChange={handleChange} className={`${inputClassName} bg-white`} />
                </div>
              </div>
              
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 flex flex-col justify-center">
                <label className={labelClassName}>{t.montantDelegationsLabel}</label>
                <div className="relative mt-1">
                  <input type="number" name="montantDelegations" min="0" step="0.01" value={formData.montantDelegations} onChange={handleChange} className={inputClassName} />
                </div>
              </div>

            
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button type="submit" className="flex items-center gap-3 px-10 py-4 bg-[#003366] text-white rounded-xl text-lg font-bold hover:bg-[#004080] transition-colors shadow-lg hover:shadow-xl">
            <Save className="w-6 h-6" />
            <span>{t.save}</span>
          </button>
        </div>
      </form>
    </div>
  );
}