/**
 * Initializes the navigation bar logic: mobile toggle and active link state.
 */
export function initNavbar() {
  const wrap = document.querySelector('.nav-wrap');
  const linksContainer = wrap ? wrap.querySelector('.nav-links') : null;
  if (!wrap || !linksContainer) return;

  // Ensure menu has an id for aria-controls
  if (!linksContainer.id) linksContainer.id = 'primary-menu';

  // Inject toggle button if not present (to match original nav.js behavior)
  let toggle = wrap.querySelector('.nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', linksContainer.id);
    toggle.setAttribute('aria-label', 'Toggle menu');
    const icon = document.createElement('span');
    icon.className = 'hamburger';
    toggle.appendChild(icon);
    wrap.insertBefore(toggle, linksContainer);
  }

  const openMenu = () => {
    linksContainer.classList.add('open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    linksContainer.classList.remove('open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    linksContainer.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on link click (mobile UX)
  linksContainer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  // Click outside to dismiss
  document.addEventListener('pointerdown', (e) => {
    if (!linksContainer.classList.contains('open')) return;
    const t = e.target;
    const nav = wrap.closest('nav') || wrap;
    if (!nav.contains(t)) closeMenu();
  });

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && linksContainer.classList.contains('open')) closeMenu();
  });

  // Active state management
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".nav-links a");

  links.forEach(link => {
    const href = link.getAttribute("href");
    const normalizedHref = href ? href.replace("../", "") : "";
    
    if (currentPath === "/" || currentPath.endsWith("index.html")) {
      if (normalizedHref === "index.html" || normalizedHref === "/") {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    } else if (href && currentPath.endsWith(normalizedHref)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
