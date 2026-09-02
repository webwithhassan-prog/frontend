import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
}) => {
  const base =
    "font-semibold rounded-full transition-colors duration-200 relative overflow-hidden";

  const sizes = {
    md: "px-6 py-3",
    sm: "px-4 py-2 text-xs",
  };

  const variants = {
    primary: "bg-brand-orange text-white shadow-lg hover:bg-brand-orange-dark",
    secondary:
      "bg-white text-brand-blue border-2 border-brand-blue hover:bg-brand-blue-pale",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      whileHover={
        disabled
          ? {}
          : { scale: 1.05, boxShadow: "0 8px 20px rgba(249,115,22,0.35)" }
      }
      whileTap={disabled ? {} : { scale: 0.95 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
