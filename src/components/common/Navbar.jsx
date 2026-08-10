import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "./Button";
import logo from "../../assets/logo.jpeg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/plans" },
  { label: "1-on-1", href: "/consultation" },
  { label: "Timetable", href: "/timetable" },
  { label: "Jobs", href: "/careers" },
  { label: "E-Books", href: "/ebooks" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Fitness Zone"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-brand-blue text-sm tracking-wide">
            FITNESS <span className="text-brand-orange">ZONE</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-brand-blue font-medium relative"
              whileHover="hover"
              initial="rest"
            >
              {link.label}
              <motion.span
                className="absolute left-0 -bottom-1 h-0.5 bg-brand-orange"
                variants={{ rest: { width: 0 }, hover: { width: "100%" } }}
                transition={{ duration: 0.25 }}
              />
            </motion.a>
          ))}
          <Button>Join Now</Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-brand-blue"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden flex flex-col gap-4 px-6 pb-6 bg-white"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-brand-blue font-medium"
              >
                {link.label}
              </a>
            ))}
            <Button>Join Now</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
