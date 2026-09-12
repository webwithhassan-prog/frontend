import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
