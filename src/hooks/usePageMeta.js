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

const CANONICAL_ORIGIN = "https://fitnesszone.ltd";

// The apex domain 308-redirects www -> apex, but a redirect alone left
// Google treating the two as "duplicate without user-selected canonical"
// (confirmed in Search Console) instead of confidently indexing the apex
// version — an explicit canonical tag on every page is the stronger signal
// that actually resolves it. Recomputed on every route change so a deep
// link (e.g. /plans) canonicalizes to itself, not to whatever page loaded
// first.
const setCanonicalTag = (pathname) => {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", `${CANONICAL_ORIGIN}${pathname}`);
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
    setCanonicalTag(location.pathname);
  }, [location.pathname]);
};

export default usePageMeta;
