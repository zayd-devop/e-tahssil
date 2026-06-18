import React, { useState, useEffect } from 'react';
import { Trash2, Search, User, Shield, ShieldAlert, CheckCircle2, XCircle, Key, Loader2, UserPlus, X, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

// 🔥 1. IMPORT D'AXIOS
import api from '../api/axios'; 

export function UserManagementModule() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Éléments d'état pour la nouvelle modale d'ajout
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'clerk',
    type_responsabilite: 'منتدب قضائي',
    grade: 'الدرجة الثانية'
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  // 🔥 2. GET avec Axios
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users', {
        params: { page: currentPage, search: searchQuery }
      });
      setUsers(response.data.data || []);
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 3. NOUVELLE FONCTION : Ajout manuel d'un fonctionnaire
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Envoi des données complètes à l'API Laravel
      const response = await api.post('/users', newUser);

      Swal.fire({
        icon: 'success',
        title: 'تم الإضافة!',
        text: 'تم تسجيل الموظف الجديد بنجاح في قاعدة البيانات',
        confirmButtonColor: '#003366',
        confirmButtonText: 'حسناً'
      });

      // Réinitialisation et fermeture
      setIsAddModalOpen(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'clerk',
        type_responsabilite: 'منتدب قضائي',
        grade: 'الدرجة الثانية'
      });

      // Recharger la liste pour afficher le nouveau venu
      fetchUsers();

    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء إضافة الموظف';
      Swal.fire({
        icon: 'error',
        title: 'خطأ!',
        text: errorMessage,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'إغلاق'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  // 🔥 4. DELETE avec Axios
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف حساب "${name}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#003366',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
        Swal.fire('تم الحذف!', 'تم حذف الحساب بنجاح.', 'success');
      } catch (error) {
        Swal.fire('خطأ', 'حدث خطأ أثناء الحذف', 'error');
      }
    }
  };

  // 🔥 5. POST avec Axios (Reset Password)
  const handleResetPassword = async (id, name) => {
    const result = await Swal.fire({
      title: 'إعادة تعيين كلمة السر؟',
      text: `سيتم توليد كلمة سر جديدة لـ "${name}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#003366',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.post(`/users/${id}/reset-password`);
        Swal.fire({
          icon: 'success',
          title: 'تم إعادة التعيين!',
          html: `كلمة السر الجديدة هي:<br><b style="font-size: 20px; color: #D4AF37;">${response.data.new_password}</b>`,
          confirmButtonColor: '#003366'
        });
      } catch (error) {
        Swal.fire('خطأ', 'حدث خطأ أثناء العملية', 'error');
      }
    }
  };

  const getInitials = (first, last) => {
    if(!first || !last) return 'M';
    return `${first.charAt(0)} ${last.charAt(0)}`;
  };

  const filteredUsers = users;

  const inputClassName = "w-full p-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent bg-gray-50 outline-none font-medium text-[#003366] text-right mt-1.5";
  const labelClassName = "block text-xs font-bold text-gray-700 text-right";

  return (
    <div className="bg-transparent min-h-full font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Boutons d'actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 pt-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#001f3f] rounded-2xl shadow-[0_10px_20px_rgba(0,51,102,0.2)] flex items-center justify-center border border-white/10">
              <User className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">إدارة الموظفين</h1>
              <p className="text-gray-500 mt-1 font-medium">إدارة حسابات وصلاحيات كتاب الضبط</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* 🔥 BOUTON D'AJOUT MANUEL UNIQUE */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#003366] to-[#002244] text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 shadow-md transition-all duration-300 active:scale-95 border-none w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-5 h-5 text-[#D4AF37]" />
              <span>إضافة موظف جديد</span>
            </button>
          </div>
        </div>

        {/* Section Table de Données */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#003366]/5 border border-white overflow-hidden transition-all duration-300 hover:shadow-[#003366]/10">
          <div className="p-5 border-b border-gray-100/50 flex items-center justify-between bg-white/50 backdrop-blur-md">
            <div className="relative w-72">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث عن موظف..." 
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] outline-none transition-all shadow-sm text-right"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-sm text-gray-500 font-medium bg-white/60 px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
              إجمالي الموظفين: <span className="text-[#003366] font-bold">{filteredUsers.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#003366]/5 text-[#003366] font-extrabold border-b border-[#003366]/10 backdrop-blur-sm">
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
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#D4AF37]" />
                      <p className="mt-4 text-gray-500">جاري تحميل الموظفين...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-[#003366] flex items-center justify-center font-bold text-sm border border-[#D4AF37]/20 shadow-sm">
                            {getInitials(user.firstName || user.first_name, user.lastName || user.last_name)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{`${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-gray-600 font-mono text-sm" dir="ltr">
                        <div className="text-right">{user.email}</div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border w-fit ${
                          (user.roleType || user.role_type) === 'admin' 
                            ? 'bg-purple-50 text-purple-700 border-purple-200' 
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {(user.roleType || user.role_type) === 'admin' ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                          {user.role || ((user.roleType || user.role_type) === 'admin' ? 'رئيس الوحدة' : 'منتدب قضائي')}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                          user.status === 'نشط' || !user.status
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {user.status || 'نشط'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 font-mono text-gray-500 text-xs whitespace-nowrap">
                        {user.lastLogin || user.last_login_at || '-'}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleResetPassword(user.id, `${user.firstName || user.first_name} ${user.lastName || user.last_name}`)}
                            className="p-2 text-gray-500 hover:text-[#003366] hover:bg-[#003366]/10 rounded-lg transition-colors border border-transparent hover:border-[#003366]/20"
                            title="إعادة تعيين كلمة السر"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id, `${user.firstName || user.first_name} ${user.lastName || user.last_name}`)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-20 text-center text-gray-400">لا يوجد موظفين.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!isLoading && totalItems > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-md">
              <span className="text-sm text-gray-500">
                عرض الصفحة <span className="font-bold text-gray-700">{currentPage}</span> من أصل <span className="font-bold text-gray-700">{totalItems}</span> سجلات
              </span>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                >
                  <span className="font-bold">السابق</span>
                </button>

                <div className="flex items-center gap-1">
                  <span className="px-4 py-2 font-bold text-sm bg-[#003366] text-white rounded-lg shadow-sm">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                >
                  <span className="font-bold">التالي</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== 🔥 FENÊTRE MODALE DE CRÉATION DE FONCTIONNAIRE ===== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200 my-auto">
            
            {/* Header de la Modale */}
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#D4AF37]" /> 
                إضافة حساب موظف جديد
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Formulaire de saisie */}
            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClassName}>الاسم الشخصي <span className="text-red-500">*</span></label>
                  <input type="text" name="first_name" value={newUser.first_name} onChange={handleInputChange} className={inputClassName} required />
                </div>
                <div>
                  <label className={labelClassName}>الاسم العائلي <span className="text-red-500">*</span></label>
                  <input type="text" name="last_name" value={newUser.last_name} onChange={handleInputChange} className={inputClassName} required />
                </div>
              </div>

              <div>
                <label className={labelClassName}>البريد الإلكتروني الحسابي <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={newUser.email} onChange={handleInputChange} className={`${inputClassName} text-left font-mono`} placeholder="p.nom@tahssil.ma" dir="ltr" required />
              </div>

              <div>
                <label className={labelClassName}>كلمة المرور الأولية <span className="text-red-500">*</span></label>
                <input type="password" name="password" value={newUser.password} onChange={handleInputChange} className={`${inputClassName} text-left font-mono`} placeholder="••••••••" dir="ltr" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClassName}>نوع المسؤولية</label>
                  <select name="type_responsabilite" value={newUser.type_responsabilite} onChange={handleInputChange} className={`${inputClassName} bg-white cursor-pointer`}>
                    <option value="منتدب قضائي">منتدب قضائي</option>
                    <option value="محرر قضائي">محرر قضائي</option>
                  </select>
                </div>
                <div>
                  <label className={labelClassName}>الدرجة</label>
                  <select name="grade" value={newUser.grade} onChange={handleInputChange} className={`${inputClassName} bg-white cursor-pointer`}>
                    <option value="الدرجة الأولى">الدرجة الأولى</option>
                    <option value="الدرجة الثانية">الدرجة الثانية</option>
                    <option value="الدرجة الثالثة">الدرجة الثالثة</option>
                    <option value="الدرجة الرابعة">الدرجة الرابعة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClassName}>صلاحية النظام (الدور)</label>
                <select name="role" value={newUser.role} onChange={handleInputChange} className={`${inputClassName} bg-white cursor-pointer font-bold text-[#003366]`}>
                  <option value="clerk">موظف / كاتب الضبط</option>
                  <option value="admin">مسؤول رئيس الوحدة (Admin)</option>
                </select>
              </div>

              {/* Actions de pied de page de la modale */}
              <div className="pt-4 border-t flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>حفظ الموظف</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}