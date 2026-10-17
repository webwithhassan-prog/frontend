import { useState } from "react";
import Modal from "../admin/Modal";
import Button from "./Button";
import { useCurrency } from "../../context/CurrencyContext";
import { COUNTRY_CHOICES, choiceForCountry } from "../../utils/countryChoices";

// "Where are you joining from?" — asked the first time a visitor reaches
// prices, instead of silently trusting IP/timezone detection (which guesses
// wrong behind a VPN or abroad). The detected country is pre-selected, so
// most people just confirm. Closing the dialog keeps that pre-selection and
// doesn't ask again.
const CountryPrompt = () => {
  const { promptOpen, chooseCountry, countryCode, currencies } = useCurrency();
  const [selected, setSelected] = useState(null);

  const available = COUNTRY_CHOICES.filter((c) =>
    currencies.some((cur) => cur.code === c.currency),
  );
  const value = selected ?? choiceForCountry(countryCode);

  const confirm = () => {
    const option =
      available.find((o) => o.id === value) ||
      available.find((o) => o.id === "OTHER") ||
      available[0];
    if (option)
      chooseCountry({ country: option.country, currency: option.currency });
  };

  return (
    <Modal
      isOpen={promptOpen}
      onClose={confirm}
      title="Where are you joining from?"
    >
      <p className="text-sm text-brand-blue/75 mb-5">
        We&apos;ll show prices in your currency and the payment options
        available in your country. You can change this any time.
      </p>
      <label className="block mb-5">
        <span className="block text-sm font-semibold text-brand-blue mb-1.5">
          Country
        </span>
        <select
          value={value}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-brand-blue bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          {available.map((o) => (
            <option key={o.id} value={o.id}>
              {o.flag} {o.name} — {o.currency}
            </option>
          ))}
        </select>
      </label>
      <Button onClick={confirm} className="w-full">
        Show prices
      </Button>
    </Modal>
  );
};

export default CountryPrompt;
