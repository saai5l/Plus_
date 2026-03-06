const WEBHOOKS = CONFIG.WEBHOOKS;

/* ============================================================ */

const firebaseConfig = CONFIG.FIREBASE;

if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
} else {
    console.error("خطأ: مكتبة Firebase لم يتم تحميلها بشكل صحيح في index.html");
}

// الأدمنز يُقرأون من Firebase — لا تعدّل هنا
let ADMIN_IDS = []; // يُحمَّل من Firebase تلقائياً

// تحميل الأدمنز من Firebase وتحديث الـ UI
function loadAdminIds() {
    database.ref('adminIds').on('value', (snap) => {
        const data = snap.val();
        if (data && typeof data === 'object') {
            ADMIN_IDS = Object.values(data).map(a => a.id).filter(Boolean);
        } else {
            ADMIN_IDS = ["1453875192009986166",""];
        }
        // أعد رسم زر الأدمن بعد تحديث القائمة
        const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (savedUser) updateUI(savedUser);
        renderAdminIds();
    });
}

        const jobConfig = {
            police:           { open: true, webhook: WEBHOOKS.police },
            ems:              { open: true, webhook: WEBHOOKS.ems },
            staff:            { open: true, webhook: WEBHOOKS.staff },
            gang:             { open: true, webhook: WEBHOOKS.staff },
            gang_families:    { open: true, webhook: WEBHOOKS.staff },
            gang_scrap:       { open: true, webhook: WEBHOOKS.staff },
            gang_gsg:         { open: true, webhook: WEBHOOKS.staff },
            gang_ms13:        { open: true, webhook: WEBHOOKS.staff },
            gang_yakuza:      { open: true, webhook: WEBHOOKS.staff },
            gang_neighborhood:{ open: true, webhook: WEBHOOKS.staff },
            gang_crips:       { open: true, webhook: WEBHOOKS.staff },
            gang_11street:    { open: true, webhook: WEBHOOKS.staff },
            gang_lostmc:      { open: true, webhook: WEBHOOKS.staff },
            gang_soa:         { open: true, webhook: WEBHOOKS.staff },
            gang_quietless:   { open: true, webhook: WEBHOOKS.staff },
            gang_altufahi:    { open: true, webhook: WEBHOOKS.staff },
            gang_deathline:   { open: true, webhook: WEBHOOKS.staff },
            gang_18street:    { open: true, webhook: WEBHOOKS.staff },
            gang_oldschool:   { open: true, webhook: WEBHOOKS.staff },
            gang_darkness:    { open: true, webhook: WEBHOOKS.staff },
            gang_14nortenos:  { open: true, webhook: WEBHOOKS.staff },
            gang_elpatron:    { open: true, webhook: WEBHOOKS.staff },
            gang_vagos:       { open: true, webhook: WEBHOOKS.staff },
            gang_26yard:      { open: true, webhook: WEBHOOKS.staff },
            gang_boomers:     { open: true, webhook: WEBHOOKS.staff },
            gang_elmundo:     { open: true, webhook: WEBHOOKS.staff }
        };

function showPage(pageId) {
  if (pageId === 'admin-dashboard') {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (!savedUser || !ADMIN_IDS.includes(savedUser.id)) {
          showNotification('⚠️ عذراً، لا تملك صلاحية الوصول للوحة الإدارة', true);
          return; 
      }
  }

  const pages = document.querySelectorAll('.page');
  const currentPage = document.querySelector('.page.active');

  if (currentPage && currentPage.id === pageId) return;

  // Overlay transition effect
  let overlay = document.getElementById('page-transition-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:99997;pointer-events:none;
      background:linear-gradient(135deg,rgba(252,120,35,0.08),rgba(0,0,0,0.5));
      opacity:0;transition:opacity 0.2s ease;
    `;
    document.body.appendChild(overlay);
  }

  overlay.style.opacity = '1';

  setTimeout(() => {
    pages.forEach(page => {
      if (page.id === pageId) {
        page.classList.add('active');
        page.style.animation = 'pageSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards';
      } else if (page.classList.contains('active')) {
        page.classList.remove('active');
        page.style.animation = '';
      }
    });

    overlay.style.opacity = '0';

    if (pageId === 'admin-dashboard') { loadAdminData(); loadTickets(); loadOrders(); }
    if (pageId === 'tracking-page') loadUserTrackingData();

    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
        link.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 150);
}

        function showLawSection(sectionId, clickedTab) {
            document.querySelectorAll('.law-section').forEach(s => s.classList.remove('active'));
            const target = document.getElementById(sectionId);
            if (target) target.classList.add('active');

            // Support both old .law-btn and new .laws-tab
            document.querySelectorAll('.law-btn, .laws-tab').forEach(btn => btn.classList.remove('active'));
            if (clickedTab) {
                clickedTab.classList.add('active');
            } else {
                document.querySelectorAll('.law-btn, .laws-tab').forEach(btn => {
                    const oc = btn.getAttribute('onclick') || '';
                    if (oc.includes(sectionId)) btn.classList.add('active');
                });
            }

            // Clear search on tab switch
            const searchInput = document.getElementById('laws-search-input');
            if (searchInput) { searchInput.value = ''; filterLaws(''); }
        }

        function filterLaws(query) {
            const q = query.trim().toLowerCase();
            const countEl = document.getElementById('laws-search-count');
            let total = 0, visible = 0;

            document.querySelectorAll('.law-item-new').forEach(item => {
                const text = item.querySelector('.law-text-new');
                if (!text) return;
                total++;
                const raw = text.textContent.toLowerCase();
                if (!q || raw.includes(q)) {
                    item.style.display = '';
                    visible++;
                    if (q) {
                        const rx = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
                        text.innerHTML = text.textContent.replace(rx, '<mark class="law-highlight-search">$1</mark>');
                    } else {
                        text.innerHTML = text.textContent;
                    }
                } else {
                    item.style.display = 'none';
                }
            });

            if (countEl) {
                countEl.textContent = q ? `${visible} نتيجة` : '';
            }
        }

        function copyLaw(btn) {
            const textEl = btn.closest('.law-item-new').querySelector('.law-text-new');
            if (!textEl) return;
            const text = textEl.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                const icon = btn.querySelector('i');
                btn.classList.add('copied');
                icon.className = 'fas fa-check';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    icon.className = 'fas fa-copy';
                }, 1800);
            }).catch(() => {
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            });
        }
        
        document.querySelectorAll('.collapse-btn').forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    content.classList.remove('show');
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.classList.add('show');
                }
            });
        });
        
function openJobModal(jobType) {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!savedUser) {
        showNotification('⚠️ يرجى تسجيل الدخول عبر ديسكورد أولاً', true);
        return;
    }

    let apps = JSON.parse(localStorage.getItem('serverApplications')) || [];
    const hasPending = apps.find(app => app.discordId === savedUser.id && app.status === "معلق");

    if (hasPending) {
        openCustomConfirm(
            `لديك طلب سابق معلق برقم (${hasPending.appId}). يرجى انتظار الرد قبل التقديم مرة أخرى.`,
            "طلب معلق",
            "fa-clock",
            function() { closeConfirmModal(); }
        );
        return;
    }

    showRequirements(jobType);
}

const gangReqs = ['العمر 16+', 'معرفة قوانين الإجرام', 'شخصية إجرامية واضحة', 'الولاء للعصابة فوق كل شيء', 'عدم الانضمام لعصابة أخرى'];
const jobRequirements = {
    'police':           ['العمر 17+', 'ميكروفون سليم', 'الالتزام بالرتب', 'احترام قوانين السيرفر', 'الجدية في الرول بلاي', 'القدرة على التواصل والعمل الجماعي', 'التواجد الجيد أثناء فترات النشاط'],
    'ems':              ['العمر 16+', 'سرعة الاستجابة للحالات', 'اللباقة وحسن التعامل', 'خبرة في الإسعاف والرول الطبي', 'الهدوء تحت الضغط', 'الالتزام بتعليمات الطاقم الطبي'],
    'staff':            ['العمر 18+', 'التواجد اليومي', 'خبرة إدارية سابقة', 'الحيادية في اتخاذ القرارات', 'التعامل الراقي مع اللاعبين'],
    'gang':             gangReqs,
    'gang_families':    gangReqs,
    'gang_scrap':       gangReqs,
    'gang_gsg':         gangReqs,
    'gang_ms13':        gangReqs,
    'gang_yakuza':      gangReqs,
    'gang_neighborhood':gangReqs,
    'gang_crips':       gangReqs,
    'gang_11street':    gangReqs,
    'gang_lostmc':      gangReqs,
    'gang_soa':         gangReqs,
    'gang_quietless':   gangReqs,
    'gang_altufahi':    gangReqs,
    'gang_deathline':   gangReqs,
    'gang_18street':    gangReqs,
    'gang_oldschool':   gangReqs,
    'gang_darkness':    gangReqs,
    'gang_14nortenos':  gangReqs,
    'gang_elpatron':    gangReqs,
    'gang_vagos':       gangReqs,
    'gang_26yard':      gangReqs,
    'gang_boomers':     gangReqs,
    'gang_elmundo':     gangReqs
};

function showRequirements(jobType) {
    const reqModal = document.getElementById('req-modal');
    const reqList = document.getElementById('req-list');
    const requirements = jobRequirements[jobType] || ['يجب الالتزام بالقوانين'];

    reqList.innerHTML = requirements.map(r => `<p style="margin:10px 0;"><i class="fa-solid fa-check" style="color:#fc7823;"></i> ${r}</p>`).join('');
    reqModal.style.display = 'flex';

    document.getElementById('accept-req').onclick = function() {
        reqModal.style.display = 'none';
        finalizeOpenForm(jobType); 
    };
}

function finalizeOpenForm(jobType) {
    const modal = document.getElementById('job-modal');
    const jobTypeInput = document.getElementById('job-type');
    const discordIdInput = document.getElementById('discord-id-input');
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (modal) {
        if (jobTypeInput) jobTypeInput.value = jobType;
        document.getElementById('modal-title').textContent = `تقديم على ${getJobTitle(jobType)}`;
        modal.classList.add('active');

        if (discordIdInput && savedUser) {
            discordIdInput.value = savedUser.id;
            discordIdInput.readOnly = true;
        }
    }
}

function closeReqModal() {
    document.getElementById('req-modal').style.display = 'none';
}

function closeModal() {
    document.getElementById('job-modal').classList.remove('active');
    document.getElementById('job-form').reset();
}

// ── validation بصري للفورم ──
function setFieldState(groupId, errorId, errorMsg) {
    const group = document.getElementById(groupId);
    const errEl = document.getElementById(errorId);
    if (!group || !errEl) return;
    if (errorMsg) {
        group.classList.add('has-error');
        group.classList.remove('has-success');
        errEl.textContent = errorMsg;
    } else {
        group.classList.remove('has-error');
        group.classList.add('has-success');
        errEl.textContent = '';
    }
}
function clearFieldStates() {
    document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error', 'has-success'));
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
}

// عداد حروف سبب التقديم
document.addEventListener('DOMContentLoaded', function() {
    const reasonEl = document.getElementById('reason');
    const countEl  = document.getElementById('reason-count');
    if (reasonEl && countEl) {
        reasonEl.addEventListener('input', function() {
            const len = this.value.length;
            countEl.textContent = `${len} / 20 حرف`;
            countEl.classList.toggle('ready', len >= 20);
        });
    }
});

document.getElementById('job-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    clearFieldStates();

    const jobType       = document.getElementById('job-type').value;
    const characterName = document.getElementById('character-name').value.trim();
    const characterId   = document.getElementById('character-id').value.trim();
    const phoneNumber   = document.getElementById('phone-number').value.trim();
    const discordUser   = document.getElementById('discord-id-input').value.trim();
    const reason        = document.getElementById('reason').value.trim();

    // ── Validation ──
    let hasError = false;
    if (!discordUser) { showToast('⚠️', 'يجب تسجيل الدخول', 'سجّل دخولك أولاً عبر ديسكورد'); return; }

    if (characterName.length < 3) { setFieldState('fg-character-name', 'err-name', 'الاسم يجب أن يكون 3 أحرف على الأقل'); hasError = true; }
    else setFieldState('fg-character-name', 'err-name', null);

    if (!characterId) { setFieldState('fg-character-id', 'err-steam', 'أدخل Steam ID الخاص بك'); hasError = true; }
    else setFieldState('fg-character-id', 'err-steam', null);

    if (!phoneNumber) { setFieldState('fg-phone-number', 'err-time', 'أدخل الوقت المتاح يومياً'); hasError = true; }
    else setFieldState('fg-phone-number', 'err-time', null);

    if (reason.length < 20) { setFieldState('fg-reason', 'err-reason', `أضف ${20 - reason.length} حرف على الأقل`); hasError = true; }
    else setFieldState('fg-reason', 'err-reason', null);

    if (hasError) return;

    // ── إرسال ──
    const submitBtn = document.getElementById('submit-job-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...'; }

    const counterRef = database.ref('settings/app_counter');
    counterRef.transaction(cv => (cv || 200) + 1).then(function(result) {
        const newAppId = `PLUS-${result.snapshot.val() - 1}`;
        sendApplicationToDiscord(newAppId, jobType, characterName, characterId, phoneNumber, discordUser, reason, submitBtn);
    }).catch(() => {
        showToast('❌', 'خطأ', 'فشل الاتصال بقاعدة البيانات');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب'; }
    });

    async function sendApplicationToDiscord(newAppId, jobType, characterName, characterId, phoneNumber, discordUser, reason, submitBtn) {
        const jobTitle   = getJobTitle(jobType);
        const webhookUrl = jobConfig[jobType].webhook;
        // لون وإيموجي حسب الوظيفة
        const jobColors = { police: 0x3498db, ems: 0x2ecc71, staff: 0xfc7823 };
        const jobEmojis = { police: '👮', ems: '🚑', staff: '🛡️' };
        const embedColor = jobColors[jobType] || 0xfc7823;
        const jobEmoji  = jobEmojis[jobType] || (jobType.startsWith('gang') ? '💀' : '📋');

        const data = {
            content: `📬 **تقديم جديد وصل!**`,
            embeds: [{
                author: { name: `${jobEmoji} طلب توظيف جديد — ${jobTitle}` },
                title: `📋 رقم الطلب: ${newAppId}`,
                color: embedColor,
                fields: [
                    { name: '👤 اسم الشخصية',   value: '```' + characterName + '```', inline: true  },
                    { name: '🎮 رقم الستيم',     value: '```' + characterId   + '```', inline: true  },
                    { name: '⏰ الوقت المتاح',   value: '```' + phoneNumber    + '```', inline: true  },
                    { name: '🔗 الديسكورد',      value: `<@${discordUser}>`,            inline: true  },
                    { name: '📝 سبب التقديم',    value: '>>> ' + reason,                inline: false },
                ],
                footer: { text: `${CONFIG.SERVER_NAME} • نظام التوظيف` },
                timestamp: new Date().toISOString()
            }]
        };
        try {
            const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (response.ok) {
                showToast('✅', 'تم الإرسال!', `رقم طلبك: ${newAppId}`);
                addNotification('success', 'تم إرسال طلبك!', `رقم الطلب: ${newAppId} — انتظر رد الإدارة`);
                saveToAdminDashboard(characterName, jobTitle, reason, discordUser, newAppId);
                closeModal();
                clearFieldStates();
                document.getElementById('job-form').reset();
                const countEl = document.getElementById('reason-count');
                if (countEl) { countEl.textContent = '0 / 20 حرف'; countEl.classList.remove('ready'); }
                if (typeof loadUserTrackingData === "function") loadUserTrackingData();
            } else { throw new Error('webhook error'); }
        } catch {
            showToast('❌', 'خطأ', 'فشل الإرسال — تأكد من اتصالك بالإنترنت');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب'; }
        }
    }
});

function saveToAdminDashboard(name, job, reason, discordId, appId) {
    const newApp = {
        appId: appId, 
        name: name,
        job: job,
        date: new Date().toLocaleDateString('ar-SA'),
        status: "معلق",
        reason: reason,
        discordId: discordId,
        adminNote: ""
    };

    database.ref('applications/' + appId).set(newApp)
    .then(() => {
        console.log("تم حفظ الطلب بنجاح في قاعدة البيانات العالمية");
    })
 .catch((error) => {
    console.error("خطأ في حفظ البيانات سحابياً:", error);
    showNotification("فشل في حفظ الطلب، تأكد من الاتصال بالإنترنت", true);
});
}
function getJobTitle(jobType) {
    const titles = {
        'police':           'الشرطة LSPD',
        'ems':              'الإسعاف EMS',
        'staff':            'فريق الإدارة',
        'gang':             'انضمام عصابة',
        'gang_families':    'عصابة Families',
        'gang_scrap':       'عصابة Scrap',
        'gang_gsg':         'عصابة GSG',
        'gang_ms13':        'عصابة MS13',
        'gang_yakuza':      'عصابة Yakuza',
        'gang_neighborhood':'عصابة NeighborHood',
        'gang_crips':       'عصابة Crips',
        'gang_11street':    'عصابة 11 Street',
        'gang_lostmc':      'عصابة The Lost MC',
        'gang_soa':         'عصابة Sons of Anarchy',
        'gang_quietless':   'عصابة Quietless',
        'gang_altufahi':    'عصابة Al Tufahi',
        'gang_deathline':   'عصابة Death Line',
        'gang_18street':    'عصابة 18 Street',
        'gang_oldschool':   'عصابة Old School',
        'gang_darkness':    'عصابة Darkness',
        'gang_14nortenos':  'عصابة 14 Norteños',
        'gang_elpatron':    'عصابة el-patron',
        'gang_vagos':       'عصابة VAGOS',
        'gang_26yard':      'عصابة 26 YARD',
        'gang_boomers':     'عصابة BOOMERS',
        'gang_elmundo':     'عصابة ElMundo'
    };
    return titles[jobType] || 'وظيفة غير معروفة';
}
        
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMsg = document.getElementById('notification-message');
    
    notificationMsg.textContent = message;
    
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
});

    window.addEventListener("load", () => {
        setTimeout(() => {
            const loader = document.getElementById("loading-screen");
            loader.style.display = "none";
        }, 1500); 
    });

// Live Server code removed


    document.addEventListener('contextmenu', e => e.preventDefault());

function showCategory(category) {
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.category-section').forEach(sec => sec.classList.remove('active'));

  document.querySelector(`[onclick="showCategory('${category}')"]`).classList.add('active');
  document.getElementById(category).classList.add('active');
}



document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 50; 
  const appearDelay = 400; 

  const startCounting = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;

    const updateCount = () => {
      const increment = Math.ceil(target / speed);
      count += increment;
      counter.textContent = count > target ? target + '+' : count + '+';
      if (count < target) setTimeout(updateCount, 30);
    };

    setTimeout(updateCount, appearDelay);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
});


const observerOptions = { threshold: 0.1 };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.page section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.6s ease-out";
    revealObserver.observe(section);
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = (Math.random() * 0.3) - 0.15; 
        this.speedY = (Math.random() * 0.3) - 0.15;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.002; 
    }
    draw() {
        ctx.fillStyle = 'rgba(252, 120, 35, 0.4)'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });

        faqItem.classList.toggle('active');
    });
});


// toggleChat مُعرَّفة في ai-chat-enhanced.js

function similarity(s1, s2) {
    let longer = s1.length < s2.length ? s2 : s1;
    let shorter = s1.length < s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) costs[j] = j;
            else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

// askAI مُعرَّفة في ai-chat-enhanced.js

const CLIENT_ID = CONFIG.DISCORD_CLIENT_ID; 
const REDIRECT_URI = CONFIG.REDIRECT_URI;

function login() {
    window.location.href = 'login.html';
}

function toggleUserMenu(event) {
    event.stopPropagation(); 
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('show');
}

window.onclick = function(event) {
    if (!event.target.matches('.user-avatar-wrapper img')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

window.onclick = function(event) {
    const menu = document.getElementById("user-dropdown");
    if (menu && !event.target.closest('.user-profile')) {
        menu.classList.remove("show");
    }
}

window.addEventListener('load', () => {
    try {
        const raw = localStorage.getItem('user') || localStorage.getItem('plusdev_user');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.id) {
                parsed.name = parsed.name || parsed.username || parsed.global_name || parsed.id;
                localStorage.setItem('user', JSON.stringify(parsed));
                localStorage.setItem('plusdev_user', JSON.stringify(parsed));
                updateUI(parsed);
            }
        }
    } catch(e) {
        localStorage.removeItem('user');
        localStorage.removeItem('plusdev_user');
    }
});

function updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const userArea = document.getElementById('user-area');
    const userAvatar = document.getElementById('user-avatar');
    const userDisplayName = document.getElementById('user-display-name');
    const userStatus = document.getElementById('user-status');
    const userDiscordId = document.getElementById('user-discord-id');
    
    const discordIdInput = document.getElementById('discord-id-input');

    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userArea) userArea.style.display = 'flex';
        
        if (userAvatar) userAvatar.src = user.avatar || '';
        if (userDisplayName) userDisplayName.innerText = user.name || user.username || user.global_name || '';
        
        if (userDiscordId) {
            userDiscordId.innerText = "ID: " + user.id;
        }

        if (discordIdInput) {
            discordIdInput.value = user.id;
            discordIdInput.readOnly = true; 
            discordIdInput.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
            discordIdInput.style.cursor = "not-allowed"; 
            discordIdInput.title = "يجب عليك استخدام حسابك الحالي للتقديم";
        }

        if (ADMIN_IDS.includes(user.id)) {
            userStatus.innerText = "Higher Administration";
            userStatus.style.color = "#fc7823";
            if (document.getElementById('admin-btn')) {
                document.getElementById('admin-btn').style.display = 'flex';
            }
        } else {
            userStatus.innerText = "Player";
            userStatus.style.color = "#aaaaaa";
        }
        // إشعار الترحيب
        if (typeof initLoginNotification === 'function') initLoginNotification(user);
    } else {
        if (loginBtn) loginBtn.style.display = 'flex';
        if (userArea) userArea.style.display = 'none';
        
        if (discordIdInput) {
            discordIdInput.value = '';
            discordIdInput.readOnly = false;
            discordIdInput.style.backgroundColor = ""; 
            discordIdInput.style.cursor = "text";
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = "index.html";
}

window.onclick = function(event) {
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown && dropdown.classList.contains('show')) {
        if (!event.target.closest('.user-profile')) {
            dropdown.classList.remove("show");
        }
    }
}


function clearLogs() {
    openCustomConfirm(
        "تحذير: هل أنت متأكد من مسح جميع سجلات التقديم من السحابة نهائياً؟",
        "تصفير قاعدة البيانات",
        "fa-eraser",
        function() {
            database.ref('applications').remove()
            .then(() => {
                database.ref('settings/app_counter').set(200);
                showNotification("تم تصفير النظام السحابي بالكامل", true);
            })
            .catch((error) => {
                console.error("خطأ أثناء المسح:", error);
                showNotification("فشل في مسح البيانات من السحابة", true);
            });
        }
    );
}

const mockJobs = [
    { name: "Sultan_05", job: "الشرطة", date: "2024/05/20", status: "معلق" },
    { name: "Fahad_Player", job: "الإسعاف", date: "2024/05/19", status: "معلق" },
    { name: "Mshari_X", job: "الميكانيكي", date: "2024/05/18", status: "معلق" }
];

let currentAdminFilter = 'all';

function filterAdminTable(status, btn) {
    currentAdminFilter = status;
    const rows = document.querySelectorAll('#jobs-table-body tr');
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const statusCell = row.querySelector('.status-tag');
            row.style.display = (statusCell && statusCell.textContent.trim() === status) ? '' : 'none';
        }
    });
    document.querySelectorAll('.adm-filter-btn').forEach(b => b.classList.remove('adm-filter-active'));
    if (btn) btn.classList.add('adm-filter-active');
    else {
        const activeBtn = document.querySelector(`.adm-filter-btn[data-status="${status}"]`);
        if (activeBtn) activeBtn.classList.add('adm-filter-active');
    }
}

function loadAdminData() {
    const tableBody = document.getElementById('jobs-table-body');
    if (!tableBody) return;
    
    // تحديث قائمة الأدمنز
    renderAdminIds();

    database.ref('applications').on('value', (snapshot) => {
        const data = snapshot.val();
        tableBody.innerHTML = ""; 

        if (!data) {
            tableBody.innerHTML = `<tr><td colspan="6" class="empty-msg">لا توجد طلبات تقديم حالياً</td></tr>`;
            if(document.getElementById('total-apps')) document.getElementById('total-apps').textContent = '0';
            if(document.getElementById('approved-apps')) document.getElementById('approved-apps').textContent = '0';
            if(document.getElementById('rejected-apps')) document.getElementById('rejected-apps').textContent = '0';
            if(document.getElementById('pending-apps')) document.getElementById('pending-apps').textContent = '0';
            return;
        }

        const apps = Object.values(data);

        // إحصائيات محدّثة
        if(document.getElementById('total-apps')) document.getElementById('total-apps').textContent = apps.length;
        if(document.getElementById('approved-apps')) document.getElementById('approved-apps').textContent = apps.filter(a => a.status === 'مقبول').length;
        if(document.getElementById('rejected-apps')) document.getElementById('rejected-apps').textContent = apps.filter(a => a.status === 'رفض').length;
        if(document.getElementById('pending-apps')) document.getElementById('pending-apps').textContent = apps.filter(a => a.status === 'معلق').length;
        // hero stats
        const el = (id) => document.getElementById(id);
        if(el('total-apps-hero'))    el('total-apps-hero').textContent    = apps.length + ' طلب';
        if(el('approved-apps-hero')) el('approved-apps-hero').textContent = apps.filter(a=>a.status==='مقبول').length + ' مقبول';
        if(el('pending-apps-hero'))  el('pending-apps-hero').textContent  = apps.filter(a=>a.status==='معلق').length + ' معلق';
        if(el('rejected-apps-hero')) el('rejected-apps-hero').textContent = apps.filter(a=>a.status==='رفض').length + ' مرفوض';

        [...apps].reverse().forEach((app) => {
            const statusClass = app.status === 'مقبول' ? 'status-approved' : (app.status === 'رفض' ? 'status-rejected' : 'status-pending');
            const discordDisplay = app.discordId ? `<div style="font-size:0.7rem;color:rgba(88,101,242,0.8);margin-top:2px"><i class="fab fa-discord" style="margin-left:3px"></i>${app.discordId}</div>` : '';
            const dateDisplay = app.date ? `<div style="font-size:0.7rem;color:rgba(255,255,255,0.25);margin-top:2px"><i class="fas fa-clock" style="margin-left:3px"></i>${app.date}</div>` : '';
            
            tableBody.innerHTML += `
                <tr>
                    <td class="app-id-cell">${app.appId || '---'}</td>
                    <td class="user-name">
                        ${app.name}
                        ${discordDisplay}
                        ${dateDisplay}
                    </td>
                    <td class="job-type">${app.job}</td>
                    <td>
                        <textarea id="admin-note-${app.appId}" 
                                  class="admin-textarea" 
                                  placeholder="أضف ملاحظة للمستخدم...">${app.adminNote || ''}</textarea>
                    </td>
                    <td><span class="status-tag ${statusClass}">${app.status}</span></td>
                    <td>
                        <div class="action-group">
                            <button class="action-btn btn-accept" onclick="submitDecision('${app.appId}', 'مقبول')" title="قبول"><i class="fa-solid fa-check"></i></button>
                            <button class="action-btn btn-decline" onclick="submitDecision('${app.appId}', 'رفض')" title="رفض"><i class="fa-solid fa-xmark"></i></button>
                            <button class="action-btn btn-remove" onclick="deleteApplication('${app.appId}')" title="حذف"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>`;
        });

        // تطبيق الفلتر الحالي بعد التحميل
        if (currentAdminFilter !== 'all') filterAdminTable(currentAdminFilter);
    });
}

function submitDecision(index, status) {
    const statusText = status === 'مقبول' ? 'قبول' : 'رفض';
    const icon = status === 'مقبول' ? 'fa-check-circle' : 'fa-circle-xmark';
    
    openCustomConfirm(
        `هل أنت متأكد من ${statusText} هذا الطلب؟`,
        `تأكيد قرار الـ ${statusText}`,
        icon,
        function() {
            executeDecision(index, status);
        }
    );
}
function actionJob(index, type) {
    alert(`تم ${type} طلب ${mockJobs[index].name} بنجاح!`);
}


if (document.getElementById('admin-dashboard')) {
    loadAdminData();
}

function manageApplication(index, newStatus) {
    let apps = JSON.parse(localStorage.getItem('serverApplications')) || [];
    
    if(apps[index]) {
        apps[index].status = newStatus;
        localStorage.setItem('serverApplications', JSON.stringify(apps));
        showNotification(`تم تحديث الحالة إلى: ${newStatus}`);
        loadAdminData(); 
    }
}

function deleteApplication(appId) {
    openCustomConfirm(
        "هل أنت متأكد من حذف هذا الطلب بشكل نهائي من قاعدة البيانات؟",
        "حذف طلب",
        "fa-trash-can",
        function() {
            database.ref('applications/' + appId).remove()
            .then(() => {
                showNotification("تم حذف الطلب بنجاح", true);
            })
            .catch(err => {
                showNotification("خطأ في عملية الحذف", true);
            });
        }
    );
}




const jobNames = {
    police: 'شرطة LSPD',
    ems: 'فريق EMS',
    staff: 'فريق الإدارة',
    gang: 'العصابات (الكل)',
    gang_families: 'Families', gang_scrap: 'Scrap', gang_gsg: 'GSG',
    gang_ms13: 'MS13', gang_yakuza: 'Yakuza', gang_neighborhood: 'NeighborHood',
    gang_crips: 'Crips', gang_11street: '11 Street', gang_lostmc: 'Lost MC',
    gang_soa: 'SOA', gang_quietless: 'Quietless', gang_altufahi: 'Altufahi',
    gang_deathline: 'Deathline', gang_18street: '18 Street', gang_oldschool: 'OldSchool',
    gang_darkness: 'Darkness', gang_nortenos: '14 Norteños', gang_elpatron: 'el-patron',
    gang_vagos: 'VAGOS', gang_26yard: '26 YARD', gang_boomers: 'BOOMERS', gang_elmundo: 'ElMundo'
};

const allGangs = ['gang_families','gang_scrap','gang_gsg','gang_ms13','gang_yakuza',
    'gang_neighborhood','gang_crips','gang_11street','gang_lostmc','gang_soa',
    'gang_quietless','gang_altufahi','gang_deathline','gang_18street','gang_oldschool',
    'gang_darkness','gang_nortenos','gang_elpatron','gang_vagos','gang_26yard',
    'gang_boomers','gang_elmundo'];

function toggleGangsExpand() {
    const list = document.getElementById('adm-gangs-list');
    const icon = document.getElementById('gangs-expand-icon');
    const isHidden = list.style.display === 'none';
    list.style.display = isHidden ? 'block' : 'none';
    icon.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
}

function pushGlobalNotif(type, title, msg) {
    // يحفظ الإشعار في Firebase ليصل لكل المستخدمين
    const notif = {
        id: Date.now(),
        type,
        title,
        msg,
        time: new Date().toLocaleTimeString('ar', {hour:'2-digit', minute:'2-digit'}),
        timestamp: Date.now()
    };
    database.ref('globalNotifs').push(notif);
}

function updateJobStatus(jobType) {
    const btn = document.getElementById(`toggle-${jobType}`);
    if (!btn) return;

    const shouldClose = btn.classList.contains('adm-toggle-on');
    database.ref('jobStatus/' + jobType).set({ closed: shouldClose });

    // لو ضغط "العصابات الكل" → يغلق/يفتح كل الفردية أيضًا
    if (jobType === 'gang') {
        allGangs.forEach(g => database.ref('jobStatus/' + g).set({ closed: shouldClose }));
    }

    const jobLabel = jobNames[jobType] || jobType;
    if (shouldClose) {
        pushGlobalNotif('warning', `🔒 إغلاق التقديم — ${jobLabel}`, `تم إغلاق باب التقديم على ${jobLabel} مؤقتاً.`);
    } else {
        pushGlobalNotif('success', `🟢 فُتح التقديم — ${jobLabel}`, `فُتح باب التقديم على ${jobLabel}! قدّم الآن.`);
    }
}

function toggleAllJobs() {
    const jobs = ['police', 'ems', 'staff', 'gang'];
    const mainBtn = document.getElementById('toggle-all');
    if (!mainBtn) return;

    const shouldClose = mainBtn.classList.contains('adm-toggle-on');

    jobs.forEach(job => database.ref('jobStatus/' + job).set({ closed: shouldClose }));
    allGangs.forEach(g => database.ref('jobStatus/' + g).set({ closed: shouldClose }));

    if (shouldClose) {
        pushGlobalNotif('warning', '🔒 تم إغلاق جميع التقديمات', 'تم إغلاق التقديم على جميع الوظائف مؤقتاً');
    } else {
        pushGlobalNotif('success', '🟢 فُتحت جميع التقديمات', 'تم فتح التقديم على جميع الوظائف، قدّم الآن!');
    }
}

/* ════ مستمع الإشعارات العامة من Firebase ════ */
(function() {
    // نبدأ الاستماع فقط من اللحظة الحالية — نتجاهل الإشعارات القديمة
    const startTime = Date.now();

    database.ref('globalNotifs')
        .orderByChild('timestamp')
        .startAt(startTime)
        .on('child_added', (snap) => {
            const notif = snap.val();
            if (!notif || !notif.title || !notif.msg) return;
            // تأكد إن الإشعار جديد فعلاً (بعد فتح الصفحة)
            if (notif.timestamp < startTime) return;
            addNotification(notif.type || 'info', notif.title, notif.msg);
        });
})();

database.ref('jobStatus').on('value', (snapshot) => {
    const statuses = snapshot.val() || {};
    const jobs = ['police', 'ems', 'staff', 'gang'];
    let allClosed = true;

    // كل الوظائف الرئيسية
    jobs.forEach(job => {
        const isClosed = statuses[job] ? statuses[job].closed : false;
        if (!isClosed) allClosed = false;

        // تحديث كل الأزرار اللي تحمل data-job أو id
        document.querySelectorAll(`[data-job="${job}"], #btn-${job}`).forEach(btn => {
            btn.innerHTML = isClosed
                ? '<i class="fas fa-lock"></i> تم إغلاق التقديم'
                : '<i class="fas fa-paper-plane"></i> تقديم الآن';
            btn.style.backgroundColor = isClosed ? '#444' : '';
            btn.style.opacity = isClosed ? '0.6' : '';
            btn.style.cursor = isClosed ? 'not-allowed' : 'pointer';
            btn.disabled = isClosed;
        });

        // تحديث badge "متاح/مغلق" في كروت الوظيفة
        document.querySelectorAll(`.job-${job} .job-status-badge`).forEach(badge => {
            badge.textContent = isClosed ? 'مغلق' : 'متاح';
            badge.className = `job-status-badge ${isClosed ? 'closed' : 'open'}`;
        });

        // تحديث زر الأدمن
        const adminBtn = document.getElementById(`toggle-${job}`);
        if (adminBtn) {
            adminBtn.className = isClosed ? 'adm-toggle-btn adm-toggle-off' : 'adm-toggle-btn adm-toggle-on';
        }
    });

    // تحديث كل عصابة بشكل مستقل
    allGangs.forEach(gang => {
        const isClosed = statuses[gang]?.closed || false;

        document.querySelectorAll(`[data-job="${gang}"]`).forEach(btn => {
            btn.innerHTML = isClosed ? '<i class="fas fa-lock"></i> تم إغلاق التقديم' : 'تقديم الآن';
            btn.style.opacity = isClosed ? '0.6' : '';
            btn.style.cursor = isClosed ? 'not-allowed' : 'pointer';
            btn.disabled = isClosed;
        });

        // badge العصابة
        const gangClass = gang.replace('gang_', 'job-gang-');
        document.querySelectorAll(`.${gangClass} .job-status-badge`).forEach(badge => {
            badge.textContent = isClosed ? 'مغلق' : 'متاح';
            badge.className = `job-status-badge ${isClosed ? 'closed' : 'open'}`;
        });

        const adminBtn = document.getElementById(`toggle-${gang}`);
        if (adminBtn) adminBtn.className = isClosed ? 'adm-toggle-btn adm-toggle-off' : 'adm-toggle-btn adm-toggle-on';
    });

    const mainBtn = document.getElementById('toggle-all');
    if (mainBtn) {
        mainBtn.className = allClosed ? 'adm-toggle-btn adm-toggle-off' : 'adm-toggle-btn adm-toggle-on';
    }
});



function loadUserTrackingData() {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const noAppMsg = document.getElementById('no-app-message');
    const appStatusInfo = document.getElementById('app-status-info');
    const listContainer = document.getElementById('applications-list');

    if (!savedUser) {
        if (noAppMsg) {
            noAppMsg.style.display = 'block';
            noAppMsg.innerHTML = `
                <div class="trk-empty-orbit">
                    <div class="trk-empty-planet"><i class="fas fa-user-lock"></i></div>
                    <div class="trk-orbit-ring ring-1"></div>
                    <div class="trk-orbit-ring ring-2"></div>
                </div>
                <h3 class="trk-empty-title">يرجى تسجيل الدخول</h3>
                <p class="trk-empty-desc">قم بتسجيل الدخول أولاً لتتمكن من تتبع طلباتك.</p>`;
        }
        if (appStatusInfo) appStatusInfo.style.display = 'none';
        return;
    }

    // تحميل تذاكر المستخدم وطلبات المتجر
    loadMyTickets(savedUser.id);
    loadMyOrders(savedUser.id);

    database.ref('applications').on('value', (snapshot) => {
        const data = snapshot.val();
        
        if (!data) {
            if (noAppMsg) {
                noAppMsg.style.display = 'block';
            }
            if (appStatusInfo) appStatusInfo.style.display = 'none';
            return;
        }

        const allApps = Object.values(data);
        const myApps = allApps.filter(a => a.discordId === savedUser.id).reverse();

        if (myApps.length > 0) {
            if (noAppMsg) noAppMsg.style.display = 'none';
            if (appStatusInfo) appStatusInfo.style.display = 'block';
            
            listContainer.innerHTML = ''; 

            myApps.forEach(app => {
                const statusClass = app.status === 'مقبول' ? 'status-approved' : 
                                    app.status === 'رفض' ? 'status-rejected' : 'status-pending';
                
                const isApproved = app.status === 'مقبول';
                const isRejected = app.status === 'رفض';
                const isPending = !isApproved && !isRejected;

                // Determine step states
                const step1Class = 'done'; // always submitted
                const step2Class = isApproved || isRejected ? 'done' : 'active';
                const step3Class = isApproved ? 'done' : isRejected ? 'done' : '';
                const line1Class = step2Class === 'done' ? 'filled' : '';
                const line2Class = step3Class === 'done' ? 'filled' : '';

                const statusIconMap = { 'مقبول': 'fa-check-circle', 'رفض': 'fa-times-circle', 'pending': 'fa-hourglass-half' };
                const statusIcon = isApproved ? 'fa-check-circle' : isRejected ? 'fa-times-circle' : 'fa-hourglass-half';

                const noteHtml = app.adminNote
                    ? `<p style="margin:0; color:#c8c8c8;">${app.adminNote}</p>`
                    : `<div class="trk-notes-empty"><i class="fas fa-inbox"></i><p>لا توجد ملاحظات حالياً</p></div>`;

                listContainer.innerHTML += `
                    <div class="trk-card trk-card-main">
                        <div class="trk-card-header">
                            <div class="trk-card-icon-wrap">
                                <i class="fas fa-id-card"></i>
                            </div>
                            <div>
                                <span class="trk-card-label">الوظيفة المقدم عليها</span>
                                <h3 class="trk-card-title">${app.job}</h3>
                            </div>
                            <span class="trk-app-badge">#${app.appId}</span>
                        </div>
                        <div class="trk-timeline">
                            <div class="trk-timeline-label">الحالة الحالية</div>
                            <div class="trk-status-display">
                                <div class="trk-status-pulse" style="${isApproved ? 'background:#2ecc71; box-shadow:0 0 12px rgba(46,204,113,0.6)' : isRejected ? 'background:#e74c3c; box-shadow:0 0 12px rgba(231,76,60,0.6)' : ''}"></div>
                                <span class="status-badge ${statusClass} trk-status-badge-lg">
                                    <i class="fas ${statusIcon}" style="margin-left:6px;"></i>${app.status}
                                </span>
                            </div>
                        </div>
                        <div class="trk-steps">
                            <div class="trk-step ${step1Class}">
                                <div class="trk-step-dot"><i class="fas fa-paper-plane"></i></div>
                                <span>تم التقديم</span>
                            </div>
                            <div class="trk-step-line ${line1Class}"></div>
                            <div class="trk-step ${step2Class}">
                                <div class="trk-step-dot"><i class="fas fa-search"></i></div>
                                <span>قيد المراجعة</span>
                            </div>
                            <div class="trk-step-line ${line2Class}"></div>
                            <div class="trk-step ${step3Class}">
                                <div class="trk-step-dot"><i class="fas ${isRejected ? 'fa-times' : 'fa-check'}"></i></div>
                                <span>القرار النهائي</span>
                            </div>
                        </div>
                    </div>
                    <div class="trk-card trk-card-notes">
                        <div class="trk-notes-header">
                            <i class="fas fa-comment-dots"></i>
                            <span>ملاحظات الإدارة</span>
                        </div>
                        <div class="trk-notes-body">${noteHtml}</div>
                    </div>`;
            });
        } else {
            if (noAppMsg) {
                noAppMsg.style.display = 'block';
            }
            if (appStatusInfo) appStatusInfo.style.display = 'none';
        }
    });
}

function clearAllApplications() {
    const firstCheck = confirm("⚠️ تحذير: هل أنت متأكد من مسح جميع الطلبات نهائياً؟");
    
    if (firstCheck) {
        const secondCheck = confirm("❗ هل أنت متأكد حقاً؟ سيتم حذف سجلات جميع المستخدمين ولا يمكن التراجع!");
        
        if (secondCheck) {
            localStorage.removeItem('serverApplications');
            
            localStorage.setItem('job_id_counter', '200');
            
            loadAdminData();
            
            if (typeof showNotification === "function") {
                showNotification("تم تصفير قاعدة البيانات بنجاح", true);
            } else {
                alert("تم تصفير كافة البيانات بنجاح، العداد القادم سيبدأ من PLUS-200");
            }
        }
    }
}


let pendingAction = null; 

function openCustomConfirm(message, title, iconClass, action) {
    document.getElementById('modal-message').innerText = message;
    document.getElementById('modal-title').innerText = title || "تأكيد الإجراء";
    document.getElementById('modal-icon').className = `fa-solid ${iconClass || 'fa-circle-exclamation'} modal-icon`;
    
    const iconElem = document.getElementById('modal-icon');
    if (message.includes("حذف") || message.includes("تصفير")) {
        iconElem.style.color = "#e74c3c";
    } else {
        iconElem.style.color = "#fc7823";
    }

    document.getElementById('confirm-modal').style.display = 'flex';
    pendingAction = action; 
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    pendingAction = null;
}

document.getElementById('confirm-yes').onclick = function() {
    if (pendingAction) {
        pendingAction(); 
    }
    closeConfirmModal();
};

function logoutUser() {
    openCustomConfirm(
        "هل أنت متأكد من رغبتك في تسجيل الخروج؟", 
        "تسجيل الخروج", 
        "fa-sign-out-alt", 
        function() {
            localStorage.removeItem('user');
            localStorage.removeItem('plusdev_user');
            sessionStorage.removeItem('plusdev_user');
            if (typeof showNotification === "function") {
                showNotification("تم تسجيل الخروج بنجاح");
            }

            setTimeout(() => {
                window.location.reload(); 
            }, 800);
        }
    );
}

function executeDecision(appId, status) {
    const noteInput = document.getElementById("admin-note-" + appId);
    const adminNote = noteInput ? noteInput.value.trim() : "";

    database.ref("applications/" + appId).once("value").then(snap => {
        const app = snap.val();
        if (!app) throw new Error("الطلب غير موجود");

        return database.ref("applications/" + appId).update({
            status: status,
            adminNote: adminNote,
            decidedAt: new Date().toLocaleString("ar-SA")
        }).then(async () => {
            // إشعار Firebase للمستخدم
            const userId = app.discordId || app.userId;
            if (userId) {
                const icon = status === "accepted" ? "✅" : "❌";
                const msgLabel = status === "accepted" ? "تم قبول طلبك" : "تم رفض طلبك";
                const noteMsg = adminNote ? (" — ملاحظة الإدارة: " + adminNote) : "";
                database.ref("userNotifications/" + userId + "/" + Date.now()).set({
                    title: icon + " " + msgLabel + " — " + app.job,
                    message: msgLabel + " على وظيفة " + app.job + noteMsg,
                    appId: appId,
                    time: new Date().toLocaleString("ar-SA"),
                    read: false
                });
            }

            // ═══ إرسال رسالة ديسكورد عند القبول/الرفض ═══
            try {
                const isAccepted = status === "accepted";
                // webhook منفصل للرفض
                const decisionWebhook = isAccepted
                    ? CONFIG.WEBHOOKS.staff
                    : (CONFIG.WEBHOOKS.rejected || CONFIG.WEBHOOKS.staff);
                // بيانات الأدمن الحالي
                const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
                const adminName = adminUser.username || adminUser.global_name || 'أدمن';
                const adminId   = adminUser.id || '';
                const adminTag  = adminId ? `<@${adminId}>` : adminName;
                const decisionData = {
                    content: isAccepted
                        ? `✅ **The Order accepted!** — <@${app.discordId}>`
                        : `❌ **The Order rejected!** — <@${app.discordId}>`,
                    embeds: [{
                        title: isAccepted ? '✅ The Order accepted.' : '❌ The Order rejected',
                        color: isAccepted ? 0x2ecc71 : 0xe74c3c,
                        fields: [
                            { name: '👤 Character name', value: '```' + (app.name || '---') + '```', inline: false },
                            { name: '💼 Job',     value: '```' + (app.job  || '---') + '```', inline: false },
                            { name: '🔗 Discord Id',   value: `<@${app.discordId}>`,               inline: false },
                            { name: '📋 Order number',   value: '`' + appId + '`',                  inline: false },
                            { name: '⚖️ Decision',       value: isAccepted ? '✅ **accepted**' : '❌ **rejected**', inline: false },
                            { name: '📅 Decision time',   value: new Date().toLocaleString('ar-SA'), inline: false },
                            { name: '👮 by',       value: adminTag,                            inline: false },
                            ...(adminNote ? [{ name: '📝 Management Note', value: '>>> ' + adminNote, inline: false }] : [])
                        ],
                        footer: { text: `${CONFIG.SERVER_NAME} • Administrative decision` },
                        timestamp: new Date().toISOString()
                    }]
                };
                await fetch(decisionWebhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(decisionData)
                });
            } catch(e) { console.warn('فشل إرسال رسالة القرار للديسكورد', e); }

            closeConfirmModal();
            const statusText = status === "accepted" ? "قبول" : "رفض";
            showNotification("✅ تم " + statusText + " الطلب بنجاح");
        });
    }).catch(error => {
        console.error("خطأ في تحديث الحالة:", error);
        showNotification("حدث خطأ أثناء حفظ القرار", true);
    });
}



/* ============================================
   🛍️ STORE FUNCTIONS
   ============================================ */
function filterProducts(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.product-card').forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = '';
            card.style.animation = 'fadeInUp2 0.4s ease both';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterProductsTab(cat, btn) {
    document.querySelectorAll('#store .laws-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.product-card').forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = '';
            card.style.animation = 'fadeInUp2 0.4s ease both';
        } else {
            card.style.display = 'none';
        }
    });
}

/* ============================================
   🛒 STORE — FULL PURCHASE SYSTEM
   ============================================ */

let _pendingProduct = null; // { name, price, cat, emoji }

// ── فتح modal تفاصيل المنتج ──
function openProductModal(name, price, cat, emoji, desc, featuresStr, oldPrice) {
    document.getElementById('pm-emoji').textContent = emoji;
    document.getElementById('pm-name').textContent = name;
    document.getElementById('pm-desc').textContent = desc;
    document.getElementById('pm-cat-badge').textContent =
        cat === 'systems' ? 'أنظمة متكاملة' :
        cat === 'scripts' ? 'سكربتات' :
        cat === 'maps'    ? 'خرائط وملفات' : 'مجاني';

    // Old price
    const oldEl = document.getElementById('pm-old-price');
    oldEl.textContent = oldPrice || '';

    // Price
    const priceEl = document.getElementById('pm-price');
    if (price === 0) {
        priceEl.textContent = 'مجاني 🎁';
        priceEl.style.color = '#2ecc71';
    } else {
        priceEl.textContent = price + '$';
        priceEl.style.color = '#fc7823';
    }

    // Features
    const featEl = document.getElementById('pm-features');
    featEl.innerHTML = featuresStr.split(',').map(f => f.trim()).filter(Boolean).map(f =>
        `<span class="prod-modal-feature"><i class="fas fa-check"></i>${f}</span>`
    ).join('');

    // Buy button style
    const buyBtn = document.getElementById('pm-buy-btn');
    if (price === 0) {
        buyBtn.innerHTML = '<i class="fas fa-download"></i> تحميل مجاني';
        buyBtn.className = 'prod-modal-buy-btn prod-modal-free-btn';
    } else {
        buyBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> اشتري الآن';
        buyBtn.className = 'prod-modal-buy-btn';
    }

    _pendingProduct = { name, price, cat, emoji };
    document.getElementById('product-modal-overlay').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('product-modal-overlay').style.display = 'none';
}

function triggerBuyFromModal() {
    if (!_pendingProduct) return;
    closeProductModal();
    buyProduct(_pendingProduct.name, _pendingProduct.price, _pendingProduct.cat, _pendingProduct.emoji);
}

// ── نظام الشراء ──
function buyProduct(name, price, cat, emoji) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        showToast('⚠️', 'يجب تسجيل الدخول', 'سجّل دخولك أولاً للشراء');
        setTimeout(() => { window.location.href = 'login.html'; }, 1400);
        return;
    }

    if (price === 0) {
        // تحميل مجاني مباشر
        showToast('✅', 'تم التحميل!', `تم تحميل "${name}" بنجاح`);
        addNotification('success', 'تحميل مجاني', `تم تحميل "${name}" بنجاح`);
        saveFreeDownload(name, emoji, user);
        return;
    }

    // فتح modal التأكيد
    _pendingProduct = { name, price, cat, emoji: emoji || '📦' };
    document.getElementById('purch-step-confirm').style.display = 'block';
    document.getElementById('purch-step-success').style.display = 'none';
    document.getElementById('purch-note').value = '';

    document.getElementById('purch-product-info').innerHTML = `
        <span class="purch-product-emoji">${emoji || '📦'}</span>
        <div>
            <div class="purch-product-name">${name}</div>
            <div class="purch-product-price">${price}$</div>
        </div>
    `;

    // Discord name
    const discordEl = document.getElementById('purch-discord-name');
    discordEl.textContent = `سيتم التواصل مع: ${user.username || user.global_name || 'حسابك'} عبر ديسكورد`;

    document.getElementById('purchase-modal-overlay').style.display = 'flex';
}

function closePurchaseModal() {
    document.getElementById('purchase-modal-overlay').style.display = 'none';
    _pendingProduct = null;
}

async function confirmPurchase() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || !_pendingProduct) return;

    const btn = document.getElementById('purch-confirm-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

    const orderId = 'ORD-' + Date.now().toString().slice(-7);
    const note = document.getElementById('purch-note').value.trim();
    const now = new Date().toLocaleString('ar-SA');

    const orderData = {
        id: orderId,
        productName: _pendingProduct.name,
        productEmoji: _pendingProduct.emoji,
        productCat: _pendingProduct.cat,
        price: _pendingProduct.price,
        userId: user.id,
        userName: user.username || user.global_name || 'مجهول',
        discordId: user.id,
        userAvatar: user.avatar || '',
        note: note || '',
        status: 'pending',
        createdAt: now,
        timestamp: Date.now()
    };

    try {
        await database.ref('orders/' + orderId).set(orderData);

        // ── إشعار ديسكورد webhook ──
        const STORE_WEBHOOK = WEBHOOKS.store;
        fetch(STORE_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: '🛒 طلب شراء جديد',
                    color: 0xfc7823,
                    fields: [
                        { name: '📦 المنتج',     value: _pendingProduct.emoji + ' ' + _pendingProduct.name, inline: true  },
                        { name: '💰 السعر',      value: _pendingProduct.price + '$',                        inline: true  },
                        { name: '🆔 رقم الطلب',  value: '`' + orderId + '`',                               inline: false },
                        { name: '👤 المستخدم',   value: (user.username || user.global_name || 'مجهول'),    inline: true  },
                        { name: '🔖 Discord ID', value: '<@' + user.id + '> `' + user.id + '`',            inline: true  },
                        ...(note ? [{ name: '📝 ملاحظة', value: note, inline: false }] : [])
                    ],
                    footer: { text: 'Plus Dev Store • ' + now },
                    thumbnail: { url: user.avatar ? 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png?size=64' : '' }
                }]
            })
        }).catch(() => {});

        // إشعار للمستخدم
        await database.ref('userNotifications/' + user.id + '/' + Date.now()).set({
            title: '🛒 تم استلام طلبك',
            message: `طلبك على "${_pendingProduct.name}" — ${_pendingProduct.price}$ قيد المعالجة`,
            orderId,
            time: now,
            read: false
        });

        // عرض النجاح
        document.getElementById('purch-step-confirm').style.display = 'none';
        document.getElementById('purch-step-success').style.display = 'block';

        const badge = document.getElementById('purch-order-id');
        badge.innerHTML = `<i class="fas fa-box"></i> ${orderId} <i class="fas fa-copy" style="font-size:0.75rem;opacity:0.6"></i>`;
        badge.onclick = () => {
            navigator.clipboard.writeText(orderId);
            badge.style.background = 'rgba(252,120,35,0.15)';
            badge.style.borderColor = 'rgba(252,120,35,0.4)';
            badge.style.color = '#fc7823';
            setTimeout(() => {
                badge.style.background = '';
                badge.style.borderColor = '';
                badge.style.color = '';
            }, 1500);
        };

        addNotification('success', 'تم استلام طلبك', `رقم الطلب: ${orderId}`);
        showToast('✅', 'تم استلام طلبك!', `رقم الطلب: ${orderId}`);

    } catch(e) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check"></i> تأكيد الطلب';
        showToast('❌', 'فشل الإرسال', 'حاول مرة أخرى');
    }
}

async function saveFreeDownload(name, emoji, user) {
    const orderId = 'DL-' + Date.now().toString().slice(-7);
    const now = new Date().toLocaleString('ar-SA');
    try {
        await database.ref('orders/' + orderId).set({
            id: orderId,
            productName: name,
            productEmoji: emoji || '📦',
            productCat: 'free',
            price: 0,
            userId: user.id,
            userName: user.username || user.global_name || 'مجهول',
            note: '',
            status: 'completed',
            createdAt: now,
            timestamp: Date.now()
        });
    } catch(e) {}
}

// ── عرض طلبات المستخدم في صفحة التتبع ──
function loadMyOrders(userId) {
    const section = document.getElementById('my-orders-section');
    const list = document.getElementById('my-orders-list');
    if (!section || !list) return;

    database.ref('orders').orderByChild('userId').equalTo(userId).on('value', snap => {
        const data = snap.val();
        if (!data) { section.style.display = 'none'; return; }

        const orders = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        section.style.display = 'block';

        const statusMap = {
            pending:   { label: '⏳ قيد المعالجة', color: '#f39c12', bg: 'rgba(243,156,18,0.1)'  },
            completed: { label: '✅ مكتمل',         color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
            cancelled: { label: '❌ ملغي',          color: '#e74c3c', bg: 'rgba(231,76,60,0.1)'  }
        };

        list.innerHTML = orders.map(o => {
            const s = statusMap[o.status] || statusMap.pending;
            return `
            <div style="background:rgba(14,14,16,0.97);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:16px 18px;transition:all 0.3s;">
              <div style="display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="width:44px;height:44px;border-radius:12px;background:rgba(252,120,35,0.1);border:1px solid rgba(252,120,35,0.2);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0">${o.productEmoji}</div>
                  <div>
                    <div style="font-weight:700;font-size:0.95rem">${o.productName}</div>
                    <div style="color:rgba(255,255,255,0.3);font-size:0.75rem;margin-top:2px">${o.createdAt}</div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                  <span style="background:rgba(252,120,35,0.1);color:#fc7823;border-radius:6px;padding:3px 10px;font-size:0.72rem;font-weight:700">${o.id}</span>
                  <span style="font-size:1.1rem;font-weight:900;color:#fc7823">${o.price === 0 ? 'مجاني' : o.price + '$'}</span>
                  <span style="background:${s.bg};color:${s.color};border-radius:6px;padding:3px 10px;font-size:0.72rem;font-weight:700">${s.label}</span>
                </div>
              </div>
              ${o.note ? `<div style="margin-top:10px;color:rgba(255,255,255,0.3);font-size:0.8rem;background:rgba(255,255,255,0.03);border-radius:8px;padding:8px 12px"><i class="fas fa-comment" style="margin-left:5px"></i>${o.note}</div>` : ''}
            </div>`;
        }).join('');
    });
}

// ── طلبات المتجر في لوحة الأدمن ──
let allOrders = [];

function loadOrders() {
    database.ref('orders').orderByChild('timestamp').once('value', snap => {
        const data = snap.val();
        allOrders = data ? Object.values(data).sort((a, b) => b.timestamp - a.timestamp) : [];
        document.getElementById('orders-count-badge').textContent = allOrders.length + ' طلب';
        renderOrders(allOrders);
    });
}

function filterOrders(status, btn) {
    document.querySelectorAll('#orders-admin-filters .adm-filter-btn').forEach(b => b.classList.remove('adm-filter-active'));
    btn.classList.add('adm-filter-active');
    renderOrders(status === 'all' ? allOrders : allOrders.filter(o => o.status === status));
}

function renderOrders(list) {
    const el = document.getElementById('orders-list-admin');
    if (!list.length) {
        el.innerHTML = `<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.25)"><i class="fas fa-box" style="font-size:2rem;display:block;margin-bottom:10px;opacity:0.3"></i>لا يوجد طلبات</div>`;
        return;
    }

    const statusMap = {
        pending:   { label: 'قيد المعالجة', color: '#f39c12', bg: 'rgba(243,156,18,0.12)'  },
        completed: { label: 'مكتمل',         color: '#2ecc71', bg: 'rgba(46,204,113,0.12)' },
        cancelled: { label: 'ملغي',          color: '#e74c3c', bg: 'rgba(231,76,60,0.12)'  }
    };

    el.innerHTML = list.map(o => {
        const s = statusMap[o.status] || statusMap.pending;
        return `
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 16px;margin-bottom:8px">
          <div style="display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:1.6rem">${o.productEmoji}</span>
              <div>
                <div style="font-weight:700;font-size:0.9rem">${o.productName}</div>
                <div style="color:rgba(255,255,255,0.3);font-size:0.75rem;margin-top:2px">${o.userName} · ${o.createdAt}</div>
                <div style="color:rgba(252,120,35,0.6);font-size:0.72rem;margin-top:2px;display:flex;align-items:center;gap:4px"><i class="fab fa-discord" style="color:#5865f2"></i> <code style="background:rgba(88,101,242,0.1);border:1px solid rgba(88,101,242,0.2);border-radius:4px;padding:1px 6px;color:#a0a9ff;font-size:0.7rem">${o.discordId || o.userId || '—'}</code></div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span style="background:rgba(252,120,35,0.1);color:#fc7823;border-radius:6px;padding:2px 10px;font-size:0.72rem;font-weight:700">${o.id}</span>
              <span style="font-weight:900;color:#fc7823">${o.price === 0 ? 'مجاني' : o.price + '$'}</span>
              <span style="background:${s.bg};color:${s.color};border-radius:6px;padding:3px 10px;font-size:0.72rem;font-weight:700">${s.label}</span>
              ${o.status === 'pending' ? `
              <button onclick="updateOrderStatus('${o.id}','completed')" style="background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.2);color:#2ecc71;padding:5px 12px;border-radius:7px;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:0.78rem"><i class="fas fa-check"></i> إتمام</button>
              <button onclick="updateOrderStatus('${o.id}','cancelled')" style="background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.2);color:#e74c3c;padding:5px 12px;border-radius:7px;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:0.78rem"><i class="fas fa-times"></i> إلغاء</button>` : ''}
              <button onclick="deleteOrder('${o.id}')" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.3);padding:5px 10px;border-radius:7px;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:0.78rem"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          ${o.note ? `<div style="margin-top:8px;color:rgba(255,255,255,0.3);font-size:0.78rem;background:rgba(255,255,255,0.02);border-radius:7px;padding:7px 10px"><i class="fas fa-comment" style="margin-left:5px"></i>${o.note}</div>` : ''}
        </div>`;
    }).join('');
}

async function updateOrderStatus(orderId, newStatus) {
    await database.ref('orders/' + orderId).update({ status: newStatus });
    const order = allOrders.find(o => o.id === orderId);
    if (order && order.userId) {
        const now = new Date().toLocaleString('ar-SA');
        const msgMap = { completed: 'تم إتمام طلبك ✅', cancelled: 'تم إلغاء طلبك ❌' };
        await database.ref('userNotifications/' + order.userId + '/' + Date.now()).set({
            title: msgMap[newStatus] || 'تحديث الطلب',
            message: `طلبك على "${order.productName}" — ${newStatus === 'completed' ? 'اكتمل' : 'ألغي'}`,
            orderId,
            time: now,
            read: false
        });
    }
    showNotification(newStatus === 'completed' ? '✅ تم إتمام الطلب' : '❌ تم إلغاء الطلب');
    loadOrders();
}

async function deleteOrder(orderId) {
    openCustomConfirm('هل تريد حذف هذا الطلب؟', 'حذف الطلب', 'fa-trash', async () => {
        await database.ref('orders/' + orderId).remove();
        allOrders = allOrders.filter(o => o.id !== orderId);
        showNotification('🗑️ تم حذف الطلب');
        closeConfirmModal();
        loadOrders();
    });
}

/* ============================================
   🔔 NOTIFICATION SYSTEM
   ============================================ */
let notifications = JSON.parse(localStorage.getItem('pd_notifs') || '[]');

function initNotifications() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const bell = document.getElementById('notif-bell');
    if (bell) bell.style.display = user ? 'flex' : 'none';
    renderNotifs();
}

function addNotification(type, title, msg) {
    if (!title || !msg) return; // تجاهل الإشعارات الفارغة

    // منع التكرار خلال ثانية واحدة
    const isDuplicate = notifications.some(n =>
        n.title === title && n.msg === msg && (Date.now() - n.id) < 1000
    );
    if (isDuplicate) return;

    const notif = {
        id: Date.now(),
        type: type || 'info',
        title,
        msg,
        time: new Date().toLocaleTimeString('ar', {hour:'2-digit', minute:'2-digit'}),
        read: false
    };
    notifications.unshift(notif);
    if (notifications.length > 30) notifications = notifications.slice(0, 30);
    saveNotifs();
    renderNotifs();
    showToast(
        type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '❌' : 'ℹ️',
        title, msg
    );
}

function renderNotifs() {
    const list = document.getElementById('notif-list');
    const count = document.getElementById('notif-count');
    const empty = document.getElementById('notif-empty');
    if (!list) return;

    const unread = notifications.filter(n => !n.read).length;

    if (count) {
        if (unread > 0) {
            count.style.display = 'flex';
            count.textContent = unread > 9 ? '9+' : unread;
        } else {
            count.style.display = 'none';
        }
    }

    const items = list.querySelectorAll('.notif-item');
    items.forEach(i => i.remove());

    if (notifications.length === 0) {
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    notifications.forEach(n => {
        const el = document.createElement('div');
        el.className = `notif-item${n.read ? '' : ' unread'}`;
        el.onclick = () => markRead(n.id);
        const iconMap = { success:'fa-check', info:'fa-info', warning:'fa-exclamation', danger:'fa-times' };
        el.innerHTML = `
            <div class="notif-icon ${n.type}"><i class="fas ${iconMap[n.type]||'fa-bell'}"></i></div>
            <div class="notif-text">
                <div class="notif-title">${n.title}</div>
                <div class="notif-msg">${n.msg}</div>
                <div class="notif-time">${n.time}</div>
            </div>`;
        list.appendChild(el);
    });
}

function markRead(id) {
    const n = notifications.find(n => n.id === id);
    if (n) { n.read = true; saveNotifs(); renderNotifs(); }
}

function clearAllNotifs(e) {
    e.stopPropagation();
    notifications = [];
    saveNotifs();
    renderNotifs();
}

function saveNotifs() {
    localStorage.setItem('pd_notifs', JSON.stringify(notifications));
}

function toggleNotifDropdown(e) {
    e.stopPropagation();
    const dd = document.getElementById('notif-dropdown');
    if (!dd) return;
    dd.classList.toggle('open');
    // mark all as read when opened
    if (dd.classList.contains('open')) {
        notifications.forEach(n => n.read = true);
        saveNotifs();
        renderNotifs();
    }
}

document.addEventListener('click', function(e) {
    const dd = document.getElementById('notif-dropdown');
    const bell = document.getElementById('notif-bell');
    if (dd && bell && !bell.contains(e.target)) {
        dd.classList.remove('open');
    }
    // close mobile menu too
    const navLinks = document.getElementById('nav-links');
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (navLinks && menuBtn && !menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        const icon = document.getElementById('menu-icon');
        if (icon) { icon.className = 'fas fa-bars'; }
    }
});

// Add notif for job status changes (demo: watch localStorage)
function notifyJobStatus(jobName, status) {
    const type = status === 'مقبول' ? 'success' : status === 'مرفوض' ? 'danger' : 'info';
    addNotification(type, 'تحديث طلب وظيفة', `طلبك على ${jobName}: ${status}`);
}

/* ============================================
   📱 MOBILE MENU
   ============================================ */
function toggleMobileMenu() {
    const nav = document.getElementById('nav-links');
    const icon = document.getElementById('menu-icon');
    if (!nav) return;
    nav.classList.toggle('mobile-open');
    if (icon) {
        icon.className = nav.classList.contains('mobile-open') ? 'fas fa-times' : 'fas fa-bars';
    }
}

// Show mobile menu button on small screens
function checkMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;
    btn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
}
window.addEventListener('resize', checkMobileMenu);
window.addEventListener('load', checkMobileMenu);

/* ============================================
   🍞 TOAST NOTIFICATION
   ============================================ */
let toastTimer;
function showToast(icon, title, msg, type = 'info') {
    const t = document.getElementById('toast-notif');
    if (!t) return;

    // تحديد النوع من الأيقونة تلقائياً إذا لم يُحدَّد
    if (type === 'info') {
        if (icon === '✅') type = 'success';
        else if (icon === '⚠️') type = 'warning';
        else if (icon === '❌') type = 'error';
    }

    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-msg').textContent = msg;

    // تطبيق اللون حسب النوع
    t.dataset.type = type;

    t.classList.remove('show');
    void t.offsetWidth; // إعادة تشغيل الأنيميشن
    t.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3800);
}

/* ============================================
   🔗 NOTIFICATIONS AFTER LOGIN
   ============================================ */
function initLoginNotification(user) {
    initNotifications();
    const welcomed = sessionStorage.getItem('pd_welcomed');
    if (user && !welcomed) {
        sessionStorage.setItem('pd_welcomed', '1');
        setTimeout(() => {
            addNotification('success', `مرحباً ${user.name || user.username || user.global_name || ''}! 👋`, 'تم تسجيل دخولك بنجاح');
        }, 800);
    }
}

// ════ Init on load (موحّد) ════
window.addEventListener('load', () => {
    checkMobileMenu();
    initNotifications();
    loadAdminIds();
});


/* ============================================
   🛡️ إدارة الأدمنز من لوحة التحكم
   ============================================ */

function renderAdminIds() {
    const list = document.getElementById('admin-ids-list');
    if (!list) return;

    database.ref('adminIds').once('value', (snap) => {
        const data = snap.val() || {};
        list.innerHTML = '';

        if (Object.keys(data).length === 0) {
            list.innerHTML = '<p style="color:#666;text-align:center;padding:10px;">لا يوجد أدمنز مضافين</p>';
            return;
        }

        Object.entries(data).forEach(([key, admin]) => {
            const row = document.createElement('div');
            row.className = 'admin-id-row';
            row.innerHTML = `
                <div class="admin-id-info">
                    <img src="${admin.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" class="admin-id-avatar">
                    <div>
                        <div class="admin-id-name">${admin.name || 'غير معروف'}</div>
                        <div class="admin-id-num">${admin.id}</div>
                    </div>
                </div>
                <button class="admin-id-del" onclick="removeAdminId('${key}', '${admin.id}')">
                    <i class="fas fa-trash"></i>
                </button>`;
            list.appendChild(row);
        });
    });
}

function addAdminId() {
    const input = document.getElementById('new-admin-id');
    const newId = input ? input.value.trim() : '';
    if (!newId) { showToast('⚠️', 'تنبيه', 'أدخل الـ ID أولاً'); return; }
    if (!/^\d{15,20}$/.test(newId)) { showToast('⚠️', 'خطأ', 'الـ ID يجب أن يكون أرقام فقط (15-20 رقم)'); return; }

    // ابحث عن بيانات المستخدم إذا موجود
    database.ref('adminIds').orderByChild('id').equalTo(newId).once('value', (snap) => {
        if (snap.val()) { showToast('⚠️', 'موجود مسبقاً', 'هذا الـ ID مضاف مسبقاً'); return; }

        // ابحث عنه في طلبات التوظيف لجلب اسمه وصورته
        const discordData = JSON.parse(localStorage.getItem('pd_discord_users') || '{}');
        const userInfo = discordData[newId] || null;

        database.ref('adminIds').push({
            id: newId,
            name: userInfo ? userInfo.name : 'Admin',
            avatar: userInfo ? userInfo.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png',
            addedAt: Date.now()
        }).then(() => {
            showToast('✅', 'تم الإضافة', `تم إضافة الـ ID بنجاح`);
            if (input) input.value = '';
            renderAdminIds();
        });
    });
}

function removeAdminId(key, adminId) {
    const me = JSON.parse(localStorage.getItem('user') || 'null');
    if (me && me.id === adminId) {
        showToast('⚠️', 'تنبيه', 'لا تستطيع حذف نفسك!');
        return;
    }
    openCustomConfirm(
        'هل أنت متأكد من حذف هذا الأدمن؟',
        'حذف أدمن',
        'fa-trash',
        function() {
            database.ref('adminIds/' + key).remove().then(() => {
                showToast('✅', 'تم الحذف', 'تم حذف الأدمن بنجاح');
                renderAdminIds();
                closeConfirmModal();
            });
        }
    );
}



// ============================================
// نظام التذاكر الكامل — Firebase
// ============================================
const TICKET_WEBHOOK = WEBHOOKS.tickets;
let selectedTktType = '🚨 مشكلة تقنية';
let currentReplyTicketId = null;
let allTickets = [];

function openTicketModal() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) { showNotification('⚠️ يرجى تسجيل الدخول أولاً', true); return; }
    document.getElementById('tkt-subject').value = '';
    document.getElementById('tkt-body').value = '';
    document.getElementById('tkt-form').style.display = 'block';
    document.getElementById('tkt-success').style.display = 'none';
    document.getElementById('tkt-send-btn').disabled = false;
    document.getElementById('tkt-send-btn').innerHTML = '<i class="fas fa-paper-plane"></i> إرسال';
    selectedTktType = '🚨 مشكلة تقنية';
    document.querySelectorAll('.tkt-opt').forEach((el,i) => el.classList.toggle('sel', i===0));
    document.getElementById('ticket-modal-overlay').style.display = 'flex';
    checkUserTicketReplies(user.id);
}

function closeTicketModal() {
    document.getElementById('ticket-modal-overlay').style.display = 'none';
}

function selTkt(el, type) {
    document.querySelectorAll('.tkt-opt').forEach(o => o.classList.remove('sel'));
    el.classList.add('sel');
    selectedTktType = type;
}

async function submitTicket() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const subject = document.getElementById('tkt-subject').value.trim();
    const body = document.getElementById('tkt-body').value.trim();
    if (!subject || !body) { showNotification('❗ يرجى تعبئة جميع الحقول', true); return; }

    const btn = document.getElementById('tkt-send-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

    const ticketId = 'TKT-' + Date.now().toString().slice(-6);
    const now = new Date().toLocaleString('ar-SA');

    const ticketData = {
        id: ticketId,
        userId: user.id,
        userName: user.name || 'لاعب',
        userAvatar: user.avatar || '',
        type: selectedTktType,
        subject, body,
        status: 'open',
        createdAt: now,
        timestamp: Date.now(),
        adminReply: null,
        repliedAt: null
    };

    try {
        await database.ref('tickets/' + ticketId).set(ticketData);

        await fetch(TICKET_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                embeds: [{
                    title: `🎫 تذكرة جديدة — ${ticketId}`,
                    color: 0xfc7823,
                    fields: [
                        { name: '👤 اللاعب', value: `**${user.name}**\nID: \`${user.id}\``, inline: true },
                        { name: '📂 النوع', value: selectedTktType, inline: true },
                        { name: '📌 العنوان', value: subject, inline: false },
                        { name: '📝 التفاصيل', value: body, inline: false },
                        { name: '🕐 الوقت', value: now, inline: true },
                    ],
                    footer: { text: 'Plus Dev Support — ارد من لوحة الإدمن في الموقع' },
                    timestamp: new Date().toISOString()
                }]
            })
        });

        document.getElementById('tkt-form').style.display = 'none';
        document.getElementById('tkt-success').style.display = 'block';
        document.getElementById('tkt-success-num').textContent = 'رقم تذكرتك: ' + ticketId;
        document.getElementById('tkt-notif-hint').style.display = 'block';

    } catch(e) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال';
        showNotification('❌ فشل الإرسال', true);
    }
}

function loadTickets() {
    const list = document.getElementById('tickets-list-admin');
    if (!list) return;
    list.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.3)"><i class="fas fa-spinner fa-spin" style="font-size:1.5rem"></i></div>';

    database.ref('tickets').orderByChild('timestamp').once('value', snap => {
        const data = snap.val();
        if (!data) {
            list.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.25)"><i class="fas fa-ticket-alt" style="font-size:2rem;display:block;margin-bottom:10px;opacity:0.3"></i>لا يوجد تذاكر حتى الآن</div>';
            document.getElementById('tickets-count-badge').textContent = '0 تذكرة';
            return;
        }
        allTickets = Object.values(data).sort((a,b) => b.timestamp - a.timestamp);
        document.getElementById('tickets-count-badge').textContent = allTickets.length + ' تذكرة';
        renderTickets(allTickets);
    });
}

function renderTickets(tickets) {
    const list = document.getElementById('tickets-list-admin');
    if (!list) return;
    if (!tickets.length) {
        list.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,0.25)">لا توجد تذاكر بهذه الفئة</div>';
        return;
    }
    list.innerHTML = tickets.map(t => {
        const isOpen = t.status === 'open';
        const statusColor = isOpen ? '#3498db' : '#2ecc71';
        const statusBg = isOpen ? 'rgba(52,152,219,0.1)' : 'rgba(46,204,113,0.1)';
        const statusText = isOpen ? '🔵 مفتوحة' : '✅ مغلقة';
        return `
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 16px;margin-bottom:8px">
          <div style="display:flex;align-items:flex-start;gap:12px">
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
                <span style="background:rgba(252,120,35,0.1);color:#fc7823;border-radius:6px;padding:2px 10px;font-size:0.72rem;font-weight:700">${t.id}</span>
                <span style="background:${statusBg};color:${statusColor};border-radius:6px;padding:2px 10px;font-size:0.72rem;font-weight:700">${statusText}</span>
                <span style="background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.4);border-radius:6px;padding:2px 10px;font-size:0.72rem">${t.type}</span>
              </div>
              <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px">${t.subject}</div>
              <div style="color:rgba(255,255,255,0.4);font-size:0.8rem;margin-bottom:6px">${t.body.length > 80 ? t.body.slice(0,80)+'...' : t.body}</div>
              <div style="display:flex;gap:10px">
                <span style="color:rgba(255,255,255,0.3);font-size:0.75rem"><i class="fas fa-user" style="margin-left:4px"></i>${t.userName}</span>
                <span style="color:rgba(255,255,255,0.25);font-size:0.75rem"><i class="fas fa-clock" style="margin-left:4px"></i>${t.createdAt}</span>
              </div>
              ${t.adminReply ? `<div style="margin-top:10px;background:rgba(46,204,113,0.06);border:1px solid rgba(46,204,113,0.2);border-radius:8px;padding:10px 12px;font-size:0.82rem;color:#a8e6c3"><i class="fas fa-reply" style="margin-left:6px;color:#2ecc71"></i><strong style="color:#2ecc71">رد الإدمن:</strong> ${t.adminReply}</div>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">
              ${isOpen ? `<button onclick="openReplyModal('${t.id}')" style="background:linear-gradient(135deg,#3498db,#2980b9);border:none;color:white;padding:8px 14px;border-radius:8px;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:0.8rem;font-weight:700"><i class="fas fa-reply" style="margin-left:5px"></i>رد</button>` : ''}
              <button onclick="deleteTicket('${t.id}')" style="background:rgba(231,76,60,0.1);border:1px solid rgba(231,76,60,0.2);color:#e74c3c;padding:8px 14px;border-radius:8px;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:0.8rem"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>`;
    }).join('');
}

function filterTickets(status, btn) {
    document.querySelectorAll('#tkt-admin-filters .adm-filter-btn').forEach(b => b.classList.remove('adm-filter-active'));
    btn.classList.add('adm-filter-active');
    if (status === 'all') renderTickets(allTickets);
    else renderTickets(allTickets.filter(t => t.status === status));
}

function openReplyModal(ticketId) {
    currentReplyTicketId = ticketId;
    const ticket = allTickets.find(t => t.id === ticketId);
    if (!ticket) return;
    document.getElementById('reply-ticket-info').innerHTML = `
        <strong style="color:white">${ticket.subject}</strong><br>
        <span style="color:rgba(255,255,255,0.4)">${ticket.userName} — ${ticket.type}</span>`;
    document.getElementById('reply-body').value = '';
    document.getElementById('reply-modal-overlay').style.display = 'flex';
}

function closeReplyModal() {
    document.getElementById('reply-modal-overlay').style.display = 'none';
    currentReplyTicketId = null;
}

async function sendAdminReply() {
    if (!currentReplyTicketId) return;
    const reply = document.getElementById('reply-body').value.trim();
    if (!reply) { showNotification('❗ اكتب الرد أولاً', true); return; }

    const btn = document.getElementById('send-reply-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري...';

    const ticket = allTickets.find(t => t.id === currentReplyTicketId);
    const now = new Date().toLocaleString('ar-SA');

    try {
        await database.ref('tickets/' + currentReplyTicketId).update({
            adminReply: reply, repliedAt: now, status: 'closed'
        });
        await database.ref('userNotifications/' + ticket.userId + '/' + Date.now()).set({
            title: '💬 رد على تذكرتك',
            message: `تذكرة (${currentReplyTicketId}): ${reply}`,
            ticketId: currentReplyTicketId,
            time: now, read: false
        });
        showNotification('✅ تم إرسال الرد!');
        closeReplyModal();
        loadTickets();
    } catch(e) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرد';
        showNotification('❌ فشل الإرسال', true);
    }
}

async function closeTicketByAdmin() {
    if (!currentReplyTicketId) return;
    await database.ref('tickets/' + currentReplyTicketId).update({ status: 'closed' });
    showNotification('✅ تم إغلاق التذكرة');
    closeReplyModal();
    loadTickets();
}

async function deleteTicket(ticketId) {
    openCustomConfirm('هل تريد حذف هذه التذكرة؟', 'حذف التذكرة', 'fa-trash', async () => {
        await database.ref('tickets/' + ticketId).remove();
        allTickets = allTickets.filter(t => t.id !== ticketId);
        showNotification('🗑️ تم حذف التذكرة');
        closeConfirmModal();
        loadTickets();
    });
}

function checkUserTicketReplies(userId) {
    database.ref('userNotifications/' + userId).orderByChild('read').equalTo(false).once('value', snap => {
        const data = snap.val();
        if (!data) return;
        Object.entries(data).forEach(([key, notif]) => {
            showNotification(notif.title + ' — ' + notif.message);
            database.ref('userNotifications/' + userId + '/' + key).update({ read: true });
        });
    });
}

// ── تحميل التذاكر تلقائياً عند فتح لوحة الإدمن ──
// loadTickets و loadOrders يُستدعيان من showPage مباشرة

// ── تحميل تذاكر المستخدم في صفحة التتبع ──
function loadMyTickets(userId) {
    const section = document.getElementById('my-tickets-section');
    const list = document.getElementById('my-tickets-list');
    if (!section || !list) return;

    database.ref('tickets').orderByChild('userId').equalTo(userId).on('value', snap => {
        const data = snap.val();

        if (!data) {
            section.style.display = 'none';
            return;
        }

        const tickets = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        section.style.display = 'block';

        list.innerHTML = tickets.map(t => {
            const isOpen = t.status === 'open';
            const hasReply = !!t.adminReply;

            return `
            <div style="background:rgba(16,16,20,0.95);border:1px solid ${hasReply ? 'rgba(46,204,113,0.3)' : 'rgba(255,255,255,0.07)'};border-radius:16px;padding:18px 20px;transition:all 0.3s;${hasReply ? 'box-shadow:0 0 20px rgba(46,204,113,0.08)' : ''}">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px">
                <div style="display:flex;align-items:center;gap:10px">
                  <div style="width:36px;height:36px;border-radius:10px;background:rgba(252,120,35,0.1);border:1px solid rgba(252,120,35,0.2);display:flex;align-items:center;justify-content:center;color:#fc7823;font-size:0.9rem;flex-shrink:0">
                    <i class="fas fa-ticket-alt"></i>
                  </div>
                  <div>
                    <div style="font-weight:700;font-size:0.92rem">${t.subject}</div>
                    <div style="color:rgba(255,255,255,0.35);font-size:0.75rem;margin-top:2px">${t.type} · ${t.createdAt}</div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
                  <span style="background:rgba(252,120,35,0.1);color:#fc7823;border-radius:6px;padding:3px 10px;font-size:0.72rem;font-weight:700">${t.id}</span>
                  <span style="background:${isOpen ? 'rgba(52,152,219,0.1)' : 'rgba(46,204,113,0.1)'};color:${isOpen ? '#3498db' : '#2ecc71'};border-radius:6px;padding:3px 10px;font-size:0.72rem;font-weight:700">
                    ${isOpen ? '🔵 مفتوحة' : '✅ مغلقة'}
                  </span>
                </div>
              </div>

              <!-- نص المشكلة -->
              <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:12px 14px;font-size:0.84rem;color:rgba(255,255,255,0.5);margin-bottom:${hasReply ? '12px' : '0'}">
                ${t.body}
              </div>

              <!-- رد الإدمن -->
              ${hasReply ? `
              <div style="background:rgba(46,204,113,0.06);border:1px solid rgba(46,204,113,0.2);border-radius:10px;padding:14px 16px;margin-top:4px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                  <div style="width:28px;height:28px;border-radius:50%;background:rgba(46,204,113,0.15);display:flex;align-items:center;justify-content:center">
                    <i class="fas fa-shield-alt" style="color:#2ecc71;font-size:0.75rem"></i>
                  </div>
                  <div>
                    <span style="color:#2ecc71;font-weight:700;font-size:0.82rem">رد الإدارة</span>
                    <span style="color:rgba(255,255,255,0.3);font-size:0.72rem;margin-right:8px">${t.repliedAt || ''}</span>
                  </div>
                </div>
                <p style="margin:0;color:#c8f0d0;font-size:0.88rem;line-height:1.6">${t.adminReply}</p>
              </div>` : `
              <div style="margin-top:10px;display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.25);font-size:0.8rem">
                <i class="fas fa-clock"></i> في انتظار رد الإدارة...
              </div>`}
            </div>`;
        }).join('');
    });
}

// ===== Tutorials Tabs =====
function showTutSection(sectionId, clickedTab) {
  // Only affect tut- sections to avoid conflicting with law sections
  document.querySelectorAll('#tutorials .law-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  document.querySelectorAll('#tutorials .laws-tab').forEach(btn => btn.classList.remove('active'));
  if (clickedTab) clickedTab.classList.add('active');
}

// ===== Jobs Tabs =====
function showJobSection(sectionId, clickedTab) {
  document.querySelectorAll('#jobs .law-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  document.querySelectorAll('#jobs .laws-tab').forEach(btn => btn.classList.remove('active'));
  if (clickedTab) clickedTab.classList.add('active');
}

// ============================================
// Scroll Reveal Animation
// ============================================
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.feature-card-v2, .update-card-v2, .job-card-new, .tutorial-card-new, .law-item-new'
  );

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// Re-run reveal when switching pages
const _origShowPageReveal = window.showPage || showPage;
window.showPage = function(pageId) {
  _origShowPageReveal(pageId);
  setTimeout(initScrollReveal, 300);
};

// Run on first load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initScrollReveal, 500);
});

// ===== Tracking Tabs =====
function showTrkSection(sectionId, clickedTab) {
  document.querySelectorAll('#tracking-page .law-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  document.querySelectorAll('#tracking-page .laws-tab').forEach(b => b.classList.remove('active'));
  if (clickedTab) clickedTab.classList.add('active');
}

// ===== Back To Top + Scroll Progress =====
window.addEventListener('scroll', function() {
  // Back to top
  const btn = document.getElementById('back-to-top');
  if (btn) btn.classList.toggle('visible', window.scrollY > 300);

  // Scroll progress
  const prog = document.getElementById('scroll-progress');
  if (prog) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? window.scrollY / total : 0;
    prog.style.transform = `scaleX(${1 - pct})`;
  }

  // Navbar scroll effect
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// تشغيل نظام الوظائف
displayJobsPage();

// تشغيل نظام السرقات
displayRobberiesPage();

// تحديث الملف الشخصي
updateUserProfileDisplay();