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

const ADMIN_IDS = ["1453875192009986166","1462236116785827851"]; 

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

	if ('WebSocket' in window) {
		(function () {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					var parent = elem.parentElement || head;
					parent.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					parent.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function (msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
				console.log('Live reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
	}


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
const REDIRECT_URI = 'https://saai5l.github.io/Plus_';

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
    // استقبال token من ديسكورد مباشرة (لو رجع هنا بدل login.html)
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
        // امسح الـ token من الـ URL فوراً
        window.history.replaceState({}, document.title, window.location.pathname);

        fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then(res => res.json())
        .then(user => {
            const avatarUrl = user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${(user.discriminator || 0) % 5}.png`;

            const email = (user.email || '').toLowerCase() || null;
            const userData = {
                id: user.id,
                name: user.global_name || user.username,
                avatar: avatarUrl,
                email: email,
                loginVia: 'discord'
            };

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('plusdev_user', JSON.stringify(userData));

            // حفظ الإيميل للربط لاحقاً
            if (email) {
                const links = JSON.parse(localStorage.getItem('pd_email_links') || '{}');
                links[email] = user.id;
                localStorage.setItem('pd_email_links', JSON.stringify(links));
            }

            updateUI(userData);
        })
        .catch(err => console.error('خطأ في جلب بيانات ديسكورد:', err));
    } else {
        // قراءة الجلسة المحفوظة
        try {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser);
                if (parsed && parsed.id && parsed.name) {
                    updateUI(parsed);
                } else {
                    localStorage.removeItem('user');
                }
            }
        } catch(e) {
            localStorage.removeItem('user');
        }
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
        
        userAvatar.src = user.avatar;
        userDisplayName.innerText = user.name;
        
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




function updateJobStatus(jobType) {
    const btn = document.getElementById(`toggle-${jobType}`);
    const isCurrentlyOn = btn && btn.innerText === "ON";
    
    database.ref('jobStatus/' + jobType).set({
        closed: isCurrentlyOn 
    });
}

function toggleAllJobs() {
    const jobs = ['police', 'ems', 'staff'];
    const mainBtn = document.getElementById('toggle-all');
    const shouldClose = mainBtn && mainBtn.innerText === "ON";

    jobs.forEach(job => {
        database.ref('jobStatus/' + job).set({ closed: shouldClose });
    });
}

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


