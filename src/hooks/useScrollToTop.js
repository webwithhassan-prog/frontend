import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation — without this,
// clicking a link while scrolled down (e.g. a footer link, or the
// guest-signup redirect from a pricing page) lands on the new page still
// scrolled to wherever the previous page left off.
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};

export default useScrollToTop;
