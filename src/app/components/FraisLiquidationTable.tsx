import React, { useState, useMemo } from 'react';
import { Download, Calendar, Calculator, FileSpreadsheet, FileText } from 'lucide-react';

interface FraisLiquidationTableProps {}

export function FraisLiquidationTable({}: FraisLiquidationTableProps = {}) {
  const language = 'ar';
  const isRTL = true;
  const [selectedYear, setSelectedYear] = useState('2026');

  const translations = {
    ar: {
      pageTitle: 'الإحصاء الشهري لتصفية الصوائر',
      pageSubtitle: 'وحدة حساب وتصفية الصوائر القضائية',
      exportBtn: 'تصدير (Excel/PDF)',
      year: 'السنة',
      
      colMois: 'الشهر',
      group1Title: 'عدد الملفات المستخلصة',
      group2Title: 'المبالغ المستخلصة (درهم)',
      
      subColExtraits: 'المختصرات',
      subColFrais: 'الرسوم التكميلية',
      subColAssist: 'المساعدة القضائية',
      subColInjonc: 'الأوامر بالدفع',
      subColTotal: 'المجموع',
      
      totalAnnuel: 'المجموع السنوي',
      
      months: {
        jan: 'يناير',
        feb: 'فبراير',
        mar: 'مارس',
        apr: 'أبريل'
      }
    },
    fr: {
      pageTitle: 'Bilan Mensuel de Liquidation',
      pageSubtitle: 'Module de liquidation des frais et dépens',
      exportBtn: 'Exporter (Excel/PDF)',
      year: 'Année',
      
      colMois: 'Mois',
      group1Title: 'Nombre de dossiers recouvrés',
      group2Title: 'Montants Recouvrés (MAD)',
      
      subColExtraits: 'Extraits',
      subColFrais: 'Frais Suppl.',
      subColAssist: 'Assist. Judiciaire',
      subColInjonc: 'Injonctions',
      subColTotal: 'Total Mensuel',
      
      totalAnnuel: 'TOTAL ANNUEL',
      
      months: {
        jan: 'Janvier',
        feb: 'Février',
        mar: 'Mars',
        apr: 'Avril'
      }
    }
  };

  const t = translations[language];

  // Sample Data
  const data = [
    {
      id: 'jan',
      dossiers: { extraits: 145, frais: 32, assist: 12, injonc: 89 },
      montants: { extraits: 45000.50, frais: 12500.00, assist: 3400.00, injonc: 89000.00 }
    },
    {
      id: 'feb',
      dossiers: { extraits: 120, frais: 45, assist: 8, injonc: 110 },
      montants: { extraits: 38500.00, frais: 18000.75, assist: 2100.00, injonc: 115000.50 }
    },
    {
      id: 'mar',
      dossiers: { extraits: 165, frais: 28, assist: 15, injonc: 95 },
      montants: { extraits: 52000.00, frais: 11200.00, assist: 4500.25, injonc: 92500.00 }
    },
    {
      id: 'apr',
      dossiers: { extraits: 130, frais: 35, assist: 10, injonc: 105 },
      montants: { extraits: 41000.25, frais: 14000.50, assist: 2800.00, injonc: 102000.00 }
    }
  ];

  // Computed totals per row and globally
  const computedData = useMemo(() => {
    let globalDossiers = { extraits: 0, frais: 0, assist: 0, injonc: 0, total: 0 };
    let globalMontants = { extraits: 0, frais: 0, assist: 0, injonc: 0, total: 0 };

    const rows = data.map(row => {
      const dTotal = row.dossiers.extraits + row.dossiers.frais + row.dossiers.assist + row.dossiers.injonc;
      const mTotal = row.montants.extraits + row.montants.frais + row.montants.assist + row.montants.injonc;

      // Accumulate globals
      globalDossiers.extraits += row.dossiers.extraits;
      globalDossiers.frais += row.dossiers.frais;
      globalDossiers.assist += row.dossiers.assist;
      globalDossiers.injonc += row.dossiers.injonc;
      globalDossiers.total += dTotal;

      globalMontants.extraits += row.montants.extraits;
      globalMontants.frais += row.montants.frais;
      globalMontants.assist += row.montants.assist;
      globalMontants.injonc += row.montants.injonc;
      globalMontants.total += mTotal;

      return { ...row, dTotal, mTotal };
    });

    return { rows, globalDossiers, globalMontants };
  }, [data]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'fr-MA').format(num);
  };

  return (
    <div className="bg-gray-50/50 font-sans min-h-full" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
              <Calculator className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">{t.pageTitle}</h1>
              <p className="text-gray-500 mt-1 font-medium">{t.pageSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <Calendar className="w-5 h-5 text-gray-400 mx-2" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-bold text-lg cursor-pointer appearance-none pr-8"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 bg-white border border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white px-4 py-2.5 rounded-lg font-bold transition-colors shadow-sm">
              <Download className="w-5 h-5" />
              <span>{t.exportBtn}</span>
            </button>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap" dir={isRTL ? 'rtl' : 'ltr'}>
              <thead className="bg-[#003366] text-white">
                {/* Super-Headers */}
                <tr>
                  <th rowSpan={2} className="px-6 py-4 border-b border-r border-[#004080] font-bold text-center align-middle w-32 bg-[#002244]">
                    {t.colMois}
                  </th>
                  <th colSpan={5} className="px-6 py-3 border-b border-r border-[#004080] font-extrabold text-center text-base tracking-wide bg-[#003366]">
                    {t.group1Title}
                  </th>
                  <th colSpan={5} className="px-6 py-3 border-b border-[#004080] font-extrabold text-center text-base tracking-wide bg-gradient-to-r from-[#003366] to-[#004080]">
                    {t.group2Title}
                  </th>
                </tr>
                {/* Sub-Headers */}
                <tr className="bg-[#004080]/50 text-xs uppercase tracking-wider">
                  {/* Group 1 Sub-headers */}
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColExtraits}</th>
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColFrais}</th>
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColAssist}</th>
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColInjonc}</th>
                  <th className="px-4 py-3 border-b border-r border-gray-400 bg-gray-200 text-[#003366] text-center font-bold">{t.subColTotal}</th>
                  
                  {/* Group 2 Sub-headers */}
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColExtraits}</th>
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColFrais}</th>
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColAssist}</th>
                  <th className="px-4 py-3 border-b border-r border-[#004080] text-center font-semibold">{t.subColInjonc}</th>
                  <th className="px-4 py-3 border-b border-[#D4AF37] bg-[#D4AF37] text-[#003366] text-center font-bold">{t.subColTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {computedData.rows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#003366] border-r border-gray-200 bg-gray-50/50 text-center">
                      {t.months[row.id as keyof typeof t.months]}
                    </td>
                    
                    {/* Group 1 Data */}
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100">{formatNumber(row.dossiers.extraits)}</td>
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100">{formatNumber(row.dossiers.frais)}</td>
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100">{formatNumber(row.dossiers.assist)}</td>
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100">{formatNumber(row.dossiers.injonc)}</td>
                    <td className="px-4 py-4 text-center font-bold text-gray-900 bg-gray-100 border-r border-gray-300 shadow-inner">
                      {formatNumber(row.dTotal)}
                    </td>

                    {/* Group 2 Data */}
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100 font-mono text-xs sm:text-sm">{formatMoney(row.montants.extraits)}</td>
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100 font-mono text-xs sm:text-sm">{formatMoney(row.montants.frais)}</td>
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100 font-mono text-xs sm:text-sm">{formatMoney(row.montants.assist)}</td>
                    <td className="px-4 py-4 text-center text-gray-700 border-r border-gray-100 font-mono text-xs sm:text-sm">{formatMoney(row.montants.injonc)}</td>
                    <td className="px-4 py-4 text-center font-black text-[#003366] bg-[#D4AF37]/10 border-l border-[#D4AF37]/30 shadow-inner font-mono text-sm">
                      {formatMoney(row.mTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#003366] text-white font-bold shadow-lg">
                <tr>
                  <td className="px-6 py-5 border-r border-[#004080] text-center bg-[#002244] text-base uppercase tracking-wider">
                    {t.totalAnnuel}
                  </td>
                  
                  {/* Total Dossiers */}
                  <td className="px-4 py-5 text-center border-r border-[#004080]">{formatNumber(computedData.globalDossiers.extraits)}</td>
                  <td className="px-4 py-5 text-center border-r border-[#004080]">{formatNumber(computedData.globalDossiers.frais)}</td>
                  <td className="px-4 py-5 text-center border-r border-[#004080]">{formatNumber(computedData.globalDossiers.assist)}</td>
                  <td className="px-4 py-5 text-center border-r border-[#004080]">{formatNumber(computedData.globalDossiers.injonc)}</td>
                  <td className="px-4 py-5 text-center bg-gray-200 text-[#003366] text-lg border-r border-gray-400">
                    {formatNumber(computedData.globalDossiers.total)}
                  </td>
                  
                  {/* Total Montants */}
                  <td className="px-4 py-5 text-center border-r border-[#004080] font-mono text-sm">{formatMoney(computedData.globalMontants.extraits)}</td>
                  <td className="px-4 py-5 text-center border-r border-[#004080] font-mono text-sm">{formatMoney(computedData.globalMontants.frais)}</td>
                  <td className="px-4 py-5 text-center border-r border-[#004080] font-mono text-sm">{formatMoney(computedData.globalMontants.assist)}</td>
                  <td className="px-4 py-5 text-center border-r border-[#004080] font-mono text-sm">{formatMoney(computedData.globalMontants.injonc)}</td>
                  <td className="px-4 py-5 text-center bg-[#D4AF37] text-[#003366] text-lg font-black font-mono shadow-inner">
                    {formatMoney(computedData.globalMontants.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}