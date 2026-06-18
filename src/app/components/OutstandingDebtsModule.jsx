import React, { useState, useEffect, useRef } from 'react';
import { Search, FileSpreadsheet, Loader2, AlertCircle, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

// 🔥 1. IMPORT D'AXIOS
import api from '../api/axios'; 

export function OutstandingDebtsModule() {
  // 1. États pour la navigation et la recherche
  const [activeTab, setActiveTab] = useState('outstanding');
  const [searchQuery, setSearchQuery] = useState('');
  
  // État pour l'année sélectionnée (par défaut 2024 ou vide pour "Toutes")
  const [selectedYear, setSelectedYear] = useState('');
  
  // 2. États pour les données de l'API
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. États pour l'importation Excel
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Revenir à la page 1 quand on change de recherche, d'année ou d'onglet
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear, activeTab]);

  // Fonction utilitaire pour obtenir le bon point de terminaison API selon l'onglet
  const getApiEndpoint = () => {
    if (activeTab === 'supplementary') return 'supplementary-fees';
    if (activeTab === 'judicial_assistance') return 'judicial-assistance'; 
    return 'outstanding-debts'; 
  };

  const fetchDebts = async () => {
    try {
      setIsLoading(true);
      
      const params = {
        page: currentPage,
        search: searchQuery,
      };

      if (selectedYear) {
        params.year = selectedYear;
      }

      // Axios s'occupe de l'URL de base et du Token
      const response = await api.get(`/${getApiEndpoint()}`, { params });
      
      // Les données paginées
      setData(response.data.data || []);
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.last_page || 1);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError("تعذر تحميل البيانات. يرجى التحقق من الخادم.");
      setData([]); // On vide les données en cas d'erreur
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Recharger les données dès que les filtres ou la page changent
  useEffect(() => {
    fetchDebts();
  }, [selectedYear, activeTab, currentPage, searchQuery]);

  // 🔥 3. CORRECTION : POST avec Axios pour FormData
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setError(null);

    Swal.fire({
      title: 'جاري الاستيراد...',
      text: 'المرجو الانتظار بينما يتم رفع ومعالجة الملف...',
      allowOutsideClick: false, 
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); 
      },
      customClass: {
        title: 'font-sans font-bold text-[#003366]',
        popup: 'rounded-2xl',
      }
    });

    try {
      // Axios configure tout seul les headers pour FormData (multipart/form-data)
      await api.post(`/${getApiEndpoint()}/import`, formData);

      await fetchDebts(); 
      
      Swal.fire({
        title: 'نجاح!',
        text: 'تم استيراد الملف بنجاح!',
        icon: 'success',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#003366',
        iconColor: '#D4AF37',
        customClass: {
          title: 'font-sans font-bold text-[#003366]',
          popup: 'rounded-2xl',
        }
      });
      
    } catch (err) {
      console.error("Erreur d'importation:", err);
      
      // Axios stocke le message d'erreur du backend dans err.response.data
      const errorMessage = err.response?.data?.message || 'فشل استيراد الملف. يرجى التحقق من التنسيق.';
      
      Swal.fire({
        title: 'خطأ!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'إغلاق',
        confirmButtonColor: '#ef4444',
        customClass: {
          title: 'font-sans font-bold',
          popup: 'rounded-2xl',
        }
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const currentItems = data;

  return (
    <div className="bg-transparent min-h-full font-sans" dir="rtl">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Navigation par onglets */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-full shadow-lg shadow-[#003366]/5 border border-white inline-flex">
            <button onClick={() => setActiveTab('outstanding')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'outstanding' ? 'bg-gradient-to-r from-[#003366] to-[#002244] text-white shadow-md' : 'bg-transparent text-[#003366] hover:bg-[#003366]/5'}`}>الباقي بدون تحصيل</button>
            <button onClick={() => setActiveTab('supplementary')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'supplementary' ? 'bg-gradient-to-r from-[#003366] to-[#002244] text-white shadow-md' : 'bg-transparent text-[#003366] hover:bg-[#003366]/5'}`}>الرسوم التكميلية</button>
            <button onClick={() => setActiveTab('judicial_assistance')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'judicial_assistance' ? 'bg-gradient-to-r from-[#003366] to-[#002244] text-white shadow-md' : 'bg-transparent text-[#003366] hover:bg-[#003366]/5'}`}>صوائر المساعدة القضائية</button>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-xl shadow-[#003366]/5 border border-white">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-48">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-base font-bold text-[#003366] appearance-none focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] outline-none transition-all cursor-pointer shadow-sm"
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
              <Calendar className="w-5 h-5 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Barre de recherche */}
            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في السجل..." 
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border-0 ring-1 ring-inset ring-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-inset focus:ring-[#D4AF37] outline-none transition-all shadow-sm"
              />
              <Search className="w-5 h-5 text-[#003366] absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
             <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
             <button onClick={triggerFileInput} disabled={isUploading} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 w-full justify-center ${isUploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white hover:shadow-lg hover:-translate-y-0.5 shadow-md active:scale-95'}`}>
               {isUploading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>جاري الاستيراد...</span></>) : (<><FileSpreadsheet className="w-5 h-5" /><span>استيراد ملف Excel</span></>)}
             </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-[#003366]/5 border border-white overflow-hidden transition-all duration-300 hover:shadow-[#003366]/10">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse min-w-[1200px]">
              <thead className="bg-[#003366] text-white font-bold">
                <tr>
                  <th rowSpan="2" className="px-4 py-3 border border-[#004080] align-middle whitespace-nowrap">رقم ملف التحصيل</th>
                  <th colSpan="2" className="px-4 py-2 border border-[#004080] text-center border-b-[#004080]/50">الحكم أو القرار</th>
                  <th rowSpan="2" className="px-4 py-3 border border-[#004080] align-middle">الاسم الكامل للمحكوم عليه</th>
                  <th colSpan="2" className="px-4 py-2 border border-[#004080] text-center border-b-[#004080]/50">بيان التكفلات</th>
                  <th colSpan="3" className="px-4 py-2 border border-[#004080] text-center border-b-[#004080]/50 text-[#D4AF37]">تفاصيل الغرامات والعقوبات المالية</th>
                  <th rowSpan="2" className="px-4 py-3 border border-[#004080] align-middle">آخر إجراء منجز</th>
                  <th rowSpan="2" className="px-4 py-3 border border-[#004080] align-middle whitespace-nowrap">تاريخه</th>
                  <th rowSpan="2" className="px-4 py-3 border border-[#004080] align-middle">ملاحظات</th>
                </tr>
                <tr className="bg-[#002244] text-gray-200 text-xs">
                  <th className="px-4 py-2 border border-[#004080] whitespace-nowrap">رقمه</th>
                  <th className="px-4 py-2 border border-[#004080] whitespace-nowrap">تاريخه</th>
                  <th className="px-4 py-2 border border-[#004080] whitespace-nowrap">رقمه</th>
                  <th className="px-4 py-2 border border-[#004080] whitespace-nowrap">تاريخه</th>
                  <th className="px-4 py-2 border border-[#004080] text-[#D4AF37]/90 whitespace-nowrap">الغرامات</th>
                  <th className="px-4 py-2 border border-[#004080] text-[#D4AF37]/90 whitespace-nowrap">الإدانات النقدية</th>
                  <th className="px-4 py-2 border border-[#004080] text-[#D4AF37]/90 whitespace-nowrap">الصائر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan="12" className="px-4 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
                        <span className="font-medium text-[#003366]">جاري تحميل البيانات...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="px-4 py-8 text-center text-gray-500 font-medium">لا توجد بيانات لهذه السنة.</td>
                  </tr>
                ) : (
                  currentItems.map((row, index) => (
                    <tr key={row.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-gray-50/30' : ''}`}>
                      <td className="px-4 py-4 font-mono font-bold text-[#003366] whitespace-nowrap border-l border-gray-100">{row.collectionFileNumber}</td>
                      <td className="px-4 py-4 font-mono text-gray-700 whitespace-nowrap border-l border-gray-100">{row.judgmentNumber || '-'}</td>
                      <td className="px-4 py-4 font-mono text-gray-500 whitespace-nowrap border-l border-gray-100 text-xs">{row.judgmentDate || '-'}</td>
                      <td className="px-4 py-4 font-bold text-gray-900 border-l border-gray-100">{row.fullName}</td>
                      <td className="px-4 py-4 font-mono text-gray-700 whitespace-nowrap border-l border-gray-100">{row.assumptionsNumber || '-'}</td>
                      <td className="px-4 py-4 font-mono text-gray-500 whitespace-nowrap border-l border-gray-100 text-xs">{row.assumptionsDate || '-'}</td>
                      <td className="px-4 py-4 font-mono font-medium text-red-600 border-l border-gray-100 text-left bg-red-50/30" dir="ltr">{row.fines ? Number(row.fines).toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-4 font-mono font-medium text-red-600 border-l border-gray-100 text-left bg-red-50/30" dir="ltr">{row.monetaryConvictions ? Number(row.monetaryConvictions).toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-4 font-mono font-medium text-gray-700 border-l border-gray-100 text-left bg-gray-50" dir="ltr">{row.expenses ? Number(row.expenses).toFixed(2) : '0.00'}</td>
                      <td className="px-4 py-4 text-[#003366] font-medium border-l border-gray-100">
                        {row.lastProcedure ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#003366]/10 text-[#003366]">{row.lastProcedure}</span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-4 font-mono text-gray-500 whitespace-nowrap border-l border-gray-100 text-xs">{row.procedureDate || '-'}</td>
                      <td className="px-4 py-4 text-gray-500 text-sm">{row.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalItems > 0 && (
            <div className="px-6 py-4 border-t border-gray-100/50 flex flex-col sm:flex-row items-center justify-between bg-white/50 backdrop-blur-md gap-4">
              <span className="text-sm text-gray-500 font-medium">إجمالي السجلات: {totalItems} | عرض الصفحة {currentPage}</span>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`px-4 py-2 text-sm border rounded-lg font-medium transition-all ${currentPage === 1 ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-[#003366] hover:bg-gray-50'}`}>السابق</button>
                <span className="px-4 py-2 text-sm border-transparent rounded-lg bg-[#003366] text-white font-bold shadow-md flex items-center justify-center min-w-[3rem]">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`px-4 py-2 text-sm border rounded-lg font-medium transition-all ${currentPage === totalPages ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300 bg-white text-[#003366] hover:bg-gray-50'}`}>التالي</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}