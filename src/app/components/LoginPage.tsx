import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, Globe, ArrowLeft, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onBackToHome: () => void;
  role: 'admin' | 'clerk';
  onRoleChange: (role: 'admin' | 'clerk') => void;
}

export function LoginPage({ onLogin, onBackToHome, role, onRoleChange }: LoginPageProps) {
  const language = 'ar';
  const isRTL = true;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '', rememberMe: false });

  const translations = {
    ar: {
      title: 'تسجيل الدخول',
      subtitle: 'الولوج إلى النظام المندمج للتدبير الإداري والمالي',
      emailLabel: 'البريد الإلكتروني أو رقم التأجير',
      emailPlaceholder: 'أدخل بريدك الإلكتروني...',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور...',
      rememberMe: 'تذكرني',
      forgotPassword: 'هل نسيت كلمة المرور؟',
      loginBtn: 'الدخول للفضاء الخاص',
      welcome: 'مرحباً بكم في عدل-تحصيل',
      ministry: 'وزارة العدل',
      langToggle: 'Français',
      backToHome: 'العودة للصفحة الرئيسية'
    },
    fr: {
      title: 'Authentification',
      subtitle: 'Accès au système intégré de gestion administrative et financière',
      emailLabel: 'Identifiant ou Email',
      emailPlaceholder: 'Saisissez votre identifiant...',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Saisissez votre mot de passe...',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      loginBtn: 'Se connecter',
      welcome: 'Bienvenue sur Adl-Tahssil',
      ministry: 'Ministère de la Justice',
      langToggle: 'العربية',
      backToHome: 'Retour à l\'accueil'
    }
  };

  const t = translations[language];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = formData.identifier.toLowerCase();
    
    // Simulate real-world authentication where role is fetched from DB
    // Here we deduce it from the email/identifier typed
    if (identifier.includes('clerk') || identifier.includes('كاتب') || identifier.includes('sarah')) {
      onRoleChange('clerk');
    } else {
      onRoleChange('admin'); // default for "admin", "siam", etc.
    }
    
    onLogin();
  };

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Visual / Brand Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#003366]">
        {/* Moroccan Architectural Background with Navy Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1757163567171-d10652edde19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JvY2NhbiUyMGFyY2hpdGVjdHVyZSUyMGdlb21ldHJpYyUyMHBhdHRlcm58ZW58MXx8fHwxNzc0MDg4NTExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/90 to-[#001a33]/95" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-12 text-center">
          <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37]/30 mb-8 backdrop-blur-sm shadow-2xl">
            <Shield className="w-12 h-12 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            {t.welcome}
          </h1>
          <p className="text-lg text-[#D4AF37] font-medium tracking-widest uppercase mb-8">
            {t.ministry}
          </p>
          <div className="w-16 h-1 bg-[#D4AF37] rounded-full" />
          
          <div className="absolute bottom-8 text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} Adl-Tahssil.
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-6 sm:p-12 min-h-screen overflow-y-auto">
        <div className="w-full max-w-md flex flex-col">
          {/* Top Actions: Back to Home & Language Toggle */}
          <div className="flex items-center justify-start w-full mb-8 pb-4 border-b border-gray-100">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 text-gray-500 rounded-full text-sm font-semibold hover:bg-gray-200 hover:text-[#003366] transition-colors"
            >
              {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {t.backToHome}
            </button>
          </div>

          <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Top decorative bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#003366] via-[#003366] to-[#D4AF37]" />

            <div className="p-8 sm:p-10">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-[#003366]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Shield className="w-8 h-8 text-[#003366] -rotate-3" />
              </div>
              <h2 className="text-3xl font-bold text-[#003366] mb-2">{t.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{t.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Identifier / Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#0A2540]">
                  {t.emailLabel}
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  تلميح: اكتب 'admin' للمدير، أو 'clerk' للكاتب
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    placeholder={t.emailPlaceholder}
                    required
                    className="block w-full rounded-xl border border-gray-300 bg-white py-3.5 ps-12 pe-4 text-[#0A2540] placeholder-[#1F2937]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#0A2540]">
                  {t.passwordLabel}
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
                    placeholder={t.passwordPlaceholder}
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

              {/* Remember Me & Forgot Password */}
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
                    {t.rememberMe}
                  </span>
                </label>
                
                <a href="#" className="text-sm font-bold text-[#D4AF37] hover:text-[#b89528] transition-colors">
                  {t.forgotPassword}
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#003366] text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-[#002244] focus:ring-4 focus:ring-[#003366]/30 transition-all shadow-lg hover:shadow-xl mt-4 flex justify-center items-center gap-2"
              >
                {t.loginBtn}
              </button>
            </form>
          </div>
          
          {/* Bottom Security Note */}
          <div className="bg-white p-4 text-center border-t border-gray-100">
            <p className="text-xs text-[#0A2540] font-medium flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              فضاء مشفر ومؤمن بالكامل • وزارة العدل
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}