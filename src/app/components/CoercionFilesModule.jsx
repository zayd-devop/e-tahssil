import React, { useState, useEffect, useRef } from 'react';
import { Gavel, UserPlus, Search, X, Calendar, User, FileText, CreditCard, ChevronDown, CheckCircle, Clock, Scale, Loader2, Plus, Filter, FileSpreadsheet, Database, Download, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios'; 
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function CoercionFilesModule() {
  const [activeTab, setActiveTab] = useState('tracking'); 

  const [coercionFiles, setCoercionFiles] = useState([]);
  const [judges, setJudges] = useState([]);
  const [excelFiles, setExcelFiles] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [excelSearchQuery, setExcelSearchQuery] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  const [yearFilter, setYearFilter] = useState(''); 
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  // 🔥 حالات الـ Pagination الجديدة للجدولين
  const [trackingPage, setTrackingPage] = useState(1);
  const [archivePage, setArchivePage] = useState(1);
  const ITEMS_PER_PAGE = 10; // عدد الأسطر في كل صفحة

  const fileInputRef = useRef(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusUpdateFile, setStatusUpdateFile] = useState(null);

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

  useEffect(() => {
    loadInitialData();
  }, []);

  // إعادة ضبط الصفحات عند تغيير شروط الفلترة أو البحث
  useEffect(() => { setTrackingPage(1); }, [searchQuery, statusFilter, yearFilter]);
  useEffect(() => { setArchivePage(1); }, [excelSearchQuery]);

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
      console.error("Erreur:", error);
    }
  };

  const fetchJudges = async () => {
    try {
      const response = await api.get('/judges');
      setJudges(response.data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const fetchExcelRegistry = async () => {
    try {
      const response = await api.get('/coercion-excel-registry');
      setExcelFiles(response.data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsImporting(true);
      Swal.fire({ title: 'جاري استيراد سجل ملفات الإكراه...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      await api.post('/coercion-excel-registry/import', formData);
      
      Swal.fire({ icon: 'success', title: 'تم الاستيراد بنجاح', text: 'تم دمج السجل التاريخي بنجاح', confirmButtonColor: '#003366' });
      fetchExcelRegistry();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'خطأ', text: error.response?.data?.error || 'فشل استيراد الملف', confirmButtonColor: '#003366' });
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
      Swal.fire({ icon: 'success', title: 'تمت الإضافة بنجاح!', confirmButtonColor: '#003366', timer: 2000 });
      setIsAddModalOpen(false);
      setAddForm({ file_number: '', registration_date: new Date().toISOString().split('T')[0], debtor_name: '', amount: '', judge_id: '' });
      fetchCoercionFiles(); 
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: error.response?.data?.message || 'حدث خطأ أثناء حفظ الملف', confirmButtonColor: '#003366' });
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
      inputValidator: (value) => { if (!value) return 'المرجو إدخال اسم القاضي!'; }
    });

    if (judgeName) {
      try {
        Swal.fire({ title: 'جاري الحفظ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const response = await api.post('/judges', { name: judgeName });
        await fetchJudges(); 
        setAddForm(prev => ({ ...prev, judge_id: response.data.judge.id }));
        Swal.fire({ icon: 'success', title: 'تمت الإضافة!', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ بالخادم', confirmButtonColor: '#003366' });
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

        // --- LA MODIFICATION EST ICI ---
        // 1. On ajoute le paramètre magique pour Laravel
        payload._method = 'PUT';

        // 2. On change api.put en api.post
        await api.post(`/coercion-files/${statusUpdateFile.id}/status`, payload);
        // -------------------------------

        Swal.fire({ icon: 'success', title: 'تم التحديث بنجاح', timer: 1500, showConfirmButton: false });
        setStatusUpdateFile(null);
        fetchCoercionFiles(); 
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'فشل تحديث حالة الملف', confirmButtonColor: '#003366' });
    }
};

  const getStatusBadge = (status) => {
    switch (status) {
      case 'في طور': return <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" />في طور</span>;
      case 'محكوم': return <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100 flex items-center gap-1.5 w-fit"><Scale className="w-3.5 h-3.5" />محكوم</span>;
      case 'منفذ': return <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-100 flex items-center gap-1.5 w-fit"><CheckCircle className="w-3.5 h-3.5" />منفذ</span>;
      default: return null;
    }
  };

  const openStatusUpdate = (file) => {
    setStatusUpdateFile(file);
    setStatusForm({ status: file.status, return_date: file.return_date || '', duration: file.duration || '', amount: file.amount || '', collection_date: file.collection_date || '' });
  };

  const filteredFiles = coercionFiles.filter((file) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (file.fileNumber && file.fileNumber.toLowerCase().includes(query)) || (file.debtorName && file.debtorName.toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'ALL' || file.status === statusFilter;
    const matchesYear = !yearFilter || (file.registrationDate && file.registrationDate.startsWith(yearFilter));
    return matchesSearch && matchesStatus && matchesYear;
  });

  const filteredExcelRegistry = excelFiles.filter((file) => {
    const query = excelSearchQuery.toLowerCase();
    const debtorMatch = file.debtors_info && file.debtors_info.some(name => name.toLowerCase().includes(query));
    return (file.file_number && file.file_number.toLowerCase().includes(query)) || debtorMatch;
  });

  // 🔥 منطق الاستقطاع للصفحات (Pagination Logic) للجدولين
  const trackingTotalPages = Math.ceil(filteredFiles.length / ITEMS_PER_PAGE);
  const trackingStartIndex = (trackingPage - 1) * ITEMS_PER_PAGE;
  const paginatedTrackingFiles = filteredFiles.slice(trackingStartIndex, trackingStartIndex + ITEMS_PER_PAGE);

  const archiveTotalPages = Math.ceil(filteredExcelRegistry.length / ITEMS_PER_PAGE);
  const archiveStartIndex = (archivePage - 1) * ITEMS_PER_PAGE;
  const paginatedArchiveFiles = filteredExcelRegistry.slice(archiveStartIndex, archiveStartIndex + ITEMS_PER_PAGE);

  const handleExportExcel = async () => {
    if (filteredFiles.length === 0) {
      Swal.fire({ icon: 'warning', title: 'لا توجد بيانات', text: 'لا توجد ملفات للتصدير تطابق شروط البحث الحالية', confirmButtonColor: '#D4AF37' });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'E-Tahssil';
    workbook.created = new Date();
    
    const groupedByMonth = {};
    filteredFiles.forEach(file => {
      let monthName = "بدون تاريخ";
      if (file.registrationDate) {
          const date = new Date(file.registrationDate);
          monthName = date.toLocaleDateString('ar-MA', { month: 'long', year: 'numeric' });
      }
      if (!groupedByMonth[monthName]) groupedByMonth[monthName] = [];
      groupedByMonth[monthName].push(file);
    });

    for (const month of Object.keys(groupedByMonth)) {
      const monthFiles = groupedByMonth[month];
      const worksheet = workbook.addWorksheet(month.substring(0, 31), { views: [{ rightToLeft: true }] });

      worksheet.columns = [
        { header: 'تاريخ التسجيل', key: 'date', width: 18 },
        { header: 'رقم الملف', key: 'file', width: 22 },
        { header: 'الحالة', key: 'status', width: 15 },
        { header: 'تاريخ إرجاع الملف', key: 'returnDate', width: 25 },
        { header: 'مبلغ الاكراه (درهم)', key: 'amount', width: 22 },
        { header: 'قاضي تطبيق العقوبة', key: 'judge', width: 25 }
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.height = 30;
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12, name: 'Arial' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF003366' } }; 
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      monthFiles.forEach(file => {
        const row = worksheet.addRow({
          date: file.registrationDate || '-',
          file: file.fileNumber || '-',
          status: file.status || '-',
          returnDate: file.status === 'محكوم' ? (file.return_date || 'غير محدد') : '-', 
          amount: file.amount || 0,
          judge: file.judge || '-'
        });

        row.height = 25;
        row.eachCell((cell, colNumber) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

          if (colNumber === 5) {
            cell.font = { bold: true, color: { argb: 'FFCC0000' } };
            cell.numFmt = '#,##0.00'; 
          }

          if (colNumber === 3) {
            cell.font = { bold: true, color: { argb: 'FF333333' } };
          }
        });
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `ملفات_الاكراه_البدني_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" dir="rtl">
      
      {/* 1. قسم الهيدر الأساسي في أعلى البطاقة */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#003366]/5 rounded-xl flex items-center justify-center text-[#003366]">
            <Gavel className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#003366]">ملفات الإكراه البدني</h1>
            <p className="text-gray-500 font-medium mt-1">تتبع ومراقبة قضايا الإكراه البدني ومردوديتها</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-inner">
          <button onClick={() => setActiveTab('tracking')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'tracking' ? 'bg-[#003366] text-white shadow-sm' : 'text-gray-600 hover:text-[#003366]'}`}>
            <Clock className="w-4 h-4" /> <span>المعالجة والتتبع</span>
          </button>
          <button onClick={() => setActiveTab('archive')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'archive' ? 'bg-[#003366] text-white shadow-sm' : 'text-gray-600 hover:text-[#003366]'}`}>
            <Database className="w-4 h-4" /> <span> سجل الأرشيف السنوي</span>
          </button>
        </div>
      </div>

      {/* 🟢 محتوى التبويب الأول: المعالجة والتتبع */}
      {activeTab === 'tracking' && (
        <>
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-white">
            <div className="relative w-full max-w-xl">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input type="text" className="block w-full pl-4 pr-12 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] text-gray-900 font-medium text-right" placeholder="البحث برقم الملف أو اسم المكره..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="relative w-36 shrink-0">
                <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="w-full pr-10 pl-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 appearance-none text-center cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                  <option value="">كل السنوات</option>
                  {Array.from({ length: 27 }, (_, i) => 2000 + i).reverse().map(year => (<option key={year} value={year}>سنة {year}</option>))}
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37] pointer-events-none" />
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative w-40 shrink-0">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full pr-10 pl-8 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 appearance-none text-center cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
                  <option value="ALL">جميع الحالات</option>
                  <option value="في طور">في طور</option>
                  <option value="محكوم">محكوم</option>
                  <option value="منفذ">منفذ</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37] pointer-events-none" />
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <button onClick={handleExportExcel} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-xs active:scale-95 text-sm">
                <Download className="w-4 h-4" /> <span>تصدير Excel</span>
              </button>
              
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#c5a028] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-xs active:scale-95 text-sm">
                <UserPlus className="w-4 h-4" /> <span>إضافة ملف جديد</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-right">
              <thead className="bg-[#003366]/5 text-[#003366] font-bold border-b border-[#003366]/10">
                <tr>
                  <th className="px-6 py-4 text-sm">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-sm">رقم ملف الإكراه</th>
                  <th className="px-6 py-4 text-sm">اسم المكره</th>
                  <th className="px-6 py-4 text-sm">مبلغ الإكراه (درهم)</th>
                  <th className="px-6 py-4 text-sm">قاضي تطبيق العقوبة</th>
                  <th className="px-6 py-4 text-sm">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" /></td></tr>
                ) : paginatedTrackingFiles.length > 0 ? (
                  paginatedTrackingFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-blue-50/30 transition-colors" >
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{file.registrationDate}</td>
                      <td className="px-6 py-4 font-black text-[#003366]">{file.fileNumber}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{file.debtorName}</td>
                      <td className="px-6 py-4 font-bold text-red-600 font-mono">{file.amount.toLocaleString('fr-FR')}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{file.judge}</td>
                      <td className="px-6 py-4 cursor-pointer" onClick={() => openStatusUpdate(file)}>{getStatusBadge(file.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-bold">لا توجد ملفات معالجة تطابق معايير البحث الحالية.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🔥 عناصر تحكم الـ Pagination لجدول التتبع */}
          {!isLoading && filteredFiles.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/40">
              <span className="text-sm text-gray-500 font-medium">
                عرض سجلات من <span className="font-bold text-gray-700">{trackingStartIndex + 1}</span> إلى <span className="font-bold text-gray-700">{Math.min(trackingStartIndex + ITEMS_PER_PAGE, filteredFiles.length)}</span> من أصل <span className="font-bold text-gray-700">{filteredFiles.length}</span> ملف
              </span>
              <div className="flex items-center gap-2">
                <button disabled={trackingPage === 1} onClick={() => setTrackingPage(prev => Math.max(prev - 1, 1))} className="p-2 rounded-xl border bg-white disabled:opacity-30 shadow-xs hover:bg-gray-50 transition-all">
                  <ChevronRight className="w-5 h-5 text-[#003366]" />
                </button>
                <div className="flex gap-1">
                  {[...Array(trackingTotalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    if (pageNum === 1 || pageNum === trackingTotalPages || (pageNum >= trackingPage - 1 && pageNum <= trackingPage + 1)) {
                      return (
                        <button key={pageNum} onClick={() => setTrackingPage(pageNum)} className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${trackingPage === pageNum ? 'bg-[#003366] text-[#D4AF37] shadow-md' : 'bg-white border text-gray-500 hover:bg-gray-50'}`}>{pageNum}</button>
                      );
                    } else if (pageNum === 2 || pageNum === trackingTotalPages - 1) {
                      return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                    } return null;
                  })}
                </div>
                <button disabled={trackingPage === trackingTotalPages} onClick={() => setTrackingPage(prev => Math.min(prev + 1, trackingTotalPages))} className="p-2 rounded-xl border bg-white disabled:opacity-30 shadow-xs hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-5 h-5 text-[#003366]" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 📊 محتوى التبويب الثاني: الأرشيف السنوي */}
      {activeTab === 'archive' && (
        <>
          <div className="p-4 bg-emerald-600/5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-emerald-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> أرشيف سجل الإكراه البدني السنوي 
              </h2>
            </div>
            <div>
              <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={handleExcelImport} />
              <button onClick={() => fileInputRef.current.click()} disabled={isImporting} className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-xs active:scale-95 text-sm">
                {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4 text-white" />}
                <span>   وضع سجل الاكراه البدني</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-xl">
              <input type="text" className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-right" placeholder="ابحث هنا في أرشيف الاكراه البدني ..." value={excelSearchQuery} onChange={(e) => setExcelSearchQuery(e.target.value)} />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
              عدد ملفات الإكراه البدني بالسجل: <span className="font-black text-sm">{filteredExcelRegistry.length}</span> ملف مراجع
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-right text-xs">
              <thead className="bg-gray-800 text-white font-bold border-b border-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-sm w-[12%]">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-sm w-[15%]">رقم الملف بالنيابة</th>
                  <th className="px-6 py-4 text-sm w-[15%] bg-emerald-700 text-white">مصدر طلب الإكراه</th>
                  <th className="px-6 py-4 text-sm w-[35%]">الإسم الكامل للمكره عليه ومحل سكنه</th>
                  <th className="px-6 py-4 text-sm w-[13%]">المبلغ المطلوب أداؤه (درهم)</th>
                  <th className="px-6 py-4 text-sm w-[10%]">القاضي المقرر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {isLoading ? (
                  <tr><td colSpan="6" className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto" /></td></tr>
                ) : paginatedArchiveFiles.length > 0 ? (
                  paginatedArchiveFiles.map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-50/20 transition-colors font-medium">
                      <td className="px-6 py-4 text-gray-500 font-mono align-top">{row.registration_date || '-'}</td>
                      <td className="px-6 py-4 text-emerald-700 font-black text-sm align-top">{row.file_number}</td>
                      <td className="px-6 py-4 bg-emerald-50/30 font-bold text-emerald-800 text-sm align-top">{row.coercion_source || '-'}</td>
                      
                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-2">
                          {(row.debtors_info || []).map((infoText, pIndex) => {
                            const isAddress = infoText.includes("حي") || infoText.includes("زنقة") || infoText.includes("رقم") || infoText.includes("طنجة") || infoText.includes("بونك");
                            return (
                              <div key={pIndex} className={`p-2.5 border rounded-xl flex items-center gap-2 shadow-xs max-w-sm font-medium ${isAddress ? "bg-emerald-50/40 border-emerald-100 text-emerald-800 text-xs" : "bg-[#003366]/5 border-[#003366]/10 text-[#003366] text-sm font-bold"}`}>
                                {isAddress ? (
                                  <>
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span >{infoText}</span>
                                  </>
                                ) : (
                                  <>
                                    <User className="w-4 h-4 text-[#D4AF37] shrink-0" />
                                    <span>{infoText}</span>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-red-600 font-mono font-bold text-sm align-top">{(Number(row.amount) || 0).toLocaleString('fr-FR')}</td>
                      <td className="px-6 py-4 text-gray-700 font-bold align-top">{row.judge_name || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="px-6 py-16 text-center text-gray-400 font-bold text-sm">لم نجد أي نتائج تطابق هذا الاسم أو الرقم في الأرشيف المرجعي.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🔥 عناصر تحكم الـ Pagination لجدول الأرشيف السنوي */}
          {!isLoading && filteredExcelRegistry.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/40">
              <span className="text-sm text-gray-500 font-medium">
                عرض سجلات من <span className="font-bold text-gray-700">{archiveStartIndex + 1}</span> إلى <span className="font-bold text-gray-700">{Math.min(archiveStartIndex + ITEMS_PER_PAGE, filteredExcelRegistry.length)}</span> من أصل <span className="font-bold text-gray-700">{filteredExcelRegistry.length}</span> ملف تاريخي
              </span>
              <div className="flex items-center gap-2">
                <button disabled={archivePage === 1} onClick={() => setArchivePage(prev => Math.max(prev - 1, 1))} className="p-2 rounded-xl border bg-white disabled:opacity-30 shadow-xs hover:bg-gray-50 transition-all">
                  <ChevronRight className="w-5 h-5 text-[#003366]" />
                </button>
                <div className="flex gap-1">
                  {[...Array(archiveTotalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    if (pageNum === 1 || pageNum === archiveTotalPages || (pageNum >= archivePage - 1 && pageNum <= archivePage + 1)) {
                      return (
                        <button key={pageNum} onClick={() => setArchivePage(pageNum)} className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${archivePage === pageNum ? 'bg-[#003366] text-[#D4AF37] shadow-md' : 'bg-white border text-gray-500 hover:bg-gray-50'}`}>{pageNum}</button>
                      );
                    } else if (pageNum === 2 || pageNum === archiveTotalPages - 1) {
                      return <span key={pageNum} className="text-gray-400 px-1">...</span>;
                    } return null;
                  })}
                </div>
                <button disabled={archivePage === archiveTotalPages} onClick={() => setArchivePage(prev => Math.min(prev + 1, archiveTotalPages))} className="p-2 rounded-xl border bg-white disabled:opacity-30 shadow-xs hover:bg-gray-50 transition-all">
                  <ChevronLeft className="w-5 h-5 text-[#003366]" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

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
                <label className="text-sm font-bold text-gray-700">اسم المكره <span className="text-red-500">*</span></label>
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