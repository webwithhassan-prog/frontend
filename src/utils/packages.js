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
