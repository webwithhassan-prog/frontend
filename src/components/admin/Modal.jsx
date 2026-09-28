import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import useLockBodyScroll from "../../hooks/useLockBodyScroll";

// Portaled to <body>: rendered in place, a transformed ancestor (any
// animated card or section) would become the containing block for its
// `fixed` backdrop, and the sticky navbar (same z-index, earlier in the
// page) could paint over it.
const Modal = ({ isOpen, onClose, title, children }) => {
  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[70] px-4 py-8 overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 my-auto max-h-full overflow-y-auto overscroll-contain"
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
                className="text-brand-blue-light hover:text-brand-blue rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
