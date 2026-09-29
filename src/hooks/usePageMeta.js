import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageMeta, SITE_ORIGIN } from "../utils/pageMeta";

const setMetaTag = (attr, value, content) => {
  let tag = document.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

// The apex domain 308-redirects www -> apex, but a redirect alone left
// Google treating the two as "duplicate without user-selected canonical"
// (confirmed in Search Console) instead of confidently indexing the apex
// version — an explicit canonical tag on every page is the stronger signal
// that actually resolves it. The build already writes each page's HTML
// with its own canonical (vite.config.js); this keeps it right as the
// visitor moves between pages without a reload.
const setCanonicalTag = (pathname) => {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", `${SITE_ORIGIN}${pathname}`);
};

// Updates the document title, description, robots, canonical and OG/Twitter
// tags on every public route change, so each page gets its own search
// snippet — and the 404 page and account/payment screens stay out of
// search results (noindex) instead of being indexed as thin duplicates.
const usePageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const { title, description, noindex } = getPageMeta(location.pathname);
    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", `${SITE_ORIGIN}${location.pathname}`);
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setCanonicalTag(location.pathname);
  }, [location.pathname]);
};

export default usePageMeta;
