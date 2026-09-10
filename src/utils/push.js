import api from "../services/api";

// pushManager.subscribe() needs the VAPID public key as a raw Uint8Array,
// not the base64url string it's distributed as.
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const getPushStatus = () => {
  if (
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !import.meta.env.VITE_VAPID_PUBLIC_KEY
  ) {
    return "unsupported";
  }
  return Notification.permission; // "default" | "granted" | "denied"
};

export const subscribeToPush = async (clientId) => {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      import.meta.env.VITE_VAPID_PUBLIC_KEY,
    ),
  });

  await api.post(`/clients/${clientId}/push-subscription`, {
    subscription: subscription.toJSON(),
  });
  return "granted";
};

export const unsubscribeFromPush = async (clientId) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  await subscription.unsubscribe();
  await api.delete(`/clients/${clientId}/push-subscription`, {
    data: { endpoint: subscription.endpoint },
  });
};
