# Project Overview

A high-performance, minimalist personal portfolio website for Luca Cavallotto. The application serves as a digital professional profile, showcasing an MSc AI & Data Analytics student's background, technical skills, and featured projects. The site is built for speed and visual elegance, featuring a clean adaptive design (Light/Dark mode), interactive components like a custom project carousel, typing animations, client-side hash routing, and real-time project filtering.

---

# Technical Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Framework** | React 19 | Component-driven UI, no class components. |
| **Build** | Vite 7 | Dev server and production bundling. |
| **Routing** | React Router 7 (HashRouter) | `#/`, `#/skills`, `#/projects`, `#/project/:id`. |
| **Styling** | Vanilla CSS3 | Custom design system using CSS Variables and Flexbox/Grid. No CSS framework. |
| **Icons** | Inline SVG (`components/layout/Icon.jsx`) | Nine hand-rolled glyphs; no icon font. |
| **Typography** | System font stack | Modern, clean sans-serif stack for high readability. |
| **Data** | JSON | Local manifests imported at build time (no runtime fetch). |
| **Deployment** | GitHub Pages via GitHub Actions | `.github/workflows/deploy.yml`, official Pages actions. |

---

# Workflow & Rules

### Command Execution
- **Local Development**: `npm run dev` (Vite dev server with HMR).
- **Production build**: `npm run build` → `dist/`; `npm run preview` serves it locally.
- **Base path**: must stay `/` — this is the user-page repo served from the domain root.

### Coding Standards
- **Components**: one component per file, default export, PascalCase filename, `.jsx` extension.
- **CSS**: use CSS variables (defined in `:root`) for all color tokens. Class names stay `kebab-case`; the small utility layer is prefixed `u-`.
- **State**: prefer local state and derived values; the projects toolbar keeps its state in the URL query string.
- **Data**: `src/data/*.json` is imported directly — adding a project means editing `projects.json` only.
- **Naming**: `kebab-case` for CSS classes and non-component files, `PascalCase` for components.

### Documentation & Commits
- **Commits**: Concise, present-tense messages (e.g., `Add reveal animation to home`, `Update projects.json`).
- **Comments**: Focus on the *why* rather than the *how* for complex UI logic (e.g., carousel track math).

---

# Design System & UI

### Color Palette
Adaptive themes handled via `prefers-color-scheme`, plus `color-scheme: light dark` so native controls follow.
- **Light Mode**: `--bg: #ffffff`, `--text: #0a0a0a`, `--muted: #666`.
- **Dark Mode**: `--bg: #0b0b0c`, `--text: #f2f2f2`, `--muted: #9aa0a6`.

### UI Patterns
- **Glassmorphism**: navigation bar, buttons, inputs and footer use `backdrop-filter: blur()`.
- **Interactivity**: subtle hover lifts (`translateY(-2px)`), scroll-triggered reveals via the `<Reveal>` component (Intersection Observer), all motion suppressed under `prefers-reduced-motion`.
- **Components**:
    - **Project Cards**: minimalist borders, 16px radius; the title holds a stretched `<Link>` so the whole card is clickable *and* keyboard reachable.
    - **Project of the Day (POTD)**: daily highlighted project with a gold accent border and badge; chosen deterministically from the day index so every visitor sees the same one.
    - **Default Project Icon**: standardized fallback (`📁` via `DEFAULT_PROJECT_ICON`) for projects without a custom emoji.
    - **Carousel**: bottom control bar with autoplay pause/play and arrows on the left, "View All Projects →" CTA on the right. The track shifts by a percentage of its own width — never by measured pixels.
    - **Pills**: pill-shaped badges for skill tags with hover scaling.
    - **Search & Filtering**: live search with clear button, label/language/year filters and four sort modes; state lives in the query string (`?q=&tag=&lang=&year=&sort=`) so filtered views are shareable and survive navigation.

---

# Architecture

```text
/
├── .github/workflows/deploy.yml   # Build + publish to Pages on push to main
├── index.html                     # Vite entry shell (meta, favicons, #root)
├── vite.config.js
├── public/                        # Copied verbatim: favicons
└── src/
    ├── main.jsx                   # Mount, global CSS imports, legacy-hash rewrite
    ├── App.jsx                    # Chrome (skip link, navbar, footer) + routes
    ├── pages/
    │   ├── Home.jsx               # Hero, about, POTD + featured carousel
    │   ├── Skills.jsx             # Skills, education, experience, languages, interests
    │   ├── Projects.jsx           # Toolbar + grid (flat or grouped by year/label)
    │   ├── ProjectDetail.jsx      # Single project, contextual back button
    │   └── NotFound.jsx
    ├── components/
    │   ├── layout/   Navbar · Footer · SocialLinks · Reveal · Icon
    │   ├── project/  ProjectCard · ProjectLinks · ProjectCarousel · ProjectFilters
    │   └── skills/   TechnicalSkillsCard · TimelineCard · ListCard · RichText
    ├── hooks/
    │   ├── useCarousel.js         # Index, autoplay, pause rules, track transform
    │   ├── useTypingEffect.js     # Typing animation with proper teardown
    │   ├── useSwipe.js            # Touch swipe handlers
    │   ├── useMediaQuery.js       # matchMedia + prefers-reduced-motion
    │   ├── useScrollRestoration.js# Top on navigate, restore when leaving a detail page
    │   └── useDocumentTitle.js
    ├── lib/
    │   ├── constants.js           # DEFAULT_PROJECT_ICON, nav items, carousel timings
    │   └── projects.js            # POTD, daily shuffle, filter/sort/group, date format
    ├── data/                      # projects.json · phrases.json · skills.json
    └── styles/                    # base · utilities · layout · components · home · pages
```

---

# Lessons Learned

- **Gotcha**: With fixed navigation using `backdrop-filter`, the background needs enough transparency (e.g. `color-mix(in srgb, var(--bg) 85%, transparent)`) for the blur to show.
- **Collapse without a framework**: animating `grid-template-rows: 0fr → 1fr` replaces Bootstrap's height-measuring collapse for both the mobile nav and the filter panel; pair it with `visibility: hidden` so collapsed links leave the tab order.
- **Carousel math**: shifting the track by a percentage of its own width (`calc(50% + 0.5rem)` per step) survives resize, zoom and font loading — reading `offsetWidth` did not.
- **Stretched links**: a `::after { inset: 0 }` overlay on the title link keeps a whole card clickable without giving up the accessible name or keyboard focus that a `<div onclick>` throws away.
- **HashRouter paths**: routes are `#/skills`, not `#skills`. `src/main.jsx` rewrites the legacy bare-hash URLs before the router reads them, and in-page anchors must never be plain `href="#…"`.
- **Data as modules**: importing the JSON removes the fetch waterfall and the loading spinners entirely; the whole catalogue is only ~16KB.
- **Date Formatting**: raw dates in JSON (`YYYY-MM-DD`) are formatted to `DD/MM/YYYY` in `lib/projects.js` before rendering.
