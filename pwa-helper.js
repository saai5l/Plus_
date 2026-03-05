// ============================================
// Plus Dev - PWA Helper v1.0
// يدير تثبيت التطبيق و Service Worker
// ============================================

class PWAHelper {
  constructor() {
    this.deferredPrompt = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  async init() {
    console.log('[PWA] Initializing PWA Helper...');

    // تسجيل Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });
        console.log('[PWA] Service Worker registered:', registration);
        this.handleUpdates(registration);
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error);
      }
    }

    // الاستماع لأحداث الاتصال
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // حدث التثبيت
    window.addEventListener('beforeinstallprompt', (e) => this.handleBeforeInstall(e));
    window.addEventListener('appinstalled', () => this.handleAppInstalled());

    // التحقق من حالة التثبيت
    this.checkInstallStatus();
  }

  // ============ معالجة التحديثات ============
  handleUpdates(registration) {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // هناك نسخة جديدة متاحة
          this.showUpdateNotification();
        }
      });
    });

    // فحص التحديثات كل ساعة
    setInterval(() => registration.update(), 3600000);
  }

  // ============ إشعار التحديث ============
  showUpdateNotification() {
    const banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <div class="update-content">
        <span>📢 نسخة جديدة متاحة!</span>
        <button class="update-btn">تحديث الآن</button>
      </div>
    `;

    document.body.insertBefore(banner, document.body.firstChild);

    banner.querySelector('.update-btn').addEventListener('click', () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    });

    setTimeout(() => banner.classList.add('show'), 100);
  }

  // ============ حدث التثبيت ============
  handleBeforeInstall(e) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showInstallPrompt();
  }

  // ============ إظهار طلب التثبيت ============
  showInstallPrompt() {
    const container = document.querySelector('.pwa-install-prompt') || this.createInstallPrompt();
    container.classList.add('visible');

    const installBtn = container.querySelector('.install-btn');
    const dismissBtn = container.querySelector('.dismiss-btn');

    installBtn.addEventListener('click', () => this.installApp());
    dismissBtn.addEventListener('click', () => container.classList.remove('visible'));
  }

  // ============ إنشاء عنصر التثبيت ============
  createInstallPrompt() {
    const container = document.createElement('div');
    container.className = 'pwa-install-prompt';
    container.innerHTML = `
      <div class="install-card">
        <div class="install-header">
          <img src="/Plus_Dev_No_Wellpeper.png" alt="Plus Dev" class="install-icon">
          <div class="install-info">
            <h3>ثبّت Plus Dev</h3>
            <p>وصول أسرع وسهولة أكثر</p>
          </div>
        </div>
        <div class="install-actions">
          <button class="install-btn">ثبّت الآن</button>
          <button class="dismiss-btn">ليس الآن</button>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    return container;
  }

  // ============ تثبيت التطبيق ============
  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    console.log(`[PWA] User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      this.deferredPrompt = null;
      document.querySelector('.pwa-install-prompt')?.classList.remove('visible');
      this.showSuccessMessage();
    }
  }

  // ============ رسالة النجاح ============
  showSuccessMessage() {
    const toast = document.createElement('div');
    toast.className = 'pwa-toast success';
    toast.innerHTML = `
      <div class="toast-content">
        <span>✅ تم تثبيت التطبيق بنجاح!</span>
      </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ============ التطبيق مثبت ============
  handleAppInstalled() {
    console.log('[PWA] App successfully installed');
    this.deferredPrompt = null;
    document.querySelector('.pwa-install-prompt')?.classList.remove('visible');

    // حفظ حالة التثبيت
    localStorage.setItem('plusdev_app_installed', 'true');

    // إرسال analytics
    this.trackEvent('app_installed');
  }

  // ============ التحقق من حالة التثبيت ============
  checkInstallStatus() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA] App is running as PWA');
      document.body.classList.add('pwa-installed');
      localStorage.setItem('plusdev_pwa_mode', 'true');
    }
  }

  // ============ معالجة الاتصال ============
  handleOnline() {
    this.isOnline = true;
    console.log('[PWA] Online');
    this.showStatusNotification('عادتك الإنترنت', 'success');
    document.body.classList.remove('offline');
  }

  handleOffline() {
    this.isOnline = false;
    console.log('[PWA] Offline');
    this.showStatusNotification('انقطعت الإنترنت', 'warning');
    document.body.classList.add('offline');
  }

  // ============ إشعار الحالة ============
  showStatusNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `pwa-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ============ طلب الإذن للـ Push Notifications ============
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('[PWA] Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('[PWA] Notification permission error:', error);
        return false;
      }
    }

    return false;
  }

  // ============ إرسال إخطار ============
  sendNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && 'ServiceWorkerContainer' in window) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            icon: '/Plus_Dev_No_Wellpeper.png',
            badge: '/Plus_Dev_No_Wellpeper.png',
            ...options
          });
        });
      }
    }
  }

  // ============ تتبع الأحداث ============
  trackEvent(eventName, eventData = {}) {
    if (window.gtag) {
      gtag('event', eventName, eventData);
    }
    console.log(`[PWA] Event tracked: ${eventName}`, eventData);
  }

  // ============ معلومات التطبيق ============
  getAppInfo() {
    return {
      isPWA: window.matchMedia('(display-mode: standalone)').matches,
      isOnline: this.isOnline,
      serviceWorkerSupported: 'serviceWorker' in navigator,
      notificationSupported: 'Notification' in window,
      cacheSupported: 'caches' in window
    };
  }
}

// تهيئة PWA عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  window.pwaHelper = new PWAHelper();
  console.log('[PWA] PWA Helper initialized');
});
