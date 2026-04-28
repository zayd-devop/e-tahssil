import React from 'react';
import { LayoutList, FolderOpen, User, FileCheck,Send, Save} from 'lucide-react';


export default function DecisionsForm() {
  const inputClassName = "w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-gray-50 transition-all outline-none text-[#003366] placeholder-gray-500";
  const labelClassName = "block text-sm font-bold text-[#003366] mb-2";

  return (
  <div className="bg-gray-50/50 font-sans">
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="w-16 h-16 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
          <LayoutList className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <div className='text-right'>
            <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">إدخال التبليغات القضائية</h1>
            <p className="text-gray-500 mt-1 font-medium">سجل التبليغات القضائية الرقمي</p>
        </div>
        </div>
        {/* Form */}
      <form className="space-y-6">
        {/* Card 1: Références du Dossier */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <FolderOpen className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">مراجع الملف</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClassName}>رقم الملف</label>
                <input type="text" name="dossierNum" className={inputClassName} required />
              </div>
              <div>
              <label className={labelClassName}>نوع الحكم</label>
              <select name="typeJugement" className={inputClassName} required>
                <option value="">--- اختر نوع الحكم ---</option>
                <option value="حضوري">حضوري</option>
                <option value="غيابي">غيابي</option>
                <option value="بمثابة حضوري">بمثابة حضوري</option>
              </select>
              </div>
              <div>
              <label className={labelClassName}>الشعبة</label>
              <select name="typeJugement" className={inputClassName} required>
                <option value="">--- اختر الشعبة ---</option>
                <option value="حوادث السير">حوادث السير</option>
                <option value="جنح السير">جنح السير</option>
                <option value="جنحي عادي">جنحي عادي</option>
                <option value="مخالفات السير">مخالفات السير</option>
                <option value="قضاء القرب">قضاء القرب</option>
              </select>
              </div>
            </div>
          </div>
        {/* Card 2: Destinataire */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <User className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">المبلغ إليه</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={labelClassName}>اسم المبلغ إليه</label>
                <input type="text" name="destinataireNom" className={inputClassName} required />
                <label className={labelClassName}>نوع التعريف</label>
                <select name="typeIdentite" className={inputClassName} required>
                  <option value="">--- اختر نوع التعريف ---</option>
                  <option value="بطاقة التعريف الوطنية">بطاقة التعريف الوطنية</option>
                  <option value="جواز السفر">جواز السفر</option>
                  <option value="رخصة السياقة">رخصة السياقة</option>
                  <option value="بطاقة إقامة">بطاقة إقامة</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>رقم التعريف</label>
                <input type="text" name="destinataireId" className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>العنوان الكامل</label>
                <textarea name="destinataireAdresse" className={`${inputClassName} min-h-[100px] resize-y`} required />
              </div>
            </div>
          </div>
        {/* Card 3 : Retour & Resultat */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-[#D4AF37]/50 overflow-hidden relative shadow-[#D4AF37]/10">
            <div className={`absolute top-0 w-2 h-full bg-gradient-to-b from-[#D4AF37] to-[#C5A028]`} />
            <div className="bg-gradient-to-r from-white to-[#D4AF37]/10 px-6 py-4 border-b border-[#D4AF37]/20 flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-[#003366]" />
              <h2 className="text-xl font-black text-[#003366]">المبالغ المحكوم بها</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>مبلغ الغرامة</label>
                <input type="number" name="montant" className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>مبلغ الصوائر</label>
                <input type="number" name="montantAmende" className={inputClassName} required />
              </div>
            </div>
          </div>
        {/* Card 4: Affectation */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003366]/5 px-6 py-4 border-b border-[#003366]/10 flex items-center gap-3">
              <Send className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">إسناد التبليغ</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClassName}>نوع الجهة المكلفة بالتبليغ</label>
                <select name="agent" className={inputClassName} required>
                  <option value="">-- اختر نوع الجهة المكلفة --</option>
                  <option value="كتابة الضبط">كتابة الضبط</option>
                  <option value="مفوض قضائي">مفوض قضائي</option>
                  <option value="البريد المضمون">البريد المضمون</option>
                  <option value="السلطة المحلية">السلطة المحلية</option>
                </select>
              </div>
              <div>
                <label className={labelClassName}>تاريخ توجيه الوثيقة</label>
                <input type="date" name="remiseDate"  className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>تاريخ تسلمه الوثيقة</label>
                <input type="date" name="remiseDate"  className={inputClassName} required />
              </div>
              <div>
                <label className={labelClassName}>نوع التسليم</label>
                <select name="agent" className={inputClassName} required>
                  <option value="">-- اختر نوع التسليم --</option>
                  <option value="سلمت لشخصه">سلمت لشخصه</option>
                  <option value="سلمت لغيره">سلمت لغيره</option>
                  <option value="رفض التسلم">رفض التسلم</option>
                  <option value="مجهول بالعنوان">مجهول بالعنوان</option>
                </select>
              </div>
            </div>
            </div>
            {/* Bottom Action */}
          <div className="mt-8 flex justify-end">
              <button type="submit" className="flex items-center gap-3 px-8 py-4 bg-[#003366] text-white rounded-xl text-lg font-bold hover:bg-[#002244] focus:ring-4 focus:ring-[#003366]/30 transition-all shadow-lg hover:shadow-xl">
                <Save className="w-6 h-6" />
                <span>حفظ التبليغ</span>
              </button>
          </div>
      </form>
    </div>
  </div>
)
}
