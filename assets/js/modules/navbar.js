/**
 * Initializes the navigation bar logic: mobile toggle, active link state, and dynamic dynamic rendering.
 */
export function initNavbar() {
  const isInsidePages = window.location.pathname.includes('/pages/');

  // 1. Dynamic Brand Link path adjustment
  const brand = document.querySelector('nav .brand');
  if (brand) {
    brand.href = isInsidePages ? '../index.html' : 'index.html';
  }

  // 2. Dynamic Links injection
  const navMain = document.getElementById('navLinks');
  if (navMain) {
    navMain.innerHTML = "";

    const ul = document.createElement("ul");
    ul.className = "nav-links";

    const menuItems = [
      { text: "Skills", url: "pages/skills.html" },
      { text: "Projects", url: "pages/projects.html" }
    ];

    menuItems.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = item.text;
      
      // Calculate correct relative prefix
      a.href = isInsidePages ? `../${item.url}` : item.url;
      
      li.appendChild(a);
      ul.appendChild(li);
    });

    navMain.appendChild(ul);
  }

  // 3. Mobile collapse interaction
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

  // 4. Active state management
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

