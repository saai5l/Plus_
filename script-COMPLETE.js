/* ============================================
   WEBHOOK_URL - ضع الـ URL الخاص بك هنا
   ============================================ */

// ⚠️ ضروري جداً: استبدل هذا بـ Webhook URL الحقيقي من Discord
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1462742583515156668/p-BwPQ1WMi6fj8NhAGa0W9GtZFXNwU5Gkas_pQAkqnJVHPJrLvOU7sWLg-YzedUmwZwJ';

/* ============================================
   💳 نظام الشراء المتكامل
   ============================================ */

function buyProduct(name, price) {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        showToast('⚠️', 'يجب تسجيل الدخول', 'سجّل دخولك أولاً للشراء');
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }
    if (price === 0) {
        showToast('✅', 'تم التحميل!', `تم تحميل "${name}" بنجاح`);
        addNotification('success', 'تحميل مجاني', `تم تحميل "${name}" بنجاح`);
    } else {
        showConfirmationModal(name, price, user);
    }
}

/* ============================================
   💳 PURCHASE CONFIRMATION MODAL
   ============================================ */

function showConfirmationModal(productName, productPrice, user) {
    // إنشاء الـ Modal ديناميكياً
    let modal = document.getElementById('purchase-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'purchase-modal';
        modal.className = 'custom-modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-header">🛒 تأكيد طلب الشراء</h3>
            <div class="modal-body">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="background: linear-gradient(135deg, #fc7823, #e66a1f); padding: 20px; border-radius: 10px; margin-bottom: 15px;">
                        <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8); margin: 5px 0;">المنتج</p>
                        <p style="font-size: 1.3rem; color: #fff; font-weight: bold; margin: 5px 0;">${productName}</p>
                    </div>
                    <div style="background: rgba(252, 120, 35, 0.1); padding: 15px; border-radius: 10px; border: 2px solid rgba(252, 120, 35, 0.3);">
                        <p style="font-size: 0.85rem; color: #aaa; margin: 5px 0;">السعر</p>
                        <p style="font-size: 2rem; color: #fc7823; font-weight: bold; margin: 5px 0;">$${productPrice}</p>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-top: 15px;">
                    <p style="font-size: 0.9rem; color: #ddd; line-height: 1.6;">
                        <strong>معلوماتك:</strong><br>
                        الاسم: ${user.global_name || user.username}<br>
                        Discord ID: ${user.id}<br>
                        البريد: ${user.email || 'غير متوفر'}
                    </p>
                </div>
                <p style="color: #fc7823; font-size: 0.85rem; margin-top: 15px; text-align: center;">
                    هل تتأكد من رغبتك في شراء هذا المنتج؟
                </p>
            </div>
            <div class="modal-footer">
                <button id="confirm-purchase-btn" class="modal-btn btn-confirm">✅ نعم، أوافق</button>
                <button onclick="closePurchaseModal()" class="modal-btn btn-cancel">❌ إلغاء</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // الزر تأكيد
    document.getElementById('confirm-purchase-btn').onclick = () => {
        processPurchase(productName, productPrice, user);
        closePurchaseModal();
    };
}

function closePurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if (modal) modal.style.display = 'none';
}

async function processPurchase(productName, productPrice, user) {
    // إظهار رسالة جارية
    showToast('⏳', 'معالجة الطلب', 'جاري إرسال طلبك...');
    
    try {
        // تحقق من الـ URL
        if (WEBHOOK_URL.includes('YOUR_WEBHOOK')) {
            showToast('⚠️', 'خطأ في الإعدادات', 'يرجى تكوين Webhook URL أولاً!');
            console.error('❌ WEBHOOK_URL لم يتم تكوينها! ضع الـ URL الصحيح في script.js');
            return;
        }
        
        // إعداد بيانات الرسالة للديسكورد
        const discordMessage = {
            content: '🛒 طلب شراء جديد!',
            embeds: [{
                color: 16629783, // لون برتقالي #fc7823
                title: '🛒 طلب شراء جديد',
                description: `تم استقبال طلب شراء جديد من المتجر`,
                fields: [
                    {
                        name: '📦 المنتج',
                        value: productName,
                        inline: true
                    },
                    {
                        name: '💵 السعر',
                        value: `$${productPrice}`,
                        inline: true
                    },
                    {
                        name: '👤 اسم المستخدم',
                        value: user.global_name || user.username,
                        inline: true
                    },
                    {
                        name: '🔑 Discord ID',
                        value: user.id,
                        inline: true
                    },
                    {
                        name: '📧 البريد الإلكتروني',
                        value: user.email || 'غير متوفر',
                        inline: false
                    },
                    {
                        name: '⏰ الوقت والتاريخ',
                        value: new Date().toLocaleString('ar-SA'),
                        inline: false
                    }
                ],
                footer: {
                    text: 'Plus Dev - نظام الشراء المتكامل'
                },
                timestamp: new Date().toISOString()
            }]
        };
        
        // إرسال الطلب للديسكورد
        console.log('📤 جاري الإرسال للديسكورد...');
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(discordMessage)
        });
        
        if (response.ok) {
            console.log('✅ تم الإرسال بنجاح!');
            showToast('✅', 'تم الإرسال بنجاح!', 'سيتم التواصل معك قريباً');
            addNotification('success', 'طلب شراء مؤكد', `تم تأكيد طلبك على "${productName}" بسعر $${productPrice}`);
        } else {
            throw new Error(`الخادم أرجع الحالة: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ خطأ في إرسال الطلب:', error);
        showToast('❌', 'خطأ في الإرسال', 'تحقق من الـ Webhook URL وحاول مجدداً');
        addNotification('danger', 'خطأ في الطلب', 'فشل إرسال طلب الشراء. تحقق من الإعدادات');
    }
}

/* ============================================
   🔔 NOTIFICATION SYSTEM
   ============================================ */

let notifications = JSON.parse(localStorage.getItem('pd_notifs') || '[]');

function initNotifications() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const bell = document.getElementById('notif-bell');
    if (bell) bell.style.display = user ? 'flex' : 'none';
    renderNotifs();
}

function addNotification(type, title, msg) {
    if (!title || !msg) return;

    const isDuplicate = notifications.some(n =>
        n.title === title && n.msg === msg && (Date.now() - n.id) < 1000
    );
    if (isDuplicate) return;

    const notif = {
        id: Date.now(),
        type: type || 'info',
        title,
        msg,
        time: new Date().toLocaleTimeString('ar', {hour:'2-digit', minute:'2-digit'}),
        read: false
    };
    notifications.unshift(notif);
    if (notifications.length > 30) notifications = notifications.slice(0, 30);
    saveNotifs();
    renderNotifs();
    showToast(
        type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'danger' ? '❌' : 'ℹ️',
        title, msg
    );
}

function saveNotifs() {
    localStorage.setItem('pd_notifs', JSON.stringify(notifications));
}

function renderNotifs() {
    const list = document.getElementById('notif-list');
    const count = document.getElementById('notif-count');
    const empty = document.getElementById('notif-empty');
    if (!list) return;

    const unread = notifications.filter(n => !n.read).length;

    if (count) {
        if (unread > 0) {
            count.style.display = 'flex';
            count.textContent = unread > 9 ? '9+' : unread;
        } else {
            count.style.display = 'none';
        }
    }

    const items = list.querySelectorAll('.notif-item');
    items.forEach(i => i.remove());

    if (notifications.length === 0) {
        if (empty) empty.style.display = 'flex';
        return;
    }

    if (empty) empty.style.display = 'none';

    notifications.forEach(notif => {
        const item = document.createElement('div');
        item.className = `notif-item notif-${notif.type}`;
        item.innerHTML = `
            <div class="notif-icon">
                ${notif.type === 'success' ? '✅' : notif.type === 'warning' ? '⚠️' : notif.type === 'danger' ? '❌' : 'ℹ️'}
            </div>
            <div class="notif-content">
                <p class="notif-title">${notif.title}</p>
                <p class="notif-msg">${notif.msg}</p>
                <span class="notif-time">${notif.time}</span>
            </div>
            <button class="notif-close" onclick="removeNotif(${notif.id})">×</button>
        `;
        list.appendChild(item);
    });
}

function removeNotif(id) {
    notifications = notifications.filter(n => n.id !== id);
    saveNotifs();
    renderNotifs();
}

function clearAllNotifs(event) {
    event.stopPropagation();
    notifications = [];
    saveNotifs();
    renderNotifs();
}

function toggleNotifDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown) dropdown.classList.toggle('show');
}

document.addEventListener('click', () => {
    const dropdown = document.getElementById('notif-dropdown');
    if (dropdown) dropdown.classList.remove('show');
});

// تهيئة الإشعارات عند التحميل
window.addEventListener('load', initNotifications);
