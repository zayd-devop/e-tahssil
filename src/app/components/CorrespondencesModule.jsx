import React, { useState } from 'react';
import { Send, Printer, Plus, Building, User, FileText, Info, Hash, Loader2, Archive, Search, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function CorrespondencesModule() {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // --- NOUVEAUX STATES POUR L'ARCHIVE ---
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveData, setArchiveData] = useState([]);
  const [searchArchiveQuery, setSearchArchiveQuery] = useState('');
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);
  
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

  // --- FONCTION POUR OUVRIR L'ARCHIVE ---
  const openArchiveModal = async () => {
    setIsArchiveModalOpen(true);
    setIsLoadingArchive(true);
    
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch('http://10.60.26.80:8000/api/correspondences/archive', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setArchiveData(data);
      } else {
        throw new Error('Failed to fetch archive');
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'تعذر تحميل الأرشيف' });
    } finally {
      setIsLoadingArchive(false);
    }
  };

  // Filtrer les données de l'archive selon la recherche (MODIFIÉ ICI)
  const filteredArchive = archiveData.filter(item => {
    const query = searchArchiveQuery.toLowerCase();
    return (
      (item.registration_number && item.registration_number.toLowerCase().includes(query)) || // Ajout de la recherche par numéro d'enregistrement
      (item.recipient_to && item.recipient_to.toLowerCase().includes(query)) ||
      (item.subject && item.subject.toLowerCase().includes(query)) ||
      (item.date_envoi && item.date_envoi.includes(query))
    );
  });

  // --- FONCTION POUR GÉNÉRER LA LETTRE ---
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

      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch('http://10.60.26.80:8000/api/generate-dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erreur réseau lors de la génération');
      }

      const blob = await response.blob();
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
    <div className="bg-gray-50/50 min-h-full font-sans flex flex-col" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6 pt-2 w-full flex-1 mb-24">
        
        {/* Header avec le nouveau bouton Archive */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Building className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">معلومات الإرسال</h2>
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">رقم التسجيل بسجل التبليغ والتحصيل</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={senderInfo.registrationNumber}
                        onChange={(e) => setSenderInfo({...senderInfo, registrationNumber: e.target.value})}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm"
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
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm"
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
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#003366] focus:border-[#003366] outline-none transition-all"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#003366]" />
              <h2 className="text-lg font-bold text-[#003366]">معلومات الجدول</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نوع المراسلات وتلخيص موضوعها <span className="text-red-500">*</span></label>
                <textarea 
                  value={tableInfo.subject}
                  onChange={(e) => setTableInfo({...tableInfo, subject: e.target.value})}
                  rows={6}
                  placeholder="أدخل التفاصيل هنا (أرقام الملفات الخ)..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm resize-y font-mono leading-relaxed"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات (نص الرسالة)</label>
                <textarea 
                  value={tableInfo.notes}
                  onChange={(e) => setTableInfo({...tableInfo, notes: e.target.value})}
                  rows={7}
                  placeholder="ملاحظات إضافية ونهاية الرسالة..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all shadow-sm resize-y leading-relaxed"
                ></textarea>
              </div>
              <div className="max-w-5xl mx-auto flex justify-start pl-64">
          <button 
            onClick={handlePrint}
            disabled={isGenerating}
            className={`flex items-center justify-center gap-2 px-6 py-3 text-white rounded-lg font-bold transition-colors focus:ring-4 shadow-md
              ${isGenerating ? 'bg-[#002244]/70 cursor-wait' : 'bg-[#002244] hover:bg-[#00152b] focus:ring-[#002244]/30'}`}
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Printer className="w-5 h-5" />}
            <span>{isGenerating ? 'جاري التحضير...' : 'تنزيل ملف Word'}</span>
          </button>
        </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Bouton Fixe */}
        

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
                {/* Le placeholder est mis à jour ici */}
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
          </div>
        </div>
      )}

    </div>
  );
}