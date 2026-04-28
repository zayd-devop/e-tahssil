import React, { useState, useMemo } from 'react';
import { Download, FileDown, Search, Filter, Plus, FileText, ChevronDown, X, Lock, Pencil } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';

interface ExtractRecord {
  id: string;
  orderNumber: number;
  fileNumber: string;
  date: string;
  debtorName: string;
  feeType: string;
  amount: number;
  status: 'pending' | 'recovered';
}

const mockData: ExtractRecord[] = [
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

export function RegistryOfExtracts({ role }: { role?: 'admin' | 'clerk' }) {
  const language = 'ar';
  const isRTL = true;
  const [records, setRecords] = useState<ExtractRecord[]>(mockData);
  const [filterYear, setFilterYear] = useState('2026');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExtractRecord | null>(null);

  const t = {
    title: isRTL ? 'سجل المستخرجات' : 'Registre des Extraits',
    subtitle: isRTL ? 'قسم تصفية الصوائر' : 'Division de Liquidation des Dépens',
    exportExcel: isRTL ? 'تصدير Excel' : 'Exporter Excel',
    exportPdf: isRTL ? 'تصدير PDF' : 'Exporter PDF',
    filterBy: isRTL ? 'تصفية حسب:' : 'Filtrer par:',
    allYears: isRTL ? 'كل السنوات' : 'Toutes les années',
    allMonths: isRTL ? 'كل الأشهر' : 'Tous les mois',
    allTypes: isRTL ? 'كل أنواع المصاريف' : 'Tous types de frais',
    jan: isRTL ? 'يناير' : 'Janvier',
    feb: isRTL ? 'فبراير' : 'Février',
    mar: isRTL ? 'مارس' : 'Mars',
    apr: isRTL ? 'أبريل' : 'Avril',
    feeTypes: {
      fees: isRTL ? 'الرسوم القضائية' : 'Frais Judiciaires',
      aid: isRTL ? 'المساعدة القضائية' : 'Assistance Judiciaire',
      expert: isRTL ? 'صوائر الخبراء' : 'Frais d\'Expertise',
      trans: isRTL ? 'صوائر الترجمة' : 'Frais de Traduction',
    },
    search: isRTL ? 'بحث في السجل...' : 'Rechercher dans le registre...',
    cols: {
      order: isRTL ? 'الرقم الترتيبي' : 'N° d\'Ordre',
      file: isRTL ? 'رقم الملف / الحكم' : 'N° Dossier / Jugement',
      date: isRTL ? 'تاريخ المستخرج' : 'Date de l\'Extrait',
      debtor: isRTL ? 'اسم الملزم بالأداء' : 'Nom du Débiteur',
      type: isRTL ? 'نوع المصاريف' : 'Type de Frais',
      amount: isRTL ? 'المبلغ المستحق (درهم)' : 'Montant Dû (MAD)',
      status: isRTL ? 'الوضعية' : 'Statut',
      action: isRTL ? 'إجراء' : 'Action',
    },
    totalAuto: isRTL ? 'المجموع التلقائي (Total Automatique):' : 'Total Automatique :',
    showing: isRTL ? 'إظهار 1 إلى 5 من أصل 45 مستخرج' : 'Affichage 1 à 5 sur 45 extraits',
    prev: isRTL ? 'السابق' : 'Précédent',
    next: isRTL ? 'التالي' : 'Suivant',
    modal: {
      trigger: isRTL ? 'إضافة مستخرج جديد' : 'Ajouter un extrait',
      title: isRTL ? 'إضافة مستخرج جديد' : 'Nouvel Extrait',
      sectionA: isRTL ? 'المراجع' : 'Références',
      sectionB: isRTL ? 'الملزم بالأداء' : 'Débiteur',
      sectionC: isRTL ? 'المعطيات المالية' : 'Données Financières',
      fileNumber: isRTL ? 'رقم الملف / الحكم' : 'N° Dossier / Jugement',
      caseType: isRTL ? 'نوع القضية' : 'Type d\'affaire',
      regDate: isRTL ? 'تاريخ التسجيل' : 'Date d\'enregistrement',
      debtorName: isRTL ? 'إسم الملزم بالأداء' : 'Nom du Débiteur',
      cin: isRTL ? 'رقم بطاقة التعريف (CIN)' : 'CIN',
      address: isRTL ? 'عنوانه' : 'Adresse',
      feeType: isRTL ? 'نوع المصاريف' : 'Type de Frais',
      amount: isRTL ? 'المبلغ المستحق (درهم)' : 'Montant Dû (MAD)',
      receiptNum: isRTL ? 'رقم الوصل' : 'N° de Quittance',
      save: isRTL ? 'حفظ' : 'Enregistrer',
      cancel: isRTL ? 'إلغاء' : 'Annuler',
    },
    popover: {
      confirmRecovery: isRTL ? 'تأكيد الاستخلاص' : 'Confirmer le recouvrement',
      receiptNumber: isRTL ? 'رقم الوصل' : 'Numéro de quittance',
      recoveryDate: isRTL ? 'تاريخ الاستخلاص' : 'Date de recouvrement',
      updateStatus: isRTL ? 'تحديث الوضعية' : 'Mettre à jour le statut',
    },
    rbac: {
      clerkView: isRTL ? 'عرض: مساعد' : 'Vue: Greffier',
      adminView: isRTL ? 'عرض: مسؤول' : 'Vue: Admin',
      restricted: isRTL ? 'تعديل مخصص للمسؤولين فقط' : "Modification réservée à l'administrateur",
      editTitle: isRTL ? 'تصحيح المعطيات' : 'Rectification',
      oldValue: isRTL ? 'القيمة السابقة' : 'Ancienne valeur',
      newValue: isRTL ? 'القيمة الجديدة' : 'Nouvelle valeur',
      reason: isRTL ? 'سبب التعديل (إجباري)' : 'Motif de la rectification',
      saveReason: isRTL ? 'تأكيد التصحيح' : 'Confirmer la rectification',
    }
  };

  const handleUpdateStatus = (id: string) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, status: 'recovered' as const } : record
    ));
  };

  const totalAmount = useMemo(() => {
    return records.reduce((sum, record) => sum + record.amount, 0);
  }, [records]);

  return (
    <div className={`min-h-screen bg-gray-50 p-6 font-sans ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#003366]/5 rounded-xl flex items-center justify-center border border-[#003366]/10">
              <FileText className="w-6 h-6 text-[#003366]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003366]">{t.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-[#D4AF37] font-medium">{t.subtitle}</p>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className={`text-xs font-bold px-2 py-1 rounded transition-colors ${role === 'admin' ? 'bg-[#003366] text-white shadow-sm' : 'bg-gray-100 text-gray-600'}`}>
                  {role === 'admin' ? t.rbac.adminView : t.rbac.clerkView}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-white rounded-lg font-bold hover:bg-[#C5A028] transition-colors shadow-sm text-sm ml-2"
            >
              <Plus className="w-4 h-4" />
              {t.modal.trigger}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#003366]/20 text-[#003366] rounded-lg font-bold hover:bg-[#003366]/5 transition-colors shadow-sm text-sm">
              <Download className="w-4 h-4" />
              {t.exportExcel}
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002244] transition-colors shadow-sm text-sm">
              <FileDown className="w-4 h-4 text-[#D4AF37]" />
              {t.exportPdf}
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
              <span>{t.filterBy}</span>
            </div>
            
            <div className="relative">
              <select 
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className={`appearance-none bg-white border border-gray-200 text-gray-700 py-2 ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-medium w-36`}
              >
                <option value="">{t.allYears}</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-gray-400 absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            </div>

            <div className="relative">
              <select 
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className={`appearance-none bg-white border border-gray-200 text-gray-700 py-2 ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-medium w-40`}
              >
                <option value="">{t.allMonths}</option>
                <option value="01">{t.jan}</option>
                <option value="02">{t.feb}</option>
                <option value="03">{t.mar}</option>
                <option value="04">{t.apr}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-gray-400 absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            </div>

            <div className="relative">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`appearance-none bg-white border border-gray-200 text-gray-700 py-2 ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm font-medium w-52`}
              >
                <option value="">{t.allTypes}</option>
                <option value="الرسوم القضائية">{t.feeTypes.fees}</option>
                <option value="المساعدة القضائية">{t.feeTypes.aid}</option>
                <option value="صوائر الخبراء">{t.feeTypes.expert}</option>
              </select>
              <ChevronDown className={`w-4 h-4 text-gray-400 absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
            </div>

            <div className="flex-1"></div>
            
            <div className="relative w-full md:w-72">
              <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text"
                placeholder={t.search}
                className={`w-full bg-white border border-gray-200 text-gray-900 py-2 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] text-sm`}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="bg-[#003366] text-white">
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap w-24">{t.cols.order}</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">{t.cols.file}</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">{t.cols.date}</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">{t.cols.debtor}</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">{t.cols.type}</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">{t.cols.amount}</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap">{t.cols.status}</th>
                  <th className="py-4 px-6 font-bold text-sm whitespace-nowrap w-16">{t.cols.action}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record, idx) => (
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
                        <option value="الرسوم القضائية">{t.feeTypes.fees}</option>
                        <option value="المساعدة القضائية">{t.feeTypes.aid}</option>
                        <option value="صوائر الخبراء">{t.feeTypes.expert}</option>
                        <option value="صوائر الترجمة">{t.feeTypes.trans}</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-gray-900">
                      {record.amount.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      {record.status === 'pending' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          En attente
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          Recouvré
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
                          <PopoverContent align={isRTL ? "end" : "start"} className="w-80 bg-white shadow-xl border border-gray-100 p-5 rounded-xl z-50">
                            <h4 className="font-bold text-[#003366] mb-4 text-base flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></span>
                              {t.popover.confirmRecovery}
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.popover.receiptNumber}</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all" />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.popover.recoveryDate}</label>
                                <input type="date" defaultValue="2026-04-04" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all" />
                              </div>
                              <button 
                                onClick={() => handleUpdateStatus(record.id)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors mt-2 shadow-sm"
                              >
                                {t.popover.updateStatus}
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
                                <p className="font-medium text-xs">{t.rbac.restricted}</p>
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
                  <td colSpan={5} className={`py-5 px-6 font-bold text-[#003366] text-lg ${isRTL ? 'text-left' : 'text-right'}`}>
                    {t.totalAuto}
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
          <p className="text-sm text-gray-500">{t.showing}</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">{t.prev}</button>
            <button className="px-3 py-1 bg-[#003366] text-white rounded text-sm font-bold">1</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 bg-white rounded text-sm text-gray-600 hover:bg-gray-50">{t.next}</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#003366]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-8">
            <div className="bg-[#003366] text-white px-6 py-5 flex items-center justify-between shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                {t.modal.title}
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
                  {t.modal.sectionA}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.fileNumber}</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.caseType}</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.regDate}</label>
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
                  {t.modal.sectionB}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.debtorName}</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.cin}</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.address}</label>
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
                  {t.modal.sectionC}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.feeType}</label>
                    <div className="relative">
                      <select className={`w-full bg-white border border-gray-200 rounded-lg py-2.5 ${isRTL ? 'pr-4 pl-10' : 'pl-4 pr-10'} focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm appearance-none`}>
                        <option value="">--</option>
                        <option value="الرسوم القضائية">{t.feeTypes.fees}</option>
                        <option value="المساعدة القضائية">{t.feeTypes.aid}</option>
                        <option value="صوائر الخبراء">{t.feeTypes.expert}</option>
                        <option value="صوائر الترجمة">{t.feeTypes.trans}</option>
                      </select>
                      <ChevronDown className={`w-4 h-4 text-gray-400 absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.amount}</label>
                    <div className="relative">
                      <input type="number" step="0.01" className={`w-full bg-white border border-gray-200 rounded-lg py-2.5 ${isRTL ? 'pr-4 pl-12' : 'pl-4 pr-12'} focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm`} />
                      <span className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm`}>MAD</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#003366] mb-2">{t.modal.receiptNum}</label>
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none transition-all shadow-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className={`px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center gap-3 justify-end`}>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 hover:text-[#003366] transition-colors shadow-sm"
              >
                {t.modal.cancel}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-2.5 bg-[#003366] text-white font-bold rounded-lg hover:bg-[#002244] transition-colors shadow-sm"
              >
                {t.modal.save}
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
                {t.rbac.editTitle} - {editingRecord.fileNumber}
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
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t.rbac.oldValue} ({t.popover.receiptNumber})</label>
                  <div className="text-sm font-bold text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-lg cursor-not-allowed">
                    REC-2026-0{editingRecord.orderNumber}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#003366] mb-1.5">{t.rbac.newValue}</label>
                  <input type="text" placeholder="REC-..." className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none ${isRTL ? 'text-right' : 'text-left'}`} />
                </div>
              </div>

              {/* Date Edit */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">{t.rbac.oldValue} ({t.popover.recoveryDate})</label>
                  <div className="text-sm font-bold text-gray-400 bg-white border border-gray-200 px-3 py-2 rounded-lg cursor-not-allowed">
                    {editingRecord.date}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#003366] mb-1.5">{t.rbac.newValue}</label>
                  <input type="date" defaultValue="2026-04-04" className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none ${isRTL ? 'text-right' : 'text-left'}`} />
                </div>
              </div>

              {/* Reason (Mandatory) */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="block text-sm font-bold text-[#003366] mb-2">
                  {t.rbac.reason} <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={3} 
                  className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] outline-none resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder="..."
                ></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setEditingRecord(null)}
                className="px-5 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 hover:text-[#003366] transition-colors shadow-sm"
              >
                {t.modal.cancel}
              </button>
              <button 
                onClick={() => setEditingRecord(null)}
                className="px-5 py-2 bg-[#D4AF37] text-white font-bold text-sm rounded-lg hover:bg-[#C5A028] transition-colors shadow-sm"
              >
                {t.rbac.saveReason}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
