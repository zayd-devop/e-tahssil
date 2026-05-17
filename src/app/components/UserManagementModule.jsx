import React, { useState, useEffect, useRef } from 'react';
import { FileSpreadsheet, Trash2, Search, User, Shield, ShieldAlert, CheckCircle2, XCircle, Key, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

// 🔥 1. IMPORT D'AXIOS
import api from '../api/axios'; 

export function UserManagementModule() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 2. CORRECTION : GET avec Axios
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // Axios gère l'URL de base et le Token
      const response = await api.get('/users');
      
      // Axios parse le JSON, on accède directement à response.data.data (selon la structure de ton backend)
      setUsers(response.data.data || response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 3. CORRECTION : POST avec FormData (Import)
  const handleFileUpload = async (e) => {
    e.preventDefault();
    let file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    Swal.fire({
      title: 'جاري استيراد الموظفين...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const response = await api.post('/users/import', formData);

      // On met à jour la liste avec les nouvelles données renvoyées par le serveur
      setUsers(response.data.data || response.data);
      Swal.fire({ icon: 'success', title: 'تم استيراد الموظفين بنجاح', timer: 2000, showConfirmButton: false });
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل الاستيراد';
      Swal.fire({ icon: 'error', title: 'فشل الاستيراد', text: errorMessage });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 🔥 4. CORRECTION : DELETE avec Axios
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

        // Mise à jour de l'état local sans recharger la page
        setUsers(users.filter(user => user.id !== id));
        Swal.fire('تم الحذف!', 'تم حذف الحساب بنجاح.', 'success');
        
      } catch (error) {
        Swal.fire('خطأ', 'حدث خطأ أثناء الحذف', 'error');
      }
    }
  };

  // 🔥 5. CORRECTION : POST avec Axios
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
          // On récupère le nouveau mot de passe directement depuis response.data
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

  // 🔥 6. SÉCURITÉ FRONT-END : Masquer le rôle "writer"
  const filteredUsers = users.filter(user => {
    // 🛑 On s'assure de ne JAMAIS afficher les "writers"
    const userRole = user.roleType || user.role_type;
    if (userRole === 'writer') return false;

    // Filtre de recherche classique
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || user.first_name} ${user.lastName || user.last_name}`.toLowerCase();
    return fullName.includes(query) || user.email.toLowerCase().includes(query);
  });

  return (
    <div className="bg-gray-50/50 min-h-full font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Bouton d'importation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 pt-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
              <User className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">إدارة الموظفين</h1>
              <p className="text-gray-500 mt-1 font-medium">إدارة حسابات وصلاحيات كتاب الضبط</p>
            </div>
          </div>
          
          <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 px-6 py-3.5 bg-[#D4AF37] text-[#003366] rounded-xl font-bold hover:bg-[#C5A028] shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث عن موظف..." 
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-shadow text-right"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-sm text-gray-500 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
              إجمالي الموظفين: <span className="text-[#003366] font-bold">{filteredUsers.length}</span>
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
                          <div className="w-10 h-10 rounded-full bg-[#003366]/10 text-[#003366] flex items-center justify-center font-bold text-sm border border-[#003366]/20 shadow-sm">
                            {getInitials(user.firstName || user.first_name, user.lastName || user.last_name)}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{`${user.firstName || user.first_name} ${user.lastName || user.last_name}`}</div>
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
                          {user.role}
                        </span>
                      </td>
                      
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
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-gray-400">
                      لا يوجد موظفين.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500">عرض {filteredUsers.length} من أصل {filteredUsers.length} سجلات</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}