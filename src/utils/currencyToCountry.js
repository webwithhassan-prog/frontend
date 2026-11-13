// Reverse of the backend's country->currency map, covering just the
// currencies actually offered by the switcher (see SELECTABLE_CURRENCIES in
// currencyController.js) — used to decide which country's manual payment
// methods to show based on the currency the client currently has selected,
// rather than their (invisible, IP-based) detected country. That way a
// client can deliberately reveal a country's manual methods by picking its
// currency, and switching away hides them again. INR means India: rupee
// prices are charged in rupees with UPI, so they must not come with another
// country's bank options. EUR is left out — it has no single country.
export const CURRENCY_TO_COUNTRY = {
  PKR: "PK",
  INR: "IN",
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
