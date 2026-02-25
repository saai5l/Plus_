/* ============================================================
   Plus Dev — FiveM Profile Integration
   ملف ربط الموقع بسيرفر QBCore
   ============================================================ */

// ⚙️ إعدادات — غيّر هذي القيم
const FIVEM_CONFIG = {
    // IP السيرفر مع البورت الافتراضي لـ FiveM
    serverUrl: 'https://governmental-impacts-chart-empire.trycloudflare.com',
        // نفس المفتاح اللي في server.lua
    apiKey: 'PLUSDEV_SECRET_2025_CHANGE_ME',
};

// ============================================================
// جيب بيانات اللاعب من السيرفر
// ============================================================
async function fetchPlayerFromFiveM(discordId) {
    if (!discordId) return null;

    // نظّف الـ ID (أشيل discord: لو موجود)
    const cleanId = discordId.replace('discord:', '');

    try {
        const res = await fetch(
            `${FIVEM_CONFIG.serverUrl}/player?discord=${cleanId}`,
            {
                headers: {
                    'x-api-key': FIVEM_CONFIG.apiKey,
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(8000) // timeout 8 ثانية
            }
        );

        if (!res.ok) throw new Error('Server error: ' + res.status);
        const data = await res.json();
        return data.success ? data : null;

    } catch (err) {
        console.warn('[PlusDev] FiveM API Error:', err.message);
        return null;
    }
}

// ============================================================
// جيب عدد اللاعبين أونلاين
// ============================================================
async function fetchOnlinePlayers() {
    try {
        const res = await fetch(`${FIVEM_CONFIG.serverUrl}/online`, {
            headers: { 'x-api-key': FIVEM_CONFIG.apiKey },
            signal: AbortSignal.timeout(5000)
        });
        const data = await res.json();
        return data.success ? data : null;
    } catch {
        return null;
    }
}

// ============================================================
// عرض بيانات اللاعب في صفحة الملف الشخصي
// ============================================================
async function loadFiveMProfile() {
    const section = document.getElementById('fivem-profile-section');
    if (!section) return;

    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (!savedUser) {
        section.innerHTML = `
            <div class="fivem-not-logged">
                <i class="fas fa-lock"></i>
                <p>سجّل دخولك عبر ديسكورد لعرض ملفك في اللعبة</p>
            </div>`;
        return;
    }

    // حالة التحميل
    section.innerHTML = `
        <div class="fivem-loading">
            <div class="fivem-spinner"></div>
            <p>جاري تحميل بياناتك من السيرفر...</p>
        </div>`;

    const player = await fetchPlayerFromFiveM(savedUser.id);

    if (!player) {
        section.innerHTML = `
            <div class="fivem-not-found">
                <i class="fas fa-user-slash"></i>
                <h3>لم يتم العثور على بياناتك</h3>
                <p>تأكد أنك دخلت السيرفر مرة واحدة على الأقل، أو أن السيرفر شغّال حالياً.</p>
                <button class="fivem-retry-btn" onclick="loadFiveMProfile()">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>`;
        return;
    }

    // تحديد لون الوظيفة
    const jobColors = {
        'police': '#3498db', 'ambulance': '#2ecc71', 'mechanic': '#f39c12',
        'realestate': '#9b59b6', 'cardealer': '#1abc9c', 'default': '#fc7823'
    };
    const jobColor = jobColors[player.job_name] || jobColors.default;

    // تنسيق الأرقام
    const fmt = n => Number(n || 0).toLocaleString('ar-SA');

    section.innerHTML = `
        <div class="fivem-profile-card">

            <!-- Header -->
            <div class="fivem-card-header">
                <div class="fivem-avatar-wrap">
                    <img src="${savedUser.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}"
                         alt="avatar" class="fivem-avatar">
                    <span class="fivem-online-dot"></span>
                </div>
                <div class="fivem-header-info">
                    <h2 class="fivem-char-name">${player.name}</h2>
                    <span class="fivem-job-badge" style="background:${jobColor}22;color:${jobColor};border-color:${jobColor}44;">
                        <i class="fas fa-briefcase"></i> ${player.job}
                        ${player.job_grade ? `<small>— ${player.job_grade}</small>` : ''}
                    </span>
                    <p class="fivem-citizen-id">
                        <i class="fas fa-id-card"></i> Citizen ID: <code>${player.citizenid}</code>
                    </p>
                </div>
            </div>

            <!-- Stats Grid -->
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

            <!-- Vitals Bar -->
            <div class="fivem-vitals">
                <div class="fivem-vital-item">
                    <span class="fivem-vital-label"><i class="fas fa-utensils"></i> جوع</span>
                    <div class="fivem-vital-bar">
                        <div class="fivem-vital-fill fivem-vital-hunger"
                             style="width:${Math.min(player.hunger,100)}%"></div>
                    </div>
                    <span class="fivem-vital-pct">${Math.round(player.hunger)}%</span>
                </div>
                <div class="fivem-vital-item">
                    <span class="fivem-vital-label"><i class="fas fa-tint"></i> عطش</span>
                    <div class="fivem-vital-bar">
                        <div class="fivem-vital-fill fivem-vital-thirst"
                             style="width:${Math.min(player.thirst,100)}%"></div>
                    </div>
                    <span class="fivem-vital-pct">${Math.round(player.thirst)}%</span>
                </div>
                <div class="fivem-vital-item">
                    <span class="fivem-vital-label"><i class="fas fa-brain"></i> ضغط</span>
                    <div class="fivem-vital-bar">
                        <div class="fivem-vital-fill fivem-vital-stress"
                             style="width:${Math.min(player.stress,100)}%"></div>
                    </div>
                    <span class="fivem-vital-pct">${Math.round(player.stress)}%</span>
                </div>
            </div>

            <!-- Footer -->
            <div class="fivem-card-footer">
                <span class="fivem-nationality">
                    <i class="fas fa-globe"></i> ${player.nationality}
                </span>
                <button class="fivem-refresh-btn" onclick="loadFiveMProfile()">
                    <i class="fas fa-sync-alt"></i> تحديث
                </button>
            </div>

        </div>`;
}

// ============================================================
// عدد اللاعبين أونلاين في الهيدر/الهوم
// ============================================================
async function updateOnlineCount() {
    const el = document.getElementById('fivem-online-count');
    if (!el) return;

    el.textContent = '...';
    const data = await fetchOnlinePlayers();
    if (data) {
        el.textContent = `${data.count} / ${data.max}`;
        el.classList.add('fivem-online-active');
    } else {
        el.textContent = 'غير متاح';
    }
}

/// تحميل تلقائي عند فتح صفحة الملف الشخصي
document.addEventListener('DOMContentLoaded', () => {
    updateOnlineCount();

    // مراقبة الضغط على رابط Profile
    document.querySelectorAll('a[onclick]').forEach(link => {
        link.addEventListener('click', function() {
            const onclick = this.getAttribute('onclick');
            if (onclick && onclick.includes('profile-page')) {
                setTimeout(loadFiveMProfile, 300);
                setTimeout(updateOnlineCount, 300);
            }
        });
    });
});


// تحديث عداد أونلاين عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateOnlineCount();
});
