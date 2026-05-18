import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Trash2, X, Loader2, Coins, MapPin, Scale, ChevronRight, ChevronLeft, FileSpreadsheet, Printer, Download, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios'; 

export default function FinancialFeesModule({ type, title, tableHeaderTitle }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const defaultMainText = 'المطلوب منكم الحضور شخصيا إلى مقر هذه المحكمة في أقرب الآجال لأمر يهمكم والسلام .';
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState({ execution_order_number: '', execution_order_date: '', debtor_name: '', debtor_address: '', formattedMainText: defaultMainText });

  const fileInputRef = useRef(null);
  
  // Plus besoin de /api car Axios le gère dans son baseURL
  const API_URL = '/financial-fees';
  
  // 🔥 SUPPRESSION DE getToken() car Axios s'en occupe tout seul !

  useEffect(() => {
    fetchData();
    setCurrentPage(1);
    setSearchQuery('');
    setSelectedIds([]);
  }, [type, selectedYear]);

  // 🔥 CORRECTION 1: GET (Liste)
  // 🔥 CORRECTION : Utilisation des paramètres dynamiques Axios
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // 1. On prépare un objet de paramètres vide
      const queryParams = {};
      
      // 2. On n'ajoute 'year' QUE s'il contient une vraie valeur (ex: '2026')
      // Si selectedYear est vide (''), il ne sera pas envoyé du tout au serveur !
      if (selectedYear) {
        queryParams.year = selectedYear;
      }

      // 3. On passe l'objet params à Axios
      const response = await api.get(`${API_URL}/${type}`, {
        params: queryParams
      });
      
      // Axios injecte directement le résultat JSON dans response.data
      setData(response.data);
      
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({ 
        icon: 'error', 
        title: 'خطأ', 
        text: 'تعذر تحميل البيانات', 
        confirmButtonColor: '#003366' 
      });
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

  // 🔥 CORRECTION 2: POST (Suppression Multiple)
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
        
        await api.post(`${API_URL}/bulk-delete`, { ids: selectedIds });
        
        fetchData();
        setSelectedIds([]);
        Swal.fire({ icon: 'success', title: 'تم الحذف', confirmButtonColor: '#003366', timer: 1500 });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
      }
    }
  };
  
  // 🔥 CORRECTION 3: DELETE (Suppression Individuelle)
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
        
        await api.delete(`${API_URL}/${id}`);
        
        fetchData(); 
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id)); 
        Swal.fire({ icon: 'success', title: 'تم الحذف بنجاح', confirmButtonColor: '#003366', timer: 1500 });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
      }
    }
  };

  // 🔥 CORRECTION 4: POST (Importation Excel avec FormData)
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Swal.fire({ title: 'جاري الاستيراد...', text: 'يتم الآن معالجة ملف Excel', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); 
    
    try {
      await api.post(`${API_URL}/import`, formData);
      
      Swal.fire({ icon: 'success', title: 'تم الاستيراد بنجاح!', confirmButtonColor: '#003366' });
      fetchData(); 
      setSelectedIds([]);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
    } finally {
      event.target.value = null;
    }
  };

  const downloadFile = (content, fileName, isBlob = false) => {
    let blob;
    if (!isBlob) {
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
        <body>${content}</body>
        </html>
      `;
      blob = new Blob(['\ufeff', wordDocumentHTML], { type: 'application/msword' });
    } else {
      blob = content; 
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = isBlob ? fileName : `${fileName}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  const handlePrintClick = (row) => {
    setPrintData({
      ...row,
      formattedMainText: defaultMainText 
    });
    setIsPrintModalOpen(true);
  };
   
  const generateWordHTML = (dataObject, signerName, signerRole, docType) => {
    let formattedMainText = dataObject.formattedMainText || defaultMainText;
    formattedMainText = formattedMainText.replace(/\n/g, '<br>');

    return `<table class="main-table" dir="rtl">
        <tr>
          <td class="right-column">
            <p style="font-size: 14pt; font-weight: bold; line-height: 1.5; margin-bottom: 30px;">
              المملكة المغربية<br>وزارة العدل<br>محكمة الاستئناف بطنجة<br>المحكمة الابتدائية بطنجة<br><br>وحدة التبليغ والتحصيل<br>المكتب 138 الطابق 2
            </p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 5px;">رقم الامر التنفيذي:</p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 40px;" dir="ltr">${dataObject.execution_order_number || '......'}</p>
            
            <div style="border: 1px solid #000; padding: 10px; text-align: center; margin-top: 20px;">
              <p style="font-weight: bold; font-size: 12pt; text-decoration: underline; margin-bottom: 10px;">ملاحظة:</p>
              <p style="font-size: 9pt; line-height: 1.5; text-align: justify; direction: rtl;">
                طبقا للمقتضى الجديد المنصوص عليه في المادة 1-634 من قانون المسطرة الجنائية: يستفيد المدين من <span style="background-color: #d9d9d9; font-weight: bold;">تخفيض الغرامة إلى الثلثين</span> شريطة أداء ما بذمته داخل أجل <span style="background-color: #d9d9d9; font-weight: bold;">30 يوما</span> يحتسب إبتداءا من تاريخ النطق بالأحكام الحضورية، أو من تاريخ تبليغ المقررات القضائية الغيابية أو بمثابة حضورية. كما تجدر الإشارة إلى أن هذا التخفيض لا يشمل باقي أنواع الديون العمومية.
              </p>
            </div>
          </td>

          <td class="left-column">
            <p style="font-size: 36pt; font-weight: bold; text-decoration: underline; margin-bottom: 20px; text-align: center;">يوجه</p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 40px; line-height: 1.5; text-align: center;">مـن رئيس كتابة الضبط لدى المحكمة<br>الابتدائية بطنجة</p>
            
            <div style="text-align: right; margin-bottom: 40px;">
              <p style="font-size: 14pt; font-weight: bold; margin-bottom: 15px;">إلى الســيد(ة): <span style="font-size: 14pt;">${dataObject.debtor_name}</span></p>
              <p style="font-size: 14pt; font-weight: bold; line-height: 1.6;">السـاكن بـ: <span style="font-size: 14pt;">${(dataObject.debtor_address || '.......................').replace(/\n/g, ' ')}</span></p>
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

  // 🔥 CORRECTION 5: GET BLOB (Impression Individuelle)
  const handleDownloadWordSingle = async (docType) => {
    if (docType === 'إنذار') {
      try {
        Swal.fire({ title: 'جاري تحميل الإنذار...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        const response = await api.get(`${API_URL}/download-indar/${printData.id}`, {
          responseType: 'blob' // 👈 Indispensable avec Axios
        });
        
        // Le fichier blob est directement dans response.data
        downloadFile(response.data, `إنذار_${printData.debtor_name}.docx`, true);
        setIsPrintModalOpen(false);
        Swal.fire({ icon: 'success', title: 'تم التنزيل!', confirmButtonColor: '#003366', timer: 1500 });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', text: 'تأكد من رفع قالب Word في مسار Laravel', confirmButtonColor: '#003366' });
      }
    } else {
      try {
        const { signerName, signerRole } = getSignerInfo();
        const pageHtml = generateWordHTML(printData, signerName, signerRole, docType);
        downloadFile(pageHtml, `${docType}_${printData.debtor_name}`, false);
        setIsPrintModalOpen(false);
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ', confirmButtonColor: '#003366' });
      }
    }
  };

  // 🔥 CORRECTION 6: POST BLOB (Impression Groupée)
  const handleBulkPrint = async (docType) => {
    if (selectedIds.length === 0) return;

    if (docType === 'إنذار') {
      try {
        Swal.fire({ title: 'جاري إنشاء الملف المجمع...', text: 'قد يستغرق هذا بضع ثوانٍ', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        
        const response = await api.post(`${API_URL}/bulk-download-indar`, 
          { ids: selectedIds },
          { responseType: 'blob' } // 👈 Indispensable avec Axios
        );
        
        downloadFile(response.data, `إنذارات_مجمعة_${type}_${new Date().toISOString().slice(0, 10)}.docx`, true);
        setSelectedIds([]); 
        Swal.fire({ icon: 'success', title: 'تم التنزيل!', confirmButtonColor: '#003366', timer: 1500 });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ أثناء التجميع', text: 'تأكد من إعداد القالب وتوفر الـ Backend', confirmButtonColor: '#003366' });
      }
    } else {
      try {
        Swal.fire({ title: 'جاري إنشاء الملف المجمع...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        const { signerName, signerRole } = getSignerInfo();
        const selectedRows = data.filter(row => selectedIds.includes(row.id));
        let pages = [];

        selectedRows.forEach(row => {
          pages.push(generateWordHTML({ ...row, formattedMainText: defaultMainText }, signerName, signerRole, docType));
        });

        const allPagesHtml = pages.join("<br clear='all' style='mso-special-character:line-break;page-break-before:always' />");
        downloadFile(allPagesHtml, `إشعارات_مجمعة_${type}_${new Date().toISOString().slice(0, 10)}`, false);
        setSelectedIds([]); 
        Swal.fire({ icon: 'success', title: 'تم التنزيل!', confirmButtonColor: '#003366', timer: 1500 });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ أثناء التجميع', confirmButtonColor: '#003366' });
      }
    }
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
                <button onClick={() => handleBulkPrint('إشعار')} className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl font-bold transition-all hover:bg-blue-700 shadow-lg hover:shadow-xl active:scale-95 animate-in fade-in zoom-in duration-200">
                  <Printer className="w-5 h-5" />
                  <span>إشعار مجمع ({selectedIds.length})</span>
                </button>
                <button onClick={() => handleBulkPrint('إنذار')} className="flex items-center gap-2 px-5 py-3.5 bg-emerald-600 text-white rounded-xl font-bold transition-all hover:bg-emerald-700 shadow-lg hover:shadow-xl active:scale-95 animate-in fade-in zoom-in duration-200">
                  <Printer className="w-5 h-5" />
                  <span>إنذار مجمع ({selectedIds.length})</span>
                </button>
              </>
            )}

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
              <span>استيراد بيان التكفلات</span>
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
                    <tr key={row.id} className={`hover:bg-blue-50/40 transition-colors ${selectedIds.includes(row.id) ? 'bg-blue-50/60' : ''}`}>
                      <td className="px-5 py-5 text-center align-middle">
                        <input type="checkbox" className="accent-[#003366] w-4 h-4 cursor-pointer rounded mt-1" checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} />
                      </td>
                      <td className="px-5 py-5 font-mono font-bold text-lg text-[#003366] whitespace-nowrap align-middle">{row.registry_number || '-'}</td>
                      <td className="px-5 py-5 align-middle text-gray-600 font-mono text-sm whitespace-nowrap">{row.execution_order_date || '-'}</td>
                      <td className="px-5 py-5 font-bold align-middle whitespace-nowrap">{row.execution_order_number || '-'}</td>
                      <td className="px-5 py-5 align-middle font-black text-[#003366] whitespace-nowrap">{row.debtor_name}</td>
                      <td className="px-5 py-5 align-middle">
                        <div className="flex items-start gap-2">
                          {row.debtor_address && <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />}
                          <span className="text-gray-600 text-xs leading-relaxed truncate max-w-[200px]" title={row.debtor_address}>{row.debtor_address || '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-5 align-middle text-emerald-600 font-bold whitespace-nowrap">{row.judicial_fees} د.م</td>
                      <td className="px-5 py-5 align-middle text-blue-600 font-bold whitespace-nowrap">{row.pleading_rights} د.م</td>
                      <td className="px-5 py-5 align-middle font-black text-red-600 text-lg whitespace-nowrap">{row.total_amount} د.م</td>
                      <td className="px-5 py-5 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handlePrintClick(row)} className="p-2 text-[#003366] hover:bg-[#003366]/10 rounded-lg transition-colors border border-transparent hover:border-[#003366]/20" title="تجهيز الطباعة">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(row.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="حذف">
                            <Trash2 className="w-4 h-4" />
                          </button>
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
              <h2 className="text-xl font-bold flex items-center gap-2"><Printer className="w-5 h-5 text-[#D4AF37]" /> مراجعة وتعديل الوثيقة</h2>
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
                <div className="space-y-1.5 md:col-span-2 bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30 mt-2">
                  <label className="block text-sm font-bold text-[#003366] mb-2">موضوع الإشعار / الإنذار</label>
                  <textarea value={printData.formattedMainText} onChange={(e) => setPrintData({...printData, formattedMainText: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setIsPrintModalOpen(false)} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-100">إلغاء</button>
              <button onClick={() => handleDownloadWordSingle('إشعار')} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md">
                <Download className="w-4 h-4" /> طباعة يوجه
              </button>
              <button onClick={() => handleDownloadWordSingle('إنذار')} className="flex items-center gap-2 px-6 py-2.5 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] shadow-md">
                <Download className="w-4 h-4" /> طباعة إنذار
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}