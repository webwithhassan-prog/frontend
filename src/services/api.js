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

    if (hadToken && (status === 401 || err.response?.data?.banned)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("client_id");
      toast.error(
        err.response?.data?.banned
          ? err.response.data.message
          : "Your session has expired — please log in again.",
      );
      // A full navigation unloads the page almost immediately — delay it
      // just long enough for the toast above to actually paint first.
      setTimeout(() => {
        window.location.href = "/login";
      }, 300);
    }
    return Promise.reject(err);
  },
);

export default api;
