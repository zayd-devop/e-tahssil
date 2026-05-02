import React, { useState, useEffect, useRef } from 'react';
import { Search, FileSpreadsheet, Loader2, AlertCircle, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

export function OutstandingDebtsModule() {
  // 1. États pour la navigation et la recherche
  const [activeTab, setActiveTab] = useState('outstanding');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 👈 NOUVEAU : État pour l'année sélectionnée (par défaut 2024 ou vide pour "Toutes")
  const [selectedYear, setSelectedYear] = useState('2024');
  
  // 2. États pour les données de l'API
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 3. États pour l'importation Excel
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Revenir à la page 1 quand on change de recherche ou d'année
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedYear]);

  // 4. Fonction pour charger les données depuis Laravel
  const fetchDebts = async () => {
    try {
      setIsLoading(true);
      // 👈 MODIFICATION : On ajoute l'année dans l'URL (Query Parameter)
      const url = `http://localhost:8000/api/outstanding-debts?year=${selectedYear}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const jsonData = await response.json();
      setData(jsonData);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError("تعذر تحميل البيانات. يرجى التحقق من الخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  // Recharger les données dès que l'année change
  useEffect(() => {
    fetchDebts();
  }, [selectedYear]);

  // 5. Fonction d'importation Excel
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setError(null);

    // ⏳ 1. Afficher le SweetAlert de chargement
    Swal.fire({
      title: 'جاري الاستيراد...',
      text: 'المرجو الانتظار بينما يتم رفع ومعالجة الملف...',
      allowOutsideClick: false, // Empêche de fermer en cliquant à côté
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading(); // Affiche le spinner animé de SweetAlert
      },
      customClass: {
        title: 'font-sans font-bold text-[#003366]',
        popup: 'rounded-2xl',
      }
    });

    try {
      const response = await fetch('http://localhost:8000/api/outstanding-debts/import', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "حدث خطأ أثناء الاستيراد"); // Message d'erreur par défaut en arabe
      }

      await fetchDebts(); 
      
      // ✅ 2. Remplacer par le SweetAlert de succès
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
      
      // ❌ 3. Remplacer par le SweetAlert d'erreur
      Swal.fire({
        title: 'خطأ!',
        text: err.message || 'فشل استيراد الملف. يرجى التحقق من التنسيق.',
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

  // 6. Logique de filtrage (Recherche)
  // 6. Logique de filtrage ultra-synchronisée (Année + Recherche)
const filteredData = data.filter((row) => {
  // A. Filtrage par année : 
  // Si "كل السنوات" est sélectionné (selectedYear vide), on laisse passer tout.
  // Sinon, on vérifie que l'année du dossier correspond à l'année choisie.
  const yearMatch = !selectedYear || String(row.file_year) === String(selectedYear);
  
  // B. Filtrage par recherche :
  const query = searchQuery.toLowerCase();
  const nameMatch = row.fullName ? row.fullName.toLowerCase().includes(query) : false;
  const numberMatch = row.collectionFileNumber ? row.collectionFileNumber.toLowerCase().includes(query) : false;
  
  const searchMatch = !searchQuery || nameMatch || numberMatch;

  // Le dossier ne s'affiche que s'il respecte l'année ET la recherche
  return yearMatch && searchMatch;
});

  // Logique mathématique de la pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-gray-50/50 min-h-full font-sans" dir="rtl">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Navigation par onglets */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 inline-flex">
            <button onClick={() => setActiveTab('outstanding')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'outstanding' ? 'bg-[#003366] text-white shadow-md' : 'bg-transparent text-[#003366] hover:bg-gray-50'}`}>الباقي بدون تحصيل</button>
            <button onClick={() => setActiveTab('supplementary')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'supplementary' ? 'bg-[#003366] text-white shadow-md' : 'bg-transparent text-[#003366] hover:bg-gray-50'}`}>الرسوم التكميلية</button>
            <button onClick={() => setActiveTab('judicial_assistance')} className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'judicial_assistance' ? 'bg-[#003366] text-white shadow-md' : 'bg-transparent text-[#003366] hover:bg-gray-50'}`}>صوائر المساعدة القضائية</button>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* 👈 NOUVEAU : Le Select pour l'année */}
            <div className="relative w-full sm:w-48">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-bold text-[#003366] appearance-none focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all cursor-pointer"
              >
                <option value="">كل السنوات</option>
{/* Génération dynamique de 2000 jusqu'à l'année en cours */}
{(() => {
  const startYear = 2000;
  const currentYear = new Date().getFullYear();
  const totalYears = currentYear - startYear + 1;

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
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all"
              />
              <Search className="w-5 h-5 text-[#003366] absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
             <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
             <button onClick={triggerFileInput} disabled={isUploading} className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all w-full justify-center ${isUploading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-[#003366] hover:bg-[#C5A028] shadow-lg active:scale-95'}`}>
               {isUploading ? (<><Loader2 className="w-5 h-5 animate-spin" /><span>جاري الاستيراد...</span></>) : (<><FileSpreadsheet className="w-5 h-5" /><span>استيراد ملف Excel</span></>)}
             </button>
          </div>
        </div>

        {/* Tableau (reste inchangé) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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
          {filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between bg-gray-50 gap-4">
              <span className="text-sm text-gray-500 font-medium">إجمالي السجلات: {filteredData.length} | عرض {indexOfFirstItem + 1} إلى {Math.min(indexOfLastItem, filteredData.length)}</span>
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