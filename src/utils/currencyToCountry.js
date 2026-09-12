// Reverse of the backend's country->currency map, covering just the
// currencies actually offered by the switcher (see SELECTABLE_CURRENCIES in
// currencyController.js) — used to decide which country's manual payment
// methods to show based on the currency the client currently has selected,
// rather than their (invisible, IP-based) detected country. That way a
// client can deliberately reveal a country's manual methods by picking its
// currency, and switching away hides them again — INR and EUR are left out
// since they're each shared by many countries with no single obvious match.
export const CURRENCY_TO_COUNTRY = {
  PKR: "PK",
  GBP: "GB",
  USD: "US",
  AED: "AE",
  AUD: "AU",
  CAD: "CA",
  KWD: "KW",
  MYR: "MY",
  OMR: "OM",
  QAR: "QA",
  SAR: "SA",
};
