import React, { useState } from 'react';
import { FileSpreadsheet, Trash2, Search, User, Shield, ShieldAlert, CheckCircle2, XCircle, Key} from 'lucide-react';

export function UserManagementModule() {
  // Données fictives des clerks de la شعبة
  const [users] = useState([
    {
      id: 1,
      firstName: 'محمد',
      lastName: 'الفاسي',
      email: 'm.elfassi@justice.gov.ma',
      role: 'مدير النظام',
      roleType: 'admin',
      status: 'نشط',
      lastLogin: '2026-05-02 08:30',
    },
    {
      id: 2,
      firstName: 'سناء',
      lastName: 'بنسودة',
      email: 's.bensouda@justice.gov.ma',
      role: 'كاتب ضبط',
      roleType: 'clerk',
      status: 'نشط',
      lastLogin: '2026-05-01 14:15',
    },
    {
      id: 3,
      firstName: 'يوسف',
      lastName: 'العراقي',
      email: 'y.iraqui@justice.gov.ma',
      role: 'كاتب ضبط',
      roleType: 'clerk',
      status: 'غير نشط',
      lastLogin: '2026-04-25 10:00',
    },
    {
      id: 4,
      firstName: 'فاطمة',
      lastName: 'الزهراء',
      email: 'f.zahraa@justice.gov.ma',
      role: 'كاتب ضبط',
      roleType: 'clerk',
      status: 'نشط',
      lastLogin: '2026-05-02 09:15',
    }
  ]);

  // Générateur d'initiales pour l'avatar
  const getInitials = (first, last) => {
    return `${first.charAt(0)} ${last.charAt(0)}`;
  };

  return (
    <div className="bg-gray-50/50 min-h-full font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Bouton d'importation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
              <User className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">إدارة الموظفين</h1>
              <p className="text-gray-500 mt-1 font-medium">إدارة حسابات وصلاحيات كتاب الضبط</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3.5 bg-[#D4AF37] text-[#003366] rounded-xl font-bold hover:bg-[#C5A028] shadow-lg hover:shadow-xl transition-all active:scale-95">
            <FileSpreadsheet className="w-5 h-5" />
            <span>استيراد قائمة الموظفين</span>
          </button>
        </div>

        {/* Section Table de Données */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Barre de recherche et statistiques */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="relative w-72">
              <input 
                type="text" 
                placeholder="البحث عن موظف..." 
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-shadow text-right"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              إجمالي الموظفين: <span className="text-[#003366] font-bold">{users.length}</span>
            </div>
          </div>

          {/* Tableau */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#003366] text-white font-bold border-b border-[#002244]">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">المستخدم</th>
                  <th className="px-6 py-4 whitespace-nowrap">البريد الإلكتروني</th>
                  <th className="px-6 py-4 whitespace-nowrap">الدور</th>
                  <th className="px-6 py-4 whitespace-nowrap">الحالة</th>
                  <th className="px-6 py-4 whitespace-nowrap">آخر تسجيل دخول</th>
                  <th className="px-6 py-4 whitespace-nowrap text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    {/* Info Utilisateur */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#003366]/10 text-[#003366] flex items-center justify-center font-bold text-sm border border-[#003366]/20 shadow-sm">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600 font-mono text-sm" dir="ltr">
                      <div className="text-right">{user.email}</div>
                    </td>
                    
                    {/* Rôle */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border w-fit ${
                        user.roleType === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-200' 
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {user.roleType === 'admin' ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                        {user.role}
                      </span>
                    </td>
                    
                    {/* Statut */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                        user.status === 'نشط' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-300'
                      }`}>
                        {user.status === 'نشط' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {user.status}
                      </span>
                    </td>
                    
                    {/* Dernière connexion */}
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs whitespace-nowrap">
                      {user.lastLogin}
                    </td>
                    
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-gray-500 hover:text-[#003366] hover:bg-[#003366]/10 rounded-lg transition-colors border border-transparent hover:border-[#003366]/20"
                          title="إعادة تعيين كلمة السر"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500">عرض 1 إلى {users.length} من أصل {users.length} سجلات</span>
            <div className="flex gap-1" dir="ltr">
              <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-400 cursor-not-allowed">السابق</button>
              <button className="px-3 py-1.5 text-sm border border-transparent rounded-lg bg-[#003366] text-white shadow-sm font-bold">1</button>
              <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-400 cursor-not-allowed">التالي</button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}