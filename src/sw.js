import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

// www.fitnesszone.ltd served the full site (and installed this worker) before
// it became a redirect to the apex domain. Those installed workers kept
// answering page loads from their own cache — so the redirect never fired and
// those visitors were stuck on an old build indefinitely, since browsers
// refuse to update a service worker through a redirect. When this script is
// served on www, it removes itself and its caches, then reloads open tabs so
// they reach the redirect and land on the current site.
const isRetiredOrigin = self.location.hostname === "www.fitnesszone.ltd";

if (isRetiredOrigin) {
  self.addEventListener("install", () => self.skipWaiting());
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
        await self.registration.unregister();
        const windows = await self.clients.matchAll({ type: "window" });
        windows.forEach((client) => client.navigate(client.url));
      })(),
    );
  });
} else {
  cleanupOutdatedCaches();
  precacheAndRoute(self.__WB_MANIFEST);
  clientsClaim();
  self.skipWaiting();

  self.addEventListener("push", (event) => {
    if (!event.data) return;
    const { title, body, url, tag } = event.data.json();
    event.waitUntil(
      self.registration.showNotification(title, {
        body,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag,
        data: { url },
      }),
    );
  });

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url || "/";
    event.waitUntil(
      self.clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientsList) => {
          const existing = clientsList[0];
          if (existing) {
            existing.navigate(url);
            return existing.focus();
          }
          return self.clients.openWindow(url);
        }),
    );
  });
}
