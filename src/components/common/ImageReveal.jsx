import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const DRAWABLE = "path, circle, ellipse, line, polyline, polygon, rect";

// The panel gently scales/fades in, then the icon draws itself stroke-by-
// stroke — set up via each drawable SVG child's own getTotalLength(), which
// works generically across every lucide icon without hardcoding per-icon
// path data. CSS transition (not framer-motion) drives the actual stroke
// reveal since these are plain DOM nodes rendered by the icon component,
// not motion.* elements.
const ImageReveal = ({ Icon, className = "" }) => {
  const wrapperRef = useRef(null);
  const iconWrapperRef = useRef(null);
  const isInView = useInView(wrapperRef, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!isInView || !iconWrapperRef.current) return;
    const svg = iconWrapperRef.current.querySelector("svg");
    if (!svg) return;
    const shapes = svg.querySelectorAll(DRAWABLE);
    shapes.forEach((shape, i) => {
      let length = 60;
      try {
        length = shape.getTotalLength();
      } catch {
        // getTotalLength unsupported for this shape type — fall back to a
        // fixed length; it still animates, just without a perfectly timed
        // draw-in.
      }
      shape.style.strokeDasharray = `${length}`;
      shape.style.strokeDashoffset = `${length}`;
      shape.style.transition = "none";
      // Force layout so the browser registers the pre-animation state
      // before the transition below is applied on the next frame.
      shape.getBoundingClientRect();
      requestAnimationFrame(() => {
        shape.style.transition = `stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 * i}s`;
        shape.style.strokeDashoffset = "0";
      });
    });
  }, [isInView]);

  return (
    <div ref={wrapperRef} className={className}>
      <motion.div
        className="w-full h-full bg-gradient-to-br from-brand-blue to-brand-blue-light flex items-center justify-center"
        initial={false}
        animate={{
          opacity: isInView ? 1 : 0,
          scale: isInView ? 1 : 0.94,
        }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div ref={iconWrapperRef}>
          <Icon className="text-white" size={56} strokeWidth={1.5} />
        </div>
      </motion.div>
    </div>
  );
};

export default ImageReveal;
