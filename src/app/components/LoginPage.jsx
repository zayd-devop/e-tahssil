import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Shield, Globe, ArrowLeft, ArrowRight } from 'lucide-react';


export function LoginPage() {

  return (
    <div className="min-h-screen flex" >
      {/* Visual / Brand Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#003366]">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1757163567171-d10652edde19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3JvY2NhbiUyMGFyY2hpdGVjdHVyZSUyMGdlb21ldHJpYyUyMHBhdHRlcm58ZW58MXx8fHwxNzc0MDg4NTExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#003366]/90 to-[#001a33]/95" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-white p-12 text-center bg-cover bg-center bg-no-repeat"
        style={{backgroundImage :'url(https://static.wixstatic.com/media/0140ea_7835b4929d9e4304ae1fa8c94c096ad4~mv2.jpg/v1/fill/w_506,h_290,al_c,q_80,usm_0.66_1.00_0.01/0140ea_7835b4929d9e4304ae1fa8c94c096ad4~mv2.jpg)'}
       } >
        <div className="absolute inset-0 bg-black/40 z-0"></div>
          <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center border-2 border-[#D4AF37]/30 mb-8 backdrop-blur-sm shadow-2xl">
            <Shield className="w-12 h-12 text-[#D4AF37]" />
          </div>
          
          <div className="w-16 h-1 bg-[#D4AF37] rounded-full" />
          <div className="absolute bottom-8 text-sm text-gray-400 font-medium">
            © {new Date().getFullYear()} E-Tahssil.
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white p-6 sm:p-12 min-h-screen overflow-y-auto">
        <div className="w-full max-w-md flex flex-col">

          <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Top decorative bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#003366] via-[#003366] to-[#D4AF37]" />

            <div className="p-8 sm:p-10">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-[#003366]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
                <Shield className="w-8 h-8 text-[#003366] -rotate-3" />
              </div>
              <h2 className="text-3xl font-bold text-[#003366] mb-2">تسجيل الدخول</h2>
              <p className="text-gray-500 text-sm leading-relaxed">الولوج إلى النظام المندمج للتدبير الإداري والمالي</p>
            </div>

            <form className="space-y-6">
              {/* Identifier / Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#0A2540]">البريد الإلكتروني أو رقم التأجير</label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input type="text" name="identifier" placeholder="البريد الإلكتروني أو رقم التأجير" required className="block w-full rounded-xl border border-gray-300 bg-white py-3.5 ps-12 pe-4 text-[#0A2540] placeholder-[#1F2937]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all shadow-sm"/>
                </div>
              </div>
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-[#0A2540]">كلمة المرور</label>
                <div className="relative flex items-center">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type='password' name="password" placeholder='أدخل كلمة المرور...' required className="block w-full rounded-xl border border-gray-300 bg-white py-3.5 ps-12 pe-12 text-[#0A2540] placeholder-[#1F2937]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all shadow-sm"/>
                  <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-4 text-gray-400 hover:text-[#003366] transition-colors focus:outline-none">
                  </button>
                </div>
              </div>
               {/* Forgot Password */} 
              <div className="flex items-center justify-between pt-2">
                <a href="#" className="text-sm font-bold text-[#D4AF37] hover:text-[#b89528] transition-colors">هل نسيت كلمة المرور؟</a>
              </div>
              {/* Submit Button */}
              <button type="submit" className="w-full bg-[#003366] text-white py-4 px-6 rounded-xl text-lg font-bold hover:bg-[#002244] focus:ring-4 focus:ring-[#003366]/30 transition-all shadow-lg hover:shadow-xl mt-4 flex justify-center items-center gap-2">الدخول للفضاء الخاص</button>
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