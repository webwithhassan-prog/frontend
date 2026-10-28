import { useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import api from "../../services/api";
import { useCurrency } from "../../context/CurrencyContext";
import { COUNTRY_CHOICES } from "../../utils/countryChoices";

// "Paying from Pakistan or Saudi Arabia? Bank transfer & wallets" — shown
// when the visitor's country has no local methods (they chose another
// country, switched currency, or are behind a VPN), so JazzCash, Easypaisa,
// bank transfer etc. are always one tap away. Tapping a country switches
// prices to its currency and shows its methods on the cards.
const LocalPaymentOptions = ({ hidden, className = "" }) => {
  const { chooseCountry } = useCurrency();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    api
      .get("/manual-payment-methods/public/countries")
      .then((res) => setCountries(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCountries([]));
  }, []);

  const options = countries
    .map((code) => COUNTRY_CHOICES.find((c) => c.country === code))
    .filter(Boolean);
  if (hidden || options.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 text-sm text-brand-blue ${className}`}
    >
      <Landmark
        size={16}
        className="text-brand-orange shrink-0"
        aria-hidden="true"
      />
      <span>Paying from</span>
      {options.map((c, i) => (
        <span key={c.id} className="flex items-center gap-2">
          {i > 0 && <span className="text-brand-blue/60">or</span>}
          <button
            type="button"
            onClick={() =>
              chooseCountry({ country: c.country, currency: c.currency })
            }
            className="font-semibold text-brand-blue-light underline underline-offset-2 hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            {c.flag} {c.name}
          </button>
          {i === options.length - 1 && <span className="-ml-2">?</span>}
        </span>
      ))}
      <span>Pay by bank transfer or wallet.</span>
    </div>
  );
};

export default LocalPaymentOptions;
