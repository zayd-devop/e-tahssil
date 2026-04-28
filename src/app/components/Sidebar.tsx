import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Bell, 
  Wallet, 
  Calculator, 
  BookOpen, 
  FileSignature 
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  role: 'admin' | 'clerk';
}

export function Sidebar({ activeMenu, onMenuChange, role }: SidebarProps) {
  const language = 'ar';
  const menuItems = [
    { id: 'bureau', icon: LayoutDashboard, labelAr: 'لوحة القيادة', labelFr: "Tableau de bord", adminOnly: true },
    { id: 'production', icon: ClipboardList, labelAr: 'بطائق الإنتاج', labelFr: 'Cartes de Production' },
    { id: 'notification', icon: Bell, labelAr: 'تبليغ المقررات', labelFr: 'Notification des Jugements' },
    { id: 'recouvrement', icon: Wallet, labelAr: 'التحصيل', labelFr: 'Recouvrement' },
    { id: 'frais', icon: Calculator, labelAr: 'تصفية الصوائر', labelFr: 'Liquidation des Dépens' },
    { id: 'extraits', icon: BookOpen, labelAr: 'سجل المستخرجات', labelFr: 'Registre des Extraits' },
    { id: 'documents', icon: FileSignature, labelAr: 'توليد الوثائق', labelFr: 'Générateur de Documents' },
  ];

  const label = language === 'ar' ? 'labelAr' : 'labelFr';

  return (
    <aside className={`w-72 bg-[#003366] text-white flex flex-col ${language === 'ar' ? 'border-l' : 'border-r'} border-[#004080]`}>
      {/* Logo */}
      <div className="p-6 border-b border-[#004080]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-lg flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-[#003366] font-bold text-xl">AT</span>
          </div>
          <div className={language === 'ar' ? 'text-right overflow-hidden' : 'text-left overflow-hidden'}>
            <h1 className="font-bold text-lg truncate">Adl-Tahssil</h1>
            <p className="text-xs text-[#D4AF37] truncate font-medium">
              {language === 'ar' ? 'نظام العدل والتحصيل' : 'E-Justice Adl-Tahssil'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.adminOnly && role !== 'admin') return null;
            
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37] shadow-sm font-bold'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white font-medium'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#D4AF37]/20' : 'bg-transparent'}`}>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-sm ${language === 'ar' ? 'text-right' : 'text-left'} flex-1`}>
                    {item[label]}
                  </span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-[#004080]">
        <div className="text-xs text-gray-400 text-center font-medium">
          © 2026 Adl-Tahssil
        </div>
      </div>
    </aside>
  );
}