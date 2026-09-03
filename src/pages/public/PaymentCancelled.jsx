import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const PaymentCancelled = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="text-center">
          <div className="inline-flex bg-brand-blue-pale rounded-full p-4 mb-5">
            <XCircle size={40} className="text-brand-blue/60" />
          </div>
          <h1 className="font-display text-2xl text-brand-blue mb-3">
            PAYMENT CANCELLED
          </h1>
          <p className="text-brand-blue/70 mb-8 leading-relaxed">
            No worries — nothing was charged. You can pick up right where you
            left off whenever you're ready.
          </p>
          <Button
            onClick={() => (window.location.href = "/plans")}
            className="w-full"
          >
            Back to Packages
          </Button>
        </Card>
      </motion.div>
    </section>
  );
};

export default PaymentCancelled;
