import { initNavbar } from './modules/navbar.js';
import { initReveal } from './modules/ui.js';
import { fetchData } from './modules/api.js';
import { initTyping } from './modules/typing.js';
import { initCarousel } from './modules/carousel.js';
import {
  DEFAULT_PROJECT_ICON,
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

    let lastMainView = '#projects';
    let currentView = null;
    const scrollPositions = {
      '#home': 0,
      '#skills': 0,
      '#projects': 0
    };

    // Routing logic
    function handleRoute() {
      const hash = window.location.hash || '#home';
      const views = ['#home', '#skills', '#projects', '#project-detail'];

      // Save scroll position of the previous view if it was a main view
      if (currentView && currentView !== '#project-detail' && views.includes(currentView)) {
        scrollPositions[currentView] = window.scrollY;
      }

      const isReturningFromDetail = (currentView === '#project-detail');

      // Hide all views
      views.forEach(view => {
        const el = document.getElementById('view-' + view.substring(1));
        if (el) el.style.display = 'none';
      });

      let activeView = '#home';

      if (hash.startsWith('#project/')) {
        activeView = '#project-detail';

        // Update dynamic back button label
        const backBtnText = document.getElementById('project-detail-back-text');
        if (backBtnText) {
          if (lastMainView === '#home') {
            backBtnText.textContent = 'Back to Home';
          } else if (lastMainView === '#skills') {
            backBtnText.textContent = 'Back to Skills';
          } else {
            backBtnText.textContent = 'Back to Projects';
          }
        }

        const projectId = hash.split('/')[1];
        const project = projects.find(p => p.id === projectId);
        if (project) {
          // Populate project detail view
          document.getElementById('project-detail-icon').textContent = (project.icon && project.icon.trim()) ? project.icon : DEFAULT_PROJECT_ICON;
          document.getElementById('project-detail-title').textContent = project.title;
          
          const tagContainer = document.getElementById('project-detail-tag-container');
          const tagEl = document.getElementById('project-detail-tag');
          if (project.tag) {
            tagEl.textContent = project.tag;
            tagContainer.style.display = 'block';
          } else {
            tagContainer.style.display = 'none';
          }

          const languageContainer = document.getElementById('project-detail-language-container');
          const languageEl = document.getElementById('project-detail-language');
          if (project.language) {
            languageEl.textContent = project.language;
            languageContainer.style.display = 'block';
          } else {
            languageContainer.style.display = 'none';
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
              if (link.text === "View on GitHub") {
                a.className = "carousel-link-ghost";
                // Optionally make it larger since it's the detail view
                a.style.fontSize = "1rem";
              } else if (link.text === "Try it Live") {
                a.className = "carousel-link-primary";
                a.style.fontSize = "1rem";
                a.style.padding = "0.5rem 1.25rem";
              } else {
                a.className = "btn-outline-custom";
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
        lastMainView = activeView;
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

      // Restore scroll position when returning from detail view, otherwise reset to top
      if (isReturningFromDetail && scrollPositions[activeView] !== undefined) {
        window.scrollTo(0, scrollPositions[activeView]);
      } else {
        window.scrollTo(0, 0);
      }

      // Re-initialize reveal animations for the shown view
      initReveal();

      // Track active view as current for next transition
      currentView = activeView;

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
        window.location.hash = lastMainView || '#projects';
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
  const languageFilter = document.getElementById("project-language-filter");
  const yearFilter = document.getElementById("project-year-filter");
  const sortSelect = document.getElementById("project-sort");

  // 1. Extract unique tags, languages, and years
  const tags = new Set();
  const languages = new Set();
  const years = new Set();

  projects.forEach(p => {
    if (p.tag) tags.add(p.tag);
    if (p.language) languages.add(p.language);
    if (p.release_date) {
      const year = p.release_date.split("-")[0];
      years.add(year);
      p.release_year = year; // cache year on object
    }
  });

  // 2. Populate Selects
  if (tagFilter) {
    tags.forEach(tag => {
      const opt = document.createElement("option");
      opt.value = tag;
      opt.textContent = tag;
      tagFilter.appendChild(opt);
    });
  }

  if (languageFilter) {
    Array.from(languages).sort((a, b) => a.localeCompare(b)).forEach(lang => {
      const opt = document.createElement("option");
      opt.value = lang;
      opt.textContent = lang;
      languageFilter.appendChild(opt);
    });
  }

  // Sort years descending
  if (yearFilter) {
    Array.from(years).sort((a, b) => b - a).forEach(year => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year;
      yearFilter.appendChild(opt);
    });
  }

  // 3. Render function
  const todayIdx = Math.floor(Date.now() / 86_400_000) % projects.length;
  // Let's identify the POTD by title so sorting doesn't change which one is "POTD"
  const potdTitle = projects[todayIdx]?.title;

  // 4. Filter and Sort function
  const searchClearBtn = document.getElementById("project-search-clear");
  const filtersClearWrap = document.getElementById("project-filters-clear-wrap");
  const filtersClearBtn = document.getElementById("project-filters-clear");
  
  function renderGrid(filteredProjects, sortType) {
    container.innerHTML = "";
    if (filteredProjects.length === 0) {
      container.innerHTML = `<div class="col-12 text-center py-5" style="color: var(--muted);">No projects found.</div>`;
      return;
    }

    const isGrouped = (sortType === "newest" || sortType === "oldest" || sortType === "label");

    if (isGrouped) {
      // Group projects by key
      const grouped = {};
      filteredProjects.forEach(project => {
        let groupKey;
        if (sortType === "label") {
          groupKey = project.tag || "Uncategorized";
        } else {
          groupKey = project.release_year || "Unknown";
        }
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(project);
      });

      // Sort group keys based on sortType
      const sortedKeys = Object.keys(grouped).sort((a, b) => {
        if (sortType === "label") {
          return a.localeCompare(b);
        } else if (sortType === "oldest") {
          return a - b;
        }
        return b - a; // newest by default
      });

      sortedKeys.forEach((key, index) => {
        // Group Wrapper
        const groupWrapper = document.createElement("div");
        groupWrapper.className = "col-12 reveal";
        groupWrapper.style.marginBottom = "2rem"; // More space between different year/project couples

        // Add Header (Year or Label)
        const header = document.createElement("h3");
        header.className = "year-header";
        if (index === 0) header.style.marginTop = "0";
        header.textContent = key;
        groupWrapper.appendChild(header);

        // Nested Row for Projects
        const projectsRow = document.createElement("div");
        projectsRow.className = "row g-4";

        // Render projects for this group
        grouped[key].forEach(project => {
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
    const query = (searchInput ? searchInput.value || "" : "").toLowerCase();
    const tag = tagFilter ? tagFilter.value : "";
    const lang = languageFilter ? languageFilter.value : "";
    const year = yearFilter ? yearFilter.value : "";
    const sort = sortSelect ? sortSelect.value : "name";

    // Show Clear Filters button when any filter (or search query) is active
    const hasActiveFilters = Boolean(tag || lang || year || query);
    if (filtersClearWrap) {
      filtersClearWrap.style.display = hasActiveFilters ? "block" : "none";
    }

    if (searchClearBtn) {
      searchClearBtn.style.display = query.length > 0 ? "flex" : "none";
    }

    let filtered = projects.filter(p => {
      const matchSearch = (p.title || "").toLowerCase().includes(query) || 
                          (p.description_short || "").toLowerCase().includes(query) ||
                          (p.description_long || "").toLowerCase().includes(query);
      const matchTag = tag ? p.tag === tag : true;
      const matchLang = lang ? p.language === lang : true;
      const matchYear = year ? p.release_year === year : true;
      return matchSearch && matchTag && matchLang && matchYear;
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
  if (languageFilter) languageFilter.addEventListener("change", filterAndSort);
  if (yearFilter) yearFilter.addEventListener("change", filterAndSort);
  if (sortSelect) sortSelect.addEventListener("change", filterAndSort);

  if (filtersClearBtn) {
    filtersClearBtn.addEventListener("click", () => {
      if (tagFilter) tagFilter.value = "";
      if (languageFilter) languageFilter.value = "";
      if (yearFilter) yearFilter.value = "";
      if (searchInput) searchInput.value = "";
      filterAndSort();
    });
  }

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

