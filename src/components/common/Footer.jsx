import { motion } from "framer-motion";
import logo from "../../assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logo}
              alt="Fitness Zone"
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-white text-sm tracking-wide">
              FITNESS <span className="text-brand-orange">ZONE</span>
            </span>
          </div>
          <p className="text-brand-blue-pale/70 text-sm">
            Dietplans, live workouts, and consultations — built for women.
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
          <ul className="space-y-2 text-sm">
            {[
              { label: "Home", href: "/" },
              { label: "Packages", href: "/plans" },
              { label: "Trainers", href: "/trainers" },
              { label: "Careers", href: "/careers" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <li key={link.label}>
                <motion.a
                  href={link.href}
                  className="text-brand-blue-pale/70"
                  whileHover={{ x: 4, color: "#F76B1C" }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.a>
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
              href="https://wa.me/yourNumber"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-orange px-5 py-2 rounded-full font-semibold text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Chat on WhatsApp
            </motion.a>
            <motion.a
              href="https://www.instagram.com/fitness_zone5566"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-white/30 px-5 py-2 rounded-full font-semibold text-sm text-white/90"
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
        <div className="flex justify-center gap-4 mt-2 text-xs text-brand-blue-pale/50">
          <a
            href="/privacy-policy"
            className="hover:text-brand-orange transition-colors"
          >
            Privacy Policy
          </a>
          <span>·</span>
          <a
            href="/terms"
            className="hover:text-brand-orange transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
