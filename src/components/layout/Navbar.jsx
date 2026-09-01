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
  const [isClosing, setIsClosing] = useState(false);
  const navRef = useRef(null);
  const { pathname } = useLocation();

  // Any navigation closes the menu.
  useEffect(() => {
    if (open && !isClosing) {
      setIsClosing(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;

    const close = () => {
      if (!isClosing) setIsClosing(true);
    };
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) close();
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    const onResize = () => {
      if (window.innerWidth > 768) {
        setOpen(false);
        setIsClosing(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open, isClosing]);

  const handleTransitionEnd = (e) => {
    if (isClosing && e.target.classList.contains('nav-collapse') && e.propertyName === 'grid-template-rows') {
      setOpen(false);
      setIsClosing(false);
    }
  };

  return (
    <nav ref={navRef} aria-label="Main">
      <div className="nav-wrap">
        <NavLink className="brand" to="/">
          Luca Cavallotto
        </NavLink>

        <button
          className="nav-toggle"
          type="button"
          onClick={() => {
            if (open && !isClosing) setIsClosing(true);
            else if (!open) setOpen(true);
          }}
          aria-expanded={open && !isClosing}
          aria-controls="nav-links"
          aria-label={open && !isClosing ? 'Close menu' : 'Open menu'}
        >
          <span className="hamburger" />
        </button>

        <div
          id="nav-links"
          className={`nav-collapse ${open ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`.trim()}
          onTransitionEnd={handleTransitionEnd}
        >
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
