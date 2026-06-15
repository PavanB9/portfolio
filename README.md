# 👋 Pavan Bandla — Personal Portfolio

My personal Computer Science portfolio website.

### 🌐 **[View it live → pavanb9.github.io/portfolio](https://pavanb9.github.io/portfolio/)**

---

I'm a CS student at **Rutgers University** ('28) who likes building practical tools — turning
messy data into clear decisions and repetitive work into automation. This site is the home for
my projects, experience, and ways to reach me.

**Find me:**
[Live site](https://pavanb9.github.io/portfolio/) ·
[LinkedIn](https://linkedin.com/in/pavankbl/) ·
[GitHub](https://github.com/PavanB9) ·
[Email](mailto:pavankrishna2006@gmail.com)

## Built with

Hand-written **HTML, CSS, and JavaScript** — no frameworks, no build step, and zero external
dependencies (system fonts + inline SVG icons). It's fast, works offline, and is hosted free on
GitHub Pages.

## Structure

```
Site/
├── index.html      # all page content
├── css/styles.css  # "liquid glass" design system, layout, animations, light/dark themes
├── js/main.js      # typing effect, scroll reveals, active nav, theme toggle, mobile menu
├── serve.py        # tiny local preview server (Python stdlib only)
└── README.md
```

## Notes to self

**Preview locally:**

```powershell
python serve.py        # opens http://localhost:8000
```

**Update the live site** — edit, then:

```powershell
git add -A
git commit -m "what changed"
git push
```

GitHub Pages rebuilds automatically in a minute or two.

**Quick tweaks:** colors live in the CSS variables at the top of `css/styles.css`
(`:root` / `[data-theme="light"]`); the rotating hero titles are the `phrases` array in `js/main.js`.

---

© Pavan Krishna Bandla Leelavinod
