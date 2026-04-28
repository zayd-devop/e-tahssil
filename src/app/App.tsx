import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { FAQPage } from './components/FAQPage';

type Page = 'home' | 'login' | 'dashboard' | 'faq';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<'admin' | 'clerk'>('admin');

  if (currentPage === 'home') {
    return (
      <HomePage 
        onNavigateToLogin={() => setCurrentPage('login')}
        onNavigateToFAQ={() => setCurrentPage('faq')}
      />
    );
  }

  if (currentPage === 'faq') {
    return (
      <FAQPage 
        onBack={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'login') {
    return (
      <LoginPage 
        onLogin={() => setCurrentPage('dashboard')}
        onBackToHome={() => setCurrentPage('home')}
        role={userRole}
        onRoleChange={setUserRole}
      />
    );
  }

  return (
    <Dashboard 
      onLogout={() => setCurrentPage('home')}
      initialRole={userRole}
    />
  );
}
