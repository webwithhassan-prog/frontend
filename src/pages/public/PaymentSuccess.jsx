import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { trackEvent } from "../../utils/analytics";
import logo from "../../assets/logo.jpeg";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(!!sessionId);
  const receiptRef = useRef(null);

  useEffect(() => {
    trackEvent("payment_success_viewed", "/payment-success");

    if (!sessionId) return;
    api
      .get(`/payments/session/${sessionId}`)
      .then((res) => setReceipt(res.data))
      .catch(() => setReceipt(null))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSaveReceipt = async () => {
    if (!receiptRef.current) return;
    const dataUrl = await toPng(receiptRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "fitness-zone-receipt.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20">
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
            You're all set — your package is now active and ready in your
            profile.
          </p>
          <Button
            onClick={() => (window.location.href = "/client")}
            className="w-full"
          >
            Go to My Profile
          </Button>
        </Card>
      </motion.div>

      {!loading && receipt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-md mt-8"
        >
          <div
            ref={receiptRef}
            className="bg-white border-2 border-brand-blue rounded-2xl p-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <img src={logo} alt="Fitness Zone" className="h-9 w-9 object-contain" />
              <span className="font-display text-brand-blue text-sm tracking-wide">
                FITNESS <span className="text-brand-orange">ZONE</span>
              </span>
            </div>

            <p className="text-brand-blue/50 text-xs uppercase tracking-wide mb-1">
              Receipt for
            </p>
            <p className="font-display text-brand-blue text-lg mb-1">
              {receipt.clientName}
            </p>
            <p className="text-brand-blue/50 text-xs mb-6">
              {new Date(receipt.paidAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="space-y-2 mb-4">
              {receipt.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm border-b border-brand-blue-pale pb-2"
                >
                  <span className="text-brand-blue">{item.name}</span>
                  <span className="text-brand-blue font-medium">
                    Rs {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-display text-brand-blue text-sm">
                TOTAL
              </span>
              <span className="font-display text-brand-blue text-lg">
                Rs {receipt.total.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 text-xs text-brand-orange font-semibold">
              FITNESS ZONE • Payment Receipt
            </div>
          </div>

          <Button onClick={handleSaveReceipt} className="w-full mt-4">
            <span className="flex items-center justify-center gap-2">
              <Download size={16} /> Save Receipt Image
            </span>
          </Button>
        </motion.div>
      )}
    </section>
  );
};

export default PaymentSuccess;
