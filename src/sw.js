import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

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
