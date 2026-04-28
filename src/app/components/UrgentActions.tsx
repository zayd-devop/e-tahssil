import React from 'react';
import { AlertCircle, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface UrgentActionsProps {}

export function UrgentActions({}: UrgentActionsProps = {}) {
  const language = 'ar';
  const isRTL = true;
  const translations = {
    ar: {
      title: 'مهام عاجلة',
      subtitle: 'ملفات تتطلب مصادقة قضائية فورية',
      viewAll: 'عرض جميع المهام المعلقة',
      critical: 'عاجل جداً',
      high: 'عاجل',
      medium: 'متوسط',
      tasks: [
        {
          title: 'المصادقة على طلب الإكراه البدني',
          fileRef: '2023/12',
          priority: 'critical',
          time: 'منذ ساعتين',
          description: 'فشل المدين في 3 محاولات للأداء',
        },
        {
          title: 'المصادقة على أمر الحجز',
          fileRef: '2024/55',
          priority: 'high',
          time: 'منذ 5 ساعات',
          description: 'اكتمل تقييم الأصول',
        },
        {
          title: 'مراجعة وثيقة الاستئناف',
          fileRef: '2024/562',
          priority: 'medium',
          time: 'منذ يوم واحد',
          description: 'قدم المدعى عليه اعتراضاً',
        },
        {
          title: 'تأكيد توزيع الدفع',
          fileRef: '2024/891',
          priority: 'high',
          time: 'منذ 3 ساعات',
          description: 'تم استلام 45,000 درهم',
        },
      ],
    },
    fr: {
      title: 'Actions Urgentes',
      subtitle: 'Dossiers nécessitant validation judiciaire immédiate',
      viewAll: 'Voir toutes les tâches en attente',
      critical: 'TRÈS URGENT',
      high: 'URGENT',
      medium: 'MOYEN',
      tasks: [
        {
          title: 'Approuver demande de contrainte par corps',
          fileRef: '2023/12',
          priority: 'critical',
          time: 'Il y a 2 heures',
          description: 'Débiteur a échoué 3 tentatives de paiement',
        },
        {
          title: 'Valider ordre de saisie',
          fileRef: '2024/55',
          priority: 'high',
          time: 'Il y a 5 heures',
          description: 'Évaluation des actifs terminée',
        },
        {
          title: 'Examiner document d\'appel',
          fileRef: '2024/562',
          priority: 'medium',
          time: 'Il y a 1 jour',
          description: 'Défendeur a soumis une objection',
        },
        {
          title: 'Confirmer distribution paiement',
          fileRef: '2024/891',
          priority: 'high',
          time: 'Il y a 3 heures',
          description: '45 000 DH reçus',
        },
      ],
    },
  };

  const t = translations[language];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return t.critical;
      case 'high':
        return t.high;
      default:
        return t.medium;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200" dir={isRTL ? 'rtl' : 'ltr'}>
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span>{t.title}</span>
          <AlertCircle className="w-5 h-5 text-red-500" />
        </h2>
        <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="divide-y divide-gray-100">
          {t.tasks.map((item, index) => (
            <div
              key={index}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'justify-end' : 'justify-start'} flex-wrap`}>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      {item.time}
                      <Clock className="w-3 h-3" />
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                        item.priority
                      )}`}
                    >
                      {getPriorityLabel(item.priority)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                  <p className="text-xs font-mono text-[#003366] font-medium">
                    {isRTL ? `ملف رقم: ${item.fileRef}` : `Dossier N°: ${item.fileRef}`}
                  </p>
                </div>
                {isRTL ? (
                  <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#003366] transition-colors flex-shrink-0 mt-1" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#003366] transition-colors flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-gray-200 bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <button className="w-full px-4 py-2 bg-[#003366] text-white rounded-lg text-sm font-medium hover:bg-[#004080] transition-colors flex items-center justify-center gap-2">
          <span>{t.viewAll}</span>
          <CheckCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
