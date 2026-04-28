import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Globe, Shield, CheckCircle, TrendingUp, Clock, BarChart3, ArrowRight, LogIn } from 'lucide-react';

interface HomePageProps {
  onNavigateToLogin: () => void;
  onNavigateToFAQ: () => void;
}

export function HomePage({ onNavigateToLogin, onNavigateToFAQ }: HomePageProps) {
  const language = 'ar';
  const isRTL = true;
  const translations = {
    ar: {
      kingdom: 'المملكة المغربية',
      ministry: 'وزارة العدل',
      home: 'الرئيسية',
      about: 'حول النظام',
      faq: 'دليل الإجراءات',
      features: 'المميزات',
      login: 'تسجيل الدخول',
      heroTitle: 'نظام التبليغ والتحصيل القضائي',
      heroSubtitle: 'حل رقمي متكامل لإدارة التبليغات القضائية والتحصيل المالي',
      heroDescription: 'منصة حديثة وآمنة تساعد المحاكم المغربية على تتبع ملفات التبليغ والتحصيل بكفاءة عالية مع تنبيهات ذكية للتقادم',
      getStarted: 'الدخول إلى النظام',
      learnMore: 'معرفة المزيد',
      aboutTitle: 'نظام Juri-Collect',
      aboutDescription: 'نظام شامل يجمع بين التبليغ القضائي والتحصيل المالي في منصة واحدة، مصمم خصيصاً للمحاكم المغربية لتحسين الكفاءة وتقليل التقادم.',
      featuresTitle: 'المميزات الرئيسية',
      feature1Title: 'إدارة ملفات التبليغ',
      feature1Desc: 'تتبع شامل لجميع ملفات التبليغ القضائي مع إشعارات تلقائية',
      feature2Title: 'التحصيل المالي',
      feature2Desc: 'إدارة عمليات التحصيل والحجز مع تقارير مالية دقيقة',
      feature3Title: 'تنبيهات التقادم',
      feature3Desc: 'نظام تنبيه ذكي يحذر من اقتراب مواعيد التقادم',
      feature5Title: 'تقارير وإحصائيات',
      feature5Desc: 'لوحات تحكم تفاعلية مع تحليلات متقدمة',
      statsTitle: 'إنجازات النظام',
      stat1: 'محكمة متصلة',
      stat2: 'ملف نشط',
      stat3: 'مليون درهم محصل',
      stat4: 'كفاءة أعلى',
      ctaTitle: 'جاهز للبدء؟',
      ctaDescription: 'انضم إلى المحاكم التي تستخدم Juri-Collect لتحسين إدارة التبليغ والتصيل',
      ctaButton: 'تسجيل الدخول الآن',
      footer: '© 2026 طورته ياسمين حرودي. نظام لوزارة العدل - المملكة المغربية.',
    },
    fr: {
      kingdom: 'Royaume du Maroc',
      ministry: 'Ministère de la Justice',
      home: 'Accueil',
      about: 'À propos',
      faq: 'Guide des Procédures',
      features: 'Fonctionnalités',
      login: 'Connexion',
      heroTitle: 'Système de Notification et Recouvrement Judiciaire',
      heroSubtitle: 'Solution numérique intégrée pour la gestion des notifications judiciaires et recouvrement financier',
      heroDescription: 'Plateforme moderne et sécurisée aidant les tribunaux marocains à suivre les dossiers de notification et recouvrement avec des alertes intelligentes de prescription',
      getStarted: 'Accéder au système',
      learnMore: 'En savoir plus',
      aboutTitle: 'Système Juri-Collect',
      aboutDescription: 'Un système complet combinant notification judiciaire et recouvrement financier sur une plateforme unique, conçu spécialement pour les tribunaux marocains pour améliorer l\'efficacité et réduire la prescription.',
      featuresTitle: 'Fonctionnalités Principales',
      feature1Title: 'Gestion des Notifications',
      feature1Desc: 'Suivi complet de tous les dossiers de notification avec alertes automatiques',
      feature2Title: 'Recouvrement Financier',
      feature2Desc: 'Gestion des opérations de recouvrement et saisie avec rapports financiers précis',
      feature3Title: 'Alertes Prescription',
      feature3Desc: 'Système d\'alerte intelligent prévenant l\'approche des dates de prescription',
      feature5Title: 'Rapports & Statistiques',
      feature5Desc: 'Tableaux de bord interactifs avec analyses avancées',
      statsTitle: 'Réalisations du Système',
      stat1: 'Tribunaux connectés',
      stat2: 'Dossiers actifs',
      stat3: 'Millions MAD recouvrés',
      stat4: 'Efficacité supérieure',
      ctaTitle: 'Prêt à commencer?',
      ctaDescription: 'Rejoignez les tribunaux utilisant Juri-Collect pour améliorer la gestion notification et recouvrement',
      ctaButton: 'Se connecter maintenant',
      footer: '© 2026 Développé par Yasmine HARROUDI. Système pour le Ministère de la Justice - Royaume du Maroc.',
    },
  };

  const t = translations[language];

  const features = [
    { icon: CheckCircle, title: t.feature1Title, desc: t.feature1Desc },
    { icon: TrendingUp, title: t.feature2Title, desc: t.feature2Desc },
    { icon: Clock, title: t.feature3Title, desc: t.feature3Desc },
    { icon: BarChart3, title: t.feature5Title, desc: t.feature5Desc },
  ];

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <path d="M12 2L2 7V12C2 16.97 6.03 21.5 12 22C17.97 21.5 22 16.97 22 12V7L12 2Z" fill="#D4AF37"/>
                  <path d="M12 7L8 9.5V12.5L12 15L16 12.5V9.5L12 7Z" fill="#003366"/>
                </svg>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h1 className="text-lg font-bold text-[#003366]">Juri-Collect</h1>
                <p className="text-xs text-gray-600">{t.ministry}</p>
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              <button className="text-sm font-medium text-gray-700 hover:text-[#003366] transition-colors">
                {t.home}
              </button>
              <button className="text-sm font-medium text-gray-700 hover:text-[#003366] transition-colors">
                {t.about}
              </button>
              <button 
                onClick={onNavigateToFAQ}
                className="text-sm font-medium text-gray-700 hover:text-[#003366] transition-colors"
              >
                {t.faq}
              </button>
              <button className="text-sm font-medium text-gray-700 hover:text-[#003366] transition-colors">
                {t.features}
              </button>
              <button 
                onClick={onNavigateToLogin}
                className="flex items-center gap-2 px-6 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-colors font-medium"
              >
                <span>{t.login}</span>
                <LogIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF6]">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
            {/* Text Content */}
            <div className={`${isRTL ? 'text-right lg:col-start-2' : 'text-left'}`}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                  <Shield className="w-4 h-4" />
                  <span>{t.kingdom}</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {t.heroSubtitle}
              </p>
              <p className="text-lg text-gray-500 mb-8">
                {t.heroDescription}
              </p>
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={onNavigateToLogin}
                  className="flex items-center gap-2 px-8 py-4 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-all shadow-lg hover:shadow-xl font-medium text-lg"
                >
                  <span>{t.getStarted}</span>
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
                <button className="px-8 py-4 border-2 border-[#003366] text-[#003366] rounded-lg hover:bg-[#003366] hover:text-white transition-all font-medium text-lg">
                  {t.learnMore}
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className={`${isRTL ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-[#003366]/10 rounded-3xl blur-3xl"></div>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <ImageWithFallback
                    src="figma:asset/2b74b2a49837b6e66588ea981091e17432685d05.png"
                    alt="Moroccan Justice Building"
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/30 to-transparent"></div>
                  <div className={`absolute bottom-6 ${isRTL ? 'right-6' : 'left-6'}`}>
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-7 h-7 text-white" />
                        </div>
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <p className="text-2xl font-bold text-[#003366]">450+</p>
                          <p className="text-sm text-gray-600">{isRTL ? 'ملف نشط' : 'Dossiers actifs'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`max-w-3xl mx-auto ${isRTL ? 'text-right' : 'text-center'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.aboutTitle}</h2>
            <p className="text-lg text-gray-600 leading-relaxed font-bold font-normal">
              {t.aboutDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-[#F8F9FA] to-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-4xl font-bold text-gray-900 mb-16 ${isRTL ? 'text-right' : 'text-center'}`}>
            {t.featuresTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#003366]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#003366]" />
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#003366] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={`text-4xl font-bold mb-16 ${isRTL ? 'text-right' : 'text-center'}`}>
            {t.statsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '12', label: t.stat1 },
              { value: '450+', label: t.stat2 },
              { value: '1.2', label: t.stat3 },
              { value: '85%', label: t.stat4 },
            ].map((stat, index) => (
              <div key={index} className={`text-center ${isRTL ? 'text-right' : ''} p-6`}>
                <p className="text-5xl font-bold mb-2 text-[#D4AF37]">{stat.value}</p>
                <p className="text-lg text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#003366] to-[#1A237E]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t.ctaTitle}</h2>
          <p className="text-xl text-blue-100 mb-8">{t.ctaDescription}</p>
          <button 
            onClick={onNavigateToLogin}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4AF37] text-[#003366] rounded-lg hover:bg-[#C5A028] transition-all shadow-xl hover:shadow-2xl font-bold text-lg"
          >
            <span>{t.ctaButton}</span>
            <ArrowRight className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A237E] text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <p className={`text-center text-blue-200 ${isRTL ? 'text-right' : ''}`}>
            {t.footer}
          </p>
        </div>
      </footer>
    </div>
  );
}