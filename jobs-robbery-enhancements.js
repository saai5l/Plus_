/* ═══════════════════════════════════════════════════════════════
   Plus Dev - Jobs & Robbery Enhancements v1.0
   تحسينات واجهات التوظيف والسرقات
   ═══════════════════════════════════════════════════════════════ */

// ═══ نظام التوظيف المحسّن ═══
const JOBS_SYSTEM = {
  categories: {
    'police': {
      name: '🚔 الشرطة',
      icon: 'fas fa-police',
      desc: 'حماية المدينة والنظام',
      color: '#3498db',
      requirements: ['اسم كركتر واقعي', 'مايك صاح']
    },
    'ems': {
      name: '🚑 الإسعافات',
      icon: 'fas fa-hospital',
      desc: 'إنقاذ وعلاج السكان',
      color: '#2ecc71',
      requirements: ['شهادة طبية', 'مايك صاح']
    },
    'mechanic': {
      name: '🔧 الميكانيك',
      icon: 'fas fa-wrench',
      desc: 'تصليح وصيانة السيارات',
      color: '#e74c3c',
      requirements: ['خبرة في المركبات']
    },
    'realtor': {
      name: '🏠 العقار',
      icon: 'fas fa-home',
      desc: 'بيع وتأجير العقارات',
      color: '#f39c12',
      requirements: ['معرفة السوق العقاري']
    },
    'taxi': {
      name: '🚕 تاكسي',
      icon: 'fas fa-taxi',
      desc: 'نقل الركاب برفاهية',
      color: '#f1c40f',
      requirements: ['رخصة قيادة صحيحة']
    },
    'weazel': {
      name: '📺 ويزيل نيوز',
      icon: 'fas fa-camera',
      desc: 'تصوير وتغطية الأخبار',
      color: '#9b59b6',
      requirements: ['كاميرا احترافية']
    }
  },

  getJobCard: function(jobId) {
    const job = this.categories[jobId];
    if (!job) return '';

    return `
      <div class="job-card">
        <div class="job-card-header">
          <div>
            <i class="${job.icon}" style="color: ${job.color}; font-size: 1.5rem; margin-right: 8px;"></i>
            <h3 class="job-title">${job.name}</h3>
            <p class="job-description">${job.desc}</p>
          </div>
          <div class="job-status-badge" id="job-status-${jobId}">
            <span>🟢 مفتوح</span>
          </div>
        </div>

        <div class="job-requirements">
          <strong style="color: #fc7823;">المتطلبات:</strong>
          <ul class="requirements-list">
            ${job.requirements.map(req => `<li>✓ ${req}</li>`).join('')}
          </ul>
        </div>

        <div class="job-stats">
          <div class="job-stat">
            <i class="fas fa-users"></i>
            <span>الفريق النشط: <strong id="job-count-${jobId}">0</strong></span>
          </div>
          <div class="job-stat">
            <i class="fas fa-chart-line"></i>
            <span>الراتب: <strong>بناءً على الأداء</strong></span>
          </div>
        </div>

        <button class="job-apply-btn" onclick="applyForJob('${jobId}')">
          <i class="fas fa-paper-plane"></i>
          تقديم الآن
        </button>
      </div>
    `;
  }
};

// ═══ نظام السرقات المحسّن ═══
const ROBBERY_SYSTEM = {
  types: {
    'store': {
      name: 'سرقة متجر',
      emoji: '🏪',
      difficulty: '⭐',
      crew: '1-3',
      police: '5',
      reward: '$5,000-$8,000',
      duration: '10 دقائق',
      hasHostage: false
    },
    'atm': {
      name: 'سرقة صراف آلي',
      emoji: '💳',
      difficulty: '⭐',
      crew: '1-3',
      police: '5',
      reward: '$3,000-$5,000',
      duration: '8 دقائق',
      hasHostage: false
    },
    'house': {
      name: 'سرقة منزل',
      emoji: '🏠',
      difficulty: '⭐⭐',
      crew: '1-4',
      police: '6',
      reward: '$8,000-$12,000',
      duration: '15 دقيقة',
      hasHostage: false
    },
    'police_safe': {
      name: 'منزل الشرطة',
      emoji: '🚨',
      difficulty: '⭐⭐⭐',
      crew: '2-5',
      police: '7',
      reward: '$15,000-$25,000',
      duration: '20 دقيقة',
      hasHostage: false
    },
    'digitalden': {
      name: 'ديجيتال دن',
      emoji: '🖥️',
      difficulty: '⭐⭐⭐',
      crew: '2-5',
      police: '7',
      reward: '$20,000-$30,000',
      duration: '20 دقيقة',
      hasHostage: true
    },
    'laundromat': {
      name: 'مغسلة الملابس',
      emoji: '🧺',
      difficulty: '⭐⭐⭐',
      crew: '2-5',
      police: '7',
      reward: '$25,000-$35,000',
      duration: '20 دقيقة',
      hasHostage: true
    },
    'jewelry': {
      name: 'المجوهرات',
      emoji: '💎',
      difficulty: '⭐⭐⭐⭐',
      crew: '3-7',
      police: '9',
      reward: '$40,000-$60,000',
      duration: '25 دقيقة',
      hasHostage: true
    },
    'bank': {
      name: 'البنك',
      emoji: '🏦',
      difficulty: '⭐⭐⭐⭐⭐',
      crew: '4-7',
      police: '12',
      reward: '$100,000-$150,000',
      duration: '30 دقيقة',
      hasHostage: true
    }
  },

  getRobberyCard: function(robberyId) {
    const robbery = this.types[robberyId];
    if (!robbery) return '';

    const difficultyColor = {
      '⭐': '#2ecc71',
      '⭐⭐': '#f39c12',
      '⭐⭐⭐': '#e74c3c',
      '⭐⭐⭐⭐': '#9b59b6',
      '⭐⭐⭐⭐⭐': '#c0392b'
    }[robbery.difficulty] || '#95a5a6';

    return `
      <div class="robbery-card-enhanced">
        <div class="robbery-header">
          <div class="robbery-name">
            ${robbery.emoji} ${robbery.name}
          </div>
          <div class="robbery-difficulty" style="color: ${difficultyColor};">
            ${robbery.difficulty}
          </div>
        </div>

        ${robbery.hasHostage ? `
          <div class="robbery-hostage-badge">
            ⚠️ يتطلب رهينة
          </div>
        ` : ''}

        <div class="robbery-stats-enhanced">
          <div class="stat-item">
            <strong>👥 حجم الفريق</strong>
            ${robbery.crew}
          </div>
          <div class="stat-item">
            <strong>🚔 وحدات الشرطة</strong>
            ${robbery.police}
          </div>
          <div class="stat-item">
            <strong>💰 المكافأة</strong>
            ${robbery.reward}
          </div>
          <div class="stat-item">
            <strong>⏱️ المدة</strong>
            ${robbery.duration}
          </div>
        </div>

        <div class="robbery-description">
          <strong style="color: #fc7823;">نصائح:</strong>
          <ul>
            <li>تأكد من وجود جميع الفريق قبل البدء</li>
            <li>استخدم مسار الهروب الآمن</li>
            <li>تجنب المناطق الآمنة أثناء الهروب</li>
            <li>احذر من الشرطة على الطريق</li>
          </ul>
        </div>
      </div>
    `;
  }
};

// ═══ دالة عرض صفحة التوظيف المحسّنة ═══
function displayJobsPage() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

  let html = `
    <div class="jobs-header">
      <div class="jobs-hero">
        <h1>🌟 فرص التوظيف</h1>
        <p>انضم إلى أفضل الفرق واكسب المال!</p>
      </div>

      <div class="jobs-search">
        <input type="text" id="job-search" placeholder="🔍 ابحث عن وظيفة..." class="job-search-input">
        <div class="job-filter-buttons">
  `;

  for (const [jobId, job] of Object.entries(JOBS_SYSTEM.categories)) {
    html += `
      <button class="filter-btn" onclick="filterJobs('${jobId}')">
        ${job.name}
      </button>
    `;
  }

  html += `
        </div>
      </div>
    </div>

    <div class="jobs-grid">
  `;

  for (const [jobId, job] of Object.entries(JOBS_SYSTEM.categories)) {
    html += JOBS_SYSTEM.getJobCard(jobId);
  }

  html += `
    </div>
  `;

  container.innerHTML = html;

  // ربط البحث
  const searchInput = document.getElementById('job-search');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      filterJobsBySearch(e.target.value);
    });
  }
}

// ═══ دالة عرض صفحة السرقات المحسّنة ═══
function displayRobberiesPage() {
  const container = document.getElementById('robbery-container');
  if (!container) return;

  let html = `
    <div class="robbery-header">
      <div class="robbery-hero">
        <h1>🎯 نظام السرقات</h1>
        <p>اختر سرقتك بحكمة واخطط جيداً</p>
      </div>

      <div class="difficulty-guide">
        <div class="difficulty-item">
          <span>⭐</span> <span>سهل جداً</span>
        </div>
        <div class="difficulty-item">
          <span>⭐⭐</span> <span>سهل</span>
        </div>
        <div class="difficulty-item">
          <span>⭐⭐⭐</span> <span>متوسط</span>
        </div>
        <div class="difficulty-item">
          <span>⭐⭐⭐⭐</span> <span>صعب</span>
        </div>
        <div class="difficulty-item">
          <span>⭐⭐⭐⭐⭐</span> <span>خطر جداً!</span>
        </div>
      </div>
    </div>

    <div class="robberies-grid">
  `;

  for (const [robberyId, robbery] of Object.entries(ROBBERY_SYSTEM.types)) {
    html += ROBBERY_SYSTEM.getRobberyCard(robberyId);
  }

  html += `
    </div>
  `;

  container.innerHTML = html;
}

// ═══ دوال المساعدة ═══
function applyForJob(jobId) {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!savedUser.id) {
    showNotificationToast('⚠️ يجب تسجيل الدخول أولاً');
    return;
  }

  const job = JOBS_SYSTEM.categories[jobId];
  
  // تتبع الإجراء
  if (window.trackUserAction) {
    window.trackUserAction('apply_job');
  }

  // عرض إشعار
  showNotificationToast(`✅ تم تقديمك لوظيفة ${job.name}`);

  // حفظ الطلب في Firebase أو localStorage
  const applications = JSON.parse(localStorage.getItem('job_applications') || '[]');
  applications.push({
    jobId: jobId,
    userId: savedUser.id,
    timestamp: new Date().toISOString(),
    status: 'pending'
  });
  localStorage.setItem('job_applications', JSON.stringify(applications));
}

function filterJobs(category) {
  const cards = document.querySelectorAll('.job-card');
  cards.forEach(card => {
    if (card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterJobsBySearch(searchTerm) {
  const cards = document.querySelectorAll('.job-card');
  const search = searchTerm.toLowerCase();

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(search)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// ═══ تهيئة الصفحات عند التحميل ═══
document.addEventListener('DOMContentLoaded', function() {
  // ربط صفحات التوظيف والسرقات
  const jobsPage = document.getElementById('jobs');
  const robberiesPage = document.getElementById('robbery');

  if (jobsPage) {
    displayJobsPage();
  }

  if (robberiesPage) {
    displayRobberiesPage();
  }
});

// ═══ تصدير للاستخدام ═══
if (typeof window !== 'undefined') {
  window.JOBS_SYSTEM = JOBS_SYSTEM;
  window.ROBBERY_SYSTEM = ROBBERY_SYSTEM;
  window.displayJobsPage = displayJobsPage;
  window.displayRobberiesPage = displayRobberiesPage;
  window.applyForJob = applyForJob;
  window.filterJobs = filterJobs;
  window.filterJobsBySearch = filterJobsBySearch;
}
