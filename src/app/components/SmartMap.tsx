import React from 'react';
import { MapPin, Navigation, Users } from 'lucide-react';

interface SmartMapProps {}

export function SmartMap({}: SmartMapProps = {}) {
  const language = 'ar';
  const isRTL = true;
  const translations = {
    ar: {
      title: 'توزيع المفوضين القضائيين',
      subtitle: 'اختصاص محكمة الدار البيضاء - تتبع فوري للأعوان',
      assignRoute: 'تعيين مسار',
      jurisdiction: 'منطقة الاختصاص',
      casaCenter: 'الدار البيضاء - المركز',
      active: 'نشط',
      idle: 'غير متصل',
      totalOfficers: 'إجمالي الأعوان',
      currentlyActive: 'نشط حالياً',
      filesToday: 'ملفات اليوم',
      officersInField: 'عون في الميدان',
      filesWaiting: 'ملف في انتظار التعيين',
      autoAssign: 'توزيع تلقائي',
      status: 'الحالة',
      files: 'الملفات',
    },
    fr: {
      title: 'Répartition des Huissiers',
      subtitle: 'Juridiction Tribunal Casablanca - Suivi temps réel',
      assignRoute: 'Assigner Itinéraire',
      jurisdiction: 'ZONE JURIDICTIONNELLE',
      casaCenter: 'Casablanca Centre',
      active: 'Actif',
      idle: 'Inactif',
      totalOfficers: 'Total Agents',
      currentlyActive: 'Actuellement actifs',
      filesToday: 'Dossiers aujourd\'hui',
      officersInField: 'agents sur terrain',
      filesWaiting: 'dossiers en attente',
      autoAssign: 'Auto-Attribution',
      status: 'Statut',
      files: 'Dossiers',
    },
  };

  const t = translations[language];

  const officers = [
    { id: 1, name: isRTL ? 'العوني العلمي' : 'Agent Alami', status: 'active', position: { x: 35, y: 45 }, files: 8 },
    { id: 2, name: isRTL ? 'العوني خليل' : 'Agent Khalil', status: 'active', position: { x: 55, y: 35 }, files: 12 },
    { id: 3, name: isRTL ? 'العونية البناني' : 'Agent Bennani', status: 'idle', position: { x: 70, y: 60 }, files: 0 },
    { id: 4, name: isRTL ? 'العوني رشيد' : 'Agent Rachid', status: 'active', position: { x: 45, y: 70 }, files: 6 },
    { id: 5, name: isRTL ? 'العوني زكي' : 'Agent Zaki', status: 'idle', position: { x: 25, y: 25 }, files: 0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className={`text-lg font-bold text-gray-900 flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <span>{t.title}</span>
              <Navigation className="w-5 h-5 text-[#003366]" />
            </h2>
            <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
          </div>
          <button className="px-4 py-2 bg-[#003366] text-white rounded-lg text-sm font-medium hover:bg-[#004080] transition-colors">
            {t.assignRoute}
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative bg-gradient-to-br from-blue-50 to-gray-100 h-96">
        {/* Map Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#003366" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Map Labels */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md ${isRTL ? 'text-right' : 'text-left'}`}>
          <p className="text-xs font-medium text-gray-600">{t.jurisdiction}</p>
          <p className="text-sm font-bold text-[#003366]">{t.casaCenter}</p>
        </div>

        {/* Legend */}
        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700">{t.active}</span>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-700">{t.idle}</span>
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Officer Pins */}
        {officers.map((officer) => (
          <div
            key={officer.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${officer.position.x}%`, top: `${officer.position.y}%` }}
          >
            <div className={`relative ${officer.status === 'active' ? 'animate-pulse' : ''}`}>
              <MapPin
                className={`w-8 h-8 ${
                  officer.status === 'active' ? 'text-emerald-500' : 'text-gray-400'
                } drop-shadow-lg`}
                fill={officer.status === 'active' ? '#10b981' : '#9ca3af'}
              />
              {officer.files > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {officer.files}
                </span>
              )}
            </div>
            {/* Tooltip */}
            <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="font-medium">{officer.name}</p>
              <p className="text-gray-300">{t.status}: {officer.status === 'active' ? t.active : t.idle}</p>
              {officer.files > 0 && <p className="text-gray-300">{t.files}: {officer.files}</p>}
            </div>
          </div>
        ))}

        {/* Assign Route Card Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-80">
          <div className="flex items-center gap-3">
            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="text-sm font-medium text-gray-900">12 {t.officersInField}</p>
              <p className="text-xs text-gray-600">32 {t.filesWaiting}</p>
            </div>
            <div className="w-10 h-10 bg-[#003366]/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[#003366]" />
            </div>
            <button className="px-3 py-1.5 bg-[#D4AF37] text-white rounded-lg text-xs font-medium hover:bg-[#C5A028] transition-colors">
              {t.autoAssign}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#003366]">12</p>
            <p className="text-xs text-gray-600">{t.totalOfficers}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">8</p>
            <p className="text-xs text-gray-600">{t.currentlyActive}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#D4AF37]">32</p>
            <p className="text-xs text-gray-600">{t.filesToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
