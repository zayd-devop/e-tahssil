import React from 'react';
import { TrendingUp, FileText, AlertTriangle, ShieldAlert, PieChart as PieChartIcon, Activity, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface KPICardsProps {}

export function KPICards({}: KPICardsProps = {}) {
  const language = 'ar';
  const isRTL = true;

  const translations = {
    ar: {
      totalRecovered: 'إجمالي التحصيلات (MAD)',
      pendingExecutions: 'ملفات في طور التنفيذ',
      officeProductivity: 'إنتاجية المكتب',
      prescriptionAlert: 'تنبيهات التقادم',
      monthlyRevenue: 'تطور المداخيل الشهرية',
      registryDistribution: 'توزيع أنواع السجلات',
      delivered: 'مبلغة',
      pending: 'قيد الانتظار',
      extraits: 'المستخرجات',
      notifications: 'التبليغ',
      costs: 'الصوائر',
      deadlineAlert: 'ملفات بلغت أجل 15/4/1 سنة',
      critical: 'حرج جداً',
    },
    fr: {
      totalRecovered: 'Total Recouvré (MAD)',
      pendingExecutions: 'Dossiers en Cours',
      officeProductivity: 'Productivité du Bureau',
      prescriptionAlert: 'Alertes de Prescription',
      monthlyRevenue: 'Évolution des Revenus Mensuels',
      registryDistribution: 'Répartition par Registre',
      delivered: 'Notifiés',
      pending: 'En attente',
      extraits: 'Extraits',
      notifications: 'Notifications',
      costs: 'Frais',
      deadlineAlert: 'Dossiers à échéance 15/4/1 an',
      critical: 'CRITIQUE',
    },
  };

  const t = translations[language];

  // Data for Charts
  const monthlyRevenueData = [
    { name: 'يناير', nameFr: 'Jan', value: 120000 },
    { name: 'فبراير', nameFr: 'Fév', value: 150000 },
    { name: 'مارس', nameFr: 'Mar', value: 180000 },
    { name: 'أبريل', nameFr: 'Avr', value: 140000 },
    { name: 'ماي', nameFr: 'Mai', value: 210000 },
    { name: 'يونيو', nameFr: 'Juin', value: 250000 },
  ];

  const registryDistributionData = [
    { name: t.extraits, value: 55 },
    { name: t.notifications, value: 30 },
    { name: t.costs, value: 15 },
  ];
  const PIE_COLORS = ['#003366', '#D4AF37', '#e5e7eb'];

  return (
    <>
    {/* Global Statistics (Top Row) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Recovered */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#003366]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className={`flex items-start justify-between mb-4 relative z-10 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="text-sm text-gray-500 font-medium mb-1">{t.totalRecovered}</p>
            <h3 className="text-3xl font-bold text-[#003366]">2,450,000</h3>
          </div>
          <div className="w-12 h-12 bg-[#003366]/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-[#003366]" />
          </div>
        </div>
        <div className={`mt-auto flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12.5%
          </span>
          <span className="text-gray-400">vs الشهر الماضي</span>
        </div>
      </div>

      {/* Pending Files */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className={`flex items-start justify-between mb-4 relative z-10 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="text-sm text-gray-500 font-medium mb-1">{t.pendingExecutions}</p>
            <h3 className="text-3xl font-bold text-gray-900">1,284</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-auto">
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className={`text-xs text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>45% قيد المعالجة النشطة</p>
        </div>
      </div>

      {/* Office Productivity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className={`flex items-start justify-between mb-4 relative z-10 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="text-sm text-gray-500 font-medium mb-1">{t.officeProductivity}</p>
            <h3 className="text-3xl font-bold text-gray-900">82%</h3>
          </div>
          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>
        <div className="mt-auto flex justify-between items-center gap-4">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-600 font-medium">850 {t.delivered}</span>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-600 font-medium">186 {t.pending}</span>
          </div>
        </div>
      </div>

      {/* Prescription Alerts */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border border-red-200 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -mr-8 -mt-8"></div>
        <div className={`flex items-start justify-between mb-4 relative z-10 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{t.critical}</span>
            </div>
            <p className="text-sm text-red-800 font-bold mb-1">{t.prescriptionAlert}</p>
            <h3 className="text-3xl font-black text-red-600 animate-pulse">42</h3>
          </div>
          <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="mt-auto">
          <p className={`text-xs text-red-700 font-semibold bg-white/50 py-1.5 px-3 rounded-md border border-red-200 ${isRTL ? 'text-right' : 'text-left'}`}>
            ⚠️ {t.deadlineAlert}
          </p>
        </div>
      </div>
    </div>

    {/* Analytics (Middle Row) */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Monthly Revenue Trend (2/3) */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <h3 className={`text-lg font-bold text-[#003366] ${isRTL ? 'text-right' : 'text-left'}`}>{t.monthlyRevenue}</h3>
          <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none text-gray-600 font-medium">
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid key="cartesian-grid" strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                key="x-axis"
                dataKey={isRTL ? 'name' : 'nameFr'} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                key="y-axis"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}k`}
                dx={isRTL ? 40 : -10}
                orientation={isRTL ? 'right' : 'left'}
              />
              <Tooltip 
                key="tooltip"
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value.toLocaleString()} MAD`, t.totalRecovered]}
              />
              <Line 
                key="line-chart"
                type="monotone" 
                dataKey="value" 
                stroke="#003366" 
                strokeWidth={3} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, fill: '#D4AF37', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution by Registry Type (1/3) */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-1 flex flex-col">
        <h3 className={`text-lg font-bold text-[#003366] mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>{t.registryDistribution}</h3>
        <div className="flex-1 relative min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart id="registry-pie-chart">
              <Pie
                key="registry-pie"
                data={registryDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {registryDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                key="tooltip"
                formatter={(value: number) => [`${value}%`]}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-[#003366]">100%</span>
            <span className="text-xs font-medium text-gray-500 uppercase">Total</span>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {registryDistributionData.map((item, index) => (
            <div key={index} className={`flex items-center justify-between text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-gray-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
