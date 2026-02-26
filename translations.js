// ============================================
//  Plus Dev — Translation System v1.0
//  نظام الترجمة ثنائي اللغة (عربي / إنجليزي)
// ============================================

const TRANSLATIONS = {
  ar: {
    // Navbar
    nav_home:       "الرئيسية",
    nav_rules:      "القوانين",
    nav_tutorials:  "الشروحات",
    nav_jobs:       "التوظيف",
    nav_store:      "المتجر",
    nav_discord:    "انضم للديسكورد",
    nav_login:      "تسجيل الدخول",

    // User Dropdown
    track:          "تتبع طلبك",
    ticket:         "فتح تذكرة دعم",
    admin:          "لوحة الإدارة",
    logout:         "تسجيل الخروج",
    lang_toggle:    "English",
    lang_flag:      "🇬🇧",

    // Hero Section
    hero_live:      "السيرفر شغّال الآن",
    hero_desc:      "سيرفر FiveM احترافي متخصص — سكربتات، شروحات، وتجربة لعب لا مثيل لها",
    hero_store:     "تصفح المتجر",
    hero_jobs:      "قدّم على وظيفة",
    hero_discord:   "انضم للديسكورد",
    hero_scroll:    "انزل للأسفل",

    // Stats Bar
    stat_players:   "أقصى عدد لاعبين",
    stat_members:   "عضو في الديسكورد",
    stat_scripts:   "سكربت مخصص",
    stat_uptime:    "وقت التشغيل",

    // Features
    feat_scripts:   "سكربتات احترافية",
    feat_scripts_d: "أكثر من 50 سكربت مثبّت ومطوّر خصيصاً لضمان أفضل تجربة لعب ممكنة",
    feat_admins:    "أدمنز متخصصون",
    feat_admins_d:  "فريق إدارة متوفر على مدار الساعة للحفاظ على بيئة لعب عادلة ونظيفة",
    feat_community: "مجتمع نشط",
    feat_community_d: "انضم لمجتمع ودود من آلاف اللاعبين وابنِ صداقات حقيقية داخل العالم الافتراضي",
    feat_updates:   "تحديثات مستمرة",
    feat_updates_d: "محتوى جديد وتحسينات أسبوعية لضمان تجربة طازجة ومثيرة في كل مرة تلعب",
    feat_rp:        "رول بلاي عالي الجودة",
    feat_rp_d:      "قوانين مدروسة ولاعبون ملتزمون يضمنون مستوى رول بلاي سينمائي حقيقي",
    feat_support:   "دعم فني سريع",
    feat_support_d: "فريق الدعم متاح دائماً للإجابة على أسئلتك وحل مشاكلك بأسرع وقت ممكن",

    // Social
    social_title:   "منصات التواصل",
    social_desc:    "مجتمعنا يمتلك حضورًا قويًا على منصات التواصل الاجتماعي",

    // About
    about_desc1:    "نحن سيرفر FiveM متخصص CFW، ونسعى لإسعاد اللاعبين وخدمتهم في جميع مشاكلهم.",
    about_desc2:    "القوانين تهدف إلى تنظيم السيرفر واحترام الدستور.",

    // Updates/Changelog
    upd_store:      "إضافة المتجر",
    upd_store_d:    "إضافة متجر خاص في السيرفر تم إضافة جميع المنتجات مع نظام شراء متكامل.",
    upd_players:    "زيادة عدد اللاعبين",
    upd_players_d:  "تم رفع الطاقة الاستيعابية إلى 128 لاعب لتجربة لعب أفضل للجميع.",
    upd_admin:      "تعديل الإدارة",
    upd_admin_d:    "تم تعديل وتجديد الإدارة القديمة وتحسينها للأفضل لخدمة المجتمع.",

    // FAQ
    faq_title:      "الأسئلة الشائعة",
    faq_desc:       "إجابات سريعة لأكثر الاستفسارات تكراراً داخل السيرفر",
    faq_q1:         "كيف أحصل على وظيفة؟",
    faq_a1:         "توجه إلى City Hall ثم مركز التوظيف واختر الوظيفة المناسبة.",
    faq_q2:         "ماذا أفعل إذا تعرضت لسرقة؟",
    faq_a2:         "اتصل بالشرطة فوراً أو توجه لأقرب مركز شرطة لتقديم بلاغ.",
    faq_q3:         "كيف أشتري سيارة؟",
    faq_a3:         "اذهب لمعرض السيارات، تأكد أن عندك المبلغ الكافي ورخصة قيادة.",

    // Footer
    footer_live:    "السيرفر شغّال الآن",
    footer_rights:  "جميع الحقوق محفوظة",

    // Notifications
    notif_title:    "الإشعارات",
    notif_clear:    "مسح الكل",
    notif_empty:    "لا يوجد إشعارات",

    // Tracking
    trk_title:      "تتبع طلبك",
    trk_sub:        "ابقَ على اطلاع بحالة طلبك ووظيفتك وتذاكرك لحظةً بلحظة",
    trk_apps:       "طلباتي",
    trk_tickets:    "تذاكري",
    trk_orders:     "طلبات المتجر",
    trk_tab_jobs:   "طلبات التوظيف",
    trk_tab_tickets:"تذاكر الدعم",
    trk_tab_orders: "طلبات المتجر",
    trk_no_app:     "لا يوجد طلب مقدّم",
    trk_no_app_d:   "لم تقدّم أي طلب توظيف حتى الآن. توجه لصفحة الوظائف وابدأ رحلتك!",
    trk_browse:     "تصفح الوظائف",

    // Jobs
    jobs_police:    "الشرطة",
    jobs_ems:       "الإسعاف",
    jobs_staff:     "الإدارة",
    jobs_gang:      "العصابات (الكل)",

    // Rules
    rules_title:    "قوانين السيرفر",
    rules_desc:     "يرجى قراءة جميع القوانين والالتزام بها",
    rules_search:   "ابحث في القوانين...",

    // Chat Bot
    chat_title:     "مساعد اسم السيرفر الذكي",
    chat_status:    "متصل ويجاوب 24/7",
    chat_placeholder: "اسأل عن قانون أو موضوع...",
    chat_send:      "إرسال",
  },

  en: {
    // Navbar
    nav_home:       "Home",
    nav_rules:      "Rules",
    nav_tutorials:  "Explanations",
    nav_jobs:       "Apply Jobs",
    nav_store:      "Store",
    nav_discord:    "Join Discord",
    nav_login:      "Log In",

    // User Dropdown
    track:          "Track Your Request",
    ticket:         "Open Support Ticket",
    admin:          "Admin Dashboard",
    logout:         "Log Out",
    lang_toggle:    "العربية",
    lang_flag:      "🇸🇦",

    // Hero Section
    hero_live:      "Server is Live Now",
    hero_desc:      "Professional FiveM server — custom scripts, tutorials, and an unmatched roleplay experience",
    hero_store:     "Browse Store",
    hero_jobs:      "Apply for a Job",
    hero_discord:   "Join Discord",
    hero_scroll:    "Scroll Down",

    // Stats Bar
    stat_players:   "Max Players",
    stat_members:   "Discord Members",
    stat_scripts:   "Custom Scripts",
    stat_uptime:    "Uptime",

    // Features
    feat_scripts:   "Professional Scripts",
    feat_scripts_d: "Over 50 installed and custom-developed scripts to ensure the best possible gaming experience",
    feat_admins:    "Dedicated Admins",
    feat_admins_d:  "A management team available around the clock to maintain a fair and clean game environment",
    feat_community: "Active Community",
    feat_community_d: "Join a friendly community of thousands of players and build real friendships in the virtual world",
    feat_updates:   "Continuous Updates",
    feat_updates_d: "New content and weekly improvements to ensure a fresh and exciting experience every time you play",
    feat_rp:        "High-Quality Roleplay",
    feat_rp_d:      "Well-thought-out rules and committed players guarantee a truly cinematic roleplay level",
    feat_support:   "Fast Technical Support",
    feat_support_d: "Support team always available to answer your questions and resolve your issues as quickly as possible",

    // Social
    social_title:   "Social Platforms",
    social_desc:    "Our community has a strong presence across social media platforms",

    // About
    about_desc1:    "We are a specialized CFW FiveM server, dedicated to making players happy and serving them with all their issues.",
    about_desc2:    "Rules are designed to organize the server and uphold the community constitution.",

    // Updates/Changelog
    upd_store:      "Store Added",
    upd_store_d:    "A dedicated in-server store was added with all products and a complete purchase system.",
    upd_players:    "Player Capacity Increased",
    upd_players_d:  "Server capacity raised to 128 players for a better gaming experience for everyone.",
    upd_admin:      "Admin Team Updated",
    upd_admin_d:    "The old admin team was restructured and improved for better community service.",

    // FAQ
    faq_title:      "Frequently Asked Questions",
    faq_desc:       "Quick answers to the most common questions inside the server",
    faq_q1:         "How do I get a job?",
    faq_a1:         "Go to City Hall, then the Employment Center and choose the appropriate job.",
    faq_q2:         "What do I do if I get robbed?",
    faq_a2:         "Call the police immediately or head to the nearest police station to file a report.",
    faq_q3:         "How do I buy a car?",
    faq_a3:         "Go to the car dealership, make sure you have enough money and a driver's license.",

    // Footer
    footer_live:    "Server is Live Now",
    footer_rights:  "All Rights Reserved",

    // Notifications
    notif_title:    "Notifications",
    notif_clear:    "Clear All",
    notif_empty:    "No notifications",

    // Tracking
    trk_title:      "Track Your Request",
    trk_sub:        "Stay up to date on your requests, jobs, and tickets in real time",
    trk_apps:       "My Requests",
    trk_tickets:    "My Tickets",
    trk_orders:     "Store Orders",
    trk_tab_jobs:   "Job Applications",
    trk_tab_tickets:"Support Tickets",
    trk_tab_orders: "Store Orders",
    trk_no_app:     "No Application Submitted",
    trk_no_app_d:   "You haven't submitted any job application yet. Head to the Jobs page and start your journey!",
    trk_browse:     "Browse Jobs",

    // Jobs
    jobs_police:    "Police",
    jobs_ems:       "EMS",
    jobs_staff:     "Staff",
    jobs_gang:      "Gangs (All)",

    // Rules
    rules_title:    "Server Rules",
    rules_desc:     "Please read all rules and comply with them",
    rules_search:   "Search rules...",

    // Chat Bot
    chat_title:     "Server AI Assistant",
    chat_status:    "Online & Answering 24/7",
    chat_placeholder: "Ask about a rule or topic...",
    chat_send:      "Send",
  }
};

// ============================================
//  Language Engine
// ============================================

window.currentLang = localStorage.getItem('plusdev_lang') || 'ar';

function t(key) {
  return (TRANSLATIONS[window.currentLang] && TRANSLATIONS[window.currentLang][key])
    ? TRANSLATIONS[window.currentLang][key]
    : (TRANSLATIONS['ar'][key] || key);
}

function applyLanguage(lang) {
  window.currentLang = lang;
  localStorage.setItem('plusdev_lang', lang);

  const isAr = lang === 'ar';

  // اتجاه الصفحة
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);

  // كل العناصر اللي عندها data-t
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    el.textContent = t(key);
  });

  // placeholder لحقول الإدخال
  document.querySelectorAll('[data-t-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-t-placeholder'));
  });

  // زر اللغة
  const lbl = document.getElementById('lang-toggle-label');
  const flg = document.getElementById('lang-toggle-flag');
  if (lbl) lbl.textContent = t('lang_toggle');
  if (flg) flg.textContent = t('lang_flag');

  // Navbar links
  const navLinks = document.querySelectorAll('.nav-links a');
  const navKeys = ['nav_home', 'nav_rules', 'nav_tutorials', 'nav_jobs', 'nav_store'];
  navLinks.forEach((link, i) => {
    if (navKeys[i]) link.textContent = t(navKeys[i]);
  });

  // Discord button in nav
  const discordSpan = document.querySelector('.plus-discord-btn .plus-discord-inner span');
  if (discordSpan) discordSpan.textContent = t('nav_discord');

  // Login button
  const loginP = document.querySelector('.user-profile-btn p');
  if (loginP) loginP.textContent = t('nav_login');

  // User dropdown links (by id)
  const trackBtn = document.getElementById('track-btn');
  if (trackBtn) trackBtn.innerHTML = `<i class="fas fa-search-location"></i> ${t('track')}`;

  const adminBtn = document.getElementById('admin-btn');
  if (adminBtn) adminBtn.innerHTML = `<i class="fas fa-user-shield"></i> ${t('admin')}`;

  // Hero
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    heroBadge.innerHTML = `<span class="hero-badge-dot"></span>${t('hero_live')}<span class="hero-badge-ping"></span>`;
  }

  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) heroDesc.innerHTML = t('hero_desc').replace('لا مثيل لها', '<strong>لا مثيل لها</strong>').replace('unmatched', '<strong>unmatched</strong>');

  const heroBtns = document.querySelectorAll('.hero-btns button');
  const heroBtnKeys = ['hero_store', 'hero_jobs', 'hero_discord'];
  const heroBtnIcons = ['fa-store', 'fa-paper-plane', 'fa-discord'];
  const heroBtnFaPrefix = ['fas', 'fas', 'fab'];
  heroBtns.forEach((btn, i) => {
    if (heroBtnKeys[i]) {
      btn.innerHTML = `<i class="${heroBtnFaPrefix[i]} ${heroBtnIcons[i]}"></i> ${t(heroBtnKeys[i])}`;
    }
  });

  const scrollHint = document.querySelector('.hero-scroll-hint span');
  if (scrollHint) scrollHint.textContent = t('hero_scroll');

  // Notifications
  const notifSpan = document.querySelector('.notif-header span');
  if (notifSpan) notifSpan.textContent = t('notif_title');

  const notifClear = document.querySelector('.notif-clear');
  if (notifClear) notifClear.textContent = t('notif_clear');

  const notifEmpty = document.querySelector('.notif-empty');
  if (notifEmpty) notifEmpty.innerHTML = `<i class="fas fa-bell-slash"></i> ${t('notif_empty')}`;

  // Stats bar labels
  const statLabels = document.querySelectorAll('.stat-bar-lbl');
  const statKeys = ['stat_players', 'stat_members', 'stat_scripts', 'stat_uptime'];
  statLabels.forEach((lbl, i) => { if (statKeys[i]) lbl.textContent = t(statKeys[i]); });

  // Features
  const featTitles = document.querySelectorAll('.feature-card h3, .feat-card h3');
  const featDescs = document.querySelectorAll('.feature-card p, .feat-card p');
  const featTitleKeys = ['feat_scripts','feat_admins','feat_community','feat_updates','feat_rp','feat_support'];
  const featDescKeys  = ['feat_scripts_d','feat_admins_d','feat_community_d','feat_updates_d','feat_rp_d','feat_support_d'];
  featTitles.forEach((el, i) => { if (featTitleKeys[i]) el.textContent = t(featTitleKeys[i]); });
  featDescs.forEach((el, i) => { if (featDescKeys[i]) el.textContent = t(featDescKeys[i]); });

  // Social section
  const socialH2 = document.querySelector('.social-section h2, .social-title');
  if (socialH2) socialH2.textContent = t('social_title');
  const socialP = document.querySelector('.social-section > p, .social-desc');
  if (socialP) socialP.textContent = t('social_desc');

  // FAQ
  const faqH2 = document.querySelector('.faq-section h2, .faq h2');
  if (faqH2) faqH2.textContent = t('faq_title');
  const faqDesc = document.querySelector('.faq-section > p');
  if (faqDesc) faqDesc.textContent = t('faq_desc');

  // Jobs tabs
  const jobsTabs = document.querySelectorAll('.jobs-tab span, .job-tab-label');
  const jobsKeys = ['jobs_police','jobs_ems','jobs_staff','jobs_gang'];
  jobsTabs.forEach((el, i) => { if (jobsKeys[i]) el.textContent = t(jobsKeys[i]); });

  // Chat bot
  const chatTitle = document.querySelector('.header-title');
  if (chatTitle) chatTitle.textContent = t('chat_title');
  const chatStatus = document.querySelector('.header-status');
  if (chatStatus) chatStatus.innerHTML = `<span class="online-dot"></span>${t('chat_status')}`;
  const chatInput = document.getElementById('ai-input');
  if (chatInput) chatInput.placeholder = t('chat_placeholder');
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) sendBtn.textContent = t('chat_send');

  // Tracking page
  const trkTitle = document.querySelector('.laws-hero-title');
  if (trkTitle && trkTitle.textContent.includes('تتبع')) trkTitle.textContent = t('trk_title');

  // Rules search placeholder
  const rulesSearch = document.querySelector('#laws-search, .laws-search-input');
  if (rulesSearch) rulesSearch.placeholder = t('rules_search');

  // Footer
  const footerLive = document.querySelector('.footer-server-status, .footer-live');
  if (footerLive) footerLive.textContent = t('footer_live');

  // Font — اختيار خط مناسب للغة
  document.body.style.fontFamily = isAr
    ? "'Tajawal', 'Cairo', sans-serif"
    : "'Inter', 'Segoe UI', sans-serif";

  console.log(`[PlusDev] Language switched to: ${lang}`);
}

function toggleLanguage() {
  const newLang = window.currentLang === 'ar' ? 'en' : 'ar';
  applyLanguage(newLang);
}

// تطبيق اللغة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(window.currentLang);
});
