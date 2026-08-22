import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const isDetailRoute = (path) => path.startsWith('/project/');

/**
 * Scrolls to the top on navigation, except when coming back from a project
 * detail page — there the previous list position is restored, so a visitor who
 * opened the tenth card does not land back at the top of the grid.
 */
export function useScrollRestoration() {
  const { pathname } = useLocation();
  const positions = useRef(new Map());
  const previousPath = useRef(null);

  // Record the live scroll position for the route currently on screen.
  useEffect(() => {
    const onScroll = () => positions.current.set(pathname, window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useLayoutEffect(() => {
    const returningFromDetail = previousPath.current !== null && isDetailRoute(previousPath.current);
    const saved = positions.current.get(pathname);

    if (returningFromDetail && !isDetailRoute(pathname) && saved != null) {
      window.scrollTo(0, saved);
    } else {
      window.scrollTo(0, 0);
    }

    previousPath.current = pathname;
  }, [pathname]);
}
