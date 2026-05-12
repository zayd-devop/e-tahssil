import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { KPICards } from './KPICards';
import { DataTable } from './DataTable';
import { FileDetailsModal } from './FileDetailsModal';
import { NotificationPanel } from './NotificationPanel';
import { ProductionCards } from './ProductionCards';
import { DocumentGenerator } from './DocumentGenerator';
import { RecouvrementForm } from './RecouvrementForm';
import { NotificationForm } from './NotificationForm';
import { FraisModule } from './TassfiyatSawaer/FraisModule';
import { RegistryOfExtracts } from './RegistryOfExtracts';
import { OutstandingDebtsModule } from './OutstandingDebtsModule';
import { UserManagementModule } from './UserManagementModule';
import DirectedProcedureModule from './DirectedProcedureModule';
import CorrespondencesModule from './CorrespondencesModule';

export function Dashboard({ onLogout }) {
  // 🔥 1. On récupère le VRAI rôle depuis la session de connexion
  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('userRole') || 'clerk'; // 'clerk' par défaut pour plus de sécurité
  });
  
  // 2. Initialisation du menu actif
  const [activeMenu, setActiveMenu] = useState(() => {
    const savedMenu = localStorage.getItem('dashboard_active_menu');
    if (savedMenu) return savedMenu;
    
    // Si l'utilisateur est un admin, il atterrit sur le bureau, sinon sur la production
    return role === 'admin' ? 'bureau' : 'production';
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 3. Sécurité supplémentaire : 
  // Si on est connecté en tant que clerk, et qu'on essaie de forcer un menu admin
  useEffect(() => {
    if (role !== 'admin' && (activeMenu === 'bureau' || activeMenu === 'users')) {
      setActiveMenu('production');
    }
  }, [role, activeMenu]);

  // 4. Sauvegarde du menu actif
  useEffect(() => {
    localStorage.setItem('dashboard_active_menu', activeMenu);
  }, [activeMenu]);

  const texts = {
    bureau: 'لوحة القيادة',
    bureauDesc: 'مرحباً بك في لوحة القيادة. يمكنك إدارة القضايا وتوزيعها هنا.',
    extraits: 'سجل المستخرجات',
    extraitsDesc: 'وحدة سجل المستخرجات وسندات المداخيل.',
    notification: 'مكتب التبليغ',
    notificationDesc: 'إدارة عمليات وإجراءات التبليغ.',
    frais: 'تصفية الصوائر',
    fraisDesc: 'وحدة حساب وتصفية الصوائر القضائية.',
    recouvrement: 'التحصيل',
    recouvrementDesc: 'وحدة التحصيل وإدارة المبالغ المستردة.',
    tresorerie: 'التنسيق مع الخزينة',
    tresorerieDesc: 'التنسيق المالي مع الخزينة العامة.',
    production: 'بطائق الإنتاج',
    productionDesc: 'إدخال البيانات اليومية للإنتاج',
    documents: 'توليد الوثائق',
    documentsDesc: 'توليد المستندات الرسمية',
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] rtl" dir="rtl">
      {/* 🔥 On passe le 'role' à la Sidebar. 
        Comme ta Sidebar a déjà la condition `if (item.adminOnly && role !== 'admin')`, 
        le bouton des utilisateurs va disparaître pour les clerks ! 
      */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} role={role} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          onLogout={onLogout}
          role={role}
          // On garde la fonction onRoleChange si tu as un sélecteur dans ta TopBar
          onRoleChange={setRole}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Seul l'admin voit le bureau (tableaux de bord globaux) */}
          {activeMenu === 'bureau' && role === 'admin' && (
            <>
              <KPICards />
              <DataTable onFileClick={setSelectedFile} />
            </>
          )}

          {activeMenu === 'production' && <ProductionCards />}
          {activeMenu === 'documents' && <DocumentGenerator />}
          {activeMenu === 'outstanding' && <OutstandingDebtsModule />}
          {activeMenu === 'directed' && <DirectedProcedureModule />}

          {activeMenu === 'correspondences' && <CorrespondencesModule />}

          {/* {activeMenu === 'recouvrement' && <RecouvrementForm />}
          
          {activeMenu === 'notification' && <NotificationForm />} */}

          {activeMenu === 'frais' && <FraisModule />}

          {/* Seul l'admin a le droit de voir et rendre le module des utilisateurs */}
          {activeMenu === 'users' && role === 'admin' && <UserManagementModule />}

          {['tresorerie'].includes(activeMenu) && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{texts[activeMenu]}</h2>
              <p className="text-gray-600">{texts[`${activeMenu}Desc`]}</p>
            </div>
          )}
        </main>
      </div>

      {selectedFile && (
        <FileDetailsModal 
          file={selectedFile} 
          onClose={() => setSelectedFile(null)} 
        />
      )}
      
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}