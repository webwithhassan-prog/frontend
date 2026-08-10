import { motion } from "framer-motion";
import logo from "../../assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white mt-20">
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
        </div>

        <div>
          <h4 className="font-display text-sm mb-4 tracking-wide">
            QUICK LINKS
          </h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Packages", "Trainers", "Careers", "Contact"].map(
              (link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="text-brand-blue-pale/70"
                    whileHover={{ x: 4, color: "#F76B1C" }}
                    transition={{ duration: 0.2 }}
                  >
                    {link}
                  </motion.a>
                </li>
              ),
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm mb-4 tracking-wide">
            GET IN TOUCH
          </h4>
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
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-xs text-brand-blue-pale/60">
        © {new Date().getFullYear()} Fitness Zone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
