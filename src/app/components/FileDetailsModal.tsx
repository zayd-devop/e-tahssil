import React from 'react';
import { X, Calendar, User, DollarSign, FileText } from 'lucide-react';
import { CaseFileTimeline } from './CaseFileTimeline';

interface FileDetailsModalProps {
  file: any;
  onClose: () => void;
}

export function FileDetailsModal({ file, onClose }: FileDetailsModalProps) {
  const language = 'ar';
  const isRTL = true;
  const translations = {
    ar: {
      title: 'تفاصيل الملف:',
      partyName: 'اسم الطرف',
      amount: 'المبلغ المطلوب',
      caseType: 'نوع القضية',
      registrationDate: 'تاريخ التسجيل',
      timeline: 'التسلسل الزمني للإجراءات',
      close: 'إغلاق',
      printReport: 'طباعة التقرير',
      editFile: 'تعديل الملف',
      timelineItems: [
        { date: '2026-02-01', action: 'تم إرسال التبليغ إلى الطرف المعني', status: 'completed' },
        { date: '2026-01-28', action: 'تعيين المفوض القضائي', status: 'completed' },
        { date: '2026-01-25', action: 'فتح الملف وتسجيله في النظام', status: 'completed' },
      ],
    },
    fr: {
      title: 'Détails du dossier:',
      partyName: 'Nom de la partie',
      amount: 'Montant demandé',
      caseType: 'Type de cas',
      registrationDate: 'Date d\'enregistrement',
      timeline: 'Chronologie des procédures',
      close: 'Fermer',
      printReport: 'Imprimer rapport',
      editFile: 'Modifier dossier',
      timelineItems: [
        { date: '01/02/2026', action: 'Notification envoyée à la partie concernée', status: 'completed' },
        { date: '28/01/2026', action: 'Huissier désigné', status: 'completed' },
        { date: '25/01/2026', action: 'Dossier ouvert et enregistré dans le système', status: 'completed' },
      ],
    },
  };

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#003366] text-white p-6 rounded-t-xl flex items-center justify-between">
          <h2 className="text-xl font-bold">{t.title} {file.ref}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 justify-start">
                <span className="text-sm text-gray-600">{t.caseType}</span>
                <FileText className="w-4 h-4 text-[#003366]" />
              </div>
              <p className={`text-lg font-bold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>{file.judgment || '-'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2 justify-start">
                <span className="text-sm text-gray-600">{language === 'ar' ? 'أجل التقادم' : 'Prescription'}</span>
                <Calendar className="w-4 h-4 text-[#003366]" />
              </div>
              <p className={`text-lg font-bold text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{file.prescriptionText || '-'}</p>
            </div>
          </div>

          {/* Case File Timeline Component */}
          <div className="border-t pt-6">
            <CaseFileTimeline language={language} file={file} />
          </div>

          {/* Actions */}
          <div className="border-t pt-6 flex gap-3 justify-end">
            <button className="px-6 py-2 bg-[#003366] text-white rounded-lg font-medium hover:bg-[#004080] transition-colors">
              {t.editFile}
            </button>
            <button className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C5A028] transition-colors">
              {t.printReport}
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
