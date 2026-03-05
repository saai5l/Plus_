/* ================================================================
   Content Management System - نظام إدارة المحتوى
   ================================================================
   ميزات:
   - تعديل القوانين من اللوحة (بدون تحرير JSON)
   - إضافة/حذف الشروحات
   - تحديث متطلبات الوظائف
   - إدارة منتجات المتجر
================================================================ */

class ContentManager {
  constructor(database) {
    this.db = database;
    this.laws = [];
    this.tutorials = [];
    this.jobRequirements = {};
    this.storeProducts = [];
    
    this.loadAllContent();
  }

  // تحميل جميع المحتوى
  loadAllContent() {
    this.loadLaws();
    this.loadTutorials();
    this.loadJobRequirements();
    this.loadStoreProducts();
  }

  // ═══════════════════════════════════════════════════════════════
  // القوانين
  // ═══════════════════════════════════════════════════════════════

  loadLaws() {
    // محاولة تحميل من Firebase أولاً
    this.db.ref('laws').on('value', (snap) => {
      const data = snap.val();
      if (data && Array.isArray(data)) {
        this.laws = data;
      } else if (data && typeof data === 'object') {
        this.laws = Object.values(data);
      } else {
        this.laws = [];
      }
      this.renderLawsManager();
    }, (error) => {
      console.log('تحذير: لم يتم تحميل القوانين من Firebase، سيتم استخدام JSON المحلي');
    });
  }

  async addLaw(lawText) {
    try {
      if (!lawText.trim()) {
        return { success: false, message: 'نص القانون لا يمكن أن يكون فارغاً' };
      }

      const newLaw = {
        id: Date.now(),
        text: lawText.trim(),
        addedAt: new Date().toISOString(),
        addedBy: this.getCurrentAdminId(),
        category: 'general'
      };

      const lawIndex = this.laws.length;
      await this.db.ref(`laws/${lawIndex}`).set(newLaw);
      this.laws.push(newLaw);
      
      return { success: true, message: 'تم إضافة القانون بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  async editLaw(index, newText) {
    try {
      if (!newText.trim()) {
        return { success: false, message: 'نص القانون لا يمكن أن يكون فارغاً' };
      }

      this.laws[index].text = newText.trim();
      this.laws[index].lastEditedAt = new Date().toISOString();
      this.laws[index].lastEditedBy = this.getCurrentAdminId();

      await this.db.ref(`laws/${index}`).set(this.laws[index]);
      
      return { success: true, message: 'تم تعديل القانون بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  async deleteLaw(index) {
    try {
      this.laws.splice(index, 1);
      await this.db.ref(`laws/${index}`).remove();
      
      return { success: true, message: 'تم حذف القانون بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  renderLawsManager() {
    const container = document.getElementById('laws-manager-container');
    if (!container) return;

    const html = `
      <div class="content-section">
        <div class="section-header">
          <h3>إدارة القوانين</h3>
          <button class="btn-add" onclick="contentManager.openAddLawModal()">
            <i class="fas fa-plus"></i> إضافة قانون جديد
          </button>
        </div>

        <div class="laws-list">
          ${this.laws.length === 0 ? 
            '<p class="empty-message">لا توجد قوانين</p>' :
            this.laws.map((law, idx) => `
              <div class="law-item">
                <div class="law-number">${idx + 1}</div>
                <div class="law-content">
                  <p>${law.text}</p>
                  <small>أضيف بواسطة: ${law.addedBy} - ${new Date(law.addedAt).toLocaleDateString('ar-SA')}</small>
                </div>
                <div class="law-actions">
                  <button class="btn-edit" onclick="contentManager.openEditLawModal(${idx})">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-delete" onclick="contentManager.deleteConfirm(${idx}, 'law')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  openAddLawModal() {
    const modal = this.createModal('إضافة قانون جديد', `
      <textarea id="law-input" placeholder="أدخل نص القانون..." style="width:100%; height:150px; padding:10px; border-radius:8px; border:1px solid #ccc;"></textarea>
    `, () => {
      const lawText = document.getElementById('law-input').value;
      this.addLaw(lawText).then(result => {
        if (result.success) {
          alert(result.message);
          modal.remove();
        } else {
          alert('خطأ: ' + result.message);
        }
      });
    });
  }

  openEditLawModal(index) {
    const law = this.laws[index];
    const modal = this.createModal('تعديل القانون', `
      <textarea id="law-edit-input" style="width:100%; height:150px; padding:10px; border-radius:8px; border:1px solid #ccc;">${law.text}</textarea>
    `, () => {
      const newText = document.getElementById('law-edit-input').value;
      this.editLaw(index, newText).then(result => {
        if (result.success) {
          alert(result.message);
          modal.remove();
        } else {
          alert('خطأ: ' + result.message);
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // الشروحات
  // ═══════════════════════════════════════════════════════════════

  loadTutorials() {
    this.db.ref('tutorials').on('value', (snap) => {
      const data = snap.val();
      this.tutorials = data ? Object.values(data) : [];
      this.renderTutorialsManager();
    });
  }

  async addTutorial(title, content, category) {
    try {
      const newTutorial = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        addedAt: new Date().toISOString(),
        addedBy: this.getCurrentAdminId()
      };

      await this.db.ref(`tutorials/${newTutorial.id}`).set(newTutorial);
      
      return { success: true, message: 'تم إضافة الشرح بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  async deleteTutorial(tutorialId) {
    try {
      await this.db.ref(`tutorials/${tutorialId}`).remove();
      this.tutorials = this.tutorials.filter(t => t.id !== tutorialId);
      
      return { success: true, message: 'تم حذف الشرح بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  renderTutorialsManager() {
    const container = document.getElementById('tutorials-manager-container');
    if (!container) return;

    const html = `
      <div class="content-section">
        <div class="section-header">
          <h3>إدارة الشروحات</h3>
          <button class="btn-add" onclick="contentManager.openAddTutorialModal()">
            <i class="fas fa-plus"></i> إضافة شرح جديد
          </button>
        </div>

        <div class="tutorials-grid">
          ${this.tutorials.length === 0 ? 
            '<p class="empty-message">لا توجد شروحات</p>' :
            this.tutorials.map(tutorial => `
              <div class="tutorial-card">
                <h4>${tutorial.title}</h4>
                <span class="category-badge">${tutorial.category}</span>
                <p>${tutorial.content.substring(0, 100)}...</p>
                <div class="card-actions">
                  <button class="btn-delete" onclick="contentManager.deleteTutorial(${tutorial.id})">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')
          }
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  openAddTutorialModal() {
    const modal = this.createModal('إضافة شرح جديد', `
      <input type="text" id="tutorial-title" placeholder="عنوان الشرح" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ccc;">
      <input type="text" id="tutorial-category" placeholder="الفئة (مثل: الشرطة، الإسعاف)" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ccc;">
      <textarea id="tutorial-content" placeholder="محتوى الشرح..." style="width:100%; height:150px; padding:10px; border-radius:8px; border:1px solid #ccc;"></textarea>
    `, () => {
      const title = document.getElementById('tutorial-title').value;
      const category = document.getElementById('tutorial-category').value;
      const content = document.getElementById('tutorial-content').value;
      
      this.addTutorial(title, content, category).then(result => {
        if (result.success) {
          alert(result.message);
          modal.remove();
        } else {
          alert('خطأ: ' + result.message);
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // متطلبات الوظائف
  // ═══════════════════════════════════════════════════════════════

  loadJobRequirements() {
    this.db.ref('jobRequirements').on('value', (snap) => {
      const data = snap.val();
      this.jobRequirements = data || {};
      this.renderJobRequirementsManager();
    });
  }

  async updateJobRequirement(jobName, requirements) {
    try {
      await this.db.ref(`jobRequirements/${jobName}`).set(requirements);
      
      return { success: true, message: 'تم تحديث متطلبات الوظيفة بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  renderJobRequirementsManager() {
    const container = document.getElementById('jobs-requirements-container');
    if (!container) return;

    const jobs = ['police', 'ems', 'staff'];

    const html = `
      <div class="content-section">
        <h3>متطلبات الوظائف</h3>
        <div class="jobs-requirements">
          ${jobs.map(job => `
            <div class="job-requirement-card">
              <h4>${this.getJobName(job)}</h4>
              <textarea class="job-req-textarea" id="req-${job}" placeholder="أدخل المتطلبات..." style="width:100%; height:100px; padding:10px; border-radius:8px; border:1px solid #ccc;">
${(this.jobRequirements[job] || '').requirements || ''}
              </textarea>
              <button class="btn-save" onclick="contentManager.updateJobRequirement('${job}', document.getElementById('req-${job}').value)">
                <i class="fas fa-save"></i> حفظ
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // ═══════════════════════════════════════════════════════════════
  // منتجات المتجر
  // ═══════════════════════════════════════════════════════════════

  loadStoreProducts() {
    this.db.ref('storeProducts').on('value', (snap) => {
      const data = snap.val();
      this.storeProducts = data ? Object.values(data) : [];
      this.renderStoreProductsManager();
    });
  }

  async addStoreProduct(name, price, description) {
    try {
      const product = {
        id: Date.now(),
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        addedAt: new Date().toISOString(),
        addedBy: this.getCurrentAdminId()
      };

      await this.db.ref(`storeProducts/${product.id}`).set(product);
      
      return { success: true, message: 'تم إضافة المنتج بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  async deleteStoreProduct(productId) {
    try {
      await this.db.ref(`storeProducts/${productId}`).remove();
      this.storeProducts = this.storeProducts.filter(p => p.id !== productId);
      
      return { success: true, message: 'تم حذف المنتج بنجاح' };
    } catch (error) {
      return { success: false, message: 'خطأ: ' + error.message };
    }
  }

  renderStoreProductsManager() {
    const container = document.getElementById('store-products-container');
    if (!container) return;

    const html = `
      <div class="content-section">
        <div class="section-header">
          <h3>إدارة المتجر</h3>
          <button class="btn-add" onclick="contentManager.openAddProductModal()">
            <i class="fas fa-plus"></i> إضافة منتج
          </button>
        </div>

        <div class="products-table">
          <table>
            <thead>
              <tr>
                <th>اسم المنتج</th>
                <th>السعر</th>
                <th>الوصف</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              ${this.storeProducts.length === 0 ? 
                '<tr><td colspan="4" class="text-center">لا توجد منتجات</td></tr>' :
                this.storeProducts.map(product => `
                  <tr>
                    <td>${product.name}</td>
                    <td>₪${product.price}</td>
                    <td>${product.description}</td>
                    <td>
                      <button class="btn-delete" onclick="contentManager.deleteStoreProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  openAddProductModal() {
    const modal = this.createModal('إضافة منتج جديد', `
      <input type="text" id="product-name" placeholder="اسم المنتج" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ccc;">
      <input type="number" id="product-price" placeholder="السعر" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #ccc;">
      <textarea id="product-desc" placeholder="الوصف" style="width:100%; height:100px; padding:10px; border-radius:8px; border:1px solid #ccc;"></textarea>
    `, () => {
      const name = document.getElementById('product-name').value;
      const price = document.getElementById('product-price').value;
      const desc = document.getElementById('product-desc').value;
      
      this.addStoreProduct(name, price, desc).then(result => {
        if (result.success) {
          alert(result.message);
          modal.remove();
        } else {
          alert('خطأ: ' + result.message);
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // دوال مساعدة
  // ═══════════════════════════════════════════════════════════════

  createModal(title, content, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'content-modal';
    modal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-box">
          <div class="modal-header">
            <h3>${title}</h3>
            <button onclick="this.closest('.content-modal').remove()">×</button>
          </div>
          <div class="modal-content">
            ${content}
          </div>
          <div class="modal-footer">
            <button class="btn-confirm" onclick="(${onConfirm.toString()})()">تأكيد</button>
            <button class="btn-cancel" onclick="this.closest('.content-modal').remove()">إلغاء</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  deleteConfirm(index, type) {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      if (type === 'law') {
        this.deleteLaw(index);
      }
    }
  }

  getCurrentAdminId() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.id || 'unknown';
  }

  getJobName(jobKey) {
    const jobNames = {
      'police': '🚔 الشرطة',
      'ems': '🚑 الإسعاف',
      'staff': '👨‍💼 الإدارة'
    };
    return jobNames[jobKey] || jobKey;
  }
}

// إنشاء مدير المحتوى عند تحميل الصفحة
let contentManager;
function initContentManager() {
  if (typeof database !== 'undefined') {
    contentManager = new ContentManager(database);
  }
}
