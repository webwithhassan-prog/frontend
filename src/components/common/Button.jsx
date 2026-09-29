import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion.create(Link);

// `to` renders a real link styled as a button — for anything that goes to
// another page. Search engines follow links, not click handlers, and an
// in-app path ("/plans") navigates without reloading the site. Anything
// else (an external URL) becomes a plain <a>.
const Button = ({
  children,
  onClick,
  to,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
}) => {
  const base =
    "font-semibold rounded-full transition-colors duration-200 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2";

  const sizes = {
    md: "px-6 py-3",
    sm: "px-4 py-2 text-xs",
  };

  const variants = {
    primary:
      "bg-brand-blue-light text-white shadow-lg hover:bg-brand-blue-light-dark",
    secondary:
      "bg-white text-brand-blue border-2 border-brand-blue hover:bg-brand-blue-pale",
  };

  const hoverShadow = {
    primary: "0 8px 20px rgba(44,68,209,0.35)",
    secondary: "0 8px 20px rgba(18,34,74,0.15)",
  };

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.05, boxShadow: hoverShadow[variant] },
    whileTap: disabled ? {} : { scale: 0.95 },
    animate: { opacity: disabled ? 0.5 : 1 },
    transition: {
      // Scale gets a spring — snappier and more tactile on press than a
      // flat tween. Opacity/shadow stay smooth tweens since a spring on
      // those (rather than a physical motion) just looks like flicker.
      scale: { type: "spring", stiffness: 400, damping: 17 },
      opacity: { duration: 0.2 },
      boxShadow: { duration: 0.2 },
    },
  };

  if (to) {
    const linkClass = `inline-block text-center ${base} ${sizes[size]} ${variants[variant]} ${className}`;
    return to.startsWith("/") ? (
      <MotionLink to={to} onClick={onClick} className={linkClass} {...motionProps}>
        {children}
      </MotionLink>
    ) : (
      <motion.a href={to} onClick={onClick} className={linkClass} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${disabled ? "cursor-not-allowed" : ""} ${className}`}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
