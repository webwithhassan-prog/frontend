// "Install the app" support. Chrome/Edge/Samsung Internet fire
// beforeinstallprompt once the site qualifies (manifest + service worker —
// see vite.config.js); it's kept here so a button can show the install
// dialog later. iPhones have no such event: Safari installs only through
// Share → Add to Home Screen, so the UI shows those steps instead.
// Imported from main.jsx so the event is caught however early it fires.

let deferredPrompt = null;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // our own button replaces the browser's mini-bar
    deferredPrompt = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notify();
  });
}

// Already running as the installed app.
export const isInstalled = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

export const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

export const canPromptInstall = () => !!deferredPrompt;

// Shows the browser's install dialog: "accepted", "dismissed" or
// "unavailable".
export const promptInstall = async () => {
  if (!deferredPrompt) return "unavailable";
  const prompt = deferredPrompt;
  deferredPrompt = null;
  prompt.prompt();
  const { outcome } = await prompt.userChoice;
  notify();
  return outcome;
};

export const onInstallChange = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
