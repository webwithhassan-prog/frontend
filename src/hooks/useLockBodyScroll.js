import { useEffect } from "react";

// Freezes the page behind an open overlay (menu, modal, popup) so a swipe
// inside it can't scroll the page underneath. Counted, because overlays can
// stack — the mobile menu and a modal each unlocking on close would
// otherwise let the first one to close re-enable scrolling under the other.
let lockCount = 0;

const lock = () => {
  if (lockCount++ > 0) return;
  // Hiding the scrollbar widens the page; pad by its width so desktop
  // layouts don't jump sideways when an overlay opens.
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
};

const unlock = () => {
  if (--lockCount > 0) return;
  lockCount = 0;
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

const useLockBodyScroll = (active) => {
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active]);
};

export default useLockBodyScroll;
