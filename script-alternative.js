/* ============================================
   نسخة بديلة - بدون Discord Webhook
   تخزين الطلبات في LocalStorage والـ Console
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

function showConfirmationModal(productName, productPrice, user) {
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
    
    document.getElementById('confirm-purchase-btn').onclick = () => {
        processPurchaseLocal(productName, productPrice, user);
        closePurchaseModal();
    };
}

function closePurchaseModal() {
    const modal = document.getElementById('purchase-modal');
    if (modal) modal.style.display = 'none';
}

function processPurchaseLocal(productName, productPrice, user) {
    showToast('⏳', 'معالجة الطلب', 'جاري حفظ طلبك...');
    
    try {
        // إنشاء كائن الطلب
        const order = {
            id: Date.now(),
            product: productName,
            price: productPrice,
            userId: user.id,
            username: user.global_name || user.username,
            email: user.email || 'غير متوفر',
            timestamp: new Date().toLocaleString('ar-SA'),
            isoTime: new Date().toISOString(),
            status: 'pending'
        };
        
        // حفظ في LocalStorage
        let orders = JSON.parse(localStorage.getItem('shop_orders') || '[]');
        orders.push(order);
        localStorage.setItem('shop_orders', JSON.stringify(orders));
        
        // طباعة في Console للمسؤول
        console.log('%c🛒 طلب شراء جديد!', 'color: #fc7823; font-size: 16px; font-weight: bold;');
        console.table(order);
        console.log('%cالطلبات المحفوظة:', 'color: #fc7823; font-weight: bold;');
        console.table(orders);
        
        // عرض رسالة نجاح
        showToast('✅', 'تم الحفظ بنجاح!', 'سيتم التواصل معك قريباً');
        addNotification('success', 'طلب شراء مؤكد', `تم تأكيد طلبك على "${productName}" بسعر $${productPrice}`);
        
    } catch (error) {
        console.error('خطأ في حفظ الطلب:', error);
        showToast('❌', 'خطأ', 'حدث خطأ أثناء معالجة طلبك');
        addNotification('danger', 'خطأ في الطلب', 'فشل حفظ طلب الشراء');
    }
}

// دالة لعرض جميع الطلبات في Console (للمسؤول)
function viewAllOrders() {
    const orders = JSON.parse(localStorage.getItem('shop_orders') || '[]');
    if (orders.length === 0) {
        console.log('%c❌ لا توجد طلبات بعد', 'color: red; font-size: 14px;');
        return;
    }
    console.log('%c📋 جميع الطلبات:', 'color: #2ecc71; font-size: 16px; font-weight: bold;');
    console.table(orders);
}

// اختياري: دالة لتصدير الطلبات كـ CSV
function exportOrdersAsCSV() {
    const orders = JSON.parse(localStorage.getItem('shop_orders') || '[]');
    if (orders.length === 0) {
        alert('لا توجد طلبات للتصدير');
        return;
    }
    
    let csv = 'ID,المنتج,السعر,المستخدم,Discord ID,البريد,الوقت,الحالة\n';
    
    orders.forEach(order => {
        csv += `${order.id},"${order.product}",${order.price},"${order.username}",${order.userId},"${order.email}","${order.timestamp}",${order.status}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    showToast('✅', 'تم التصدير', 'تم تحميل الطلبات كملف CSV');
}

// دالة لحذف طلب معين
function deleteOrder(orderId) {
    let orders = JSON.parse(localStorage.getItem('shop_orders') || '[]');
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('shop_orders', JSON.stringify(orders));
    console.log('تم حذف الطلب:', orderId);
}

// دالة لحذف جميع الطلبات
function clearAllOrders() {
    if (confirm('هل تتأكد من حذف جميع الطلبات؟')) {
        localStorage.removeItem('shop_orders');
        console.log('تم حذف جميع الطلبات');
        showToast('✅', 'تم الحذف', 'تم مسح جميع الطلبات');
    }
}
