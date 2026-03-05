/* ================================================================
   Admin Management System - نظام إدارة الأدمنز المتقدم
   ================================================================
   ميزات:
   - إضافة/حذف الأدمنز
   - نظام الأدوار والصلاحيات (مشرف، حكم، إدارة)
   - سجل النشاطات
   - الفلترة والبحث
================================================================ */

// تعريف الأدوار والصلاحيات
const ADMIN_ROLES = {
  MODERATOR: {
    name: 'حكم',
    color: '#3498db',
    permissions: [
      'view_dashboard',
      'view_applications',
      'approve_reject_apps',
      'view_tickets',
      'respond_tickets',
      'view_analytics',
      'warn_users',
      'view_activity_log'
    ]
  },
  SUPERVISOR: {
    name: 'مشرف',
    color: '#f39c12',
    permissions: [
      'view_dashboard',
      'view_applications',
      'approve_reject_apps',
      'view_tickets',
      'respond_tickets',
      'manage_store',
      'view_analytics',
      'warn_users',
      'kick_users',
      'view_activity_log',
      'manage_content',
      'toggle_jobs'
    ]
  },
  ADMIN: {
    name: 'إدارة',
    color: '#e74c3c',
    permissions: [
      'view_dashboard',
      'view_applications',
      'approve_reject_apps',
      'view_tickets',
      'respond_tickets',
      'manage_store',
      'view_analytics',
      'warn_users',
      'kick_users',
      'ban_users',
      'view_activity_log',
      'manage_content',
      'toggle_jobs',
      'manage_admins',
      'manage_webhooks',
      'view_settings'
    ]
  }
};

// نظام إدارة الأدمنز
class AdminManagementSystem {
  constructor(database) {
    this.db = database;
    this.admins = [];
    this.activityLog = [];
    this.loadAdmins();
    this.loadActivityLog();
  }

  // تحميل الأدمنز من Firebase
  loadAdmins() {
    this.db.ref('admins').on('value', (snap) => {
      const data = snap.val();
      this.admins = data ? Object.values(data) : [];
      this.renderAdminsList();
      this.updateAdminStats();
    });
  }

  // تحميل سجل النشاطات
  loadActivityLog() {
    this.db.ref('adminActivityLog').limitToLast(100).on('value', (snap) => {
      const data = snap.val();
      this.activityLog = data ? Object.values(data).reverse() : [];
    });
  }

  // إضافة أدمن جديد
  async addAdmin(discordId, username, role = 'MODERATOR') {
    try {
      // التحقق من عدم وجود الأدمن مسبقاً
      if (this.admins.some(a => a.id === discordId)) {
        return { success: false, message: 'هذا الأدمن موجود بالفعل' };
      }

      const adminData = {
        id: discordId,
        username: username,
        role: role,
        addedBy: this.getCurrentAdminId(),
        addedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: 'active',
        warnings: 0
      };

      await this.db.ref(`admins/${discordId}`).set(adminData);
      this.logActivity('ADD_ADMIN', `تم إضافة أدمن جديد: ${username} بدور ${ADMIN_ROLES[role].name}`);
      
      return { success: true, message: 'تم إضافة الأدمن بنجاح' };
    } catch (error) {
      console.error('خطأ في إضافة الأدمن:', error);
      return { success: false, message: 'حدث خطأ: ' + error.message };
    }
  }

  // تحديث دور الأدمن
  async updateAdminRole(adminId, newRole) {
    try {
      if (!ADMIN_ROLES[newRole]) {
        return { success: false, message: 'الدور غير صحيح' };
      }

      const admin = this.admins.find(a => a.id === adminId);
      if (!admin) {
        return { success: false, message: 'الأدمن غير موجود' };
      }

      const oldRole = admin.role;
      await this.db.ref(`admins/${adminId}/role`).set(newRole);
      this.logActivity('UPDATE_ROLE', `تم تحديث دور ${admin.username} من ${ADMIN_ROLES[oldRole].name} إلى ${ADMIN_ROLES[newRole].name}`);
      
      return { success: true, message: 'تم تحديث الدور بنجاح' };
    } catch (error) {
      console.error('خطأ في تحديث الدور:', error);
      return { success: false, message: 'حدث خطأ: ' + error.message };
    }
  }

  // حذف أدمن
  async removeAdmin(adminId) {
    try {
      const admin = this.admins.find(a => a.id === adminId);
      if (!admin) {
        return { success: false, message: 'الأدمن غير موجود' };
      }

      await this.db.ref(`admins/${adminId}`).remove();
      this.logActivity('REMOVE_ADMIN', `تم حذف الأدمن: ${admin.username}`);
      
      return { success: true, message: 'تم حذف الأدمن بنجاح' };
    } catch (error) {
      console.error('خطأ في حذف الأدمن:', error);
      return { success: false, message: 'حدث خطأ: ' + error.message };
    }
  }

  // تسجيل النشاطات
  logActivity(action, description) {
    const activity = {
      id: Date.now(),
      action: action,
      description: description,
      adminId: this.getCurrentAdminId(),
      adminName: this.getCurrentAdminName(),
      timestamp: new Date().toISOString()
    };

    this.db.ref(`adminActivityLog/${activity.id}`).set(activity);
  }

  // الحصول على معرف الأدمن الحالي
  getCurrentAdminId() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.id || 'unknown';
  }

  // الحصول على اسم الأدمن الحالي
  getCurrentAdminName() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.username || 'Unknown';
  }

  // التحقق من الصلاحية
  hasPermission(adminId, permission) {
    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return false;
    const role = ADMIN_ROLES[admin.role];
    return role && role.permissions.includes(permission);
  }

  // الحصول على الأدمنز مع الفلترة
  getAdminsFiltered(filter = {}) {
    let filtered = [...this.admins];

    if (filter.role) {
      filtered = filtered.filter(a => a.role === filter.role);
    }

    if (filter.status) {
      filtered = filtered.filter(a => a.status === filter.status);
    }

    if (filter.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.username.toLowerCase().includes(search) || 
        a.id.includes(search)
      );
    }

    return filtered;
  }

  // عرض قائمة الأدمنز
  renderAdminsList() {
    const container = document.getElementById('admins-list-container');
    if (!container) return;

    const html = `
      <div class="admins-header">
        <h2>إدارة الأدمنز</h2>
        <button class="btn-add-admin" onclick="adminSystem.openAddAdminModal()">
          <i class="fas fa-plus"></i> إضافة أدمن
        </button>
      </div>

      <div class="admins-search">
        <input type="text" id="admins-search" placeholder="ابحث عن أدمن..." 
               onkeyup="adminSystem.filterAdmins()">
        <select id="admins-role-filter" onchange="adminSystem.filterAdmins()">
          <option value="">جميع الأدوار</option>
          ${Object.entries(ADMIN_ROLES).map(([key, role]) => 
            `<option value="${key}">${role.name}</option>`
          ).join('')}
        </select>
      </div>

      <div class="admins-table">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الدور</th>
              <th>الحالة</th>
              <th>آخر نشاط</th>
              <th>التحذيرات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            ${this.admins.length === 0 ? 
              '<tr><td colspan="6" class="text-center">لا توجد أدمنز</td></tr>' :
              this.admins.map(admin => this.renderAdminRow(admin)).join('')
            }
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  // صف الأدمن في الجدول
  renderAdminRow(admin) {
    const role = ADMIN_ROLES[admin.role];
    const lastActiveDate = new Date(admin.lastActive);
    const hoursAgo = Math.floor((Date.now() - lastActiveDate) / 3600000);

    return `
      <tr class="admin-row">
        <td class="admin-name">
          <strong>${admin.username}</strong>
          <small>${admin.id}</small>
        </td>
        <td>
          <span class="role-badge" style="background: ${role.color};">
            ${role.name}
          </span>
        </td>
        <td>
          <span class="status-badge ${admin.status === 'active' ? 'active' : 'inactive'}">
            ${admin.status === 'active' ? '🟢 نشط' : '🔴 غير نشط'}
          </span>
        </td>
        <td>
          <small>${hoursAgo < 1 ? 'قبل قليل' : 'قبل ' + hoursAgo + ' ساعة'}</small>
        </td>
        <td>
          <span class="warning-count ${admin.warnings > 0 ? 'has-warnings' : ''}">
            ${admin.warnings > 0 ? '⚠️ ' + admin.warnings : '-'}
          </span>
        </td>
        <td class="admin-actions">
          <button class="btn-edit" onclick="adminSystem.editAdmin('${admin.id}')" title="تعديل">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-delete" onclick="adminSystem.deleteAdminConfirm('${admin.id}')" title="حذف">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }

  // فتح نافذة إضافة أدمن
  openAddAdminModal() {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>إضافة أدمن جديد</h3>
        <div class="form-group">
          <label>معرف Discord</label>
          <input type="text" id="new-admin-id" placeholder="أدخل معرف Discord الرقمي">
        </div>
        <div class="form-group">
          <label>اسم المستخدم</label>
          <input type="text" id="new-admin-name" placeholder="اسم المستخدم">
        </div>
        <div class="form-group">
          <label>الدور</label>
          <select id="new-admin-role">
            ${Object.entries(ADMIN_ROLES).map(([key, role]) => 
              `<option value="${key}">${role.name}</option>`
            ).join('')}
          </select>
        </div>
        <div class="modal-actions">
          <button class="btn-confirm" onclick="adminSystem.addAdminFromModal()">إضافة</button>
          <button class="btn-cancel" onclick="this.parentElement.parentElement.remove()">إلغاء</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // إضافة أدمن من النافذة
  async addAdminFromModal() {
    const id = document.getElementById('new-admin-id').value.trim();
    const name = document.getElementById('new-admin-name').value.trim();
    const role = document.getElementById('new-admin-role').value;

    if (!id || !name) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }

    const result = await this.addAdmin(id, name, role);
    if (result.success) {
      alert(result.message);
      document.querySelector('.admin-modal').remove();
    } else {
      alert('خطأ: ' + result.message);
    }
  }

  // تأكيد حذف الأدمن
  deleteAdminConfirm(adminId) {
    const admin = this.admins.find(a => a.id === adminId);
    if (confirm(`هل تريد حذف الأدمن ${admin.username}؟`)) {
      this.removeAdmin(adminId);
    }
  }

  // تحرير الأدمن
  async editAdmin(adminId) {
    const admin = this.admins.find(a => a.id === adminId);
    if (!admin) return;

    const newRole = prompt(
      `اختر دور جديد للأدمن ${admin.username}:\n1. حكم\n2. مشرف\n3. إدارة`,
      '1'
    );

    const roleMap = { '1': 'MODERATOR', '2': 'SUPERVISOR', '3': 'ADMIN' };
    if (newRole && roleMap[newRole]) {
      const result = await this.updateAdminRole(adminId, roleMap[newRole]);
      alert(result.message);
    }
  }

  // فلترة الأدمنز
  filterAdmins() {
    const search = document.getElementById('admins-search')?.value || '';
    const role = document.getElementById('admins-role-filter')?.value || '';

    const filtered = this.getAdminsFiltered({ search, role });

    const tbody = document.querySelector('.admins-table tbody');
    if (tbody) {
      tbody.innerHTML = filtered.length === 0 ? 
        '<tr><td colspan="6" class="text-center">لم يتم العثور على نتائج</td></tr>' :
        filtered.map(admin => this.renderAdminRow(admin)).join('');
    }
  }

  // تحديث إحصائيات الأدمنز
  updateAdminStats() {
    const stats = {
      total: this.admins.length,
      moderators: this.admins.filter(a => a.role === 'MODERATOR').length,
      supervisors: this.admins.filter(a => a.role === 'SUPERVISOR').length,
      admins: this.admins.filter(a => a.role === 'ADMIN').length,
      active: this.admins.filter(a => a.status === 'active').length
    };

    // تحديث HTML الإحصائيات
    const container = document.getElementById('admin-stats-container');
    if (container) {
      container.innerHTML = `
        <div class="stat-card">
          <span class="stat-label">إجمالي الأدمنز</span>
          <span class="stat-value">${stats.total}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">الحكام</span>
          <span class="stat-value">${stats.moderators}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">المشرفون</span>
          <span class="stat-value">${stats.supervisors}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">الإدارة</span>
          <span class="stat-value">${stats.admins}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">النشطون</span>
          <span class="stat-value">${stats.active}</span>
        </div>
      `;
    }
  }
}

// إنشاء النظام عند تحميل الصفحة
let adminSystem;
function initAdminSystem() {
  if (typeof database !== 'undefined') {
    adminSystem = new AdminManagementSystem(database);
  }
}
