// Countries offered by "Where are you joining from?" — each with the
// currency its prices are shown in. `country` (ISO code) also decides which
// local payment methods appear; null means none (Europe and "another
// country" span many countries with no single set of local methods).
export const COUNTRY_CHOICES = [
  { id: "PK", country: "PK", name: "Pakistan", flag: "🇵🇰", currency: "PKR" },
  { id: "IN", country: "IN", name: "India", flag: "🇮🇳", currency: "INR" },
  {
    id: "AE",
    country: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    currency: "AED",
  },
  {
    id: "SA",
    country: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    currency: "SAR",
  },
  { id: "QA", country: "QA", name: "Qatar", flag: "🇶🇦", currency: "QAR" },
  { id: "KW", country: "KW", name: "Kuwait", flag: "🇰🇼", currency: "KWD" },
  { id: "OM", country: "OM", name: "Oman", flag: "🇴🇲", currency: "OMR" },
  {
    id: "GB",
    country: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    currency: "GBP",
  },
  {
    id: "US",
    country: "US",
    name: "United States",
    flag: "🇺🇸",
    currency: "USD",
  },
  { id: "CA", country: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD" },
  { id: "AU", country: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD" },
  { id: "MY", country: "MY", name: "Malaysia", flag: "🇲🇾", currency: "MYR" },
  {
    id: "EU",
    country: null,
    name: "Europe (euro countries)",
    flag: "🇪🇺",
    currency: "EUR",
  },
  {
    id: "OTHER",
    country: null,
    name: "Another country (US dollar)",
    flag: "🌍",
    currency: "USD",
  },
];

const EURO_COUNTRIES = new Set([
  "AT",
  "BE",
  "HR",
  "CY",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PT",
  "SK",
  "SI",
  "ES",
]);

// The option to pre-select for a detected country code.
export const choiceForCountry = (countryCode) => {
  if (!countryCode) return "OTHER";
  if (EURO_COUNTRIES.has(countryCode)) return "EU";
  return COUNTRY_CHOICES.some((c) => c.id === countryCode)
    ? countryCode
    : "OTHER";
};
