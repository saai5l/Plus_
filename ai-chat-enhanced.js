/* ============================================
   Plus Dev - Enhanced AI Chat Bot v2.0
   بوت المساعد الذكي المطور
   ============================================ */

const SERVER_LAWS = [
  "وعليكم السلام حياك الله في المساعد الخاص لي Plus Dev",
  "يجب عليك فهم معنى الرول بلاي والالتزام به.",
  "يمنع التطرق للسياسة والدين والأعراض — باند نهائي.",
  "يمنع تقليد الشخصيات/الأسماء.",
  "يجب اختيار اسم كركتر واقعي.",
  "يمنع دخول نفس الشخص بشخصية ثانية سيناريو قائم.",
  "يمنع دخول المنازل أثناء السيناريو.",
  "يجب تشغيل برنامج تسجيل (يحفظ آخر 20 دقيقة)",
  "يمنع التدخل في أي سيناريو قائم.",
  "يمنع لبس الملابس العسكرية والحزام العسكري.",
  "يمنع التعرض للمسعفين أو سرقة معدات الشرطة.",
  "تمنع الشخصنة نهائيًا.",
  "يمنع Meta Gaming (استخدام معلومات خارج اللعبة).",
  "ممنوع لبس الخوذة أثناء القتال.",
  "يمنع استخدام البرامج الخارجية.",
  "ممنوع تفجير/إهانة الجثث.",
  "ممنوع تغيير الشكل بعد الجريمة.",
  "عند الموت — ممنوع الرجوع للسيناريو.",
  "ممنوع ترابط شخصياتك.",
  "لازم تقمص شخصيتك حتى لو خويك ضدك.",
  "إذا غيرت صوت شخصيتك يجب أن يبقى ثابتًا.",
  "يجب تقدير قيمة المركبة وعدم الصدم بدون سبب.",
  "ممنوع الكذب بالمصطلحات.",
  "ممنوع الكلام المشفر.",
  "القلتشات = باند نهائي.",
  "عند الموت تنسى من قتلك.",
  "ممنوع الستريم سنايب.",
  "الإعصار = رجوعك لمكان السيناريو أو الشرطة.",
  "ممنوع الكلام خارج الرول بلاي.",
  "الالتزام بالذوق العام.",
  "ممنوع الخروج من السيرفر أثناء السيناريو.",
  "ممنوع القتل بدون سبب.",
  "يمنع لبس معدات الغوص خارج البحر.",
  "يمنع حمل اللاعبين داخل المركبات والدبابات.",
  "إذا انفجرت 4 كفرات → توقف المركبة.",
  "ممنوع العلاج بوجود مسعف.",
  "الإجرام قبل الإعصار بـ 15 دقيقة ممنوع.",
  "يجب تقدير الموقف دائمًا.",
  "يمنع دخول بث السيرفر وأنت داخل السيرفر.",
  "يمنع التلفظ بدون سبب.",
  "ممنوع إطلاق النار في منطقة حكومية.",
  "يجب لبس ملابس تناسب الوظيفة.",
  "ممنوع مشاركة حساباتك — باند نهائي.",
  "يمنع التخريم خلف الجدار.",
  "المناطق الآمنة ليست للحماية.",
  "يمنع سرقة الشرطة أو EMS.",
  "القفزات الانتحارية ممنوعة.",
  "التهديد يجب أن يكون مباشر، وإذا انصاع المواطن يمنع قتله.",
  "يجب عليك تقمص الشخصية داخل الرول بلاي — مسعف، محامي، عسكري، عصابة، مواطن.",
  "يجب عليك تقدير الموقف مثل الحياة الواقعية وقيمة حياتك.",
  "VDM: يمنع منعاً باتاً استخدام المركبة كسلاح.",
  "RDM: القتل العشوائي ممنوع تماماً ويجب وجود سبب درامي واضح.",
  "المناطق الآمنة تشمل: مراكز الشرطة، المستشفيات، الشقق العامة، المطاعم والكافيهات، ورش تصليح المركبات، مركز الوظائف، العقار، السجن، المحكمة، حجز المركبات، معارض السيارات، تأجير السيارات، الكازينو، ايكيا.",
  "ممنوع الاتفاق مع شخص ليكون رهينة.",
  "مدة رهن الرهينة 20 دقيقة فقط.",
  "ممنوع المتاجرة بالممنوعات بالمناطق الآمنة.",
  "ممنوع سرقة المواطن بدون عداوة مثبتة.",
  "الحد الأقصى للعائلات: 10 أشخاص.",
  "ممنوع تحالف العصابات ضد الداخلية إلا بالسريقات.",
  "ممنوع خطف رهينة للتفاوض على السجناء.",
  "ممنوع الاعتداء على مفاوض الشرطة/المجرمين.",
  "ممنوع مقاومة سلاح ناري بسلاح أبيض.",
  "ممنوع الخطف/الاعتداء بقضايا المرور.",
  "ممنوع مشاركة الرهينة الخاطفين.",
  "ممنوع تقليد ملابس العصابات.",
  "يمنع الخطف بوجود مدنيين.",
  "ممنوع خطف موظف حكومي.",
  "ممنوع البقاء في موقع السرقة بعد التنفيذ.",
  "ممنوع ايموت الباركور والسلايد.",
  "ممنوع إطلاق النار داخل الهيومن لاب والمترو.",
  "ممنوع طلب مبالغ مالية من الرهينة.",
  "عند إسقاطك يمنع إعطاء كول آوت.",
  "يجب التخطيط قبل السرقة.",
  "الحد الداخل للسيناريو للعصابة: 4 فقط.",
  "افتعال فايت بدون سبب = باند نهائي.",
  "الحد الأعلى للرهائن: 4 فقط.",
  "سرقة البقالة: (1-3 مجرمين) | الوحدات المباشرة: (5).",
  "سرقة المنزل: (1-4 مجرمين) | الوحدات المباشرة: (6).",
  "سرقة منزل عسكري: (2-5 مجرمين) | الوحدات المباشرة: (7).",
  "سرقات تتطلب رهينة (ديجيتال دن، لاندرو مات): (2-5 مجرمين) | الوحدات المباشرة: (7).",
  "سرقة تبديل الأموال: (3-6 مجرمين) | الوحدات المباشرة: (8).",
  "سرقة المجوهرات وبنك بلين كاونتي: (3-7 مجرمين) | الوحدات المباشرة: (9).",
  "ميز بنك: (5-10 مجرمين) | الوحدات المباشرة: (12).",
  "الحالات المفتوحة: للاعبين (7 كحد أقصى) | للشرطة (11 كحد أقصى).",
  "يجب احترام موظفي المطاعم وعدم الإساءة لهم أو خطفهم أثناء العمل.",
  "يمنع المفاوضة على أسعار المطاعم أو لبس ملابس موظفيها لغير العاملين.",
  "البيع في المطاعم يكون بالداخل فقط ويمنع بيع الوجبات لغير الموظفين.",
  "احترام الجميع في الديسكورد وعدم السب أو الإهانة حتى لو بطريقة غير مباشرة.",
  "يمنع نشر روابط دعوات سيرفرات أخرى أو التدخل في شؤون الآخرين.",
  "ممنوع امتلاك أكثر من حساب (باند نهائي) أو انتحال الشخصيات الإدارية.",
  "يمنع السخرية والاستهزاء، والاستفسارات تكون عبر الدعم الفني فقط."
];

const LAW_CATEGORIES = {
  'رول بلاي': ['رول بلاي', 'تقمص', 'شخصية', 'كركتر'],
  'قتال': ['قتل', 'RDM', 'فايت', 'سلاح', 'خوذة'],
  'سرقات': ['سرقة', 'رهينة', 'بنك', 'مجوهرات', 'بقالة'],
  'عقوبات': ['باند', 'كيك', 'ممنوع'],
  'مناطق': ['منطقة آمنة', 'شرطة', 'مستشفى', 'حكومية'],
  'مركبات': ['VDM', 'مركبة', 'سيارة', 'دبابة', 'كفرات'],
  'عصابات': ['عصابة', 'عائلة', 'تحالف'],
  'عام': ['Meta Gaming', 'قلتش', 'برامج خارجية', 'ستريم سنايب']
};

const QUICK_QUESTIONS = [
  { text: 'قوانين الرول بلاي', icon: '📜' },
  { text: 'قوانين القتال والـ RDM', icon: '⚔️' },
  { text: 'قوانين السرقات', icon: '💰' },
  { text: 'قوانين المركبات والـ VDM', icon: '🚗' },
  { text: 'ما هي المناطق الآمنة؟', icon: '🏢' },
  { text: 'قوانين العصابات', icon: '👥' },
  { text: 'الممنوعات التي توديك باند', icon: '⚠️' }
];

// ============================================
// حالة البوت
// ============================================
let conversationHistory = [];
let isMinimized = false;
let unreadCount = 0;
let chatIsOpen = false;
let searchMode = false;

// ============================================
// دوال البحث والردود
// ============================================
function searchLaws(query) {
  query = query.toLowerCase().trim();
  const results = SERVER_LAWS.filter(law => {
    const lawLower = law.toLowerCase();
    const words = query.split(' ').filter(w => w.length > 1);
    return words.some(word => lawLower.includes(word));
  });
  return results;
}

function getLawsByCategory(category) {
  const keywords = LAW_CATEGORIES[category] || [];
  return SERVER_LAWS.filter(law => {
    const lawLower = law.toLowerCase();
    return keywords.some(keyword => lawLower.includes(keyword.toLowerCase()));
  });
}

function highlightText(text, query) {
  if (!query || query.length < 2) return text;
  const words = query.split(' ').filter(w => w.length > 1);
  let highlighted = text;
  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
  });
  return highlighted;
}

function getSmartResponse(question) {
  const q = question.toLowerCase().trim();

  if (q.includes('السلام') || q.includes('مرحبا') || q.includes('هلا') || q.includes('اهلا') || q.includes('صباح') || q.includes('مساء')) {
    return { type: 'greeting', message: `وعليكم السلام ورحمة الله! 👋\n\nأنا المساعد الذكي لسيرفر ${CONFIG.SERVER_NAME}. كيف أقدر أساعدك اليوم؟`, showQuickButtons: true };
  }

  if (q.includes('شكر') || q.includes('يزاك') || q.includes('مشكور')) {
    return { type: 'thanks', message: 'العفو! سعيد بمساعدتك 😊\nأي سؤال ثاني تفضل.', showQuickButtons: false };
  }

  if (q.includes('رول بلاي') || q.includes('roleplay') || q.includes('تقمص') || q.includes('شخصية')) {
    const laws = getLawsByCategory('رول بلاي');
    return { type: 'laws', title: '📜 قوانين الرول بلاي', message: 'هذي أهم قوانين الرول بلاي في السيرفر:', laws: laws.slice(0, 6), showMore: laws.length > 6, query: q };
  }

  if (q.includes('rdm') || q.includes('قتل') || q.includes('قتال') || q.includes('فايت') || q.includes('ضرب')) {
    const laws = getLawsByCategory('قتال');
    return { type: 'laws', title: '⚔️ قوانين القتال', message: 'القوانين المتعلقة بالقتال:', laws: laws, highlight: 'RDM: القتل العشوائي ممنوع تماماً ويجب وجود سبب درامي واضح.', query: q };
  }

  if (q.includes('vdm') || q.includes('مركبة') || q.includes('سيارة') || q.includes('صدم') || q.includes('كفر') || q.includes('دبابة')) {
    const laws = getLawsByCategory('مركبات');
    return { type: 'laws', title: '🚗 قوانين المركبات', message: 'القوانين المتعلقة بالمركبات:', laws: laws, highlight: 'VDM: يمنع منعاً باتاً استخدام المركبة كسلاح.', query: q };
  }

  if (q.includes('سرق') || q.includes('رهينة') || q.includes('بنك') || q.includes('مجوهرات') || q.includes('بقالة') || q.includes('سرقة')) {
    const laws = getLawsByCategory('سرقات');
    return { type: 'laws', title: '💰 قوانين السرقات', message: 'قوانين السرقات ونظام الرهائن:', laws: laws.slice(0, 10), showMore: laws.length > 10, query: q };
  }

  if (q.includes('منطقة آمنة') || q.includes('مناطق آمنة') || q.includes('safe') || q.includes('مأمن') || q.includes('مناطق')) {
    return {
      type: 'laws', title: '🏢 المناطق الآمنة', message: 'المناطق الآمنة في السيرفر:',
      laws: getLawsByCategory('مناطق'),
      highlight: 'المناطق الآمنة تشمل: مراكز الشرطة، المستشفيات، الشقق العامة، المطاعم والكافيهات، ورش تصليح المركبات، مركز الوظائف، العقار، السجن، المحكمة، حجز المركبات، معارض السيارات، تأجير السيارات، الكازينو، ايكيا.'
    };
  }

  if (q.includes('عصابة') || q.includes('عائلة') || q.includes('gang') || q.includes('تحالف')) {
    const laws = getLawsByCategory('عصابات');
    return { type: 'laws', title: '👥 قوانين العصابات', message: 'قوانين العصابات والعائلات:', laws: laws, query: q };
  }

  if (q.includes('باند') || q.includes('ban') || q.includes('كيك') || q.includes('عقوبة') || q.includes('يباند') || q.includes('توديني')) {
    const bannableLaws = SERVER_LAWS.filter(law => law.includes('باند نهائي') || law.includes('= باند'));
    return { type: 'warning', title: '⚠️ الأفعال التي تؤدي للباند', message: 'هذي المخالفات تؤدي للباند النهائي:', laws: bannableLaws, query: q };
  }

  if (q.includes('meta') || q.includes('ميتا') || q.includes('ميتا غيمنغ')) {
    return {
      type: 'laws', title: '🚫 Meta Gaming', message: 'Meta Gaming ممنوع في السيرفر:',
      laws: ['يمنع Meta Gaming (استخدام معلومات خارج اللعبة).'],
      explanation: 'Meta Gaming يعني استخدام معلومات حصلت عليها خارج اللعبة (مثل الديسكورد أو الستريم) داخل السيرفر. مثال: لو شفت على بث أين الشرطة وتستخدم هذه المعلومة في اللعبة.'
    };
  }

  if (q.includes('ديسكورد') || q.includes('discord')) {
    return {
      type: 'laws', title: '💬 قوانين الديسكورد', message: 'قوانين التعامل في الديسكورد:',
      laws: SERVER_LAWS.filter(law => law.includes('ديسكورد') || law.includes('سيرفرات') || law.includes('السخرية') || law.includes('دعم'))
    };
  }

  if (q.includes('رهينة') || q.includes('خطف') || q.includes('مفاوض')) {
    const laws = SERVER_LAWS.filter(law =>
      law.includes('رهينة') || law.includes('خطف') || law.includes('مفاوض') || law.includes('خاطف')
    );
    return { type: 'laws', title: '🔒 قوانين الرهائن والخطف', message: 'تفاصيل قوانين الرهائن:', laws: laws, query: q };
  }

  if (q.includes('مطعم') || q.includes('كافيه') || q.includes('بيع') || q.includes('موظف مطعم')) {
    const laws = SERVER_LAWS.filter(law => law.includes('مطعم') || law.includes('بيع في') || law.includes('موظفي المطاعم'));
    return { type: 'laws', title: '🍔 قوانين المطاعم', message: 'قوانين التعامل مع المطاعم:', laws: laws, query: q };
  }

  if (q.includes('مسعف') || q.includes('ems') || q.includes('طبيب') || q.includes('إسعاف')) {
    const laws = SERVER_LAWS.filter(law => law.includes('مسعف') || law.includes('EMS') || law.includes('علاج'));
    return { type: 'laws', title: '🚑 قوانين المسعفين', message: 'القوانين المتعلقة بالمسعفين والعلاج:', laws: laws, query: q };
  }

  if (q.includes('كل القوانين') || q.includes('جميع القوانين') || q.includes('اعطني كل') || q.includes('القوانين كلها')) {
    return {
      type: 'all',
      title: '📋 جميع القوانين',
      message: `السيرفر يحتوي على ${SERVER_LAWS.length} قانون. هنا أهم الفئات:`,
      showQuickButtons: true
    };
  }

  // بحث عام
  const searchResults = searchLaws(q);
  if (searchResults.length > 0) {
    return { type: 'search', title: '🔍 نتائج البحث', message: `وجدت ${searchResults.length} نتيجة لـ "${question}":`, laws: searchResults.slice(0, 6), showMore: searchResults.length > 6, allResults: searchResults, query: q };
  }

  return {
    type: 'unknown',
    message: 'ما فهمت سؤالك بالضبط 🤔\n\nجرب تكتب كلمة مفتاحية مثل: "رول بلاي"، "سرقة"، "RDM"، "مناطق آمنة"',
    showQuickButtons: true
  };
}

// ============================================
// دوال العرض
// ============================================
function displayLaws(laws, title = '', query = '') {
  let html = '';
  if (title) html += `<div class="law-title">${title}</div>`;

  laws.forEach((law, index) => {
    const isHighlight = law.includes('باند نهائي') || law.includes('RDM') || law.includes('VDM') || law.includes('= باند');
    const displayText = query ? highlightText(law, query) : law;
    html += `
      <div class="law-item ${isHighlight ? 'law-highlight' : ''}">
        <span class="law-number">${index + 1}</span>
        <span class="law-text">${displayText}</span>
        <button class="copy-law-btn" onclick="copyLaw(this, \`${law.replace(/`/g, "'")}\`)" title="نسخ">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>`;
  });
  return html;
}

function copyLaw(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    btn.style.color = '#2ecc71';
    setTimeout(() => {
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
      btn.style.color = '';
    }, 2000);
  }).catch(() => {
    // fallback للمتصفحات القديمة
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

function addMessage(text, isUser = false, isTyping = false) {
  const chatBody = document.getElementById('chat-body');

  if (isTyping) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-msg typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return;
  }

  const typingIndicator = document.getElementById('typing-indicator');
  if (typingIndicator) typingIndicator.remove();

  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'user-msg' : 'ai-msg';
  messageDiv.innerHTML = text;

  chatBody.appendChild(messageDiv);
  requestAnimationFrame(() => {
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = isUser ? 'translateX(20px)' : 'translateX(-20px)';
    requestAnimationFrame(() => {
      messageDiv.style.transition = 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateX(0)';
    });
  });

  chatBody.scrollTop = chatBody.scrollHeight;

  // إشعار للاعب إذا الشات مغلق
  if (!chatIsOpen && !isUser) {
    unreadCount++;
    updateBubbleBadge();
  }
}

function addQuickButtons() {
  const chatBody = document.getElementById('chat-body');
  const oldButtons = chatBody.querySelector('.quick-buttons-container');
  if (oldButtons) oldButtons.remove();

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'quick-buttons-container';

  QUICK_QUESTIONS.forEach(q => {
    const btn = document.createElement('button');
    btn.className = 'quick-btn';
    btn.innerHTML = `${q.icon} ${q.text}`;
    btn.onclick = () => {
      document.getElementById('ai-input').value = q.text;
      sendMessage();
    };
    buttonsContainer.appendChild(btn);
  });

  chatBody.appendChild(buttonsContainer);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function updateBubbleBadge() {
  const badge = document.getElementById('chat-bubble-badge');
  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? 'flex' : 'none';
  }
}

// ============================================
// دالة الرد الرئيسية
// ============================================
async function sendMessage() {
  const input = document.getElementById('ai-input');
  const question = input.value.trim();
  if (!question) return;

  // تعطيل الإدخال مؤقتاً
  input.disabled = true;
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) sendBtn.disabled = true;

  addMessage(question, true);
  input.value = '';

  conversationHistory.push({ role: 'user', text: question, time: new Date() });

  addMessage('', false, true);

  const delay = 600 + Math.random() * 600;
  await new Promise(resolve => setTimeout(resolve, delay));

  const response = getSmartResponse(question);
  let replyHTML = `<div class="ai-response">`;

  if (response.title) {
    replyHTML += `<div class="response-title">${response.title}</div>`;
  }

  replyHTML += `<div class="response-message">${response.message.replace(/\n/g, '<br>')}</div>`;

  if (response.highlight) {
    replyHTML += `<div class="law-highlight-box">⚠️ ${response.highlight}</div>`;
  }

  if (response.explanation) {
    replyHTML += `<div class="explanation-box">💡 ${response.explanation}</div>`;
  }

  if (response.laws && response.laws.length > 0) {
    replyHTML += displayLaws(response.laws, '', response.query || '');

    if (response.showMore && response.allResults) {
      const remaining = response.allResults.length - response.laws.length;
      replyHTML += `
        <button class="show-more-btn" onclick="showMoreResults(this, '${btoa(encodeURIComponent(JSON.stringify(response.allResults)))}', ${response.laws.length})">
          عرض ${remaining} نتيجة إضافية ▼
        </button>`;
    } else if (response.showMore) {
      replyHTML += `<div class="show-more-hint">📋 اكتب "كل القوانين" لرؤية الكل أو اختر من الأزرار</div>`;
    }
  }

  // إضافة تقييم الرد
  const msgId = Date.now();
  replyHTML += `
    <div class="feedback-row" id="fb-${msgId}">
      <span class="feedback-label">هل الجواب مفيد؟</span>
      <button class="fb-btn" onclick="rateFeedback(${msgId}, true, this)">👍</button>
      <button class="fb-btn" onclick="rateFeedback(${msgId}, false, this)">👎</button>
    </div>`;

  replyHTML += `</div>`;

  addMessage(replyHTML, false);

  if (response.showQuickButtons || response.type === 'greeting' || response.type === 'unknown') {
    setTimeout(() => addQuickButtons(), 200);
  }

  conversationHistory.push({ role: 'ai', text: response.message, time: new Date() });

  // إعادة تفعيل الإدخال
  input.disabled = false;
  if (sendBtn) sendBtn.disabled = false;
  input.focus();
}

// للتوافق مع الاسم القديم
function askAI() { sendMessage(); }

function showMoreResults(btn, encodedData, startFrom) {
  try {
    const allResults = JSON.parse(decodeURIComponent(atob(encodedData)));
    const remaining = allResults.slice(startFrom);
    const container = btn.parentElement;
    btn.remove();
    const moreHTML = displayLaws(remaining, '', '');
    const div = document.createElement('div');
    div.innerHTML = moreHTML;
    container.appendChild(div);
  } catch (e) {}
}

function rateFeedback(id, isPositive, btn) {
  const row = document.getElementById(`fb-${id}`);
  if (!row) return;
  row.innerHTML = isPositive
    ? '<span class="feedback-thanks positive">شكراً! سعيد إن الجواب فيد 😊</span>'
    : '<span class="feedback-thanks negative">آسف! حاول تعيد الصياغة وراح أحاول أساعد أكثر 🙏</span>';
}

// ============================================
// دوال التحكم في النافذة
// ============================================
function toggleChat() {
  const chatWindow = document.getElementById('ai-chat-window');
  const chatToggle = document.getElementById('ai-chat-toggle');

  chatIsOpen = !chatIsOpen;

  if (!chatIsOpen) {
    chatWindow.classList.remove('chat-open');
    chatWindow.classList.add('chat-closing');
    setTimeout(() => {
      chatWindow.style.display = 'none';
      chatWindow.classList.remove('chat-closing');
    }, 300);
    chatToggle.style.display = 'flex';
  } else {
    chatWindow.style.display = 'flex';
    chatToggle.style.display = 'none';
    chatWindow.classList.add('chat-open');
    unreadCount = 0;
    updateBubbleBadge();

    if (conversationHistory.length === 0) {
      setTimeout(() => {
        addMessage('اختر موضوعاً من الأسئلة السريعة أو اكتب سؤالك:', false);
        addQuickButtons();
      }, 350);
    }

    setTimeout(() => {
      document.getElementById('ai-input')?.focus();
    }, 400);
  }
}

function clearChat() {
  const chatBody = document.getElementById('chat-body');
  chatBody.innerHTML = `
    <div class="ai-msg">
      <div class="ai-response">
        <div class="response-title">🌟 مرحبًا من جديد!</div>
        <div class="response-message">المحادثة السابقة مسحت. كيف أقدر أساعدك؟</div>
      </div>
    </div>`;
  conversationHistory = [];
  setTimeout(() => addQuickButtons(), 200);
}

// زر البحث
function toggleSearchMode() {
  searchMode = !searchMode;
  const input = document.getElementById('ai-input');
  if (searchMode) {
    input.placeholder = '🔍 ابحث في القوانين...';
    input.classList.add('search-active');
  } else {
    input.placeholder = 'اكتب سؤالك...';
    input.classList.remove('search-active');
  }
  input.focus();
}

// ============================================
// تهيئة الأحداث
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('ai-input');
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // عداد حروف مباشر
    input.addEventListener('input', function () {
      const counter = document.getElementById('char-counter');
      if (counter) {
        const len = this.value.length;
        counter.textContent = len > 0 ? `${len}` : '';
      }
    });
  }

  // إضافة badge لزر البوت
  const bubble = document.getElementById('ai-chat-toggle');
  if (bubble) {
    const badge = document.createElement('div');
    badge.id = 'chat-bubble-badge';
    badge.className = 'bubble-badge';
    badge.style.display = 'none';
    bubble.appendChild(badge);
  }
});