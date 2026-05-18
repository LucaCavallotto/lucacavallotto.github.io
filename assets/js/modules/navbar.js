/**
 * Initializes the navigation bar logic: mobile toggle and active link state.
 */
export function initNavbar() {
  const navMain = document.getElementById('navLinks');
  
  const closeMenu = () => {
    if (navMain && navMain.classList.contains('show') && window.bootstrap) {
      const bsCollapse = window.bootstrap.Collapse.getInstance(navMain) || new window.bootstrap.Collapse(navMain);
      bsCollapse.hide();
    }
  };

  if (navMain) {
    // Close on link click (mobile UX)
    navMain.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // Close when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });

    // Click outside to dismiss
    document.addEventListener('pointerdown', (e) => {
      if (!navMain.classList.contains('show')) return;
      const nav = document.querySelector('nav');
      if (nav && !nav.contains(e.target)) closeMenu();
    });

    // Esc to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

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
