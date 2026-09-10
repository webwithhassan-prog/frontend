import logoMark from "../../assets/logo-mark.png";

const BRAND_BLUE = "#12224A";
const BRAND_ORANGE = "#F76B1C";

// Below this size the logo's own detail (a thin figure + star) turns into
// an illegible blob — tested directly at the sizes this component is
// actually used at (18-96px across the app). Small/inline spots keep the
// abstract brand-gradient ring; only a real "splash" moment is big enough
// to show the mark itself.
const LOGO_THRESHOLD = 48;

const Loader = ({ size = 22, label, className = "" }) => {
  const thickness = Math.max(2, Math.round(size * 0.14));
  const isSplash = size >= LOGO_THRESHOLD;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}
    >
      {isSplash ? (
        // logo-mark.png is logo.jpeg's mark trimmed and re-padded to fill
        // ~92% of its own square (generated via
        // scripts/generate-loader-logo.mjs) — the raw source file has so
        // much built-in white margin that displaying it directly left the
        // mark looking tiny and off-center inside the circle, especially
        // at larger sizes on mobile. Still has a solid white background
        // (no transparency), so it's wrapped in a white circle here too —
        // without it, it'd show as a visible white box on any non-white
        // surface, like the hero's dark blue loading section.
        <span
          className="inline-flex items-center justify-center rounded-full bg-white shadow-lg shrink-0"
          style={{ width: size * 1.4, height: size * 1.4 }}
        >
          <img
            src={logoMark}
            alt="Fitness Zone"
            className="animate-brand-pulse object-contain rounded-full"
            style={{ width: size, height: size }}
          />
        </span>
      ) : (
        <span
          className="inline-block rounded-full animate-spin shrink-0"
          style={{
            width: size,
            height: size,
            background: `conic-gradient(from 0deg, transparent 0%, ${BRAND_BLUE} 45%, ${BRAND_ORANGE} 100%)`,
            WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
            mask: `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`,
          }}
        />
      )}
      {label && <span className="text-brand-blue/60 text-sm">{label}</span>}
    </div>
  );
};

export default Loader;
