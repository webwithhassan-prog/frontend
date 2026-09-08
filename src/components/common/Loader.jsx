const BRAND_BLUE = "#12224A";
const BRAND_ORANGE = "#F76B1C";

// A spinning ring that sweeps from brand-blue into brand-orange — the same
// gradient direction as the logo mark itself — instead of a plain
// single-color generic spinner. Built with a conic-gradient + radial-mask
// (not a Tailwind utility) since a smooth color sweep isn't expressible any
// other way; scales cleanly at any size, from a small inline spinner to a
// larger page-loading one.
const Loader = ({ size = 22, label, className = "" }) => {
  const thickness = Math.max(2, Math.round(size * 0.14));
  return (
    <div
      className={`flex items-center justify-center gap-2 py-10 ${className}`}
    >
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
      {label && <span className="text-brand-blue/60 text-sm">{label}</span>}
    </div>
  );
};

export default Loader;
