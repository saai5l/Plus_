/* ═══════════════════════════════════════════════════════════════
   Plus Dev - Membership & Gamification System v1.0
   نظام العضوية والنقاط والشارات
   ═══════════════════════════════════════════════════════════════ */

// ═══ نظام النقاط والشارات ═══
const GAMIFICATION = {
  RANKS: {
    'Bronze': { min: 0, max: 499, color: '#CD7F32', icon: '🥉' },
    'Silver': { min: 500, max: 999, color: '#C0C0C0', icon: '🥈' },
    'Gold': { min: 1000, max: 2499, color: '#FFD700', icon: '🥇' },
    'Platinum': { min: 2500, max: 4999, color: '#E5E4E2', icon: '💎' },
    'Diamond': { min: 5000, max: 9999, color: '#00BFFF', icon: '⭐' },
    'Supreme': { min: 10000, max: Infinity, color: '#ff6b6b', icon: '👑' }
  },

  BADGES: {
    'first_login': { name: '🎉 رحلتك بدأت', desc: 'دخول لأول مرة' },
    'job_applied': { name: '💼 طالب عمل', desc: 'تقديم لوظيفة' },
    'rules_reader': { name: '📖 قارئ القوانين', desc: 'قراءة كل القوانين' },
    'active_member': { name: '⚡ عضو نشيط', desc: '100 نقطة' },
    'robbery_master': { name: '🎯 خبير السرقات', desc: 'معرفة كل السرقات' },
    'legend': { name: '👑 أسطورة', desc: 'وصول لـ 10000 نقطة' }
  },

  POINTS_ACTIONS: {
    'visit_page': 5,
    'read_law': 10,
    'apply_job': 50,
    'check_tracking': 15,
    'watch_tutorial': 25,
    'share_server': 100,
    'invite_friend': 150,
    'daily_login': 20
  }
};

// ═══ نظام المستخدم والنقاط ═══
class UserProfile {
  constructor(userId) {
    this.userId = userId;
    this.points = 0;
    this.level = 0;
    this.rank = 'Bronze';
    this.badges = [];
    this.totalActions = {};
    this.joinDate = new Date();
    this.lastDaily = null;
    this.achievements = {};
  }

  addPoints(action, amount = null) {
    const pointsAmount = amount || GAMIFICATION.POINTS_ACTIONS[action] || 0;
    this.points += pointsAmount;
    this.totalActions[action] = (this.totalActions[action] || 0) + 1;
    this.updateRank();
    this.checkAchievements();
    this.save();
    return pointsAmount;
  }

  updateRank() {
    for (const [rankName, rankData] of Object.entries(GAMIFICATION.RANKS)) {
      if (this.points >= rankData.min && this.points <= rankData.max) {
        this.rank = rankName;
        this.level = Math.floor(this.points / 500) + 1;
        break;
      }
    }
  }

  checkAchievements() {
    // شارة أول دخول
    if (!this.badges.includes('first_login') && this.totalActions['visit_page'] >= 1) {
      this.unlockBadge('first_login');
    }

    // شارة تقديم وظيفة
    if (!this.badges.includes('job_applied') && this.totalActions['apply_job'] >= 1) {
      this.unlockBadge('job_applied');
    }

    // شارة قارئ القوانين
    if (!this.badges.includes('rules_reader') && this.totalActions['read_law'] >= 10) {
      this.unlockBadge('rules_reader');
    }

    // شارة عضو نشيط
    if (!this.badges.includes('active_member') && this.points >= 100) {
      this.unlockBadge('active_member');
    }

    // شارة خبير السرقات
    if (!this.badges.includes('robbery_master') && this.totalActions['read_law'] >= 20) {
      this.unlockBadge('robbery_master');
    }

    // شارة أسطورة
    if (!this.badges.includes('legend') && this.points >= 10000) {
      this.unlockBadge('legend');
    }
  }

  unlockBadge(badgeId) {
    if (!this.badges.includes(badgeId)) {
      this.badges.push(badgeId);
      const badge = GAMIFICATION.BADGES[badgeId];
      this.showBadgeNotification(badge.name, badge.desc);
      this.save();
    }
  }

  showBadgeNotification(name, desc) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
      <div class="badge-notification-content">
        <div class="badge-name">${name}</div>
        <div class="badge-desc">${desc}</div>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #fc7823, #e05e10);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 10000;
      box-shadow: 0 6px 20px rgba(252, 120, 35, 0.4);
      animation: slideInRight 0.4s ease;
      font-family: 'Tajawal', sans-serif;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  save() {
    try {
      const data = JSON.stringify({
        userId: this.userId,
        points: this.points,
        level: this.level,
        rank: this.rank,
        badges: this.badges,
        totalActions: this.totalActions,
        joinDate: this.joinDate,
        lastDaily: this.lastDaily,
        achievements: this.achievements
      });
      localStorage.setItem(`user_profile_${this.userId}`, data);
    } catch (e) {
      console.warn('⚠️ فشل حفظ الملف الشخصي:', e);
    }
  }

  static load(userId) {
    try {
      const data = localStorage.getItem(`user_profile_${userId}`);
      if (data) {
        const parsed = JSON.parse(data);
        const profile = new UserProfile(userId);
        Object.assign(profile, parsed);
        profile.joinDate = new Date(profile.joinDate);
        return profile;
      }
    } catch (e) {
      console.warn('⚠️ فشل تحميل الملف الشخصي:', e);
    }
    return new UserProfile(userId);
  }
}

// ═══ دالة عرض الملف الشخصي ═══
function displayUserProfile(userId) {
  const profile = UserProfile.load(userId);
  const rankData = GAMIFICATION.RANKS[profile.rank];

  const profileCard = `
    <div class="profile-card">
      <div class="profile-header">
        <div class="rank-badge" style="background: ${rankData.color};">
          ${rankData.icon}
        </div>
        <div class="profile-info">
          <h3 class="profile-rank">${profile.rank}</h3>
          <p class="profile-level">مستوى ${profile.level}</p>
        </div>
      </div>

      <div class="points-bar">
        <div class="points-label">
          <span>النقاط: ${profile.points.toLocaleString('ar-SA')}</span>
          <span class="next-rank">${profile.rank !== 'Supreme' ? `للمستوى التالي: ${rankData.max - profile.points}` : 'أعلى رتبة! 👑'}</span>
        </div>
        <div class="points-progress">
          <div class="points-fill" style="width: ${Math.min((profile.points % 500) / 500 * 100, 100)}%"></div>
        </div>
      </div>

      <div class="badges-showcase">
        <h4>الشارات المفتوحة (${profile.badges.length})</h4>
        <div class="badges-grid">
          ${profile.badges.map(badgeId => {
            const badge = GAMIFICATION.BADGES[badgeId];
            return `
              <div class="badge-item" title="${badge.desc}">
                <div class="badge-icon">${badge.name.split(' ')[0]}</div>
                <div class="badge-label">${badge.name}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-box">
          <i class="fas fa-briefcase"></i>
          <span>${profile.totalActions['apply_job'] || 0}</span>
          <p>طلبات توظيف</p>
        </div>
        <div class="stat-box">
          <i class="fas fa-scroll"></i>
          <span>${profile.totalActions['read_law'] || 0}</span>
          <p>قانون مقروء</p>
        </div>
        <div class="stat-box">
          <i class="fas fa-star"></i>
          <span>${profile.badges.length}</span>
          <p>شارات</p>
        </div>
        <div class="stat-box">
          <i class="fas fa-calendar"></i>
          <span>${Math.floor((new Date() - new Date(profile.joinDate)) / (1000 * 60 * 60 * 24))}</span>
          <p>يوم عضوية</p>
        </div>
      </div>
    </div>
  `;

  return profileCard;
}

// ═══ تحديث الملف الشخصي في الـ UI ═══
function updateUserProfileDisplay() {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (savedUser.id) {
    const profile = UserProfile.load(savedUser.id);
    const profileContainer = document.getElementById('user-profile-display');
    
    if (profileContainer) {
      profileContainer.innerHTML = displayUserProfile(savedUser.id);
    }

    // تحديث شارة الرتبة في الـ navbar
    const rankBadge = document.getElementById('user-rank-badge');
    if (rankBadge) {
      const rankData = GAMIFICATION.RANKS[profile.rank];
      rankBadge.innerHTML = `${rankData.icon} ${profile.rank}`;
      rankBadge.style.background = rankData.color;
    }
  }
}

// ═══ دالة تسجيل الأحداث ═══
function trackUserAction(action) {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (savedUser.id) {
    const profile = UserProfile.load(savedUser.id);
    const pointsGained = profile.addPoints(action);
    
    // عرض النقاط المكتسبة
    if (pointsGained > 0) {
      showPointsPopup(pointsGained);
    }
  }
}

function showPointsPopup(points) {
  const popup = document.createElement('div');
  popup.className = 'points-popup';
  popup.innerHTML = `+${points} 🎯`;
  popup.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #fc7823, #e05e10);
    color: white;
    padding: 12px 20px;
    border-radius: 20px;
    z-index: 9999;
    font-weight: bold;
    animation: popupFloat 2s ease forwards;
    font-family: 'Tajawal', sans-serif;
  `;

  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}

// ═══ تهيئة نظام العضوية ═══
function initGamificationSystem() {
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (savedUser.id) {
    const profile = UserProfile.load(savedUser.id);

    // تتبع زيارة يومية
    const today = new Date().toDateString();
    if (profile.lastDaily !== today) {
      profile.lastDaily = today;
      profile.addPoints('daily_login');
      showNotificationToast('✨ +20 نقطة - تسجيل دخول يومي!');
    }

    // تحديث الواجهة
    updateUserProfileDisplay();
  }
}

// ═══ ربط الأحداث بالصفحات ═══
document.addEventListener('DOMContentLoaded', function() {
  initGamificationSystem();

  // ربط الأحداث بأزرار الصفحات
  const pages = document.querySelectorAll('[onclick*="showPage"]');
  pages.forEach(page => {
    const originalOnclick = page.getAttribute('onclick');
    page.setAttribute('onclick', `trackUserAction('visit_page'); ${originalOnclick}`);
  });

  // ربط أزرار التوظيف
  const jobButtons = document.querySelectorAll('[onclick*="applyJob"]');
  jobButtons.forEach(btn => {
    const originalOnclick = btn.getAttribute('onclick');
    btn.setAttribute('onclick', `trackUserAction('apply_job'); ${originalOnclick}`);
  });
});

// ═══ تصدير للاستخدام الخارجي ═══
if (typeof window !== 'undefined') {
  window.GAMIFICATION = GAMIFICATION;
  window.UserProfile = UserProfile;
  window.trackUserAction = trackUserAction;
  window.updateUserProfileDisplay = updateUserProfileDisplay;
  window.initGamificationSystem = initGamificationSystem;
}
