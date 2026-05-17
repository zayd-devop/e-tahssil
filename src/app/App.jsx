import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

// 🔥 1. On importe notre instance Axios configurée
import api from './api/axios'; 

export default function App() {
  // 1. التحقق من وجود التوكن (Token) بدلاً من 'app_current_page'
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = sessionStorage.getItem('token');
    return !!token; // تُرجع true إذا كان التوكن موجوداً، و false إذا لم يكن موجوداً
  });

  const [userRole, setUserRole] = useState(() => {
    const savedRole = sessionStorage.getItem('app_user_role');
    return savedRole || 'admin';
  });

  // 2. تحديث الرول في الـ sessionStorage عند تغييره
  useEffect(() => {
    sessionStorage.setItem('app_user_role', userRole);
  }, [userRole]);

  // 3. دالة تسجيل الخروج (Logout) الحقيقية والمربوطة بالـ API
  const handleLogout = async () => {
    try {
      const token = sessionStorage.getItem('token');
      
      if (token) {
        // 🔥 2. C'est magique ! Juste une ligne. Axios s'occupe de l'URL de base et du Token
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // مسح جميع بيانات الجلسة من المتصفح (حتى لو فشل الاتصال بالسيرفر)
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('app_user_role');
      
      // إرجاع المستخدم لصفحة الدخول
      setIsAuthenticated(false);
    }
  };

  // إذا لم يكن المستخدم مسجلاً للدخول (لا يوجد توكن) -> نعرض صفحة الدخول
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={() => setIsAuthenticated(true)}
        role={userRole}
        onRoleChange={setUserRole}
      />
    );
  }

  // إذا كان مسجلاً للدخول -> نعرض لوحة التحكم (Dashboard)
  return (
    <Dashboard
      onLogout={handleLogout}
      initialRole={userRole}
    />
  );
}