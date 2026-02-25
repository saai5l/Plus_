# 🎮 Ultimate FiveM / GTA Roleplay Web Suite

A high-performance, all-in-one web portal designed for serious RP communities. This isn't just a landing page—it’s a fully functional hub to manage your players, laws, and staff applications.

---

## ⚡ Key Features
* **Smart Rule Bot:** An interactive AI assistant that knows your server laws inside out.
* **Live Law Directory:** Searchable and categorized rulebook to keep your community informed.
* **Dynamic Career Portal:** Integrated application system for Police, EMS, and Admin roles.
* **Integrated Marketplace:** Show off your server products with a built-in order system.
* **Support Ticket Hub:** A dedicated space for players to get help and admins to respond.
* **Powerful Admin Dashboard:** Total control over site content and user management.
* **Real-time Alerts:** Push notifications powered by Firebase to keep everyone updated.
* **Discord Sync:** Fast and secure login using Discord OAuth2.
* **Fully Responsive:** Looks pixel-perfect on everything from mobile phones to desktop monitors.

---

## 🛠️ Setup Guide

### 1. Configure the Core
Open `config.js` and plug in your server’s data:

| Key | Description |
|---|---|
| `SERVER_NAME` | Enter your community name. |
| `DISCORD_CLIENT_ID` | Obtain this from the Discord Developer Portal. |
| `REDIRECT_URI` | Your site URL + `/login.html`. |
| `WEBHOOKS.*` | Set up your channel webhooks for logs/apps. |
| `FIREBASE.*` | Connect your Firebase project for real-time data. |
| `LOGO_URL` | Link to your server's high-res logo. |

### 2. Set Your Rules
Edit `laws.json`. Swap the text between the quotes to match your server’s specific regulations.

### 3. Personalize the Content
In `index.html`, search for the placeholder "اسم السيرفر" and replace it with your own. Don't forget to update the social media links in the footer.

### 4. Go Live (For Free)
1. Create a new GitHub Repository.
2. Push all project files to the `main` branch.
3. Navigate to **Settings → Pages** and set the Source to your **main branch**.

---

## 📂 Project Architecture

```text
📦 Server-Website/
├── ⚙️ config.js           ← Global settings & API keys
├── 📄 index.html          ← Main landing page
├── 📄 login.html          ← Discord Auth handler
├── 📋 laws.json           ← The rulebook data
├── ⚙️ script.js           ← Core logic & functionality
├── ⚙️ ai-chat-enhanced.js  ← AI Chatbot logic
├── 🎨 style.css           ← Global visual DNA
└── 📖 README.md           ← Documentation