import { addSwipeSupport } from './ui.js';
import { buildProjectCard } from './components.js';

/**
 * Initializes the project carousel/slider.
 * @param {any[]} projects - Array of project objects.
 */
export function initCarousel(projects) {
  const track = document.getElementById("featured-carousel-inner");
  if (!track || !projects || projects.length === 0) return;

  let sliderIndex = 0;
  let sliderCards = [];
  let sliderPaused = false;
  let sliderTimer = null;
  let isManualPause = false;

  const DESKTOP_BREAKPOINT = 641;
  const AUTOPLAY_INTERVAL = 3000;
  const RESUME_DELAY = 5000;

  function visibleCount() {
    return window.innerWidth >= DESKTOP_BREAKPOINT ? 2 : 1;
  }

  function maxIndex() {
    return Math.max(0, sliderCards.length - visibleCount());
  }

  function goTo(idx, skipAnimation) {
    if (!track || !sliderCards.length) return;
    sliderIndex = Math.max(0, Math.min(idx, maxIndex()));

    const gapPx = parseFloat(getComputedStyle(track).gap) || 16;
    const cardW = sliderCards[0].offsetWidth;
    const offset = sliderIndex * (cardW + gapPx);

    if (skipAnimation) track.style.transition = "none";
    track.style.transform = `translateX(-${offset}px)`;
    if (skipAnimation) { track.offsetHeight; track.style.transition = ""; }

    syncIndicators(sliderIndex);
  }

  function nextSlide() { goTo(sliderIndex < maxIndex() ? sliderIndex + 1 : 0); }
  function prevSlide() { goTo(sliderIndex > 0 ? sliderIndex - 1 : maxIndex()); }

  function startAutoplay() { if (!sliderTimer) sliderTimer = setInterval(() => { if (!sliderPaused) nextSlide(); }, AUTOPLAY_INTERVAL); }
  function stopAutoplay() { clearInterval(sliderTimer); sliderTimer = null; }
  function pauseAutoplay() { sliderPaused = true; stopAutoplay(); }
  function resumeAutoplay() {
    if (isManualPause) return;
    sliderPaused = false;
    startAutoplay();
  }

  function buildIndicators() {
    const wrap = document.getElementById("carousel-indicators");
    if (!wrap) return;

    const count = maxIndex() + 1;
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
      else btn.removeAttribute("aria-current");
    });
  }

  // Helper to deterministically shuffle an array based on a seed (e.g. current day)
  function seededShuffle(array, seed) {
    const arr = [...array];
    let s = seed;
    for (let i = arr.length - 1; i > 0; i--) {
      const x = Math.sin(s++) * 10000;
      const randomVal = x - Math.floor(x);
      const j = Math.floor(randomVal * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Populate: Project of the Day & Featured Projects are deterministically
  // selected based on today's date, staying stable for 24h across all devices.
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const todayIdx = dayIndex % projects.length;
  const potdProject = projects[todayIdx];
  const others = projects.filter((_, i) => i !== todayIdx);
  const featured = seededShuffle(others, dayIndex).slice(0, 4);

  const potdContainer = document.getElementById("project-of-the-day-container");
  if (potdContainer && potdProject) {
    potdContainer.innerHTML = "";
    potdContainer.appendChild(buildProjectCard(potdProject, true));
  }

  featured.forEach((project) => {
    const card = buildProjectCard(project, false);
    track.appendChild(card);
    sliderCards.push(card);
  });


  buildIndicators();

  document.getElementById("carousel-prev")?.addEventListener("click", () => {
    prevSlide(); pauseAutoplay(); setTimeout(resumeAutoplay, RESUME_DELAY);
  });
  document.getElementById("carousel-next")?.addEventListener("click", () => {
    nextSlide(); pauseAutoplay(); setTimeout(resumeAutoplay, RESUME_DELAY);
  });

  const section = track.closest(".home-section") || track;
  section.addEventListener("mouseenter", pauseAutoplay);
  section.addEventListener("mouseleave", resumeAutoplay);

  document.getElementById("carousel-play-pause")?.addEventListener("click", () => {
    isManualPause = !isManualPause;
    const icon = document.getElementById("play-pause-icon");
    if (isManualPause) {
      pauseAutoplay();
      if (icon) icon.innerHTML = '<i class="bi bi-play-fill"></i>';
    } else {
      resumeAutoplay();
      if (icon) icon.innerHTML = '<i class="bi bi-pause"></i>';
    }
  });

  addSwipeSupport(document.getElementById("featuredCarousel"), nextSlide, prevSlide);

  let lastVisible = visibleCount();
  window.addEventListener("resize", () => {
    const now = visibleCount();
    if (now !== lastVisible) {
      lastVisible = now;
      sliderIndex = 0;
      buildIndicators();
      goTo(0, true);
    }
  });

  startAutoplay();
}
