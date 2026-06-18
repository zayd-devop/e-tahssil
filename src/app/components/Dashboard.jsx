import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { KPICards } from './KPICards';

import { DocumentGenerator } from './DocumentGenerator';
import { FraisModule } from './TassfiyatSawaer/FraisModule';

import { OutstandingDebtsModule } from './OutstandingDebtsModule';
import { UserManagementModule } from './UserManagementModule';
import DirectedProcedureModule from './DirectedProcedureModule';
import CorrespondencesModule from './CorrespondencesModule';
import { ProductionCards } from './ProductionCards';
import ProceduresTabsContainer from './ProceduresTabsContainer';
import HearingMinutesModule from './HearingMinutesModule';
import { CoercionFilesModule } from './CoercionFilesModule';

// 🔥 1. On accepte 'initialRole' envoyé par App.jsx pour une synchronisation immédiate
export function Dashboard({ onLogout, initialRole }) {
  
  // 1. On récupère le VRAI rôle depuis la session ou la prop initiale
  const [role, setRole] = useState(() => {
    return initialRole || sessionStorage.getItem('userRole') || 'clerk';
  });

  // 💡 Fonction de secours pour obtenir le menu par défaut selon le rôle
  const getValidDefaultMenu = (currentRole) => {
    if (currentRole === 'writer') return 'hearing';
    if (currentRole === 'admin') return 'bureau';
    return 'production'; // Pour le clerk
  };

  // 💡 Fonction de sécurité pour valider si un menu est autorisé pour un rôle donné
  const isMenuValidForRole = (menu, currentRole) => {
    const invalidMenus = ['notification', 'recouvrement', '', null, undefined];
    if (invalidMenus.includes(menu)) return false;

    if (currentRole === 'writer') return menu === 'hearing';
    if (currentRole === 'clerk') {
      // Le clerk n'a pas accès au bureau admin, à la gestion d'utilisateurs ni aux PV d'audiences
      return !['bureau', 'users', 'hearing'].includes(menu);
    }
    if (currentRole === 'admin') {
      // L'admin a accès à tout sauf au module exclusif du dactylographe
      return menu !== 'hearing';
    }
    return true;
  };
  
  // 2. Initialisation intelligente et propre du menu actif
  const [activeMenu, setActiveMenu] = useState(() => {
    const currentRole = initialRole || sessionStorage.getItem('userRole') || 'clerk';
    const savedMenu = sessionStorage.getItem('dashboard_active_menu');
    
    // Si le menu sauvegardé est valide pour le rôle actuel, on le garde, sinon on prend le défaut
    if (isMenuValidForRole(savedMenu, currentRole)) {
        return savedMenu;
    }
    
    return getValidDefaultMenu(currentRole);
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // 3. 🔥 SÉCURITÉ ULTRA-SYNCHRONISÉE : S'exécute dès le premier affichage pour éviter tout blocage
  useEffect(() => {
    const currentRole = role || initialRole || 'clerk';
    if (!isMenuValidForRole(activeMenu, currentRole)) {
      setActiveMenu(getValidDefaultMenu(currentRole));
    }
  }, [role, initialRole, activeMenu]);

  // Synchroniser le rôle si le parent change de prop
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  // 4. Sauvegarde du menu actif
  useEffect(() => {
    if (activeMenu) {
        sessionStorage.setItem('dashboard_active_menu', activeMenu);
    }
  }, [activeMenu]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100/80 rtl overflow-hidden" dir="rtl">
      
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} role={role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
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

          {activeMenu === 'coercion' && <CoercionFilesModule />}

          {activeMenu === 'users' && role === 'admin' && <UserManagementModule />}
          
        </main>
      </div>

    </div>
  );
}