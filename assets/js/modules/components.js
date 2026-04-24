/**
 * Builds a project card element.
 * @param {any} project - Project data.
 * @param {boolean} isAppOfDay - Whether this is the project of the day.
 * @returns {HTMLElement}
 */
export function buildProjectCard(project, isAppOfDay) {
  const card = document.createElement("div");
  card.className = "carousel-project-card";
  if (isAppOfDay) card.classList.add("potd-card");

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
  card.appendChild(header);

  const desc = document.createElement("p");
  desc.className = "carousel-card-desc";
  desc.textContent = project.description;
  card.appendChild(desc);

  const links = document.createElement("div");
  links.className = "carousel-card-links";
  project.links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = link.text;
    if (link.text === "View on GitHub") a.className = "carousel-link-ghost";
    if (link.text === "Try it Live") a.className = "carousel-link-primary";
    links.appendChild(a);
  });
  card.appendChild(links);

  return card;
}
