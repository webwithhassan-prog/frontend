import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white border border-brand-blue-pale shadow-md text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange";

// One card at a time, with the previous/next arrows on the card's left and
// right edges (vertically centred), swipe, and dots below. Used for the
// package cards on phones. Cards rendered here should skip their own
// scroll-reveal (Card revealOnScroll={false}) — a card swapped in while
// already on screen would otherwise sit invisible until scrolled.
const CardSlider = ({
  items,
  getKey,
  getLabel,
  renderItem,
  itemName = "item",
  className = "",
}) => {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  if (items.length === 0) return null;
  // Items can shrink under us (e.g. a package removed); stay in range.
  const current = Math.min(slide, items.length - 1);
  const hasMany = items.length > 1;

  const goTo = (target, dir) => {
    setDirection(dir);
    setSlide((target + items.length) % items.length);
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
    <div className={className}>
      {/* Bleeds 16px past the section's padding so the arrows sit near the
          screen edge and overlap only the card's border, not its text. */}
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
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) goNext();
                else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) goPrev();
              }}
              className="max-w-[360px] mx-auto touch-pan-y"
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

      {hasMany && (
        <div className="flex justify-center gap-2 mt-4">
          {items.map((item, i) => (
            <button
              key={getKey(item)}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Show ${getLabel(item)}`}
              aria-current={i === current}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                i === current ? "w-6 bg-brand-orange" : "w-2 bg-brand-blue-pale"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardSlider;
