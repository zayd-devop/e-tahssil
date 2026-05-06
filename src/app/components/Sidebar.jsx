import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Bell, 
  Wallet, 
  Calculator, 
  BookOpen, 
  FileSignature,
  FileSpreadsheet,
  Users,
  Send
} from 'lucide-react';

export function Sidebar({ activeMenu, onMenuChange, role }) {
  const menuItems = [
    { id: 'bureau', icon: LayoutDashboard, label: 'لوحة القيادة', adminOnly: true },
    { id: 'production', icon: ClipboardList, label: 'بطائق الإنتاج' },
    { id: 'directed', icon: FileSpreadsheet, label: 'إجراء يوجه' },
    { id: 'correspondences', icon: Send, label: 'المراسلات'},
    { id: 'outstanding', icon: BookOpen, label: 'الباقي بدون تحصيل' },
    // { id: 'notification', icon: Bell, label: 'تبليغ المقررات' },
    // { id: 'recouvrement', icon: Wallet, label: 'التحصيل' },
    { id: 'frais', icon: Calculator, label: 'تصفية الصوائر' },
    // { id: 'extraits', icon: BookOpen, label: 'سجل المستخرجات' },
    { id: 'documents', icon: FileSignature, label: 'توليد الوثائق' },
    { id: 'users', icon: Users, label: 'إدارة الموظفين', adminOnly: true },
  ];

  return (
    <aside className="w-72 bg-[#003366] text-white flex flex-col border-l border-[#004080]">
      {/* Logo */}
      <div className="p-6 border-b border-[#004080]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-lg flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-[#003366] font-bold text-xl">ET</span>
          </div>
          <div className="text-right overflow-hidden">
            <h1 className="font-bold text-lg truncate">E-Tahssil</h1>
            <p className="text-xs text-[#D4AF37] truncate font-medium">
              شعبة التبليغ والتحصيل
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // Cacher les éléments réservés à l'admin si l'utilisateur est un clerk (كاتب)
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
                  <span className="text-sm text-right flex-1">
                    {item.label}
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
          © 2026  جميع الحقوق محفوظة
        </div>
      </div>
    </aside>
  );
}