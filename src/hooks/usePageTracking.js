import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

// Tracks a page_view on every route change within the public site.
const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", location.pathname);
  }, [location.pathname]);
};

export default usePageTracking;
