import React, { useState } from 'react';
import { Search, Bell, User, Globe, LogOut } from 'lucide-react';

interface TopBarProps {
  onNotificationClick: () => void;
  onLogout: () => void;
  role: 'admin' | 'clerk';
  onRoleChange: (role: 'admin' | 'clerk') => void;
}

export function TopBar({ onNotificationClick, onLogout, role, onRoleChange }: TopBarProps) {
  const language = 'ar';
  const isRTL = true;
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const adminInfo = {
    name: language === 'ar' ? 'سيام' : 'Siam',
    status: language === 'ar' ? 'الصلاحية: مدير' : 'Rôle: Admin',
    color: '#D4AF37', // Gold
    bgClass: 'bg-[#D4AF37]',
    textClass: 'text-[#D4AF37]'
  };

  const clerkInfo = {
    name: language === 'ar' ? 'سارة' : 'Sarah',
    status: language === 'ar' ? 'الصلاحية: كاتب' : 'Rôle: Greffier',
    color: '#003366', // Navy
    bgClass: 'bg-[#003366]',
    textClass: 'text-[#003366]'
  };

  const currentUser = role === 'admin' ? adminInfo : clerkInfo;

  const translations = {
    ar: {
      searchPlaceholder: 'البحث برقم الملف، رقم البطاقة الوطنية...',
      userName: 'أحمد بن علي',
      userRole: 'رئيس كتابة الضبط',
      kingdom: 'المملكة المغربية',
      ministry: 'وزارة العدل',
      searchAlert: 'البحث عن:',
      logout: 'تسجيل الخروج',
    },
    fr: {
      searchPlaceholder: 'Rechercher par N° dossier, CIN...',
      userName: 'Ahmed Ben Ali',
      userRole: 'Chef Greffier',
      kingdom: 'Royaume du Maroc',
      ministry: 'Ministère de la Justice',
      searchAlert: 'Recherche pour:',
      logout: 'Déconnexion',
    },
  };

  const t = translations[language];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`${t.searchAlert} ${searchQuery}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        
        {/* Right Section in RTL (Left visually in LTR) - Logo & Search */}
        <div className="flex items-center gap-6">
          {/* Ministry Logo & Title */}
          <div className={`flex items-center gap-3 ${language === 'ar' ? 'pl-6 border-l' : 'pr-6 border-r'} border-gray-200`}>
            <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center shrink-0">
              <div className="w-8 h-8">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7V12C2 16.97 6.03 21.5 12 22C17.97 21.5 22 16.97 22 12V7L12 2Z" fill="#D4AF37"/>
                  <path d="M12 7L8 9.5V12.5L12 15L16 12.5V9.5L12 7Z" fill="#003366"/>
                </svg>
              </div>
            </div>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-sm font-bold text-[#003366] whitespace-nowrap">{t.kingdom}</p>
              <p className="text-xs text-gray-600 whitespace-nowrap">{t.ministry}</p>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-96">
            <div className="relative">
              <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className={`w-full ${language === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent`}
              />
            </div>
          </form>
        </div>

        {/* Left Section in RTL (Right visually in LTR) - Actions & User Profile */}
        <div className="flex items-center gap-4">
          {/* Employee Performance Score */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-xs text-gray-500 font-medium">{language === 'ar' ? 'مؤشر الأداء' : 'Performance'}</p>
              <p className="text-sm font-bold text-[#003366]">850 pts <span className="text-emerald-600 text-xs font-semibold">{language === 'ar' ? '(مرتفع)' : '(Élevé)'}</span></p>
            </div>
          </div>

          {/* Notification Bell */}
          <button 
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className={`absolute top-1 ${language === 'ar' ? 'left-1' : 'right-1'} w-2 h-2 bg-red-500 rounded-full animate-pulse`}></span>
          </button>
          
          {/* User Profile with Role Management */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 ${language === 'ar' ? 'pr-4 border-r' : 'pl-4 border-l'} border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors`}
            >
              <div className={`w-10 h-10 ${currentUser.bgClass} rounded-full flex items-center justify-center shrink-0`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{currentUser.name}</p>
                <div className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mt-0.5 ${role === 'admin' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                  {currentUser.status}
                </div>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className={`absolute top-full mt-2 ${language === 'ar' ? 'left-0' : 'right-0'} w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden`}>
                <div className="px-4 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-10 h-10 ${currentUser.bgClass} rounded-full flex items-center justify-center shrink-0 shadow-inner`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs font-medium text-gray-500">{currentUser.status}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors justify-start"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}