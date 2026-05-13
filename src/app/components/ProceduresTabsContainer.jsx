import React, { useState } from 'react';
import { DirectedProcedureModule } from './DirectedProcedureModule';
import FinancialFeesModule from './FinancialFeesModule';
import { Send, Coins, Scale } from 'lucide-react';

export default function ProceduresTabsContainer({ onLogout }) {
  const [activeTab, setActiveTab] = useState('directed');

  const tabs = [
    { 
      id: 'directed', 
      label: 'في طور التبليغ',
      icon: <Send className="w-5 h-5" />
    },
    { 
      id: 'complementary', 
      label: 'الرسوم التكميلية',
      icon: <Coins className="w-5 h-5" />
    },
    { 
      id: 'legal_aid', 
      label: 'صوائر المساعدة القضائية',
      icon: <Scale className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10" dir="rtl">
      
      {/* شريط التبويبات - التصميم الحديث */}
      <div className="max-w-[95%] mx-auto pt-6 px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1.5 shadow-sm border border-gray-200 flex overflow-x-auto w-fit max-w-full">
          <div className="flex items-center gap-1">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  // 🔥 Ajout de cursor-pointer ici 👇
                  className={`cursor-pointer flex items-center gap-2.5 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#003366] text-white shadow-md transform scale-[1.02]' 
                      : 'bg-transparent text-gray-500 hover:text-[#003366] hover:bg-gray-100'
                  }`}
                >
                  <span className={isActive ? 'text-[#D4AF37]' : 'opacity-70'}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* محتوى التبويب المختار */}
      <div className="pt-6 transition-opacity duration-300">
        {activeTab === 'directed' && <DirectedProcedureModule onLogout={onLogout} />}
        
        {activeTab === 'complementary' && (
          <div className="max-w-[95%] mx-auto">
            <FinancialFeesModule 
              type="complementary" 
              title="الرسوم التكميلية" 
              tableHeaderTitle="رقم تصفية ر.ت" 
            />
          </div>
        )}

        {activeTab === 'legal_aid' && (
          <div className="max-w-[95%] mx-auto">
            <FinancialFeesModule 
              type="legal_aid" 
              title="صوائر المساعدة القضائية" 
              tableHeaderTitle="رقم تصفية م.ق" 
            />
          </div>
        )}
      </div>

    </div>
  );
}