import React, { useState, useEffect, useMemo, useRef } from 'react';
// 🔥 أضفنا أيقونة Calendar هنا
import { Search, Plus, Pencil, Trash2, X, Loader2, Coins, MapPin, Scale, ChevronRight, ChevronLeft, Upload, FileSpreadsheet, Printer, Download, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

export default function FinancialFeesModule({ type, title, tableHeaderTitle }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // 🔥 حالة جديدة لحفظ السنة المحددة
  const [selectedYear, setSelectedYear] = useState('');

  const [selectedIds, setSelectedIds] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Print Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState(null);

  const fileInputRef = useRef(null);
  const API_URL = 'http://127.0.0.1:8000/api/financial-fees';
  const getToken = () => sessionStorage.getItem('token') || localStorage.getItem('token');

  // 🔥 إضافة selectedYear للمتغيرات التي تعيد تحميل البيانات
  useEffect(() => {
    fetchData();
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedIds([]);
  }, [type, selectedYear]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // 🔥 تمرير السنة في الرابط
      const response = await fetch(`${API_URL}/${type}?year=${selectedYear}`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'تعذر تحميل البيانات', confirmButtonColor: '#003366' });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return data.filter(row => 
      (row.debtor_name || '').toLowerCase().includes(query) || 
      (row.registry_number || '').toLowerCase().includes(query) ||
      (row.execution_order_number || '').toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map(item => item.id));
    }
  };

  const openModal = (row = null) => {
    setEditingRow(row || { registry_number: '', execution_order_number: '', execution_order_date: '', debtor_name: '', debtor_address: '', judicial_fees: '', pleading_rights: '' });
    setIsModalOpen(true);
  };

  // --- دوال الحفظ والحذف ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      Swal.fire({ title: 'جاري الحفظ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const method = editingRow.id ? 'PUT' : 'POST';
      const url = editingRow.id ? `${API_URL}/${editingRow.id}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(editingRow)
      });

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'تم الحفظ بنجاح', confirmButtonColor: '#003366', timer: 1500 });
        fetchData();
        setIsModalOpen(false);
      } else {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'الرجاء التأكد من البيانات المدخلة', confirmButtonColor: '#003366' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف ${selectedIds.length} سجلات نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#003366',
      confirmButtonText: 'نعم، احذف المحدد',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({ title: 'جاري الحذف...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const response = await fetch(`${API_URL}/bulk-delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
          body: JSON.stringify({ ids: selectedIds })
        });
        if (response.ok) {
          fetchData();
          setSelectedIds([]);
          Swal.fire({ icon: 'success', title: 'تم الحذف', confirmButtonColor: '#003366', timer: 1500 });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
      }
    }
  };
  // --- دالة الحذف الفردي ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: 'سيتم حذف هذا السجل نهائياً!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#003366',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({ title: 'جاري الحذف...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: { 
            'Accept': 'application/json', 
            'Authorization': `Bearer ${getToken()}` 
          }
        });

        if (response.ok) {
          fetchData(); // Rafraîchir le tableau
          // Si la ligne était cochée, on la retire de la sélection
          setSelectedIds(prev => prev.filter(selectedId => selectedId !== id)); 
          Swal.fire({ icon: 'success', title: 'تم الحذف بنجاح', confirmButtonColor: '#003366', timer: 1500 });
        } else {
          Swal.fire({ icon: 'error', title: 'خطأ', text: 'تعذر حذف السجل', confirmButtonColor: '#003366' });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
      }
    }
  };

  // --- دالة الاستيراد ---
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Swal.fire({ title: 'جاري الاستيراد...', text: 'يتم الآن معالجة ملف Excel', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); 
    
    try {
      const response = await fetch(`${API_URL}/import`, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
      });
      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'تم الاستيراد بنجاح!', confirmButtonColor: '#003366' });
        fetchData(); 
        setSelectedIds([]);
      } else {
        Swal.fire({ icon: 'error', title: 'خطأ في الاستيراد', text: responseData.error || 'تأكد من هيكل ملف الإكسل', confirmButtonColor: '#003366' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
    } finally {
      event.target.value = null;
    }
  };

  const getSignerInfo = () => {
    let signerName = '.............................................';
    let signerRole = 'كاتب الضبط'; 
    const userStorage = sessionStorage.getItem('user');
    if (userStorage) {
      const userData = JSON.parse(userStorage);
      const prenom = userData.prenom || userData?.clerk?.prenom || userData?.admin?.prenom || '';
      const nom = userData.nom || userData?.clerk?.nom || userData?.admin?.nom || '';
      if (prenom || nom) signerName = `${prenom} ${nom}`.trim();
      let currentStatus = userData.type_responsabilite || userData?.clerk?.type_responsabilite || userData?.admin?.type_responsabilite;
      if (currentStatus) signerRole = currentStatus;
    }
    return { signerName, signerRole };
  };

  const generateWordHTML = (dataObject, signerName, signerRole) => {
    let formattedMainText = "المرجو تسوية الوضعية المالية في أقرب الآجال لتفادي إجراءات التنفيذ الجبري.";
    formattedMainText = formattedMainText.replace(/\n/g, '<br>');

    return `
      <table class="main-table" dir="rtl">
        <tr>
          <td class="right-column">
            <p style="font-size: 14pt; font-weight: bold; line-height: 1.5; margin-bottom: 30px;">
              المملكة المغربية<br>وزارة العدل<br>محكمة الاستئناف بطنجة<br>المحكمة الابتدائية بطنجة<br><br>وحدة التبليغ والتحصيل<br>المكتب 138 الطابق 2
            </p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 5px;">رقم السجل:</p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 40px;" dir="ltr">${dataObject.registry_number || '......'}</p>
            
            <div style="border: 1px solid #000; padding: 10px; text-align: center; margin-top: 20px;">
              <p style="font-weight: bold; font-size: 12pt; text-decoration: underline; margin-bottom: 10px;">ملاحظة:</p>
              <p style="font-size: 9pt; line-height: 1.5; text-align: justify; direction: rtl;">
                طبقا للمقتضى الجديد المنصوص عليه في المادة 1-634 من قانون المسطرة الجنائية: يستفيد المدين من <span style="background-color: #d9d9d9; font-weight: bold;">تخفيض الغرامة إلى الثلثين</span> شريطة أداء ما بذمته داخل أجل <span style="background-color: #d9d9d9; font-weight: bold;">30 يوما</span> يحتسب إبتداءا من تاريخ النطق بالأحكام الحضورية، أو من تاريخ تبليغ المقررات القضائية الغيابية أو بمثابة حضورية. كما تجدر الإشارة إلى أن هذا التخفيض لا يشمل باقي أنواع الديون العمومية.
              </p>
            </div>
          </td>

          <td class="left-column">
            <p style="font-size: 36pt; font-weight: bold; text-decoration: underline; margin-bottom: 20px; text-align: center;">إنذار بأداء ${title}</p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 40px; line-height: 1.5; text-align: center;">مـن رئيس كتابة الضبط لدى المحكمة<br>الابتدائية بطنجة</p>
            
            <div style="text-align: right; margin-bottom: 40px;">
              <p style="font-size: 14pt; font-weight: bold; margin-bottom: 15px;">إلى الســيد(ة): <span style="font-size: 14pt;">${dataObject.debtor_name}</span></p>
              <p style="font-size: 14pt; font-weight: bold; line-height: 1.6;">السـاكن بـ: <span style="font-size: 14pt;">${(dataObject.debtor_address || '.......................').replace(/\n/g, ' ')}</span></p>
            </div>
            
            <p style="font-size: 14pt; font-weight: bold; text-align: right; margin-bottom: 10px;">لأداء المبالغ التالية المستحقة لفائدة الخزينة العامة:</p>
            
            <div style="margin-bottom: 30px; border: 2px solid #000; padding: 15px; background-color: #f9f9f9; text-align: right;">
              <p style="font-size: 13pt; margin-bottom: 5px;">- مبلغ الرسوم القضائية: <strong>${dataObject.judicial_fees} درهم</strong></p>
              <p style="font-size: 13pt; margin-bottom: 5px;">- حقوق المرافعة: <strong>${dataObject.pleading_rights} درهم</strong></p>
              <p style="font-size: 16pt; font-weight: bold; margin-top: 15px; border-top: 1px dashed #000; padding-top: 10px;">
                المجموع الإجمالي: <span style="color: #b30000;">${dataObject.total_amount} درهم</span>
              </p>
            </div>
            
            <p style="font-size: 14pt; font-weight: bold; line-height: 1.8; text-align: center; margin-bottom: 40px;">${formattedMainText}</p>
            
            <p style="font-size: 14pt; font-weight: bold; margin-bottom: 20px; text-align: center;">حرر بطنجة في: ${new Date().toISOString().split('T')[0]}</p>
            
            <p style="font-size: 14pt; font-weight: bold; line-height: 1.5; text-align: center;">
              عن رئيس مصلحة كتابة الضبط<br><br>${signerName}<br><span style="font-size: 12pt; font-weight: normal;">${signerRole}</span>
            </p>
          </td>
        </tr>
      </table>
    `;
  };

  const handleDownloadWordSingle = () => {
    try {
      const { signerName, signerRole } = getSignerInfo();
      const pageHtml = generateWordHTML(printData, signerName, signerRole);
      downloadBlob(pageHtml, `إنذار - ${printData.debtor_name}`);
      setIsPrintModalOpen(false);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', confirmButtonColor: '#003366' });
    }
  };

  const handleBulkPrint = () => {
    if (selectedIds.length === 0) return;
    Swal.fire({ title: 'جاري إنشاء الملف المجمع...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      const { signerName, signerRole } = getSignerInfo();
      const selectedRows = data.filter(row => selectedIds.includes(row.id));
      let pages = [];

      selectedRows.forEach(row => {
        pages.push(generateWordHTML(row, signerName, signerRole));
      });

      const allPagesHtml = pages.join("<br clear='all' style='mso-special-character:line-break;page-break-before:always' />");
      downloadBlob(allPagesHtml, `إنذارات_مجمعة_${type}_${new Date().toISOString().slice(0, 10)}`);
      
      setSelectedIds([]); 
      Swal.fire({ icon: 'success', title: 'تم التنزيل!', text: 'تم تجهيز الملف المجمع بنجاح', confirmButtonColor: '#003366', timer: 2000 });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ أثناء التجميع', confirmButtonColor: '#003366' });
    }
  };

  const downloadBlob = (htmlContent, fileName) => {
    const wordDocumentHTML = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${title}</title>
        <style>
          body { font-family: 'Arial', 'Simplified Arabic', sans-serif; direction: rtl; }
          .main-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .right-column { width: 35%; vertical-align: top; border-left: 1px solid #000; padding-left: 15px; text-align: center; }
          .left-column { width: 65%; vertical-align: top; padding-right: 20px; text-align: justify; }
          p { margin: 0; padding: 0; }
        </style>
      </head>
      <body>${htmlContent}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', wordDocumentHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <div className="bg-transparent min-h-full font-sans" dir="rtl">
      <div className="max-w-[100%] mx-auto space-y-6">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
              {type === 'complementary' ? <Coins className="w-7 h-7 text-[#D4AF37]" /> : <Scale className="w-7 h-7 text-[#D4AF37]" />}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">{title}</h1>
              <p className="text-gray-500 mt-1 font-medium">إدارة وتتبع الرسوم والمبالغ المستحقة</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {selectedIds.length > 0 && (
              <>
                <button onClick={handleBulkDelete} className="flex items-center gap-2 px-5 py-3.5 bg-red-600 text-white rounded-xl font-bold transition-all hover:bg-red-700 shadow-lg hover:shadow-xl active:scale-95 animate-in fade-in zoom-in duration-200">
                  <Trash2 className="w-5 h-5" />
                  <span>حذف المحدد ({selectedIds.length})</span>
                </button>
                <button onClick={handleBulkPrint} className="flex items-center gap-2 px-5 py-3.5 bg-emerald-600 text-white rounded-xl font-bold transition-all hover:bg-emerald-700 shadow-lg hover:shadow-xl active:scale-95 animate-in fade-in zoom-in duration-200">
                  <Printer className="w-5 h-5" />
                  <span>طباعة المحدد ({selectedIds.length})</span>
                </button>
              </>
            )}

            {/* 🔥 الفلتر الجديد بدلاً من زر الإضافة */}
            <div className="relative w-full sm:w-48">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-base font-bold text-[#003366] appearance-none focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all cursor-pointer shadow-sm"
              >
                <option value="">كل السنوات</option>
                {(() => {
                  const startYear = 2000;
                  const maxYear = new Date().getFullYear() + 5; 
                  const totalYears = maxYear - startYear + 1;
                  return Array.from({ length: totalYears }, (_, i) => startYear + i)
                    .reverse()
                    .map(year => (
                      <option key={year} value={year}>سنة {year}</option>
                    ));
                })()}
              </select>
              <Calendar className="w-5 h-5 text-[#D4AF37] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} onChange={handleExcelUpload} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} disabled={isLoading} className={`flex items-center gap-2 px-5 py-3.5 bg-[#D4AF37] text-[#003366] rounded-xl font-bold transition-all ${isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-[#C5A028] shadow-lg hover:shadow-xl active:scale-95'}`}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
              <span>استيراد بيان التكفلات </span>
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/80">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} 
                placeholder="البحث باسم المدين أو رقم الأمر..." 
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none" 
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
            </div>

            <div className="text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm flex items-center gap-2">
              <span>نتائج البحث:</span>
              <span className="font-bold text-[#003366]">{filteredData.length}</span> 
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#003366]/5 text-[#003366] font-bold border-b border-[#003366]/10 whitespace-nowrap">
                <tr>
                  <th className="px-5 py-4 text-center w-12">
                    <input type="checkbox" className="accent-[#D4AF37] w-4 h-4 cursor-pointer rounded" checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-5 py-4">{tableHeaderTitle}</th>
                  <th className="px-5 py-4">تاريخ الأمر</th>
                  <th className="px-5 py-4">رقم الأمر</th>
                  <th className="px-5 py-4">الإسم الكامل للمدين</th>
                  <th className="px-5 py-4 w-[25%]">عنوان المدين</th>
                  <th className="px-5 py-4">الرسوم القضائية</th>
                  <th className="px-5 py-4">المرافعة</th>
                  <th className="px-5 py-4">المجموع</th>
                  <th className="px-5 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan="10" className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mx-auto" /></td></tr>
                ) : paginatedData.length === 0 ? (
                  <tr><td colSpan="10" className="py-12 text-center text-gray-500 font-bold">لا توجد بيانات مطابقة لبحثك</td></tr>
                ) : (
                  paginatedData.map((row) => (
                    <tr key={row.id} className={`hover:bg-blue-50/40 transition-colors group ${selectedIds.includes(row.id) ? 'bg-blue-50/60' : ''}`}>
                      <td className="px-5 py-5 text-center align-top">
                        <input type="checkbox" className="accent-[#003366] w-4 h-4 cursor-pointer rounded mt-1" checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                      </td>
                      <td className="px-5 py-5 font-mono font-bold text-lg text-[#003366] whitespace-nowrap align-top">{row.registry_number || '-'}</td>
                      <td className="px-5 py-5 align-top text-gray-600 font-mono text-xs">{row.execution_order_date || '-'}</td>
                      <td className="px-5 py-5 font-bold align-top whitespace-nowrap">{row.execution_order_number || '-'}</td>
                      <td className="px-5 py-5 align-top font-black text-[#003366] whitespace-nowrap">{row.debtor_name}</td>
                      <td className="px-5 py-5 align-top">
                        <div className="flex items-start gap-2">
                          {row.debtor_address && <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />}
                          <span className="text-gray-600 text-xs leading-relaxed truncate max-w-[200px]" title={row.debtor_address}>{row.debtor_address || '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5 align-top text-emerald-600 font-bold whitespace-nowrap">{row.judicial_fees} د.م</td>
                      <td className="px-5 py-5 align-top text-blue-600 font-bold whitespace-nowrap">{row.pleading_rights} د.م</td>
                      <td className="px-5 py-5 align-top font-black text-red-600 text-lg whitespace-nowrap">{row.total_amount} د.م</td>
                      <td className="px-5 py-5 align-top text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openModal(row)} className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors border border-transparent hover:border-[#D4AF37]/20" title="تعديل"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => { setPrintData(row); setIsPrintModalOpen(true); }} className="p-2 text-[#003366] hover:bg-[#003366]/10 rounded-lg transition-colors border border-transparent hover:border-[#003366]/20" title="تجهيز الطباعة"><Printer className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(row.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="حذف"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
              <span className="text-sm text-gray-500">
                عرض <span className="font-bold text-gray-700">{startIndex + 1}</span> إلى <span className="font-bold text-gray-700">{Math.min(endIndex, filteredData.length)}</span> من أصل <span className="font-bold text-gray-700">{filteredData.length}</span> سجلات
              </span>
              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm">
                  <ChevronRight className="w-5 h-5 text-[#003366]" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                      return (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${currentPage === page ? 'bg-[#003366] text-[#D4AF37] shadow-lg' : 'bg-white border text-gray-500 hover:bg-gray-100'}`}>{page}</button>
                      );
                    } return null;
                  })}
                </div>

                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm">
                  <ChevronLeft className="w-5 h-5 text-[#003366]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- نافذة الطباعة الفردية (Modal) --- */}
      {isPrintModalOpen && printData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold flex items-center gap-2"><Printer className="w-5 h-5 text-[#D4AF37]" /> مراجعة الإنذار</h2>
              <button onClick={() => setIsPrintModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">إلى السيد(ة) المدين</label>
                  <input type="text" value={printData.debtor_name} onChange={(e) => setPrintData({...printData, debtor_name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none font-bold text-lg" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">العنوان</label>
                  <textarea value={printData.debtor_address} onChange={(e) => setPrintData({...printData, debtor_address: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#003366]">رقم الأمر التنفيذي</label>
                  <input type="text" value={printData.execution_order_number} onChange={(e) => setPrintData({...printData, execution_order_number: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#003366]">تاريخ الأمر التنفيذي</label>
                  <input type="date" value={printData.execution_order_date} onChange={(e) => setPrintData({...printData, execution_order_date: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setIsPrintModalOpen(false)} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-100">إلغاء</button>
              <button onClick={handleDownloadWordSingle} className="flex items-center gap-2 px-6 py-2.5 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] shadow-md"><Download className="w-4 h-4" /> تنزيل ملف Word</button>
            </div>
          </div>
        </div>
      )}

      {/* --- نافذة الإضافة / التعديل (EDIT MODAL) --- */}
      {isModalOpen && editingRow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#D4AF37]" /> تعديل بيانات السجل
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">{tableHeaderTitle}</label>
                  <input type="text" value={editingRow.registry_number} onChange={(e) => setEditingRow({...editingRow, registry_number: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none font-mono font-bold" dir="ltr" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#003366]">رقم الأمر التنفيذي</label>
                  <input type="text" value={editingRow.execution_order_number} onChange={(e) => setEditingRow({...editingRow, execution_order_number: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#003366]">تاريخ الأمر التنفيذي</label>
                  <input type="date" value={editingRow.execution_order_date} onChange={(e) => setEditingRow({...editingRow, execution_order_date: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none" />
                </div>
                <div className="space-y-1.5 md:col-span-2 bg-[#003366]/5 p-5 rounded-2xl border border-[#003366]/10">
                   <div className="space-y-4">
                     <div className="space-y-1.5">
                       <label className="block text-sm font-bold text-gray-700">الإسم الكامل للمدين <span className="text-red-500">*</span></label>
                       <input type="text" value={editingRow.debtor_name} onChange={(e) => setEditingRow({...editingRow, debtor_name: e.target.value})} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] outline-none font-bold" />
                     </div>
                     <div className="space-y-1.5">
                       <label className="block text-sm font-bold text-gray-700">عنوان المدين</label>
                       <textarea value={editingRow.debtor_address} onChange={(e) => setEditingRow({...editingRow, debtor_address: e.target.value})} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
                     </div>
                   </div>
                </div>
                <div className="space-y-1.5 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <label className="block text-sm font-bold text-emerald-800">مبلغ الرسوم القضائية</label>
                  <div className="relative">
                    <input type="number" step="0.01" min="0" value={editingRow.judicial_fees} onChange={(e) => setEditingRow({...editingRow, judicial_fees: e.target.value})} className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-left" dir="ltr" />
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 text-xs font-bold text-emerald-600">MAD</span>
                  </div>
                </div>
                <div className="space-y-1.5 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <label className="block text-sm font-bold text-blue-800">حقوق المرافعة</label>
                  <div className="relative">
                    <input type="number" step="0.01" min="0" value={editingRow.pleading_rights} onChange={(e) => setEditingRow({...editingRow, pleading_rights: e.target.value})} className="w-full px-4 py-2.5 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-left" dir="ltr" />
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 text-xs font-bold text-blue-600">MAD</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 mt-6 -mx-6 -mb-6 rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-100">إلغاء</button>
                <button type="submit" className="px-6 py-2.5 bg-[#D4AF37] text-[#003366] rounded-xl font-bold shadow-md hover:bg-[#C5A028]">حفظ السجل</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}