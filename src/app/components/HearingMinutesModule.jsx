import React, { useState, useRef, useEffect } from 'react';
import { 
  Gavel, 
  Search, 
  Edit, 
  Printer, 
  FilePlus2,
  Loader2,
  Eye,
  ChevronRight,
  ChevronLeft,
  Calendar,
  FileText,
  UserPen 
} from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios'; 

export default function HearingMinutesModule() {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState(''); 
  
  const [clerkName, setClerkName] = useState(''); 
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter]);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery, dateFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const queryParams = {
        page: currentPage,
        search: searchQuery
      };
      
      const formattedDate = formatInputDate(dateFilter);
      if (formattedDate) {
        queryParams.date = formattedDate;
      }

      const response = await api.get('/hearing-minutes', { params: queryParams });
      
      setTableData(response.data.data.data || []);
      setTotalItems(response.data.data.total || 0);
      setTotalPages(response.data.data.last_page || 1);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatInputDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // 🔥 CORRECTION 2 : POST avec FormData
  const handleFileUpload = async (e) => {
    e.preventDefault();
    let file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = /(\.xlsx|\.xls|\.csv)$/i;
    if (!allowedExtensions.exec(file.name)) {
        Swal.fire({
            icon: 'warning',
            title: 'صيغة غير مدعومة',
            text: 'يرجى اختيار ملف Excel (xlsx, xls) ou CSV فقط',
            confirmButtonColor: '#003366'
        });
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    Swal.fire({
      title: 'جاري معالجة ملف السجل العام...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      // Axios configure tout seul les headers pour FormData
      const response = await api.post('/hearing-minutes/import', formData);

      setTableData(response.data.data);
      setCurrentPage(1); 
      setSelectedIds([]); 
      Swal.fire({ icon: 'success', title: 'تم استيراد البيانات بنجاح', timer: 2000, showConfirmButton: false });

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل الاستيراد';
      Swal.fire({ icon: 'error', title: 'فشل الاستيراد', text: errorMessage });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 🔥 CORRECTION 3 : GET Blob pour un fichier Word unique
  const handlePrintSingle = async (id, fileNumber) => {
    if (!clerkName.trim()) {
        Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'المرجو إدخال اسم كاتب الضبط أولاً فوق الجدول', confirmButtonColor: '#003366' });
        return;
    }

    try {
        Swal.fire({ 
            title: 'جاري تحضير المحضر...', 
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false 
        });

        const response = await api.get(`/hearing-minutes/print/${id}?clerk_name=${encodeURIComponent(clerkName)}`, {
            responseType: 'blob' // 👈 Indispensable pour un fichier
        });

        // Le fichier est directement dans response.data
        const blob = response.data;
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `PV_${fileNumber.replace(/\//g, '-')}.docx`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
        
        Swal.close();
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'فشل استخراج المحضر' });
    }
  };

  // 🔥 CORRECTION 4 : POST Blob pour le publipostage (Code nettoyé)
  const handleMergedPrint = async () => {
    if (selectedIds.length === 0) return;

    if (!clerkName.trim()) {
        Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'المرجو إدخال اسم كاتب الضبط أولاً فوق الجدول', confirmButtonColor: '#003366' });
        return;
    }
    
    try {
      Swal.fire({ 
        title: 'جاري إنشاء ملف التجميع...', 
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false 
      });

      const response = await api.post('/hearing-minutes/print-merged', 
        { 
          ids: selectedIds,
          clerk_name: clerkName 
        }, 
        {
          responseType: 'blob' // 👈 Indispensable
        }
      );

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Publipostage_PV_${new Date().toISOString().slice(0, 10)}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      setSelectedIds([]); 
      Swal.close();
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'فشل إنشاء الملف المجمع' }); 
    }
  };

  const currentItems = tableData;

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const getVisiblePages = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === currentItems.length && currentItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map(item => item.id));
    }
  };

  const showFullContent = (content) => {
    Swal.fire({
        title: 'مضمون المقرر',
        text: content,
        confirmButtonText: 'إغلاق',
        confirmButtonColor: '#003366',
        customClass: { htmlContainer: 'text-right' }
    });
  };

  return (
    <div className="bg-transparent min-h-full font-sans flex flex-col" dir="rtl">
      <div className="max-w-[95%] mx-auto space-y-6 pt-2 w-full flex-1">
        
        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#001f3f] rounded-2xl shadow-[0_10px_20px_rgba(0,51,102,0.2)] flex items-center justify-center border border-white/10">
            <Gavel className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">محاضر الأحكام</h1>
            <p className="text-gray-500 mt-1 font-medium">محاضر احكام القضاء الاستعجالي</p>
          </div>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#003366]/5 border border-white overflow-hidden transition-all duration-300 hover:shadow-[#003366]/10">
          
          {/* BARRE D'ACTIONS ET FILTRES */}
          <div className="p-5 border-b border-gray-100/50 flex items-center justify-between bg-white/50 backdrop-blur-md flex-wrap gap-4">
            
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              
              {/* 1. Recherche */}
              <div className="relative flex-1 min-w-[200px]">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}}
                  placeholder="البحث برقم الملف..." 
                  className="w-full pr-11 py-2.5 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none shadow-sm transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>

              {/* 2. Filtre Date */}
              <div className="relative">
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => {setDateFilter(e.target.value); setCurrentPage(1);}}
                  className="pr-10 pl-4 py-2.5 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] focus:bg-white outline-none text-gray-600 shadow-sm transition-all"
                />
                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 3. NOUVEAU : Input pour le nom du greffier */}
              <div className="relative flex-1 min-w-[200px]">
                <input 
                  type="text" 
                  value={clerkName}
                  onChange={(e) => setClerkName(e.target.value)}
                  placeholder="أدخل اسم كاتب الضبط هنا..." 
                  className="w-full pr-11 py-2.5 bg-[#D4AF37]/5 border-0 ring-1 ring-inset ring-[#D4AF37]/30 text-[#003366] placeholder-[#D4AF37]/60 rounded-xl text-sm font-bold focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] outline-none shadow-sm transition-all"
                />
                <UserPen className="w-4 h-4 text-amber-600 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>

            </div>
            
            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <button 
                  onClick={handleMergedPrint}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 shadow-md transition-all"
                >
                  <FileText className="w-5 h-5" />
                  <span>طباعة المحدد ({selectedIds.length})</span>
                </button>
              )}

              <button 
                onClick={() => fileInputRef.current.click()} 
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#003366] to-[#002244] text-white border-none rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 shadow-md transition-all"
              >
                <FilePlus2 className="w-5 h-5 text-[#D4AF37]" />
                <span> السجل العام</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#003366]/5 text-[#003366] font-extrabold border-b border-[#003366]/10 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-4 text-center w-12">
                    <input 
                      type="checkbox" 
                      className="accent-[#D4AF37] w-4 h-4 cursor-pointer rounded"
                      checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4">رقم الملف</th>
                  <th className="px-6 py-4">المدعي</th>
                  <th className="px-6 py-4">المدعى عليه</th>
            
                  <th className="px-6 py-4">نوع الحكم</th>
                  <th className="px-6 py-4">رقم الحكم</th>
                  <th className="px-6 py-4">تاريخ الحكم</th>
                  <th className="px-6 py-4">القاضي المقرر</th>
                  <th className="px-6 py-4">الموضوع</th>
                  <th className="px-6 py-4">مضمون المقرر</th>
                  <th className="px-6 py-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#D4AF37]" />
                      <p className="mt-4 text-gray-500">جاري تحميل البيانات...</p>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  currentItems.map((row) => (
                    <tr key={row.id} className={`hover:bg-blue-50/40 transition-colors ${selectedIds.includes(row.id) ? 'bg-blue-50/60' : ''}`}>
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="checkbox" 
                          className="accent-[#003366] w-4 h-4 cursor-pointer rounded"
                          checked={selectedIds.includes(row.id)}
                          onChange={() => toggleSelect(row.id)}
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-[#003366] whitespace-nowrap">{row.file_number}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 max-w-[150px] truncate" title={row.plaintiff}>
                        {row.plaintiff}
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-[150px] truncate" title={row.defendant}>
                        {row.defendant}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border ${row.result_color}`}>
                          {row.judgment_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{row.judgment_number}</td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap font-mono">{row.judgment_date}</td>
                      <td className="px-6 py-4 text-gray-600">{row.judge}</td>
                      <td className="px-6 py-4 truncate max-w-[150px]">{row.subject}</td>
                      <td className="px-6 py-4">
                        <button 
                            onClick={() => showFullContent(row.decision_content)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                            <Eye className="w-3 h-3" />
                            عرض المحتوى
                        </button>
                      </td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors"><Edit className="w-4 h-4" /></button>
                          <button 
                            onClick={() => handlePrintSingle(row.id, row.file_number)}
                            className="p-2 text-gray-400 hover:text-[#003366] transition-colors"
                            title="طباعة المحضر"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-6 py-20 text-center text-gray-400">
                      لا توجد أحكام تطابق بحثك.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 bg-white/50 backdrop-blur-md border-t border-gray-100/50 flex items-center justify-between flex-wrap gap-4">
              <span className="text-xs font-bold text-gray-500">
                عرض الصفحة {currentPage} من أصل {totalItems} سجل
              </span>
              
              <div className="flex items-center gap-2" dir="ltr">
                <button 
                  onClick={goToPrevPage} 
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-[#003366]" />
                </button>

                <div className="flex items-center gap-1">
                  {getVisiblePages().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        currentPage === page 
                        ? 'bg-[#003366] text-[#D4AF37] shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-[#003366]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}