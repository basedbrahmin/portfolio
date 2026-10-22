# Deployment Guide

As the assignment requires: frontend on **Vercel**, backend on **Render**, database on **MongoDB Atlas**. Environment variables hold **sensitive data only**, and `.env` is never pushed.

## Environment variables

| Where | Key | Value | Required |
|---|---|---|---|
| Render | `MONGODB_URI` | Atlas connection string ending in `/portfolio?retryWrites=true&w=majority` | ✅ |
| Render | `SMTP_USER` | Brevo SMTP login | optional (email alerts) |
| Render | `SMTP_PASS` | Brevo SMTP key | optional (email alerts) |
| Render | `MAIL_TO` | `ashmits004@gmail.com` (verified sender in Brevo) | optional (email alerts) |
| Vercel | none | | |
| `server/.env` (local) | same keys as Render | | |

Everything that isn't secret is committed config:

- **API URL for the frontend:** `client/.env.production` → `https://ashmit-portfolio-api.onrender.com`
- **CORS:** open (public read-only API; the contact route is rate limited)
- **Node version:** `engines` in `server/package.json` (22.x)
- **SMTP host/port:** `smtp-relay.brevo.com:2525`, set in `server/src/lib/mailer.js`
- **Keep-alive URL:** Render provides `RENDER_EXTERNAL_URL` automatically

## 1. MongoDB Atlas

1. Create a free **M0** cluster.
2. **Database Access:** add a database user.
3. **Network Access:** allow `0.0.0.0/0` (Render free has no fixed IP).
4. **Connect → Drivers:** copy the string and add `/portfolio` before the `?`.
5. Load the content: `cd server && npm install && npm run seed` (with `MONGODB_URI` in `server/.env`).

## 2. Render (backend)

1. [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint** → select `basedbrahmin/portfolio`.
2. Keep the service name **`ashmit-portfolio-api`** and paste `MONGODB_URI` when asked.
3. Open `https://ashmit-portfolio-api.onrender.com/api/health`. It should return `{"ok":true,"db":true}`.

If Render gives a different URL (for example because the name is taken), put it in `client/.env.production` and `.github/workflows/keep-alive.yml`, then push.

## 3. Vercel (frontend)

1. [vercel.com/new](https://vercel.com/new) → import `basedbrahmin/portfolio`.
2. Set **Root Directory** to `client`. Vite is detected automatically, and no environment variables are needed.
3. Deploy. `client/vercel.json` handles page refreshes on routes like `/projects/portfolio`.

## 4. Keep the API awake

Render free sleeps after 15 minutes idle. Three things keep it awake:

1. **Self-ping (automatic):** the server pings its own `/api/health` every 10 minutes.
2. **GitHub Actions:** `.github/workflows/keep-alive.yml` pings every 10 minutes. No setup needed.
3. **UptimeRobot (optional, most reliable):** add a free HTTP monitor on `/api/health` every 5 minutes.

## 5. Email alerts (optional; Nodemailer is optional in the brief)

1. Create a free [Brevo](https://www.brevo.com) account and verify `ashmits004@gmail.com` as a sender.
2. **SMTP & API → SMTP:** copy the login and generate a key.
3. Add `SMTP_USER`, `SMTP_PASS` and `MAIL_TO` on Render.

Gmail SMTP won't work on Render's free tier, which [blocks ports 25/465/587](https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports).

## Submission checklist (from the brief)

- [ ] Frontend live on Vercel, backend live on Render, both with public URLs
- [ ] Contact form saves to MongoDB end to end
- [ ] CV downloads in both PDF and DOCX from the backend
- [ ] Dark/light toggle works; responsive on mobile, tablet and desktop
- [ ] README has the project description, live link and local setup steps
- [ ] `/client` and `/server` folders, `.gitignore` excludes `node_modules` and `.env`
- [ ] No `.env` in the repo
- [ ] GitHub repo link submitted on Google Classroom
