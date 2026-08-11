import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import Button from "./Button";
import logo from "../../assets/logo.jpeg";

const packageOptions = [
  { label: "Customized Dietplan", type: "dietplan" },
  { label: "Live Workout Sessions", type: "workout" },
  { label: "Both Combined", type: "combo" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "1-on-1", href: "/consultation" },
  { label: "Timetable", href: "/timetable" },
  { label: "Jobs", href: "/careers" },
  { label: "E-Books", href: "/ebooks" },
];

// TODO: add your WhatsApp number here, e.g. "https://wa.me/923001234567"
const whatsappLink = "https://wa.me/";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isMobilePackagesOpen, setIsMobilePackagesOpen] = useState(false);

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
          <a href="/" className="text-brand-blue font-medium relative group">
            Home
          </a>

          {/* Packages dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsPackagesOpen(true)}
            onMouseLeave={() => setIsPackagesOpen(false)}
          >
            <button className="flex items-center gap-1 text-brand-blue font-medium">
              Packages
              <ChevronDown
                size={14}
                className={`transition-transform ${isPackagesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isPackagesOpen && (
                <motion.div
                  className="absolute top-full left-0 pt-3"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white rounded-xl shadow-lg border border-brand-blue-pale py-2 w-56">
                    {packageOptions.map((opt) => (
                      <a
                        key={opt.type}
                        href={`/plans?type=${opt.type}`}
                        className="block px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue-pale hover:text-brand-orange transition-colors"
                      >
                        {opt.label}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.slice(1).map((link) => (
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

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue/70 hover:text-brand-orange transition-colors"
            title="Chat on WhatsApp"
          >
            <MessageCircle size={20} />
          </a>

          <a href="/login" className="text-brand-blue font-medium">
            Login
          </a>

          <Button onClick={() => (window.location.href = "/signup")}>
            Join Now
          </Button>
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
            className="md:hidden flex flex-col gap-1 px-6 pb-6 bg-white"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <a href="/" className="text-brand-blue font-medium py-2">
              Home
            </a>

            <button
              onClick={() => setIsMobilePackagesOpen(!isMobilePackagesOpen)}
              className="flex items-center justify-between text-brand-blue font-medium py-2"
            >
              Packages
              <ChevronDown
                size={16}
                className={`transition-transform ${isMobilePackagesOpen ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {isMobilePackagesOpen && (
                <motion.div
                  className="flex flex-col pl-4 gap-1"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {packageOptions.map((opt) => (
                    <a
                      key={opt.type}
                      href={`/plans?type=${opt.type}`}
                      className="text-brand-blue/80 text-sm py-1.5"
                    >
                      {opt.label}
                    </a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {navLinks.slice(1).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-brand-blue font-medium py-2"
              >
                {link.label}
              </a>
            ))}

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-brand-blue font-medium py-2"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>

            <a href="/login" className="text-brand-blue font-medium py-2">
              Login
            </a>

            <Button onClick={() => (window.location.href = "/signup")}>
              Join Now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
