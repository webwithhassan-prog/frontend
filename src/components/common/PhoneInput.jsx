import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, Globe } from "lucide-react";
import { COUNTRY_CODES, flagEmoji } from "../../utils/countryCodes";
import WhatsAppIcon from "./WhatsAppIcon";
import { useCurrency } from "../../context/CurrencyContext";

const DEFAULT_COUNTRY = COUNTRY_CODES.find((c) => c.iso === "PK");

// Dial codes sorted longest-first so e.g. "1876" (Jamaica) matches before
// the shorter "1" (US/Canada) it would otherwise collide with.
const BY_DIAL_LENGTH = [...COUNTRY_CODES].sort(
  (a, b) => b.dial.length - a.dial.length,
);

// Splits a stored "+<dial><number>" string into its dial code + local
// number, for pre-filling the picker when editing an existing phone number.
// Legacy numbers saved without a leading "+" (from before this component
// existed) fall back to the default country with the raw digits as-is.
// "+44 7700 900123" / "0044…" → { dial: "44", number: "7700900123" }, or
// null when the text doesn't start with an international prefix.
const parseInternational = (text) => {
  const trimmed = text.trim();
  if (!/^(\+|00)/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, "").replace(/^00/, "");
  const match = BY_DIAL_LENGTH.find((c) => digits.startsWith(c.dial));
  return match
    ? { dial: match.dial, number: digits.slice(match.dial.length) }
    : null;
};

const parseValue = (value) => {
  // Nothing yet: no country code until the visitor's country is known (or
  // they pick one) — better an empty box than a wrong guess.
  if (!value) return { dial: "", number: "" };
  if (!value.startsWith("+")) {
    return { dial: DEFAULT_COUNTRY.dial, number: value };
  }
  const digits = value.slice(1);
  const match = BY_DIAL_LENGTH.find((c) => digits.startsWith(c.dial));
  if (!match) return { dial: DEFAULT_COUNTRY.dial, number: digits };
  return { dial: match.dial, number: digits.slice(match.dial.length) };
};

// A phone number field with a country dial code that's both directly
// typeable and pickable from a searchable list. Emits a single combined
// "+<dial><number>" string via onChange, matching the plain-string phone
// fields already used across the client/booking models — no backend schema
// change needed.
//
// Internally uncontrolled (dial/number live in this component's own state)
// so picking a country doesn't get fought by a re-render — `value` is only
// read on mount. A parent that clears its own form state after a successful
// submit (rather than navigating away) needs to force this back to its
// default by remounting it: pass a `key` that changes on reset, e.g.
// `key={resetCount}`.
//
// The team reaches clients on WhatsApp, so every phone field carries a note
// asking for a number that's active there. `hint` swaps the wording for
// the context (e.g. admin forms), and `hint={null}` hides it.
export const WHATSAPP_HINT =
  "Use your active WhatsApp number — our team contacts you there.";

const PhoneInput = ({
  value,
  onChange,
  required,
  placeholder = "WhatsApp number",
  hint = WHATSAPP_HINT,
  className = "",
}) => {
  const initial = parseValue(value);
  const [dial, setDial] = useState(initial.dial);
  const [number, setNumber] = useState(initial.number);
  // Once the person picks or types a country code themselves, it's theirs.
  const dialTouched = useRef(!!value);

  // Start from the visitor's own country (their "Where are you joining
  // from?" answer, else the detected one) instead of always Pakistan —
  // people abroad didn't notice +92 and typed their local number after it.
  const { visitorCountry } = useCurrency() || {};
  useEffect(() => {
    if (dialTouched.current || !visitorCountry) return;
    const c = COUNTRY_CODES.find((x) => x.iso === visitorCountry);
    if (c) setDial(c.dial);
  }, [visitorCountry]);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const matchedCountry = COUNTRY_CODES.find((c) => c.dial === dial);

  // The national "0" in front of local numbers (0300 1234567) isn't part
  // of the international number — "+92 0300…" isn't a real number.
  const emit = (nextDial, nextNumber) => {
    if (!nextDial) {
      onChange("");
      return;
    }
    const local = nextNumber.replace(/^0+/, "");
    onChange(local ? `+${nextDial}${local}` : "");
  };

  const handleDialChange = (e) => {
    dialTouched.current = true;
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setDial(digits);
    emit(digits, number);
  };

  const handleNumberChange = (e) => {
    // A full international number typed or pasted here sets the country too.
    const intl = parseInternational(e.target.value);
    if (intl) {
      dialTouched.current = true;
      setDial(intl.dial);
      setNumber(intl.number);
      emit(intl.dial, intl.number);
      return;
    }
    // Still typing an international prefix ("+4" on the way to "+44"):
    // keep the "+" in the box until a country code is recognised.
    if (/^\s*(\+|00)/.test(e.target.value)) {
      setNumber(e.target.value.replace(/[^\d+]/g, ""));
      onChange("");
      return;
    }
    const digits = e.target.value.replace(/\D/g, "");
    setNumber(digits);
    emit(dial, digits);
  };

  const handleSelectCountry = (c) => {
    dialTouched.current = true;
    setDial(c.dial);
    setIsOpen(false);
    setQuery("");
    emit(c.dial, number);
  };

  const filtered = query.trim()
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          c.dial.includes(query.trim()),
      )
    : COUNTRY_CODES;

  return (
    <div className="w-full">
      <div
        className={`relative flex w-full border border-brand-blue-pale rounded-lg focus-within:ring-2 focus-within:ring-brand-orange ${className}`}
      >
        <div className="flex items-center pl-2.5 pr-1 border-r border-brand-blue-pale shrink-0 rounded-l-lg">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            title="Choose country"
            aria-label={`Choose country, current: ${matchedCountry ? matchedCountry.name : "unknown"}`}
            className="flex items-center gap-0.5 min-h-[44px] px-1 text-brand-blue/70 hover:text-brand-orange transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            {matchedCountry ? (
              <span className="text-base leading-none">
                {flagEmoji(matchedCountry.iso)}
              </span>
            ) : (
              <Globe size={15} />
            )}
            <ChevronDown
              size={14}
              className={`ml-0.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
          <span className="text-brand-blue text-sm ml-1.5">+</span>
          <input
            type="text"
            inputMode="numeric"
            value={dial}
            onChange={handleDialChange}
            aria-label="Country dial code"
            placeholder="code"
            required={required}
            title="Your country code, e.g. 92 for Pakistan or 44 for the UK"
            className="w-11 text-brand-blue text-sm py-3 pl-0.5 focus:outline-none bg-transparent"
          />
        </div>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          value={number}
          onChange={handleNumberChange}
          required={required}
          className="flex-1 min-w-0 px-3 py-3 rounded-r-lg focus:outline-none"
        />

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
            />
            <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-brand-blue-pale py-1.5 z-20">
              <div className="px-2 pb-1.5 mb-1 border-b border-brand-blue-pale/60 relative">
                <Search
                  size={13}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue/40"
                />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full pl-6 pr-2 py-1.5 text-sm text-brand-blue outline-none"
                />
              </div>
              <div className="max-h-56 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.map((c) => (
                    <button
                      key={c.iso}
                      type="button"
                      onClick={() => handleSelectCountry(c)}
                      className={`flex items-center justify-between w-full text-left px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:bg-brand-blue-pale ${
                        dial === c.dial
                          ? "text-brand-orange font-semibold"
                          : "text-brand-blue hover:bg-brand-blue-pale"
                      }`}
                    >
                      <span className="truncate">
                        {flagEmoji(c.iso)} {c.name}
                      </span>
                      <span className="text-brand-blue/50 shrink-0 ml-2">
                        +{c.dial}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-brand-blue/50">
                    No match found.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {hint && (
        <p className="flex items-start gap-1.5 mt-1.5 text-xs leading-snug text-brand-blue/60">
          <WhatsAppIcon size={13} className="mt-px shrink-0 text-[#25D366]" />
          <span>{hint}</span>
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
