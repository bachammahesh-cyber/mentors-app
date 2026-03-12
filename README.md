# Mentors — Talk to the Greats

A personal app to have real conversations with Steve Jobs, Elon Musk, Naval Ravikant, Charlie Munger, and Maya Angelou. Powered by Claude AI.

---

## Files

```
mentors/
├── server.js          ← Node.js backend (proxies API calls)
├── package.json       ← Dependencies
├── render.yaml        ← Render deployment config
├── .env               ← Your API key (local only, never commit)
├── .gitignore         ← Keeps .env out of GitHub
└── public/
    └── index.html     ← The full app UI
```

---

## Step 1 — Push to GitHub

1. Go to **github.com** → click **New repository**
2. Name it `mentors-app` → click **Create repository**
3. Open Terminal on your Mac and run these commands one by one:

```bash
cd ~/Desktop/mentors
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mentors-app.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 2 — Deploy on Render

1. Go to **render.com** → Sign up (free) → click **New +** → **Web Service**
2. Connect your GitHub account
3. Select the `mentors-app` repository
4. Render auto-detects settings from `render.yaml`. Confirm:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Scroll to **Environment Variables** → click **Add Environment Variable**:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-your-actual-key-here`
6. Click **Create Web Service**

Render builds and deploys in ~2 minutes. You get a live URL like:
`https://mentors-app.onrender.com`

---

## Step 3 — Use on Mobile

1. Open your Render URL in **Safari** on iPhone
2. Tap the **Share** button → **Add to Home Screen**
3. It opens like a real app — full screen, no browser bar

---

## Running Locally

```bash
cd mentors
npm install
# Edit .env and add your real API key
npm start
# Open http://localhost:3000
```

---

## Updating the App

Whenever you make changes:

```bash
git add .
git commit -m "update"
git push
```

Render auto-deploys on every push to `main`.
