import { SOCIAL_LINKS } from '../../lib/constants.js';
import Icon from './Icon.jsx';

/**
 * @param {{ showLabels?: boolean, className?: string, style?: object }} props
 * The hero uses icon-only links; the footer shows labels next to them.
 */
export default function SocialLinks({ showLabels = false, className = '', style }) {
  return (
    <div className={`social-links ${className}`.trim()} style={style}>
      {SOCIAL_LINKS.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={showLabels ? undefined : label}
        >
          <Icon name={icon} size={22} className="social-icon" />
          {showLabels ? <span>{label}</span> : null}
        </a>
      ))}
    </div>
  );
}
