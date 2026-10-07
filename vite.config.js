import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
// Per-page HTML, structured data, crawler-readable content, llms.txt,
// sitemap and 404 page — see seo/build.js.
import { seoPages } from "./seo/build.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    seoPages(),
    VitePWA({
      registerType: "autoUpdate",
      // The service-worker registration script was a render-blocking
      // <script> in <head>; deferred, it waits until the page has parsed.
      injectRegister: "script-defer",
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
