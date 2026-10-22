# Ashmit Sharma: Portfolio

A full-stack MERN portfolio with a bold editorial design: a generative hero canvas, GSAP scroll animation, dark/light mode, project case studies, and a contact form backed by MongoDB.

**Live site:** _add after deploying (see [DEPLOY.md](DEPLOY.md))_
**API:** _add after deploying_

## Features

- **Hero:** loading counter, cursor-reactive generative line field (canvas), letter-by-letter name reveal, typewriter roles, Download CV CTA
- **About:** duotone photo with hover reveal, scroll-scrubbed bio, location and status
- **Skills:** animated radial rings and bars grouped by Frontend / Backend / Tools, with proficiency tooltips
- **Projects:** interactive cards with tech badges, GitHub and live links, filter by technology and sort (animated with GSAP Flip), and a case-study page per project (`/projects/:slug`)
- **Timeline:** vertical education and experience timeline with a scroll-driven progress line
- **Certifications:** card grid with lightbox and verify links, plus hackathons and awards
- **Contact:** validated form → Express API → MongoDB (Mongoose), optional Nodemailer email notification, rate limiting and a honeypot
- **CV download:** PDF and DOCX served by Express (`/api/cv/pdf`, `/api/cv/docx`)
- Dark/light toggle (saved), Lenis smooth scroll, custom cursor, marquees, fully responsive, respects `prefers-reduced-motion`

## Tech stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | React, React Router, Vite, GSAP (ScrollTrigger, Flip), Lenis |
| Backend  | Node.js, Express, Mongoose, Nodemailer, express-rate-limit  |
| Database | MongoDB Atlas                                               |
| Hosting  | Vercel or Netlify (client), Render or Railway (server)      |

## Folder structure

```
client/                React app (Vite)
  src/components/      Loader, Cursor, Nav, HeroCanvas, Marquee, Lightbox…
  src/sections/        Hero, About, Skills, Projects, Timeline, Certifications, Contact
  src/pages/           Home, ProjectPage, NotFound
  src/lib/             API client, content context, GSAP/Lenis setup, theme
  src/data/            Bundled fallback copy of content.json
  src/styles/          base, components, sections CSS
server/                Express API
  src/models/          Mongoose models (Message, Project, Skill, TimelineItem…)
  src/routes/          content, contact, cv
  src/data/            content.json (source of truth for the seed)
  files/cv/            Ashmit_Sharma_CV.pdf / .docx
```

## API

| Method | Route                   | Description                                |
| ------ | ----------------------- | ------------------------------------------ |
| GET    | `/api/health`           | Status and database connection             |
| GET    | `/api/content`          | All portfolio content in one request       |
| GET    | `/api/projects`         | Projects (also `/skills`, `/timeline`, `/certifications`, `/achievements`, `/profile`) |
| GET    | `/api/projects/:slug`   | Single project                             |
| POST   | `/api/contact`          | `{ name, email, message }` → saved to MongoDB |
| GET    | `/api/cv/:format`       | `pdf` or `docx` download                   |

## Local setup

Requirements: Node 20+ and a MongoDB connection string (Atlas free tier works).

```bash
git clone <repo-url> && cd <repo>

# 1. Backend
cd server
npm install
cp .env.example .env        # fill in MONGODB_URI (and SMTP_* for email, optional)
npm run seed                # loads src/data/content.json into MongoDB
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm run dev                 # http://localhost:5173
```

Without `MONGODB_URI` the API still serves content from `content.json`, but the contact form returns 503.

## Updating content

1. Edit `server/src/data/content.json` and copy it to `client/src/data/content.json` (the client's offline fallback).
2. Run `npm run seed` in `server/`.
3. Replace `server/files/cv/Ashmit_Sharma_CV.pdf` and `.docx`, keeping the same file names.
4. To add certificates, put images in `client/public/certs/` and add entries to `certifications`, e.g.
   `{ "title": "…", "issuer": "Coursera", "date": "2026", "url": "https://…", "image": "/certs/coursera.jpg" }`.
   The certificate grid appears automatically once the list is not empty.

## Deployment

Frontend on **Vercel**, backend on **Render**, database on **MongoDB Atlas**. Step-by-step instructions and every environment variable are in **[DEPLOY.md](DEPLOY.md)**.

The free Render instance is kept awake by a built-in self-ping every 10 minutes, a GitHub Actions workflow (`.github/workflows/keep-alive.yml`), and optionally an UptimeRobot monitor.

## Security

- `.env` files are gitignored; only `.env.example` templates are committed.
- Contact route: input validation, 10 KB body limit, rate limit (5 per 15 minutes per IP), honeypot field, HTML-escaped emails.
