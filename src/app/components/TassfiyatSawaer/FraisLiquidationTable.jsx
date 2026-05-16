import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Download, Calendar, Calculator, Loader2, ChevronDown, FileText } from 'lucide-react';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx-js-style';

export function FraisLiquidationTable() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [dbData, setDbData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const availableYears = Array.from({ length: 27 }, (_, i) => (2026 - i).toString());

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const t = {
    pageTitle: 'الإحصاء الشهري لتصفية الصوائر',
    pageSubtitle: 'وحدة حساب وتصفية الصوائر القضائية',
    exportBtn: 'تصدير Excel',
    yearPrefix: 'سنة',
    
    colMois: 'الشهر',
    group1Title: 'عدد الملفات المستخلصة',
    group2Title: 'المبالغ المستخلصة (درهم)',
    
    subColExtraits: 'المختصرات',
    subColTitres: 'السندات',     // 👈 Ajouté pour correspondre à ton image
    subColInjonc: 'الأوامر بالدفع', // 👈 Réorganisé selon ton image
    subColFrais: 'الرسوم التكميلية',
    subColAssist: 'المساعدة القضائية',
    subColTotal: 'المجموع',
    
    totalAnnuel: 'المجموع السنوي',
    
    // Ordre strict des 12 mois
    monthsKeys: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
    months: {
      '01': 'يناير', '02': 'فبراير', '03': 'مارس', '04': 'ابريل', // 'ابريل' sans hamza comme sur l'image
      '05': 'ماي', '06': 'يونيو', '07': 'يوليوز', '08': 'غشت',
      '09': 'شتنبر', '10': 'أكتوبر', '11': 'نونبر', '12': 'دجنبر'
    }
  };

  const fetchStats = async (year) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://10.60.26.80:8000/api/frais-stats?year=${year}`, {
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('فشل في جلب البيانات');

      const rawData = await response.json();
      setDbData(rawData);
      
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'تعذر تحميل إحصائيات هذه السنة.',
        confirmButtonColor: '#003366',
        customClass: { popup: 'rounded-2xl', title: 'font-sans font-bold text-[#003366]' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(selectedYear);
  }, [selectedYear]);

  // 1. Formater les données brutes (Intégration des Titres/السندات)
  const data = useMemo(() => {
    return dbData.map(item => ({
      id: item.month,
      dossiers: {
        extraits: Number(item.extraits_dossiers) || 0,
        titres: Number(item.titres_dossiers) || 0, // 👈 Ajouté
        injonc: Number(item.injonc_dossiers) || 0,
        frais: Number(item.frais_dossiers) || 0,
        assist: Number(item.assist_dossiers) || 0,
      },
      montants: {
        extraits: Number(item.extraits_montant) || 0,
        titres: Number(item.titres_montant) || 0, // 👈 Ajouté
        injonc: Number(item.injonc_montant) || 0,
        frais: Number(item.frais_montant) || 0,
        assist: Number(item.assist_montant) || 0,
      }
    }));
  }, [dbData]);

  // 2. Calculer les totaux globaux et par ligne
  const computedData = useMemo(() => {
    let globalDossiers = { extraits: 0, titres: 0, injonc: 0, frais: 0, assist: 0, total: 0 };
    let globalMontants = { extraits: 0, titres: 0, injonc: 0, frais: 0, assist: 0, total: 0 };

    const rows = data.map(row => {
      // 👈 Ajout de titres dans le total
      const dTotal = row.dossiers.extraits + row.dossiers.titres + row.dossiers.injonc + row.dossiers.frais + row.dossiers.assist;
      const mTotal = row.montants.extraits + row.montants.titres + row.montants.injonc + row.montants.frais + row.montants.assist;

      globalDossiers.extraits += row.dossiers.extraits;
      globalDossiers.titres += row.dossiers.titres;
      globalDossiers.injonc += row.dossiers.injonc;
      globalDossiers.frais += row.dossiers.frais;
      globalDossiers.assist += row.dossiers.assist;
      globalDossiers.total += dTotal;

      globalMontants.extraits += row.montants.extraits;
      globalMontants.titres += row.montants.titres;
      globalMontants.injonc += row.montants.injonc;
      globalMontants.frais += row.montants.frais;
      globalMontants.assist += row.montants.assist;
      globalMontants.total += mTotal;

      return { ...row, dTotal, mTotal };
    });

    return { rows, globalDossiers, globalMontants };
  }, [data]);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
  };

  // 🚀 LA FONCTION D'EXPORTATION EXACTEMENT COMME LA PHOTO
  // 🚀 LA FONCTION D'EXPORTATION AVEC MISE EN FORME ET SANS ZÉROS
  const exportToExcel = () => {
    if (computedData.rows.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'لا توجد بيانات لتصديرها.',
        confirmButtonColor: '#003366'
      });
      return;
    }

    // Helper : Si la valeur est 0, on renvoie une chaîne vide ''
    const valOrEmpty = (val) => (val === 0 || !val) ? '' : val;

    const excelData = [];

    // --- TABLEAU 1 : المبالغ المستخلصة (Montants) ---
    excelData.push(['', 'المبالغ المستخلصة', '', '', '', '', '']); // Ligne 0
    excelData.push(['', t.subColExtraits, t.subColTitres, t.subColInjonc, t.subColFrais, t.subColAssist, t.subColTotal]); // Ligne 1

    t.monthsKeys.forEach(m => {
      const row = computedData.rows.find(r => r.id === m);
      if (row) {
        excelData.push([
          t.months[m], 
          valOrEmpty(row.montants.extraits), valOrEmpty(row.montants.titres), valOrEmpty(row.montants.injonc), 
          valOrEmpty(row.montants.frais), valOrEmpty(row.montants.assist), valOrEmpty(row.mTotal)
        ]);
      } else {
        excelData.push([t.months[m], '', '', '', '', '', '']); // Mois vides = cellules vides
      }
    });

    // Ligne Totaux (Ligne 14)
    excelData.push([
      'المجموع',
      valOrEmpty(computedData.globalMontants.extraits), valOrEmpty(computedData.globalMontants.titres), 
      valOrEmpty(computedData.globalMontants.injonc), valOrEmpty(computedData.globalMontants.frais), 
      valOrEmpty(computedData.globalMontants.assist), valOrEmpty(computedData.globalMontants.total)
    ]);

    // --- ESPACEMENT ---
    excelData.push(['', '', '', '', '', '', '']); // Ligne 15
    excelData.push(['', '', '', '', '', '', '']); // Ligne 16

    // --- TABLEAU 2 : عدد الملفات المستخلصة (Dossiers) ---
    excelData.push(['', 'عدد الملفات المستخلصة', '', '', '', '', '']); // Ligne 17
    excelData.push(['', t.subColExtraits, t.subColTitres, t.subColInjonc, t.subColFrais, t.subColAssist, t.subColTotal]); // Ligne 18

    t.monthsKeys.forEach(m => {
      const row = computedData.rows.find(r => r.id === m);
      if (row) {
        excelData.push([
          t.months[m], 
          valOrEmpty(row.dossiers.extraits), valOrEmpty(row.dossiers.titres), valOrEmpty(row.dossiers.injonc), 
          valOrEmpty(row.dossiers.frais), valOrEmpty(row.dossiers.assist), valOrEmpty(row.dTotal)
        ]);
      } else {
        excelData.push([t.months[m], '', '', '', '', '', '']); // Mois vides = cellules vides
      }
    });

    // Ligne Totaux (Ligne 31)
    excelData.push([
      'المجموع',
      valOrEmpty(computedData.globalDossiers.extraits), valOrEmpty(computedData.globalDossiers.titres), 
      valOrEmpty(computedData.globalDossiers.injonc), valOrEmpty(computedData.globalDossiers.frais), 
      valOrEmpty(computedData.globalDossiers.assist), valOrEmpty(computedData.globalDossiers.total)
    ]);

    // Création de la feuille
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // --- 🎨 MISE EN FORME (STYLING) ---
    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } }, // Texte blanc gras
      fill: { fgColor: { rgb: "003366" } },           // Fond bleu
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    const boldRowStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "F3F4F6" } },           // Fond gris clair pour les totaux
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    const monthColumnStyle = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    const normalStyle = {
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    // Parcourir toutes les cellules pour leur appliquer le bon style
    for (const key in ws) {
      if (key.startsWith('!')) continue; // Ignorer les métadonnées de SheetJS
      
      const cell = ws[key];
      const decoded = XLSX.utils.decode_cell(key);
      const r = decoded.r; // Index de la Ligne (0-based)
      const c = decoded.c; // Index de la Colonne (0-based)
      
      // Lignes vides d'espacement (ne pas mettre de bordures)
      if (r === 15 || r === 16) continue;

      // Appliquer les styles selon la position
      if (r === 0 || r === 1 || r === 17 || r === 18) {
        cell.s = headerStyle; // En-têtes bleus
      } else if (r === 14 || r === 31) {
        cell.s = boldRowStyle; // Lignes des Totaux (Gras + Fond gris)
      } else if (c === 0) {
        cell.s = monthColumnStyle; // Colonne des mois (Gras)
      } else {
        cell.s = normalStyle; // Reste du tableau (Normal avec bordures)
      }
    }

    // Fusions des cellules (Merges)
    ws['!merges'] = [
      { s: { r: 0, c: 1 }, e: { r: 0, c: 6 } },  // Fusion "المبالغ المستخلصة"
      { s: { r: 17, c: 1 }, e: { r: 17, c: 6 } } // Fusion "عدد الملفات المستخلصة"
    ];

    ws['!dir'] = 'rtl'; // Direction de droite à gauche

    ws['!cols'] = [
      { wch: 15 }, // Mois
      { wch: 18 }, // Extraits
      { wch: 18 }, // Titres
      { wch: 18 }, // Injonctions
      { wch: 18 }, // Frais
      { wch: 18 }, // Assistance
      { wch: 20 }  // Total
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `إحصائيات_${selectedYear}`);
    XLSX.writeFile(wb, `تصفية_الصوائر_إحصائيات${selectedYear}.xlsx`);
  };

  return (
    <div className="bg-gray-50/50 font-sans min-h-full" dir="rtl">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#003366] rounded-2xl shadow-lg flex items-center justify-center border-2 border-[#D4AF37]/30">
              <Calculator className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-extrabold text-[#003366] tracking-tight">{t.pageTitle}</h1>
              <p className="text-gray-500 mt-1 font-medium">{t.pageSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => !isLoading && setIsYearDropdownOpen(!isYearDropdownOpen)}
                disabled={isLoading}
                className={`flex items-center justify-between gap-3 bg-white border rounded-xl px-5 py-2.5 min-w-[160px] shadow-sm transition-all focus:outline-none ${
                  isYearDropdownOpen 
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 text-[#003366]' 
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className={`w-5 h-5 ${isYearDropdownOpen ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                  <span className="font-bold text-base">{t.yearPrefix} {selectedYear}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isYearDropdownOpen ? 'rotate-180 text-[#D4AF37]' : 'text-gray-400'}`} />
              </button>

              {isYearDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`w-full text-right px-5 py-3 transition-colors text-sm font-semibold border-b border-gray-50 last:border-none ${
                          selectedYear === year
                            ? 'bg-[#003366] text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#003366]'
                        }`}
                      >
                        {t.yearPrefix} {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={exportToExcel}
              disabled={isLoading} // Le bouton est dispo même si vide pour imprimer la grille
              className="flex items-center gap-2 bg-[#003366] text-white hover:bg-[#002244] px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              <span>{t.exportBtn}</span>
            </button>
          </div>
        </div>

        {/* UI Table Container (Ajusté avec les 6 colonnes + Mois) */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#003366] animate-spin mb-2" />
              <p className="text-[#003366] font-bold">جاري تحميل البيانات...</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right whitespace-nowrap">
              <thead className="bg-[#003366] text-white">
                <tr>
                  <th rowSpan={2} className="px-6 py-4 border-b border-l border-[#004080] font-bold text-center align-middle w-32 bg-[#002244]">
                    {t.colMois}
                  </th>
                  <th colSpan={6} className="px-6 py-3 border-b border-l border-[#004080] font-extrabold text-center text-base tracking-wide bg-[#003366]">
                    {t.group1Title}
                  </th>
                  <th colSpan={6} className="px-6 py-3 border-b border-[#004080] font-extrabold text-center text-base tracking-wide bg-gradient-to-l from-[#003366] to-[#004080]">
                    {t.group2Title}
                  </th>
                </tr>
                <tr className="bg-[#004080]/50 text-xs uppercase tracking-wider">
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColExtraits}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColTitres}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColInjonc}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColFrais}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColAssist}</th>
                  <th className="px-3 py-3 border-b border-l border-gray-400 bg-gray-200 text-[#003366] text-center font-bold">{t.subColTotal}</th>
                  
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColExtraits}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColTitres}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColInjonc}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColFrais}</th>
                  <th className="px-3 py-3 border-b border-l border-[#004080] text-center font-semibold">{t.subColAssist}</th>
                  <th className="px-3 py-3 border-b border-[#D4AF37] bg-[#D4AF37] text-[#003366] text-center font-bold">{t.subColTotal}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {computedData.rows.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={13} className="px-6 py-10 text-center text-gray-500 font-medium bg-gray-50">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileText className="w-8 h-8 text-gray-300" />
                        <span>لا توجد إحصائيات مسجلة لسنة {selectedYear}</span>
                      </div>
                    </td>
                  </tr>
                )}

                {computedData.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-3 font-bold text-[#003366] border-l border-gray-200 bg-gray-50/50 text-center">
                      {t.months[row.id] || row.id}
                    </td>
                    
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100">{row.dossiers.extraits || '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100">{row.dossiers.titres || '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100">{row.dossiers.injonc || '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100">{row.dossiers.frais || '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100">{row.dossiers.assist || '-'}</td>
                    <td className="px-3 py-3 text-center font-bold text-gray-900 bg-gray-100 border-l border-gray-300 shadow-inner">
                      {row.dTotal || '-'}
                    </td>

                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100 font-mono text-xs">{row.montants.extraits ? formatMoney(row.montants.extraits) : '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100 font-mono text-xs">{row.montants.titres ? formatMoney(row.montants.titres) : '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100 font-mono text-xs">{row.montants.injonc ? formatMoney(row.montants.injonc) : '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100 font-mono text-xs">{row.montants.frais ? formatMoney(row.montants.frais) : '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700 border-l border-gray-100 font-mono text-xs">{row.montants.assist ? formatMoney(row.montants.assist) : '-'}</td>
                    <td className="px-3 py-3 text-center font-black text-[#003366] bg-[#D4AF37]/10 border-r border-[#D4AF37]/30 shadow-inner font-mono text-sm">
                      {row.mTotal ? formatMoney(row.mTotal) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#003366] text-white font-bold shadow-lg">
                <tr>
                  <td className="px-6 py-4 border-l border-[#004080] text-center bg-[#002244] text-sm uppercase tracking-wider">
                    {t.totalAnnuel}
                  </td>
                  
                  <td className="px-3 py-4 text-center border-l border-[#004080]">{computedData.globalDossiers.extraits}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080]">{computedData.globalDossiers.titres}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080]">{computedData.globalDossiers.injonc}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080]">{computedData.globalDossiers.frais}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080]">{computedData.globalDossiers.assist}</td>
                  <td className="px-3 py-4 text-center bg-gray-200 text-[#003366] text-base border-l border-gray-400">
                    {computedData.globalDossiers.total}
                  </td>
                  
                  <td className="px-3 py-4 text-center border-l border-[#004080] font-mono text-xs">{formatMoney(computedData.globalMontants.extraits)}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080] font-mono text-xs">{formatMoney(computedData.globalMontants.titres)}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080] font-mono text-xs">{formatMoney(computedData.globalMontants.injonc)}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080] font-mono text-xs">{formatMoney(computedData.globalMontants.frais)}</td>
                  <td className="px-3 py-4 text-center border-l border-[#004080] font-mono text-xs">{formatMoney(computedData.globalMontants.assist)}</td>
                  <td className="px-3 py-4 text-center bg-[#D4AF37] text-[#003366] text-base font-black font-mono shadow-inner">
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