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
  Send,
  Gavel
} from 'lucide-react';

export function Sidebar({ activeMenu, onMenuChange, role }) {
  const menuItems = [
    { id: 'bureau', icon: LayoutDashboard, label: 'لوحة القيادة', adminOnly: true },
    { id: 'production', icon: ClipboardList, label: 'بطائق الإنتاج' },
    { id: 'hearing', icon: Gavel, label: 'محضر الجلسة ', writerOnly: true },
    { id: 'directed', icon: FileSpreadsheet, label: 'إجراء يوجه' },
    { id: 'correspondences', icon: Send, label: 'المراسلات'},
    { id: 'outstanding', icon: BookOpen, label: 'الباقي بدون تحصيل' },
    { id: 'frais', icon: Calculator, label: 'تصفية الصوائر' },
    { id: 'documents', icon: FileSignature, label: 'توليد الوثائق' },
    { id: 'coercion', icon: Gavel, label: 'ملفات الإكراه البدني' },
    { id: 'users', icon: Users, label: 'إدارة الموظفين', adminOnly: true },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-[#002244] to-[#003366] text-white flex flex-col shadow-[10px_0_30px_rgba(0,51,102,0.15)] z-20 border-l border-white/5 relative">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="p-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] via-[#C5A028] to-[#9A7B16] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#D4AF37]/50 transform transition-transform hover:scale-105 duration-300">
            <span className="text-[#002244] font-black text-xl tracking-wider">ET</span>
          </div>
          <div className="text-right overflow-hidden flex-1">
            <h1 className="font-bold text-xl truncate tracking-tight text-white drop-shadow-sm">E-Tahssil</h1>
            <p className="text-xs text-[#D4AF37] truncate font-medium mt-0.5 opacity-90">
              {role === 'writer' ? 'شعبة القضاء الإستعجالي' : 'شعبة التبليغ والتحصيل'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar relative z-10">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            // 1. Cacher les éléments réservés à l'admin si l'utilisateur n'est pas admin
            if (item.adminOnly && role !== 'admin') return null;
            
            // 2. Cacher les éléments réservés aux writers si l'utilisateur n'est pas writer
            if (item.writerOnly && role !== 'writer') return null;
            
            // 🔥 3. LA SOLUTION EST ICI : Si l'utilisateur est 'writer', on cache TOUT le reste
            if (role === 'writer' && !item.writerOnly) return null;
                        
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onMenuChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'text-[#D4AF37] font-bold shadow-md'
                      : 'text-gray-400 hover:text-white font-medium hover:translate-x-[-4px]'
                  }`}
                >
                  {/* Active Background & Border */}
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-l from-[#D4AF37]/20 to-transparent opacity-100" />
                      <div className="absolute top-0 right-0 w-1 h-full bg-[#D4AF37] rounded-l-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                    </>
                  )}
                  
                  {/* Hover Background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-xl" />
                  )}

                  <div className={`p-2 rounded-lg transition-all duration-300 relative z-10 ${isActive ? 'bg-[#D4AF37]/20 shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'bg-transparent group-hover:bg-white/10'}`}>
                    <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-white'}`} />
                  </div>
                  <span className="text-sm text-right flex-1 cursor-pointer relative z-10">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-white/10 relative z-10 bg-[#001a33]/30 backdrop-blur-md">
        <div className="text-[11px] text-gray-400/80 text-center font-medium tracking-wide">
          © {new Date().getFullYear()} وزارة العدل<br/>جميع الحقوق محفوظة
        </div>
      </div>
    </aside>
  );
}