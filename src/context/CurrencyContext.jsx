import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const CurrencyContext = createContext();

const DEFAULT_CURRENCY = { code: "INR", symbol: "₹", rate: 1 };

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [currencies, setCurrencies] = useState([DEFAULT_CURRENCY]);
  const [rates, setRates] = useState({ INR: 1 });

  useEffect(() => {
    const init = async () => {
      let fetchedCurrencies = [DEFAULT_CURRENCY];
      let fetchedRates = { INR: 1 };
      try {
        const res = await api.get("/currency/rates");
        fetchedCurrencies = res.data.currencies;
        fetchedRates = res.data.rates;
        setCurrencies(fetchedCurrencies);
        setRates(fetchedRates);
      } catch (err) {
        console.error(err);
      }

      // A saved manual choice always wins over auto-detection.
      const saved = localStorage.getItem("selected_currency");
      if (saved) {
        const match = fetchedCurrencies.find((c) => c.code === saved);
        if (match) {
          setCurrencyState(match);
          return;
        }
      }

      try {
        const res = await api.get("/currency/detect");
        if (res.data.show_conversion) {
          const match = fetchedCurrencies.find(
            (c) => c.code === res.data.currency_code,
          );
          if (match) setCurrencyState(match);
        }
      } catch (err) {
        // Stay on the INR default
      }
    };
    init();
  }, []);

  const setCurrency = (code) => {
    const match = currencies.find((c) => c.code === code);
    if (!match) return;
    setCurrencyState(match);
    localStorage.setItem("selected_currency", code);
  };

  // Every price in the app is stored/entered in INR — this converts to
  // whichever currency is currently selected for display only.
  const format = (inrAmount) => {
    if (!inrAmount && inrAmount !== 0) return "";
    if (currency.code === "INR") {
      return `₹${Math.round(inrAmount).toLocaleString("en-IN")}`;
    }
    const raw = inrAmount * (rates[currency.code] || 1);
    // Plain rounding, no coarsening — but a genuinely nonzero price should
    // never display as "0" just because a strong currency (e.g. GBP, EUR)
    // makes a small per-day amount round down to nothing.
    const converted = raw > 0 ? Math.max(1, Math.round(raw)) : 0;
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, currencies, setCurrency, format }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
