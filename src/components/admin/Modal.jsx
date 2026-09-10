import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 my-auto max-h-full overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              // Same reasoning as Button/Card: scale+y are physical motion
              // (popping in/out), so a well-damped spring reads as more
              // tactile than a flat tween. Higher damping than Button's
              // press — a bouncy modal feels silly, not premium. Opacity
              // stays a smooth tween.
              default: { duration: 0.25 },
              scale: { type: "spring", stiffness: 350, damping: 24 },
              y: { type: "spring", stiffness: 350, damping: 24 },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-brand-blue">{title}</h3>
              <button
                onClick={onClose}
                className="text-brand-blue-light hover:text-brand-blue"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
