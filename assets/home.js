/* ===== home.js — Homepage logic ===== */

// -------------------------------------------------------------------
// 1. Project of the Day  (deterministic daily seed)
// -------------------------------------------------------------------
function getDailyIndex(count) {
  const day = Math.floor(Date.now() / 86_400_000);
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
// 3. Build indicator dots for a given container
// -------------------------------------------------------------------
function buildIndicators(container, count) {
  container.innerHTML = "";
  for (let idx = 0; idx < count; idx++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.bsTarget = "#featuredCarousel";
    btn.dataset.bsSlideTo = String(idx);
    btn.setAttribute("aria-label", `Slide ${idx + 1}`);
    if (idx === 0) {
      btn.classList.add("active");
      btn.setAttribute("aria-current", "true");
    }
    container.appendChild(btn);
  }
}

// -------------------------------------------------------------------
// 4. Sync indicator dots to the active index
// -------------------------------------------------------------------
function syncIndicators(activeIdx) {
  const wrap = document.getElementById("carousel-indicators");
  if (!wrap) return;
  wrap.querySelectorAll("button").forEach((btn, i) => {
    btn.classList.toggle("active", i === activeIdx);
    if (i === activeIdx) btn.setAttribute("aria-current", "true");
    else btn.removeAttribute("aria-current");
  });
}

// -------------------------------------------------------------------
// 5. Autoplay controller
// -------------------------------------------------------------------
function createAutoplay(carouselEl, intervalMs) {
  let timer = null;
  let paused = false;

  function getBS() {
    return bootstrap.Carousel.getInstance(carouselEl);
  }

  function tick() {
    if (paused) return;
    const bs = getBS();
    if (bs) bs.next();
  }

  function start() {
    if (timer) return;
    timer = setInterval(tick, intervalMs);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function pause() {
    paused = true;
    stop();
  }

  function resume() {
    paused = false;
    start();
  }

  return { start, stop, pause, resume };
}

// -------------------------------------------------------------------
// 6. Touch-swipe helper
// -------------------------------------------------------------------
function addSwipeSupport(el, onPrev, onNext) {
  let startX = null;

  el.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  el.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? onNext() : onPrev();
    }
    startX = null;
  }, { passive: true });
}

// -------------------------------------------------------------------
// 7. Populate carousel from projects.json
// -------------------------------------------------------------------
async function initCarousel() {
  const carouselInner = document.getElementById("featured-carousel-inner");
  if (!carouselInner) return;

  try {
    const res = await fetch("projects.json");
    const projects = await res.json();

    const todayIdx = getDailyIndex(projects.length);
    const appOfDay = projects[todayIdx];
    const others = projects.filter((_, i) => i !== todayIdx);
    const featured = [appOfDay, ...others.slice(0, 2)];

    featured.forEach((project, idx) => {
      carouselInner.appendChild(buildCarouselItem(project, idx === 0, idx === 0));
    });

    // Indicators
    const indicatorWrap = document.getElementById("carousel-indicators");
    if (indicatorWrap) buildIndicators(indicatorWrap, featured.length);

    // Bootstrap instance (no built-in interval)
    const carouselEl = document.getElementById("featuredCarousel");
    const bsCarousel = new bootstrap.Carousel(carouselEl, {
      interval: false,
      ride: false,
    });

    // ── Autoplay ──
    const autoplay = createAutoplay(carouselEl, 5000);
    autoplay.start();

    // Pause on hover over the whole section block
    const section = carouselEl.closest(".home-section") || carouselEl;
    section.addEventListener("mouseenter", () => autoplay.pause());
    section.addEventListener("mouseleave", () => autoplay.resume());

    // Pause on manual button click, resume after 8 s
    const ctaArrows = document.querySelector(".carousel-cta-arrows");
    if (ctaArrows) {
      ctaArrows.addEventListener("click", () => {
        autoplay.pause();
        setTimeout(() => autoplay.resume(), 8000);
      });
    }

    // Sync dots on slide event
    carouselEl.addEventListener("slide.bs.carousel", (e) => syncIndicators(e.to));

    // Touch-swipe on the card area
    addSwipeSupport(
      carouselEl,
      () => { bsCarousel.prev(); autoplay.pause(); setTimeout(() => autoplay.resume(), 8000); },
      () => { bsCarousel.next(); autoplay.pause(); setTimeout(() => autoplay.resume(), 8000); }
    );

  } catch (err) {
    console.error("Failed to load projects:", err);
  }
}

// -------------------------------------------------------------------
// 8. Intersection Observer — reveal animations
// -------------------------------------------------------------------
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

// -------------------------------------------------------------------
// 9. Boot
// -------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initReveal();
});
