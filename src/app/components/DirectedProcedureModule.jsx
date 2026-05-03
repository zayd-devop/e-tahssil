import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Upload, FileSpreadsheet, Pencil, Printer, FileText, CheckCircle2, Search, X, Plus, MapPin, Filter, Download, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

export function DirectedProcedureModule() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // حالات البحث، الفلترة، والتقسيم
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 25;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Print Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printData, setPrintData] = useState({
    documentType: 'مستعجل',
    suspectName: '',
    address: '',
    fileNumber: '',
    issueDate: '',
    mainText: '',
    availableParties: [],
    availableAddresses: [],
    selectedIndex: 0
  });

  const fileInputRef = useRef(null);
  const API_URL = 'http://127.0.0.1:8000/api/procedures';

  // دالة مساعدة لجلب التوكن
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole, data]);

  // 1. تحديث دالة جلب البيانات (إضافة التوكن)
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}` // <--- تم إضافة التوكن هنا
        }
      });
      
      if (response.status === 401) {
        // إذا كان التوكن منتهي أو غير صالح، نوجهه لصفحة الدخول
        window.location.href = '/login';
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erreur de chargement:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الاتصال',
        text: 'تعذر تحميل البيانات من الخادم',
        confirmButtonColor: '#003366'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- دوال نافذة التعديل (EDIT) ---
  const handleEditClick = (row) => {
    const rolesArr = row.role ? row.role.split(' / ') : [];
    const addressesArr = row.address ? row.address.split('\n') : [];
    const decisionsArr = row.decision ? row.decision.split('\n') : [];
    
    const isSingleParty = !row.parties || row.parties.length <= 1;

    const combinedParties = (row.parties && row.parties.length > 0 ? row.parties : ['']).map((partyName, index) => ({
      name: partyName,
      role: isSingleParty ? (row.role || '') : (rolesArr[index] || rolesArr[0] || ''), 
      address: isSingleParty ? (row.address || '') : (addressesArr[index] || addressesArr[0] || ''),
      decision: isSingleParty ? (row.decision || '') : (decisionsArr[index] || decisionsArr[0] || '')
    }));

    setEditingRow({ 
      ...row, 
      combinedParties,
      currentEditIndex: 0 
    });
    setIsEditModalOpen(true);
  };

  const handlePartyEditChange = (field, value) => {
    const updatedParties = [...editingRow.combinedParties];
    updatedParties[editingRow.currentEditIndex] = {
      ...updatedParties[editingRow.currentEditIndex],
      [field]: value
    };
    setEditingRow({ ...editingRow, combinedParties: updatedParties });
  };

  const addEditParty = () => {
    const newParties = [...editingRow.combinedParties, { name: 'طرف جديد', role: '', address: '', decision: '' }];
    setEditingRow({ 
      ...editingRow, 
      combinedParties: newParties,
      currentEditIndex: newParties.length - 1 
    });
  };

  const removeEditParty = () => {
    if (editingRow.combinedParties.length <= 1) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'لا يمكن حذف جميع الأطراف، يجب أن يحتوي الملف على طرف واحد على الأقل.',
        confirmButtonColor: '#D4AF37'
      });
      return;
    }
    const newParties = editingRow.combinedParties.filter((_, i) => i !== editingRow.currentEditIndex);
    setEditingRow({ 
      ...editingRow, 
      combinedParties: newParties,
      currentEditIndex: 0 
    });
  };

  // 2. تحديث دالة الحفظ (إضافة التوكن)
  const handleSave = async () => {
    try {
      Swal.fire({
        title: 'جاري الحفظ...',
        text: 'الرجاء الانتظار بينما يتم حفظ التعديلات',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const partiesToSave = editingRow.combinedParties.map(p => p.name).filter(n => n.trim() !== '');
      
      const extractUnique = (field, separator) => {
        const allItems = editingRow.combinedParties
          .map(p => p[field] || '')
          .join(separator)
          .split(separator)
          .map(item => item.trim())
          .filter(item => item !== '');
        return Array.from(new Set(allItems)).join(separator);
      };

      const rolesToSave = extractUnique('role', ' / ');
      const addressesToSave = extractUnique('address', '\n');
      const decisionsToSave = extractUnique('decision', '\n');

      const payload = {
        ...editingRow,
        parties: partiesToSave,
        role: rolesToSave,
        address: addressesToSave,
        decision: decisionsToSave
      };

      delete payload.combinedParties;
      delete payload.currentEditIndex;

      const response = await fetch(`${API_URL}/${editingRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}` // <--- تم إضافة التوكن هنا
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setData(data.map(item => item.id === editingRow.id ? payload : item));
        handleCloseModal();
        Swal.fire({
          icon: 'success',
          title: 'تم الحفظ!',
          text: 'تم حفظ التعديلات بنجاح',
          confirmButtonColor: '#003366',
          timer: 2000
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'خطأ!',
          text: `حدث خطأ أثناء التعديل: ${errorData.message}`,
          confirmButtonColor: '#003366'
        });
      }
    } catch (error) {
      console.error('خطأ:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الاتصال!',
        text: 'تعذر الاتصال بالخادم',
        confirmButtonColor: '#003366'
      });
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingRow(null);
  };

  // 3. تحديث دالة الاستيراد (إضافة التوكن)
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Swal.fire({
      title: 'جاري الاستيراد...',
      text: 'يتم الآن قراءة ومعالجة ملف Excel، قد يستغرق الأمر بضع ثوانٍ',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_URL}/import`, {
        method: 'POST',
        body: formData,
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}` // <--- تم إضافة التوكن هنا
        }
      });
      const responseData = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'تم الاستيراد بنجاح!',
          text: `تمت إضافة الملفات إلى قاعدة البيانات`,
          confirmButtonColor: '#003366'
        });
        fetchData(); 
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ في الاستيراد',
          text: responseData.details || responseData.error || 'تأكد من هيكل ملف الإكسل',
          confirmButtonColor: '#003366'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الاتصال',
        text: 'تعذر الاتصال بالخادم أثناء الاستيراد.',
        confirmButtonColor: '#003366'
      });
    } finally {
      event.target.value = null;
    }
  };

  // --- دوال نافذة الطباعة (PRINT) ---
  const handlePrintClick = (row) => {
    const rolesArray = row.role ? row.role.split(' / ') : [];
    const addressesArray = row.address ? row.address.split('\n') : [];
    const partiesArray = row.parties || [];

    let defaultIndex = rolesArray.findIndex(r => r.includes('المتهم'));
    if (defaultIndex === -1) defaultIndex = 0;

    const defaultName = partiesArray[defaultIndex] || partiesArray[0] || '';
    const defaultAddress = addressesArray[defaultIndex] || row.address || '';

    const today = new Date();
    const issueDate = today.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });

    setPrintData({
      documentType: 'مستعجل',
      suspectName: defaultName,
      address: defaultAddress,
      fileNumber: row.fileNumber || row.file_number,
      issueDate: issueDate,
      mainText: 'المطلوب منكم الحضور عاجـلا وبصفة شخصية إلى مقر هذه المحكمة قصد أداء ما بذمتكم قبل الإحالة على الإكراه البدني .',
      availableParties: partiesArray,
      availableAddresses: addressesArray,
      selectedIndex: defaultIndex
    });

    setIsPrintModalOpen(true);
  };

  const handlePartySelectionChange = (e) => {
    const index = parseInt(e.target.value, 10);
    setPrintData({
      ...printData,
      selectedIndex: index,
      suspectName: printData.availableParties[index] || '',
      address: printData.availableAddresses[index] || printData.availableAddresses[0] || printData.address
    });
  };

  const handleDownloadWord = () => {
    try {
      let formattedMainText = printData.mainText.replace(/\n/g, '<br>');
      formattedMainText = formattedMainText.replace('عاجـلا', '<u>عاجـلا</u>');
      formattedMainText = formattedMainText.replace('عاجلا', '<u>عاجلا</u>');

      const wordDocumentHTML = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>إشعار بدون صائر التنفيذ</title>
          <style>
            body { 
              font-family: 'Arial', 'Simplified Arabic', sans-serif; 
              direction: rtl; 
            }
            .main-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px;
            }
            .right-column { 
              width: 32%; 
              vertical-align: top; 
              border-left: 2px solid #000; 
              padding-left: 20px; 
              text-align: center; 
            }
            .left-column { 
              width: 68%; 
              vertical-align: top; 
              padding-right: 40px; 
            }
            p {
              margin: 0;
              padding: 0;
            }
          </style>
        </head>
        <body>
          <table class="main-table" dir="rtl">
            <tr>
              <!-- العمود الأيمن (المعلومات الإدارية) -->
              <td class="right-column">
                <p style="font-size: 14pt; font-weight: bold; line-height: 1.5; margin-bottom: 40px;">
                  المملكة المغربية<br>
                  وزارة العدل<br>
                  محكمة الاستئناف بطنجة<br>
                  المحكمة الابتدائية بطنجة<br><br>
                  وحدة التبليغ والتحصيل<br>
                  المكتب 138 الطابق 2
                </p>
                
                <p style="font-size: 18pt; font-weight: bold; margin-bottom: 10px;">
                  ملف زجري عدد:
                </p>
                <p style="font-size: 18pt; font-weight: bold; margin-bottom: 50px;" dir="ltr">
                  ${printData.fileNumber}
                </p>
                
                <div style="border: 1px solid #000; padding: 15px; text-align: right; margin-top: 20px;">
                  <p style="text-align: center; font-weight: bold; font-size: 14pt; text-decoration: underline; margin-bottom: 15px;">ملاحظة:</p>
                  <p style="font-size: 10pt; line-height: 1.6; text-align: justify;">
                    طبقا للمقتضى الجديد المنصوص عليه في المادة 1-634 من قانون المسطرة الجنائية: يستفيد المحكوم عليه من <span style="background-color: #d9d9d9; font-weight: bold;">تخفيض الغرامة إلى الثلثين</span> شريطة أداء ما بذمته داخل أجل <span style="background-color: #d9d9d9; font-weight: bold;">30 يوما</span> يحتسب إبتداءا من تاريخ النطق بالأحكام الحضورية، أو من تاريخ تبليغ المقررات القضائية الغيابية أو بمثابة حضورية. كما تجدر الإشارة إلى أن هذا التخفيض لا يشمل باقي أنواع الديون العمومية.
                  </p>
                </div>
              </td>

              <!-- العمود الأيسر (المحتوى الرئيسي) -->
              <td class="left-column">
                <p style="font-size: 44pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 30px; letter-spacing: 1px;">
                  ${printData.documentType}
                </p>
                
                <p style="font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 60px; line-height: 1.5;">
                  مـن رئيس كتابة الضبط لدى المحكمة<br>الابتدائية بطنجة
                </p>
                
                <p style="font-size: 16pt; font-weight: bold; margin-bottom: 20px;">
                  إلى الســيد: <span style="font-size: 16pt;">${printData.suspectName}</span>
                </p>
                
                <p style="font-size: 16pt; font-weight: bold; margin-bottom: 60px; line-height: 1.6;">
                  السـاكن بـ: <span style="font-size: 16pt;">${printData.address.replace(/\n/g, ' ')}</span>
                </p>
                
                <p style="font-size: 18pt; font-weight: bold; line-height: 2; text-align: right; margin-bottom: 70px;">
                  ${formattedMainText}
                </p>
                
                <p style="font-size: 16pt; font-weight: bold; margin-bottom: 25px;">
                  حرر بطنجة في: ${printData.issueDate}
                </p>
                
                <p style="font-size: 16pt; font-weight: bold;">
                  عن رئيس مصلحة كتابة الضبط<br>
                  .............................................
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff', wordDocumentHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `إشعار بدون صائر التنفيذ-${printData.suspectName} - ${printData.fileNumber.replace(/\//g, '-')}.doc`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsPrintModalOpen(false);
      
      Swal.fire({
        icon: 'success',
        title: 'تم التنزيل!',
        text: 'تم تجهيز ملف Word وتنزيله بنجاح',
        confirmButtonColor: '#003366',
        timer: 2000
      });
      
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء إنشاء ملف Word',
        confirmButtonColor: '#003366'
      });
    }
  };

  // --- دوال الجداول والبحث ---
  const splitText = (text, separator = '\n') => {
    if (!text) return [];
    return text.split(separator).filter(item => item.trim() !== '');
  };

  const uniqueRoles = useMemo(() => {
    const rolesSet = new Set();
    data.forEach(row => {
      if (row.role) {
        const splitRoles = row.role.split(' / ');
        splitRoles.forEach(r => { if (r.trim()) rolesSet.add(r.trim()); });
      }
    });
    return Array.from(rolesSet).sort();
  }, [data]);

  const filteredData = data.filter(row => {
    const query = searchQuery.toLowerCase();
    const fileNum = (row.fileNumber || row.file_number || '').toLowerCase();
    const matchSearch = !searchQuery || fileNum.includes(query) || (row.parties && row.parties.some(party => party.toLowerCase().includes(query)));
    const matchRole = !selectedRole || (row.role && row.role.includes(selectedRole));
    return matchSearch && matchRole;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="bg-gray-50/50 min-h-full font-sans" dir="rtl">
      <div className="max-w-[95%] mx-auto space-y-6 py-6">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
              <FileText className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">إجراء يوجه</h1>
              <p className="text-gray-500 mt-1 font-medium">إدارة وتوجيه الإجراءات التنفيذية</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} onChange={handleExcelUpload} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} disabled={isLoading} className={`flex items-center gap-2 px-6 py-3.5 bg-[#D4AF37] text-[#003366] rounded-xl font-bold transition-all ${isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-[#C5A028] shadow-lg hover:shadow-xl active:scale-95'}`}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
              <span>استيراد ملف Excel</span>
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/80">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-80">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="بحث برقم الملف أو اسم الطرف..." className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none" />
                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>}
              </div>

              <div className="relative w-full sm:w-48">
                <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none appearance-none bg-white text-gray-700 cursor-pointer">
                  <option value="">جميع الصفات</option>
                  {uniqueRoles.map((role, idx) => <option key={idx} value={role}>{role}</option>)}
                </select>
                <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm flex items-center gap-2">
              <span>نتائج البحث:</span>
              <span className="font-bold text-[#003366]">{filteredData.length}</span> 
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#003366]/5 text-[#003366] font-bold border-b border-[#003366]/10">
                <tr>
                  <th className="px-5 py-4 whitespace-nowrap">رقم الملف</th>
                  <th className="px-5 py-4">الطرف</th>
                  <th className="px-5 py-4">الصفة</th>
                  <th className="px-5 py-4 w-[25%]">العنوان</th>
                  <th className="px-5 py-4 w-[20%]">المقرر</th>
                  <th className="px-5 py-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                        <span className="font-bold text-[#003366]">جاري تحميل البيانات...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500 font-medium flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <span>لا توجد بيانات مطابقة لبحثك</span>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => {
                    const addresses = splitText(row.address, '\n');
                    const decisions = splitText(row.decision, '\n');
                    const roles = splitText(row.role, ' / ');

                    return (
                      <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-5 py-5 font-mono font-bold text-lg text-[#003366] whitespace-nowrap align-top">{row.fileNumber || row.file_number}</td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col gap-2">
                            {row.parties.map((party, pIndex) => (
                              <span key={pIndex} className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold bg-[#003366]/5 text-[#003366] border border-[#003366]/10 w-fit shadow-sm">{party}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col gap-2">
                            {roles.map((role, idx) => (
                              <span key={idx} className="inline-flex text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit border border-gray-200">{role}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col">
                            {addresses.map((addr, idx) => (
                              <div key={idx} className={`py-2 flex items-start gap-2 ${idx !== addresses.length - 1 ? 'border-b border-gray-100 border-dashed' : ''}`}>
                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-xs leading-relaxed">{addr}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col">
                            {decisions.map((dec, idx) => (
                              <div key={idx} className={`py-2 flex items-start gap-2 ${idx !== decisions.length - 1 ? 'border-b border-gray-100 border-dashed' : ''}`}>
                                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                                <span className="text-[#003366] text-xs font-bold leading-relaxed">{dec}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 align-top text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEditClick(row)} className="p-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors border border-transparent hover:border-[#D4AF37]/20" title="تعديل">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handlePrintClick(row)} className="p-2 text-[#003366] hover:bg-[#003366]/10 rounded-lg transition-colors border border-transparent hover:border-[#003366]/20" title="تجهيز الطباعة (Word)">
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 text-sm border rounded-lg transition-colors ${currentPage === 1 ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`}>السابق</button>
                <span className="px-4 py-2 text-sm font-bold border border-[#003366] rounded-lg bg-[#003366] text-white">{currentPage} <span className="text-[#D4AF37] mx-1">/</span> {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`px-4 py-2 text-sm border rounded-lg transition-colors ${currentPage === totalPages || totalPages === 0 ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'}`}>التالي</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- نافذة الطباعة (PRINT MODAL) --- */}
      {isPrintModalOpen && printData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold flex items-center gap-2"><Printer className="w-5 h-5 text-[#D4AF37]" /> مراجعة وتعديل بيانات الإشعار</h2>
              <button onClick={() => setIsPrintModalOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">نوع الإشعار (العنوان الرئيسي)</label>
                  <input type="text" value={printData.documentType} onChange={(e) => setPrintData({...printData, documentType: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none font-bold text-center text-xl text-red-700 bg-red-50/50" />
                </div>

                {printData.availableParties && printData.availableParties.length > 1 && (
                  <div className="space-y-1.5 md:col-span-2 bg-[#003366]/5 p-4 rounded-xl border border-[#003366]/10 mb-2">
                    <label className="block text-sm font-bold text-[#003366]">اختر الطرف المراد توجيه الإشعار إليه</label>
                    <select value={printData.selectedIndex} onChange={handlePartySelectionChange} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none bg-white font-medium cursor-pointer">
                      {printData.availableParties.map((party, idx) => <option key={idx} value={idx}>{party}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-2 font-medium">ملاحظة: سيتم جلب الاسم والعنوان الخاص بالطرف تلقائياً.</p>
                  </div>
                )}

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">إلى السيد (اسم المتهم)</label>
                  <input type="text" value={printData.suspectName} onChange={(e) => setPrintData({...printData, suspectName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none font-bold text-lg" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">الساكن بـ (العنوان)</label>
                  <textarea value={printData.address} onChange={(e) => setPrintData({...printData, address: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#003366]">رقم الملف</label>
                  <input type="text" value={printData.fileNumber} onChange={(e) => setPrintData({...printData, fileNumber: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none font-mono font-bold" dir="ltr" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-[#003366]">تاريخ التحرير</label>
                  <input type="text" value={printData.issueDate} onChange={(e) => setPrintData({...printData, issueDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl outline-none font-bold" />
                </div>

                <div className="space-y-1.5 md:col-span-2 bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30 mt-2">
                  <label className="block text-sm font-bold text-[#003366] mb-2">موضوع الإشعار</label>
                  <textarea value={printData.mainText} onChange={(e) => setPrintData({...printData, mainText: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setIsPrintModalOpen(false)} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-100">إلغاء</button>
              <button onClick={handleDownloadWord} className="flex items-center gap-2 px-6 py-2.5 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] shadow-md">
                <Download className="w-4 h-4" /> تنزيل ملف Word
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- نافذة التعديل (EDIT MODAL) المتقدمة --- */}
      {isEditModalOpen && editingRow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#003366] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-xl font-bold flex items-center gap-2"><Pencil className="w-5 h-5 text-[#D4AF37]" /> تعديل بيانات الملف</h2>
              <button onClick={handleCloseModal} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">رقم الملف</label>
                  <input type="text" value={editingRow.fileNumber || editingRow.file_number} onChange={(e) => setEditingRow({...editingRow, fileNumber: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none font-mono font-bold" dir="ltr" />
                </div>

                <div className="md:col-span-2 bg-[#003366]/5 p-5 rounded-2xl border border-[#003366]/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#003366]/10 pb-3">
                     <label className="text-lg font-extrabold text-[#003366]">الأطراف وتفاصيلهم المخصصة</label>
                     <button onClick={addEditParty} type="button" className="flex items-center gap-1 text-[#D4AF37] font-bold hover:bg-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg transition-colors">
                       <Plus className="w-4 h-4" /> إضافة طرف جديد
                     </button>
                  </div>

                  {editingRow.combinedParties.length > 1 && (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-bold text-[#003366]">اختر الطرف لتعديل بياناته</label>
                      <select 
                        value={editingRow.currentEditIndex}
                        onChange={(e) => setEditingRow({...editingRow, currentEditIndex: parseInt(e.target.value, 10)})}
                        className="w-full px-4 py-2.5 border border-[#D4AF37]/50 rounded-xl focus:ring-[#D4AF37] outline-none bg-white font-bold text-[#003366] cursor-pointer"
                      >
                        {editingRow.combinedParties.map((p, idx) => (
                          <option key={idx} value={idx}>{p.name || `طرف ${idx + 1}`}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 relative">
                     <div className="flex items-start gap-3">
                       <div className="flex-1 space-y-1.5">
                         <label className="block text-sm font-bold text-gray-700">اسم الطرف</label>
                         <input type="text" value={editingRow.combinedParties[editingRow.currentEditIndex].name} onChange={(e) => handlePartyEditChange('name', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] outline-none font-bold" />
                       </div>
                       {editingRow.combinedParties.length > 1 && (
                         <button onClick={removeEditParty} type="button" className="mt-7 p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-colors" title="حذف هذا الطرف">
                           <X className="w-5 h-5" />
                         </button>
                       )}
                     </div>

                     <div className="space-y-1.5">
                       <label className="block text-sm font-bold text-gray-700">الصفة</label>
                       <input type="text" value={editingRow.combinedParties[editingRow.currentEditIndex].role} onChange={(e) => handlePartyEditChange('role', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] outline-none" />
                     </div>

                     <div className="space-y-1.5">
                       <label className="block text-sm font-bold text-gray-700">العنوان</label>
                       <textarea value={editingRow.combinedParties[editingRow.currentEditIndex].address} onChange={(e) => handlePartyEditChange('address', e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
                     </div>

                     <div className="space-y-1.5">
                       <label className="block text-sm font-bold text-gray-700">المقرر</label>
                       <textarea value={editingRow.combinedParties[editingRow.currentEditIndex].decision} onChange={(e) => handlePartyEditChange('decision', e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 rounded-b-2xl">
              <button onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl font-bold hover:bg-gray-100">إلغاء</button>
              <button onClick={handleSave} className="px-6 py-2.5 bg-[#D4AF37] text-[#003366] rounded-xl font-bold hover:bg-[#C5A028] shadow-md">حفظ التعديلات</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectedProcedureModule;