import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMeta } from "../utils/pageMeta";

const setMetaTag = (attr, value, content) => {
  let tag = document.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

// Updates the document title + description/OG/Twitter meta tags on every
// public route change, so each page gets its own search snippet instead of
// every page sharing the same title (the default index.html only sets one).
const usePageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const { title, description } = getPageMeta(location.pathname);
    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
  }, [location.pathname]);
};

export default usePageMeta;
