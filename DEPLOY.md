# Deployment Guide

As the assignment requires: frontend on **Vercel**, backend on **Render**, database on **MongoDB Atlas**. Environment variables hold **sensitive data only**, and `.env` is never pushed.

## Environment variables

| Where | Key | Value | Required |
|---|---|---|---|
| Render | `MONGODB_URI` | Atlas connection string ending in `/portfolio?retryWrites=true&w=majority` | ✅ |
| Render | `CLIENT_URL` | only for extra frontend URLs (the main site is allowed in code) | optional |
| Vercel | none | | |
| `server/.env` (local) | `MONGODB_URI` | same as Render | ✅ |

Everything that isn't secret is committed config:

- **API URL for the frontend:** `client/.env.production` → `https://portfolio-pq5n.onrender.com`
- **CORS:** only the live site, `http://localhost:5173` and any `CLIENT_URL` origins may call the API from a browser
- **Node version:** `engines` in `server/package.json` (22.x)
- **Keep-alive URL:** Render provides `RENDER_EXTERNAL_URL` automatically

## 1. MongoDB Atlas

1. Create a free **M0** cluster.
2. **Database Access:** add a database user.
3. **Network Access:** allow `0.0.0.0/0` (Render free has no fixed IP).
4. **Connect → Drivers:** copy the string and add `/portfolio` before the `?`.
5. Load the content: `cd server && npm install && npm run seed` (with `MONGODB_URI` in `server/.env`).

## 2. Render (backend)

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** → select `basedbrahmin/portfolio`.
2. Keep the service name **`ashmit-portfolio-api`**, paste `MONGODB_URI` and leave `CLIENT_URL` empty for now.
3. Open `https://portfolio-pq5n.onrender.com/api/health`. It should return `{"ok":true,"db":true}`.

If Render gives a different URL (for example because the name is taken), put it in `client/.env.production` and `.github/workflows/keep-alive.yml`, then push.

## 3. Vercel (frontend)

1. [vercel.com/new](https://vercel.com/new) → import `basedbrahmin/portfolio`.
2. Set **Root Directory** to `client`. Vite is detected automatically, and no environment variables are needed.
3. Deploy. `client/vercel.json` handles page refreshes on routes like `/projects/portfolio`.
4. **Settings → Deployment Protection → Vercel Authentication → Disabled**, so the public can open the site without a Vercel login.

## 4. Keep the API awake

Render free sleeps after 15 minutes idle. Three things keep it awake:

1. **Self-ping (automatic):** the server pings its own `/api/health` every 10 minutes.
2. **GitHub Actions:** `.github/workflows/keep-alive.yml` pings every 10 minutes. No setup needed.
3. **UptimeRobot (optional, most reliable):** add a free HTTP monitor on `/api/health` every 5 minutes.

## 5. Reading contact messages

Messages are saved to MongoDB (email via Nodemailer is optional in the brief and isn't used). To read them, go to Atlas → **Browse Collections** → `portfolio` → `messages`.

## Submission checklist (from the brief)

- [ ] Frontend live on Vercel, backend live on Render, both with public URLs
- [ ] Contact form saves to MongoDB end to end
- [ ] CV downloads in both PDF and DOCX from the backend
- [ ] Dark/light toggle works; responsive on mobile, tablet and desktop
- [ ] README has the project description, live link and local setup steps
- [ ] `/client` and `/server` folders, `.gitignore` excludes `node_modules` and `.env`
- [ ] No `.env` in the repo
- [ ] GitHub repo link submitted on Google Classroom
