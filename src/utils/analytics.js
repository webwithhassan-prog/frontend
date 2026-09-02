import api from "../services/api";

// Fire-and-forget — analytics should never block or break the UI.
export const trackEvent = (type, path = "", meta = {}) => {
  api.post("/analytics/track", { type, path, meta }).catch(() => {});
};
