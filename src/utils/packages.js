// Package durations are set by the admin (any number of days), so pages
// list whatever exists instead of a fixed 30/90/180.

const daysOf = (plans, type) =>
  plans.filter((p) => p.product_type === type).map((p) => p.duration_days);

// Durations to show for a package type, shortest first. "Both Combined"
// lists its own combo plans plus any duration where a dietplan and a
// workout plan both exist, since the packages page sums those two.
export const durationsForType = (plans, type) => {
  let days = daysOf(plans, type);
  if (type === "combo") {
    const dietDays = new Set(daysOf(plans, "dietplan"));
    days = days.concat(daysOf(plans, "workout").filter((d) => dietDays.has(d)));
  }
  return [...new Set(days)].sort((a, b) => a - b);
};

// Which cards get the "Most popular" badge, given whether each card's
// package is flagged in admin. With none flagged, the middle card of three
// or more gets it.
export const popularFlags = (flagged) => {
  if (flagged.some(Boolean)) return flagged;
  const middle = flagged.length >= 3 ? Math.floor((flagged.length - 1) / 2) : -1;
  return flagged.map((_, i) => i === middle);
};

// Shown only until the admin sets features on a plan of that type.
export const DEFAULT_FEATURES = {
  dietplan: [
    "Dietitian support",
    "Home-based menu",
    "Health-specific / preferred food only",
    "Daily meal tracking",
    "Weekly follow-up",
    "Renews every 15 days",
  ],
  workout: [
    "Flexible timings",
    "50-55 minute sessions",
    "6 days a week",
    "Different workout daily",
    "Female trainers",
    "Recordings provided",
  ],
  combo: [
    "Everything in Customized Dietplan",
    "Everything in Home Workouts",
    "One package, one price",
  ],
};

// Features to list for a package type and length: that plan's own, else
// the ones the admin set on the nearest length of the same type, else the
// defaults. Durations without their own Dietplan / Home Workouts plan
// (e.g. 30-day combos) used to show the defaults while the 90-day card
// showed the admin's edited text ("50-55 minute zoom sessions").
export const featuresFor = (plans, type, days) => {
  const withFeatures = plans.filter(
    (p) => p.product_type === type && p.features?.length,
  );
  const own = withFeatures.find((p) => p.duration_days === days);
  if (own) return own.features;
  const nearest = [...withFeatures].sort(
    (a, b) => Math.abs(a.duration_days - days) - Math.abs(b.duration_days - days),
  )[0];
  return nearest ? nearest.features : DEFAULT_FEATURES[type] || [];
};

// A plan's offer discount, or 0 once a limited-time offer has ended — the
// page may have been loaded before the end (and cached responses can lag
// a few minutes), and checkout charges the full price after it.
export const liveOfferPercent = (plan) =>
  plan.discount_ends_at && new Date(plan.discount_ends_at) <= new Date()
    ? 0
    : plan.discount_percent || 0;
