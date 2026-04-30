import React, { useState, useMemo } from 'react';
import { Download, FileDown, Search, Filter, Plus, FileText, ChevronDown, X, Lock, Pencil } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

const mockData = [
  {
    id: '1',
    orderNumber: 1,
    fileNumber: '2025/7101/104',
    date: '2026-03-15',
    debtorName: 'شركة البناء الحديثة',
    feeType: 'الرسوم القضائية',
    amount: 15000.00,
    status: 'pending',
  },
  {
    id: '2',
    orderNumber: 2,
    fileNumber: '2025/7101/215',
    date: '2026-03-18',
    debtorName: 'أحمد العلمي',
    feeType: 'المساعدة القضائية',
    amount: 3500.50,
    status: 'recovered',
  },
  {
    id: '3',
    orderNumber: 3,
    fileNumber: '2025/7101/302',
    date: '2026-03-20',
    debtorName: 'مؤسسة الأطلس',
    feeType: 'صوائر الخبراء',
    amount: 8200.00,
    status: 'pending',
  },
  {
    id: '4',
    orderNumber: 4,
    fileNumber: '2025/7101/410',
    date: '2026-03-25',
    debtorName: 'فاطمة بنسعيد',
    feeType: 'الرسوم القضائية',
    amount: 1250.00,
    status: 'recovered',
  },
  {
    id: '5',
    orderNumber: 5,
    fileNumber: '2025/7101/505',
    date: '2026-04-01',
    debtorName: 'تعاونية الخير',
    feeType: 'صوائر الترجمة',
    amount: 4500.00,
    status: 'pending',
  }
];

export function RegistryOfExtracts({ role }) {
  const [records, setRecords] = useState(mockData);
  const [filterYear, setFilterYear] = useState('2026');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpdateStatus = (id) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, status: 'recovered' } : record
    ));
  };
  // Logique de filtrage combinée
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      // 1. Filtre de recherche textuelle
      const matchSearch = 
        record.debtorName.includes(searchQuery) || 
        record.fileNumber.includes(searchQuery);

      // 2. Filtres par listes déroulantes (Année, Mois, Catégorie)
      const matchYear = filterYear === '' || record.date.startsWith(filterYear);
      const matchMonth = filterMonth === '' || record.date.substring(5, 7) === filterMonth;
      const matchCategory = filterCategory === '' || record.feeType === filterCategory;

      return matchSearch && matchYear && matchMonth && matchCategory;
    });
  }, [records, searchQuery, filterYear, filterMonth, filterCategory]);

  // Le total se calcule maintenant sur les données filtrées
  const totalAmount = useMemo(() => {
    return filteredRecords.reduce((sum, record) => sum + record.amount, 0);
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans rtl" dir="rtl">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#003366]/5 rounded-xl flex items-center justify-center border border-[#003366]/10">
              <FileText className="w-6 h-6 text-[#003366]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003366]">سجل المستخرجات</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-white rounded-lg font-bold hover:bg-[#C5A028] transition-colors shadow-sm text-sm ml-2"
            >
              <Plus className="w-4 h-4" />
              إضافة مستخرج جديد
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#003366]/20 text-[#003366] rounded-lg font-bold hover:bg-[#003366]/5 transition-colors shadow-sm text-sm">
              <Download className="w-4 h-4" />
              تصدير Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002244] transition-colors shadow-sm text-sm">
              <FileDown className="w-4 h-4 text-[#D4AF37]" />
              تصدير PDF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Filters Bar */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-[#003366] font-bold">
              <Filter className="w-5 h-5" />
              <span>تصفية حسب:</span>
            </div>
            
            <div className="relative">
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-medium w-36"
              >
                <option value="">كل السنوات</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-medium w-40"
              >
                <option value="">كل الأشهر</option>
                <option value="01">يناير</option>
                <option value="02">فبراير</option>
                <option value="03">مارس</option>
                <option value="04">أبريل</option>
                <option value="05">ماي</option>
                <option value="06">يونيو</option>
                <option value="07">يوليوز</option>
                <option value="08">أغشت</option>
                <option value="09">شتنبر</option>
                <option value="10">أكتوبر</option>
                <option value="11">نونبر</option>
                <option value="12">دجنبر</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-medium w-52"
              >
                <option value="">كل أنواع المصاريف</option>
                <option value="الرسوم القضائية">الرسوم القضائية</option>
                <option value="المساعدة القضائية">المساعدة القضائية</option>
                <option value="صوائر الخبراء">صوائر الخبراء</option>
                <option value="صوائر الترجمة">صوائر الترجمة</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex-1"></div>
            
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في السجل..."
                className="w-full bg-white border border-gray-200 text-gray-900 py-2 pr-10 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-[#003366] text-white">
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap w-24">الرقم الترتيبي</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">رقم الملف / الحكم</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">تاريخ المستخرج</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">اسم الملزم بالأداء</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">نوع المصاريف</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">المبلغ المستحق (درهم)</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">الوضعية</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap w-16">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-6 text-sm font-bold text-gray-500">{record.orderNumber}</td>
                    <td className="py-4 px-6 text-sm font-bold text-[#003366]">{record.fileNumber}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{record.date}</td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">{record.debtorName}</td>
                    <td className="py-4 px-6">
                      <select 
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded focus:ring-[#D4AF37] focus:border-[#D4AF37] block w-full p-2 outline-none"
                        defaultValue={record.feeType}
                      >
                        <option value="الرسوم القضائية">الرسوم القضائية</option>
                        <option value="المساعدة القضائية">المساعدة القضائية</option>
                        <option value="صوائر الخبراء">صوائر الخبراء</option>
                        <option value="صوائر الترجمة">صوائر الترجمة</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      {record.amount.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      {record.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          في الانتظار
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          مستخلص
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {record.status === 'pending' ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-gray-400 hover:text-[#003366] transition-colors p-1 rounded-md hover:bg-gray-100">
                              <Plus className="w-5 h-5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-80 bg-white shadow-xl border border-gray-100 p-5 rounded-xl z-50">
                            <h4 className="font-bold text-[#003366] mb-4 text-base flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span>
                              تأكيد الاستخلاص
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">رقم الوصل</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">تاريخ الاستخلاص</label>
                                <input type="date" defaultValue="2026-04-04" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all" />
                              </div>
                              <button 
                                onClick={() => handleUpdateStatus(record.id)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors mt-2 shadow-sm"
                              >
                                تحديث الوضعية
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        role === 'clerk' ? (
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="p-1 text-gray-300 cursor-not-allowed flex justify-center w-fit mx-auto">
                                  <Lock className="w-4 h-4" />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium text-xs">تعديل مخصص للمسؤولين فقط</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <button 
                            onClick={() => setEditingRecord(record)}
                            className="text-[#D4AF37] hover:text-[#C5A028] transition-colors p-1.5 rounded-md hover:bg-[#D4AF37]/10 flex justify-center w-fit mx-auto"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#003366]/5 border-t-2 border-[#003366]/20">
                <tr>
                  <td colSpan={5} className="py-5 px-6 font-bold text-[#003366] text-lg text-right">
                    المجموع التلقائي (Total Automatique):
                  </td>
                  <td className="py-5 px-6 font-bold text-[#D4AF37] text-xl whitespace-nowrap">
                    {totalAmount.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} درهم
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between px-2">
          <p className="text-sm text-gray-500">إظهار 1 إلى 5 من أصل 45 مستخرج</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">السابق</button>
            <button className="px-3 py-1 bg-[#003366] text-white rounded text-sm font-bold">1</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">التالي</button>
          </div>
        </div>
      </div>

      {/* Modal Add Extract */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#003366]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-8">
            <div className="bg-[#003366] text-white px-6 py-5 flex items-center justify-between shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                إضافة مستخرج جديد
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              {/* Section A */}
              <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-[#D4AF37] font-bold text-lg mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center">
                    <span className="text-[#D4AF37] text-sm">A</span>
                  </div>
                  المراجع
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">رقم الملف / الحكم</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">نوع القضية</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">تاريخ التسجيل</label>
                    <input type="date" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Section B */}
              <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-[#D4AF37] font-bold text-lg mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center">
                    <span className="text-[#D4AF37] text-sm">B</span>
                  </div>
                  الملزم بالأداء
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">إسم الملزم بالأداء</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">رقم بطاقة التعريف (CIN)</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">عنوانه</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Section C */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-[#D4AF37] font-bold text-lg mb-5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#D4AF37]/10 flex items-center justify-center">
                    <span className="text-[#D4AF37] text-sm">C</span>
                  </div>
                  المعطيات المالية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">نوع المصاريف</label>
                    <div className="relative">
                      <select className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pr-4 pl-10 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm appearance-none">
                        <option value="">--</option>
                        <option value="الرسوم القضائية">الرسوم القضائية</option>
                        <option value="المساعدة القضائية">المساعدة القضائية</option>
                        <option value="صوائر الخبراء">صوائر الخبراء</option>
                        <option value="صوائر الترجمة">صوائر الترجمة</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">المبلغ المستحق (درهم)</label>
                    <div className="relative">
                      <input type="number" step="0.01" className="w-full bg-white border border-gray-200 rounded-lg py-2.5 pr-4 pl-12 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">MAD</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">رقم الوصل</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:text-[#003366] transition-colors shadow-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-2.5 bg-[#003366] text-white font-bold rounded-lg hover:bg-[#002244] transition-colors shadow-sm"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rectification Modal for Admin */}
      {editingRecord && (
        <div className="fixed inset-0 bg-[#003366]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-[#003366] text-white px-5 py-4 flex items-center justify-between shadow-sm">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Pencil className="w-4 h-4 text-[#D4AF37]" />
                تصحيح المعطيات - {editingRecord.fileNumber}
              </h2>
              <button 
                onClick={() => setEditingRecord(null)}
                className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Receipt Number Edit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-right">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">القيمة السابقة (رقم الوصل)</label>
                  <div className="text-sm font-bold text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-lg cursor-not-allowed">
                    REC-2026-0{editingRecord.orderNumber}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#003366] mb-1.5">القيمة الجديدة</label>
                  <input type="text" placeholder="REC-..." className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-right" />
                </div>
              </div>

              {/* Date Edit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-right">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">القيمة السابقة (تاريخ الاستخلاص)</label>
                  <div className="text-sm font-bold text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-lg cursor-not-allowed">
                    {editingRecord.date}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#003366] mb-1.5">القيمة الجديدة</label>
                  <input type="date" defaultValue="2026-04-04" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none text-right" />
                </div>
              </div>

              {/* Reason (Mandatory) */}
              <div className="text-right">
                <label className="block text-sm font-bold text-[#003366] mb-2">
                  سبب التعديل (إجباري) <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows="3" 
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none resize-none text-right"
                  placeholder="..."
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setEditingRecord(null)}
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 hover:text-[#003366] transition-colors shadow-sm"
              >
                إلغاء
              </button>
              <button 
                onClick={() => setEditingRecord(null)}
                className="px-5 py-2 bg-[#D4AF37] text-white font-bold text-sm rounded-lg hover:bg-[#C5A028] transition-colors shadow-sm"
              >
                تأكيد التصحيح
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}