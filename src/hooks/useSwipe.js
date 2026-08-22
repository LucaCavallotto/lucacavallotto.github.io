import { useRef } from 'react';

const SWIPE_THRESHOLD = 40;

/**
 * Returns touch handlers that fire on a horizontal swipe.
 * @param {() => void} onSwipeLeft
 * @param {() => void} onSwipeRight
 */
export function useSwipe(onSwipeLeft, onSwipeRight) {
  const startX = useRef(null);

  return {
    onTouchStart: (e) => {
      startX.current = e.touches[0].clientX;
    },
    onTouchEnd: (e) => {
      if (startX.current === null) return;
      const dx = e.changedTouches[0].clientX - startX.current;
      startX.current = null;
      if (Math.abs(dx) <= SWIPE_THRESHOLD) return;
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    },
  };
}
