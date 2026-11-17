import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A first page view used to make a dozen separate requests for public data
// (settings, prices, rates, banners…), each costing a connection setup plus
// a round trip to the server — about half a second from Pakistan. The
// server bundles them (GET /public/bootstrap); the first request for each
// part below is answered from that bundle, later ones go to the server as
// usual. If the bundle fails, every request simply goes to the server.
const BOOTSTRAP_PARTS = {
  "/settings": "settings",
  "/offers/public": "offers",
  "/plans/public": "plans",
  "/hero-banners/public": "heroBanners",
  "/testimonials/public": "testimonials",
  "/reviews/public": "reviews",
  "/demo-videos/public": "demoVideos",
  "/daily-logs/recent-activity": "recentActivity",
  "/currency/rates": "rates",
  "/currency/detect": "detect",
  "/manual-payment-methods/public": "paymentMethods",
};

let bootstrap = null;
const servedFromBootstrap = new Set();

const loadBootstrap = () => {
  if (!bootstrap) {
    let tz;
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
    } catch {
      tz = undefined;
    }
    bootstrap = axios
      .get(`${import.meta.env.VITE_API_URL}/public/bootstrap`, {
        params: { tz },
        timeout: 8000,
      })
      .then((res) => res.data)
      .catch(() => null);
  }
  return bootstrap;
};

api.interceptors.request.use(async (config) => {
  if ((config.method || "get") !== "get") return config;
  const key = BOOTSTRAP_PARTS[config.url];
  if (!key || servedFromBootstrap.has(config.url)) return config;

  const data = await loadBootstrap();
  let part = data?.[key];
  // Local payment methods are bundled for the detected country only.
  if (key === "paymentMethods") {
    part =
      part && part.country === config.params?.country ? part.methods : undefined;
  }
  if (part === undefined || part === null) return config;

  servedFromBootstrap.add(config.url);
  config.adapter = () =>
    Promise.resolve({
      data: part,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    });
  return config;
});

// Any authenticated request can come back 401 once a token stops being
// valid — it naturally expires after 30 days (see generateToken), or the
// account no longer exists. Without this, the app just keeps quietly
// failing every request instead of sending the user back to log in.
// Banned is its own 403 case, handled the same way but with its own message.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const hadToken = !!localStorage.getItem("token");
    // On a dashboard page with no token left (logged out in another tab),
    // every action failed with "Not authorized, no token" and the page
    // stayed put — send them to log in instead.
    const onDashboard = /^\/(client|admin)(\/|$)/.test(window.location.pathname);

    if (
      (hadToken || onDashboard) &&
      (status === 401 || err.response?.data?.banned)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("client_id");
      toast.error(
        err.response?.data?.banned
          ? err.response.data.message
          : "Your session has expired — please log in again.",
      );
      // A full navigation unloads the page almost immediately — delay it
      // long enough that a real person actually sees and reads the toast
      // above before landing on Login.
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    }
    return Promise.reject(err);
  },
);

export default api;
