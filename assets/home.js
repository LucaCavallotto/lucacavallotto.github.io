/* ===== home.js — Homepage logic ===== */

/* ─────────────────────────────────────────
   Custom slider state
───────────────────────────────────────── */
let sliderIndex  = 0;
let sliderCards  = [];
let sliderPaused = false;
let sliderTimer  = null;
let isManualPause = false;

const DESKTOP_BREAKPOINT = 641;
const AUTOPLAY_INTERVAL  = 5000;
const RESUME_DELAY       = 8000;

function visibleCount() {
  return window.innerWidth >= DESKTOP_BREAKPOINT ? 2 : 1;
}

function maxIndex() {
  return Math.max(0, sliderCards.length - visibleCount());
}

// ── move track to index ──
function goTo(idx, skipAnimation) {
  const track = document.getElementById("featured-carousel-inner");
  if (!track || !sliderCards.length) return;

  sliderIndex = Math.max(0, Math.min(idx, maxIndex()));

  const gapPx = parseFloat(getComputedStyle(track).gap) || 16;
  const cardW  = sliderCards[0].offsetWidth;
  const offset = sliderIndex * (cardW + gapPx);

  if (skipAnimation) track.style.transition = "none";
  track.style.transform = `translateX(-${offset}px)`;
  if (skipAnimation) { track.offsetHeight; track.style.transition = ""; }

  syncIndicators(sliderIndex);
}

function nextSlide() { goTo(sliderIndex < maxIndex() ? sliderIndex + 1 : 0); }
function prevSlide() { goTo(sliderIndex > 0 ? sliderIndex - 1 : maxIndex()); }

// ── autoplay ──
function startAutoplay()  { if (!sliderTimer) sliderTimer = setInterval(() => { if (!sliderPaused) nextSlide(); }, AUTOPLAY_INTERVAL); }
function stopAutoplay()   { clearInterval(sliderTimer); sliderTimer = null; }
function pauseAutoplay()  { sliderPaused = true;  stopAutoplay(); }
function resumeAutoplay() { 
  if (isManualPause) return;
  sliderPaused = false; 
  startAutoplay(); 
}

/* ─────────────────────────────────────────
   1. Project of the Day seed
───────────────────────────────────────── */
function getDailyIndex(count) {
  return Math.floor(Date.now() / 86_400_000) % count;
}

/* ─────────────────────────────────────────
   2. Build a project card element
───────────────────────────────────────── */
function buildCard(project, isAppOfDay) {
  const card = document.createElement("div");
  card.className = "carousel-project-card";

  // "Project of the Day" styling
  if (isAppOfDay) {
    card.classList.add("potd-card");
  }

  /* Header: icon + title */
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

  /* Description */
  const desc = document.createElement("p");
  desc.className = "carousel-card-desc";
  desc.textContent = project.description;
  card.appendChild(desc);

  /* Links */
  const links = document.createElement("div");
  links.className = "carousel-card-links";
  project.links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = link.text;
    if (link.text === "View on GitHub") a.className = "carousel-link-ghost";
    if (link.text === "Try it Live")    a.className = "carousel-link-primary";
    links.appendChild(a);
  });
  card.appendChild(links);

  return card;
}

/* ─────────────────────────────────────────
   3. Indicators — count = maxIndex() + 1
      so only valid positions get a dot
───────────────────────────────────────── */
function buildIndicators() {
  const wrap = document.getElementById("carousel-indicators");
  if (!wrap) return;

  const count = maxIndex() + 1;   // e.g. 2 on desktop, 3 on mobile
  wrap.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("aria-label", `Slide ${i + 1}`);
    if (i === 0) { btn.classList.add("active"); btn.setAttribute("aria-current", "true"); }
    btn.addEventListener("click", () => {
      goTo(i);
      pauseAutoplay();
      setTimeout(resumeAutoplay, RESUME_DELAY);
    });
    wrap.appendChild(btn);
  }
}

function syncIndicators(activeIdx) {
  const wrap = document.getElementById("carousel-indicators");
  if (!wrap) return;
  wrap.querySelectorAll("button").forEach((btn, i) => {
    const on = i === activeIdx;
    btn.classList.toggle("active", on);
    if (on) btn.setAttribute("aria-current", "true");
    else     btn.removeAttribute("aria-current");
  });
}

/* ─────────────────────────────────────────
   4. Touch-swipe
───────────────────────────────────────── */
function addSwipeSupport(el) {
  let startX = null;
  el.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend",   (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? nextSlide() : prevSlide();
      pauseAutoplay();
      setTimeout(resumeAutoplay, RESUME_DELAY);
    }
    startX = null;
  }, { passive: true });
}

/* ─────────────────────────────────────────
   5. Populate slider from projects.json
───────────────────────────────────────── */
async function initCarousel() {
  const track = document.getElementById("featured-carousel-inner");
  if (!track) return;

  try {
    const projects = await fetch("projects.json").then((r) => r.json());

    const todayIdx = getDailyIndex(projects.length);
    const others   = projects.filter((_, i) => i !== todayIdx);
    const featured = [projects[todayIdx], ...others.slice(0, 3)];

    featured.forEach((project, idx) => {
      const card = buildCard(project, idx === 0);
      track.appendChild(card);
      sliderCards.push(card);
    });

    // Build indicators for the current viewport
    buildIndicators();

    // Buttons
    document.getElementById("carousel-prev")?.addEventListener("click", () => {
      prevSlide(); pauseAutoplay(); setTimeout(resumeAutoplay, RESUME_DELAY);
    });
    document.getElementById("carousel-next")?.addEventListener("click", () => {
      nextSlide(); pauseAutoplay(); setTimeout(resumeAutoplay, RESUME_DELAY);
    });

    // pause on hover
    const section = track.closest(".home-section") || track;
    section.addEventListener("mouseenter", pauseAutoplay);
    section.addEventListener("mouseleave", resumeAutoplay);
    
    // Play/Pause button
    document.getElementById("carousel-play-pause")?.addEventListener("click", () => {
      isManualPause = !isManualPause;
      const icon = document.getElementById("play-pause-icon");
      if (isManualPause) {
        pauseAutoplay();
        if (icon) icon.textContent = "▶"; // Play icon
      } else {
        resumeAutoplay();
        if (icon) icon.textContent = "⏸"; // Pause icon
      }
    });

    // Swipe
    addSwipeSupport(document.getElementById("featuredCarousel"));

    // On breakpoint change: reset position + rebuild indicators
    let lastVisible = visibleCount();
    window.addEventListener("resize", () => {
      const now = visibleCount();
      if (now !== lastVisible) {
        lastVisible = now;
        sliderIndex = 0;
        buildIndicators();   // correct dot count for new breakpoint
        goTo(0, true);       // snap without animation
      }
    });

    startAutoplay();

  } catch (err) {
    console.error("Failed to load projects:", err);
  }
}

/* ─────────────────────────────────────────
   6. Intersection Observer — reveal
───────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); observer.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────
   7. Boot
───────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  initReveal();
});
