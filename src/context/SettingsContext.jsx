import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const SettingsContext = createContext();

const DEFAULTS = {
  whatsapp_general: "447462164602",
  whatsapp_dietician: "919220447415",
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get("/settings");
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, refetchSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
