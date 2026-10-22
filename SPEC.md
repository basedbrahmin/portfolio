# Ashmit Sharma — Portfolio Spec

Source brief: `MERN_Portfolio_Assignment.pdf` (all rubric items must be met).

## Direction
- **Goal:** personal brand / showcase, while satisfying the MERN course rubric
- **Vibe:** bold editorial (Awwwards-style): huge type, strong grid, scroll-driven motion
- **Accent:** signal orange `#FF5B1F` on near-black (dark) / off-white paper (light)
- **Type:** big sans headlines + monospace labels, numbers and metadata
- **Default theme:** light first, toggle to dark, choice remembered
- **Motion:** GSAP (ScrollTrigger, Flip) + Lenis smooth scroll

## Stack
- `/client`: React (Vite), React Router, JavaScript
- `/server`: Node + Express REST API, MongoDB Atlas + Mongoose, Nodemailer
- Deploy: frontend on Vercel/Netlify, backend on Render/Railway; secrets in `.env` (gitignored)

## Routes
- `/`: one long scrolling page with every section
- `/projects/:slug`: project case study
- `*`: editorial 404

## Sections
1. **Loading screen:** mono counter 000 → 100
2. **Hero:** generative orange particle/line canvas that reacts to the cursor, giant ASHMIT SHARMA, typewriter cycling roles, Download CV CTA
3. **Marquee strips** of skills/keywords between sections
4. **About:** bio, duotone orange photo (full color on hover), location, status, scroll reveal
5. **Skills:** radial rings for top skills, bars for the rest; grouped Frontend / Backend / Tools; hover tooltips with proficiency
6. **Projects:** ≥3 interactive cards with tech badges, GitHub + live links; tech-chip filter + sort (newest/featured) with GSAP Flip
7. **Timeline:** vertical animated timeline for education + experience
8. **Certifications & achievements:** card grid with lightbox; hackathons/awards
9. **Contact:** Name/Email/Message → Express → MongoDB, plus a Nodemailer notification

## Global
- Custom cursor (orange dot/ring, grows on links, "VIEW" over projects)
- Fully responsive (mobile-first), respects `prefers-reduced-motion`

## Data
- Projects, skills, timeline and certs stored in MongoDB, served by the API, loaded with a seed script
- Contact messages stored in MongoDB
- CV served from Express routes: `/api/cv/pdf` and `/api/cv/docx`

## Content
- Realistic placeholders marked `TODO` until the resume and assets are uploaded
