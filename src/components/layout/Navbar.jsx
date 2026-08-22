import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../lib/constants.js';

/**
 * Fixed top navigation.
 *
 * The mobile dropdown used Bootstrap's Collapse plugin; it is now a piece of
 * React state, with the same dismiss behaviours (link click, Esc, outside
 * click, resize back to desktop) rebuilt around it.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const { pathname } = useLocation();

  // Any navigation closes the menu.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const close = () => setOpen(false);
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) close();
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    const onResize = () => {
      if (window.innerWidth > 768) close();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <nav ref={navRef} aria-label="Main">
      <div className="nav-wrap">
        <NavLink className="brand" to="/">
          Luca Cavallotto
        </NavLink>

        <button
          className="nav-toggle"
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <span className="hamburger" />
        </button>

        <div id="nav-links" className={`nav-collapse ${open ? 'is-open' : ''}`.trim()}>
          {/* Clipping wrapper: it must stay padding-free, or the collapsed
              row would still reserve its padding box and sit half-open. */}
          <div>
            <ul className="nav-links">
              {NAV_ITEMS.map(({ label, to }) => (
                <li key={to}>
                  <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
