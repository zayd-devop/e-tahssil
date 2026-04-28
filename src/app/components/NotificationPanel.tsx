import React from 'react';
import { X, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const language = 'ar';
  const isRTL = true;
  const translations = {
    ar: {
      title: 'الإشعارات',
      viewAll: 'عرض جميع الإشعارات',
      notifications: [
        {
          id: 1,
          type: 'critical',
          title: 'تحذير: اقتراب موعد التقادم',
          message: 'الملف 2026/847 سيتقادم خلال 15 يوماً',
          time: 'منذ 10 دقائق',
          icon: AlertCircle,
        },
        {
          id: 2,
          type: 'success',
          title: 'تم استلام الدفعة',
          message: 'تم استلام مبلغ 45,000 د.م للملف 2026/891',
          time: 'منذ ساعة',
          icon: CheckCircle,
        },
        {
          id: 3,
          type: 'info',
          title: 'تحديث حالة الملف',
          message: 'الملف 2026/1234 تم تحديثه إلى "حجز قيد التنفيذ"',
          time: 'منذ 3 ساعات',
          icon: Info,
        },
        {
          id: 4,
          type: 'warning',
          title: 'تأخير في التبليغ',
          message: 'تأخر تبليغ الملف 2026/562 عن الموعد المحدد',
          time: 'منذ 5 ساعات',
          icon: Clock,
        },
      ],
    },
    fr: {
      title: 'Notifications',
      viewAll: 'Voir toutes les notifications',
      notifications: [
        {
          id: 1,
          type: 'critical',
          title: 'Alerte: Date de prescription proche',
          message: 'Le dossier 2026/847 expire dans 15 jours',
          time: 'Il y a 10 minutes',
          icon: AlertCircle,
        },
        {
          id: 2,
          type: 'success',
          title: 'Paiement reçu',
          message: '45 000 MAD reçus pour le dossier 2026/891',
          time: 'Il y a 1 heure',
          icon: CheckCircle,
        },
        {
          id: 3,
          type: 'info',
          title: 'Mise à jour statut dossier',
          message: 'Dossier 2026/1234 mis à jour vers "Saisie en cours"',
          time: 'Il y a 3 heures',
          icon: Info,
        },
        {
          id: 4,
          type: 'warning',
          title: 'Retard de notification',
          message: 'Notification du dossier 2026/562 en retard',
          time: 'Il y a 5 heures',
          icon: Clock,
        },
      ],
    },
  };

  const t = translations[language];

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' };
      case 'success':
        return { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-600' };
      case 'warning':
        return { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' };
      default:
        return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-[#003366] text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{t.title}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
          {t.notifications.map((notification: any) => {
            const style = getNotificationStyle(notification.type);
            const Icon = notification.icon;
            
            return (
              <div 
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${style.bg}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1 justify-start">
                      <h3 className="font-medium text-gray-900 text-sm">{notification.title}</h3>
                      <Icon className={`w-5 h-5 ${style.icon}`} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full py-2 text-sm font-medium text-[#003366] hover:underline">
            {t.viewAll}
          </button>
        </div>
      </div>
    </div>
  );
}
