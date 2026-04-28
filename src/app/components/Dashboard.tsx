import React, { useState } from 'react';
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
import { FraisModule } from './FraisModule';

import { RegistryOfExtracts } from './RegistryOfExtracts';

interface DashboardProps {
  onLogout: () => void;
  initialRole?: 'admin' | 'clerk';
}

export function Dashboard({ onLogout, initialRole = 'admin' }: DashboardProps) {
  const language = 'ar';
  const [role, setRole] = useState<'admin' | 'clerk'>(initialRole);
  const [activeMenu, setActiveMenu] = useState(initialRole === 'admin' ? 'bureau' : 'production');
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Update role and menu if initialRole changes
  React.useEffect(() => {
    setRole(initialRole);
    if (initialRole === 'clerk' && activeMenu === 'bureau') {
      setActiveMenu('production');
    }
  }, [initialRole]);

  // If role changes to clerk and we are on an admin-only page, switch to production
  React.useEffect(() => {
    if (role === 'clerk' && activeMenu === 'bureau') {
      setActiveMenu('production');
    }
  }, [role, activeMenu]);

  const translations = {
    ar: {
      bureau: 'لوحة القيادة',
      bureauDesc: 'مرحباً بك في لوحة القيادة. يمكنك إدارة القضايا وتوزيعها هنا.',
      extraits: 'سجل المستخرجات',
      extraitsDesc: 'وحدة سجل المستخرجات وسندات المداخيل.',
      notification: 'مكتب التبليغ',
      notificationDesc: 'إدارة عمليات وإجراءات التبل��غ.',
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
    },
    fr: {
      bureau: 'Tableau de bord',
      bureauDesc: 'Bienvenue dans le Tableau de bord. Gérez et distribuez les dossiers ici.',
      extraits: 'Registre des Extraits',
      extraitsDesc: 'Module du Registre des Extraits.',
      notification: 'Notification',
      notificationDesc: 'Gestion des processus de notification.',
      frais: 'Frais & Dépens',
      fraisDesc: 'Module de liquidation des frais et dépens.',
      recouvrement: 'Recouvrement',
      recouvrementDesc: 'Module de recouvrement et gestion des fonds.',
      tresorerie: 'Trésorerie',
      tresorerieDesc: 'Coordination financière avec la Trésorerie.',
      production: 'Cartes de Production',
      productionDesc: 'Saisie quotidienne des données',
      documents: 'Générateur de Documents',
      documentsDesc: 'Générer des documents officiels',
    },
  };

  const t = translations[language];

  return (
    <div className="flex h-screen bg-[#F8F9FA]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar - Placed first to appear on Right in RTL and Left in LTR */}
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

          {activeMenu === 'recouvrement' && <RecouvrementForm />}
          
          {activeMenu === 'notification' && <NotificationForm />}

          {activeMenu === 'frais' && <FraisModule />}
          
          {activeMenu === 'extraits' && <RegistryOfExtracts role={role} />}

          {['tresorerie'].includes(activeMenu) && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t[activeMenu as keyof typeof t]}</h2>
              <p className="text-gray-600">{t[`${activeMenu}Desc` as keyof typeof t]}</p>
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
