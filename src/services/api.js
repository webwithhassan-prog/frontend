import axios from "axios";

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

// A client's token can outlive an admin banning them mid-session — force
// them out immediately if the backend reports the account as banned.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.data?.banned) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("client_id");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
