import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
    setLoading(false);
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
