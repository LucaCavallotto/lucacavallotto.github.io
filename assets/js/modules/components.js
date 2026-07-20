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

  if (project.tag) {
    const tagEl = document.createElement("span");
    tagEl.className = "carousel-card-tag";
    tagEl.textContent = project.tag;
    card.appendChild(tagEl);
  }

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

/**
 * Builds the Technical Skills card.
 * @param {any[]} categories - List of skill categories.
 * @returns {HTMLElement}
 */
export function buildTechnicalSkillsCard(categories) {
  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = "Technical Skills";
  card.appendChild(title);

  categories.forEach((cat) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "skill-category";
    categoryDiv.textContent = cat.category;
    card.appendChild(categoryDiv);

    const pillsDiv = document.createElement("div");
    pillsDiv.className = "pills";

    cat.skills.forEach((skill) => {
      const a = document.createElement("a");
      a.href = skill.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "pill";
      a.textContent = skill.name;
      pillsDiv.appendChild(a);
    });

    card.appendChild(pillsDiv);
  });

  return card;
}

/**
 * Builds the Education card.
 * @param {any[]} educationList - List of education entries.
 * @returns {HTMLElement}
 */
export function buildEducationCard(educationList) {
  const card = document.createElement("div");
  card.className = "card h-100";

  const title = document.createElement("h2");
  title.textContent = "Education";
  card.appendChild(title);

  const ul = document.createElement("ul");

  educationList.forEach((edu) => {
    const li = document.createElement("li");

    const strong = document.createElement("strong");
    strong.textContent = edu.degree;
    li.appendChild(strong);

    li.appendChild(document.createTextNode(" - "));

    const institutionText = document.createTextNode(`${edu.institution} (${edu.period})`);
    li.appendChild(institutionText);

    li.appendChild(document.createElement("br"));

    const small = document.createElement("small");
    small.className = "text-muted";
    small.innerHTML = edu.details; // details may contain HTML tags (like <br>)
    li.appendChild(small);

    ul.appendChild(li);
  });

  card.appendChild(ul);
  return card;
}

/**
 * Builds the Experience card.
 * @param {any[]} experienceList - List of experience entries.
 * @returns {HTMLElement}
 */
export function buildExperienceCard(experienceList) {
  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h2");
  title.textContent = "Experience";
  card.appendChild(title);

  const ul = document.createElement("ul");

  experienceList.forEach((exp) => {
    const li = document.createElement("li");

    const strong = document.createElement("strong");
    strong.textContent = exp.role;
    li.appendChild(strong);

    li.appendChild(document.createTextNode(" - "));

    const companyText = document.createTextNode(`${exp.company} (${exp.period})`);
    li.appendChild(companyText);

    li.appendChild(document.createElement("br"));

    const small = document.createElement("small");
    small.className = "text-muted";
    small.innerHTML = exp.details;
    li.appendChild(small);

    ul.appendChild(li);
  });

  card.appendChild(ul);
  return card;
}

/**
 * Builds the Languages card.
 * @param {any[]} languagesList - List of language entries.
 * @returns {HTMLElement}
 */
export function buildLanguagesCard(languagesList) {
  const card = document.createElement("div");
  card.className = "card mt-3";

  const title = document.createElement("h2");
  title.textContent = "Languages";
  card.appendChild(title);

  const ul = document.createElement("ul");

  languagesList.forEach((lang) => {
    const li = document.createElement("li");

    const strong = document.createElement("strong");
    strong.textContent = lang.name;
    li.appendChild(strong);

    li.appendChild(document.createTextNode(` ${lang.level}`));

    ul.appendChild(li);
  });

  card.appendChild(ul);
  return card;
}

/**
 * Builds the Interests card.
 * @param {any[]} interestsList - List of interest entries.
 * @returns {HTMLElement}
 */
export function buildInterestsCard(interestsList) {
  const card = document.createElement("div");
  card.className = "card mt-3";

  const title = document.createElement("h2");
  title.textContent = "Interests";
  card.appendChild(title);

  const ul = document.createElement("ul");

  interestsList.forEach((interest) => {
    const li = document.createElement("li");

    const strong = document.createElement("strong");
    strong.textContent = interest.name;
    li.appendChild(strong);

    if (interest.details) {
      li.appendChild(document.createTextNode(" "));
      const small = document.createElement("small");
      small.className = "text-muted";
      small.textContent = `(${interest.details})`;
      li.appendChild(small);
    }

    ul.appendChild(li);
  });

  card.appendChild(ul);
  return card;
}

