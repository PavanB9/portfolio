# Pavan Bandla — Portfolio

A fast, modern, single-page CS portfolio. Built from scratch with **vanilla HTML, CSS, and
JavaScript** — no frameworks, no build step, and **zero external dependencies** (system fonts,
inline SVG icons). Everything is self-contained in this folder, so it works offline and deploys
anywhere.

## Structure

```
Site/
├── index.html      # all page content
├── css/styles.css  # design system, layout, animations, light/dark themes
├── js/main.js      # typing effect, scroll reveals, active nav, theme toggle, mobile menu
├── assets/         # résumé PDF (linked from the nav & contact)
├── serve.py        # tiny stdlib-only local preview server
└── README.md
```

## View it locally

**Option A — just open it.** Double-click `index.html`. (The résumé link works best via a server.)

**Option B — run the local server (recommended):**

```powershell
python serve.py
```

This serves the site at <http://localhost:8000> and opens your browser automatically.
It uses only Python's standard library — nothing to `pip install`.

## Features

- Dark/light theme toggle (remembers your choice)
- Animated terminal hero + rotating typewriter role
- Scroll-reveal animations and scroll-spy navigation
- Fully responsive with a mobile menu
- Respects `prefers-reduced-motion`
- Accessible markup, semantic sections, Open Graph tags

## Customize

- **Content:** edit `index.html` (each section is clearly commented).
- **Colors/spacing:** tweak the CSS variables at the top of `css/styles.css` (`:root` and
  `[data-theme="light"]`).
- **Hero roles:** edit the `phrases` array in `js/main.js`.
- **Résumé:** replace `assets/Pavan_Bandla_Resume.pdf`.

## Deploy

It's a static site, so any static host works:

- **GitHub Pages:** push to a repo and enable Pages on the default branch (`/root`).
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the folder, or connect the repo —
  no build command needed, publish directory is `/`.
