/**
 * Initializes the scroll reveal animation using Intersection Observer.
 */
export function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/**
 * Adds swipe support to an element for touch devices.
 * @param {HTMLElement} el - The element to add swipe support to.
 * @param {Function} onSwipeLeft - Callback for swipe left.
 * @param {Function} onSwipeRight - Callback for swipe right.
 */
export function addSwipeSupport(el, onSwipeLeft, onSwipeRight) {
  if (!el) return;
  let startX = null;
  el.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        if (onSwipeLeft) onSwipeLeft();
      } else {
        if (onSwipeRight) onSwipeRight();
      }
    }
    startX = null;
  }, { passive: true });
}
