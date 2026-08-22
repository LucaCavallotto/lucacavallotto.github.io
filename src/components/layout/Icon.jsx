/**
 * The seven icons the site actually uses, inlined as SVG.
 * Replaces the bootstrap-icons webfont (~120KB) that was loaded from a CDN
 * to render a handful of glyphs.
 */

const STROKE_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const PATHS = {
  'arrow-left': <path d="M19 12H5m7 7-7-7 7-7" {...STROKE_PROPS} />,
  'arrow-right': <path d="M5 12h14m-7-7 7 7-7 7" {...STROKE_PROPS} />,
  pause: <path d="M9 5v14M15 5v14" {...STROKE_PROPS} />,
  play: <path d="M7 4.5v15l13-7.5z" fill="currentColor" />,
  x: <path d="M18 6 6 18M6 6l12 12" {...STROKE_PROPS} />,
  'x-circle': (
    <g {...STROKE_PROPS}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6m0-6 6 6" />
    </g>
  ),
  sliders: (
    <g {...STROKE_PROPS}>
      <path d="M4 7h11M19 7h1M4 17h5M13 17h7" />
      <circle cx="17" cy="7" r="2" />
      <circle cx="11" cy="17" r="2" />
    </g>
  ),
  github: (
    <path
      fill="currentColor"
      d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
    />
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  ),
};

/**
 * @param {{ name: keyof typeof PATHS, size?: number, className?: string, title?: string }} props
 * Without a `title` the icon is hidden from assistive tech, which is what you
 * want whenever the surrounding control already carries an accessible name.
 */
export default function Icon({ name, size = 20, className, title }) {
  const glyph = PATHS[name];
  if (!glyph) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {glyph}
    </svg>
  );
}
