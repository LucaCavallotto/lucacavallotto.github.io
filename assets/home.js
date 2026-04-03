/* ===== home.js — Homepage logic ===== */

// -------------------------------------------------------------------
// 1. Project of the Day  (deterministic daily seed)
// -------------------------------------------------------------------
function getDailyIndex(count) {
  const day = Math.floor(Date.now() / 86_400_000); // unique int per day
  return day % count;
}

// -------------------------------------------------------------------
// 2. Build a carousel card element from a project object
// -------------------------------------------------------------------
function buildCarouselItem(project, isFirst, isAppOfDay) {
  const item = document.createElement("div");
  item.className = "carousel-item" + (isFirst ? " active" : "");

  const card = document.createElement("div");
  card.className = "carousel-project-card";

  const header = document.createElement("div");
  header.className = "carousel-card-header";

  const title = document.createElement("h2");
  title.className = "carousel-card-title";
  title.textContent = project.title;
  header.appendChild(title);

  if (isAppOfDay) {
    const eyebrow = document.createElement("div");
    eyebrow.className = "carousel-eyebrow";
    eyebrow.textContent = "👑 Project of the Day";
    header.appendChild(eyebrow);
  }
  card.appendChild(header);

  const desc = document.createElement("p");
  desc.className = "carousel-card-desc";
  desc.textContent = project.description;

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

  card.appendChild(desc);
  card.appendChild(links);
  item.appendChild(card);
  return item;
}

// -------------------------------------------------------------------
// 3. Populate carousel from projects.json
// -------------------------------------------------------------------
async function initCarousel() {
  const carouselInner = document.getElementById("featured-carousel-inner");
  if (!carouselInner) return;

  try {
    const res = await fetch("projects.json");
    const projects = await res.json();

    const todayIdx = getDailyIndex(projects.length);
    const appOfDay = projects[todayIdx];

    // Pick 2 other distinct projects
    const others = projects.filter((_, i) => i !== todayIdx);
    // Always show exactly 2 others (or fewer if not enough projects)
    const featured = [appOfDay, ...others.slice(0, 2)];

    featured.forEach((project, idx) => {
      const isAppOfDay = idx === 0;
      const item = buildCarouselItem(project, idx === 0, isAppOfDay);
      carouselInner.appendChild(item);
    });

    // Build indicator buttons now that we know count
    const indicatorWrap = document.getElementById("carousel-indicators");
    if (indicatorWrap) {
      featured.forEach((_, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.bsTarget = "#featuredCarousel";
        btn.dataset.bsSlideTo = String(idx);
        btn.setAttribute("aria-label", `Slide ${idx + 1}`);
        if (idx === 0) {
          btn.classList.add("active");
          btn.setAttribute("aria-current", "true");
        }
        indicatorWrap.appendChild(btn);
      });
    }
  } catch (err) {
    console.error("Failed to load projects:", err);
  }
}

// -------------------------------------------------------------------
// 4. Intersection Observer — reveal animations
// -------------------------------------------------------------------
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// -------------------------------------------------------------------
// 5. Boot
// -------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initReveal();
});
