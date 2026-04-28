import React, { useState } from 'react';
import { Save, FolderOpen, User, Send, FileCheck, LayoutList } from 'lucide-react';

interface NotificationFormProps {}

export function NotificationForm({}: NotificationFormProps = {}) {
  const language = 'ar';
  const isRTL = true;

  const [formData, setFormData] = useState({
    dossierNum: '',
    typeJugement: '',
    jugementDate: '',
    destinataireNom: '',
    destinataireAdresse: '',
    agent: '',
    remiseDate: '',
    retourDate: '',
    resultat: '',
    observations: ''
  });

  const translations = {
    ar: {
      pageTitle: 'إدخال التبليغات القضائية',
      pageSubtitle: 'سجل التبليغات القضائية الرقمي',
      
      card1Title: 'مراجع الملف',
      dossierNum: 'رقم الملف',
      typeJugement: 'نوع المقرر',
      selectTypeJugement: '--- اختر نوع المقرر ---',
      typeJugementList: ['حضوري', 'غيابي', 'بمثابة حضوري'],
      jugementDate: 'تاريخ المقرر',
      
      card2Title: 'المبلغ إليه',
      destinataireNom: 'اسم المبلغ إليه',
      destinataireAdresse: 'العنوان الكامل',
      
      card3Title: 'إسناد التبليغ',
      agent: 'العون أو المفوض القضائي',
      selectAgent: '--- اختر العون ---',
      agentsList: ['أحمد بن علي', 'عمار خجوي', 'فاطمة الزهراء', 'كريم العلوي'],
      remiseDate: 'تاريخ تسليم الطي للعون',
      
      card4Title: 'المرجوعات ومآل التبليغ',
      retourDate: 'تاريخ إرجاع شهادة التسليم',
      resultat: 'نتيجة التبليغ',
      selectResultat: '--- اختر النتيجة ---',
      resultatsList: ['سلمت لشخصه', 'سلمت لغيره', 'رفض التسلم', 'مجهول بالعنوان'],
      observations: 'ملاحظات',
      
      saveBtn: 'حفظ التبليغ',
      successMsg: 'تم حفظ التبليغ بنجاح'
    },
    fr: {
      pageTitle: 'Saisie des Notifications Judiciaires',
      pageSubtitle: 'Registre digital des notifications judiciaires',
      
      card1Title: 'Références du Dossier',
      dossierNum: 'N° du dossier',
      typeJugement: 'Type de jugement',
      selectTypeJugement: '--- Sélectionner le type ---',
      typeJugementList: ['Présentiel', 'Par défaut', 'Réputé contradictoire'],
      jugementDate: 'Date du jugement',
      
      card2Title: 'Destinataire',
      destinataireNom: 'Nom et Prénom',
      destinataireAdresse: 'Adresse complète',
      
      card3Title: 'Affectation',
      agent: 'Agent ou Huissier',
      selectAgent: '--- Sélectionner l\'agent ---',
      agentsList: ['Ahmed Ben Ali', 'Ammar Khajoui', 'Fatima Zahra', 'Karim Alaoui'],
      remiseDate: 'Date de remise du pli',
      
      card4Title: 'Retour & Résultat',
      retourDate: 'Date de retour du certificat',
      resultat: 'Résultat de la notification',
      selectResultat: '--- Sélectionner le résultat ---',
      resultatsList: ['Remis à personne', 'Remis à un tiers', 'Refus', 'Adresse inconnue'],
      observations: 'Observations',
      
      saveBtn: 'Enregistrer la notification',
      successMsg: 'Notification enregistrée avec succès'
    }
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.successMsg);
  };

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
                <label className={labelClassName}>{t.dossierNum}</label>
                <input type="text" name="dossierNum" value={formData.dossierNum} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.typeJugement}</label>
                <select name="typeJugement" value={formData.typeJugement} onChange={handleChange} className={inputClassName} required>
                  <option value="">{t.selectTypeJugement}</option>
                  {t.typeJugementList.map((type, idx) => <option key={idx} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClassName}>{t.jugementDate}</label>
                <input type="date" name="jugementDate" value={formData.jugementDate} onChange={handleChange} className={inputClassName} required />
              </div>
            </div>
          </div>

          {/* Card 2: Destinataire */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <User className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card2Title}</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={labelClassName}>{t.destinataireNom}</label>
                <input type="text" name="destinataireNom" value={formData.destinataireNom} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.destinataireAdresse}</label>
                <textarea name="destinataireAdresse" value={formData.destinataireAdresse} onChange={handleChange} className={`${inputClassName} min-h-[100px] resize-y`} required />
              </div>
            </div>
          </div>

          {/* Card 3: Affectation */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <Send className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">{t.card3Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>{t.agent}</label>
                <select name="agent" value={formData.agent} onChange={handleChange} className={inputClassName} required>
                  <option value="">{t.selectAgent}</option>
                  {t.agentsList.map((ag, idx) => <option key={idx} value={ag}>{ag}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClassName}>{t.remiseDate}</label>
                <input type="date" name="remiseDate" value={formData.remiseDate} onChange={handleChange} className={inputClassName} required />
              </div>
            </div>
          </div>

          {/* Card 4: Retour & Résultat */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-[#D4AF37]/50 overflow-hidden relative shadow-[#D4AF37]/10">
            <div className={`absolute top-0 w-2 h-full bg-gradient-to-b from-[#D4AF37] to-[#C5A028] ${isRTL ? 'right-0' : 'left-0'}`} />
            <div className="bg-gradient-to-r from-white to-[#D4AF37]/10 px-6 py-4 border-b border-[#D4AF37]/20 flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-[#003366]" />
              <h2 className="text-xl font-black text-[#003366]">{t.card4Title}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>{t.retourDate}</label>
                <input type="date" name="retourDate" value={formData.retourDate} onChange={handleChange} className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>{t.resultat}</label>
                <select 
                  name="resultat" 
                  value={formData.resultat} 
                  onChange={handleChange} 
                  className={`w-full p-3.5 text-base sm:text-lg font-bold border-2 rounded-lg focus:outline-none transition-all cursor-pointer ${
                    formData.resultat 
                      ? 'border-[#003366] bg-[#003366]/5 text-[#003366] ring-2 ring-[#003366]/20' 
                      : 'border-[#D4AF37] bg-white text-gray-700 hover:bg-[#D4AF37]/5'
                  }`} 
                  required
                >
                  <option value="" disabled className="text-gray-400 font-normal">{t.selectResultat}</option>
                  {t.resultatsList.map((res, idx) => <option key={idx} value={res} className="font-semibold text-gray-800">{res}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelClassName}>{t.observations}</label>
                <textarea name="observations" value={formData.observations} onChange={handleChange} className={`${inputClassName} min-h-[80px]`} />
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