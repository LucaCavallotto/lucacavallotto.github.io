import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CAROUSEL_AUTOPLAY_INTERVAL,
  CAROUSEL_DESKTOP_BREAKPOINT,
  CAROUSEL_RESUME_DELAY,
} from '../lib/constants.js';
import { useMediaQuery, usePrefersReducedMotion } from './useMediaQuery.js';

/**
 * Drives the featured-projects slider.
 *
 * The original version measured card widths with offsetWidth and parsed the
 * computed gap to build a pixel translate. Here the track is shifted by a
 * percentage of its own width instead, so it stays correct through resizes,
 * font loading and zoom without ever reading layout.
 *
 * @param {number} itemCount how many cards are in the track
 */
export function useCarousel(itemCount) {
  const isDesktop = useMediaQuery(`(min-width: ${CAROUSEL_DESKTOP_BREAKPOINT}px)`);
  const reducedMotion = usePrefersReducedMotion();

  const visibleCount = isDesktop ? 2 : 1;
  const maxIndex = Math.max(0, itemCount - visibleCount);
  const pageCount = maxIndex + 1;

  const [index, setIndex] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Set after a manual interaction, so autoplay does not fight the visitor.
  const [suspended, setSuspended] = useState(false);
  const resumeTimer = useRef(null);

  // Snap back to the first slide when the breakpoint changes the page count.
  useEffect(() => {
    setIndex(0);
  }, [visibleCount]);

  useEffect(() => () => clearTimeout(resumeTimer.current), []);

  const suspendAutoplay = useCallback(() => {
    setSuspended(true);
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setSuspended(false), CAROUSEL_RESUME_DELAY);
  }, []);

  const goTo = useCallback(
    (next, { fromUser = true } = {}) => {
      setIndex(Math.max(0, Math.min(next, maxIndex)));
      if (fromUser) suspendAutoplay();
    },
    [maxIndex, suspendAutoplay]
  );

  const next = useCallback(
    (options) => {
      setIndex((i) => (i < maxIndex ? i + 1 : 0));
      if (options?.fromUser !== false) suspendAutoplay();
    },
    [maxIndex, suspendAutoplay]
  );

  const prev = useCallback(
    (options) => {
      setIndex((i) => (i > 0 ? i - 1 : maxIndex));
      if (options?.fromUser !== false) suspendAutoplay();
    },
    [maxIndex, suspendAutoplay]
  );

  const autoplayRunning =
    !reducedMotion && !manuallyPaused && !hovered && !suspended && pageCount > 1;

  useEffect(() => {
    if (!autoplayRunning) return undefined;
    const timer = setInterval(() => {
      setIndex((i) => (i < maxIndex ? i + 1 : 0));
    }, CAROUSEL_AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [autoplayRunning, maxIndex]);

  // Percentage of the track width to shift per step: one card plus one gap.
  // Card widths are calc(50% - 0.5rem) on desktop and 100% on mobile.
  const step = isDesktop ? 'calc(50% + 0.5rem)' : 'calc(100% + 1rem)';
  const trackStyle = { transform: `translateX(calc(${-index} * ${step}))` };

  return {
    index,
    pageCount,
    visibleCount,
    trackStyle,
    goTo,
    next,
    prev,
    manuallyPaused,
    toggleManualPause: () => setManuallyPaused((p) => !p),
    hoverHandlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}
