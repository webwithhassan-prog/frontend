// Timezones offered by "Showing times in …", named by country so people
// recognise their own. Classes are scheduled in Pakistan time and shown
// converted to whichever of these the visitor picks (or their device's).
export const TIMEZONE_CHOICES = [
  { id: "Asia/Karachi", country: "Pakistan", flag: "🇵🇰" },
  { id: "Asia/Kolkata", country: "India", flag: "🇮🇳" },
  { id: "Asia/Dubai", country: "United Arab Emirates", flag: "🇦🇪" },
  { id: "Asia/Riyadh", country: "Saudi Arabia", flag: "🇸🇦" },
  { id: "Asia/Qatar", country: "Qatar", flag: "🇶🇦" },
  { id: "Asia/Kuwait", country: "Kuwait", flag: "🇰🇼" },
  { id: "Asia/Bahrain", country: "Bahrain", flag: "🇧🇭" },
  { id: "Asia/Muscat", country: "Oman", flag: "🇴🇲" },
  { id: "Asia/Dhaka", country: "Bangladesh", flag: "🇧🇩" },
  { id: "Asia/Kuala_Lumpur", country: "Malaysia", flag: "🇲🇾" },
  { id: "Asia/Singapore", country: "Singapore", flag: "🇸🇬" },
  { id: "Europe/Istanbul", country: "Turkey", flag: "🇹🇷" },
  { id: "Europe/London", country: "United Kingdom", flag: "🇬🇧" },
  { id: "Europe/Dublin", country: "Ireland", flag: "🇮🇪" },
  { id: "Europe/Berlin", country: "Germany / Central Europe", flag: "🇪🇺" },
  { id: "America/New_York", country: "USA — Eastern", flag: "🇺🇸" },
  { id: "America/Chicago", country: "USA — Central", flag: "🇺🇸" },
  { id: "America/Denver", country: "USA — Mountain", flag: "🇺🇸" },
  { id: "America/Los_Angeles", country: "USA — Pacific", flag: "🇺🇸" },
  { id: "America/Toronto", country: "Canada — Eastern", flag: "🇨🇦" },
  { id: "America/Vancouver", country: "Canada — Pacific", flag: "🇨🇦" },
  { id: "Australia/Sydney", country: "Australia — Sydney", flag: "🇦🇺" },
  { id: "Australia/Perth", country: "Australia — Perth", flag: "🇦🇺" },
];

// Other names browsers report for the same zones.
const ALIASES = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Europe/Belfast": "Europe/London",
  "US/Eastern": "America/New_York",
  "US/Central": "America/Chicago",
  "US/Mountain": "America/Denver",
  "US/Pacific": "America/Los_Angeles",
  "Australia/Melbourne": "Australia/Sydney",
  "Australia/Brisbane": "Australia/Sydney",
  "Europe/Paris": "Europe/Berlin",
  "Europe/Madrid": "Europe/Berlin",
  "Europe/Rome": "Europe/Berlin",
  "Europe/Amsterdam": "Europe/Berlin",
  "Europe/Brussels": "Europe/Berlin",
  "Europe/Vienna": "Europe/Berlin",
  "Asia/Kuching": "Asia/Kuala_Lumpur",
};

export const deviceTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Karachi";
  } catch {
    return "Asia/Karachi";
  }
};

export const choiceFor = (timeZone) =>
  TIMEZONE_CHOICES.find((c) => c.id === (ALIASES[timeZone] || timeZone)) ||
  null;

// "GMT+5", "GMT+5:30", "GMT-4" — the zone's current offset.
export const offsetLabel = (timeZone) => {
  try {
    const part = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName");
    return part ? part.value : "";
  } catch {
    return "";
  }
};

// A readable place name for any zone, including ones not in the list
// ("Asia/Tashkent" → "Tashkent").
export const placeName = (timeZone) =>
  choiceFor(timeZone)?.country || timeZone.split("/").pop().replace(/_/g, " ");

// "YYYY-MM-DD" for an instant, in a timezone — for "is this today here?".
export const dateKeyIn = (date, timeZone) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
