import { initNavbar } from './modules/navbar.js';
import { initReveal } from './modules/ui.js';
import { fetchData } from './modules/api.js';
import { initTyping } from './modules/typing.js';
import { initCarousel } from './modules/carousel.js';
import {
  buildProjectCard,
  buildTechnicalSkillsCard,
  buildEducationCard,
  buildExperienceCard,
  buildLanguagesCard,
  buildInterestsCard
} from './modules/components.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Shared logic
  initNavbar();
  initReveal();

  try {
    const [phrases, projects, skillsData] = await Promise.all([
      fetchData('data/phrases.json'),
      fetchData('data/projects.json'),
      fetchData('data/skills.json')
    ]);

    // Initialize components
    initTyping(phrases);
    initCarousel(projects);
    initProjectsPage(projects);
    initSkillsPage(skillsData);

    // Routing logic
    function handleRoute() {
      const hash = window.location.hash || '#home';
      const views = ['#home', '#skills', '#projects'];

      // Hide all views
      views.forEach(view => {
        const el = document.getElementById('view-' + view.substring(1));
        if (el) el.style.display = 'none';
      });

      // Show active view
      const activeView = views.includes(hash) ? hash : '#home';
      const activeEl = document.getElementById('view-' + activeView.substring(1));
      if (activeEl) {
        activeEl.style.display = 'block';
      }

      // Re-initialize reveal animations for the shown view
      initReveal();

      // Scroll to top
      window.scrollTo(0, 0);

      // Update navbar active state
      const links = document.querySelectorAll(".nav-links a, .brand");
      links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === activeView || (activeView === '#home' && href === '#home')) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

  } catch (err) {
    console.error("Error initializing page:", err);
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
    colDiv.className = "col-12 col-md-6 col-xl-4 reveal"; // Added reveal class

    const card = buildProjectCard(project, idx === todayIdx);
    colDiv.appendChild(card);
    container.appendChild(colDiv);
  });

  // Re-initialize reveal for the new content
  initReveal();
}

/**
 * Renders the skills page components dynamically.
 * @param {any} skillsData 
 */
function initSkillsPage(skillsData) {
  const container = document.getElementById("skills-container");
  if (!container) return;

  container.innerHTML = "";

  // 1. Column 1: Technical Skills (col-12)
  const col1 = document.createElement("div");
  col1.className = "col-12 reveal";
  col1.appendChild(buildTechnicalSkillsCard(skillsData.technicalSkills));
  container.appendChild(col1);

  // 2. Column 2: Education (col-12 col-lg-6)
  const col2 = document.createElement("div");
  col2.className = "col-12 col-lg-6 reveal";
  col2.appendChild(buildEducationCard(skillsData.education));
  container.appendChild(col2);

  // 3. Column 3: Experience, Languages, Interests (col-12 col-lg-6)
  const col3 = document.createElement("div");
  col3.className = "col-12 col-lg-6 reveal";
  col3.appendChild(buildExperienceCard(skillsData.experience));
  col3.appendChild(buildLanguagesCard(skillsData.languages));
  col3.appendChild(buildInterestsCard(skillsData.interests));
  container.appendChild(col3);

  // Re-initialize reveal for the new dynamic content
  initReveal();
}

