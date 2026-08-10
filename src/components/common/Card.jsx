import { motion } from "framer-motion";

const Card = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`bg-white border border-brand-blue-pale rounded-2xl shadow-md p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -6, boxShadow: "0 12px 24px rgba(30,58,138,0.15)" }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
