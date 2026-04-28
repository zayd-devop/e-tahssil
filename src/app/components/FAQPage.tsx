import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Scale, Mail, ShieldAlert, BookOpen, ArrowLeft } from 'lucide-react';

interface FAQPageProps {
  onBack: () => void;
}

export function FAQPage({ onBack }: FAQPageProps) {
  const language = 'ar';
  const isRTL = true;
  
  const translations = {
    ar: {
      pageTitle: 'دليل الإجراءات القانونية: شعبة التبليغ والتنفيذ والتحصيل',
      pageSubtitle: 'مرجع شامل للإجابة على التساؤلات القانونية والمسطرية الشائعة في مجال التبليغ الزجري، تحصيل الغرامات، وقواعد التقادم وفق القوانين المغربية.',
      backHome: 'العودة للرئيسية',
      categories: [
        {
          title: 'التبليغ القضائي (Notification)',
          icon: <Mail className="w-6 h-6" />,
          questions: [
            {
              q: 'ما هي الآجال القانونية لتبليغ الأحكام الزجرية؟',
              a: 'يتم التبليغ وفق قانون المسطرة الجنائية، ويجب مراعاة آجال الطعن المرتبطة به.'
            },
            {
              q: 'ماذا يحدث في حالة تعذر التبليغ لعدم العثور على العنوان؟',
              a: 'يتم اللجوء إلى إجراءات القيم أو تبليغ النيابة العامة وفق المقتضيات القانونية.'
            }
          ]
        },
        {
          title: 'التنفيذ الزجري والتحصيل (Execution & Recovery)',
          icon: <Scale className="w-6 h-6" />,
          questions: [
            {
              q: 'ما هو الفرق بين التحصيل الحبي والتحصيل الجبري؟',
              a: 'التحصيل الحبي يتم بناءً على إشعار بالأداء، بينما الجبري يتضمن إجراءات الحجز أو الإكراه البدني.'
            },
            {
              q: 'متى يتم تفعيل إجراء الإكراه البدني؟',
              a: 'في حالة عدم الأداء بعد استنفاد كافة طرق التنفيذ على الأموال، ووفق الشروط المنصوص عليها في مدونة تحصيل الديون العمومية.'
            }
          ]
        },
        {
          title: 'التقادم (Prescription)',
          icon: <ShieldAlert className="w-6 h-6" />,
          questions: [
            {
              q: 'ما هي مدة تقادم الغرامات في المادة الزجرية؟',
              a: 'تتقادم العقوبات المالية بمرور 15 سنة في الجنايات، 4 سنوات في الجنح، وسنة واحدة في المخالفات.'
            }
          ]
        }
      ]
    },
    fr: {
      pageTitle: 'Guide des Procédures Légales: Notification, Exécution et Recouvrement',
      pageSubtitle: 'Référence complète pour répondre aux questions légales et procédurales courantes concernant les notifications pénales, le recouvrement des amendes et les règles de prescription.',
      backHome: 'Retour à l\'accueil',
      categories: [
        {
          title: 'Notification Judiciaire (التبليغ القضائي)',
          icon: <Mail className="w-6 h-6" />,
          questions: [
            {
              q: 'Quels sont les délais légaux pour la notification des jugements pénaux ?',
              a: 'La notification s\'effectue selon le code de procédure pénale, en tenant compte des délais d\'appel qui y sont liés.'
            },
            {
              q: 'Que se passe-t-il si la notification échoue pour cause d\'adresse introuvable ?',
              a: 'On recourt aux procédures de curateur ou de notification au Ministère Public selon les dispositions légales.'
            }
          ]
        },
        {
          title: 'Exécution Pénale et Recouvrement (التنفيذ الزجري والتحصيل)',
          icon: <Scale className="w-6 h-6" />,
          questions: [
            {
              q: 'Quelle est la différence entre le recouvrement à l\'amiable et forcé ?',
              a: 'Le recouvrement à l\'amiable se fait sur la base d\'un avis de paiement, tandis que le recouvrement forcé inclut des procédures de saisie ou de contrainte par corps.'
            },
            {
              q: 'Quand la procédure de contrainte par corps est-elle activée ?',
              a: 'En cas de non-paiement après l\'épuisement de toutes les voies d\'exécution sur les biens, et selon les conditions prévues par le code de recouvrement des créances publiques.'
            }
          ]
        },
        {
          title: 'Prescription (التقادم)',
          icon: <ShieldAlert className="w-6 h-6" />,
          questions: [
            {
              q: 'Quel est le délai de prescription des amendes en matière pénale ?',
              a: 'Les peines pécuniaires se prescrivent par 15 ans pour les crimes, 4 ans pour les délits, et 1 an pour les contraventions.'
            }
          ]
        }
      ]
    }
  };

  const t = translations[language];
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (catIndex: number, qIndex: number) => {
    const key = `${catIndex}-${qIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h1 className="text-xl font-bold text-[#003366]">e-Tahssil</h1>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-[#003366] font-medium hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t.backHome}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#003366] mb-6 leading-snug">
            {t.pageTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {t.pageSubtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-10">
          {t.categories.map((cat, catIdx) => (
            <div key={catIdx} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="bg-[#003366]/5 px-6 py-5 border-b border-[#003366]/10 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200 text-[#003366]">
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#003366]">{cat.title}</h3>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-100">
                {cat.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = openItems[key];
                  
                  return (
                    <div key={qIdx} className="group">
                      {/* Accordion Button */}
                      <button
                        onClick={() => toggleItem(catIdx, qIdx)}
                        className={`w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                      >
                        <span className={`text-lg font-bold transition-colors ${isRTL ? 'pl-4' : 'pr-4'} ${isOpen ? 'text-[#003366]' : 'text-gray-900 group-hover:text-[#003366]'}`}>
                          {item.q}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#003366] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#003366]/10 group-hover:text-[#003366]'}`}>
                          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>
                      
                      {/* Accordion Content */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-6 pb-6 pt-2">
                          <div className={`bg-[#003366]/5 p-5 ${isRTL ? 'border-r-4 rounded-l-lg' : 'border-l-4 rounded-r-lg'} border-[#D4AF37]`}>
                            <p className="text-gray-700 leading-relaxed font-medium text-base">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
