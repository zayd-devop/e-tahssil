import React, { useState } from 'react';
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

// --- MOCK DATA ---
const monthlyData = [
  { name: 'يناير', files: 120, amount: 45000, notifications: 300 },
  { name: 'فبراير', files: 140, amount: 52000, notifications: 320 },
  { name: 'مارس', files: 180, amount: 65000, notifications: 410 },
  { name: 'أبريل', files: 160, amount: 58000, notifications: 380 },
  { name: 'ماي', files: 210, amount: 75000, notifications: 450 },
  { name: 'يونيو', files: 190, amount: 69000, notifications: 420 },
  { name: 'يوليوز', files: 230, amount: 82000, notifications: 480 },
  { name: 'غشت', files: 150, amount: 55000, notifications: 350 },
  { name: 'شتنبر', files: 200, amount: 71000, notifications: 440 },
  { name: 'أكتوبر', files: 250, amount: 90000, notifications: 520 },
  { name: 'نونبر', files: 220, amount: 79000, notifications: 460 },
  { name: 'دجنبر', files: 270, amount: 95000, notifications: 550 },
];

// Données dynamiques pour le filtre du Doughnut Chart
const productivityDataSets = {
  notifications: {
    data: [
      { name: 'أحمد بناني', value: 150, fill: '#003366' },
      { name: 'فاطمة الزهراء', value: 135, fill: '#D4AF37' },
      { name: 'سميرة العمراني', value: 115, fill: '#10b981' },
      { name: 'يوسف الشرايبي', value: 110, fill: '#3b82f6' },
      { name: 'حسن الكتاني', value: 90, fill: '#64748b' },
    ],
    average: 120,
    unit: 'ملف'
  },
  collections: {
    data: [
      { name: 'أحمد بناني', value: 85, fill: '#003366' },
      { name: 'فاطمة الزهراء', value: 72, fill: '#D4AF37' },
      { name: 'سميرة العمراني', value: 60, fill: '#10b981' },
      { name: 'يوسف الشرايبي', value: 55, fill: '#3b82f6' },
      { name: 'حسن الكتاني', value: 40, fill: '#64748b' },
    ],
    average: 62,
    unit: 'ملف'
  },
  amounts: {
    data: [
      { name: 'أحمد بناني', value: 45000, fill: '#003366' },
      { name: 'فاطمة الزهراء', value: 38500, fill: '#D4AF37' },
      { name: 'سميرة العمراني', value: 31200, fill: '#10b981' },
      { name: 'يوسف الشرايبي', value: 29000, fill: '#3b82f6' },
      { name: 'حسن الكتاني', value: 18000, fill: '#64748b' },
    ],
    average: 32340,
    unit: 'د.م'
  }
};

const clerksData = [
  { 
    id: 1, 
    name: 'أحمد بناني', 
    initials: 'أ.ب',
    color: 'bg-blue-100 text-blue-700',
    notifications: 150, 
    executions: 85, 
    amount: '45,000 د.م', 
    coercion: 12, 
    reports: 45, 
    cancellations: 3, 
    directed: 25 
  },
  { 
    id: 2, 
    name: 'فاطمة الزهراء العلوي', 
    initials: 'ف.ع',
    color: 'bg-emerald-100 text-emerald-700',
    notifications: 135, 
    executions: 72, 
    amount: '38,500 د.م', 
    coercion: 8, 
    reports: 38, 
    cancellations: 1, 
    directed: 18 
  },
  { 
    id: 3, 
    name: 'يوسف الشرايبي', 
    initials: 'ي.ش',
    color: 'bg-amber-100 text-amber-700',
    notifications: 110, 
    executions: 55, 
    amount: '29,000 د.م', 
    coercion: 15, 
    reports: 28, 
    cancellations: 5, 
    directed: 30 
  },
  { 
    id: 4, 
    name: 'سميرة العمراني', 
    initials: 'س.ع',
    color: 'bg-purple-100 text-purple-700',
    notifications: 115, 
    executions: 60, 
    amount: '31,200 د.م', 
    coercion: 10, 
    reports: 32, 
    cancellations: 2, 
    directed: 22 
  },
];

export function KPICards() {
  // State pour gérer le filtre sélectionné
  const [activeFilter, setActiveFilter] = useState('notifications');
  
  // Données actives en fonction du filtre
  const currentChartData = productivityDataSets[activeFilter];

  return (
    <div className="bg-[#F9FAFB] min-h-full font-sans flex flex-col" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6 pt-2 w-full flex-1 pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-2">
          <div>
            <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">لوحة القيادة</h1>
            <p className="text-gray-500 mt-1 font-medium">نظرة عامة على الأداء والإنتاجية لشهر ماي</p>
          </div>
        </div>

        {/* 1. Top Section - Quick Monthly KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#003366]"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#003366]">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+14%</span>
              </div>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">إجمالي المبالغ المستخلصة</h3>
            <p className="text-3xl font-black text-[#003366]">836,000 <span className="text-lg text-gray-400 font-bold">د.م</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-[#D4AF37]"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-[#D4AF37]">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-sm font-bold">
                <ArrowUpRight className="w-4 h-4" />
                <span>+8%</span>
              </div>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">عدد الملفات المحصلة</h3>
            <p className="text-3xl font-black text-gray-800">2,320</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Send className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-red-500 bg-red-50 px-2 py-1 rounded-md text-sm font-bold">
                <ArrowDownRight className="w-4 h-4" />
                <span>-2%</span>
              </div>
            </div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">عدد الملفات المبلغة</h3>
            <p className="text-3xl font-black text-gray-800">5,080</p>
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
            <h3 className="text-blue-200 font-medium text-sm mb-1 relative z-10">موظف الشهر (ماي)</h3>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white text-[#003366] font-bold flex items-center justify-center text-lg">
                أ.ب
              </div>
              <p className="text-2xl font-bold text-white">أحمد بناني</p>
            </div>
          </div>
        </div>

        {/* 2. Middle Section - Monthly Evolution Charts */}
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

        {/* 3. Middle-Lower Section - Productivity (Doughnut Chart avec Filtre) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-lg font-bold text-[#003366]">مردودية الموظفين مقارنة بالمعدل العام</h2>
            
            {/* Le Filtre Interactif */}
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
            {/* Legend (Dynamique) */}
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

            {/* Doughnut Chart Container */}
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
              
              {/* Center Text Container (Moyenne Dynamique) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" dir="rtl">
                <span className="text-xs text-gray-500 font-bold mb-1 tracking-wide">المعدل العام للفريق</span>
                <span className="text-3xl font-black text-[#003366]">{currentChartData.average.toLocaleString('fr-FR')}</span>
                <span className="text-sm text-gray-400 mt-1 font-medium">{currentChartData.unit}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Section - Detailed Clerk Performance Table */}
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
                      <span className="font-black text-[#003366]">{clerk.amount}</span>
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