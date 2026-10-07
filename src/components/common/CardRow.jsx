import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const arrowClass =
  "absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-brand-blue-pale shadow-md text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange disabled:opacity-0 disabled:pointer-events-none";

// Tablet/desktop row of cards: two per view on tablets, three on desktops.
// When they all fit it's a plain centred row; when there are more (e.g. a
// fourth package) it becomes a scrollable row that snaps to cards, with
// arrows on the left and right and dots below — swipe works natively on
// touch screens. Pair with CardSlider for phones.
const CardRow = ({
  items,
  getKey,
  getLabel,
  renderItem,
  itemName = "item",
  className = "",
}) => {
  const trackRef = useRef(null);
  const [state, setState] = useState({
    overflow: false,
    atStart: true,
    atEnd: true,
    positions: 1,
    active: 0,
  });

  const measure = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return;
    const step =
      first.getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).columnGap || 0);
    const maxScroll = track.scrollWidth - track.clientWidth;
    const overflow = maxScroll > 2;
    const positions = overflow ? Math.round(maxScroll / step) + 1 : 1;
    setState({
      overflow,
      atStart: track.scrollLeft <= 2,
      atEnd: track.scrollLeft >= maxScroll - 2,
      positions,
      active: overflow
        ? Math.min(positions - 1, Math.round(track.scrollLeft / step))
        : 0,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    track.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      track.removeEventListener("scroll", measure);
    };
  }, [measure, items.length]);

  const scrollToPosition = (index) => {
    const track = trackRef.current;
    const target = track?.children[index];
    if (!track || !target) return;
    track.scrollTo({
      left: target.offsetLeft - track.firstElementChild.offsetLeft,
      behavior: "smooth",
    });
  };

  const scrollByCard = (dir) => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return;
    const step =
      first.getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).columnGap || 0);
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div className="relative">
        {/* Vertical padding keeps card shadows and the hover lift from being
            clipped by the scroll container. */}
        <div
          ref={trackRef}
          className="flex justify-center-safe gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 -my-4 px-4 -mx-4 scroll-px-4"
        >
          {items.map((item, i) => (
            <div
              key={getKey(item)}
              className="shrink-0 snap-start w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>

        {state.overflow && (
          <>
            <button
              onClick={() => scrollByCard(-1)}
              disabled={state.atStart}
              className={`${arrowClass} -left-4 lg:-left-6 xl:-left-14`}
              aria-label={`Previous ${itemName}`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              disabled={state.atEnd}
              className={`${arrowClass} -right-4 lg:-right-6 xl:-right-14`}
              aria-label={`Next ${itemName}`}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {state.overflow && state.positions > 1 && (
        <div className="flex justify-center mt-4">
          {Array.from({ length: state.positions }, (_, i) => (
            // 24px tap target around the small visible dot.
            <button
              key={i}
              onClick={() => scrollToPosition(i)}
              aria-label={`Show ${getLabel(items[i], i)} onwards`}
              aria-current={i === state.active}
              className="h-6 min-w-6 px-1 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  i === state.active
                    ? "w-6 bg-brand-orange"
                    : "w-2 bg-brand-blue-pale"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardRow;
