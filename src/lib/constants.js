/** Fallback icon for projects without a custom emoji. */
export const DEFAULT_PROJECT_ICON = '📁';

/** Primary navigation, previously injected imperatively by navbar.js. */
export const NAV_ITEMS = [
  { label: 'Skills', to: '/skills' },
  { label: 'Projects', to: '/projects' },
];

export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/LucaCavallotto', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/luca-cavallotto/', icon: 'linkedin' },
];

/** Above this width the carousel shows two cards side by side. */
export const CAROUSEL_DESKTOP_BREAKPOINT = 641;
export const CAROUSEL_AUTOPLAY_INTERVAL = 3000;
/** How long autoplay stays paused after a manual navigation. */
export const CAROUSEL_RESUME_DELAY = 5000;

export const FEATURED_PROJECT_COUNT = 4;

export const SORT_OPTIONS = [
  { value: 'name', label: 'Sort by: Name (A-Z)' },
  { value: 'newest', label: 'Sort by: Newest' },
  { value: 'oldest', label: 'Sort by: Oldest' },
  { value: 'label', label: 'Sort by: Label' },
];
