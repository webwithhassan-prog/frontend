import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  User,
  LogOut,
  Search,
} from "lucide-react";
import Button from "./Button";
import InstagramIcon from "./InstagramIcon";
import logo from "../../assets/logo.jpeg";
import { useAuth } from "../../context/AuthContext";

const packageOptions = [
  { label: "Customized Dietplan", type: "dietplan" },
  { label: "Live Workout Sessions", type: "workout" },
  { label: "Both Combined", type: "combo" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "1-on-1", href: "/consultation" },
  { label: "Time Slots", href: "/timetable" },
  { label: "Jobs", href: "/careers" },
  { label: "E-Books & Courses", href: "/ebooks" },
];

const searchablePages = [
  { label: "Home", href: "/" },
  { label: "Packages & Pricing", href: "/plans" },
  { label: "1-on-1 Consultation", href: "/consultation" },
  { label: "Time Slots", href: "/timetable" },
  { label: "Careers", href: "/careers" },
  { label: "E-Books & Courses", href: "/ebooks" },
  { label: "Trainers", href: "/trainers" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

// TODO: add your WhatsApp number here, e.g. "https://wa.me/923001234567"
const whatsappLink = "https://wa.me/";
const instagramLink = "https://www.instagram.com/fitness_zone5566";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isMobilePackagesOpen, setIsMobilePackagesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { role, logout } = useAuth();
  const isClient = role === "client";

  const searchResults = searchQuery.trim()
    ? searchablePages.filter((p) =>
        p.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : [];

  const goToTopResult = () => {
    if (searchResults[0]) {
      window.location.href = searchResults[0].href;
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-blue-pale/60">
      <nav className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Fitness Zone"
                className="h-10 w-10 object-contain"
              />
              <span className="font-display text-brand-blue text-sm tracking-wide hidden sm:block">
                FITNESS <span className="text-brand-orange">ZONE</span>
              </span>
            </a>

            {/* Mobile hamburger — next to the logo */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center text-brand-blue"
              onClick={() => {
                setIsOpen(!isOpen);
                setIsSearchOpen(false);
              }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-brand-blue/80 font-medium text-sm px-2 xl:px-3 py-2 whitespace-nowrap hover:text-brand-orange transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Packages dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPackagesOpen(true)}
              onMouseLeave={() => setIsPackagesOpen(false)}
            >
              <button className="flex items-center gap-1 text-brand-blue/80 font-medium text-sm px-3 py-2 hover:text-brand-orange transition-colors">
                Packages
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isPackagesOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isPackagesOpen && (
                  <motion.div
                    className="absolute top-full right-0 pt-3"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white rounded-2xl shadow-lg border border-brand-blue-pale py-2 w-56">
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
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4 pl-4 ml-2 border-l border-brand-blue-pale">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue/70 hover:text-brand-orange transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle size={19} />
            </a>
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue/70 hover:text-brand-orange transition-colors"
              title="Follow us on Instagram"
            >
              <InstagramIcon size={19} />
            </a>

            {isClient ? (
              <>
                <a
                  href="/client"
                  className="flex items-center gap-1.5 text-brand-blue font-medium text-sm"
                >
                  <User size={16} />
                  My Profile
                </a>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-brand-blue/70 hover:text-brand-orange text-sm transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-brand-blue font-medium text-sm"
                >
                  Login
                </a>
                <Button onClick={() => (window.location.href = "/signup")}>
                  Join Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile bar: search, login, signup */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="relative">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-blue-pale/60 text-brand-blue"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setIsOpen(false);
                }}
                title="Search"
              >
                <Search size={17} />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    className="fixed left-4 right-4 top-[68px] bg-white rounded-2xl shadow-lg border border-brand-blue-pale overflow-hidden"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && goToTopResult()}
                      placeholder="Search pages..."
                      className="w-full px-4 py-3 text-sm text-brand-blue outline-none border-b border-brand-blue-pale"
                    />
                    {searchQuery.trim() && (
                      <div className="max-h-64 overflow-y-auto py-1">
                        {searchResults.length > 0 ? (
                          searchResults.map((r) => (
                            <a
                              key={r.href}
                              href={r.href}
                              className="block px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue-pale hover:text-brand-orange transition-colors"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              {r.label}
                            </a>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-brand-blue/50">
                            No pages found.
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isClient ? (
              <a href="/client" className="text-brand-blue" title="My Profile">
                <User size={20} />
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="hidden min-[400px]:block text-brand-blue font-medium text-sm"
                >
                  Login
                </a>
                <Button
                  size="sm"
                  onClick={() => (window.location.href = "/signup")}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu — full-screen overlay, portaled to escape the blurred sticky header */}
      {createPortal(
        <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between px-6 py-5 shrink-0">
              <a
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={logo}
                  alt="Fitness Zone"
                  className="h-10 w-10 object-contain"
                />
                <span className="font-display text-brand-blue text-sm tracking-wide">
                  FITNESS <span className="text-brand-orange">ZONE</span>
                </span>
              </a>
              <button
                className="text-brand-blue"
                onClick={() => setIsOpen(false)}
              >
                <X size={26} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-10 flex flex-col">
              <div className="flex flex-col mt-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="text-brand-blue text-2xl font-display py-3 border-b border-brand-blue-pale/60"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}

                <button
                  onClick={() => setIsMobilePackagesOpen(!isMobilePackagesOpen)}
                  className="flex items-center justify-between text-brand-blue text-2xl font-display py-3 border-b border-brand-blue-pale/60"
                >
                  Packages
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${isMobilePackagesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isMobilePackagesOpen && (
                    <motion.div
                      className="flex flex-col pl-2 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {packageOptions.map((opt) => (
                        <a
                          key={opt.type}
                          href={`/plans?type=${opt.type}`}
                          className="text-brand-blue/70 text-base py-2.5"
                          onClick={() => setIsOpen(false)}
                        >
                          {opt.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-blue/70 text-sm"
                >
                  <MessageCircle size={19} />
                  WhatsApp
                </a>
                <a
                  href={instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-blue/70 text-sm"
                >
                  <InstagramIcon size={19} />
                  Instagram
                </a>
              </div>

              <div className="mt-auto pt-8">
                {isClient ? (
                  <div className="flex flex-col gap-4">
                    <a
                      href="/client"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-brand-blue font-medium text-lg"
                    >
                      <User size={20} />
                      My Profile
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 text-brand-blue/60 font-medium text-lg text-left"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <a
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-brand-blue font-medium text-lg"
                    >
                      Login
                    </a>
                    <Button
                      onClick={() => (window.location.href = "/signup")}
                      className="w-full"
                    >
                      Join Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
};

export default Navbar;
