import { initNavbar } from './modules/navbar.js';
import { initReveal } from './modules/ui.js';
import { fetchData } from './modules/api.js';
import { initTyping } from './modules/typing.js';
import { initCarousel } from './modules/carousel.js';
import { buildProjectCard } from './modules/components.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Shared logic
  initNavbar();
  initReveal();

  // Page-specific logic
  const path = window.location.pathname;
  
  // Home page (index.html or root)
  if (path === "/" || path.endsWith("index.html")) {
    try {
      const [phrases, projects] = await Promise.all([
        fetchData('data/phrases.json'),
        fetchData('data/projects.json')
      ]);
      initTyping(phrases);
      initCarousel(projects);
    } catch (err) {
      console.error("Error initializing Home page:", err);
    }
  }

  // Projects page
  if (path.endsWith("projects.html")) {
    try {
      const projects = await fetchData('data/projects.json');
      initProjectsPage(projects);
    } catch (err) {
      console.error("Error initializing Projects page:", err);
    }
  }
});

/**
 * Renders the full list of projects on the projects page.
 * @param {any[]} projects 
 */
function initProjectsPage(projects) {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  container.innerHTML = "";
  const todayIdx = Math.floor(Date.now() / 86_400_000) % projects.length;

  projects.forEach((project, idx) => {
    const colDiv = document.createElement("div");
    colDiv.className = "col-12 col-lg-6";

    const card = buildProjectCard(project, idx === todayIdx);
    colDiv.appendChild(card);
    container.appendChild(colDiv);
  });
}
