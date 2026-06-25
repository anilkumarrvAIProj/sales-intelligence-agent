# 🎯 Sales Intelligence Agent — Vercel Deployment Guide

AI-powered pre-meeting briefing tool for IT services sales teams.
Enter a company → pick your domain → get a full intelligence brief in seconds.

---

## ⚡ Deploy to Vercel in 5 Minutes

### Step 1 — Get the code on GitHub

1. Go to [github.com](https://github.com) → **New repository**
2. Name it `sales-intelligence-agent` → Create
3. Upload all files from this folder (drag & drop in the GitHub UI, or use git CLI):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/sales-intelligence-agent.git
   git push -u origin main
   ```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Sign up free** (use your GitHub account)
2. Click **"Add New Project"**
3. Import your `sales-intelligence-agent` GitHub repo
4. Click **Deploy** — Vercel auto-detects Next.js, no config needed

### Step 3 — Add your API Key (critical!)

1. In Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from [console.anthropic.com](https://console.anthropic.com)
   - **Environments:** Production, Preview, Development ✓
3. Click **Save**
4. Go to **Deployments** → click **Redeploy** (picks up the new env var)

### Step 4 — Share the URL 🎉

Your app is live at: `https://sales-intelligence-agent-XXXX.vercel.app`

Share this URL with your entire sales team. No login, no install.

---

## 🔒 Security Architecture

| Layer | What it does |
|---|---|
| **API key** | Lives only on Vercel servers, never sent to browser |
| **Server-side proxy** | `/api/research` route calls Anthropic — browser never sees the key |
| **`.gitignore`** | `.env.local` excluded from git — key never hits GitHub |
| **No storage** | Zero user data stored — each brief is ephemeral |

---

## 🛠 Run Locally (optional)

```bash
# Install dependencies
npm install

# Add your key
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Start dev server
npm run dev

# Open http://localhost:3000
```

---

## 💡 Customise for Your Team

**Add your company branding** → edit the header section in `pages/index.js`

**Add more domains** → update the `DOMAINS` array in both `pages/index.js` and `pages/api/research.js`

**Restrict access** → add Vercel Password Protection under Settings → Security (free on Pro plan)

**Track usage** → add Vercel Analytics (one click in dashboard)

---

## 📦 What's Included

```
sales-agent/
├── pages/
│   ├── index.js          ← Full UI (React, no extra deps)
│   └── api/
│       └── research.js   ← Server-side API proxy (API key lives here)
├── .env.example          ← Template for local dev
├── .gitignore            ← Keeps your API key safe
├── package.json          ← Next.js 14, React 18
└── README.md             ← This file
```

---

*Built for IT services sales teams. Powered by Claude + live web search.*
