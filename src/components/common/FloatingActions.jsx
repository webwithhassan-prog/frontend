import { motion } from "framer-motion";
import { MessageCircle, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// TODO: add your WhatsApp number here, e.g. "https://wa.me/923001234567"
const whatsappLink = "https://wa.me/";

const FloatingActions = () => {
  const { role } = useAuth();
  const isClient = role === "client";

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-3">
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
        <MessageCircle size={24} fill="white" />
      </motion.a>
    </div>
  );
};

export default FloatingActions;
