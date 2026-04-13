/* ===== projects.js — Projects page ===== */

document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.querySelector(".projects-grid");
  if (!projectsGrid) return;

  fetch("projects.json")
    .then((r) => r.json())
    .then((projects) => {
      projectsGrid.innerHTML = "";

      const getDailyIndex = (count) => Math.floor(Date.now() / 86_400_000) % count;
      const todayIdx = getDailyIndex(projects.length);

      projects.forEach((project, idx) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-12 col-lg-6";

        // Use the exact same card class as the carousel
        const cardDiv = document.createElement("div");
        cardDiv.className = "carousel-project-card";
        if (idx === todayIdx) {
          cardDiv.classList.add("potd-card");
        }

        /* ── Header: icon + title ── */
        const header = document.createElement("div");
        header.className = "carousel-card-header";

        const iconWrap = document.createElement("div");
        iconWrap.className = "card-icon-wrap";

        const iconEl = document.createElement("div");
        iconEl.className = "card-icon";
        iconEl.textContent = project.icon || "📁";
        iconWrap.appendChild(iconEl);

        const title = document.createElement("h2");
        title.className = "carousel-card-title";
        title.textContent = project.title;

        header.appendChild(iconWrap);
        header.appendChild(title);
        cardDiv.appendChild(header);

        /* ── Description ── */
        const p = document.createElement("p");
        p.className = "carousel-card-desc";
        p.textContent = project.description;
        cardDiv.appendChild(p);

        /* ── Links ── */
        const linksDiv = document.createElement("div");
        linksDiv.className = "carousel-card-links";

        project.links.forEach((link) => {
          const a = document.createElement("a");
          a.href = link.url;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = link.text;
          if (link.text === "View on GitHub") a.className = "carousel-link-ghost";
          if (link.text === "Try it Live") a.className = "carousel-link-primary";
          linksDiv.appendChild(a);
        });

        cardDiv.appendChild(linksDiv);
        colDiv.appendChild(cardDiv);
        projectsGrid.appendChild(colDiv);
      });
    })
    .catch((err) => console.error("Error fetching projects:", err));
});
