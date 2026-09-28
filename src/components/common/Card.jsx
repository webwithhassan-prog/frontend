import { motion } from "framer-motion";

// revealOnScroll={false} for cards inside a horizontal slider — the fade-in
// waits for 30% of the card to enter the viewport, which a card parked
// off to the side of a slider never does, so it would stay invisible.
const Card = ({ children, className = "", revealOnScroll = true }) => {
  return (
    <motion.div
      className={`bg-white border border-brand-blue-pale rounded-2xl shadow-md p-6 ${className}`}
      initial={revealOnScroll ? { opacity: 0, y: 20 } : false}
      whileInView={revealOnScroll ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(30,58,138,0.15)" }}
      transition={{
        default: { duration: 0.35 },
        y: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
