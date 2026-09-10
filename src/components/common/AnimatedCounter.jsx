import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

// Counts up from 0 to `target` once, the first time it scrolls into view —
// a cheap, GPU-light way to add some life to a stat without touching
// layout or costing anything after the first reveal.
const AnimatedCounter = ({ target, suffix = "", duration = 1.6 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => setCount(Math.round(value)),
    });
    return () => controls.stop();
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
