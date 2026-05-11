import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, Loader2 } from 'lucide-react'; // أضفنا Loader2
import Swal from 'sweetalert2'; // استيراد SweetAlert للرسائل

export function LoginPage({ onLogin, role, onRoleChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل الجديدة
  const [formData, setFormData] = useState({ identifier: '', password: '', rememberMe: false });

  // رابط الـ API (تأكد من أنه يطابق مسار مشروع Laravel)
  const API_URL = 'http://127.0.0.1:8000/api';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.identifier,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Sauvegarde des tokens et infos utilisateur
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // 🔥 2. LA CORRECTION EST ICI : 
        // On récupère le vrai rôle depuis la base de données et on le sauvegarde !
        const userRole = data.user.role;
        sessionStorage.setItem('userRole', userRole); 

        // On informe le composant parent du rôle exact
        onRoleChange(userRole); 
        // ---------------------------------------------------------
        
        // 3. Notification de succès
        Swal.fire({
          icon: 'success',
          title: 'مرحباً بك!',
          text: 'تم تسجيل الدخول بنجاح',
          timer: 1500,
          showConfirmButton: false
        });

        onLogin();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'فشل الدخول',
          text: data.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          confirmButtonColor: '#003366'
        });
      }
    } catch (error) {
      console.error('Login Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الاتصال',
        text: 'تعذر الاتصال بالسيرفر، تأكد من تشغيل (php artisan serve)',
        confirmButtonColor: '#003366'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex rtl" dir="rtl">
      {/* Côté Visuel / Marque */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#003366]">
        {/* Arrière-plan */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: 'url(/tribunal.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/10 to-[#001a33]/20" />
        
        {/* Contenu textuel de l'image */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-12 text-center">
          <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37]/30 mb-8 backdrop-blur-sm shadow-2xl">
            <Shield className="w-12 h-12 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            مرحباً بكم  
          </h1>
          <p className="text-lg text-[#D4AF37] font-medium tracking-widest uppercase mb-8">
            نظام التبليغ والتحصيل
          </p>
          <div className="w-16 h-1 bg-[#D4AF37] rounded-full" />
          
          <div className="absolute bottom-8 text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} شعبة التبليغ والتحصيل.
          </div>
        </div>
      </div>

      {/* Côté Formulaire */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-6 sm:p-12 min-h-screen overflow-y-auto">
        <div className="w-full max-w-md flex flex-col mt-8 lg:mt-0">
          <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Barre décorative */}
            <div className="h-2 w-full bg-gradient-to-r from-[#003366] via-[#003366] to-[#D4AF37]" />

            <div className="p-8 sm:p-10">
              <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-[#003366]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                  <Shield className="w-8 h-8 text-[#003366] -rotate-3" />
                </div>
                <h2 className="text-3xl font-bold text-[#003366] mb-2">تسجيل الدخول</h2>
                <p className="text-gray-500 text-sm leading-relaxed">الولوج إلى نظام التبليغ والتحصيل</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Champ Identifiant / Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#0A2540]">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email" // تم التغيير لـ email ليتوافق مع API
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="أدخل بريدك الإلكتروني..."
                      required
                      className="block w-full rounded-xl border border-gray-300 bg-white py-3.5 ps-12 pe-4 text-[#0A2540] placeholder-[#1F2937]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#0A2540]">
                    كلمة المرور
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="أدخل كلمة المرور..."
                      required
                      className="block w-full rounded-xl border border-gray-300 bg-white py-3.5 ps-12 pe-12 text-[#0A2540] placeholder-[#1F2937]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 end-0 flex items-center pe-4 text-gray-400 hover:text-[#003366] transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Se souvenir de moi & Mot de passe oublié */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-[#003366] transition-colors">
                      تذكرني
                    </span>
                  </label>
                  
                  <a href="#" className="text-sm font-bold text-[#D4AF37] hover:text-[#b89528] transition-colors">
                    هل نسيت كلمة المرور؟
                  </a>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white py-4 px-6 rounded-xl text-lg font-bold transition-all shadow-lg flex justify-center items-center gap-2 
                    ${isLoading ? 'bg-[#002244] opacity-80 cursor-wait' : 'bg-[#003366] hover:bg-[#002244] hover:shadow-xl focus:ring-4 focus:ring-[#003366]/30'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    'الدخول للفضاء الخاص'
                  )}
                </button>
              </form>
            </div>
            
            {/* Note de sécurité */}
            <div className="bg-white p-4 text-center border-t border-gray-100">
              <p className="text-xs text-[#0A2540] font-medium flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                فضاء مشفر ومؤمن بالكامل • شعبة التبليغ والتحصيل
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}