import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// A tab opened before a deploy still references the previous build's
// lazy-route chunks, which no longer exist — reload once to pick up the
// new build instead of leaving a blank page. The timestamp guard stops a
// reload loop if the chunk is genuinely unavailable.
window.addEventListener("vite:preloadError", (event) => {
  const lastReload = Number(sessionStorage.getItem("fz-chunk-reload") || 0);
  if (Date.now() - lastReload < 10000) return;
  event.preventDefault();
  sessionStorage.setItem("fz-chunk-reload", String(Date.now()));
  window.location.reload();
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
