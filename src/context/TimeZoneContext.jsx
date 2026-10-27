import { createContext, useCallback, useContext, useState } from "react";
import { deviceTimeZone } from "../utils/timezones";

const TimeZoneContext = createContext();

// The timezone class times are shown in, on the timetable and the client
// dashboard. Defaults to the device's own; a visitor who picks another
// (travelling, VPN, or just checking another country) keeps it on this
// device until they switch back.
const STORAGE_KEY = "display_timezone";

const readSaved = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const isValidZone = (zone) => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
};

export const TimeZoneProvider = ({ children }) => {
  const [chosen, setChosen] = useState(() => {
    const saved = readSaved();
    return saved && isValidZone(saved) ? saved : null;
  });

  const timeZone = chosen || deviceTimeZone();

  // null = follow the device again.
  const setTimeZone = useCallback((zone) => {
    const next = zone && zone !== deviceTimeZone() ? zone : null;
    setChosen(next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, next);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // private mode etc. — the choice just lasts for this visit
    }
  }, []);

  return (
    <TimeZoneContext.Provider
      value={{ timeZone, isDeviceZone: !chosen, setTimeZone }}
    >
      {children}
    </TimeZoneContext.Provider>
  );
};

export const useTimeZone = () => useContext(TimeZoneContext);
