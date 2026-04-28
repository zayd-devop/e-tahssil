import React, { useState } from 'react';
import { FraisStatsForm } from './FraisStatsForm';
import { FraisLiquidationTable } from './FraisLiquidationTable';
import { FraisSaisieForm } from './FraisSaisieForm';
import { BarChart3, FileSpreadsheet, Calculator } from 'lucide-react';

interface FraisModuleProps {}

export function FraisModule({}: FraisModuleProps = {}) {
  const language = 'ar';
  const isRTL = true;
  const [activeTab, setActiveTab] = useState<'stats' | 'bilan' | 'saisie'>('stats');

  const tabs = [
    {
      id: 'stats',
      labelAr: 'إدخال الإحصائيات',
      labelFr: 'Saisie des Statistiques',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'bilan',
      labelAr: 'الإحصاء الشهري',
      labelFr: 'Bilan Mensuel',
      icon: <FileSpreadsheet className="w-5 h-5" />
    },
    {
      id: 'saisie',
      labelAr: 'الإدخال الفردي (غرامات)',
      labelFr: 'Saisie Unitaire',
      icon: <Calculator className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-6 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Modern Tabs Navigation */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm border border-gray-200 flex overflow-x-auto w-fit max-w-full">
        <div className="flex items-center gap-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#003366] text-white shadow-md transform scale-[1.02]' 
                    : 'bg-transparent text-gray-500 hover:text-[#003366] hover:bg-gray-100'
                }`}
              >
                <span className={isActive ? 'text-[#D4AF37]' : 'opacity-70'}>{tab.icon}</span>
                <span>{language === 'ar' ? tab.labelAr : tab.labelFr}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-opacity duration-300">
        {activeTab === 'stats' && <FraisStatsForm />}
        {activeTab === 'bilan' && <FraisLiquidationTable />}
        {activeTab === 'saisie' && <FraisSaisieForm />}
      </div>
    </div>
  );
}