import React, { useState } from 'react';
import { Save, Calendar, BarChart3, FileText, Scale, FileSpreadsheet, Calculator, ScrollText } from 'lucide-react';

export default function FraisStatsForm() {

  const inputClassName = "w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-gray-50 transition-all outline-none font-medium text-[#003366] placeholder-gray-500";
  const labelClassName = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'];

  const renderCard = (title, icon) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-[#003366] to-[#004080] px-4 py-3 flex items-center gap-3">
        <div className="text-[#D4AF37]">{icon}</div>
        <h3 className="text-white font-bold text-base md:text-lg">{title}</h3>
      </div>
      <div className="p-5 space-y-4">
        <div>
          <label className={labelClassName}>عدد الملفات المستخلصة</label>
          <input type="number" name="numeros_dossiers" className={inputClassName} placeholder="0" required />
        </div>
        <div>
          <label className={labelClassName}>المبالغ المستخلصة (درهم)</label>
          <div className="relative">
            <input type="number" step="0.01" name="montant_total" className={`${inputClassName} font-mono text-base font-bold text-[#003366]`} placeholder="0.00" required />
            <span className="absolute top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm left-3" >درهم</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden font-sans" >
      {/* Header */}
      <div className="bg-[#F8F9FA] px-6 py-6 border-b border-gray-200 flex items-center gap-4">
        <div className="w-14 h-14 bg-[#003366] rounded-xl shadow-md flex items-center justify-center border border-[#D4AF37]/30">
          <BarChart3 className="w-7 h-7 text-[#D4AF37]" />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black text-[#003366] tracking-tight">إدخال الإحصائيات الشهرية</h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">لوحة إدخال البيانات المجمعة لوحدة تصفية الصوائر</p>
        </div>
      </div>

      <form className="p-6 space-y-8">
        
        {/* Top Section: Period Selection */}
        <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center gap-2 mb-4 text-[#003366]">
            <Calendar className="w-5 h-5" />
            <h3 className="font-bold">تحديد الفترة</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className={labelClassName}>الشهر</label>
              <select name="month" className={inputClassName} required>
                <option value="">--- اختر الشهر ---</option>
                {months.map((m, idx) => (
                  <option key={idx} value={String(idx + 1).padStart(2, '0')}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName}>السنة</label>
              <select name="year" className={inputClassName} required>
                <option value="">--- اختر السنة ---</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Form Area: 2 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Column 1: Stack of 3 */}
          <div className="flex flex-col gap-6">
            {renderCard('المختصرات', <FileText className="w-5 h-5" />)}
            {renderCard('الرسوم التكميلية', <Calculator className="w-5 h-5" />)}
            {renderCard('المساعدة القضائية', <Scale className="w-5 h-5" /> )}
          </div>
          
          {/* Column 2: Stack of 2 */}
          <div className="flex flex-col gap-6">
            {renderCard('الأوامر بالدفع', <FileSpreadsheet className="w-5 h-5" />)}
            {renderCard('السندات', <ScrollText className="w-5 h-5" />)}
          </div>
        </div>

        {/* Bottom Action */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] focus:ring-4 focus:ring-[#003366]/30 transition-all shadow-md hover:shadow-lg">
            <Save className="w-5 h-5" />
            <span>حفظ الإحصاء الشهري</span>
          </button>
        </div>  
      </form>
    </div>
  );
}