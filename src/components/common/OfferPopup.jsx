import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Button from "./Button";
import { trackEvent } from "../../utils/analytics";

const DISMISSED_KEY = "dismissed_offer_id";

const OfferPopup = () => {
  const [offer, setOffer] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    const fetchOffer = async () => {
      try {
        const res = await api.get("/offers/public");
        const active = res.data?.[0];
        if (!active) return;
        const dismissKey = `${active._id}:${active.updatedAt}`;
        if (sessionStorage.getItem(DISMISSED_KEY) === dismissKey) return;
        setOffer(active);
        timer = setTimeout(() => {
          setVisible(true);
          trackEvent("offer_popup_view", window.location.pathname, {
            offerId: active._id,
          });
        }, 1200);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOffer();
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (offer) {
      sessionStorage.setItem(DISMISSED_KEY, `${offer._id}:${offer.updatedAt}`);
    }
  };

  const handleCta = () => {
    trackEvent("offer_popup_click", window.location.pathname, {
      offerId: offer._id,
    });
    handleClose();
    navigate(offer.cta_link);
  };

  if (!offer) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm p-8 pt-10 text-center overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-brand-orange to-brand-gold" />
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-brand-blue/40 hover:text-brand-blue"
            >
              <X size={20} />
            </button>
            <span className="inline-block text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Special Offer
            </span>
            {offer.discount_percent > 0 && (
              <p className="font-display text-4xl text-brand-orange mb-2">
                {offer.discount_percent}% OFF
              </p>
            )}
            <h3 className="font-display text-xl text-brand-blue mb-2">
              {offer.title}
            </h3>
            <p className="text-brand-blue/70 text-sm mb-6">{offer.message}</p>
            <Button onClick={handleCta} className="w-full">
              {offer.cta_label}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfferPopup;
