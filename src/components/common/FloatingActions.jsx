import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import WhatsAppIcon from "./WhatsAppIcon";

const FloatingActions = () => {
  const { role } = useAuth();
  const { settings } = useSettings();
  const isClient = role === "client";
  const whatsappLink = `https://wa.me/${settings.whatsapp_general}`;

  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-blue text-white shadow-lg hover:scale-105 transition-transform"
            title="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
      {isClient && (
        <motion.a
          href="/client"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-blue text-white shadow-lg hover:scale-105 transition-transform"
          title="My Profile"
        >
          <User size={20} />
        </motion.a>
      )}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon size={26} />
      </motion.a>
    </div>
  );
};

export default FloatingActions;
