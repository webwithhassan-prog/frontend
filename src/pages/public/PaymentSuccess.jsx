import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { trackEvent } from "../../utils/analytics";

const PaymentSuccess = () => {
  useEffect(() => {
    trackEvent("payment_success_viewed", "/payment-success");
  }, []);

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex bg-green-100 rounded-full p-4 mb-5"
          >
            <CheckCircle2 size={40} className="text-green-600" />
          </motion.div>
          <h1 className="font-display text-2xl text-brand-blue mb-3">
            PAYMENT SUCCESSFUL
          </h1>
          <p className="text-brand-blue/70 mb-8 leading-relaxed">
            You're all set — your package is now active. A receipt has been
            sent to your email, and everything's ready in your profile.
          </p>
          <Button
            onClick={() => (window.location.href = "/client")}
            className="w-full"
          >
            Go to My Profile
          </Button>
        </Card>
      </motion.div>
    </section>
  );
};

export default PaymentSuccess;
