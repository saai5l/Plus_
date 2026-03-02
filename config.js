const CONFIG = {

  SERVER_NAME: "Plus Dev",

  DISCORD_INVITE: "https://discord.gg/UCDtkfQUtK",

  DISCORD_CLIENT_ID: "1453875994988380373",

  REDIRECT_URI: "https://saai5l.github.io/Plus_/login.html",

  // ══════════════════════════════════════════
  // نظام المستويات — 3 مستويات
  //
  // OWNER   : صلاحيات كاملة + باسورد سري
  // SUPER   : إدارة عليا — إجازات + شيفتات
  // ADMIN   : أدمن عادي — طلبات + تذاكر
  // ══════════════════════════════════════════

  // IDs المالك — مشفرة بـ base64
  // لإضافة مالك جديد: btoa("DISCORD_ID")
  _owners: [
    "MTQ1Mzg3NTE5MjAwOTk4NjE2Ng=="
  ],

  // باسورد الإدارة العليا والمالك — مشفر بـ base64
  // الباسورد الحالي: PlusDev@2025  — غيّره!
  _ap: "UGx1c0RldkAyMDI1",

  WEBHOOKS: {
  },

  FIREBASE: {
    apiKey:            "AIzaSyB5r_RltNkExAb3wHhgfMuCWPg_GzEd_Ok",
    authDomain:        "planning-with-ai-60a3c.firebaseapp.com",
    databaseURL:       "https://planning-with-ai-60a3c-default-rtdb.firebaseio.com",
    projectId:         "planning-with-ai-60a3c",
    storageBucket:     "planning-with-ai-60a3c.firebasestorage.app",
    messagingSenderId: "493882886067",
    appId:             "1:493882886067:web:ed8f0db9678a7e8a042dc6"
  },

  PRIMARY_COLOR: "#fc7823",
  LOGO_URL:      "Plus_Dev_No_Wellpeper.png",
  OG_IMAGE:      "Plus_Dev_No_Wellpeper.png",
  SITE_URL:      "https://saai5l.github.io/Plus_"
};
