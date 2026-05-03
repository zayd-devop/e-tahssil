import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  // 1. التحقق من وجود التوكن (Token) بدلاً من 'app_current_page'
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token; // تُرجع true إذا كان التوكن موجوداً، و false إذا لم يكن موجوداً
  });

  const [userRole, setUserRole] = useState(() => {
    const savedRole = localStorage.getItem('app_user_role');
    return savedRole || 'admin';
  });

  // 2. تحديث الرول في الـ localStorage عند تغييره
  useEffect(() => {
    localStorage.setItem('app_user_role', userRole);
  }, [userRole]);

  // 3. دالة تسجيل الخروج (Logout) الحقيقية والمربوطة بالـ API
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // إرسال طلب للسيرفر لإبطال (Revoke) التوكن
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // مسح جميع بيانات الجلسة من المتصفح (حتى لو فشل الاتصال بالسيرفر)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // localStorage.removeItem('app_user_role'); // اختياري إذا أردت مسح الرول أيضاً
      
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