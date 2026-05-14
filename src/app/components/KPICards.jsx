import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  FileSpreadsheet, 
  Send, 
  Trophy,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Remplace par l'URL de ton backend si nécessaire
const API_URL = 'http://127.0.0.1:8000/api'; 

export function KPICards() {
  const [activeFilter, setActiveFilter] = useState('notifications');
  
  // States pour la gestion de l'API
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Appel API au chargement du composant
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        // Récupération du token depuis le sessionStorage comme demandé
        const token = sessionStorage.getItem('token'); 

        const response = await fetch(`${API_URL}/dashboard-stats`, {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('فشل في تحميل بيانات لوحة القيادة'); // Échec du chargement
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setError('حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقاً.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // --------------------------------------------------------
  // 1. Écran de chargement
  // --------------------------------------------------------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#F9FAFB] w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#003366]"></div>
          <p className="text-[#003366] font-bold">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // 2. Écran d'erreur
  // --------------------------------------------------------
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#F9FAFB] w-full">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-200 font-bold shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // 3. Extraction des données (Sécurisée)
  // --------------------------------------------------------
  const { 
    kpis = {}, 
    monthlyData = [], 
    productivityDataSets = {}, 
    clerksData = [] 
  } = dashboardData || {};

  // Sécurité : au cas où le filtre n'existe pas encore dans les données chargées
  const currentChartData = productivityDataSets[activeFilter] || { data: [], average: 0, unit: '' };

  // --------------------------------------------------------
  // 4. Rendu Principal de la page
  // --------------------------------------------------------
  return (
    <div className="bg-[#F9FAFB] min-h-full font-sans flex flex-col" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6 pt-2 w-full flex-1 pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">لوحة القيادة</h1>
            <p className="text-gray-500 mt-1 font-medium">نظرة عامة على الأداء والإنتاجية</p>
          </div>
        </div>

        {/* --- Top Section - Quick Monthly KPIs --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#003366]"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">إجمالي المبالغ المستخلصة</h3>
            <p className="text-3xl font-black text-[#003366]">
              {kpis.total_collected_amount?.toLocaleString('fr-FR') || '0'} <span className="text-lg text-gray-400 font-bold">د.م</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#D4AF37]"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#D4AF37]">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">عدد الملفات المحصلة</h3>
            <p className="text-3xl font-black text-gray-800">
              {kpis.total_collected_files?.toLocaleString('fr-FR') || '0'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Send className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">عدد الملفات المبلغة</h3>
            <p className="text-3xl font-black text-gray-800">
              {kpis.total_notified_files?.toLocaleString('fr-FR') || '0'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#003366] to-[#001f3f] rounded-2xl shadow-sm border border-[#002244] p-6 flex flex-col relative overflow-hidden text-white">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Trophy className="w-32 h-32" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/30">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-blue-200 font-medium text-sm mb-1 relative z-10">موظف الشهر</h3>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white text-[#003366] font-bold flex items-center justify-center text-lg">
                {kpis.top_clerk?.initials || '-'}
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white truncate" title={kpis.top_clerk?.name}>
                {kpis.top_clerk?.name || 'لا يوجد بيانات'}
              </p>
            </div>
          </div>
        </div>

        {/* --- Middle Section - Monthly Evolution Charts --- */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:w-[60%] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#003366]">تطور التحصيل الشهري</h2>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#003366]"></span>
                  <span className="text-gray-600">عدد الملفات</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#D4AF37]"></span>
                  <span className="text-gray-600">المبالغ (د.م)</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[300px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Bar yAxisId="left" dataKey="files" fill="#003366" radius={[4, 4, 0, 0]} barSize={20} name="عدد الملفات" />
                  <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#D4AF37" strokeWidth={3} dot={{ r: 4, fill: '#D4AF37', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="المبالغ المستخلصة" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:w-[40%] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#003366]">تطور التبليغ الشهري</h2>
            </div>
            <div className="flex-1 min-h-[300px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Line type="monotone" dataKey="notifications" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="عدد التبليغات" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- Middle-Lower Section - Productivity (Doughnut Chart) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-lg font-bold text-[#003366]">مردودية الموظفين مقارنة بالمعدل العام</h2>
            <select 
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#003366] focus:border-[#003366] block px-4 py-2.5 outline-none font-bold cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="notifications">عدد الملفات المبلغة</option>
              <option value="collections">عدد الملفات المحصلة</option>
              <option value="amounts">المبالغ المحصلة</option>
            </select>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 h-[350px]">
            <div className="w-full md:w-1/3 flex flex-col gap-3">
              {currentChartData.data.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.fill }}></span>
                    <span className="font-bold text-gray-700">{entry.name}</span>
                  </div>
                  <span className="font-black text-gray-900">
                    {entry.value.toLocaleString('fr-FR')} <span className="text-xs text-gray-500 font-normal">{currentChartData.unit}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="w-full md:w-1/2 flex justify-center relative h-full min-h-[300px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentChartData.data}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {currentChartData.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString('fr-FR')} ${currentChartData.unit}`, 'الإنتاج']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', direction: 'rtl' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" dir="rtl">
                <span className="text-xs text-gray-500 font-bold mb-1 tracking-wide">المعدل العام للفريق</span>
                <span className="text-3xl font-black text-[#003366]">{currentChartData.average.toLocaleString('fr-FR')}</span>
                <span className="text-sm text-gray-400 mt-1 font-medium">{currentChartData.unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Section - Detailed Clerk Performance Table --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <h2 className="text-lg font-bold text-[#003366]">الإنتاجية الشهرية التفصيلية لكل موظف</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>تصدير التقرير</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#f8fafc] text-gray-600 font-bold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">اسم الموظف</th>
                  <th className="px-6 py-4 whitespace-nowrap">عدد التبليغات</th>
                  <th className="px-6 py-4 whitespace-nowrap">عدد التنفيذات</th>
                  <th className="px-6 py-4 whitespace-nowrap">المبالغ المستخلصة</th>
                  <th className="px-6 py-4 whitespace-nowrap">عدد طلبات الإكراه</th>
                  <th className="px-6 py-4 whitespace-nowrap">عدد المحاضر</th>
                  <th className="px-6 py-4 whitespace-nowrap">عدد الإلغاءات</th>
                  <th className="px-6 py-4 whitespace-nowrap">إجراء يوجه</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clerksData.map((clerk) => (
                  <tr key={clerk.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${clerk.color}`}>
                          {clerk.initials}
                        </div>
                        <span className="font-bold text-gray-900">{clerk.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs">
                        {clerk.notifications}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs">
                        {clerk.executions}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-black text-[#003366] inline-block" dir="ltr">{clerk.amount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-bold text-xs">
                        {clerk.coercion}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-bold">
                      {clerk.reports}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-red-50 text-red-700 font-bold text-xs">
                        {clerk.cancellations}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">
                      {clerk.directed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}