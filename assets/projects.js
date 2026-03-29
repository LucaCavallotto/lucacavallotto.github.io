document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.querySelector(".projects-grid");

  if (projectsGrid) {
    fetch("projects.json")
      .then((response) => response.json())
      .then((projects) => {
        // Clear the static entries if any
        projectsGrid.innerHTML = "";
        
        projects.forEach((project) => {
          const colDiv = document.createElement("div");
          colDiv.className = "col-12 col-lg-6";

          const cardDiv = document.createElement("div");
          cardDiv.className = "card project-card";

          const h2 = document.createElement("h2");
          h2.textContent = project.title;

          const p = document.createElement("p");
          p.className = "mb-3";
          p.textContent = project.description;

          const linksDiv = document.createElement("div");

          project.links.forEach((link) => {
            const a = document.createElement("a");
            a.href = link.url;
            a.target = "_blank";
            a.rel = "noopener";
            if (link.class) {
              a.className = link.class;
            }
            a.textContent = link.text;
            linksDiv.appendChild(a);
            // Append a space if there are multiple links for proper spacing, although margins handles it.
          });

          cardDiv.appendChild(h2);
          cardDiv.appendChild(p);
          cardDiv.appendChild(linksDiv);
          colDiv.appendChild(cardDiv);
          projectsGrid.appendChild(colDiv);
        });
      })
      .catch((error) => console.error("Error fetching projects:", error));
  }
});
