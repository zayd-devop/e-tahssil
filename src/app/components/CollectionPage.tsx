import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, DollarSign, FileText, Search, Filter, Download, CheckCircle, AlertCircle, XCircle, Calendar, User, MapPin } from 'lucide-react';

interface CollectionPageProps {
}

export function CollectionPage() {
  const language = 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  id: string;
  fileNumber: string;
  debtor: string;
  amount: number;
  amountRecovered: number;
  status: 'pending' | 'partial' | 'completed' | 'failed';
  dueDate: string;
  lastAction: string;
  region: string;
}

interface CollectionFile {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const translations = {
    ar: {
      title: 'التحصيل المالي',
      subtitle: 'إدارة عمليات تحصيل الديون القضائية',
      totalAmount: 'المبلغ الإجمالي',
      amountRecovered: 'المبلغ المحصل',
      recoveryRate: 'معدل التحصيل',
      pendingFiles: 'ملفات قيد التحصيل',
      search: 'البحث في الملفات...',
      filterByStatus: 'تصفية حسب الحالة',
      all: 'الكل',
      pending: 'قيد الانتظار',
      partial: 'تحصيل جزئي',
      completed: 'مكتمل',
      failed: 'فشل',
      fileNumber: 'رقم الملف',
      debtor: 'المدين',
      amount: 'المبلغ',
      recovered: 'المحصل',
      status: 'الحالة',
      dueDate: 'تاريخ الاستحقاق',
      lastAction: 'آخر إجراء',
      region: 'المنطقة',
      actions: 'الإجراءات',
      viewDetails: 'عرض التفاصيل',
      export: 'تصدير',
      dh: 'د.م',
      statusPending: 'قيد الانتظار',
      statusPartial: 'تحصيل جزئي',
      statusCompleted: 'مكتمل',
      statusFailed: 'فشل',
    },
    fr: {
      title: 'Recouvrement Financier',
      subtitle: 'Gestion des opérations de recouvrement de dettes judiciaires',
      totalAmount: 'Montant Total',
      amountRecovered: 'Montant Recouvré',
      recoveryRate: 'Taux de Recouvrement',
      pendingFiles: 'Dossiers en Cours',
      search: 'Rechercher dans les dossiers...',
      filterByStatus: 'Filtrer par statut',
      all: 'Tous',
      pending: 'En Attente',
      partial: 'Partiel',
      completed: 'Complété',
      failed: 'Échoué',
      fileNumber: 'N° Dossier',
      debtor: 'Débiteur',
      amount: 'Montant',
      recovered: 'Recouvré',
      status: 'Statut',
      dueDate: 'Date d\'Échéance',
      lastAction: 'Dernière Action',
      region: 'Région',
      actions: 'Actions',
      viewDetails: 'Voir Détails',
      export: 'Exporter',
      dh: 'DH',
      statusPending: 'En Attente',
      statusPartial: 'Partiel',
      statusCompleted: 'Complété',
      statusFailed: 'Échoué',
    },
  };

  const t = translations[language];

  const collectionFiles: CollectionFile[] = [
    {
      id: '1',
      fileNumber: 'RC-2026-001',
      debtor: language === 'ar' ? 'محمد العلوي' : 'Mohammed El Alaoui',
      amount: 250000,
      amountRecovered: 150000,
      status: 'partial',
      dueDate: '2026-03-15',
      lastAction: language === 'ar' ? 'تحصيل جزئي 150,000 د.م' : 'Recouvrement partiel 150,000 DH',
      region: language === 'ar' ? 'الدار البيضاء' : 'Casablanca',
    },
    {
      id: '2',
      fileNumber: 'RC-2026-002',
      debtor: language === 'ar' ? 'فاطمة الإدريسي' : 'Fatima El Idrissi',
      amount: 180000,
      amountRecovered: 180000,
      status: 'completed',
      dueDate: '2026-02-20',
      lastAction: language === 'ar' ? 'تم التحصيل الكامل' : 'Recouvrement complet',
      region: language === 'ar' ? 'الرباط' : 'Rabat',
    },
    {
      id: '3',
      fileNumber: 'RC-2026-003',
      debtor: language === 'ar' ? 'عبد الله الحسني' : 'Abdellah El Hassani',
      amount: 320000,
      amountRecovered: 0,
      status: 'pending',
      dueDate: '2026-04-01',
      lastAction: language === 'ar' ? 'إشعار أول - قيد الانتظار' : 'Premier avis - En attente',
      region: language === 'ar' ? 'فاس' : 'Fès',
    },
    {
      id: '4',
      fileNumber: 'RC-2026-004',
      debtor: language === 'ar' ? 'خديجة بنعلي' : 'Khadija Benali',
      amount: 95000,
      amountRecovered: 0,
      status: 'failed',
      dueDate: '2026-01-30',
      lastAction: language === 'ar' ? 'فشل التحصيل - المدين غير موجود' : 'Échec - Débiteur introuvable',
      region: language === 'ar' ? 'مراكش' : 'Marrakech',
    },
    {
      id: '5',
      fileNumber: 'RC-2026-005',
      debtor: language === 'ar' ? 'رشيد التازي' : 'Rachid Tazi',
      amount: 450000,
      amountRecovered: 225000,
      status: 'partial',
      dueDate: '2026-03-25',
      lastAction: language === 'ar' ? 'تحصيل 50% من المبلغ' : 'Recouvrement de 50%',
      region: language === 'ar' ? 'طنجة' : 'Tanger',
    },
    {
      id: '6',
      fileNumber: 'RC-2026-006',
      debtor: language === 'ar' ? 'نادية المرابط' : 'Nadia Mrabit',
      amount: 210000,
      amountRecovered: 0,
      status: 'pending',
      dueDate: '2026-05-10',
      lastAction: language === 'ar' ? 'إنذار أول' : 'Premier avertissement',
      region: language === 'ar' ? 'أكادير' : 'Agadir',
    },
  ];

  const totalAmount = collectionFiles.reduce((sum, file) => sum + file.amount, 0);
  const totalRecovered = collectionFiles.reduce((sum, file) => sum + file.amountRecovered, 0);
  const recoveryRate = ((totalRecovered / totalAmount) * 100).toFixed(1);
  const pendingFilesCount = collectionFiles.filter(f => f.status === 'pending' || f.status === 'partial').length;

  const filteredFiles = collectionFiles.filter(file => {
    const matchesSearch = 
      file.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.debtor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const statusTexts = {
      completed: t.statusCompleted,
      partial: t.statusPartial,
      failed: t.statusFailed,
      pending: t.statusPending,
    };

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {getStatusIcon(status)}
        {statusTexts[status as keyof typeof statusTexts]}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} ${t.dh}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-600 mt-1">{t.subtitle}</p>
        </div>
        <button className={`flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">{t.export}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Amount */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#003366]">
          <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-sm text-gray-600">{t.totalAmount}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#003366]" />
            </div>
          </div>
        </div>

        {/* Amount Recovered */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-sm text-gray-600">{t.amountRecovered}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRecovered)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Recovery Rate */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D4AF37]">
          <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-sm text-gray-600">{t.recoveryRate}</p>
              <p className="text-2xl font-bold text-[#D4AF37] mt-1">{recoveryRate}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>
        </div>

        {/* Pending Files */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-sm text-gray-600">{t.pendingFiles}</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">{pendingFilesCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`flex items-center gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Search */}
        <div className="flex-1 relative">
          <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full bg-white border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#003366] ${language === 'ar' ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'}`}
          />
        </div>

        {/* Status Filter */}
        <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366] ${language === 'ar' ? 'text-right' : 'text-left'}`}
          >
            <option value="all">{t.all}</option>
            <option value="pending">{t.pending}</option>
            <option value="partial">{t.partial}</option>
            <option value="completed">{t.completed}</option>
            <option value="failed">{t.failed}</option>
          </select>
        </div>
      </div>

      {/* Collection Files Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.fileNumber}</th>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.debtor}</th>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.region}</th>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.amount}</th>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.recovered}</th>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.status}</th>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.dueDate}</th>
                <th className={`px-6 py-4 text-sm font-semibold ${language === 'ar' ? 'text-right' : 'text-left'}`}>{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <span className="font-medium text-[#003366]">{file.fileNumber}</span>
                  </td>
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{file.debtor}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{file.region}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <span className="font-semibold text-gray-900">{formatCurrency(file.amount)}</span>
                  </td>
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <span className="font-semibold text-green-600">{formatCurrency(file.amountRecovered)}</span>
                  </td>
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {getStatusBadge(file.status)}
                  </td>
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{file.dueDate}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    <button className="px-4 py-2 bg-[#003366] text-white text-sm rounded-lg hover:bg-[#004080] transition-colors">
                      {t.viewDetails}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
