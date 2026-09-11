import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const DRAWABLE = "path, circle, ellipse, line, polyline, polygon, rect";

// A large icon that draws itself stroke-by-stroke once scrolled into view —
// set up via each drawable SVG child's own getTotalLength(), which works
// generically across every lucide icon without hardcoding path data.
const IconDraw = ({ Icon, size = 56, className = "" }) => {
  const wrapperRef = useRef(null);
  const isInView = useInView(wrapperRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView || !wrapperRef.current) return;
    const svg = wrapperRef.current.querySelector("svg");
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
      shape.getBoundingClientRect();
      requestAnimationFrame(() => {
        shape.style.transition = `stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 * i}s`;
        shape.style.strokeDashoffset = "0";
      });
    });
  }, [isInView]);

  return (
    <motion.div
      ref={wrapperRef}
      className={className}
      initial={false}
      animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.85 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Icon className="text-white" size={size} strokeWidth={1.5} />
    </motion.div>
  );
};

export default IconDraw;
