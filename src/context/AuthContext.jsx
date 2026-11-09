import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    // A role without its token isn't a session — clear it so the login
    // page shows instead of bouncing to a dashboard that can't load.
    if (storedRole && !localStorage.getItem("token")) {
      localStorage.removeItem("role");
      localStorage.removeItem("client_id");
    } else if (storedRole) {
      setRole(storedRole);
    }
    setLoading(false);

    // Keep every open tab in step: logging out (or in) in one tab used to
    // leave the others showing a dashboard that couldn't load anything.
    const onStorage = (e) => {
      if (e.key !== "token" && e.key !== "role" && e.key !== null) return;
      const token = localStorage.getItem("token");
      setRole(token ? localStorage.getItem("role") : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (token, userRole, clientId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    if (clientId) {
      localStorage.setItem("client_id", clientId);
    }
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("client_id");
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
