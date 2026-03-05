/* ================================================================
   Advanced Analytics Dashboard - لوحة التحليلات المتقدمة
   ================================================================
   ميزات:
   - رسوم بيانية للطلبات على مدار الوقت
   - أكثر الوظائف طلباً
   - متوسط وقت الموافقة
   - إحصائيات اللاعبين الجدد
   - إحصائيات المتجر والمبيعات
================================================================ */

class AnalyticsDashboard {
  constructor(database) {
    this.db = database;
    this.applicationStats = {};
    this.jobStats = {};
    this.userStats = {};
    this.storeStats = {};
    this.activityTimeline = [];
    
    this.loadAllData();
  }

  // تحميل جميع البيانات
  loadAllData() {
    this.loadApplicationStats();
    this.loadJobStats();
    this.loadUserStats();
    this.loadStoreStats();
  }

  // تحميل إحصائيات الطلبات
  loadApplicationStats() {
    this.db.ref('applications').on('value', (snap) => {
      const data = snap.val();
      if (!data) return;

      const apps = Object.values(data);
      
      this.applicationStats = {
        total: apps.length,
        approved: apps.filter(a => a.status === 'approved').length,
        pending: apps.filter(a => a.status === 'pending').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
        averageApprovalTime: this.calculateAverageApprovalTime(apps),
        applicationsByDate: this.groupApplicationsByDate(apps)
      };

      this.renderApplicationStats();
      this.renderApplicationChart();
    });
  }

  // تحميل إحصائيات الوظائف
  loadJobStats() {
    this.db.ref('applications').on('value', (snap) => {
      const data = snap.val();
      if (!data) return;

      const apps = Object.values(data);
      const jobCounts = {};

      apps.forEach(app => {
        const job = app.job || 'unknown';
        jobCounts[job] = (jobCounts[job] || 0) + 1;
      });

      this.jobStats = jobCounts;
      this.renderJobStats();
      this.renderMostPopularJobsChart();
    });
  }

  // تحميل إحصائيات المستخدمين
  loadUserStats() {
    this.db.ref('users').on('value', (snap) => {
      const data = snap.val();
      if (!data) return;

      const users = Object.values(data);
      const now = Date.now();
      const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

      this.userStats = {
        total: users.length,
        newThisWeek: users.filter(u => new Date(u.joinedAt).getTime() > oneWeekAgo).length,
        newThisMonth: users.filter(u => new Date(u.joinedAt).getTime() > oneMonthAgo).length,
        active: users.filter(u => {
          const lastLogin = new Date(u.lastLogin || u.joinedAt).getTime();
          return now - lastLogin < (7 * 24 * 60 * 60 * 1000);
        }).length,
        usersByDate: this.groupUsersByJoinDate(users)
      };

      this.renderUserStats();
      this.renderNewUsersChart();
    });
  }

  // تحميل إحصائيات المتجر
  loadStoreStats() {
    this.db.ref('storeOrders').on('value', (snap) => {
      const data = snap.val();
      if (!data) return;

      const orders = Object.values(data);
      const now = Date.now();
      const thisMonth = new Date();
      thisMonth.setDate(1);

      let totalRevenue = 0;
      let thisMonthRevenue = 0;
      const topProducts = {};

      orders.forEach(order => {
        const price = order.price || 0;
        totalRevenue += price;

        if (new Date(order.date).getTime() > thisMonth.getTime()) {
          thisMonthRevenue += price;
        }

        const product = order.productName || 'unknown';
        topProducts[product] = (topProducts[product] || 0) + 1;
      });

      this.storeStats = {
        totalRevenue: totalRevenue,
        thisMonthRevenue: thisMonthRevenue,
        totalOrders: orders.length,
        thisMonthOrders: orders.filter(o => 
          new Date(o.date).getTime() > thisMonth.getTime()
        ).length,
        topProducts: this.sortByCount(topProducts),
        revenueByDate: this.groupRevenueByDate(orders)
      };

      this.renderStoreStats();
      this.renderRevenueChart();
    });
  }

  // حساب متوسط وقت الموافقة
  calculateAverageApprovalTime(apps) {
    const approvedApps = apps.filter(a => a.status === 'approved' && a.approvedAt);
    
    if (approvedApps.length === 0) return 0;

    const totalTime = approvedApps.reduce((sum, app) => {
      const submittedTime = new Date(app.submittedAt).getTime();
      const approvedTime = new Date(app.approvedAt).getTime();
      return sum + (approvedTime - submittedTime);
    }, 0);

    const avgMs = totalTime / approvedApps.length;
    const avgHours = avgMs / (1000 * 60 * 60);
    return Math.round(avgHours);
  }

  // تجميع الطلبات حسب التاريخ
  groupApplicationsByDate(apps) {
    const grouped = {};
    
    apps.forEach(app => {
      const date = new Date(app.submittedAt).toLocaleDateString('ar-SA');
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return grouped;
  }

  // تجميع المستخدمين حسب تاريخ الانضمام
  groupUsersByJoinDate(users) {
    const grouped = {};
    
    users.forEach(user => {
      const date = new Date(user.joinedAt).toLocaleDateString('ar-SA');
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return grouped;
  }

  // تجميع الإيرادات حسب التاريخ
  groupRevenueByDate(orders) {
    const grouped = {};
    
    orders.forEach(order => {
      const date = new Date(order.date).toLocaleDateString('ar-SA');
      grouped[date] = (grouped[date] || 0) + (order.price || 0);
    });

    return grouped;
  }

  // ترتيب الكائنات حسب العدد
  sortByCount(obj) {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  }

  // عرض إحصائيات الطلبات
  renderApplicationStats() {
    const container = document.getElementById('applications-stats');
    if (!container) return;

    const stats = this.applicationStats;
    const approvalRate = stats.total > 0 
      ? Math.round((stats.approved / stats.total) * 100) 
      : 0;

    container.innerHTML = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(252,120,35,0.15); color: #fc7823;">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="card-content">
            <span class="card-label">إجمالي الطلبات</span>
            <span class="card-value">${stats.total}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(46,204,113,0.15); color: #2ecc71;">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="card-content">
            <span class="card-label">مقبول</span>
            <span class="card-value">${stats.approved}</span>
            <small>${approvalRate}%</small>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(243,156,18,0.15); color: #f39c12;">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <div class="card-content">
            <span class="card-label">قيد الانتظار</span>
            <span class="card-value">${stats.pending}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(231,76,60,0.15); color: #e74c3c;">
            <i class="fas fa-times-circle"></i>
          </div>
          <div class="card-content">
            <span class="card-label">مرفوض</span>
            <span class="card-value">${stats.rejected}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(52,152,219,0.15); color: #3498db;">
            <i class="fas fa-clock"></i>
          </div>
          <div class="card-content">
            <span class="card-label">متوسط وقت الموافقة</span>
            <span class="card-value">${stats.averageApprovalTime}</span>
            <small>ساعة</small>
          </div>
        </div>
      </div>
    `;
  }

  // عرض إحصائيات الوظائف
  renderJobStats() {
    const container = document.getElementById('job-stats');
    if (!container) return;

    const sorted = Object.entries(this.jobStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    container.innerHTML = `
      <div class="job-stats-list">
        ${sorted.map(([job, count]) => `
          <div class="job-stat-item">
            <div class="job-name">${this.getJobDisplayName(job)}</div>
            <div class="job-bar">
              <div class="job-progress" style="width: ${(count / sorted[0][1]) * 100}%"></div>
            </div>
            <div class="job-count">${count}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // عرض إحصائيات المستخدمين
  renderUserStats() {
    const container = document.getElementById('user-stats');
    if (!container) return;

    const stats = this.userStats;
    const growthRate = stats.total > 0 
      ? Math.round((stats.newThisWeek / stats.total) * 100)
      : 0;

    container.innerHTML = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(155,89,182,0.15); color: #9b59b6;">
            <i class="fas fa-users"></i>
          </div>
          <div class="card-content">
            <span class="card-label">إجمالي اللاعبين</span>
            <span class="card-value">${stats.total}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(46,204,113,0.15); color: #2ecc71;">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="card-content">
            <span class="card-label">جدد هذا الأسبوع</span>
            <span class="card-value">${stats.newThisWeek}</span>
            <small>${growthRate}%</small>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(52,152,219,0.15); color: #3498db;">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="card-content">
            <span class="card-label">جدد هذا الشهر</span>
            <span class="card-value">${stats.newThisMonth}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(230,126,34,0.15); color: #e67e22;">
            <i class="fas fa-gamepad"></i>
          </div>
          <div class="card-content">
            <span class="card-label">نشطون</span>
            <span class="card-value">${stats.active}</span>
          </div>
        </div>
      </div>
    `;
  }

  // عرض إحصائيات المتجر
  renderStoreStats() {
    const container = document.getElementById('store-stats');
    if (!container) return;

    const stats = this.storeStats;
    const avgOrderValue = stats.totalOrders > 0 
      ? Math.round(stats.totalRevenue / stats.totalOrders)
      : 0;

    container.innerHTML = `
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(46,204,113,0.15); color: #2ecc71;">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="card-content">
            <span class="card-label">إجمالي الإيرادات</span>
            <span class="card-value">₪${stats.totalRevenue}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(52,152,219,0.15); color: #3498db;">
            <i class="fas fa-calendar"></i>
          </div>
          <div class="card-content">
            <span class="card-label">إيرادات هذا الشهر</span>
            <span class="card-value">₪${stats.thisMonthRevenue}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(230,126,34,0.15); color: #e67e22;">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="card-content">
            <span class="card-label">إجمالي الطلبات</span>
            <span class="card-value">${stats.totalOrders}</span>
          </div>
        </div>

        <div class="analytics-card">
          <div class="card-icon" style="background: rgba(155,89,182,0.15); color: #9b59b6;">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="card-content">
            <span class="card-label">متوسط قيمة الطلب</span>
            <span class="card-value">₪${avgOrderValue}</span>
          </div>
        </div>
      </div>

      <div class="top-products">
        <h4>المنتجات الأكثر مبيعاً</h4>
        <ul>
          ${Object.entries(this.storeStats.topProducts || {})
            .slice(0, 5)
            .map(([product, count]) => `
              <li>${product} <span class="count">${count} مبيعة</span></li>
            `).join('')}
        </ul>
      </div>
    `;
  }

  // عرض مخطط الطلبات
  renderApplicationChart() {
    const container = document.getElementById('applications-chart');
    if (!container) return;

    const dates = Object.keys(this.applicationStats.applicationsByDate || {});
    const values = Object.values(this.applicationStats.applicationsByDate || {});

    if (values.length === 0) {
      container.innerHTML = '<p class="no-data">لا توجد بيانات</p>';
      return;
    }

    const maxValue = Math.max(...values);
    const chartHTML = values.map((val, idx) => `
      <div class="chart-bar">
        <div class="bar-visual" style="height: ${(val / maxValue) * 200}px;"></div>
        <label>${dates[idx]}</label>
        <value>${val}</value>
      </div>
    `).join('');

    container.innerHTML = `<div class="chart-container">${chartHTML}</div>`;
  }

  // عرض مخطط أكثر الوظائف طلباً
  renderMostPopularJobsChart() {
    const container = document.getElementById('jobs-chart');
    if (!container) return;

    const sorted = Object.entries(this.jobStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (sorted.length === 0) {
      container.innerHTML = '<p class="no-data">لا توجد بيانات</p>';
      return;
    }

    const maxValue = sorted[0][1];
    const chartHTML = sorted.map(([job, count]) => `
      <div class="chart-bar">
        <label>${this.getJobDisplayName(job)}</label>
        <div class="bar-visual" style="width: ${(count / maxValue) * 100}%;"></div>
        <value>${count}</value>
      </div>
    `).join('');

    container.innerHTML = `<div class="chart-container horizontal">${chartHTML}</div>`;
  }

  // عرض مخطط المستخدمين الجدد
  renderNewUsersChart() {
    const container = document.getElementById('new-users-chart');
    if (!container) return;

    const dates = Object.keys(this.userStats.usersByDate || {}).slice(-7);
    const values = dates.map(date => this.userStats.usersByDate[date] || 0);

    if (values.length === 0) {
      container.innerHTML = '<p class="no-data">لا توجد بيانات</p>';
      return;
    }

    const maxValue = Math.max(...values);
    const chartHTML = values.map((val, idx) => `
      <div class="chart-bar">
        <div class="bar-visual" style="height: ${(val / maxValue) * 200}px; background: #2ecc71;"></div>
        <label>${dates[idx]}</label>
        <value>${val}</value>
      </div>
    `).join('');

    container.innerHTML = `<div class="chart-container">${chartHTML}</div>`;
  }

  // عرض مخطط الإيرادات
  renderRevenueChart() {
    const container = document.getElementById('revenue-chart');
    if (!container) return;

    const dates = Object.keys(this.storeStats.revenueByDate || {}).slice(-7);
    const values = dates.map(date => this.storeStats.revenueByDate[date] || 0);

    if (values.length === 0) {
      container.innerHTML = '<p class="no-data">لا توجد بيانات</p>';
      return;
    }

    const maxValue = Math.max(...values);
    const chartHTML = values.map((val, idx) => `
      <div class="chart-bar">
        <div class="bar-visual" style="height: ${(val / maxValue) * 200}px; background: #9b59b6;"></div>
        <label>${dates[idx]}</label>
        <value>₪${val}</value>
      </div>
    `).join('');

    container.innerHTML = `<div class="chart-container">${chartHTML}</div>`;
  }

  // الحصول على اسم الوظيفة
  getJobDisplayName(job) {
    const jobNames = {
      'police': '🚔 الشرطة',
      'ems': '🚑 الإسعاف',
      'staff': '👨‍💼 الإدارة',
      'gang': '💀 عصابة'
    };
    return jobNames[job] || job;
  }
}

// إنشاء لوحة التحليلات عند تحميل الصفحة
let analyticsDashboard;
function initAnalyticsDashboard() {
  if (typeof database !== 'undefined') {
    analyticsDashboard = new AnalyticsDashboard(database);
  }
}
