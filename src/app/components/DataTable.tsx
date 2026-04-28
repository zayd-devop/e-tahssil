import React from 'react';
import { Download, Filter, Edit3, Unlock, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DataTableProps {
  onFileClick: (file: any) => void;
}

export function DataTable({ onFileClick }: DataTableProps) {
  const language = 'ar';
  const isRTL = true;

  const translations = {
    ar: {
      title: 'مراقبة وتعديل عمليات الموظفين',
      subtitle: 'آخر 5 عمليات مصادق عليها من طرف كتاب الضبط',
      export: 'تصدير',
      filter: 'تصفية',
      clerkName: 'الموظف (كاتب الضبط)',
      date: 'التاريخ',
      operationType: 'نوع العملية',
      status: 'الحالة',
      actions: 'تعديل',
      statusRecovered: 'مُحصّل',
      statusPending: 'في الانتظار',
      statusFailed: 'تعذر التحصيل',
      opExtrait: 'تسجيل مستخرج',
      opNotification: 'تبليغ حكم',
      opCost: 'تصفية صوائر',
      unlock: 'إلغاء القفل والتعديل',
    },
    fr: {
      title: 'Contrôle et Modification des Opérations',
      subtitle: 'Les 5 dernières validations effectuées par les greffiers',
      export: 'Exporter',
      filter: 'Filtrer',
      clerkName: 'Greffier',
      date: 'Date',
      operationType: 'Type d\'opération',
      status: 'Statut',
      actions: 'Modifier',
      statusRecovered: 'Recouvré',
      statusPending: 'En attente',
      statusFailed: 'Échec',
      opExtrait: 'Enregistrement Extrait',
      opNotification: 'Notification Jugement',
      opCost: 'Liquidation Frais',
      unlock: 'Déverrouiller et Modifier',
    },
  };

  const t = translations[language];

  const operationsData = [
    {
      id: 1,
      clerk: 'سارة العلمي (Sarah)',
      date: '2026-04-04 10:30',
      type: t.opExtrait,
      status: 'recovered', // Green
    },
    {
      id: 2,
      clerk: 'كريم العلوي (Karim)',
      date: '2026-04-04 09:15',
      type: t.opNotification,
      status: 'pending', // Yellow
    },
    {
      id: 3,
      clerk: 'سارة العلمي (Sarah)',
      date: '2026-04-03 16:45',
      type: t.opCost,
      status: 'recovered', // Green
    },
    {
      id: 4,
      clerk: 'فاطمة الزهراء (Fatima)',
      date: '2026-04-03 14:20',
      type: t.opExtrait,
      status: 'failed', // Red
    },
    {
      id: 5,
      clerk: 'كريم العلوي (Karim)',
      date: '2026-04-03 11:10',
      type: t.opNotification,
      status: 'recovered', // Green
    },
  ];

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'recovered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            {t.statusRecovered}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-100 text-orange-800">
            <Clock className="w-3.5 h-3.5" />
            {t.statusPending}
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            {t.statusFailed}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-xl font-bold text-[#003366]">{t.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span>{t.filter}</span>
            </button>
            <button className="px-4 py-2 bg-[#003366] text-white rounded-lg text-sm font-medium hover:bg-[#004080] transition-colors flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4 text-white/80" />
              <span>{t.export}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
          <thead className="bg-[#f8fafc] border-b border-gray-200">
            <tr>
              <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-500 uppercase tracking-wider`}>
                {t.clerkName}
              </th>
              <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-500 uppercase tracking-wider`}>
                {t.date}
              </th>
              <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-500 uppercase tracking-wider`}>
                {t.operationType}
              </th>
              <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-500 uppercase tracking-wider`}>
                {t.status}
              </th>
              <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-bold text-gray-500 uppercase tracking-wider`}>
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {operationsData.map((op) => (
              <tr key={op.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#003366]/10 flex items-center justify-center text-[#003366] font-bold text-xs shrink-0">
                      {op.clerk.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-900">{op.clerk}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-600 font-mono">{op.date}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-[#003366]">{op.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusDisplay(op.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {op.status === 'recovered' ? (
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-lg text-xs font-bold transition-all border border-[#D4AF37]/30 shadow-sm">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{t.unlock}</span>
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-[#003366] hover:bg-gray-100 rounded-lg text-xs font-bold transition-all">
                      <Edit3 className="w-4 h-4" />
                      <span>{t.actions}</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
