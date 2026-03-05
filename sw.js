// ============================================
// Plus Dev - Service Worker v1.0
// PWA Support: Offline, Caching, Push Notifications
// ============================================

const CACHE_NAME = 'plusdev-v1.0';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/login.html',
  '/404.html',
  '/style.css',
  '/script.js',
  '/admin-dashboard.css',
  '/ai-chat-enhanced.css',
  '/ai-chat-enhanced.js',
  '/config.js',
  '/laws.json',
  '/Plus_Dev_No_Wellpeper.png',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ============ Install Event ============
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
        // متابعة حتى لو فشل بعض الملفات
        return cache.addAll(ASSETS_TO_CACHE.slice(0, -2));
      });
    })
  );
  self.skipWaiting(); // تفعيل فوري
});

// ============ Activate Event ============
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // تحكم فوري في العملاء
});

// ============ Fetch Event ============
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // لا نعمل cache للـ Analytics أو External APIs
  if (url.hostname !== location.hostname) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response('Offline - External resource unavailable', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
    return;
  }

  // Cache First Strategy للأصول الثابتة
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(response => {
          // تحديث الـ cache
          if (request.destination === 'document' || request.destination === 'style' || request.destination === 'script') {
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        }).catch(error => {
          console.error('[SW] Fetch error:', error);
          // صفحة offline
          if (request.destination === 'document') {
            return caches.match('/404.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
    );
  }
});

// ============ Background Sync (اختياري) ============
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

async function syncMessages() {
  try {
    const messages = JSON.parse(localStorage.getItem('pendingMessages') || '[]');
    for (const msg of messages) {
      // أرسل الرسالة
      await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify(msg)
      });
    }
    localStorage.setItem('pendingMessages', '[]');
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

// ============ Push Notifications ============
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'رسالة جديدة من Plus Dev',
      icon: '/Plus_Dev_No_Wellpeper.png',
      badge: '/Plus_Dev_No_Wellpeper.png',
      tag: 'plusdev-notification',
      requireInteraction: false,
      actions: [
        { action: 'open', title: 'فتح' },
        { action: 'close', title: 'إغلاق' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Plus Dev', options)
    );
  }
});

// ============ Notification Click ============
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // ابحث عن نافذة موجودة
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // افتح نافذة جديدة
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

console.log('[SW] Service Worker loaded successfully!');
