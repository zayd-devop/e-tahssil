import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import HearingMinutesModule from './HearingMinutesModule';

export function Dashboard({ onLogout, initialRole = 'admin' }) {
  const [role, setRole] = useState(initialRole);
  
  // 1. Initialisation depuis le localStorage
  const [activeMenu, setActiveMenu] = useState(() => {
    const savedMenu = localStorage.getItem('dashboard_active_menu');
    if (savedMenu) return savedMenu;
    // Valeur par défaut si rien n'est sauvegardé
    return initialRole === 'admin' ? 'bureau' : 'production';
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Mise à jour du rôle et du menu si initialRole change
  useEffect(() => {
    setRole(initialRole);
    if (initialRole === 'clerk' && activeMenu === 'bureau') {
      setActiveMenu('production');
    }
  }, [initialRole]);

  // Si le rôle passe à clerk et qu'on est sur une page admin, on bascule sur production
  useEffect(() => {
    if (role === 'clerk' && activeMenu === 'bureau') {
      setActiveMenu('production');
    }
  }, [role, activeMenu]);

  // 2. Sauvegarde du menu actif dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('dashboard_active_menu', activeMenu);
  }, [activeMenu]);


  return (
    <div className="flex h-screen bg-[#F8F9FA] rtl" dir="rtl">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          onLogout={onLogout}
          role={role}
          onRoleChange={setRole}
        />
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {activeMenu === 'hearing' && <HearingMinutesModule />}

        </main>
      </div>
    
    </div>
  );
}