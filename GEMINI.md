# Project Overview

A high-performance, minimalist personal portfolio website for Luca Cavallotto. The application serves as a digital professional profile, showcasing an MSc AI & Data Analytics student's background, technical skills, and featured projects. The site is built for speed and visual elegance, featuring a clean adaptive design (Light/Dark mode), interactive components like a custom project carousel, typing animations, single-page hash routing, and real-time project filtering.

---

# Technical Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | HTML5 | Semantically structured markup. |
| **Styling** | Vanilla CSS3 | Custom design system using CSS Variables and Flexbox/Grid. |
| **Framework** | Bootstrap 5.3.3 (CDN) | Utility classes and bundle for specific component behaviors. |
| **Logic** | Vanilla JS (ES6+) | Modular scripts for UI interactivity, routing, and data-driven rendering. |
| **Icons** | Bootstrap Icons | Consistent iconography set via CDN. |
| **Typography** | Inter / System Fonts | Modern, clean sans-serif stack for high readability. |
| **Data** | JSON | Local manifests for projects, typing phrases, and skills. |
| **Deployment** | GitHub Pages | Static hosting and version control. |

---

# Workflow & Rules

### Command Execution
Since this is a static project, no build step is required.
- **Local Development**: Use any static file server (e.g., `npx serve .`, `python -m http.server`, or VS Code Live Server).
- **Environment**: Ensure all paths are relative to maintain compatibility with GitHub Pages subdirectories.

### Coding Standards
- **HTML**: Maintain semantic structure (`<main>`, `<section>`, `<article>`). Use unique IDs for interactive elements.
- **CSS**: Use CSS variables (defined in `:root`) for all color and spacing tokens. Follow the mobile-first approach where applicable.
- **JavaScript**: Use modular scripts. Prefer DOMContentLoaded listeners for initialization. Avoid heavy external dependencies.
- **Naming**: Use `kebab-case` for file names and CSS classes.

### Documentation & Commits
- **Commits**: Concise, present-tense messages (e.g., `Add reveal animation to home`, `Update projects.json`).
- **Comments**: Focus on the *why* rather than the *how* for complex UI logic (e.g., carousel track math).

---

# Design System & UI

### Color Palette
Adaptive themes handled via `prefers-color-scheme`.
- **Light Mode**: `--bg: #ffffff`, `--text: #0a0a0a`, `--muted: #666`.
- **Dark Mode**: `--bg: #0b0b0c`, `--text: #f2f2f2`, `--muted: #9aa0a6`.

### UI Patterns
- **Glassmorphism**: Applied to the navigation bar, buttons, inputs, and footers using `backdrop-filter: blur()`.
- **Interactivity**: 
    - **Hover Effects**: Subtle scaling (`transform: translateY(-2px)`) and shadow transitions.
    - **Reveal Animations**: Scroll-triggered entry transitions using Intersection Observer logic.
- **Components**: 
    - **Project Cards**: Minimalist borders with high border-radius (12px-16px).
    - **Project of the Day (POTD)**: Daily highlighted project featuring a gold accent border and badge.
    - **Default Project Icon**: Standardized fallback (`📁` via `DEFAULT_PROJECT_ICON`) for repositories or projects without custom live emojis.
    - **Carousel Controls**: Bottom-aligned control bar placing autoplay pause/play & directional arrow controls on the left and the "View All Projects →" CTA on the right.
    - **Pills**: Pill-shaped badges for skill tags with hover scaling.
    - **Project Detail View & Hash Routing**: Dynamic client-side routing (`#project/:id`) displaying rich descriptions, tags, formatted dates (`DD/MM/YYYY`), and primary/ghost action links.
    - **Search & Filtering**: Live search with clear button, label & release year filters, and multi-mode sorting (Name, Newest, Oldest, Label).

---

# Architecture

```text
/
├── assets/
│   ├── css/
│   │   ├── base.css          # Variables, reset, and core typography
│   │   ├── layout.css        # Navbar, footer, and container structures
│   │   ├── components.css    # Shared UI: Cards, pills, buttons, and card icons
│   │   ├── home.css          # Homepage hero, carousel, and POTD styles
│   │   └── pages.css         # Page-specific overrides (Skills & Projects)
│   └── js/
│       ├── modules/
│       │   ├── api.js        # Data fetching logic
│       │   ├── ui.js         # Shared UI (Reveal, Touch/Swipe)
│       │   ├── carousel.js   # Carousel slider, indicators, and autoplay logic
│       │   ├── typing.js     # Typing animation logic
│       │   ├── components.js # Shared UI component builders & DEFAULT_PROJECT_ICON
│       │   └── navbar.js     # Nav toggle and active link state
│       └── main.js           # App entry point, SPA hash routing, filter & detail logic
├── data/
│   ├── phrases.json          # Typing phrases
│   ├── projects.json         # Portfolio projects manifest
│   └── skills.json           # Skills, experience, education, languages, and interests data
├── index.html                # Single-page application landing page & view containers
```

---

# Lessons Learned

- **Gotcha**: When using fixed navigation with `backdrop-filter`, ensure the background color has sufficient transparency (e.g., `color-mix(in srgb, var(--bg) 85%, transparent)`) for the blur to be visible.
- **Performance**: Intersection Observer is preferred over `scroll` events for reveal animations to prevent main-thread jank.
- **Responsive Layouts**: Use `clamp()` for font sizes and widths to ensure smooth scaling between mobile and desktop without excessive media queries.
- **Default Fallback Tokens**: Consolidating fallbacks (like `DEFAULT_PROJECT_ICON = "📁"`) in shared JS modules ensures unified rendering across both list cards and detail views.
- **Date Formatting**: Raw dates in JSON (`YYYY-MM-DD`) should be parsed and formatted cleanly (`DD/MM/YYYY`) before rendering in user-facing detail views.

