/* ================================================================
   Integration File - ملف التكامل
   يجب إضافة هذا الملف إلى index.html
================================================================ */

// تهيئة جميع الأنظمة عند تحميل Firebase
function initializeAdvancedSystems() {
  if (typeof database === 'undefined') {
    console.error('Firebase database غير متوفر');
    return;
  }

  // تهيئة نظام إدارة الأدمنز
  initAdminSystem();
  console.log('✅ Admin Management System initialized');

  // تهيئة لوحة التحليلات
  initAnalyticsDashboard();
  console.log('✅ Analytics Dashboard initialized');

  // تهيئة مدير المحتوى
  initContentManager();
  console.log('✅ Content Manager initialized');
}

// استدعاء التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // انتظر قليلاً حتى يتم تحميل Firebase
  setTimeout(initializeAdvancedSystems, 1000);
});

/* ================================================================
   HTML Elements needed in index.html
   
   أضف هذه العناصر في index.html في قسم لوحة الإدارة:
================================================================ */

/*

<!-- في قسم admin-dashboard، أضف هذه الأقسام: -->

<!-- TAB 1: إدارة الأدمنز -->
<div id="admins-tab" class="admin-tab-content active">
  <div id="admin-stats-container"></div>
  <div id="admins-list-container"></div>
</div>

<!-- TAB 2: التحليلات -->
<div id="analytics-tab" class="admin-tab-content">
  <h3>إحصائيات الطلبات</h3>
  <div id="applications-stats"></div>
  <div id="applications-chart"></div>

  <h3>أكثر الوظائف طلباً</h3>
  <div id="job-stats"></div>
  <div id="jobs-chart"></div>

  <h3>إحصائيات اللاعبين</h3>
  <div id="user-stats"></div>
  <div id="new-users-chart"></div>

  <h3>إحصائيات المتجر</h3>
  <div id="store-stats"></div>
  <div id="revenue-chart"></div>
</div>

<!-- TAB 3: إدارة المحتوى -->
<div id="content-tab" class="admin-tab-content">
  <div id="laws-manager-container"></div>
  <hr>
  <div id="tutorials-manager-container"></div>
  <hr>
  <div id="jobs-requirements-container"></div>
  <hr>
  <div id="store-products-container"></div>
</div>

*/

/* ================================================================
   Permissions Helper Functions
   دوال مساعدة للتحقق من الصلاحيات
================================================================ */

function checkPermission(permission) {
  if (!adminSystem) {
    console.warn('Admin system not initialized');
    return false;
  }

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return false;

  return adminSystem.hasPermission(user.id, permission);
}

function requirePermission(permission) {
  if (!checkPermission(permission)) {
    showNotification('❌ ليس لديك صلاحية للقيام بهذا الإجراء', true);
    return false;
  }
  return true;
}

function canManageAdmins() {
  return requirePermission('manage_admins');
}

function canViewAnalytics() {
  return requirePermission('view_analytics');
}

function canManageContent() {
  return requirePermission('manage_content');
}

function canToggleJobs() {
  return requirePermission('toggle_jobs');
}

function canManageStore() {
  return requirePermission('manage_store');
}

/* ================================================================
   Tab Navigation
   نظام التنقل بين التابات
================================================================ */

function switchAdminTab(tabName) {
  // التحقق من الصلاحيات
  if (tabName === 'admins' && !canManageAdmins()) return;
  if (tabName === 'analytics' && !canViewAnalytics()) return;
  if (tabName === 'content' && !canManageContent()) return;

  // إخفاء جميع التابات
  document.querySelectorAll('.admin-tab-content').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('active');
  });

  // إظهار التاب المختار
  const selectedTab = document.getElementById(tabName + '-tab');
  if (selectedTab) {
    selectedTab.style.display = 'block';
    selectedTab.classList.add('active');
  }

  // تحديث زر التاب النشط
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

/* ================================================================
   Utility Functions
   دوال مساعدة
================================================================ */

// تصدير البيانات إلى CSV
function exportToCSV(data, filename) {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}

// طباعة التقرير
function printReport(title, content) {
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(`
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; direction: rtl; }
        h1 { color: #fc7823; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: right; }
        th { background-color: #fc7823; color: white; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${content}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// إرسال بيانات إلى Discord
async function sendToDiscord(webhookUrl, data) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: data.title || 'إخطار',
          description: data.description || '',
          color: parseInt(CONFIG.PRIMARY_COLOR.replace('#', ''), 16),
          timestamp: new Date().toISOString()
        }]
      })
    });

    return response.ok;
  } catch (error) {
    console.error('خطأ في إرسال البيانات إلى Discord:', error);
    return false;
  }
}

// حفظ سجل نشاط
async function logAdminActivity(action, details) {
  if (!database) return;

  const activity = {
    timestamp: new Date().toISOString(),
    action: action,
    details: details,
    admin: JSON.parse(localStorage.getItem('user') || '{}').username
  };

  try {
    await database.ref(`adminActivityLog/${Date.now()}`).set(activity);
  } catch (error) {
    console.error('خطأ في حفظ السجل:', error);
  }
}

/* ================================================================
   Notifications Helper
================================================================ */

function showAdminNotification(message, type = 'info') {
  // استخدم نظام الإشعارات الموجود أو أنشئ واحد جديد
  if (typeof showNotification !== 'undefined') {
    const isError = type === 'error';
    showNotification(message, isError);
  } else {
    const icon = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[type] || 'ℹ️';

    alert(`${icon} ${message}`);
  }
}

/* ================================================================
   الإحصائيات السريعة
================================================================ */

function getQuickStats() {
  if (!analyticsDashboard) return null;

  return {
    totalApplications: analyticsDashboard.applicationStats.total,
    approvedApps: analyticsDashboard.applicationStats.approved,
    pendingApps: analyticsDashboard.applicationStats.pending,
    rejectedApps: analyticsDashboard.applicationStats.rejected,
    averageApprovalTime: analyticsDashboard.applicationStats.averageApprovalTime,
    totalUsers: analyticsDashboard.userStats.total,
    activeUsers: analyticsDashboard.userStats.active,
    newUsersThisWeek: analyticsDashboard.userStats.newThisWeek,
    totalRevenue: analyticsDashboard.storeStats.totalRevenue,
    totalOrders: analyticsDashboard.storeStats.totalOrders
  };
}

function updateDashboardQuickStats() {
  const stats = getQuickStats();
  if (!stats) return;

  const elements = {
    'total-apps': stats.totalApplications,
    'approved-apps': stats.approvedApps,
    'pending-apps': stats.pendingApps,
    'rejected-apps': stats.rejectedApps,
    'total-users': stats.totalUsers,
    'active-users': stats.activeUsers,
    'total-revenue': stats.totalRevenue
  };

  Object.entries(elements).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

// تحديث الإحصائيات كل 30 ثانية
setInterval(updateDashboardQuickStats, 30000);
