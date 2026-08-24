# lucacavallotto.github.io

My personal portfolio — a small, dependency-light React site listing my background, skills and projects.

**Live:** https://lucacavallotto.github.io

---

## About

A single-page app built with React 19 and Vite, deployed to GitHub Pages. Three
production dependencies (`react`, `react-dom`, `react-router-dom`), no CSS
framework, no icon font, no analytics, no runtime data fetching.

The design goal was a site that loads instantly and stays readable in both light
and dark mode, without the usual portfolio weight: no loading spinners, no layout
shift, no JavaScript doing work the browser already does well.

## Features

- **Client-side routing** (`HashRouter`) — `#/`, `#/skills`, `#/projects`, `#/project/:id`.
  Hash routing avoids the 404-fallback dance that GitHub Pages needs for real paths.
- **Adaptive theme** driven by `prefers-color-scheme` and `color-scheme: light dark`,
  so native form controls follow along.
- **Project of the Day** — one project highlighted with a gold accent, picked
  deterministically from the day index so every visitor sees the same one, and it
  rotates once every 24h with no server involved.
- **Featured carousel** with autoplay, pause-on-interaction, arrow buttons, clickable
  dot indicators and touch swipe. The track shifts by a percentage of its own width, which survives
  resize, zoom and late font loading.
- **Search, filter and sort** on the projects page — live text search, plus label /
  language / year filters and four sort modes. All of it lives in the query string
  (`?q=&tag=&lang=&year=&sort=`), so a filtered view is shareable and survives navigation.
- **Scroll restoration** — opening a project detail and going back returns you to
  where you were in the grid.
- **Accessibility** — skip link, stretched links that keep their accessible name and
  keyboard focus, collapsed nav links removed from the tab order, and all motion
  suppressed under `prefers-reduced-motion`.

## Tech stack

| Layer | Choice |
| :--- | :--- |
| Framework | React 19 (function components only) |
| Build | Vite 7 |
| Routing | React Router 7, `HashRouter` |
| Styling | Vanilla CSS3 — CSS variables, Flexbox/Grid |
| Icons | Inline SVG, hand-rolled (`components/layout/Icon.jsx`) |
| Data | Local JSON imported at build time |
| Hosting | GitHub Pages via GitHub Actions |

## Running locally

Requires Node 20+ (CI builds on 22).

```bash
npm install
npm run dev      # Vite dev server with HMR
npm run build    # production bundle → dist/
npm run preview  # serve the built bundle locally
```

`base` stays `/` in `vite.config.js` — this is a user-page repo served from the
domain root, not a project subdirectory.

## Adding a project

Content lives in `src/data/projects.json`; nothing else needs to change. Append an
object to the array:

```json
{
  "icon": "🏎️",
  "title": "RaceTechAssistant",
  "tag": "Personal",
  "language": "JavaScript",
  "release_date": "2025-09-08",
  "id": "racetechassistant",
  "description_short": "Simple fuel and setup strategy tools for sim racing",
  "description_long": "Longer copy shown on the project detail page.",
  "links": [
    { "text": "View on GitHub", "url": "https://github.com/..." },
    { "text": "Try it Live", "url": "https://..." }
  ]
}
```

Notes:

- `id` must be unique — it's the `#/project/:id` route segment.
- `release_date` is stored as `YYYY-MM-DD` and rendered as `DD/MM/YYYY`.
- `icon` is optional; projects without one fall back to 📁.
- `tag`, `language` and the release year automatically become filter options.
- Link styling is chosen from the link `text`, so `"View on GitHub"` and
  `"Try it Live"` get their intended variants (see `linkVariant` in `lib/projects.js`).

Technical skills, education, experience, languages and interests live in
`src/data/skills.json`; the hero's rotating
lines are in `src/data/phrases.json`.

## Project structure

```text
├── .github/workflows/deploy.yml   # Build + publish to Pages on push to main
├── index.html                     # Vite entry shell (meta, favicons, #root)
├── public/                        # Copied verbatim: favicons
└── src/
    ├── main.jsx                   # Mount, global CSS, legacy-hash rewrite
    ├── App.jsx                    # Skip link, navbar, footer + routes
    ├── pages/                     # Home · Skills · Projects · ProjectDetail · NotFound
    ├── components/
    │   ├── layout/                # Navbar · Footer · SocialLinks · Reveal · Icon
    │   ├── project/               # ProjectCard · ProjectLinks · ProjectCarousel · ProjectFilters
    │   └── skills/                # TechnicalSkillsCard · TimelineCard · ListCard · RichText
    ├── hooks/                     # carousel · typing · swipe · media query · scroll · title
    ├── lib/                       # constants.js · projects.js (POTD, filter/sort/group)
    ├── data/                      # projects.json · phrases.json · skills.json
    └── styles/                    # base · utilities · layout · components · home · pages
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds with
`npm ci && npm run build` and publishes `dist/` using the official GitHub Pages
actions. Deployments are serialised (`concurrency: pages`, no cancel-in-progress),
so the most recent push always ends up live. The workflow can also be run manually
from the Actions tab.

## License

Code is free to read and learn from. Content — text, project descriptions and
imagery — is personal and not licensed for reuse.
