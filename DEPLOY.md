# Deployment Guide

Deploy in this order. Each step needs a value from the one before it.

1. MongoDB Atlas (database) → gives you `MONGODB_URI`
2. GitHub (code) → the repo Render and Vercel deploy from
3. Render (backend) → gives you the API URL
4. Vercel (frontend) → gives you the site URL
5. Connect the two (CORS)
6. Keep the API awake
7. Email notifications (optional)

---

## 1. MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → **Create** → **M0 Free** cluster (any region near India, e.g. Mumbai).
2. **Database Access** → **Add New Database User** → username `portfolio`, auto-generate a password and copy it.
   Use letters and numbers only, or URL-encode special characters such as `@ : / ?`.
3. **Network Access** → **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`).
   Render's free tier has no fixed IP, so this is required.
4. **Connect** → **Drivers** → copy the connection string and add the database name `portfolio` before the `?`:

   ```
   mongodb+srv://portfolio:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

5. Seed the content from your machine:

   ```bash
   cd server
   cp .env.example .env      # paste MONGODB_URI into .env
   npm install
   npm run seed
   ```

   You should see `seeded 3 projects`, `seeded 15 skills`, and so on.

## 2. GitHub

The repo is [github.com/basedbrahmin/portfolio](https://github.com/basedbrahmin/portfolio) and the `origin` remote is already set. Log in as **basedbrahmin**, then push:

```bash
gh auth login        # GitHub.com → HTTPS → log in as basedbrahmin in the browser
gh auth setup-git    # lets git use that login
git push -u origin main
```

`.env` files are gitignored. Run `git status` before pushing and make sure no `.env` file appears.

## 3. Render (backend)

**Option A: Blueprint (fastest)**
[dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint** → select `portfolio`. Render reads `render.yaml` and asks for the values marked secret below.

**Option B: Manual**
**New** → **Web Service** → select the repo, then set:

| Setting          | Value          |
| ---------------- | -------------- |
| Root Directory   | `server`       |
| Runtime          | Node           |
| Build Command    | `npm ci`       |
| Start Command    | `npm start`    |
| Health Check Path| `/api/health`  |
| Instance Type    | Free           |

**Environment variables (Render → Environment)**

| Key             | Value                                   | Notes |
| --------------- | --------------------------------------- | ----- |
| `NODE_VERSION`  | `22`                                    | Mongoose needs Node ≥ 20.19 |
| `MONGODB_URI`   | your Atlas string from step 1           | secret |
| `CLIENT_ORIGIN` | `https://ashmit-portfolio.vercel.app`   | set after step 4; comma-separate multiple URLs, no trailing slash |
| `SMTP_HOST`     | `smtp-relay.brevo.com`                  | optional, see step 7 |
| `SMTP_PORT`     | `2525`                                  | optional |
| `SMTP_USER`     | Brevo SMTP login                        | optional, secret |
| `SMTP_PASS`     | Brevo SMTP key                          | optional, secret |
| `MAIL_FROM`     | `ashmits004@gmail.com`                  | optional, must be a verified Brevo sender |
| `MAIL_TO`       | `ashmits004@gmail.com`                  | optional, where notifications go |

Don't set `PORT`: Render provides it. Render also sets `RENDER_EXTERNAL_URL` automatically, which the keep-alive uses.

**Test:** open `https://<your-service>.onrender.com/api/health`. It should return:

```json
{ "ok": true, "db": true }
```

If `db` is `false`, re-check `MONGODB_URI` and Atlas Network Access.

## 4. Vercel (frontend)

[vercel.com/new](https://vercel.com/new) → import `portfolio`, then set:

| Setting           | Value            |
| ----------------- | ---------------- |
| Root Directory    | `client`         |
| Framework Preset  | Vite (auto)      |
| Build Command     | `npm run build`  |
| Output Directory  | `dist`           |

**Environment variable**

| Key            | Value                                     |
| -------------- | ----------------------------------------- |
| `VITE_API_URL` | `https://<your-service>.onrender.com` (no trailing slash) |

Vite bakes this value in at build time. If you change it, redeploy (Deployments → ⋯ → Redeploy).

`client/vercel.json` already rewrites all routes to `index.html`, so `/projects/portfolio` works on refresh.

**Netlify instead?** Base directory `client`, build command `npm run build`, publish directory `client/dist`, same env var. `public/_redirects` handles routing.

## 5. Connect frontend and backend

1. Render → Environment → set `CLIENT_ORIGIN` to your Vercel URL, e.g. `https://ashmit-portfolio.vercel.app`, and save. Render redeploys.
2. In `server/src/data/content.json`, set the portfolio project's `"live"` to your Vercel URL and copy the file to `client/src/data/content.json`.
3. Run `npm run seed` in `server/`, then commit and push. Both sites redeploy automatically.
4. Put the live URLs at the top of `README.md`.

**Test end to end:** open the site, send a message through the contact form, then check Atlas → Browse Collections → `portfolio.messages`.

## 6. Keep the API awake

Render's free tier sleeps after 15 minutes without traffic, and the first request after that takes about a minute. There are three layers of protection; use at least the first two.

1. **Built-in self-ping (automatic).** The server requests its own public `/api/health` every 10 minutes. Render's logs should show:
   `[keep-alive] pinging https://….onrender.com/api/health every 10 min`
2. **GitHub Actions backup.** `.github/workflows/keep-alive.yml` pings every 10 minutes.
   - Repo → **Settings** → **Secrets and variables** → **Actions** → **Variables** → **New repository variable**
   - Name `API_URL`, value `https://<your-service>.onrender.com`
   - **Actions** tab → **Keep API awake** → **Run workflow** to test it
   - GitHub may delay scheduled runs, and it pauses them after 60 days without commits.
3. **UptimeRobot (recommended, most reliable).** Free at [uptimerobot.com](https://uptimerobot.com): **New monitor** → HTTP(s) → URL `https://<your-service>.onrender.com/api/health` → interval **5 minutes**. It also emails you if the API goes down.

The free plan includes 750 instance hours per month, which is just enough for one service running 24/7. Don't keep a second free service awake in the same Render workspace.

## 7. Email notifications (optional)

Render's free tier [blocks SMTP ports 25, 465 and 587](https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports), so Gmail SMTP will time out there. Use Brevo on port 2525 instead:

1. Sign up at [brevo.com](https://www.brevo.com) (free tier: 300 emails/day).
2. **Senders, Domains & Dedicated IPs** → **Senders** → add and verify `ashmits004@gmail.com`.
3. **SMTP & API** → **SMTP** tab → copy the **Login** (`SMTP_USER`) and generate an **SMTP key** (`SMTP_PASS`).
4. Add the SMTP variables from step 3's table on Render.

Messages are always saved to MongoDB first. If email fails, the form still succeeds and Render logs `[mail] failed: …`.

## Environment variable reference

**`server/.env`** (local) and Render

| Variable         | Required | Example |
| ---------------- | -------- | ------- |
| `PORT`           | local only | `5000` |
| `MONGODB_URI`    | yes      | `mongodb+srv://…/portfolio?retryWrites=true&w=majority` |
| `CLIENT_ORIGIN`  | yes      | `http://localhost:5173,https://ashmit-portfolio.vercel.app` |
| `SMTP_HOST`      | no       | `smtp-relay.brevo.com` |
| `SMTP_PORT`      | no       | `2525` |
| `SMTP_USER`      | no       | Brevo SMTP login |
| `SMTP_PASS`      | no       | Brevo SMTP key |
| `MAIL_FROM`      | no       | `ashmits004@gmail.com` |
| `MAIL_TO`        | no       | `ashmits004@gmail.com` |
| `KEEP_ALIVE_URL` | no       | only on hosts other than Render |

**`client/.env`** (local) and Vercel

| Variable       | Required | Example |
| -------------- | -------- | ------- |
| `VITE_API_URL` | yes      | `http://localhost:5000` locally, `https://<service>.onrender.com` in production |

## Submission checklist

- [ ] `https://<service>.onrender.com/api/health` returns `"db": true`
- [ ] The site loads on Vercel and shows content (not stuck on the loader)
- [ ] The contact form submits and the message appears in Atlas
- [ ] Download CV works for both PDF and DOCX
- [ ] Dark/light toggle works, and it looks right on a phone
- [ ] Refreshing `/projects/portfolio` works (no 404)
- [ ] README has both live URLs
- [ ] No `.env` committed (`git log --all -- '*.env'` prints nothing)
- [ ] The repo link is submitted on Google Classroom
