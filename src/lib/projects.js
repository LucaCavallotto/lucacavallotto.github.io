import { DEFAULT_PROJECT_ICON, FEATURED_PROJECT_COUNT } from './constants.js';

/** Number of ms in a day — the granularity at which POTD/featured rotate. */
const DAY_MS = 86_400_000;

/** @returns {string} the project's emoji, or the shared fallback. */
export function projectIcon(project) {
  return project.icon && project.icon.trim() ? project.icon : DEFAULT_PROJECT_ICON;
}

/** Release year, derived rather than cached back onto the project object. */
export function projectYear(project) {
  return project.release_date ? project.release_date.split('-')[0] : '';
}

/** YYYY-MM-DD → DD/MM/YYYY, passing anything unexpected through untouched. */
export function formatReleaseDate(value) {
  if (!value) return '';
  const parts = value.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
}

/**
 * Maps a link to its visual variant. The original code matched on the link
 * label at three separate call sites; keeping that mapping here means the
 * JSON stays untouched but the rule lives in exactly one place.
 */
export function linkVariant(link) {
  if (link.text === 'View on GitHub') return 'carousel-link-ghost';
  if (link.text === 'Try it Live') return 'carousel-link-primary';
  return 'btn-outline-custom';
}

/** Index of the day, shared by POTD and the featured shuffle so both rotate together. */
export function dayIndex(now = Date.now()) {
  return Math.floor(now / DAY_MS);
}

/**
 * Deterministic shuffle: every visitor sees the same order for a given day,
 * and it changes once per day without any server involvement.
 */
function seededShuffle(array, seed) {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    const x = Math.sin(s++) * 10000;
    const j = Math.floor((x - Math.floor(x)) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** The highlighted project for today, stable for 24h across all devices. */
export function getProjectOfTheDay(projects, day = dayIndex()) {
  if (!projects.length) return null;
  return projects[day % projects.length];
}

/** A daily rotating sample of projects for the home carousel, excluding the POTD. */
export function getFeaturedProjects(projects, day = dayIndex()) {
  const potd = getProjectOfTheDay(projects, day);
  const others = projects.filter((p) => p.id !== potd?.id);
  return seededShuffle(others, day).slice(0, FEATURED_PROJECT_COUNT);
}

/** Unique tags / languages / years available across the catalogue. */
export function getFilterOptions(projects) {
  const tags = new Set();
  const languages = new Set();
  const years = new Set();

  projects.forEach((p) => {
    if (p.tag) tags.add(p.tag);
    if (p.language) languages.add(p.language);
    const year = projectYear(p);
    if (year) years.add(year);
  });

  return {
    tags: [...tags],
    languages: [...languages].sort((a, b) => a.localeCompare(b)),
    years: [...years].sort((a, b) => Number(b) - Number(a)),
  };
}

const COMPARATORS = {
  name: (a, b) => (a.title || '').localeCompare(b.title || ''),
  label: (a, b) => (a.tag || '').localeCompare(b.tag || ''),
  newest: (a, b) => (b.release_date || '').localeCompare(a.release_date || ''),
  oldest: (a, b) => (a.release_date || '').localeCompare(b.release_date || ''),
};

/** Applies the toolbar's search box, three selects and sort order. */
export function filterAndSortProjects(projects, { query = '', tag = '', language = '', year = '', sort = 'name' }) {
  const q = query.trim().toLowerCase();

  const filtered = projects.filter((p) => {
    const matchesQuery =
      !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.description_short || '').toLowerCase().includes(q) ||
      (p.description_long || '').toLowerCase().includes(q);

    return (
      matchesQuery &&
      (!tag || p.tag === tag) &&
      (!language || p.language === language) &&
      (!year || projectYear(p) === year)
    );
  });

  return filtered.sort(COMPARATORS[sort] ?? COMPARATORS.name);
}

/** Sort modes that render projects under year/label headings instead of one flat grid. */
export const GROUPED_SORTS = new Set(['newest', 'oldest', 'label']);

/**
 * Buckets projects for the grouped sort modes.
 * @returns {{key: string, projects: any[]}[]} groups in display order
 */
export function groupProjects(projects, sort) {
  if (!GROUPED_SORTS.has(sort)) return null;

  const groups = new Map();
  projects.forEach((project) => {
    const key = sort === 'label' ? project.tag || 'Uncategorized' : projectYear(project) || 'Unknown';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(project);
  });

  const keys = [...groups.keys()].sort((a, b) => {
    if (sort === 'label') return a.localeCompare(b);
    return sort === 'oldest' ? Number(a) - Number(b) : Number(b) - Number(a);
  });

  return keys.map((key) => ({ key, projects: groups.get(key) }));
}
