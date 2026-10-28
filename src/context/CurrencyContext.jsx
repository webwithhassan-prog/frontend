import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { CURRENCY_TO_COUNTRY } from "../utils/currencyToCountry";
import { roundForCurrency } from "../utils/currencyRounding";
import { choiceFor, deviceTimeZone } from "../utils/timezones";

const CurrencyContext = createContext();

const DEFAULT_CURRENCY = { code: "INR", symbol: "₹", rate: 1 };

// The currency a visitor picked from the currency dropdown (plus the
// country it implies). Once they've picked one, it wins over location
// detection on every visit. { country: ISO code or null, currency: code }.
const CHOICE_KEY = "country_choice";

const readChoice = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHOICE_KEY));
    return parsed && typeof parsed.currency === "string" ? parsed : null;
  } catch {
    return null;
  }
};

const saveChoice = (choice) => {
  try {
    localStorage.setItem(CHOICE_KEY, JSON.stringify(choice));
  } catch {
    // private mode etc. — the choice just lasts for this visit
  }
};

// The browser's own timezone is a free, unlimited country signal the server
// uses before falling back to a rate-limited IP lookup.
const browserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [currencies, setCurrencies] = useState([DEFAULT_CURRENCY]);
  const [rates, setRates] = useState({ INR: 1 });
  const [countryCode, setCountryCode] = useState(null);
  const [choice, setChoice] = useState(readChoice);

  useEffect(() => {
    const init = async () => {
      let fetchedCurrencies = [DEFAULT_CURRENCY];

      // Both requests fire together — run sequentially, a visitor sees the
      // INR default for the combined round-trip time of both calls (visibly
      // long right after a cold start); in parallel it's just the slower of
      // the two.
      const [ratesResult, detectResult] = await Promise.allSettled([
        api.get("/currency/rates"),
        api.get("/currency/detect", { params: { tz: browserTimeZone() } }),
      ]);

      if (ratesResult.status === "fulfilled") {
        fetchedCurrencies = ratesResult.value.data.currencies;
        setCurrencies(fetchedCurrencies);
        setRates(ratesResult.value.data.rates);
      } else {
        console.error(ratesResult.reason);
      }

      if (detectResult.status === "fulfilled") {
        setCountryCode(detectResult.value.data.country_code || null);
      }

      // 1. The currency they picked themselves, if any.
      const saved = readChoice();
      const chosen =
        saved && fetchedCurrencies.find((c) => c.code === saved.currency);
      if (chosen) {
        setCurrencyState(chosen);
        return;
      }

      // 2. Otherwise the detected location's currency.
      if (
        detectResult.status === "fulfilled" &&
        detectResult.value.data.show_conversion
      ) {
        const match = fetchedCurrencies.find(
          (c) => c.code === detectResult.value.data.currency_code,
        );
        if (match) setCurrencyState(match);
      }
    };
    init();
  }, []);

  // A pick from the currency dropdown, with the country taken from the
  // currency where there's a clear match.
  const setCurrency = (code) => {
    const match = currencies.find((c) => c.code === code);
    if (!match) return;
    setCurrencyState(match);
    const next = { country: CURRENCY_TO_COUNTRY[code] ?? null, currency: code };
    setChoice(next);
    saveChoice(next);
  };

  // Which country's local (manual) payment methods to show.
  // The country of the currency they picked; when that has no single
  // country (EUR, USD…), the detected country — so a Pakistani client who
  // picked USD still sees JazzCash/Easypaisa.
  const paymentCountry =
    choice?.country ||
    countryCode ||
    (CURRENCY_TO_COUNTRY[currency.code] ?? null);

  // Best guess at the visitor's country for things like the phone field's
  // country code: their pick, else detection, else their device's own
  // timezone (instant, and works even when detection fails).
  const visitorCountry =
    choice?.country || countryCode || choiceFor(deviceTimeZone())?.iso || null;

  // Every price in the app is stored/entered in INR — this converts to
  // whichever currency is currently selected for display only.
  const format = (inrAmount) => {
    if (!inrAmount && inrAmount !== 0) return "";
    if (currency.code === "INR") {
      return `₹${roundForCurrency(inrAmount, "INR").toLocaleString("en-IN")}`;
    }
    const raw = inrAmount * (rates[currency.code] || 1);
    if (raw <= 0) return `${currency.symbol}0`;
    // Rounded per currency (utils/currencyRounding — the server uses the
    // same rule): PKR prices to the nearest 10, others to whole units, and
    // small amounts such as a per-day price keep up to 2 decimals.
    const converted = roundForCurrency(raw, currency.code);
    return `${currency.symbol}${converted.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencies,
        setCurrency,
        format,
        rates,
        countryCode,
        choice,
        paymentCountry,
        visitorCountry,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
