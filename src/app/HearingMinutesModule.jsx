import React, { useState, useRef, useEffect } from 'react'; // 1. Ajout de useEffect
import { 
  Gavel, 
  UploadCloud, 
  Search, 
  Filter, 
  Edit, 
  Printer, 
  FilePlus2,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function HearingMinutesModule() {
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); // État pour le chargement initial
  const [currentPage, setCurrentPage] = useState(1);
const [paginationMeta, setPaginationMeta] = useState({ last_page: 1, total: 0 });
  
  const fileInputRef = useRef(null);

  // 2. Charger les données de la BD au montage du composant
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1) => {
  setIsLoading(true);
  try {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:8000/api/hearing-minutes?page=${page}`, {
      method: 'GET',
      headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const res = await response.json();
      setTableData(res.data); // Laravel place les données dans l'objet 'data'
      setPaginationMeta({
        last_page: res.last_page,
        total: res.total
      });
      setCurrentPage(res.current_page);
    }
  } catch (error) {
    console.error("Erreur de chargement:", error);
  } finally {
    setIsLoading(false);
  }
};

  const handleFileUpload = async (e) => {
    e.preventDefault();
    let file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
        Swal.fire({
            icon: 'warning',
            title: 'صيغة غير مدعومة',
            text: 'يرجى اختيار ملف بصيغة Excel (.xlsx, .xls) أو CSV',
            confirmButtonColor: '#003366'
        });
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    Swal.fire({
      title: 'جاري معالجة الملف...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/hearing-minutes/import', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: formData
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message);

      setTableData(responseData.data);
      Swal.fire({ icon: 'success', title: 'تم الاستيراد بنجاح', timer: 2000, showConfirmButton: false });

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'فشل الاستيراد', text: error.message });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const filteredData = tableData.filter(row => {
      const query = searchQuery.toLowerCase();
      return (
          row.file_number?.toLowerCase().includes(query) ||
          row.plaintiff_lawyer?.toLowerCase().includes(query)
      );
  });

  return (
    <div className="bg-gray-50/50 min-h-full font-sans flex flex-col" dir="rtl">
      <div className="max-w-[95%] mx-auto space-y-6 pt-2 w-full flex-1">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
          <div className="w-14 h-14 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
            <Gavel className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">محضر الجلسة</h1>
            <p className="text-gray-500 mt-1 font-medium">إدارة واستعراض محاضر الجلسات المخزنة</p>
          </div>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white flex-wrap gap-4">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث..." 
                className="w-full pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-xl font-bold hover:bg-[#002244] shadow-md transition-all">
                <FilePlus2 className="w-5 h-5 text-[#D4AF37]" />
                <span>استيراد محضر جديد</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">رقم الملف</th>
                  <th className="px-6 py-4">المدعي</th>
                  <th className="px-6 py-4">المدعى عليه</th>
                  <th className="px-6 py-4">الموضوع</th>
                  <th className="px-6 py-4">القاضي</th>
                  <th className="px-6 py-4">النتيجة</th>
                  <th className="px-6 py-4 text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#D4AF37]" />
                      <p className="mt-4 text-gray-500">جاري تحميل البيانات...</p>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#003366]">{row.file_number}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{row.plaintiff_lawyer}</td>
                      <td className="px-6 py-4 text-gray-700">{row.defendant_lawyer}</td>
                      <td className="px-6 py-4 truncate max-w-xs">{row.subject}</td>
                      <td className="px-6 py-4 text-gray-600">{row.judge}</td>
                      <td className="px-6 py-4 min-w-[250px] max-w-[350px]">
  <div 
    className={`px-3 py-2 rounded-lg text-sm font-bold border leading-relaxed ${row.result_color}`}
    title={row.result} // Permet d'afficher le texte complet quand on passe la souris dessus
  >
    <p className="line-clamp-3 whitespace-normal">
      {row.result}
    </p>
  </div>
</td>
                      <td className="px-6 py-4 text-left">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-[#D4AF37]"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-400 hover:text-[#003366]"><Printer className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-20 text-center text-gray-400">
                      لا توجد بيانات مخزنة حالياً.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* --- Pagination --- */}
<div className="p-5 border-t border-gray-100 flex items-center justify-between bg-white">
  <div className="text-sm text-gray-500 font-medium">
    إجمالي السجلات: {paginationMeta.total}
  </div>
  
  <div className="flex items-center gap-2">
    <button 
      disabled={currentPage === 1}
      onClick={() => fetchData(currentPage - 1)}
      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-gray-50 transition-colors"
    >
      السابق
    </button>
    
    <span className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-[#003366]">
      الصفحة {currentPage} من {paginationMeta.last_page}
    </span>
    
    <button 
      disabled={currentPage === paginationMeta.last_page}
      onClick={() => fetchData(currentPage + 1)}
      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-gray-50 transition-colors"
    >
      التالي
    </button>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}