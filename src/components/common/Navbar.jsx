import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  User,
  LogOut,
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
  { label: "Timetable", href: "/timetable" },
  { label: "Jobs", href: "/careers" },
  { label: "E-Books", href: "/ebooks" },
];

// TODO: add your WhatsApp number here, e.g. "https://wa.me/923001234567"
const whatsappLink = "https://wa.me/";
const instagramLink = "https://www.instagram.com/fitness_zone5566";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isMobilePackagesOpen, setIsMobilePackagesOpen] = useState(false);
  const { role, logout } = useAuth();
  const isClient = role === "client";

  return (
    <div className="sticky top-0 z-50 px-4 md:px-8 pt-4">
      <nav className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-brand-blue-pale/60">
        <div className="flex items-center justify-between px-5 py-2.5">
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

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-brand-blue font-medium text-sm px-4 py-2 rounded-full hover:bg-brand-blue-pale transition-colors"
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
              <button className="flex items-center gap-1 text-brand-blue font-medium text-sm px-4 py-2 rounded-full hover:bg-brand-blue-pale transition-colors">
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

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-brand-blue"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — floats below the pill */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="lg:hidden max-w-6xl mx-auto mt-3 bg-white rounded-3xl shadow-lg border border-brand-blue-pale/60 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-brand-blue font-medium py-2 px-2 rounded-lg hover:bg-brand-blue-pale transition-colors"
                >
                  {link.label}
                </a>
              ))}

              <button
                onClick={() => setIsMobilePackagesOpen(!isMobilePackagesOpen)}
                className="flex items-center justify-between text-brand-blue font-medium py-2 px-2 rounded-lg hover:bg-brand-blue-pale transition-colors"
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

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-blue font-medium py-2 px-2 rounded-lg hover:bg-brand-blue-pale transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-brand-blue font-medium py-2 px-2 rounded-lg hover:bg-brand-blue-pale transition-colors"
              >
                <InstagramIcon size={18} />
                Instagram
              </a>

              {isClient ? (
                <>
                  <a
                    href="/client"
                    className="flex items-center gap-2 text-brand-blue font-medium py-2 px-2 rounded-lg hover:bg-brand-blue-pale transition-colors"
                  >
                    <User size={18} />
                    My Profile
                  </a>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-brand-blue/70 font-medium py-2 px-2 rounded-lg hover:bg-brand-blue-pale transition-colors text-left"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-brand-blue font-medium py-2 px-2 rounded-lg hover:bg-brand-blue-pale transition-colors"
                  >
                    Login
                  </a>
                  <div className="pt-2">
                    <Button
                      onClick={() => (window.location.href = "/signup")}
                      className="w-full"
                    >
                      Join Now
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
