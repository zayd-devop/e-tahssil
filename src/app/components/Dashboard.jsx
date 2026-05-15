import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { KPICards } from './KPICards'

import { DocumentGenerator } from './DocumentGenerator';
import { FraisModule } from './TassfiyatSawaer/FraisModule';

import { OutstandingDebtsModule } from './OutstandingDebtsModule';
import { UserManagementModule } from './UserManagementModule';
import DirectedProcedureModule from './DirectedProcedureModule';
import CorrespondencesModule from './CorrespondencesModule';
import { ProductionCards } from './ProductionCards';
import ProceduresTabsContainer from './ProceduresTabsContainer';
import HearingMinutesModule from './HearingMinutesModule';

export function Dashboard({ onLogout }) {
  // 1. On récupère le VRAI rôle depuis la session de connexion
  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('userRole') || 'clerk'; // 'clerk' par défaut pour plus de sécurité
  });
  
  // 2. Initialisation intelligente et propre du menu actif
  const [activeMenu, setActiveMenu] = useState(() => {
    // 🔥 1. Si c'est un writer, il n'a droit qu'à ça, on ignore le reste
    if (role === 'writer') return 'hearing';

    const savedMenu = sessionStorage.getItem('dashboard_active_menu');
    
    // 🔥 2. Si on a un menu sauvegardé valide, on l'utilise
    // (On évite de charger 'notification' ou 'recouvrement' qui sont commentés et causent la page blanche)
    if (savedMenu && savedMenu !== 'notification' && savedMenu !== 'recouvrement') {
        return savedMenu;
    }
    
    // 🔥 3. Comportement par défaut pour les nouveaux utilisateurs
    return role === 'admin' ? 'bureau' : 'production';
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 3. Sécurité STRICTE : Empêche la page blanche et les accès non autorisés
  useEffect(() => {
    // Si c'est un writer et qu'il essaie d'aller ailleurs, on le force sur hearing
    if (role === 'writer' && activeMenu !== 'hearing') {
      setActiveMenu('hearing');
    } 
    // Si c'est un clerk et qu'il essaie d'aller sur les pages admin
    else if (role !== 'admin' && role !== 'writer' && (activeMenu === 'bureau' || activeMenu === 'users')) {
      setActiveMenu('production');
    }
  }, [role, activeMenu]);

  // 4. Sauvegarde du menu actif
  useEffect(() => {
    if (activeMenu) {
        sessionStorage.setItem('dashboard_active_menu', activeMenu);
    }
  }, [activeMenu]);

  return (
    <div className="flex h-screen bg-[#F8F9FA] rtl" dir="rtl">
      
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} role={role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          onLogout={onLogout}
          role={role}
          onRoleChange={setRole}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Rendu des composants basé sur le menu exact */}
          
          {activeMenu === 'bureau' && role === 'admin' && <KPICards />}
          
          {activeMenu === 'hearing' && role === 'writer' && <HearingMinutesModule />}

          {activeMenu === 'production' && <ProductionCards />}
          
          {activeMenu === 'documents' && <DocumentGenerator />}
          
          {activeMenu === 'outstanding' && <OutstandingDebtsModule />}
          
          {activeMenu === 'directed' && <ProceduresTabsContainer />}

          {activeMenu === 'correspondences' && <CorrespondencesModule />}

          {activeMenu === 'frais' && <FraisModule />}

          {activeMenu === 'users' && role === 'admin' && <UserManagementModule />}
          
        </main>
      </div>

      {/* Le reste de tes composants modals (FileDetailsModal, etc.) ... */}
      {showNotifications && (
        // <NotificationPanel onClose={() => setShowNotifications(false)} />
        null
      )}
    </div>
  );
}