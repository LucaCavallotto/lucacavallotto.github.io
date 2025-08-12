// assets/nav.js
(() => {
  const wrap = document.querySelector('.nav-wrap');
  const links = wrap ? wrap.querySelector('.nav-links') : null;
  if (!wrap || !links) return;

  // Ensure menu has an id for aria-controls
  if (!links.id) links.id = 'primary-menu';

  // Inject toggle button if not present
  let toggle = wrap.querySelector('.nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', links.id);
    toggle.setAttribute('aria-label', 'Toggle menu');
    const icon = document.createElement('span');
    icon.className = 'hamburger';
    toggle.appendChild(icon);
    wrap.insertBefore(toggle, links);
  }

  const openMenu = () => {
    links.classList.add('open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    links.classList.remove('open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    links.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on link click (mobile UX)
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });

  // Click outside to dismiss
  document.addEventListener('pointerdown', (e) => {
    if (!links.classList.contains('open')) return;
    const t = e.target;
    const nav = wrap.closest('nav') || wrap;
    if (!nav.contains(t)) closeMenu();
  });

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) closeMenu();
  });
})();
