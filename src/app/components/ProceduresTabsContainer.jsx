import React, { useState } from 'react';
import { DirectedProcedureModule } from './DirectedProcedureModule'; // كودك الأصلي الذي وضعته في طلبك
import FinancialFeesModule from './FinancialFeesModule'; // المكون الذي أنشأناه للتو

export default function ProceduresTabsContainer({ onLogout }) {
  const [activeTab, setActiveTab] = useState('directed');

  const tabs = [
    { id: 'directed', label: 'في طور التبليغ' },
    { id: 'complementary', label: 'الرسوم التكميلية' },
    { id: 'legal_aid', label: 'صوائر المساعدة القضائية' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10" dir="rtl">
      
      {/* شريط التبويبات */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[98%] mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-5 text-lg font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'text-[#003366]' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#D4AF37] rounded-t-lg shadow-[0_-2px_10px_rgba(212,175,55,0.5)] animate-in slide-in-from-bottom-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* محتوى التبويب المختار */}
      <div className="pt-4">
        {activeTab === 'directed' && <DirectedProcedureModule onLogout={onLogout} />}
        
        {activeTab === 'complementary' && (
          <div className="max-w-[95%] mx-auto py-6">
            <FinancialFeesModule 
              type="complementary" 
              title="الرسوم التكميلية" 
              tableHeaderTitle="رقم سجل تصفية صوائر الرسوم التكميلية" 
            />
          </div>
        )}

        {activeTab === 'legal_aid' && (
          <div className="max-w-[95%] mx-auto py-6">
            <FinancialFeesModule 
              type="legal_aid" 
              title="صوائر المساعدة القضائية" 
              tableHeaderTitle="رقم سجل تصفية صوائر المساعدة القضائية" 
            />
          </div>
        )}
      </div>

    </div>
  );
}