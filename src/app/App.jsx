import React, { useState, useEffect } from 'react';
;

import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  // 1. Initialiser l'état à partir du localStorage (s'il existe)
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem('app_current_page');
    return savedPage || 'login';
  });

  const [userRole, setUserRole] = useState(() => {
    const savedRole = localStorage.getItem('app_user_role');
    return savedRole || 'admin';
  });

  // 2. Mettre à jour le localStorage chaque fois que la page ou le rôle change
  useEffect(() => {
    localStorage.setItem('app_current_page', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('app_user_role', userRole);
  }, [userRole]);

  // 3. Fonction de déconnexion propre
  const handleLogout = () => {
    setCurrentPage('login');
    // Optionnel : tu pourrais aussi effacer le rôle si tu veux forcer
    // une réinitialisation complète à la déconnexion
    // localStorage.removeItem('app_user_role'); 
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLogin={() => setCurrentPage('dashboard')}
        role={userRole}
        onRoleChange={setUserRole}
      />
    );
  }

  // Si ce n'est pas 'login', on affiche le Dashboard
  return (
    <Dashboard
      onLogout={handleLogout}
      initialRole={userRole}
    />
  );
}