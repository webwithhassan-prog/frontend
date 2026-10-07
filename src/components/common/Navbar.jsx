import { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Search,
} from "lucide-react";
import Button from "./Button";
import InstagramIcon from "./InstagramIcon";
import WhatsAppIcon from "./WhatsAppIcon";
// Trimmed, transparent-background mark (scripts/generate-nav-logo.mjs) —
// logo.jpeg is a white square, which showed as a box on the translucent
// header whenever a coloured section scrolled underneath.
import logo from "../../assets/logo-nav.png";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

// Program pages, listed under the packages in the Packages menu.
const programOptions = [
  { label: "Hormonal Im-Balances", href: "/postpartum-weight-loss" },
];

const packageOptions = [
  { label: "Both Combined", type: "combo" },
  { label: "Customized Dietplan Only", type: "dietplan" },
  { label: "live Workouts Only", type: "workout" },
  
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Time Slots", href: "/timetable" },
  { label: "Careers", href: "/careers" },
  { label: "E-Books & Courses", href: "/ebooks" },
];

// `keywords` widen what a search query matches without cluttering the
// label shown in results — e.g. searching "diet plan" or "workout" should
// find the pricing page even though its label is "Packages & Pricing".
const searchablePages = [
  { label: "Home", href: "/" },
  {
    label: "Packages & Pricing",
    href: "/plans",
    keywords: "packages pricing plans dietplan diet plan workout home workout combo membership subscribe",
  },
  { label: "Time Slots", href: "/timetable", keywords: "schedule classes timetable" },
  { label: "Careers", href: "/careers", keywords: "jobs job trainer apply hiring work" },
  {
    label: "E-Books & Courses",
    href: "/ebooks",
    keywords: "ebook ebooks course courses guide guides recipes",
  },
  { label: "Trainers", href: "/trainers" },
  {
    label: "Success Stories",
    href: "/success-stories",
    keywords: "testimonials reviews results",
  },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const instagramLink = "https://www.instagram.com/fitness_zone5566";

// In-app links (no full page reload); the mobile menu animates its items.
const MotionLink = motion.create(Link);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();
  const whatsappLink = `https://wa.me/${settings.whatsapp_general}`;
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isMobilePackagesOpen, setIsMobilePackagesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dynamicSearchItems, setDynamicSearchItems] = useState([]);
  const [dynamicFetched, setDynamicFetched] = useState(false);
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const isClient = role === "client";

  // Fetched once, on first open — real trainer names and class types are
  // admin-editable and shouldn't require a code change to stay searchable,
  // unlike the static page list above.
  const fetchDynamicSearchItems = async () => {
    if (dynamicFetched) return;
    setDynamicFetched(true);
    try {
      const [trainersRes, dayPlansRes] = await Promise.all([
        api.get("/trainers/public"),
        api.get("/day-plans/public"),
      ]);
      const trainerItems = trainersRes.data.map((t) => ({
        key: `trainer-${t._id}`,
        label: t.specialty ? `${t.name} — ${t.specialty}` : t.name,
        href: "/trainers",
      }));
      const seenTypes = new Set();
      const classTypeItems = [];
      dayPlansRes.data.forEach((p) => {
        if (p.type && !seenTypes.has(p.type)) {
          seenTypes.add(p.type);
          classTypeItems.push({
            key: `class-${p.type}`,
            label: p.type,
            href: "/timetable",
          });
        }
      });
      setDynamicSearchItems([...trainerItems, ...classTypeItems]);
    } catch (err) {
      console.error(err);
    }
  };

  const openSearch = () => {
    setIsSearchOpen((open) => !open);
    setIsOpen(false);
    fetchDynamicSearchItems();
  };

  const allSearchItems = [
    ...searchablePages.map((p) => ({ ...p, key: p.href })),
    ...dynamicSearchItems,
  ];

  const searchResults = searchQuery.trim()
    ? allSearchItems.filter((p) =>
        `${p.label} ${p.keywords || ""}`
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase()),
      )
    : [];

  const goToResult = (result) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(result.href);
  };

  const goToTopResult = () => {
    if (searchResults[0]) goToResult(searchResults[0]);
  };

  useLockBodyScroll(isOpen);

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-blue-pale/60">
      <nav className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="Fitness Zone"
                className="h-11 w-11 object-contain"
              />
              <span className="font-display text-brand-blue text-lg tracking-wide hidden sm:block">
                FITNESS <span className="text-brand-orange">ZONE</span>
              </span>
            </Link>

            {/* Mobile hamburger — next to the logo */}
            <button
              className="lg:hidden w-9 h-9 flex items-center justify-center text-brand-blue rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              onClick={() => {
                setIsOpen(!isOpen);
                setIsSearchOpen(false);
              }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-brand-blue/80 font-medium text-sm px-2 xl:px-3 py-2 whitespace-nowrap hover:text-brand-orange transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}

            {/* Packages dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPackagesOpen(true)}
              onMouseLeave={() => setIsPackagesOpen(false)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsPackagesOpen(false);
                }
              }}
            >
              <button
                className="flex items-center gap-1 text-brand-blue/80 font-medium text-sm px-3 py-2 hover:text-brand-orange transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                onClick={() => setIsPackagesOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={isPackagesOpen}
              >
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
                        <Link
                          key={opt.type}
                          to={`/plans?type=${opt.type}`}
                          onClick={() => setIsPackagesOpen(false)}
                          className="block px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue-pale hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                        >
                          {opt.label}
                        </Link>
                      ))}
                      <p className="px-4 pt-3 pb-1 mt-1 border-t border-brand-blue-pale text-[11px] font-bold uppercase tracking-wider text-brand-blue/60">
                        Programs
                      </p>
                      {programOptions.map((opt) => (
                        <Link
                          key={opt.href}
                          to={opt.href}
                          onClick={() => setIsPackagesOpen(false)}
                          className="block px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue-pale hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                        >
                          {opt.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4 pl-4 ml-2 border-l border-brand-blue-pale">
            <div className="relative flex items-center">
              <button
                className="flex items-center text-brand-blue/70 hover:text-brand-orange transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                onClick={openSearch}
                title="Search"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-lg border border-brand-blue-pale overflow-hidden"
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
                      placeholder="Search pages, trainers, classes..."
                      className="w-full px-4 py-3 text-sm text-brand-blue outline-none border-b border-brand-blue-pale"
                    />
                    {searchQuery.trim() && (
                      <div className="max-h-72 overflow-y-auto py-1">
                        {searchResults.length > 0 ? (
                          searchResults.map((r) => (
                            <button
                              key={r.key}
                              onClick={() => goToResult(r)}
                              className="block w-full text-left px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue-pale hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:bg-brand-blue-pale"
                            >
                              {r.label}
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-brand-blue/50">
                            No results found.
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue/70 hover:text-brand-orange transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={19} />
            </a>
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue/70 hover:text-brand-orange transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
              title="Follow us on Instagram"
              aria-label="Follow us on Instagram"
            >
              <InstagramIcon size={19} />
            </a>

            {isClient ? (
              <>
                <Link
                  to="/client"
                  className="flex items-center gap-1.5 text-brand-blue font-medium text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                >
                  <User size={16} />
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-brand-blue/70 hover:text-brand-orange text-sm transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-brand-blue font-medium text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                >
                  Login
                </Link>
                <Button to="/signup">
                  Join Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile bar: search, login, signup */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="relative">
              <button
                className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-blue-pale/60 text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                onClick={openSearch}
                title="Search"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    className="fixed left-4 right-4 top-[84px] bg-white rounded-2xl shadow-lg border border-brand-blue-pale overflow-hidden"
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
                      placeholder="Search pages, trainers, classes..."
                      className="w-full px-4 py-3 text-sm text-brand-blue outline-none border-b border-brand-blue-pale"
                    />
                    {searchQuery.trim() && (
                      <div className="max-h-64 overflow-y-auto py-1">
                        {searchResults.length > 0 ? (
                          searchResults.map((r) => (
                            <button
                              key={r.key}
                              onClick={() => goToResult(r)}
                              className="block w-full text-left px-4 py-2.5 text-sm text-brand-blue hover:bg-brand-blue-pale hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:bg-brand-blue-pale"
                            >
                              {r.label}
                            </button>
                          ))
                        ) : (
                          <p className="px-4 py-3 text-sm text-brand-blue/50">
                            No results found.
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isClient ? (
              <Link
                to="/client"
                className="text-brand-blue rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                title="My Profile"
                aria-label="My Profile"
              >
                <User size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden min-[400px]:block text-brand-blue font-medium text-sm"
                >
                  Login
                </Link>
                <Button
                  size="sm"
                  to="/signup"
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
                <Link
                  to="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setIsOpen(false)}
                >
                  <img
                    src={logo}
                    alt="Fitness Zone"
                    className="h-11 w-11 object-contain"
                  />
                  <span className="font-display text-brand-blue text-lg tracking-wide">
                    FITNESS <span className="text-brand-orange">ZONE</span>
                  </span>
                </Link>
                <button
                  className="text-brand-blue rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={26} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-10 flex flex-col">
                <div className="flex flex-col mt-2">
                  {navLinks.map((link, i) => (
                    <MotionLink
                      key={link.href}
                      to={link.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="text-brand-blue text-2xl font-display py-3 border-b border-brand-blue-pale/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </MotionLink>
                  ))}

                  <button
                    onClick={() =>
                      setIsMobilePackagesOpen(!isMobilePackagesOpen)
                    }
                    className="flex items-center justify-between text-brand-blue text-2xl font-display py-3 border-b border-brand-blue-pale/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg"
                    aria-expanded={isMobilePackagesOpen}
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
                          <Link
                            key={opt.type}
                            to={`/plans?type=${opt.type}`}
                            className="text-brand-blue/70 text-base py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg"
                            onClick={() => setIsOpen(false)}
                          >
                            {opt.label}
                          </Link>
                        ))}
                        {programOptions.map((opt) => (
                          <Link
                            key={opt.href}
                            to={opt.href}
                            className="text-brand-blue/70 text-base py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg"
                            onClick={() => setIsOpen(false)}
                          >
                            {opt.label}
                          </Link>
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
                    className="flex items-center gap-2 text-brand-blue/70 text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <WhatsAppIcon size={19} />
                    WhatsApp
                  </a>
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-blue/70 text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <InstagramIcon size={19} />
                    Instagram
                  </a>
                </div>

                <div className="mt-auto pt-8">
                  {isClient ? (
                    <div className="flex flex-col gap-4">
                      <Link
                        to="/client"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 text-brand-blue font-medium text-lg rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      >
                        <User size={20} />
                        My Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-2 text-brand-blue/60 font-medium text-lg text-left rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      >
                        <LogOut size={20} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="text-brand-blue font-medium text-lg rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      >
                        Login
                      </Link>
                      <Button
                        to="/signup"
                        onClick={() => setIsOpen(false)}
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
