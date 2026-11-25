import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";
import api from "../../services/api";

const APPLIES_LABEL = {
  all: "all packages",
  dietplan: "Dietplan packages",
  workout: "Home Workout packages",
  combo: "Both Combined packages",
};

const pad = (n) => String(n).padStart(2, "0");

// "2d 04h 12m", or "04h 12m 09s" in the last day.
const formatLeft = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return d > 0 ? `${d}d ${pad(h)}h ${pad(m)}m` : `${pad(h)}h ${pad(m)}m ${pad(sec)}s`;
};

// Banner above the packages for a limited-time offer (one with an end
// date): what it is and a live countdown. When it reaches zero it
// disappears and calls onEnded, so the page drops the discounted prices.
const OfferCountdown = ({ onEnded, className = "" }) => {
  const [offer, setOffer] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const endNotified = useRef(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/offers/public")
      .then((res) => {
        if (cancelled) return;
        // The limited-time offer ending soonest (offers without an end date
        // have no countdown to show).
        const timed = (Array.isArray(res.data) ? res.data : [])
          .filter((o) => o.ends_at && o.discount_percent > 0 && new Date(o.ends_at) > new Date())
          .sort((a, b) => new Date(a.ends_at) - new Date(b.ends_at));
        setOffer(timed[0] || null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!offer) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [offer]);

  const endsAt = offer ? new Date(offer.ends_at).getTime() : 0;
  const ended = offer && now >= endsAt;

  // Tell the page once (it re-renders with full prices).
  useEffect(() => {
    if (!ended || endNotified.current) return;
    endNotified.current = true;
    onEnded?.();
  }, [ended, onEnded]);

  if (!offer || ended) return null;

  return (
    <div
      className={`mx-auto max-w-2xl flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 px-4 py-3 text-center ${className}`}
      role="status"
    >
      <span className="flex items-center gap-1.5 font-semibold text-brand-blue text-sm">
        <Timer size={16} className="text-brand-orange shrink-0" aria-hidden="true" />
        {offer.title}: {offer.discount_percent}% off {APPLIES_LABEL[offer.applies_to] || "all packages"}
      </span>
      <span className="text-sm text-brand-blue/80">
        ends in{" "}
        <span className="font-display tabular-nums text-brand-orange">
          {formatLeft(endsAt - now)}
        </span>
      </span>
    </div>
  );
};

export default OfferCountdown;
