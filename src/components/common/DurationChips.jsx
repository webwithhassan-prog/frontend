// Quick buttons above the package cards — "30 Days · 90 Days · …", one per
// package length that exists — so a visitor jumps straight to the length
// they want instead of swiping through every card.
const DurationChips = ({ durations, activeIndex, onSelect, className = "" }) => {
  if (durations.length < 2) return null;
  return (
    <div
      className={`flex flex-wrap justify-center gap-2 ${className}`}
      role="group"
      aria-label="Jump to a package length"
    >
      {durations.map((days, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={days}
            type="button"
            onClick={() => onSelect(i)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              active
                ? "bg-brand-blue text-white border-brand-blue"
                : "bg-white text-brand-blue border-brand-blue-pale hover:border-brand-blue"
            }`}
          >
            {days} Days
          </button>
        );
      })}
    </div>
  );
};

export default DurationChips;
