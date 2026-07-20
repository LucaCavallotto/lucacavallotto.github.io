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
      const views = ['#home', '#skills', '#projects', '#project-detail'];

      // Hide all views
      views.forEach(view => {
        const el = document.getElementById('view-' + view.substring(1));
        if (el) el.style.display = 'none';
      });

      let activeView = '#home';

      if (hash.startsWith('#project/')) {
        activeView = '#project-detail';
        const projectId = hash.split('/')[1];
        const project = projects.find(p => p.id === projectId);
        if (project) {
          // Populate project detail view
          document.getElementById('project-detail-icon').textContent = project.icon || "📁";
          document.getElementById('project-detail-title').textContent = project.title;
          
          const tagContainer = document.getElementById('project-detail-tag-container');
          const tagEl = document.getElementById('project-detail-tag');
          if (project.tag) {
            tagEl.textContent = project.tag;
            tagContainer.style.display = 'block';
          } else {
            tagContainer.style.display = 'none';
          }
          
          const dateContainer = document.getElementById('project-detail-date-container');
          const dateEl = document.getElementById('project-detail-date');
          if (project.release_date) {
            // Format YYYY-MM-DD to DD/MM/YYYY
            const parts = project.release_date.split('-');
            if (parts.length === 3) {
              dateEl.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else {
              dateEl.textContent = project.release_date;
            }
            dateContainer.style.display = 'block';
          } else {
            dateContainer.style.display = 'none';
          }
          
          document.getElementById('project-detail-description').textContent = project.description_long || project.description_short;
          
          const linksContainer = document.getElementById('project-detail-links');
          linksContainer.innerHTML = '';
          if (project.links) {
            project.links.forEach(link => {
              const a = document.createElement("a");
              a.href = link.url;
              a.target = "_blank";
              a.rel = "noopener";
              a.textContent = link.text;
              a.className = "btn-outline-custom";
              if (link.text === "Try it Live") {
                a.style.background = "var(--text)";
                a.style.color = "var(--bg)";
                // Reset hover styles for "Try it Live"
                a.onmouseenter = () => { a.style.background = "var(--bg)"; a.style.color = "var(--text)"; };
                a.onmouseleave = () => { a.style.background = "var(--text)"; a.style.color = "var(--bg)"; };
              }
              linksContainer.appendChild(a);
            });
          }
        } else {
          // Fallback if project not found
          activeView = '#projects';
        }
      } else {
        activeView = views.includes(hash) ? hash : '#home';
      }

      // Show active view
      const activeEl = document.getElementById('view-' + activeView.substring(1));
      if (activeEl) {
        activeEl.style.display = 'block';
      }

      // Hide or show global nav and footer based on view
      const navEl = document.querySelector('nav');
      const footerEl = document.querySelector('footer');
      if (activeView === '#project-detail') {
        if (navEl) navEl.style.display = 'none';
        if (footerEl) footerEl.style.display = 'none';
        document.body.style.paddingTop = '0';
      } else {
        if (navEl) navEl.style.display = '';
        if (footerEl) footerEl.style.display = '';
        document.body.style.paddingTop = '';
      }

      // Re-initialize reveal animations for the shown view
      initReveal();

      // Scroll to top
      window.scrollTo(0, 0);

      // Update navbar active state
      const links = document.querySelectorAll(".nav-links a, .brand");
      links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === hash || (hash.startsWith('#project/') && href === '#projects')) {
          link.classList.add("active");
        } else if (href === activeView) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    // Attach back button listener for project detail view
    const backBtn = document.getElementById('project-detail-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.hash = '#projects';
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

  const searchInput = document.getElementById("project-search");
  const tagFilter = document.getElementById("project-tag-filter");
  const yearFilter = document.getElementById("project-year-filter");
  const sortSelect = document.getElementById("project-sort");

  // 1. Extract unique tags and years
  const tags = new Set();
  const years = new Set();

  projects.forEach(p => {
    if (p.tag) tags.add(p.tag);
    if (p.release_date) {
      const year = p.release_date.split("-")[0];
      years.add(year);
      p.release_year = year; // cache year on object
    }
  });

  // 2. Populate Selects
  tags.forEach(tag => {
    const opt = document.createElement("option");
    opt.value = tag;
    opt.textContent = tag;
    tagFilter.appendChild(opt);
  });

  // Sort years descending
  Array.from(years).sort((a, b) => b - a).forEach(year => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    yearFilter.appendChild(opt);
  });

  // 3. Render function
  const todayIdx = Math.floor(Date.now() / 86_400_000) % projects.length;
  // Let's identify the POTD by title so sorting doesn't change which one is "POTD"
  const potdTitle = projects[todayIdx]?.title;

  // 4. Filter and Sort function
  const searchClearBtn = document.getElementById("project-search-clear");
  
  function renderGrid(filteredProjects, sortType) {
    container.innerHTML = "";
    if (filteredProjects.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-5" style="color: var(--muted);">No projects found.</div>`;
      return;
    }

    const groupByYear = (sortType === "newest" || sortType === "oldest");

    if (groupByYear) {
      // Group projects by year
      const grouped = {};
      filteredProjects.forEach(project => {
        const year = project.release_year || "Unknown";
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(project);
      });

      // Sort years based on sortType
      const sortedYears = Object.keys(grouped).sort((a, b) => {
        if (sortType === "oldest") return a - b;
        return b - a; // newest by default
      });

      sortedYears.forEach((year, index) => {
        // Group Wrapper
        const groupWrapper = document.createElement("div");
        groupWrapper.className = "col-12 reveal";
        groupWrapper.style.marginBottom = "2rem"; // More space between different year/project couples

        // Add Year Header
        const header = document.createElement("h3");
        header.className = "year-header";
        if (index === 0) header.style.marginTop = "0";
        header.textContent = year;
        groupWrapper.appendChild(header);

        // Nested Row for Projects
        const projectsRow = document.createElement("div");
        projectsRow.className = "row g-4";

        // Render projects for this year
        grouped[year].forEach(project => {
          const colDiv = document.createElement("div");
          colDiv.className = "col-12 col-md-6 col-xl-4";
          const card = buildProjectCard(project, project.title === potdTitle);
          colDiv.appendChild(card);
          projectsRow.appendChild(colDiv);
        });

        groupWrapper.appendChild(projectsRow);
        container.appendChild(groupWrapper);
      });

    } else {
      // Flat grid rendering
      filteredProjects.forEach(project => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-md-6 col-xl-4 reveal"; // Added reveal class

        const card = buildProjectCard(project, project.title === potdTitle);
        colDiv.appendChild(card);
        container.appendChild(colDiv);
      });
    }

    initReveal(); // Re-initialize reveal for the new content
  }

  function filterAndSort() {
    const query = (searchInput.value || "").toLowerCase();
    const tag = tagFilter.value;
    const year = yearFilter.value;
    const sort = sortSelect.value;

    if (searchClearBtn) {
      searchClearBtn.style.display = query.length > 0 ? "flex" : "none";
    }

    let filtered = projects.filter(p => {
      const matchSearch = (p.title || "").toLowerCase().includes(query) || (p.description || "").toLowerCase().includes(query);
      const matchTag = tag ? p.tag === tag : true;
      const matchYear = year ? p.release_year === year : true;
      return matchSearch && matchTag && matchYear;
    });

    // Sorting applies to the array, which will also sort the projects inside their year groups when grouping is on
    filtered.sort((a, b) => {
      if (sort === "name") {
        return (a.title || "").localeCompare(b.title || "");
      } else if (sort === "label") {
        return (a.tag || "").localeCompare(b.tag || "");
      } else if (sort === "newest") {
        return (b.release_date || "").localeCompare(a.release_date || "");
      } else if (sort === "oldest") {
        return (a.release_date || "").localeCompare(b.release_date || "");
      }
      return 0;
    });

    renderGrid(filtered, sort);
  }

  // 5. Attach listeners
  if (searchInput) searchInput.addEventListener("input", filterAndSort);
  if (searchClearBtn) {
    searchClearBtn.addEventListener("click", () => {
      searchInput.value = "";
      filterAndSort();
      searchInput.focus();
    });
  }
  if (tagFilter) tagFilter.addEventListener("change", filterAndSort);
  if (yearFilter) yearFilter.addEventListener("change", filterAndSort);
  if (sortSelect) sortSelect.addEventListener("change", filterAndSort);

  // Initial render
  filterAndSort();
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

