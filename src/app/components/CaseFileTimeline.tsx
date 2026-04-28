import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  CircleDashed, 
  Clock, 
  FileText, 
  Download, 
  User, 
  Calendar,
  Activity,
  Plus
} from 'lucide-react';

interface CaseFileTimelineProps {
  file?: any;
}

export function CaseFileTimeline({ file }: CaseFileTimelineProps) {
  const language = 'ar';
  const isRTL = true;
  
  // Translatable texts
  const t = {
    title: isRTL ? 'مسار الملف والإجراءات' : 'Chronologie et actions du dossier',
    fileNumber: isRTL ? `ملف رقم: ${file?.ref || '2024/7101/450'}` : `Dossier N°: ${file?.ref || '2024/7101/450'}`,
    phase1: isRTL ? 'التبليغ' : 'Notification',
    phase2: isRTL ? 'التحصيل الرضائي' : 'Recouvrement Amiable',
    phase3: isRTL ? 'التحصيل الجبري' : 'Recouvrement Forcé',
    phase4: isRTL ? 'التدبير المحاسباتي' : 'Gestion Comptable',
    statusCompleted: isRTL ? 'مكتمل' : 'Terminé',
    statusSkipped: isRTL ? 'متجاوز / إنذار' : 'Ignoré / Avertissement',
    statusActive: isRTL ? 'قيد الإنجاز' : 'En cours',
    statusPending: isRTL ? 'في الانتظار' : 'En attente',
    newAction: isRTL ? 'إضافة إجراء جديد' : 'Nouvelle Procédure',
    selectAction: isRTL ? 'اختر الإجراء...' : 'Sélectionnez une procédure...',
    groupForce: isRTL ? 'التحصيل الجبري (FP3)' : 'Forcé (FP3)',
    actionP01: isRTL ? 'P01: الإنذار' : 'P01: Mise en demeure',
    actionP07: isRTL ? 'P07: تثبيت العربات' : 'P07: Immobilisation de véhicules',
    historyTitle: isRTL ? 'سجل الإجراءات السابقة' : 'Historique des actions',
    generateDoc: isRTL ? 'استخراج المطبوع' : 'Générer le document (PDF)',
    addActionBtn: isRTL ? 'تسجيل الإجراء' : 'Enregistrer la procédure',
    clerk: isRTL ? 'المأمور' : 'Greffier',
    actionType: isRTL ? 'نوع الإجراء' : 'Type de procédure',
    notes: isRTL ? 'ملاحظات إضافية' : 'Observations supplémentaires',
    notesPlaceholder: isRTL ? 'أدخل ملاحظاتك هنا...' : 'Saisissez vos observations ici...',
    timelineTitle: isRTL ? 'المسار القانوني' : 'Parcours Légal',
  };

  const inputClassName = "w-full p-3.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-gray-50 transition-all outline-none text-[#003366] placeholder-gray-500";

  return (
    <div className={`w-full bg-white rounded-xl ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Timeline Column */}
        <div className="lg:col-span-4">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-[#003366] mb-8 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              {t.timelineTitle}
            </h3>
            
            <div className="relative">
              {/* Vertical Line Connecting the nodes */}
              <div className={`absolute top-4 bottom-8 w-0.5 bg-gray-200 ${isRTL ? 'right-[19px]' : 'left-[19px]'}`}></div>
              
              <div className="space-y-8 relative">
                
                {/* Phase 1 - Completed */}
                <div className="flex gap-4">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="pt-2 flex-1">
                    <h4 className="font-bold text-gray-900 text-base">{t.phase1}</h4>
                    <p className="text-sm text-green-600 font-medium mt-1">{t.statusCompleted}</p>
                    <p className="text-xs text-gray-400 mt-1">12 Oct 2025</p>
                  </div>
                </div>

                {/* Phase 2 - Warning/Skipped */}
                <div className="flex gap-4">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="pt-2 flex-1">
                    <h4 className="font-bold text-gray-900 text-base">{t.phase2}</h4>
                    <p className="text-sm text-amber-600 font-medium mt-1">{t.statusSkipped}</p>
                    <p className="text-xs text-gray-400 mt-1">15 Nov 2025</p>
                  </div>
                </div>

                {/* Phase 3 - Active */}
                <div className="flex gap-4">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-[#003366]/5 border-2 border-[#003366] flex items-center justify-center shrink-0 shadow-[0_0_0_4px_rgba(212,175,55,0.2)]">
                    <Activity className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="pt-2 flex-1">
                    <h4 className="font-bold text-[#003366] text-base">{t.phase3}</h4>
                    <p className="text-sm text-[#D4AF37] font-bold mt-1">{t.statusActive}</p>
                    <p className="text-xs text-[#003366]/70 mt-1">Depuis 01 Dec 2025</p>
                  </div>
                </div>

                {/* Phase 4 - Pending */}
                <div className="flex gap-4">
                  <div className="relative z-10 w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-300 flex items-center justify-center shrink-0">
                    <CircleDashed className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="pt-2 flex-1 opacity-60">
                    <h4 className="font-bold text-gray-500 text-base">{t.phase4}</h4>
                    <p className="text-sm text-gray-400 font-medium mt-1">{t.statusPending}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Action Logging Panel Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* New Action Panel */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#003366] mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D4AF37]" />
              {t.newAction}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#003366] mb-2">{t.actionType}</label>
                <select className={inputClassName} defaultValue="">
                  <option value="" disabled>{t.selectAction}</option>
                  <optgroup label={t.groupForce} className="font-bold text-gray-900 bg-gray-100">
                    <option value="p01" className="font-normal text-[#003366] bg-white">{t.actionP01}</option>
                    <option value="p07" className="font-normal text-[#003366] bg-white">{t.actionP07}</option>
                    <option value="p04" className="font-normal text-[#003366] bg-white">{isRTL ? 'P04: حجز المنقولات' : 'P04: Saisie des biens'}</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#003366] mb-2">{t.notes}</label>
                <textarea 
                  className={`${inputClassName} min-h-[80px] resize-y`}
                  placeholder={t.notesPlaceholder}
                />
              </div>

              <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} pt-2`}>
                <button className="bg-[#003366] hover:bg-[#002244] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  {t.addActionBtn}
                </button>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#003366] mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D4AF37]" />
              {t.historyTitle}
            </h3>

            <div className="space-y-3">
              
              {/* History Item 1 */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#D4AF37]/50 transition-colors shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#003366]/10 text-[#003366] font-mono text-xs px-2.5 py-1 rounded font-bold border border-[#003366]/20">FP3-P04</span>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        {isRTL ? 'حجز المنقولات' : 'Saisie des biens'}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> 10 Jan 2026</span>
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#D4AF37]" /> {t.clerk}: Ahmed L.</span>
                    </div>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'sm:justify-end' : 'sm:justify-start'}`}>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#003366] bg-white border border-[#003366]/30 rounded-lg hover:bg-[#003366] hover:text-white transition-all shadow-sm">
                      <Download className="w-4 h-4" />
                      {t.generateDoc}
                    </button>
                  </div>
                </div>
              </div>

              {/* History Item 2 */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#D4AF37]/50 transition-colors shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#003366]/10 text-[#003366] font-mono text-xs px-2.5 py-1 rounded font-bold border border-[#003366]/20">FP3-P01</span>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">
                        {isRTL ? 'الإنذار' : 'Mise en demeure'}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> 05 Dec 2025</span>
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[#D4AF37]" /> {t.clerk}: Ahmed L.</span>
                    </div>
                  </div>
                  <div className={`flex items-center ${isRTL ? 'sm:justify-end' : 'sm:justify-start'}`}>
                    <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#003366] bg-white border border-[#003366]/30 rounded-lg hover:bg-[#003366] hover:text-white transition-all shadow-sm">
                      <Download className="w-4 h-4" />
                      {t.generateDoc}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
