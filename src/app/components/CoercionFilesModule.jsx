import React, { useState, useEffect, useRef } from 'react';
import { 
  Gavel, 
  UserPlus, 
  Search, 
  X, 
  Calendar, 
  User, 
  FileText, 
  CreditCard,
  ChevronDown,
  CheckCircle,
  Clock,
  Scale,
  Loader2,
  Plus,
  Filter,
  FileSpreadsheet // 👈 إضافة أيقونة إكسيل
} from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios'; 

export function CoercionFilesModule() {
  // --- ÉTATS DES DONNÉES ---
  const [coercionFiles, setCoercionFiles] = useState([]);
  const [judges, setJudges] = useState([]);
  const [excelFiles, setExcelFiles] = useState([]); // 👈 سجل ملفات إكسيل المستوردة
  const [searchQuery, setSearchQuery] = useState('');
  const [excelSearchQuery, setExcelSearchQuery] = useState(''); // 👈 بحث خاص بسجل إكسيل
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  const [yearFilter, setYearFilter] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef(null);

  // --- ÉTATS DES MODALES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusUpdateFile, setStatusUpdateFile] = useState(null);

  // --- ÉTATS DES FORMULAIRES ---
  const [addForm, setAddForm] = useState({
    file_number: '',
    registration_date: new Date().toISOString().split('T')[0], 
    debtor_name: '',
    amount: '',
    judge_id: ''
  });

  const [statusForm, setStatusForm] = useState({
    status: 'في طور',
    return_date: '',
    duration: '',
    amount: '',
    collection_date: ''
  });

  // --- CHARGEMENT INITIAL ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchCoercionFiles(), fetchJudges(), fetchExcelRegistry()]);
    } catch (error) {
      console.error("Erreur de chargement des données initiales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoercionFiles = async () => {
    try {
      const response = await api.get('/coercion-files');
      setCoercionFiles(response.data);
    } catch (error) {
      console.error("Erreur de chargement des dossiers d'إكراه:", error);
    }
  };

  const fetchJudges = async () => {
    try {
      const response = await api.get('/judges');
      setJudges(response.data);
    } catch (error) {
      console.error("Erreur de chargement des juges:", error);
    }
  };

  // --- 🔥 جلب بيانات السجل المستورد من إكسيل ---
  const fetchExcelRegistry = async () => {
    try {
      const response = await api.get('/coercion-excel-registry');
      setExcelFiles(response.data);
    } catch (error) {
      console.error("Erreur de chargement du registre Excel:", error);
    }
  };

  // --- 🔥 معالجة رفع واستيراد ملف سجل الإكراه البدني ---
  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsImporting(true);
      Swal.fire({ title: 'جاري استيراد سجل ملفات الإكراه...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      await api.post('/coercion-files/import-registry', formData);
      
      Swal.fire({ icon: 'success', title: 'تم الاستيراد بنجاح', text: 'تم دمج السجل التاريخي بنجاح', confirmButtonColor: '#003366' });
      fetchExcelRegistry();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'خطأ', text: error.response?.data?.message || 'فشل استيراد الملف الجمركي', confirmButtonColor: '#003366' });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddFileSubmit = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({ title: 'جاري حفظ الملف...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await api.post('/coercion-files', addForm);
      Swal.fire({ icon: 'success', title: 'تمت الإضافة بنجاح!', text: 'تم تسجيل ملف الإكراه البدني بنجاح', confirmButtonColor: '#003366', timer: 2000 });
      setIsAddModalOpen(false);
      setAddForm({
        file_number: '',
        registration_date: new Date().toISOString().split('T')[0],
        debtor_name: '',
        amount: '',
        judge_id: ''
      });
      fetchCoercionFiles(); 
    } catch (error) {
      const msg = error.response?.data?.message || 'حدث خطأ أثناء حفظ الملف';
      Swal.fire({ icon: 'error', title: 'خطأ', text: msg, confirmButtonColor: '#003366' });
    }
  };

  const handleAddNewJudgeClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { value: judgeName } = await Swal.fire({
      title: 'إضافة قاضي جديد للمنظومة',
      input: 'text',
      inputLabel: 'الاسم الكامل للقاضي',
      inputPlaceholder: 'أدخل الاسم الكامل هنا...',
      showCancelButton: true,
      confirmButtonText: 'إضافة الحساب',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#003366',
      inputValidator: (value) => {
        if (!value) return 'المرجو إدخال اسم القاضي!';
      }
    });

    if (judgeName) {
      try {
        Swal.fire({ title: 'جاري الحفظ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const response = await api.post('/judges', { name: judgeName });
        await fetchJudges(); 
        setAddForm(prev => ({ ...prev, judge_id: response.data.judge.id }));
        Swal.fire({ icon: 'success', title: 'تمت الإضافة!', text: 'تم إدراج القاضي الجديد بنجاح', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'القاضي مسجل بالفعل أو حدث خطأ بالخادم', confirmButtonColor: '#003366' });
      }
    }
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({ title: 'جاري تحديث الحالة...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      const payload = { status: statusForm.status };
      if (statusForm.status === 'محكوم') {
        payload.return_date = statusForm.return_date;
        payload.duration = statusForm.duration;
        payload.amount = statusForm.amount;
      } else if (statusForm.status === 'منفذ') {
        payload.collection_date = statusForm.collection_date;
      }

      await api.put(`/coercion-files/${statusUpdateFile.id}/status`, payload);
      Swal.fire({ icon: 'success', title: 'تم التحديث بنجاح', timer: 1500, showConfirmButton: false });
      setStatusUpdateFile(null);
      fetchCoercionFiles(); 
    } catch (error) {
      const msg = error.response?.data?.message || 'فشل تحديث حالة الملف';
      Swal.fire({ icon: 'error', title: 'خطأ', text: msg, confirmButtonColor: '#003366' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'في طور':
        return <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" />في طور</span>;
      case 'محكوم':
        return <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100 flex items-center gap-1.5 w-fit"><Scale className="w-3.5 h-3.5" />محكوم</span>;
      case 'منفذ':
        return <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 flex items-center gap-1.5 w-fit"><CheckCircle className="w-3.5 h-3.5" />منفذ</span>;
      default:
        return null;
    }
  };

  // --- FILTRAGE TABLEAU CLIENT CONTINU ---
  const filteredFiles = coercionFiles.filter((file) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      (file.fileNumber && file.fileNumber.toLowerCase().includes(query)) ||
      (file.debtorName && file.debtorName.toLowerCase().includes(query))
    );
    const matchesStatus = statusFilter === 'ALL' || file.status === statusFilter;
    const matchesYear = !yearFilter || (file.registrationDate && file.registrationDate.startsWith(yearFilter));

    return matchesSearch && matchesStatus && matchesYear;
  });

  // --- FILTRAGE DES DOSSIERS DE L'EXCEL IMPORTÉ ---
  const filteredExcelRegistry = excelFiles.filter((file) => {
    const query = excelSearchQuery.toLowerCase();
    return (
      (file.file_number && file.file_number.toLowerCase().includes(query)) ||
      (file.debtor_name && file.debtor_name.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* En-tête */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#003366]/5 rounded-xl flex items-center justify-center text-[#003366]">
            <Gavel className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#003366]">ملفات الإكراه البدني</h1>
            <p className="text-gray-500 font-medium mt-1">تتبع ومراقبة قضايا الإكراه البدني ومردوديتها</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 🔥 زر استيراد سجل الإكراه التاريخي */}
          <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleExcelImport} />
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={isImporting}
            className="flex items-center gap-2 bg-white border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-5 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span>استيراد السجل (Excel)</span>
          </button>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#c5a028] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-[#D4AF37]/20 active:scale-95"
          >
            <UserPlus className="w-5 h-5" />
            <span>إضافة ملف إكراه بدني</span>
          </button>
        </div>
      </div>

      {/* Barre de filtrage - Opérationnelle */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-4 pr-12 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] text-gray-900 font-medium text-right"
              placeholder="البحث برقم الملف أو اسم المكره..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="relative w-full md:w-44 shrink-0">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full pr-10 pl-10 py-3 bg-white border-2 border-[#D4AF37] rounded-xl text-sm font-bold text-gray-700 appearance-none text-center cursor-pointer shadow-sm focus:outline-none"
              >
                <option value="">كل السنوات</option>
                {Array.from({ length: 27 }, (_, i) => 2000 + i).reverse().map(year => (
                  <option key={year} value={year}>سنة {year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#D4AF37]"><Calendar className="h-4 w-4" /></div>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"><ChevronDown className="h-4 w-4" /></div>
            </div>

            <div className="relative w-full md:w-44 shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pr-10 pl-10 py-3 bg-white border-2 border-[#D4AF37] rounded-xl text-sm font-bold text-gray-700 appearance-none text-center cursor-pointer shadow-sm focus:outline-none"
              >
                <option value="ALL">جميع الحالات</option>
                <option value="في طور">في طور</option>
                <option value="محكوم">محكوم</option>
                <option value="منفذ">منفذ</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#D4AF37]"><Filter className="h-4 w-4" /></div>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400"><ChevronDown className="h-4 w-4" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau principal (Suivi opérationnel) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/60 border-b border-gray-100 font-bold text-[#003366] text-right">الملفات قيد المعالجة الحالية</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-right">
            <thead className="bg-[#003366]">
              <tr>
                <th className="px-6 py-4 text-white font-bold text-sm">تاريخ التسجيل</th>
                <th className="px-6 py-4 text-white font-bold text-sm">رقم ملف الإكراه</th>
                <th className="px-6 py-4 text-white font-bold text-sm">اسم المكره</th>
                <th className="px-6 py-4 text-white font-bold text-sm">مبلغ الإكراه (درهم)</th>
                <th className="px-6 py-4 text-white font-bold text-sm">قاضي تطبيق العقوبة</th>
                <th className="px-6 py-4 text-white font-bold text-sm">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" /></td>
                </tr>
              ) : filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => openStatusUpdate(file)}>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{file.registrationDate}</td>
                    <td className="px-6 py-4 font-black text-[#003366]">{file.fileNumber}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{file.debtorName}</td>
                    <td className="px-6 py-4 font-bold text-red-600 font-mono">{file.amount.toLocaleString('fr-FR')}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{file.judge}</td>
                    <td className="px-6 py-4">{getStatusBadge(file.status)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">لا توجد ملفات معالجة تطابق معايير البحث.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 🔥 🛑 قسم جديد: أرشيف سجل ملفات الإكراه البدني (Excel) ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mt-4">
        <div className="p-5 border-b border-gray-100 bg-emerald-600/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              سجل أرشيف ملفات الإكراه البدني (المستورد)
            </h2>
            <p className="text-xs text-gray-500 mt-1">قاعدة بيانات تاريخية مخصصة للبحث السريع والمراجعة</p>
          </div>
          
          {/* خانة البحث في أرشيف إكسيل */}
          <div className="relative w-full sm:w-80">
            <input 
              type="text"
              className="w-full pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none text-right"
              placeholder="ابحث هنا برقم الملف أو اسم المطلوب إكراهه..."
              value={excelSearchQuery}
              onChange={(e) => setExcelSearchQuery(e.target.value)}
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-100 text-right text-xs">
            <thead className="bg-gray-100 text-gray-700 font-bold sticky top-0 z-10 shadow-xs">
              <tr>
                <th className="px-6 py-3">تاريخ التسجيل</th>
                <th className="px-6 py-3">رقم الملف بالنيابة</th>
                <th className="px-6 py-3">الإسم الكامل للمكره عليه ومحل سكنه</th>
                <th className="px-6 py-3">المبلغ المطلوب أداؤه (درهم)</th>
                <th className="px-6 py-3">القاضي المقرر</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredExcelRegistry.length > 0 ? (
                filteredExcelRegistry.map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-50/30 transition-colors font-medium">
                    <td className="px-6 py-3 text-gray-500 font-mono">{row.registration_date || '-'}</td>
                    <td className="px-6 py-3 text-emerald-700 font-bold">{row.file_number}</td>
                    <td className="px-6 py-3 text-gray-900 whitespace-pre-line leading-relaxed max-w-xs">{row.debtor_name}</td>
                    <td className="px-6 py-3 text-red-600 font-mono font-bold">{(row.amount || 0).toLocaleString('fr-FR')}</td>
                    <td className="px-6 py-3 text-gray-700 font-bold">{row.judge_name || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-bold">
                    {excelFiles.length === 0 ? 'السجل فارغ. يرجى رفع ملف إكسيل المرجعي للبدء.' : 'لا توجد نتائج تطابق بحثك في الأرشيف.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: إضافة ملف جديد */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Gavel className="w-5 h-5" /> إضافة ملف إكراه جديد</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/70 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleAddFileSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">رقم الملف <span className="text-red-500">*</span></label>
                  <input type="text" value={addForm.file_number} onChange={(e) => setAddForm({ ...addForm, file_number: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-[#003366]" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">تاريخ التسجيل <span className="text-red-500">*</span></label>
                  <input type="date" value={addForm.registration_date} onChange={(e) => setAddForm({ ...addForm, registration_date: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-[#003366]" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">اسم Mكره <span className="text-red-500">*</span></label>
                <input type="text" value={addForm.debtor_name} onChange={(e) => setAddForm({ ...addForm, debtor_name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-[#003366]" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">المبلغ الأصلي</label>
                <input type="number" value={addForm.amount} onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-right focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700">قاضي تطبيق العقوبة <span className="text-red-500">*</span></label>
                  <button type="button" onClick={handleAddNewJudgeClick} className="text-[#D4AF37] text-sm font-bold">+ إضافة قاضي جديد</button>
                </div>
                <select value={addForm.judge_id} onChange={(e) => setAddForm({ ...addForm, judge_id: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-right" required>
                  <option value="">اختر القاضي...</option>
                  {judges.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
                </select>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 rounded-xl text-gray-600 bg-white border">إلغاء</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-white bg-[#003366]">حفظ الملف</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: تحديث حالة الملف */}
      {statusUpdateFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">تحديث حالة الملف رقم: {statusUpdateFile.fileNumber}</h2>
              <button onClick={() => setStatusUpdateFile(null)} className="text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleStatusUpdateSubmit} className="p-6 space-y-6">
              <div>
                <label className="text-sm font-bold text-gray-700">تغيير الحالة</label>
                <select value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-right">
                  <option value="في طور">في طور</option>
                  <option value="محكوم">محكوم</option>
                  <option value="منفذ">منفذ</option>
                </select>
              </div>

              {statusForm.status === 'محكوم' && (
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 space-y-4 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-purple-900">تاريخ إرجاع الملف *</label>
                      <input type="date" value={statusForm.return_date} onChange={(e) => setStatusForm({ ...statusForm, return_date: e.target.value })} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-right" required />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-purple-900">مدة الإكراه *</label>
                      <input type="text" value={statusForm.duration} onChange={(e) => setStatusForm({ ...statusForm, duration: e.target.value })} placeholder="مثال: 3 أشهر" className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-right" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-purple-900">مبلغ الإكراه النهائي *</label>
                      <input type="number" value={statusForm.amount} onChange={(e) => setStatusForm({ ...statusForm, amount: e.target.value })} className="w-full px-3 py-2 bg-white border border-purple-200 rounded-lg text-left font-mono" required />
                    </div>
                  </div>
                </div>
              )}

              {statusForm.status === 'منفذ' && (
                <div className="bg-green-50 rounded-xl p-5 border border-green-100 space-y-4 animate-in slide-in-from-top-2">
                  <div>
                    <label className="text-xs font-bold text-green-900">تاريخ استخلاص المبلغ *</label>
                    <input type="date" value={statusForm.collection_date} onChange={(e) => setStatusForm({ ...statusForm, collection_date: e.target.value })} className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-right" required />
                  </div>
                </div>
              )}

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={() => setStatusUpdateFile(null)} className="px-6 py-2.5 text-gray-600 bg-white border">إلغاء</button>
                <button type="submit" className="px-6 py-2.5 text-white bg-[#003366]">تحديث الحالة</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}