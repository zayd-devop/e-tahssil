import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, Loader2, ChevronRight } from 'lucide-react'; 
import Swal from 'sweetalert2'; 

// 🔥 1. IMPORT D'AXIOS
import api from '../api/axios';

export function LoginPage({ onLogin, role, onRoleChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [formData, setFormData] = useState({ identifier: '', password: '', rememberMe: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 🔥 2. CORRECTION : POST avec Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Axios gère l'URL de base, les headers et la conversion JSON automatiquement
      const response = await api.post('/login', {
        email: formData.identifier,
        password: formData.password
      });

      // Les données sont directement dans response.data
      const data = response.data;

      // 1. Sauvegarde des tokens et infos utilisateur
      sessionStorage.setItem('token', data.access_token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      
      // 2. On récupère le vrai rôle depuis la base de données et on le sauvegarde !
      const userRole = data.user.role;
      sessionStorage.setItem('userRole', userRole); 

      // On informe le composant parent du rôle exact
      onRoleChange(userRole); 
      
      // 3. Notification de succès
      Swal.fire({
        icon: 'success',
        title: 'مرحباً بك!',
        text: 'تم تسجيل الدخول بنجاح',
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        confirmButtonColor: '#003366'
      });

      onLogin();
      
    } catch (error) {
      console.error('Login Error:', error);
      
      // 🔥 Axios stocke les messages d'erreur du serveur dans error.response.data
      const errorMessage = error.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      
      Swal.fire({
        icon: 'error',
        title: 'فشل الدخول',
        text: errorMessage,
        confirmButtonColor: '#003366',
        background: '#ffffff'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex rtl font-sans" dir="rtl">
      {/* Côté Visuel / Marque (Right side visually in RTL) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#003366] group">
        {/* Arrière-plan */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 transition-transform duration-[10000ms] group-hover:scale-105"
          style={{ backgroundImage: 'url(/tribunal.jpg)' }}
        />
        {/* Overlay Dégradé Complexe */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#003366]/80 via-[#001a33]/60 to-[#000000]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 to-transparent" />
        
        {/* Contenu textuel de l'image */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-12 text-center">
          {/* Logo animé */}
          <div className="w-28 h-28 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mb-8 backdrop-blur-md shadow-[0_0_40px_rgba(212,175,55,0.15)] transform transition-transform hover:scale-105 hover:rotate-3 duration-500">
            <Shield className="w-14 h-14 text-[#D4AF37] drop-shadow-lg" />
          </div>
          
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 drop-shadow-sm">
            مرحباً بكم  
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <p className="text-xl text-[#D4AF37] font-semibold tracking-wider uppercase">
              نظام التبليغ والتحصيل
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          
          <p className="max-w-md text-gray-300/80 text-lg leading-relaxed font-light mb-12">
            بوابة رقمية آمنة ومتطورة لتسهيل وتسريع عمليات التبليغ والتحصيل بكفاءة وشفافية عالية.
          </p>
          
          <div className="absolute bottom-10 flex flex-col items-center gap-2">
            <div className="flex gap-1 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]/50"></span>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]/30"></span>
            </div>
            <div className="text-sm text-gray-400 font-medium tracking-wide">
              © {new Date().getFullYear()} وزارة العدل - شعبة التبليغ والتحصيل
            </div>
          </div>
        </div>
      </div>

      {/* Côté Formulaire (Left side visually in RTL) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative bg-slate-50 p-6 sm:p-12 min-h-screen overflow-y-auto">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#003366]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md flex flex-col mt-8 lg:mt-0 relative z-10">
          
          {/* Main Card */}
          <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-[#003366]/5 border border-white overflow-hidden transition-all duration-300 hover:shadow-[#003366]/10">
            {/* Barre décorative */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#003366] via-[#004080] to-[#D4AF37]" />

            <div className="p-8 sm:p-12">
              <div className="mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#003366]/10 to-[#003366]/5 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-[#003366]/5">
                  <User className="w-8 h-8 text-[#003366]" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">تسجيل الدخول</h2>
                <p className="text-gray-500 text-base leading-relaxed">الرجاء إدخال بيانات الاعتماد الخاصة بك للولوج إلى الفضاء الخاص بك.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Champ Identifiant / Email */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-bold text-gray-700 transition-colors group-focus-within:text-[#003366]">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                    </div>
                    <input
                      type="email" 
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="أدخل بريدك الإلكتروني..."
                      required
                      className="block w-full rounded-2xl border-0 bg-slate-50 py-4 ps-12 pe-4 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700 transition-colors group-focus-within:text-[#003366]">
                      كلمة المرور
                    </label>
                    <a href="#" className="text-sm font-semibold text-[#D4AF37] hover:text-[#b89528] transition-colors hover:underline underline-offset-4">
                      هل نسيت كلمة المرور؟
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="أدخل كلمة المرور..."
                      required
                      className="block w-full rounded-2xl border-0 bg-slate-50 py-4 ps-12 pe-12 text-gray-900 placeholder-gray-400 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white transition-all duration-200"
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

                {/* Se souvenir de moi */}
                <div className="flex items-center pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="peer w-5 h-5 rounded-md border-gray-300 text-[#003366] focus:ring-[#003366] focus:ring-offset-2 transition-all cursor-pointer"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                      تذكر بيانات الدخول
                    </span>
                  </label>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full text-white py-4 px-6 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg flex justify-center items-center gap-3 group mt-4
                    ${isLoading 
                      ? 'bg-[#002244] opacity-80 cursor-wait' 
                      : 'bg-gradient-to-r from-[#003366] to-[#002244] hover:from-[#002244] hover:to-[#001a33] hover:shadow-[#003366]/30 hover:-translate-y-0.5 focus:ring-4 focus:ring-[#003366]/20'}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>جاري التحقق...</span>
                    </>
                  ) : (
                    <>
                      <span>الدخول للفضاء الخاص</span>
                      <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Note de sécurité */}
            <div className="bg-slate-50/50 p-5 text-center border-t border-gray-100 backdrop-blur-sm">
              <p className="text-xs text-gray-500 font-medium flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                فضاء مشفر ومؤمن بالكامل بتقنية SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}