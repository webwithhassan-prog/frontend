import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { pageMeta, SITE_ORIGIN } from "./src/utils/pageMeta.js";

const escapeAttr = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// index.html with one page's title, description, robots, canonical and
// social tags swapped in.
const withPageTags = (html, pathname, { title, description, noindex }) => {
  const url = `${SITE_ORIGIN}${pathname}`;
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  const swaps = [
    [/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`],
    [/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${d}" />`],
    [/<meta\s+name="robots"[\s\S]*?\/>/, `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}" />`],
    [/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`],
    [/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`],
    [/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${t}" />`],
    [/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${d}" />`],
    [/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${t}" />`],
    [/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${d}" />`],
  ];
  for (const [pattern, tag] of swaps) {
    if (!pattern.test(html)) {
      throw new Error(`seoPages: ${pattern} not found in index.html`);
    }
    html = html.replace(pattern, () => tag);
  }
  return html;
};

// Every URL used to get the same index.html — homepage title, description
// and canonical — until JavaScript ran. Google reads that raw HTML first,
// so /plans, /about etc. all declared themselves duplicates of the
// homepage and weren't indexed. This writes each page in pageMeta its own
// copy (e.g. dist/plans/index.html, which the host serves for /plans ahead
// of the catch-all rewrite) with its own tags already in place.
const seoPages = () => ({
  name: "seo-pages",
  apply: "build",
  enforce: "post",
  generateBundle(_, bundle) {
    const index = bundle["index.html"];
    if (!index) return;
    const base = String(index.source);
    index.source = withPageTags(base, "/", pageMeta["/"]);
    // The hero-banner data preload only helps the homepage; elsewhere it's
    // a wasted request (and a console warning) on every page load.
    const withoutHeroPreload = base.replace(
      /<link\s+rel="preload"\s+as="fetch"[^>]*hero-banners[^>]*\/>/,
      "",
    );
    for (const [pathname, meta] of Object.entries(pageMeta)) {
      if (pathname === "/") continue;
      this.emitFile({
        type: "asset",
        fileName: `${pathname.slice(1)}/index.html`,
        source: withPageTags(withoutHeroPreload, pathname, meta),
      });
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoPages(),
    VitePWA({
      registerType: "autoUpdate",
      // generateSW (the default) auto-writes the whole service worker with
      // no hook for custom event listeners — push notifications need
      // `push`/`notificationclick` handlers, so this hands precaching
      // control to our own src/sw.js instead (still gets the precache
      // manifest injected via self.__WB_MANIFEST).
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      // Precache only what push notifications need. Precaching the whole
      // build made every visitor download ~2MB up front — every admin page
      // and the PDF/Excel libraries included — and served pages from a cache
      // that could lag behind the live site. Pages and hashed assets now come
      // from the CDN, which browsers already cache for a year.
      injectManifest: {
        globPatterns: ["icon-192.png"],
      },
      includeManifestIcons: false,
      manifest: {
        name: "Fitness Zone",
        short_name: "Fitness Zone",
        description:
          "Dietplans and home workout sessions — built for women, all on one platform.",
        theme_color: "#12224a",
        background_color: "#12224a",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
