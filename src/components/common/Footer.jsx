import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-nav.png";
import WhatsAppIcon from "./WhatsAppIcon";
import { useSettings } from "../../context/SettingsContext";

const MotionLink = motion.create(Link);

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/plans" },
  { label: "Time Slots", href: "/timetable" },
  { label: "Trainers", href: "/trainers" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "E-Books & Courses", href: "/ebooks" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            {/* A white disc, not the logo's own white square: the mark's
                dark lettering needs a light ground on the navy footer. */}
            <span className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <img src={logo} alt="Fitness Zone" className="h-8 w-8 object-contain" />
            </span>
            <span className="font-display text-white text-sm tracking-wide">
              FITNESS <span className="text-brand-orange">ZONE</span>
            </span>
          </div>
          <p className="text-brand-blue-pale/70 text-sm">
            Dietplans and home workouts — built for women.
          </p>
          <p className="text-brand-blue-pale/50 text-xs mt-4 leading-relaxed">
            Director / Founder: M Abu Bakar Siddique
            <br />
            Office 20790, 182–184 High Street North,
            <br />
            London, United Kingdom, E6 2JA
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm mb-4 tracking-wide">
            QUICK LINKS
          </h4>
          {/* Every public page is linked here — real links are how search
              engines find pages, and some (Success Stories) had no other
              crawlable link on the site. */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <MotionLink
                  to={link.href}
                  className="text-brand-blue-pale/70 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  whileHover={{ x: 4, color: "#F76B1C" }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </MotionLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm mb-4 tracking-wide">
            GET IN TOUCH
          </h4>
          <div className="flex flex-col items-start gap-3">
            <motion.a
              href={`https://wa.me/${settings.whatsapp_general}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-orange px-5 py-2 rounded-full font-semibold text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <WhatsAppIcon size={16} />
              Chat on WhatsApp
            </motion.a>
            <motion.a
              href="https://www.instagram.com/fitness_zone5566"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white/30 px-5 py-2 rounded-full font-semibold text-sm text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Follow on Instagram
            </motion.a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-xs text-brand-blue-pale/60">
        © {new Date().getFullYear()} Fitness Zone. All rights reserved.
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 px-4 text-xs text-brand-blue-pale/50">
          {legalLinks.map((link, i) => (
            <span key={link.href} className="flex gap-4">
              {i > 0 && <span aria-hidden="true">·</span>}
              <Link
                to={link.href}
                className="hover:text-brand-orange transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
