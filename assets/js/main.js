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

  // Skills page
  if (path.endsWith("skills.html")) {
    try {
      const skillsData = await fetchData('data/skills.json');
      initSkillsPage(skillsData);
    } catch (err) {
      console.error("Error initializing Skills page:", err);
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

