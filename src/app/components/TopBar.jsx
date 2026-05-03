import React, { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';

export function TopBar({ onNotificationClick, onLogout, role, onRoleChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'جاري التحميل...',
    status: '',
    color: '#003366',
    bgClass: 'bg-[#003366]',
    textClass: 'text-[#003366]'
  });

  useEffect(() => {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      
      // 1. استخراج الاسم والنسب بذكاء (للمدير أو لكاتب الضبط)
      // نبحث في الكائن نفسه، ثم في كائن clerk، ثم في كائن admin (إن وجد)
      const prenom = userData.prenom || userData?.clerk?.prenom || userData?.admin?.prenom || '';
      const nom = userData.nom || userData?.clerk?.nom || userData?.admin?.nom || '';
      
      let fullName = 'مستخدم';
      
      if (prenom || nom) {
        fullName = `${prenom} ${nom}`.trim(); // إذا كان لديه اسم ونسب منفصلين
      } else if (userData.name) {
        fullName = userData.name; // إذا كان اسمه محفوظاً كـ name واحد في جدول users
      }

      // 2. استخراج الصفة / الدور
      let currentStatus = userData.type_responsabilite || userData?.clerk?.type_responsabilite || userData?.admin?.type_responsabilite;
      if (!currentStatus) {
         // إذا لم تكن الصفة محددة في قاعدة البيانات، نضع صفة افتراضية حسب نوع حسابه
         currentStatus = userData.role === 'admin' ? 'رئيس الوحدة' : 'كاتب الضبط';
      }

      // 3. تحديد الألوان (الذهبي للمدير، والأزرق لكاتب الضبط)
      const isAdmin = userData.role === 'admin' || role === 'admin';

      setCurrentUser({
        name: fullName,
        status: currentStatus,
        color: isAdmin ? '#D4AF37' : '#003366',
        bgClass: isAdmin ? 'bg-[#D4AF37]' : 'bg-[#003366]',
        textClass: isAdmin ? 'text-[#D4AF37]' : 'text-[#003366]'
      });
    }
  }, [role]); 

  const t = {
    kingdom: 'المملكة المغربية',
    ministry: 'شعبة التبليغ والتحصيل',
    searchAlert: 'البحث عن:',
    logout: 'تسجيل الخروج',
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`${t.searchAlert} ${searchQuery}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 rtl" dir="rtl">
      <div className="flex items-center justify-between">
        
        {/* Section Droite (Logo & Recherche) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
            <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center shrink-0">
              <div className="w-8 h-8">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7V12C2 16.97 6.03 21.5 12 22C17.97 21.5 22 16.97 22 12V7L12 2Z" fill="#D4AF37"/>
                  <path d="M12 7L8 9.5V12.5L12 15L16 12.5V9.5L12 7Z" fill="#003366"/>
                </svg>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#003366] whitespace-nowrap">{t.kingdom}</p>
              <p className="text-xs text-gray-600 whitespace-nowrap">{t.ministry}</p>
            </div>
          </div>
        </div>

        {/* Section Gauche (Actions & Profil) */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 left-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pr-4 border-r border-gray-200 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className={`w-10 h-10 ${currentUser.bgClass} rounded-full flex items-center justify-center shrink-0 transition-colors duration-300`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 whitespace-nowrap">{currentUser.name}</p>
                <div className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mt-0.5 transition-colors duration-300 ${currentUser.textClass} bg-opacity-10`} style={{ backgroundColor: `${currentUser.color}1A` }}>
                  {currentUser.status}
                </div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                  <div className={`w-10 h-10 ${currentUser.bgClass} rounded-full flex items-center justify-center shrink-0 shadow-inner`}>
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-right">
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