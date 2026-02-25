/* ============================================================
   Plus Dev — FiveM Profile Integration v2.1
   تم إصلاح مشكلة Mixed Content عبر Cloudflare Worker
   ============================================================ */

const FIVEM_CONFIG = {
    // ← بعد رفع الـ Worker، غيّر هذا الرابط لرابطك
    // مثال: 'https://plusdev-proxy.YOUR-NAME.workers.dev'
    proxyUrl: 'https://muddy-pond-3125.saif4syr33.workers.dev/',

    // مفتاح API — نفس اللي في server.lua وcloudflare-worker.js
    apiKey: 'Seif_2025_Secure',
};

/* ─── جيب بيانات اللاعب عبر الـ Proxy ─── */
async function fetchPlayerFromFiveM(discordId) {
    if (!discordId) return null;
    const cleanId = discordId.replace('discord:', '');

    try {
        const res = await fetch(
            `${FIVEM_CONFIG.proxyUrl}/player?discord=${encodeURIComponent(cleanId)}`,
            {
                headers: { 'x-api-key': FIVEM_CONFIG.apiKey },
                signal: AbortSignal.timeout(10000)
            }
        );
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        return data.success ? data : null;
    } catch (err) {
        console.warn('[PlusDev] FiveM error:', err.message);
        return null;
    }
}

/* ─── جيب عدد الأونلاين ─── */
async function fetchOnlinePlayers() {
    try {
        const res = await fetch(`${FIVEM_CONFIG.proxyUrl}/online`, {
            headers: { 'x-api-key': FIVEM_CONFIG.apiKey },
            signal: AbortSignal.timeout(5000)
        });
        return await res.json();
    } catch { return null; }
}

/* ─── ألوان الوظائف ─── */
const JOB_COLORS = {
    police    : { color:'#3498db', bg:'rgba(52,152,219,0.12)',  icon:'fa-shield-alt' },
    ambulance : { color:'#2ecc71', bg:'rgba(46,204,113,0.12)',  icon:'fa-briefcase-medical' },
    mechanic  : { color:'#f39c12', bg:'rgba(243,156,18,0.12)',  icon:'fa-wrench' },
    realestate: { color:'#9b59b6', bg:'rgba(155,89,182,0.12)',  icon:'fa-building' },
    cardealer : { color:'#1abc9c', bg:'rgba(26,188,156,0.12)',  icon:'fa-car' },
    default   : { color:'#fc7823', bg:'rgba(252,120,35,0.12)',  icon:'fa-briefcase' },
};
const fmt = n => Number(n || 0).toLocaleString('ar-SA');
function getJobStyle(j) { return JOB_COLORS[j] || JOB_COLORS.default; }

/* ─── Vital bar ─── */
function buildVitalBar(label, icon, pct, cls) {
    const color = cls.includes('hunger') ? '#f39c12' : cls.includes('thirst') ? '#3498db' : '#e74c3c';
    return `<div class="fivem-vital-item">
      <span class="fivem-vital-label"><i class="fas ${icon}"></i> ${label}</span>
      <div class="fivem-vital-bar"><div class="fivem-vital-fill ${cls}" style="width:${pct}%"></div></div>
      <span class="fivem-vital-pct" style="color:${color}">${pct}%</span>
    </div>`;
}

/* ─── Profile Card HTML ─── */
function buildProfileHTML(player, user) {
    const job    = getJobStyle(player.job_name);
    const avatar = user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png';
    const hunger = Math.min(Math.round(player.hunger), 100);
    const thirst = Math.min(Math.round(player.thirst), 100);
    const stress = Math.min(Math.round(player.stress),  100);

    return `
    <div class="fivem-profile-card">
      <div class="fivem-card-header">
        <div class="fivem-avatar-wrap">
          <img src="${avatar}" alt="avatar" class="fivem-avatar"
               onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
          ${player.online ? '<span class="fivem-online-dot" title="داخل السيرفر"></span>' : ''}
        </div>
        <div class="fivem-header-info">
          <h2 class="fivem-char-name">${player.name}</h2>
          <span class="fivem-job-badge"
                style="background:${job.bg};color:${job.color};border-color:${job.color}44;">
            <i class="fas ${job.icon}"></i> ${player.job}
            ${player.job_grade ? `<small>— ${player.job_grade}</small>` : ''}
          </span>
          <p class="fivem-citizen-id">
            <i class="fas fa-id-card"></i> Citizen ID: <code>${player.citizenid}</code>
          </p>
          <span class="fivem-server-badge ${player.online ? 'online' : 'offline'}">
            <i class="fas fa-circle"></i>
            ${player.online ? 'داخل السيرفر الآن' : 'خارج السيرفر'}
          </span>
        </div>
      </div>

      <div class="fivem-stats-grid">
        <div class="fivem-stat-card fivem-stat-cash">
          <div class="fivem-stat-icon"><i class="fas fa-money-bill-wave"></i></div>
          <div class="fivem-stat-info">
            <span class="fivem-stat-label">كاش</span>
            <span class="fivem-stat-value">$${fmt(player.cash)}</span>
          </div>
        </div>
        <div class="fivem-stat-card fivem-stat-bank">
          <div class="fivem-stat-icon"><i class="fas fa-university"></i></div>
          <div class="fivem-stat-info">
            <span class="fivem-stat-label">بنك</span>
            <span class="fivem-stat-value">$${fmt(player.bank)}</span>
          </div>
        </div>
        <div class="fivem-stat-card fivem-stat-time">
          <div class="fivem-stat-icon"><i class="fas fa-clock"></i></div>
          <div class="fivem-stat-info">
            <span class="fivem-stat-label">وقت اللعب</span>
            <span class="fivem-stat-value">${player.playtime}</span>
          </div>
        </div>
        <div class="fivem-stat-card fivem-stat-phone">
          <div class="fivem-stat-icon"><i class="fas fa-phone"></i></div>
          <div class="fivem-stat-info">
            <span class="fivem-stat-label">رقم الهاتف</span>
            <span class="fivem-stat-value">${player.phone || 'غير محدد'}</span>
          </div>
        </div>
      </div>

      <div class="fivem-vitals">
        ${buildVitalBar('جوع', 'fa-utensils', hunger, 'fivem-vital-hunger')}
        ${buildVitalBar('عطش', 'fa-tint',     thirst, 'fivem-vital-thirst')}
        ${buildVitalBar('ضغط', 'fa-brain',    stress, 'fivem-vital-stress')}
      </div>

      <div class="fivem-card-footer">
        <span class="fivem-nationality">
          <i class="fas fa-globe"></i> ${player.nationality || 'غير محدد'}
        </span>
        <button class="fivem-refresh-btn" onclick="loadFiveMProfile()">
          <i class="fas fa-sync-alt"></i> تحديث
        </button>
      </div>
    </div>`;
}

/* ─── Skeleton Loading ─── */
function buildSkeletonHTML() {
    return `<div class="fivem-skeleton-card">
      <div class="fivem-skeleton-header">
        <div class="sk-circle"></div>
        <div class="sk-lines">
          <div class="sk-line w60"></div>
          <div class="sk-line w40"></div>
          <div class="sk-line w30"></div>
        </div>
      </div>
      <div class="sk-grid">
        ${[1,2,3,4].map(()=>`
          <div class="sk-stat">
            <div class="sk-icon"></div>
            <div class="sk-lines">
              <div class="sk-line w50"></div>
              <div class="sk-line w70"></div>
            </div>
          </div>`).join('')}
      </div>
      <div class="sk-vitals">
        ${[1,2,3].map(()=>`
          <div class="sk-vital">
            <div class="sk-line w20"></div>
            <div class="sk-bar"></div>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ─── Error state ─── */
function buildErrorHTML(title, sub, showRetry = true) {
    return `<div class="fivem-not-found">
      <i class="fas fa-plug" style="color:rgba(231,76,60,0.5)"></i>
      <h3>${title}</h3>
      <p>${sub}</p>
      ${showRetry ? `<button class="fivem-retry-btn" onclick="loadFiveMProfile()">
        <i class="fas fa-redo"></i> إعادة المحاولة
      </button>` : ''}
    </div>`;
}

/* ════════════════════════════════════════
   الدالة الرئيسية
════════════════════════════════════════ */
async function loadFiveMProfile() {
    const section = document.getElementById('fivem-profile-section');
    if (!section) return;

    // تحقق من تسجيل الدخول
    const savedUser = JSON.parse(
        localStorage.getItem('plusdev_user') ||
        localStorage.getItem('user') || 'null'
    );

    if (!savedUser || !savedUser.id) {
        section.innerHTML = `<div class="fivem-not-logged">
          <i class="fas fa-lock"></i>
          <p>سجّل دخولك عبر ديسكورد لعرض ملفك في اللعبة</p>
        </div>`;
        return;
    }

    // تحقق إن الـ Proxy مضبوط
    if (FIVEM_CONFIG.proxyUrl.includes('YOUR-NAME')) {
        section.innerHTML = buildErrorHTML(
            'الـ Proxy غير مضبوط',
            'افتح fivem-profile.js وغيّر <code>proxyUrl</code> لرابط Cloudflare Worker الخاص بك.',
            false
        );
        return;
    }

    // Skeleton
    section.innerHTML = buildSkeletonHTML();

    const discordId = savedUser.discordId || (savedUser.loginVia === 'discord' ? savedUser.id : null);

    if (!discordId) {
        section.innerHTML = `<div class="fivem-not-found">
          <i class="fab fa-discord"></i>
          <h3>يلزم ربط حساب ديسكورد</h3>
          <p>الملف الشخصي يعتمد على Discord ID المرتبط بسيرفر FiveM.</p>
          <a href="login.html" class="fivem-retry-btn"><i class="fab fa-discord"></i> ربط ديسكورد</a>
        </div>`;
        return;
    }

    const player = await fetchPlayerFromFiveM(discordId);

    if (!player) {
        section.innerHTML = buildErrorHTML(
            'لم يتم العثور على بياناتك',
            'تأكد أنك دخلت السيرفر مرة واحدة على الأقل بنفس حساب ديسكورد، أو أن السيرفر يعمل حالياً.'
        );
        return;
    }

    section.innerHTML = buildProfileHTML(player, savedUser);
}

/* ─── عداد الأونلاين ─── */
async function updateOnlineCount() {
    const el = document.getElementById('fivem-online-count');
    if (!el) return;
    el.textContent = '...';
    const data = await fetchOnlinePlayers();
    el.textContent = (data && data.success) ? `${data.count} / ${data.max}` : 'غير متاح';
}

/* ─── تشغيل عند فتح الصفحة ─── */
if (typeof showPage === 'function' && !window._profileFixed) {
    const _orig = showPage;
    window.showPage = function(pageId) {
        _orig(pageId);
        if (pageId === 'profile-page') {
            setTimeout(() => {
                loadFiveMProfile();
                updateOnlineCount();
            }, 200);
        }
    };
    window._profileFixed = true;
}

document.addEventListener('DOMContentLoaded', updateOnlineCount);
