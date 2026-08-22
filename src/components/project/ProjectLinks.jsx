import { linkVariant } from '../../lib/projects.js';

/**
 * The external links attached to a project (GitHub / live demo).
 * @param {{ links: any[], className?: string, projectTitle: string }} props
 */
export default function ProjectLinks({ links = [], className = '', projectTitle }) {
  if (!links.length) return null;

  return (
    <div className={className}>
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={linkVariant(link)}
          // Distinguishes otherwise identical "View on GitHub" links when a
          // screen reader lists every link on the page.
          aria-label={`${link.text} — ${projectTitle}`}
        >
          {link.text}
        </a>
      ))}
    </div>
  );
}
