import { useEffect } from "react";
import { useCurrency } from "../context/CurrencyContext";

// Asks "Where are you joining from?" (CountryPrompt) once a pricing section
// is on screen — not on page load, so it isn't the first thing every visitor
// sees.
export const useAskCountryWhenVisible = (ref) => {
  const { requestCountryChoice, choice } = useCurrency();
  useEffect(() => {
    const el = ref.current;
    if (choice || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) requestCountryChoice();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [choice, requestCountryChoice, ref]);
};
