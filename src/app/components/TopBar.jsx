import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, LogOut, ChevronDown, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import api from '../api/axios';

export function TopBar({ onNotificationClick, onLogout, role, onRoleChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  
  const [currentUser, setCurrentUser] = useState({
    name: 'جاري التحميل...',
    status: '',
    color: '#003366',
    bgClass: 'bg-[#003366]',
    textClass: 'text-[#003366]'
  });

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Poll for notifications every 30 seconds
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications/unread');
        setNotifications(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Fermer les menus si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    const userStorage = sessionStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      
      const prenom = userData.prenom || userData?.clerk?.prenom || userData?.admin?.prenom || '';
      const nom = userData.nom || userData?.clerk?.nom || userData?.admin?.nom || '';
      
      let fullName = 'مستخدم';
      
      if (prenom || nom) {
        fullName = `${prenom} ${nom}`.trim();
      } else if (userData.name) {
        fullName = userData.name;
      }

      let currentStatus = userData.type_responsabilite || userData?.clerk?.type_responsabilite || userData?.admin?.type_responsabilite;
      if (!currentStatus) {
         currentStatus = userData.role === 'admin' ? 'رئيس الوحدة' : 'كاتب الضبط';
      }

      const isAdmin = userData.role === 'admin' || role === 'admin';

      setCurrentUser({
        name: fullName,
        status: currentStatus,
        color: isAdmin ? '#D4AF37' : '#003366',
        bgClass: isAdmin ? 'bg-gradient-to-br from-[#D4AF37] to-[#C5A028]' : 'bg-gradient-to-br from-[#003366] to-[#002244]',
        textClass: isAdmin ? 'text-[#D4AF37]' : 'text-[#003366]'
      });
    }
  }, [role]); 

  // (Removed previous generic outside click handler, now combined above)

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
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-6 py-4 rtl z-30 relative shadow-sm" dir="rtl">
      <div className="flex items-center justify-between">
        
        {/* Section Droite (Logo & Recherche) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 pl-6 border-l border-gray-200/50">
            <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#002244] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-[#003366]/20">
              <div className="w-7 h-7">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform hover:scale-110 duration-300">
                  <path d="M12 2L2 7V12C2 16.97 6.03 21.5 12 22C17.97 21.5 22 16.97 22 12V7L12 2Z" fill="#D4AF37"/>
                  <path d="M12 7L8 9.5V12.5L12 15L16 12.5V9.5L12 7Z" fill="#ffffff"/>
                </svg>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-extrabold text-[#003366] whitespace-nowrap tracking-tight">{t.kingdom}</p>
              <p className="text-xs font-medium text-gray-500 whitespace-nowrap mt-0.5">{t.ministry}</p>
            </div>
          </div>
        </div>

        {/* Section Gauche (Actions & Profil) */}
        <div className="flex items-center gap-5">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className={`relative p-2.5 rounded-xl transition-all duration-300 group ${showNotifications ? 'bg-[#003366]/10' : 'hover:bg-[#003366]/5'}`}
            >
              <Bell className={`w-6 h-6 transition-colors ${showNotifications ? 'text-[#003366]' : 'text-gray-400 group-hover:text-[#D4AF37]'}`} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full mt-3 left-0 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden origin-top-left animate-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 bg-gradient-to-br from-[#003366] to-[#001f3f] flex items-center justify-between text-white">
                  <h3 className="font-bold">الإشعارات</h3>
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-md font-mono">{notifications.length} جديد</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notif, idx) => (
                        <div key={idx} className="p-4 hover:bg-gray-50/80 transition-colors flex gap-3 rtl">
                          <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                            ${notif.type === 'warning' ? 'bg-orange-50 text-orange-500' : 
                              notif.type === 'info' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'}`}>
                            {notif.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                             notif.type === 'info' ? <Info className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-gray-400 mt-2 font-mono">{notif.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 flex flex-col items-center justify-center text-gray-400">
                      <Bell className="w-8 h-8 mb-3 opacity-20" />
                      <p className="text-sm font-medium">لا توجد إشعارات جديدة</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pr-5 border-r border-gray-200/50 hover:bg-slate-50 rounded-2xl p-2 transition-all duration-300 group"
            >
              <div className={`w-11 h-11 ${currentUser.bgClass} rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105`}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-right cursor-pointer">
                <p className="text-sm font-bold text-gray-800 whitespace-nowrap group-hover:text-[#003366] transition-colors">{currentUser.name}</p>
                <div className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mt-0.5 transition-colors duration-300 ${currentUser.textClass} bg-opacity-10 shadow-sm`} style={{ backgroundColor: `${currentUser.color}1A` }}>
                  {currentUser.status}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <div className="absolute top-full mt-3 left-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden origin-top-left animate-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100/50 flex flex-col items-center gap-3 text-center">
                  <div className={`w-14 h-14 ${currentUser.bgClass} rounded-full flex items-center justify-center shrink-0 shadow-inner`}>
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-gray-900">{currentUser.name}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-1">{currentUser.status}</p>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl flex items-center gap-3 transition-colors justify-start cursor-pointer group"
                  >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}