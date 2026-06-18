import React, { useState, useEffect } from 'react';
import { Send, Printer, Plus, Building, User, FileText, Info, Hash, Loader2, Archive, Search, X, ChevronRight, ChevronLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios'; 

export default function CorrespondencesModule() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // --- NOUVEAUX STATES POUR L'ARCHIVE ---
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveData, setArchiveData] = useState([]);
  const [searchArchiveQuery, setSearchArchiveQuery] = useState('');
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);
  const [archivePage, setArchivePage] = useState(1);
  const [archiveTotalItems, setArchiveTotalItems] = useState(0);
  const [archiveTotalPages, setArchiveTotalPages] = useState(1);
  
  // State for dynamic supervision inputs
  const [recipientSupervisors, setRecipientSupervisors] = useState([]);
  
  // معلومات المرسل
  const [senderInfo, setSenderInfo] = useState({
    from: '',
    registrationNumber: '' 
  });

  // معلومات المرسل إليه
  const [recipientInfo, setRecipientInfo] = useState({
    to: '',
  });
  
  // معلومات الجدول
  const [tableInfo, setTableInfo] = useState({
    subject: '',
    attachmentsCount: '',
    notes: ''
  });

  const addSupervisor = () => {
    setRecipientSupervisors([...recipientSupervisors, '']);
  };

  const updateSupervisor = (index, value) => {
    const newSupervisors = [...recipientSupervisors];
    newSupervisors[index] = value;
    setRecipientSupervisors(newSupervisors);
  };

  // --- 🔥 CORRECTION 1: FONCTION POUR OUVRIR L'ARCHIVE (100% AXIOS) ---
  const fetchArchive = async () => {
    if (!isArchiveModalOpen) return;
    setIsLoadingArchive(true);
    
    try {
      const response = await api.get('/correspondences/archive', {
        params: { page: archivePage, search: searchArchiveQuery }
      });
      
      setArchiveData(response.data.data || []);
      setArchiveTotalItems(response.data.total || 0);
      setArchiveTotalPages(response.data.last_page || 1);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoadingArchive(false);
    }
  };

  useEffect(() => {
    fetchArchive();
  }, [archivePage, searchArchiveQuery, isArchiveModalOpen]);

  const openArchiveModal = () => {
    setArchivePage(1);
    setSearchArchiveQuery('');
    setIsArchiveModalOpen(true);
  };

  const filteredArchive = archiveData;

  // --- 🔥 CORRECTION 2: FONCTION POUR GÉNÉRER LA LETTRE (100% AXIOS AVEC BLOB) ---
  const handlePrint = async () => {
    if (!recipientInfo.to || !tableInfo.subject) {
      Swal.fire({
        icon: 'warning',
        title: 'معلومات ناقصة',
        text: 'الرجاء ملء حقل "إلى" (المرسل إليه) وموضوع المراسلة على الأقل.',
        confirmButtonColor: '#003366'
      });
      return;
    }

    try {
      setIsGenerating(true);
      Swal.fire({
        title: 'جاري إنشاء المستند...',
        text: 'يتم الآن تحضير ورقة الإرسال',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      let signerName = '.............................................';
      let signerRole = 'كاتب الضبط';

      const userStorage = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        const prenom = userData.prenom || userData?.clerk?.prenom || userData?.admin?.prenom || '';
        const nom = userData.nom || userData?.clerk?.nom || userData?.admin?.nom || '';
        
        if (prenom || nom) signerName = `${prenom} ${nom}`.trim();
        else signerName = userData.name || 'الاسم غير متوفر';

        let currentStatus = userData.type_responsabilite || userData?.clerk?.type_responsabilite || userData?.admin?.type_responsabilite;
        if (currentStatus) signerRole = currentStatus;
        else if (userData.role === 'admin') signerRole = 'رئيس الوحدة';
      }

      const validSupervisors = recipientSupervisors.filter(s => s.trim() !== '');

      const payload = {
        registration_number: senderInfo.registrationNumber,
        sender_from: senderInfo.from,
        recipient_to: recipientInfo.to,
        recipient_supervisors: validSupervisors, 
        subject: tableInfo.subject,
        attachments_count: tableInfo.attachmentsCount,
        notes: tableInfo.notes,
        signer_name: signerName,
        signer_role: signerRole
      };

      // 🔥 Requête POST Axios avec l'option blob pour les fichiers
      const response = await api.post('/generate-dispatch', payload, {
        responseType: 'blob' // TRÈS IMPORTANT pour télécharger un fichier Word
      });

      // Avec Axios, le fichier Blob est directement dans response.data
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const safeRecipientName = recipientInfo.to.replace(/[/\\?%*:|"<>]/g, '-').substring(0, 30);
      link.download = `إرسالية_${safeRecipientName}.docx`; 
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: 'تم التنزيل!',
        text: 'تم إنشاء المستند بنجاح',
        confirmButtonColor: '#003366',
        timer: 2000
      });

    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء الاتصال بالخادم لإنشاء المستند.',
        confirmButtonColor: '#003366'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-transparent min-h-full font-sans flex flex-col" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6 pt-2 w-full flex-1 mb-24">
        
        {/* Header avec le nouveau bouton Archive */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#001f3f] rounded-2xl shadow-[0_10px_20px_rgba(0,51,102,0.2)] flex items-center justify-center border border-white/10">
              <Send className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">توليد ورقة الإرسال</h1>
              <p className="text-gray-500 mt-1 font-medium">المراسلات والوثائق الإدارية</p>
            </div>
          </div>
          
          <button 
            onClick={openArchiveModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#003366] text-[#003366] rounded-xl font-bold hover:bg-[#003366] hover:text-white transition-all shadow-sm group"
          >
            <Archive className="w-5 h-5 group-hover:animate-bounce" />
            <span>أرشيف المراسلات</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Card 1: معلومات الإرسال */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#003366]/5 border border-white overflow-hidden transition-all duration-300 hover:shadow-[#003366]/10">
            <div className="bg-white/50 backdrop-blur-md px-6 py-5 border-b border-gray-100/50 flex items-center gap-3">
              <div className="p-2 bg-[#003366]/5 rounded-lg">
                <Building className="w-5 h-5 text-[#003366]" />
              </div>
              <h2 className="text-xl font-extrabold text-[#003366]">معلومات الإرسال</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Section A: المرسل */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-800">المرسل</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">من <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={senderInfo.from}
                      onChange={(e) => setSenderInfo({...senderInfo, from: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none transition-all shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">رقم التسجيل بسجل التبليغ والتحصيل</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={senderInfo.registrationNumber}
                        onChange={(e) => setSenderInfo({...senderInfo, registrationNumber: e.target.value})}
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none transition-all shadow-sm"
                        dir="ltr"
                      />
                      <Hash className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section B: المرسل إليه */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Building className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-800">المرسل إليه</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">إلى <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={recipientInfo.to}
                      onChange={(e) => setRecipientInfo({...recipientInfo, to: e.target.value})}
                      placeholder="أدخل صفة أو اسم المرسل إليه..."
                      className="w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none transition-all shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">تحت إشراف</label>
                    <div className="space-y-3">
                      {recipientSupervisors.map((supervisor, index) => (
                        <input 
                          key={index}
                          type="text" 
                          placeholder={`جهة الإشراف ${index + 1}...`}
                          value={supervisor}
                          onChange={(e) => updateSupervisor(index, e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#003366] focus:bg-white outline-none transition-all shadow-sm"
                        />
                      ))}
                    </div>
                    
                    <button 
                      onClick={addSupervisor}
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-dashed border-[#003366]/40 text-[#003366] rounded-xl hover:bg-[#003366]/5 hover:border-[#003366] transition-all font-bold text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة جهة إشراف أخرى
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: معلومات الجدول */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#003366]/5 border border-white overflow-hidden transition-all duration-300 hover:shadow-[#003366]/10">
            <div className="bg-white/50 backdrop-blur-md px-6 py-5 border-b border-gray-100/50 flex items-center gap-3">
              <div className="p-2 bg-[#003366]/5 rounded-lg">
                <FileText className="w-5 h-5 text-[#003366]" />
              </div>
              <h2 className="text-xl font-extrabold text-[#003366]">معلومات الجدول</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نوع المراسلات وتلخيص موضوعها <span className="text-red-500">*</span></label>
                <textarea 
                  value={tableInfo.subject}
                  onChange={(e) => setTableInfo({...tableInfo, subject: e.target.value})}
                  rows={6}
                  placeholder="أدخل التفاصيل هنا (أرقام الملفات الخ)..."
                  className="w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none transition-all shadow-sm resize-y font-mono leading-relaxed"
                  dir="rtl"
                ></textarea>
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-2">عدد المرفقات</label>
                <input 
                  type="number" 
                  min="0"
                  value={tableInfo.attachmentsCount}
                  onChange={(e) => setTableInfo({...tableInfo, attachmentsCount: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none transition-all shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات (نص الرسالة)</label>
                <textarea 
                  value={tableInfo.notes}
                  onChange={(e) => setTableInfo({...tableInfo, notes: e.target.value})}
                  rows={7}
                  placeholder="ملاحظات إضافية ونهاية الرسالة..."
                  className="w-full px-4 py-3 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none transition-all shadow-sm resize-y leading-relaxed"
                ></textarea>
              </div>
              <div className="max-w-5xl mx-auto flex justify-start pl-64">
                <button 
                  onClick={handlePrint}
                  disabled={isGenerating}
                  className={`flex items-center justify-center gap-2 px-6 py-3.5 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5
                    ${isGenerating ? 'bg-gradient-to-r from-[#003366]/70 to-[#002244]/70 cursor-wait' : 'bg-gradient-to-r from-[#003366] to-[#002244]'}`}
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />}
                  <span>{isGenerating ? 'جاري التحضير...' : 'تنزيل ملف Word'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL D'ARCHIVE --- */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Archive className="w-6 h-6 text-[#D4AF37]" />
                أرشيف المراسلات
              </h2>
              <button 
                onClick={() => setIsArchiveModalOpen(false)} 
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barre de recherche Modal */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="relative max-w-md mx-auto md:mx-0 md:mr-auto">
                <input 
                  type="text" 
                  value={searchArchiveQuery}
                  onChange={(e) => setSearchArchiveQuery(e.target.value)}
                  placeholder="ابحث برقم التسجيل، المرسل إليه، الموضوع، أو التاريخ..." 
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none shadow-sm"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Contenu de la Modal (Tableau) */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {isLoadingArchive ? (
                <div className="flex flex-col items-center justify-center h-48 space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                  <p className="text-[#003366] font-bold">جاري تحميل الأرشيف...</p>
                </div>
              ) : filteredArchive.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="font-medium text-lg">لا توجد مراسلات مطابقة لبحثك</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-[#003366]/5 border-b border-gray-200 text-[#003366]">
                      <tr>
                        <th className="px-6 py-4 font-bold w-1/4">رقم التسجيل</th>
                        <th className="px-6 py-4 font-bold w-1/4">تاريخ الإرسال</th>
                        <th className="px-6 py-4 font-bold w-1/3">المرسل إليه</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredArchive.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 font-mono font-medium text-gray-600 whitespace-nowrap">
                            {item.registration_number}
                          </td>
                          <td className="px-6 py-4 font-mono font-medium text-gray-600 whitespace-nowrap">
                            {item.date_envoi}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-800">
                            {item.recipient_to}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination Archive */}
            {!isLoadingArchive && archiveTotalItems > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
                <span className="text-sm text-gray-500">
                  عرض الصفحة <span className="font-bold text-gray-700">{archivePage}</span> من أصل <span className="font-bold text-gray-700">{archiveTotalItems}</span> سجلات
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    disabled={archivePage === 1}
                    onClick={() => setArchivePage(prev => Math.max(prev - 1, 1))}
                    className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5 text-[#003366]" />
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(archiveTotalPages)].map((_, i) => {
                      const page = i + 1;
                      if (page === 1 || page === archiveTotalPages || (page >= archivePage - 2 && page <= archivePage + 2)) {
                        return (
                          <button
                            key={page}
                            onClick={() => setArchivePage(page)}
                            className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                              archivePage === page 
                              ? 'bg-[#003366] text-[#D4AF37] shadow-lg' 
                              : 'bg-white border text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button 
                    disabled={archivePage === archiveTotalPages || archiveTotalPages === 0}
                    onClick={() => setArchivePage(prev => Math.min(prev + 1, archiveTotalPages))}
                    className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#003366]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}