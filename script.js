const firebaseConfig = {
    apiKey: "AIzaSyB5r_RltNkExAb3wHhgfMuCWPg_GzEd_Ok",
    authDomain: "planning-with-ai-60a3c.firebaseapp.com",
    databaseURL: "https://planning-with-ai-60a3c-default-rtdb.firebaseio.com",
    projectId: "planning-with-ai-60a3c",
    storageBucket: "planning-with-ai-60a3c.firebasestorage.app",
    messagingSenderId: "493882886067",
    appId: "1:493882886067:web:ed8f0db9678a7e8a042dc6"
};

if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
} else {
    console.error("خطأ: مكتبة Firebase لم يتم تحميلها بشكل صحيح في index.html");
}

// الأدمنز يُقرأون من Firebase — لا تعدّل هنا
let ADMIN_IDS = ["1453875192009986166",""]; // fallback مؤقت حتى يتحمل Firebase

// تحميل الأدمنز من Firebase وتحديث الـ UI
function loadAdminIds() {
    database.ref('adminIds').on('value', (snap) => {
        const data = snap.val();
        if (data && typeof data === 'object') {
            ADMIN_IDS = Object.values(data).map(a => a.id).filter(Boolean);
        } else {
            ADMIN_IDS = ["1453875192009986166",""];
        }
        // أعد رسم زر الأدمن بعد تحديث القائمة
        const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (savedUser) updateUI(savedUser);
        renderAdminIds();
    });
}

        const jobConfig = {
            police: { open: true, webhook: "https://discord.com/api/webhooks/1462742583515156668/p-BwPQ1WMi6fj8NhAGa0W9GtZFXNwU5Gkas_pQAkqnJVHPJrLvOU7sWLg-YzedUmwZwJ" },
            ems: { open: true, webhook: "https://discord.com/api/webhooks/1462742583515156668/p-BwPQ1WMi6fj8NhAGa0W9GtZFXNwU5Gkas_pQAkqnJVHPJrLvOU7sWLg-YzedUmwZwJ" },
            staff: { open: true, webhook: "https://discord.com/api/webhooks/1462742583515156668/p-BwPQ1WMi6fj8NhAGa0W9GtZFXNwU5Gkas_pQAkqnJVHPJrLvOU7sWLg-YzedUmwZwJ" }
        };

function showPage(pageId) {
  if (pageId === 'admin-dashboard') {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (!savedUser || !ADMIN_IDS.includes(savedUser.id)) {
          showNotification('⚠️ عذراً، لا تملك صلاحية الوصول للوحة الإدارة', true);
          return; 
      }
  }

  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    if (page.id === pageId) {
      page.classList.add('active', 'fade-in');
      page.classList.remove('fade-out');
    } else if (page.classList.contains('active')) {
      page.classList.remove('fade-in');
      page.classList.add('fade-out');
      setTimeout(() => { page.classList.remove('active'); }, 300); 
    }
  });

  if (pageId === 'admin-dashboard') {
      loadAdminData();
  }
  if (pageId === 'tracking-page') {
      loadUserTrackingData();
  }

  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
      link.classList.add('active');
    }
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

        function showLawSection(sectionId) {
            document.querySelectorAll('.law-section').forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(sectionId).classList.add('active');
            
            document.querySelectorAll('.law-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const lawBtns = document.querySelectorAll('.law-btn');
            for (let i = 0; i < lawBtns.length; i++) {
                if (lawBtns[i].getAttribute('onclick') === `showLawSection('${sectionId}')`) {
                    lawBtns[i].classList.add('active');
                    break;
                }
            }
        }
        
        document.querySelectorAll('.collapse-btn').forEach(button => {
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    content.classList.remove('show');
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.classList.add('show');
                }
            });
        });
        
function openJobModal(jobType) {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    
    if (!savedUser) {
        showNotification('⚠️ يرجى تسجيل الدخول عبر ديسكورد أولاً', true);
        return;
    }

    let apps = JSON.parse(localStorage.getItem('serverApplications')) || [];
    const hasPending = apps.find(app => app.discordId === savedUser.id && app.status === "معلق");

    if (hasPending) {
        openCustomConfirm(
            `لديك طلب سابق معلق برقم (${hasPending.appId}). يرجى انتظار الرد قبل التقديم مرة أخرى.`,
            "طلب معلق",
            "fa-clock",
            function() { closeConfirmModal(); }
        );
        return;
    }

    showRequirements(jobType);
}

const jobRequirements = {
    'police': ['العمر 17+', 'ميكروفون سليم',  'الالتزام بالرتب',  'احترام قوانين السيرفر',  'الجدية في الرول بلاي',  'القدرة على التواصل والعمل الجماعي',  'التواجد الجيد أثناء فترات النشاط'],
    'ems': ['العمر 16+', 'سرعة الاستجابة للحالات', 'اللباقة وحسن التعامل', 'خبرة في الإسعاف والرول الطبي', 'الهدوء تحت الضغط', 'الالتزام بتعليمات الطاقم الطبي'],
    'staff': ['العمر 18+', 'التواجد اليومي', 'خبرة إدارية سابقة', 'الحيادية في اتخاذ القرارات', 'التعامل الراقي مع اللاعبين']
};

function showRequirements(jobType) {
    const reqModal = document.getElementById('req-modal');
    const reqList = document.getElementById('req-list');
    const requirements = jobRequirements[jobType] || ['يجب الالتزام بالقوانين'];

    reqList.innerHTML = requirements.map(r => `<p style="margin:10px 0;"><i class="fa-solid fa-check" style="color:#fc7823;"></i> ${r}</p>`).join('');
    reqModal.style.display = 'flex';

    document.getElementById('accept-req').onclick = function() {
        reqModal.style.display = 'none';
        finalizeOpenForm(jobType); 
    };
}

function finalizeOpenForm(jobType) {
    const modal = document.getElementById('job-modal');
    const jobTypeInput = document.getElementById('job-type');
    const discordIdInput = document.getElementById('discord-id-input');
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (modal) {
        if (jobTypeInput) jobTypeInput.value = jobType;
        document.getElementById('modal-title').textContent = `تقديم على ${getJobTitle(jobType)}`;
        modal.classList.add('active');

        if (discordIdInput && savedUser) {
            discordIdInput.value = savedUser.id;
            discordIdInput.readOnly = true;
        }
    }
}

function closeReqModal() {
    document.getElementById('req-modal').style.display = 'none';
}

function closeModal() {
    document.getElementById('job-modal').classList.remove('active');
    document.getElementById('job-form').reset();
}

document.getElementById('job-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const jobType = document.getElementById('job-type').value;
    const characterName = document.getElementById('character-name').value;
    const characterId = document.getElementById('character-id').value; 
    const phoneNumber = document.getElementById('phone-number').value;
    const discordUser = document.getElementById('discord-id-input').value; 
    const reason = document.getElementById('reason').value;

    if (!discordUser) {
        showNotification('⚠️ سجل دخولك أولاً عبر ديسكورد', true);
        return;
    }


const counterRef = database.ref('settings/app_counter');
counterRef.transaction(function(currentValue) {
    return (currentValue || 200) + 1;
}).then(function(result) {
    const currentCounter = result.snapshot.val() - 1;
    const newAppId = `PLUS-${currentCounter}`;
    
    sendApplicationToDiscord(newAppId, jobType, characterName, characterId, phoneNumber, discordUser, reason);
});

async function sendApplicationToDiscord(newAppId, jobType, characterName, characterId, phoneNumber, discordUser, reason) {
    const jobTitle = getJobTitle(jobType);
    const webhookUrl = jobConfig[jobType].webhook;

    const data = {
        embeds: [{
            title: `تقديم جديد - ${jobTitle}`,
            description: `**رقم الطلب:** \`${newAppId}\``, 
            color: 0xfc7823,
            fields: [
                { name: "Name - ألاسم", value: characterName, inline: false },
                { name: "Steam - ستيم", value: characterId, inline: false },
                { name: "Discord ID - أيدي الديسكورد", value: `<@${discordUser}>`, inline: false },
                { name: "Time - الوقت المتاح", value: phoneNumber, inline: false },
                { name: "Reason - سبب التقديم", value: reason, inline: false }
            ],
            footer: { text: "Plus Dev System" },
            timestamp: new Date()
        }]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showNotification(`✅ تم الإرسال بنجاح! رقمك هو: ${newAppId}`);
            saveToAdminDashboard(characterName, jobTitle, reason, discordUser, newAppId);
            closeModal();
            document.getElementById('job-form').reset();
            if (typeof loadUserTrackingData === "function") loadUserTrackingData();
        }
    } catch (error) {
        showNotification('❌ حدث خطأ في الاتصال بالديسكورد', true);
    }
}
});

function saveToAdminDashboard(name, job, reason, discordId, appId) {
    const newApp = {
        appId: appId, 
        name: name,
        job: job,
        date: new Date().toLocaleDateString('ar-SA'),
        status: "معلق",
        reason: reason,
        discordId: discordId,
        adminNote: ""
    };

    database.ref('applications/' + appId).set(newApp)
    .then(() => {
        console.log("تم حفظ الطلب بنجاح في قاعدة البيانات العالمية");
    })
 .catch((error) => {
    console.error("خطأ في حفظ البيانات سحابياً:", error);
    showNotification("فشل في حفظ الطلب، تأكد من الاتصال بالإنترنت", true);
});
}
function getJobTitle(jobType) {
    const titles = {
        'police': 'الشرطة LSPD',
        'ems': 'الإسعاف EMS',
        'staff': 'فريق الإدارة'
    };
    return titles[jobType] || 'وظيفة غير معروفة';
}
        
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMsg = document.getElementById('notification-message');
    
    notificationMsg.textContent = message;
    
    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
});

    window.addEventListener("load", () => {
        setTimeout(() => {
            const loader = document.getElementById("loading-screen");
            loader.style.display = "none";
        }, 1500); 
    });

// Live Server code removed


    document.addEventListener('contextmenu', e => e.preventDefault());

function showCategory(category) {
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.category-section').forEach(sec => sec.classList.remove('active'));

  document.querySelector(`[onclick="showCategory('${category}')"]`).classList.add('active');
  document.getElementById(category).classList.add('active');
}



document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 50; 
  const appearDelay = 400; 

  const startCounting = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;

    const updateCount = () => {
      const increment = Math.ceil(target / speed);
      count += increment;
      counter.textContent = count > target ? target + '+' : count + '+';
      if (count < target) setTimeout(updateCount, 30);
    };

    setTimeout(updateCount, appearDelay);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting(entry.target);
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
});


const observerOptions = { threshold: 0.1 };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('.page section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.6s ease-out";
    revealObserver.observe(section);
});

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = (Math.random() * 0.3) - 0.15; 
        this.speedY = (Math.random() * 0.3) - 0.15;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.size > 0.2) this.size -= 0.002; 
    }
    draw() {
        ctx.fillStyle = 'rgba(252, 120, 35, 0.4)'; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < 100; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        if (particlesArray[i].size <= 0.2) {
            particlesArray.splice(i, 1);
            i--;
            particlesArray.push(new Particle());
        }
    }
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });

        faqItem.classList.toggle('active');
    });
});


function toggleChat() {
    const chatWin = document.getElementById('ai-chat-window');
    chatWin.style.display = (chatWin.style.display === 'none' || chatWin.style.display === '') ? 'flex' : 'none';
}

function similarity(s1, s2) {
    let longer = s1.length < s2.length ? s2 : s1;
    let shorter = s1.length < s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
    let costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) costs[j] = j;
            else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

async function askAI() {
    const input = document.getElementById('ai-input');
    const chatBody = document.getElementById('chat-body');
    const query = input.value.trim().toLowerCase();

    if (!query) return;

    chatBody.innerHTML += `<div class="user-msg">${input.value}</div>`;
    input.value = '';

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-msg';
    loadingDiv.innerText = 'جاري تحليل سؤالك...';
    chatBody.appendChild(loadingDiv);

    try {
        const response = await fetch('laws.json');
        const laws = await response.json();

        let bestMatch = null;
        let maxMatches = 0;

        const stopWords = ["ما", "هي", "هو", "كيف", "عن", "في", "قوانين", "قانون"];
        const searchTerms = query.split(' ').filter(word => !stopWords.includes(word));

        laws.forEach(law => {
            let matchCount = 0;
            const lawText = law.toLowerCase();
            
            searchTerms.forEach(term => {
                if (lawText.includes(term)) {
                    matchCount++;
                }
            });

            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                bestMatch = law;
            }
        });

        setTimeout(() => {
            if (maxMatches > 0) {
                loadingDiv.innerHTML = `<strong>Plus Bot:</strong> <br> ${bestMatch}`;
            } else {
                loadingDiv.innerText = "❌ لم أجد تفاصيل دقيقة، حاول كتابة كلمات مفتاحية أخرى (مثل: سرقة، خطف، اسعاف).";
            }
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 400);

    } catch (error) {
        loadingDiv.innerText = "⚠️ حدث خطأ في الاتصال بالقوانين.";
    }
}


const CLIENT_ID = '1453875994988380373'; 
const REDIRECT_URI = 'https://saai5l.github.io/Plus_/login.html';

function login() {
    window.location.href = 'login.html';
}

function toggleUserMenu(event) {
    event.stopPropagation(); 
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('show');
}

window.onclick = function(event) {
    if (!event.target.matches('.user-avatar-wrapper img')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

window.onclick = function(event) {
    const menu = document.getElementById("user-dropdown");
    if (menu && !event.target.closest('.user-profile')) {
        menu.classList.remove("show");
    }
}

window.addEventListener('load', () => {
    try {
        const raw = localStorage.getItem('user') || localStorage.getItem('plusdev_user');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.id && parsed.name) {
                localStorage.setItem('user', JSON.stringify(parsed));
                localStorage.setItem('plusdev_user', JSON.stringify(parsed));
                updateUI(parsed);
            }
        }
    } catch(e) {
        localStorage.removeItem('user');
        localStorage.removeItem('plusdev_user');
    }
});

function updateUI(user) {
    const loginBtn = document.getElementById('login-btn');
    const userArea = document.getElementById('user-area');
    const userAvatar = document.getElementById('user-avatar');
    const userDisplayName = document.getElementById('user-display-name');
    const userStatus = document.getElementById('user-status');
    const userDiscordId = document.getElementById('user-discord-id');
    
    const discordIdInput = document.getElementById('discord-id-input');

    if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userArea) userArea.style.display = 'flex';
        
        if (userAvatar) userAvatar.src = user.avatar || '';
        if (userDisplayName) userDisplayName.innerText = user.name || '';
        
        if (userDiscordId) {
            userDiscordId.innerText = "ID: " + user.id;
        }

        if (discordIdInput) {
            discordIdInput.value = user.id;
            discordIdInput.readOnly = true; 
            discordIdInput.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
            discordIdInput.style.cursor = "not-allowed"; 
            discordIdInput.title = "يجب عليك استخدام حسابك الحالي للتقديم";
        }

        if (ADMIN_IDS.includes(user.id)) {
            userStatus.innerText = "Higher Administration";
            userStatus.style.color = "#fc7823";
            if (document.getElementById('admin-btn')) {
                document.getElementById('admin-btn').style.display = 'flex';
            }
        } else {
            userStatus.innerText = "Player";
            userStatus.style.color = "#aaaaaa";
        }
        // إشعار الترحيب
        if (typeof initLoginNotification === 'function') initLoginNotification(user);
    } else {
        if (loginBtn) loginBtn.style.display = 'flex';
        if (userArea) userArea.style.display = 'none';
        
        if (discordIdInput) {
            discordIdInput.value = '';
            discordIdInput.readOnly = false;
            discordIdInput.style.backgroundColor = ""; 
            discordIdInput.style.cursor = "text";
        }
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = "index.html";
}

window.onclick = function(event) {
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown && dropdown.classList.contains('show')) {
        if (!event.target.closest('.user-profile')) {
            dropdown.classList.remove("show");
        }
    }
}


function updateJobStatus(job) {
    alert("تم تحديث حالة تقديم " + job + " بنجاح (برمجياً)");
}

function clearLogs() {
    openCustomConfirm(
        "تحذير: هل أنت متأكد من مسح جميع سجلات التقديم من السحابة نهائياً؟",
        "تصفير قاعدة البيانات",
        "fa-eraser",
        function() {
            database.ref('applications').remove()
            .then(() => {
                database.ref('settings/app_counter').set(200);
                showNotification("تم تصفير النظام السحابي بالكامل", true);
            })
            .catch((error) => {
                console.error("خطأ أثناء المسح:", error);
                showNotification("فشل في مسح البيانات من السحابة", true);
            });
        }
    );
}

const mockJobs = [
    { name: "Sultan_05", job: "الشرطة", date: "2024/05/20", status: "معلق" },
    { name: "Fahad_Player", job: "الإسعاف", date: "2024/05/19", status: "معلق" },
    { name: "Mshari_X", job: "الميكانيكي", date: "2024/05/18", status: "معلق" }
];

function loadAdminData() {
    const tableBody = document.getElementById('jobs-table-body');
    if (!tableBody) return;
    
    // تحديث قائمة الأدمنز
    renderAdminIds();

    database.ref('applications').on('value', (snapshot) => {
        const data = snapshot.val();
        tableBody.innerHTML = ""; 

        if (!data) {
            tableBody.innerHTML = `<tr><td colspan="6" class="empty-msg">لا توجد طلبات تقديم حالياً</td></tr>`;
            if(document.getElementById('total-apps')) document.getElementById('total-apps').textContent = '0';
            return;
        }

        const apps = Object.values(data);

        if(document.getElementById('total-apps')) document.getElementById('total-apps').textContent = apps.length;
        if(document.getElementById('approved-apps')) document.getElementById('approved-apps').textContent = apps.filter(a => a.status === 'مقبول').length;
        if(document.getElementById('rejected-apps')) document.getElementById('rejected-apps').textContent = apps.filter(a => a.status === 'رفض').length;

        [...apps].reverse().forEach((app) => {
            const statusClass = app.status === 'مقبول' ? 'status-approved' : (app.status === 'رفض' ? 'status-rejected' : 'status-pending');
            
            tableBody.innerHTML += `
                <tr>
                    <td class="app-id-cell">${app.appId || '---'}</td>
                    <td class="user-name">${app.name}</td>
                    <td class="job-type">${app.job}</td>
                    <td>
                        <textarea id="admin-note-${app.appId}" 
                                  class="admin-textarea" 
                                  placeholder="أضف ملاحظة للمستخدم...">${app.adminNote || ''}</textarea>
                    </td>
                    <td><span class="status-tag ${statusClass}">${app.status}</span></td>
                    <td>
                        <div class="action-group">
                            <button class="action-btn btn-accept" onclick="submitDecision('${app.appId}', 'مقبول')" title="قبول"><i class="fa-solid fa-check"></i></button>
                            <button class="action-btn btn-decline" onclick="submitDecision('${app.appId}', 'رفض')" title="رفض"><i class="fa-solid fa-xmark"></i></button>
                            <button class="action-btn btn-remove" onclick="deleteApplication('${app.appId}')" title="حذف"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>`;
        });
    });
}

function submitDecision(index, status) {
    const statusText = status === 'مقبول' ? 'قبول' : 'رفض';
    const icon = status === 'مقبول' ? 'fa-check-circle' : 'fa-circle-xmark';
    
    openCustomConfirm(
        `هل أنت متأكد من ${statusText} هذا الطلب؟`,
        `تأكيد قرار الـ ${statusText}`,
        icon,
        function() {
            executeDecision(index, status);
        }
    );
}
function actionJob(index, type) {
    alert(`تم ${type} طلب ${mockJobs[index].name} بنجاح!`);
}


if (document.getElementById('admin-dashboard')) {
    loadAdminData();
}

function manageApplication(index, newStatus) {
    let apps = JSON.parse(localStorage.getItem('serverApplications')) || [];
    
    if(apps[index]) {
        apps[index].status = newStatus;
        localStorage.setItem('serverApplications', JSON.stringify(apps));
        showNotification(`تم تحديث الحالة إلى: ${newStatus}`);
        loadAdminData(); 
    }
}

function deleteApplication(appId) {
    openCustomConfirm(
        "هل أنت متأكد من حذف هذا الطلب بشكل نهائي من قاعدة البيانات؟",
        "حذف طلب",
        "fa-trash-can",
        function() {
            database.ref('applications/' + appId).remove()
            .then(() => {
                showNotification("تم حذف الطلب بنجاح", true);
            })
            .catch(err => {
                showNotification("خطأ في عملية الحذف", true);
            });
        }
    );
}




const jobNames = {
    police: 'شرطة LSPD',
    ems: 'فريق EMS',
    staff: 'فريق الإدارة'
};

function pushGlobalNotif(type, title, msg) {
    // يحفظ الإشعار في Firebase ليصل لكل المستخدمين
    const notif = {
        id: Date.now(),
        type,
        title,
        msg,
        time: new Date().toLocaleTimeString('ar', {hour:'2-digit', minute:'2-digit'}),
        timestamp: Date.now()
    };
    database.ref('globalNotifs').push(notif);
}

function updateJobStatus(jobType) {
    const btn = document.getElementById(`toggle-${jobType}`);
    const isCurrentlyOn = btn && btn.innerText === "ON";
    
    database.ref('jobStatus/' + jobType).set({
        closed: isCurrentlyOn
    });

    // إرسال إشعار عام للكل
    const jobLabel = jobNames[jobType] || jobType;
    if (isCurrentlyOn) {
        pushGlobalNotif('warning', `🔒 إغلاق التقديم — ${jobLabel}`, `تم إغلاق باب التقديم على وظيفة ${jobLabel} مؤقتاً من قِبل الإدارة.`);
    } else {
        pushGlobalNotif('success', `🟢 فُتح التقديم — ${jobLabel}`, `فُتح باب التقديم على وظيفة ${jobLabel}! لا تفوّت الفرصة وقدّم الآن.`);
    }
}

function toggleAllJobs() {
    const jobs = ['police', 'ems', 'staff'];
    const mainBtn = document.getElementById('toggle-all');
    const shouldClose = mainBtn && mainBtn.innerText === "ON";

    jobs.forEach(job => {
        database.ref('jobStatus/' + job).set({ closed: shouldClose });
    });

    // إشعار عام للكل
    if (shouldClose) {
        pushGlobalNotif('warning', '🔒 تم إغلاق جميع التقديمات', 'تم إغلاق التقديم على جميع الوظائف مؤقتاً');
    } else {
        pushGlobalNotif('success', '🟢 فُتحت جميع التقديمات', 'تم فتح التقديم على جميع الوظائف، قدّم الآن!');
    }
}

/* ════ مستمع الإشعارات العامة من Firebase ════ */
(function() {
    // نبدأ الاستماع فقط من اللحظة الحالية — نتجاهل الإشعارات القديمة
    const startTime = Date.now();

    database.ref('globalNotifs')
        .orderByChild('timestamp')
        .startAt(startTime)
        .on('child_added', (snap) => {
            const notif = snap.val();
            if (!notif || !notif.title || !notif.msg) return;
            // تأكد إن الإشعار جديد فعلاً (بعد فتح الصفحة)
            if (notif.timestamp < startTime) return;
            addNotification(notif.type || 'info', notif.title, notif.msg);
        });
})();

database.ref('jobStatus').on('value', (snapshot) => {
    const statuses = snapshot.val() || {};
    const jobs = ['police', 'ems', 'staff'];
    let allClosed = true;

    jobs.forEach(job => {
        const isClosed = statuses[job] ? statuses[job].closed : false;
        
        const playerBtn = document.getElementById(`btn-${job}`);
        if (playerBtn) {
            playerBtn.innerText = isClosed ? "تم إغلاق التقديم" : "تقديم الآن";
            playerBtn.style.backgroundColor = isClosed ? "#444" : "#fc7823";
            playerBtn.disabled = isClosed;
            playerBtn.style.cursor = isClosed ? "not-allowed" : "pointer";
        }

        const adminBtn = document.getElementById(`toggle-${job}`);
        if (adminBtn) {
            adminBtn.innerText = isClosed ? "OFF" : "ON";
            adminBtn.className = isClosed ? "toggle-btn off" : "toggle-btn on";
        }

        if (!isClosed) allClosed = false;
    });

    const mainBtn = document.getElementById('toggle-all');
    if (mainBtn) {
        mainBtn.innerText = allClosed ? "OFF" : "ON";
        mainBtn.className = allClosed ? "toggle-btn off" : "toggle-btn on";
    }
});



function loadUserTrackingData() {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    const noAppMsg = document.getElementById('no-app-message');
    const appStatusInfo = document.getElementById('app-status-info');
    const listContainer = document.getElementById('applications-list');

    if (!savedUser) {
        if (noAppMsg) {
            noAppMsg.style.display = 'block';
            noAppMsg.innerHTML = `<p style="text-align:center; color:#888;">يرجى تسجيل الدخول لتتبع طلباتك</p>`;
        }
        if (appStatusInfo) appStatusInfo.style.display = 'none';
        return;
    }

    database.ref('applications').on('value', (snapshot) => {
        const data = snapshot.val();
        
        if (!data) {
            if (noAppMsg) {
                noAppMsg.style.display = 'block';
                noAppMsg.innerHTML = `<p style="text-align:center; color:#888;">لا توجد لديك طلبات سابقة</p>`;
            }
            if (appStatusInfo) appStatusInfo.style.display = 'none';
            return;
        }

        const allApps = Object.values(data);
        const myApps = allApps.filter(a => a.discordId === savedUser.id).reverse();

        if (myApps.length > 0) {
            if (noAppMsg) noAppMsg.style.display = 'none';
            if (appStatusInfo) appStatusInfo.style.display = 'block';
            
            listContainer.innerHTML = ''; 

            myApps.forEach(app => {
                const statusClass = app.status === 'مقبول' ? 'status-approved' : 
                                    app.status === 'رفض' ? 'status-rejected' : 'status-pending';
                
                listContainer.innerHTML += `
                    <div class="status-box ${statusClass}">
                        <div class="status-row">
                            <span>رقم الطلب:</span>
                            <strong class="app-number-style">${app.appId}</strong>
                        </div>
                        <div class="status-row">
                            <span>الوظيفة:</span>
                            <strong>${app.job}</strong>
                        </div>
                        <div class="status-row">
                            <span>الحالة:</span>
                            <span class="status-badge ${statusClass}">${app.status}</span>
                        </div>
                        <div class="admin-notes-section">
                            <span class="admin-notes-title">ملاحظات الإدارة:</span>
                            <p style="margin: 0; font-size: 0.85rem; color: #ccc;">${app.adminNote || 'لا توجد ملاحظات حالياً.'}</p>
                        </div>
                    </div>`;
            });
        } else {
            if (noAppMsg) {
                noAppMsg.style.display = 'block';
                noAppMsg.innerHTML = `<p style="text-align:center; color:#888;">لا توجد لديك طلبات سابقة</p>`;
            }
            if (appStatusInfo) appStatusInfo.style.display = 'none';
        }
    });
}

function clearAllApplications() {
    const firstCheck = confirm("⚠️ تحذير: هل أنت متأكد من مسح جميع الطلبات نهائياً؟");
    
    if (firstCheck) {
        const secondCheck = confirm("❗ هل أنت متأكد حقاً؟ سيتم حذف سجلات جميع المستخدمين ولا يمكن التراجع!");
        
        if (secondCheck) {
            localStorage.removeItem('serverApplications');
            
            localStorage.setItem('job_id_counter', '200');
            
            loadAdminData();
            
            if (typeof showNotification === "function") {
                showNotification("تم تصفير قاعدة البيانات بنجاح", true);
            } else {
                alert("تم تصفير كافة البيانات بنجاح، العداد القادم سيبدأ من PLUS-200");
            }
        }
    }
}


let pendingAction = null; 

function openCustomConfirm(message, title, iconClass, action) {
    document.getElementById('modal-message').innerText = message;
    document.getElementById('modal-title').innerText = title || "تأكيد الإجراء";
    document.getElementById('modal-icon').className = `fa-solid ${iconClass || 'fa-circle-exclamation'} modal-icon`;
    
    const iconElem = document.getElementById('modal-icon');
    if (message.includes("حذف") || message.includes("تصفير")) {
        iconElem.style.color = "#e74c3c";
    } else {
        iconElem.style.color = "#fc7823";
    }

    document.getElementById('confirm-modal').style.display = 'flex';
    pendingAction = action; 
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    pendingAction = null;
}

document.getElementById('confirm-yes').onclick = function() {
    if (pendingAction) {
        pendingAction(); 
    }
    closeConfirmModal();
};

function logoutUser() {
    openCustomConfirm(
        "هل أنت متأكد من رغبتك في تسجيل الخروج؟", 
        "تسجيل الخروج", 
        "fa-sign-out-alt", 
        function() {
            localStorage.removeItem('user');
            localStorage.removeItem('plusdev_user');
            sessionStorage.removeItem('plusdev_user');
            if (typeof showNotification === "function") {
                showNotification("تم تسجيل الخروج بنجاح");
            }

            setTimeout(() => {
                window.location.reload(); 
            }, 800);
        }
    );
}

function executeDecision(appId, status) {
    const noteInput = document.getElementById(`admin-note-${appId}`);
    const adminNote = noteInput ? noteInput.value : "";

    database.ref('applications/' + appId).update({
        status: status,
        adminNote: adminNote
    })
    .then(() => {
        closeConfirmModal();
        const statusText = status === 'مقبول' ? 'قبول' : 'رفض';
        showNotification(`تم ${statusText} الطلب بنجاح`);

    })
    .catch((error) => {
        console.error("خطأ في تحديث الحالة:", error);
        showNotification("حدث خطأ أثناء حفظ القرار", true);
    });
}



/* ============================================
   🛍️ STORE FUNCTIONS
   ============================================ */
function filterProducts(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.product-card').forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = '';
            card.style.animation = 'fadeInUp2 0.4s ease both';
        } else {
            card.style.display = 'none';
        }
    });
}

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
        showToast('🛒', 'طلب الشراء', `سيتم التواصل معك قريباً لإتمام شراء "${name}" بسعر ${price}$`);
        addNotification('info', 'طلب شراء جديد', `طلبك على "${name}" — ${price}$ قيد المعالجة`);
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
    if (!title || !msg) return; // تجاهل الإشعارات الفارغة

    // منع التكرار خلال ثانية واحدة
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
        if (empty) empty.style.display = 'block';
        return;
    }
    if (empty) empty.style.display = 'none';

    notifications.forEach(n => {
        const el = document.createElement('div');
        el.className = `notif-item${n.read ? '' : ' unread'}`;
        el.onclick = () => markRead(n.id);
        const iconMap = { success:'fa-check', info:'fa-info', warning:'fa-exclamation', danger:'fa-times' };
        el.innerHTML = `
            <div class="notif-icon ${n.type}"><i class="fas ${iconMap[n.type]||'fa-bell'}"></i></div>
            <div class="notif-text">
                <div class="notif-title">${n.title}</div>
                <div class="notif-msg">${n.msg}</div>
                <div class="notif-time">${n.time}</div>
            </div>`;
        list.appendChild(el);
    });
}

function markRead(id) {
    const n = notifications.find(n => n.id === id);
    if (n) { n.read = true; saveNotifs(); renderNotifs(); }
}

function clearAllNotifs(e) {
    e.stopPropagation();
    notifications = [];
    saveNotifs();
    renderNotifs();
}

function saveNotifs() {
    localStorage.setItem('pd_notifs', JSON.stringify(notifications));
}

function toggleNotifDropdown(e) {
    e.stopPropagation();
    const dd = document.getElementById('notif-dropdown');
    if (!dd) return;
    dd.classList.toggle('open');
    // mark all as read when opened
    if (dd.classList.contains('open')) {
        notifications.forEach(n => n.read = true);
        saveNotifs();
        renderNotifs();
    }
}

document.addEventListener('click', function(e) {
    const dd = document.getElementById('notif-dropdown');
    const bell = document.getElementById('notif-bell');
    if (dd && bell && !bell.contains(e.target)) {
        dd.classList.remove('open');
    }
    // close mobile menu too
    const navLinks = document.getElementById('nav-links');
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (navLinks && menuBtn && !menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        const icon = document.getElementById('menu-icon');
        if (icon) { icon.className = 'fas fa-bars'; }
    }
});

// Add notif for job status changes (demo: watch localStorage)
function notifyJobStatus(jobName, status) {
    const type = status === 'مقبول' ? 'success' : status === 'مرفوض' ? 'danger' : 'info';
    addNotification(type, 'تحديث طلب وظيفة', `طلبك على ${jobName}: ${status}`);
}

/* ============================================
   📱 MOBILE MENU
   ============================================ */
function toggleMobileMenu() {
    const nav = document.getElementById('nav-links');
    const icon = document.getElementById('menu-icon');
    if (!nav) return;
    nav.classList.toggle('mobile-open');
    if (icon) {
        icon.className = nav.classList.contains('mobile-open') ? 'fas fa-times' : 'fas fa-bars';
    }
}

// Show mobile menu button on small screens
function checkMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    if (!btn) return;
    btn.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
}
window.addEventListener('resize', checkMobileMenu);
window.addEventListener('load', checkMobileMenu);

/* ============================================
   🍞 TOAST NOTIFICATION
   ============================================ */
let toastTimer;
function showToast(icon, title, msg) {
    const t = document.getElementById('toast-notif');
    if (!t) return;
    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-msg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ============================================
   🔗 NOTIFICATIONS AFTER LOGIN
   ============================================ */
function initLoginNotification(user) {
    initNotifications();
    const welcomed = sessionStorage.getItem('pd_welcomed');
    if (user && !welcomed) {
        sessionStorage.setItem('pd_welcomed', '1');
        setTimeout(() => {
            addNotification('success', `مرحباً ${user.name}! 👋`, 'تم تسجيل دخولك بنجاح');
        }, 800);
    }
}

// ════ Init on load (موحّد) ════
window.addEventListener('load', () => {
    checkMobileMenu();
    initNotifications();
    loadAdminIds();
});


/* ============================================
   🛡️ إدارة الأدمنز من لوحة التحكم
   ============================================ */

function renderAdminIds() {
    const list = document.getElementById('admin-ids-list');
    if (!list) return;

    database.ref('adminIds').once('value', (snap) => {
        const data = snap.val() || {};
        list.innerHTML = '';

        if (Object.keys(data).length === 0) {
            list.innerHTML = '<p style="color:#666;text-align:center;padding:10px;">لا يوجد أدمنز مضافين</p>';
            return;
        }

        Object.entries(data).forEach(([key, admin]) => {
            const row = document.createElement('div');
            row.className = 'admin-id-row';
            row.innerHTML = `
                <div class="admin-id-info">
                    <img src="${admin.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}" class="admin-id-avatar">
                    <div>
                        <div class="admin-id-name">${admin.name || 'غير معروف'}</div>
                        <div class="admin-id-num">${admin.id}</div>
                    </div>
                </div>
                <button class="admin-id-del" onclick="removeAdminId('${key}', '${admin.id}')">
                    <i class="fas fa-trash"></i>
                </button>`;
            list.appendChild(row);
        });
    });
}

function addAdminId() {
    const input = document.getElementById('new-admin-id');
    const newId = input ? input.value.trim() : '';
    if (!newId) { showToast('⚠️', 'تنبيه', 'أدخل الـ ID أولاً'); return; }
    if (!/^\d{15,20}$/.test(newId)) { showToast('⚠️', 'خطأ', 'الـ ID يجب أن يكون أرقام فقط (15-20 رقم)'); return; }

    // ابحث عن بيانات المستخدم إذا موجود
    database.ref('adminIds').orderByChild('id').equalTo(newId).once('value', (snap) => {
        if (snap.val()) { showToast('⚠️', 'موجود مسبقاً', 'هذا الـ ID مضاف مسبقاً'); return; }

        // ابحث عنه في طلبات التوظيف لجلب اسمه وصورته
        const discordData = JSON.parse(localStorage.getItem('pd_discord_users') || '{}');
        const userInfo = discordData[newId] || null;

        database.ref('adminIds').push({
            id: newId,
            name: userInfo ? userInfo.name : 'Admin',
            avatar: userInfo ? userInfo.avatar : 'https://cdn.discordapp.com/embed/avatars/0.png',
            addedAt: Date.now()
        }).then(() => {
            showToast('✅', 'تم الإضافة', `تم إضافة الـ ID بنجاح`);
            if (input) input.value = '';
            renderAdminIds();
        });
    });
}

function removeAdminId(key, adminId) {
    const me = JSON.parse(localStorage.getItem('user') || 'null');
    if (me && me.id === adminId) {
        showToast('⚠️', 'تنبيه', 'لا تستطيع حذف نفسك!');
        return;
    }
    openCustomConfirm(
        'هل أنت متأكد من حذف هذا الأدمن؟',
        'حذف أدمن',
        'fa-trash',
        function() {
            database.ref('adminIds/' + key).remove().then(() => {
                showToast('✅', 'تم الحذف', 'تم حذف الأدمن بنجاح');
                renderAdminIds();
                closeConfirmModal();
            });
        }
    );
}


