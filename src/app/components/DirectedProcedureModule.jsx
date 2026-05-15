import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Upload, FileSpreadsheet, Pencil, Printer, FileText, CheckCircle2, Search, X, Plus, MapPin, Filter, Download, Loader2, LogOut, ChevronRight, ChevronLeft, Archive, RotateCcw, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export function DirectedProcedureModule({ onLogout }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // حالات البحث، الفلترة، والتقسيم
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('المتهم');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // --- نظام الأرشيف (Archive System) ---
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [archivedIds, setArchivedIds] = useState(() => {
    const saved = localStorage.getItem('archivedProcedureIds');
    return saved ? JSON.parse(saved) : [];
  });

  // حفظ الأرشيف في المتصفح حتى لا يضيع عند التحديث
  useEffect(() => {
    localStorage.setItem('archivedProcedureIds', JSON.stringify(archivedIds));
  }, [archivedIds]);

  // --- حالة التحديد للطباعة المجمعة ---
  const [selectedIds, setSelectedIds] = useState([]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Print Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const defaultMainText = 'المطلوب منكم الحضور شخصيا إلى مقر هذه المحكمة في أقرب الآجال لأمر يهمكم والسلام .';
  const [printData, setPrintData] = useState({
    documentType: 'يوجه',
    suspectName: '',
    address: '',
    fileNumber: '',
    issueDate: '',
    mainText: defaultMainText,
    availableParties: [],
    availableAddresses: [],
    availableRoles: [],
    selectedIndex: 0,
    isMultipleSuspects: false
  });

  const fileInputRef = useRef(null);
  const API_URL = '/api/procedures';

  const getToken = () => sessionStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole, data, isArchiveView]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (response.status === 401) {
        if (onLogout) onLogout();
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erreur de chargement:', error);
      Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', text: 'تعذر تحميل البيانات من الخادم', confirmButtonColor: '#003366' });
    } finally {
      setIsLoading(false);
    }
  };

  // --- دوال نظام الأرشيف ---
  const handleUnarchiveSelected = () => {
    setArchivedIds(prev => prev.filter(id => !selectedIds.includes(id)));
    setSelectedIds([]);
    Swal.fire({ icon: 'success', title: 'تم الاسترجاع', text: 'عادت الملفات إلى الجدول الرئيسي', confirmButtonColor: '#003366', timer: 1500 });
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
      Swal.fire({ icon: 'warning', title: 'تنبيه', text: 'لا يمكن حذف جميع الأطراف، يجب أن يحتوي الملف على طرف واحد على الأقل.', confirmButtonColor: '#D4AF37' });
      return;
    }
    const newParties = editingRow.combinedParties.filter((_, i) => i !== editingRow.currentEditIndex);
    setEditingRow({ ...editingRow, combinedParties: newParties, currentEditIndex: 0 });
  };

  const handleSave = async () => {
    try {
      Swal.fire({ title: 'جاري الحفظ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const partiesToSave = editingRow.combinedParties.map(p => p.name).filter(n => n.trim() !== '');
      
      const extractUnique = (field, separator) => {
        const allItems = editingRow.combinedParties
          .map(p => p[field] || '')
          .join(separator).split(separator).map(item => item.trim()).filter(item => item !== '');
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
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setData(data.map(item => item.id === editingRow.id ? payload : item));
        handleCloseModal();
        Swal.fire({ icon: 'success', title: 'تم الحفظ!', confirmButtonColor: '#003366', timer: 2000 });
      } else {
        const errorData = await response.json();
        Swal.fire({ icon: 'error', title: 'خطأ!', text: `حدث خطأ أثناء التعديل: ${errorData.message}`, confirmButtonColor: '#003366' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ في الاتصال!', confirmButtonColor: '#003366' });
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingRow(null);
  };

  // --- الحذف من قاعدة البيانات ---
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const result = await Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف ${selectedIds.length} سجلات نهائياً من قاعدة البيانات!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#003366',
      confirmButtonText: 'نعم، حذف نهائي',
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
          setArchivedIds(prev => prev.filter(id => !selectedIds.includes(id))); // إزالة من الأرشيف أيضاً
          setSelectedIds([]);
          Swal.fire({ icon: 'success', title: 'تم الحذف', confirmButtonColor: '#003366', timer: 1500 });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
      }
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Swal.fire({ title: 'جاري الاستيراد...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = new FormData();
    formData.append('file', file);
    
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
        Swal.fire({ icon: 'error', title: 'خطأ في الاستيراد', text: responseData.details || responseData.error || 'تأكد من هيكل ملف الإكسل', confirmButtonColor: '#003366' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ في الاتصال', confirmButtonColor: '#003366' });
    } finally {
      event.target.value = null;
    }
  };

  // ==========================================
  // --- GÉNÉRATION DU DOCUMENT WORD (HTML) ---
  // ==========================================
  const generateWordHTML = (dataObject, signerName, signerRole) => {
    let formattedMainText = dataObject.mainText.replace(/\n/g, '<br>');
    formattedMainText = formattedMainText.replace('عاجـلا', '<u>عاجـلا</u>');
    formattedMainText = formattedMainText.replace('عاجلا', '<u>عاجلا</u>');

    return `
      <table class="main-table" dir="rtl">
        <tr>
          <td class="right-column">
            <p style="font-size: 14pt; font-weight: bold; line-height: 1.5; margin-bottom: 30px;">
              المملكة المغربية<br>وزارة العدل<br>محكمة الاستئناف بطنجة<br>المحكمة الابتدائية بطنجة<br><br>وحدة التبليغ والتحصيل<br>المكتب 138 الطابق 2
            </p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 5px;">ملف زجري عدد:</p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 40px;" dir="ltr">${dataObject.fileNumber}</p>
            <div style="border: 1px solid #000; padding: 10px; text-align: center; margin-top: 20px;">
              <p style="font-weight: bold; font-size: 12pt; text-decoration: underline; margin-bottom: 10px;">ملاحظة:</p>
              <p style="font-size: 9pt; line-height: 1.5; text-align: justify; direction: rtl;">
                طبقا للمقتضى الجديد المنصوص عليه في المادة 1-634 من قانون المسطرة الجنائية: يستفيد المحكوم عليه من <span style="background-color: #d9d9d9; font-weight: bold;">تخفيض الغرامة إلى الثلثين</span> شريطة أداء ما بذمته داخل أجل <span style="background-color: #d9d9d9; font-weight: bold;">30 يوما</span> يحتسب إبتداءا من تاريخ النطق بالأحكام الحضورية، أو من تاريخ تبليغ المقررات القضائية الغيابية أو بمثابة حضورية. كما تجدر الإشارة إلى أن هذا التخفيض لا يشمل باقي أنواع الديون العمومية.
              </p>
            </div>
          </td>
          <td class="left-column">
            <p style="font-size: 36pt; font-weight: bold; text-decoration: underline; margin-bottom: 20px;">${dataObject.documentType}</p>
            <p style="font-size: 16pt; font-weight: bold; margin-bottom: 40px; line-height: 1.5;">مـن رئيس كتابة الضبط لدى المحكمة<br>الابتدائية بطنجة</p>
            <div style="text-align: right; margin-bottom: 40px;">
              <p style="font-size: 14pt; font-weight: bold; margin-bottom: 15px;">إلى الســيد: <span style="font-size: 14pt;">${dataObject.suspectName}</span></p>
              <p style="font-size: 14pt; font-weight: bold; line-height: 1.6;">السـاكن بـ: <span style="font-size: 14pt;">${(dataObject.address || '').replace(/\n/g, ' ')}</span></p>
            </div>
            <p style="font-size: 14pt; font-weight: bold; line-height: 1.8; text-align: center; margin-bottom: 40px;">${formattedMainText}</p>
            <p style="font-size: 14pt; font-weight: bold; margin-bottom: 20px; text-align: center;">حرر بطنجة في: ${dataObject.issueDate}</p>
            <p style="font-size: 14pt; font-weight: bold; line-height: 1.5; text-align: center;">عن رئيس مصلحة كتابة الضبط<br><br>${signerName}<br><span style="font-size: 12pt; font-weight: normal;">${signerRole}</span></p>
          </td>
        </tr>
      </table>
    `;
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
      else signerName = userData.name || 'الاسم غير متوفر'; 

      let currentStatus = userData.type_responsabilite || userData?.clerk?.type_responsabilite || userData?.admin?.type_responsabilite;
      if (currentStatus) signerRole = currentStatus;
      else if (userData.role === 'admin') signerRole = 'رئيس الوحدة';
    }
    return { signerName, signerRole };
  };

  // ==========================================
  // --- 1. PRINT PAR LIGNE ---
  // ==========================================
  const handlePrintClick = (row) => {
    const rolesArray = row.role ? row.role.split(' / ') : [];
    const addressesArray = row.address ? row.address.split('\n') : [];
    const partiesArray = row.parties || [];

    let suspectIndices = [];
    rolesArray.forEach((r, idx) => { if (r.includes('المتهم')) suspectIndices.push(idx); });

    let defaultIndex = 0;
    let isMultiple = false;

    if (suspectIndices.length > 1) {
        defaultIndex = 'ALL';
        isMultiple = true;
    } else if (suspectIndices.length === 1) {
        defaultIndex = suspectIndices[0];
    }

    const today = new Date();
    const issueDate = today.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });

    setPrintData({
      id: row.id, // Garder l'ID pour l'archivage
      documentType: 'يوجه',
      suspectName: defaultIndex === 'ALL' ? 'سيتم إعداد إشعارات لجميع المتهمين' : (partiesArray[defaultIndex] || partiesArray[0] || ''),
      address: defaultIndex === 'ALL' ? 'عناوين متعددة' : (addressesArray[defaultIndex] || row.address || ''),
      fileNumber: row.fileNumber || row.file_number,
      issueDate: issueDate,
      mainText: 'المطلوب منكم الحضور عاجـلا وبصفة شخصية إلى مقر هذه المحكمة قصد أداء ما بذمتكم قبل الإحالة على الإكراه البدني .',
      availableParties: partiesArray,
      availableAddresses: addressesArray,
      availableRoles: rolesArray,
      selectedIndex: defaultIndex,
      isMultipleSuspects: isMultiple
    });

    setIsPrintModalOpen(true);
  };

  const handlePartySelectionChange = (e) => {
    const val = e.target.value;
    if (val === 'ALL') {
        setPrintData({ ...printData, selectedIndex: 'ALL', suspectName: 'سيتم إعداد إشعارات لجميع المتهمين', address: 'عناوين متعددة' });
    } else {
        const index = parseInt(val, 10);
        setPrintData({ ...printData, selectedIndex: index, suspectName: printData.availableParties[index] || '', address: printData.availableAddresses[index] || printData.availableAddresses[0] || printData.address });
    }
  };

  const handleDownloadWord = () => {
    try {
      const { signerName, signerRole } = getSignerInfo();
      let pages = [];

      if (printData.selectedIndex === 'ALL') {
          printData.availableRoles.forEach((role, idx) => {
              if (role.includes('المتهم')) {
                  const rowData = { ...printData, suspectName: printData.availableParties[idx] || printData.availableParties[0] || '', address: printData.availableAddresses[idx] || printData.address || '' };
                  pages.push(generateWordHTML(rowData, signerName, signerRole));
              }
          });
      } else {
          pages.push(generateWordHTML(printData, signerName, signerRole));
      }

      const allPagesHtml = pages.join("<br clear='all' style='mso-special-character:line-break;page-break-before:always' />");
      const wordDocumentHTML = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>إشعار بدون صائر التنفيذ</title>
          <style>
            body { font-family: 'Arial', 'Simplified Arabic', sans-serif; direction: rtl; }
            .main-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .right-column { width: 35%; vertical-align: top; border-left: 1px solid #000; padding-left: 15px; text-align: center; }
            .left-column { width: 65%; vertical-align: top; padding-right: 20px; text-align: center; }
            p { margin: 0; padding: 0; }
          </style>
        </head>
        <body>${allPagesHtml}</body>
        </html>
      `;

      const blob = new Blob(['\ufeff', wordDocumentHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `إشعار بدون صائر التنفيذ-${printData.fileNumber.replace(/\//g, '-')}.doc`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsPrintModalOpen(false);
      
      // 🔥 Archivage automatique après impression
      if (!isArchiveView) {
        setArchivedIds(prev => [...new Set([...prev, printData.id])]);
      }

      Swal.fire({ icon: 'success', title: 'تم التنزيل!', text: 'تم إنشاء الإشعار ونقله للأرشيف بنجاح', confirmButtonColor: '#003366', timer: 2500 });
      
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء إنشاء ملف Word', confirmButtonColor: '#003366' });
    }
  };

  // ==========================================
  // --- 2. BULK PRINT ---
  // ==========================================
  const handleBulkPrint = async (docType) => {
    if (selectedIds.length === 0) return;

    if (docType === 'إنذار') {
        // Logique Backend pour les inndar (Si configurée)
        Swal.fire({ icon: 'info', title: 'ميزة قيد التطوير', text: 'يرجى إعداد خادم الإنذارات المجمعة', confirmButtonColor: '#003366' });
        return;
    }

    Swal.fire({ title: 'جاري إنشاء الملف المجمع...', text: 'الرجاء الانتظار قليلاً', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    try {
      const { signerName, signerRole } = getSignerInfo();
      const today = new Date();
      const issueDate = today.toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });

      const selectedRows = data.filter(row => selectedIds.includes(row.id));
      let pages = [];

      selectedRows.forEach((row) => {
        const rolesArray = row.role ? row.role.split(' / ') : [];
        const addressesArray = row.address ? row.address.split('\n') : [];
        const partiesArray = row.parties || [];

        let hasSuspect = false;
        rolesArray.forEach((role, idx) => {
            if (role.includes('المتهم')) {
                hasSuspect = true;
                const rowData = { documentType: 'يوجه', suspectName: partiesArray[idx] || partiesArray[0] || '', address: addressesArray[idx] || row.address || '', fileNumber: row.fileNumber || row.file_number, issueDate: issueDate, mainText: defaultMainText };
                pages.push(generateWordHTML(rowData, signerName, signerRole));
            }
        });

        if(!hasSuspect) {
            const rowDataFallback = { documentType: 'يوجه', suspectName: partiesArray[0] || '', address: addressesArray[0] || row.address || '', fileNumber: row.fileNumber || row.file_number, issueDate: issueDate, mainText: defaultMainText };
            pages.push(generateWordHTML(rowDataFallback, signerName, signerRole));
        }
      });

      const allPagesHtml = pages.join("<br clear='all' style='mso-special-character:line-break;page-break-before:always' />");
      const wordDocumentHTML = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>إشعارات مجمعة</title>
          <style>
            body { font-family: 'Arial', 'Simplified Arabic', sans-serif; direction: rtl; }
            .main-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .right-column { width: 35%; vertical-align: top; border-left: 1px solid #000; padding-left: 15px; text-align: center; }
            .left-column { width: 65%; vertical-align: top; padding-right: 20px; text-align: center; }
            p { margin: 0; padding: 0; }
          </style>
        </head>
        <body>${allPagesHtml}</body>
        </html>
      `;

      const blob = new Blob(['\ufeff', wordDocumentHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `إجراءات_توجيه_مجمعة_${new Date().toISOString().slice(0, 10)}.doc`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      // 🔥 LA SOLUTION EST ICI : Appel API pour chaque ID sélectionné
      try {
        await Promise.all(selectedIds.map(id => 
          fetch(`${API_URL}/print/${id}`, {
            method: 'POST', // ou GET
            headers: {
              'Authorization': `Bearer ${getToken()}`,
              'Accept': 'application/json'
            }
          })
        ));
      } catch (apiError) {
        console.error("Erreur lors de l'enregistrement de l'impression groupée :", apiError);
      }
      // 🔥 Archivage automatique après impression groupée
      if (!isArchiveView) {
        setArchivedIds(prev => [...new Set([...prev, ...selectedIds])]);
      }
      setSelectedIds([]); 
      Swal.fire({ icon: 'success', title: 'تم التنزيل!', text: 'تم تجهيز الملف المجمع ونقل الملفات للأرشيف', confirmButtonColor: '#003366', timer: 2500 });

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ أثناء التجميع', confirmButtonColor: '#003366' });
    }
  };

  // --- دوال الجداول والبحث مع فلتر الأرشيف ---
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
    // 1. فلتر الأرشيف
    const isArchived = archivedIds.includes(row.id);
    if (isArchiveView && !isArchived) return false;
    if (!isArchiveView && isArchived) return false;

    // 2. فلتر البحث والصفة
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

  return (
    <div className="bg-transparent min-h-full font-sans" dir="rtl">
      <div className="max-w-[95%] mx-auto space-y-6 py-6">
        
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30 ${isArchiveView ? 'bg-gray-600' : 'bg-[#003366]'}`}>
              {isArchiveView ? <Archive className="w-7 h-7 text-[#D4AF37]" /> : <FileText className="w-7 h-7 text-[#D4AF37]" />}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">{isArchiveView ? 'أرشيف الإجراءات' : 'إجراء يوجه'}</h1>
              <p className="text-gray-500 mt-1 font-medium">{isArchiveView ? 'الملفات التي تم طباعتها مسبقاً' : 'إدارة وتوجيه الإجراءات التنفيذية'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* زر التبديل بين الأرشيف والملفات النشطة */}
            <button 
              onClick={() => { setIsArchiveView(!isArchiveView); setSelectedIds([]); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold transition-all shadow-sm border ${
                isArchiveView 
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {isArchiveView ? <FileText className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
              <span>{isArchiveView ? 'الرجوع للملفات النشطة' : 'عرض الأرشيف'}</span>
            </button>

            {/* أزرار الإجراءات على العناصر المحددة */}
            {selectedIds.length > 0 && (
              <>
                {isArchiveView ? (
                  // إجراءات داخل الأرشيف
                  <>
                    <button onClick={handleUnarchiveSelected} className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md">
                      <RotateCcw className="w-5 h-5" />
                      <span>استرجاع ({selectedIds.length})</span>
                    </button>
                    <button onClick={handleBulkDelete} className="flex items-center gap-2 px-5 py-3.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-md">
                      <Trash2 className="w-5 h-5" />
                      <span>حذف نهائي من القاعدة ({selectedIds.length})</span>
                    </button>
                  </>
                ) : (
                  // إجراءات داخل الملفات النشطة
                  <>
                    <button onClick={() => handleBulkPrint('إشعار')} className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 text-white rounded-xl font-bold transition-all hover:bg-blue-700 shadow-lg">
                      <Printer className="w-5 h-5" />
                      <span>إشعارات يوجه ({selectedIds.length})</span>
                    </button>
                  </>
                )}
              </>
            )}

            {/* الاستيراد متاح فقط في الملفات النشطة */}
            {!isArchiveView && (
              <>
                <input type="file" accept=".xlsx, .xls, .csv" ref={fileInputRef} onChange={handleExcelUpload} className="hidden" />
                <button onClick={() => fileInputRef.current.click()} disabled={isLoading} className={`flex items-center gap-2 px-5 py-3.5 bg-[#D4AF37] text-[#003366] rounded-xl font-bold transition-all ${isLoading ? 'opacity-50 cursor-wait' : 'hover:bg-[#C5A028] shadow-md'}`}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                  <span>استيراد ملف Excel</span>
                </button>
              </>
            )}
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
                  <th className="px-5 py-4 text-center w-12">
                    <input type="checkbox" className="accent-[#D4AF37] w-4 h-4 cursor-pointer rounded" checked={selectedIds.length === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />
                  </th>
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
                    <td colSpan="7" className="text-center py-20 text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
                        <span className="font-bold text-[#003366]">جاري تحميل البيانات...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-500 font-medium flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-gray-300" />
                      <span>{isArchiveView ? 'لا توجد ملفات في الأرشيف' : 'لا توجد بيانات مطابقة لبحثك'}</span>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row) => {
                    const allRoles = splitText(row.role, ' / ');
                    const allAddresses = splitText(row.address, '\n');
                    const allDecisions = splitText(row.decision, '\n');
                    const allParties = row.parties || [];

                    const visibleIndices = allRoles
                      .map((r, i) => ({ role: r, index: i }))
                      .filter(item => !selectedRole || item.role.includes(selectedRole))
                      .map(item => item.index);

                    const displayParties = visibleIndices.map(i => allParties[i]).filter(p => p !== undefined);
                    const displayRoles = visibleIndices.map(i => allRoles[i]).filter(r => r !== undefined);
                    const displayAddresses = visibleIndices.map(i => allAddresses[i]).filter(a => a !== undefined);
                    const displayDecisions = visibleIndices.map(i => allDecisions[i]).filter(d => d !== undefined);

                    return (
                      <tr key={row.id} className={`hover:bg-blue-50/40 transition-colors group ${selectedIds.includes(row.id) ? 'bg-blue-50/60' : ''} ${isArchiveView ? 'bg-gray-50/30' : ''}`}>
                        <td className="px-5 py-5 text-center align-top">
                          <input 
                            type="checkbox" 
                            className="accent-[#003366] w-4 h-4 cursor-pointer rounded mt-1"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleSelect(row.id)}
                          />
                        </td>
                        <td className="px-5 py-5 font-mono font-bold text-lg text-[#003366] whitespace-nowrap align-top">{row.fileNumber || row.file_number}</td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col gap-2">
                            {displayParties.map((party, pIndex) => (
                              <span key={pIndex} className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold bg-[#003366]/5 text-[#003366] border border-[#003366]/10 w-fit shadow-sm">{party}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col gap-2">
                            {displayRoles.map((role, idx) => (
                              <span key={idx} className="inline-flex text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded w-fit border border-gray-200">{role}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col">
                            {displayAddresses.map((addr, idx) => (
                              <div key={idx} className={`py-2 flex items-start gap-2 ${idx !== displayAddresses.length - 1 ? 'border-b border-gray-100 border-dashed' : ''}`}>
                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-xs leading-relaxed">{addr}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-5 align-top">
                          <div className="flex flex-col">
                            {displayDecisions.map((dec, idx) => (
                              <div key={idx} className={`py-2 flex items-start gap-2 ${idx !== displayDecisions.length - 1 ? 'border-b border-gray-100 border-dashed' : ''}`}>
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
                            {!isArchiveView && (
                              <button onClick={() => handlePrintClick(row)} className="p-2 text-[#003366] hover:bg-[#003366]/10 rounded-lg transition-colors border border-transparent hover:border-[#003366]/20" title="تجهيز الطباعة (Word)">
                                <Printer className="w-4 h-4" />
                              </button>
                            )}
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
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 text-[#003366]" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-lg font-bold text-xs transition-all ${
                            currentPage === page 
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
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 text-[#003366]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- نافذة الطباعة الفردية (PRINT MODAL) --- */}
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
                      {printData.isMultipleSuspects && <option value="ALL">جميع المتهمين في هذا الملف</option>}
                      {printData.availableParties.map((party, idx) => <option key={idx} value={idx}>{party}</option>)}
                    </select>
                    <p className="text-xs text-gray-500 mt-2 font-medium">ملاحظة: سيتم جلب الاسم والعنوان الخاص بالطرف تلقائياً.</p>
                  </div>
                )}

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">إلى السيد (اسم الطرف)</label>
                  <input type="text" value={printData.suspectName} readOnly={printData.selectedIndex === 'ALL'} onChange={(e) => setPrintData({...printData, suspectName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none font-bold text-lg" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-sm font-bold text-[#003366]">الساكن بـ (العنوان)</label>
                  <textarea value={printData.address} readOnly={printData.selectedIndex === 'ALL'} onChange={(e) => setPrintData({...printData, address: e.target.value})} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-[#D4AF37] outline-none resize-none leading-relaxed"></textarea>
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
                <Download className="w-4 h-4" />طباعة يوجه
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- نافذة التعديل (EDIT MODAL) --- */}
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