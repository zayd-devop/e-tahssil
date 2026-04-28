import React, { useState } from 'react';
import { FileText, Download, Car, UserX } from 'lucide-react';

interface DocumentGeneratorProps {}

export function DocumentGenerator({}: DocumentGeneratorProps = {}) {
  const language = 'ar';
  const isRTL = true;
  const [docType, setDocType] = useState('car');
  
  const translations = {
    ar: {
      title: 'توليد الوثائق الرسمية',
      subtitle: 'نماذج احترافية للقرارات القضائية',
      carOpp: 'التعرض على نقل ملكية سيارة',
      coercion: 'طلب الإكراه البدني',
      vin: 'رقم الإطار (VIN)',
      hp: 'القوة الجبائية (الخيل)',
      cin: 'رقم البطاقة الوطنية للمعني',
      amount: 'المبلغ المستحق (د.م)',
      generate: 'توليد المستند',
      downloading: 'جاري تحميل المستند...',
    },
    fr: {
      title: 'Générateur de Documents',
      subtitle: 'Modèles professionnels de décisions judiciaires',
      carOpp: 'Opposition au Transfert de Propriété (Véhicule)',
      coercion: 'Requête de Contrainte par Corps',
      vin: 'Numéro de Châssis (VIN)',
      hp: 'Puissance Fiscale (CV)',
      cin: 'CIN de la partie concernée',
      amount: 'Montant Dû (MAD)',
      generate: 'Générer le Document',
      downloading: 'Téléchargement en cours...',
    }
  };

  const t = translations[language];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t.downloading);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto mt-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl font-bold text-[#003366]">{t.title}</h2>
            <p className="text-gray-500 mt-1">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Document Selection */}
        <div className="w-full md:w-1/3 space-y-4">
          <button
            type="button"
            onClick={() => setDocType('car')}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
              docType === 'car' 
                ? 'border-[#003366] bg-[#003366]/5 text-[#003366]' 
                : 'border-gray-200 hover:border-[#D4AF37] text-gray-600'
            }`}
          >
            <Car className="w-6 h-6" />
            <span className={`font-semibold text-sm leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>{t.carOpp}</span>
          </button>

          <button
            type="button"
            onClick={() => setDocType('coercion')}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
              docType === 'coercion' 
                ? 'border-[#003366] bg-[#003366]/5 text-[#003366]' 
                : 'border-gray-200 hover:border-[#D4AF37] text-gray-600'
            }`}
          >
            <UserX className="w-6 h-6" />
            <span className={`font-semibold text-sm leading-tight ${isRTL ? 'text-right' : 'text-left'}`}>{t.coercion}</span>
          </button>
        </div>

        {/* Dynamic Form */}
        <div className="w-full md:w-2/3 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <form onSubmit={handleGenerate} className="space-y-5">
            {docType === 'car' ? (
              <>
                <div>
                  <label className={`block text-sm font-semibold text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t.vin}</label>
                  <input type="text" className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent font-mono uppercase text-[#003366] placeholder-gray-500 ${isRTL ? 'text-right' : 'text-left'}`} placeholder="MA..." required />
                </div>
                <div>
                  <label className={`block text-sm font-semibold text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t.hp}</label>
                  <input type="number" min="1" className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent text-[#003366] placeholder-gray-500 ${isRTL ? 'text-right' : 'text-left'}`} required />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={`block text-sm font-semibold text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t.cin}</label>
                  <input type="text" className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent font-mono uppercase text-[#003366] placeholder-gray-500 ${isRTL ? 'text-right' : 'text-left'}`} required />
                </div>
                <div>
                  <label className={`block text-sm font-semibold text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>{t.amount}</label>
                  <input type="number" min="1" className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent font-mono text-[#003366] placeholder-gray-500 ${isRTL ? 'text-right' : 'text-left'}`} required />
                </div>
              </>
            )}

            <div className={`pt-4 mt-4 border-t border-gray-200 flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg font-bold hover:bg-[#C5A028] transition-colors shadow-md"
              >
                <Download className="w-5 h-5" />
                <span>{t.generate}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
