import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-brand-blue-pale shadow-md text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange";

const MAX_DOTS = 7;

// Inactive dot colour per background the slider sits on.
const dotTones = {
  light: "bg-brand-blue-pale",
  dark: "bg-white/40",
};

// One card at a time, with the previous/next arrows on the card's left and
// right edges (vertically centred), swipe, and dots below. Cards rendered
// here should skip their own scroll-reveal (Card revealOnScroll={false}) —
// a card swapped in while already on screen would otherwise sit invisible
// until scrolled.
//
// autoAdvanceMs turns on auto-advance, which stops for good the moment the
// visitor touches, clicks or tabs into the slider — it must never switch
// away from something they've started (e.g. a playing video).
const CardSlider = ({
  items,
  getKey,
  getLabel,
  renderItem,
  itemName = "item",
  itemClassName = "max-w-[360px]",
  tone = "light",
  autoAdvanceMs = 0,
  className = "",
}) => {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [interacted, setInteracted] = useState(false);
  const draggedRef = useRef(false);
  const reduceMotion = useReducedMotion();

  const count = items.length;
  const hasMany = count > 1;

  useEffect(() => {
    if (!autoAdvanceMs || !hasMany || interacted) return;
    const timer = setInterval(() => {
      setDirection(1);
      setSlide((prev) => (prev + 1) % count);
    }, autoAdvanceMs);
    return () => clearInterval(timer);
  }, [autoAdvanceMs, hasMany, interacted, count]);

  if (count === 0) return null;
  // Items can shrink under us (e.g. a package removed); stay in range.
  const current = Math.min(slide, count - 1);

  const goTo = (target, dir) => {
    setInteracted(true);
    setDirection(dir);
    setSlide((target + count) % count);
  };
  const goPrev = () => goTo(current - 1, -1);
  const goNext = () => goTo(current + 1, 1);

  const shift = reduceMotion ? 0 : 60;
  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir * shift }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -shift }),
  };

  return (
    <div
      className={className}
      // Capture phase: lands before the tap that starts a video, whose
      // iframe then swallows every later event. Focus covers keyboards.
      onPointerDownCapture={() => setInteracted(true)}
      onFocusCapture={() => setInteracted(true)}
    >
      {/* Bleeds 16px past the section's padding so the arrows sit near the
          screen edge and overlap only the card's border, not its content. */}
      <div className="relative -mx-4">
        <div className="overflow-hidden px-6 py-2">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={getKey(items[current])}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
              drag={hasMany ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onPointerDownCapture={() => {
                draggedRef.current = false;
              }}
              onDragStart={() => {
                draggedRef.current = true;
              }}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) goNext();
                else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) goPrev();
              }}
              // A swipe that starts on a button would otherwise also "tap"
              // it on release — paying, or starting a video, mid-swipe.
              onClickCapture={(e) => {
                if (!draggedRef.current) return;
                draggedRef.current = false;
                e.preventDefault();
                e.stopPropagation();
              }}
              className={`${itemClassName} mx-auto touch-pan-y`}
            >
              {renderItem(items[current], current)}
            </motion.div>
          </AnimatePresence>
        </div>

        {hasMany && (
          <>
            <button
              onClick={goPrev}
              className={`${arrowClass} left-0`}
              aria-label={`Previous ${itemName}`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className={`${arrowClass} right-0`}
              aria-label={`Next ${itemName}`}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Dots for a handful of items, each with a 24px tap target around
          the small visible dot; past that a dot row would overflow a phone,
          so it becomes a "3 / 15" counter. */}
      {hasMany && count <= MAX_DOTS && (
        <div className="flex justify-center mt-2">
          {items.map((item, i) => (
            <button
              key={getKey(item)}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Show ${getLabel(item, i)}`}
              aria-current={i === current}
              className="h-6 min-w-6 px-1 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-brand-orange" : `w-2 ${dotTones[tone]}`
                }`}
              />
            </button>
          ))}
        </div>
      )}
      {hasMany && count > MAX_DOTS && (
        <p
          className={`text-center text-sm font-semibold tabular-nums mt-3 ${
            tone === "dark" ? "text-white/80" : "text-brand-blue/70"
          }`}
          aria-live="polite"
        >
          {current + 1} / {count}
        </p>
      )}
    </div>
  );
};

export default CardSlider;
