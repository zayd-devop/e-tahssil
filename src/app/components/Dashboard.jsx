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

  // Textes en arabe uniquement
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
          {activeMenu === 'bureau' && (
            <>
              {/* KPI Cards */}
              <KPICards />
              
              {/* Data Table */}
              <DataTable onFileClick={setSelectedFile} />
            </>
          )}

          {activeMenu === 'production' && <ProductionCards />}
          
          {activeMenu === 'documents' && <DocumentGenerator />}

          {activeMenu === 'outstanding' && <OutstandingDebtsModule />}

          {/* {activeMenu === 'recouvrement' && <RecouvrementForm />}
          
          {activeMenu === 'notification' && <NotificationForm />} */}

          {activeMenu === 'frais' && <FraisModule />}
          
          {/* {activeMenu === 'extraits' && <RegistryOfExtracts role={role} />} */}

          {activeMenu === 'users' && <UserManagementModule />}

          {['tresorerie'].includes(activeMenu) && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{texts[activeMenu]}</h2>
              <p className="text-gray-600">{texts[`${activeMenu}Desc`]}</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals and Panels */}
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