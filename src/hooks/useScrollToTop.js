import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll position of each in-app history entry, so Back/Forward land where
// the visitor left off instead of at the top.
const positions = new Map();

const GIVE_UP_MS = 2000;

// Pages are often still loading (lazy chunk, API data) right after a route
// change, so the element or page height a scroll needs may not exist yet.
// Retries each frame until `attempt` succeeds, and stops early if the
// visitor starts scrolling themselves.
const retryUntil = (attempt) => {
  const start = performance.now();
  let frame;
  const stopEvents = ["wheel", "touchstart", "keydown"];
  const stop = () => {
    cancelAnimationFrame(frame);
    stopEvents.forEach((e) => window.removeEventListener(e, stop));
  };
  stopEvents.forEach((e) => window.addEventListener(e, stop, { passive: true }));
  const tick = () => {
    if (attempt() || performance.now() - start > GIVE_UP_MS) return stop();
    frame = requestAnimationFrame(tick);
  };
  tick();
  return stop;
};

const scrollToHash = (hash) => {
  const id = decodeURIComponent(hash.slice(1));
  return retryUntil(() => {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView();
    return true;
  });
};

// React Router doesn't manage scroll on navigation. This:
// - scrolls to the top when moving to a different page (a link clicked
//   while scrolled down would otherwise land mid-page),
// - leaves the position alone when only the query changes (e.g. the
//   packages page's type tabs),
// - scrolls to #anchors once the target has rendered,
// - restores the previous position on Back/Forward.
// The very first render is left to the browser, which already opens new
// pages at the top and restores position when a visitor comes back.
const useScrollToTop = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const keyRef = useRef(location.key);
  const pathnameRef = useRef(null);

  useEffect(() => {
    const save = () => positions.set(keyRef.current, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  // Layout effect: the new page is in the DOM but not yet painted, so the
  // key switches before any scroll event from the page-height change can
  // record a clamped position against the page being left.
  useLayoutEffect(() => {
    keyRef.current = location.key;
    const isFirstRender = pathnameRef.current === null;
    const pathnameChanged = pathnameRef.current !== location.pathname;
    pathnameRef.current = location.pathname;

    if (location.hash) return scrollToHash(location.hash);
    if (isFirstRender) return;

    if (navigationType === "POP") {
      const saved = positions.get(location.key);
      if (saved !== undefined) {
        return retryUntil(() => {
          window.scrollTo(0, saved);
          return Math.abs(window.scrollY - saved) < 2;
        });
      }
    }
    if (pathnameChanged) window.scrollTo(0, 0);
  }, [location.key, location.pathname, location.hash, navigationType]);
};

export default useScrollToTop;
