import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import WhatsAppIcon from "../../components/common/WhatsAppIcon";
import logo from "../../assets/logo.jpeg";
import { useCurrency } from "../../context/CurrencyContext";
import { useSettings } from "../../context/SettingsContext";
import { getErrorMessage } from "../../utils/errors";

const InvoiceSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState("");
  const [slipSaved, setSlipSaved] = useState(false);
  const slipRef = useRef(null);
  const { currencies } = useCurrency();
  const { settings } = useSettings();

  const symbolFor = (code) =>
    currencies.find((c) => c.code === code)?.symbol || "₹";
  const displayAmount = invoice
    ? (invoice.amount_display ?? invoice.amount).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })
    : "";
  const displaySymbol = invoice
    ? symbolFor(invoice.currency_code || "INR").trim()
    : "₹";

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    api
      .get(`/custom-invoices/session/${sessionId}`)
      .then((res) => setInvoice(res.data))
      .catch((err) =>
        setError(getErrorMessage(err, "Could not load invoice")),
      )
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleSaveSlip = async () => {
    if (!slipRef.current) return;
    const dataUrl = await toPng(slipRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${invoice?.invoice_number || "invoice"}.png`;
    link.href = dataUrl;
    link.click();
    setSlipSaved(true);
  };

  const shareText = invoice
    ? `Hi! Here's my payment confirmation for Invoice ${invoice.invoice_number} (${displaySymbol}${displayAmount}) — attaching the saved slip.`
    : "";
  const whatsappShareLink = `https://wa.me/${settings.whatsapp_general}?text=${encodeURIComponent(shareText)}`;

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
          <p className="text-brand-blue/70 leading-relaxed">
            Thank you — your payment has been received. Your invoice slip is
            below.
          </p>
        </Card>
      </motion.div>

      {!loading && error && (
        <p className="text-red-500 text-sm mt-8 max-w-md text-center">
          {error}
        </p>
      )}

      {!loading && invoice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="w-full max-w-md mt-8"
        >
          <div
            ref={slipRef}
            className="bg-white border-2 border-brand-blue rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Fitness Zone" className="h-9 w-9 object-contain" />
                <span className="font-display text-brand-blue text-sm tracking-wide">
                  FITNESS <span className="text-brand-orange">ZONE</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wide">
                Paid
              </span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-brand-blue/50 text-xs uppercase tracking-wide mb-1">
                  Invoice To
                </p>
                <p className="font-display text-brand-blue text-lg">
                  {invoice.client_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-brand-blue/50 text-xs uppercase tracking-wide mb-1">
                  Invoice No.
                </p>
                <p className="font-display text-brand-blue text-lg">
                  {invoice.invoice_number}
                </p>
              </div>
            </div>

            <p className="text-brand-blue/50 text-xs mb-6">
              Paid on{" "}
              {invoice.paid_at
                ? new Date(invoice.paid_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "just now"}
            </p>

            <div className="flex items-center justify-between text-sm border-b border-brand-blue-pale pb-3 mb-3">
              <span className="text-brand-blue">{invoice.description}</span>
              <span className="text-brand-blue font-medium">
                {displaySymbol}
                {displayAmount}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-display text-brand-blue text-sm">
                TOTAL
              </span>
              <span className="font-display text-brand-blue text-lg">
                {displaySymbol}
                {displayAmount}
              </span>
            </div>

            <div className="mt-6 text-xs text-brand-orange font-semibold">
              FITNESS ZONE • Payment Invoice
            </div>
            {invoice.verification_code && (
              <div className="mt-1 text-[10px] text-brand-blue/30 tracking-wide">
                Verification: {invoice.verification_code}
              </div>
            )}
          </div>

          <Button onClick={handleSaveSlip} className="w-full mt-4">
            <span className="flex items-center justify-center gap-2">
              <Download size={16} /> Save Invoice Slip
            </span>
          </Button>

          {slipSaved && (
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              href={whatsappShareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-3 bg-[#25D366] text-white font-semibold rounded-full px-6 py-3 hover:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            >
              <WhatsAppIcon size={18} />
              Share with Support on WhatsApp
            </motion.a>
          )}
          {slipSaved && (
            <p className="text-brand-blue/50 text-xs text-center mt-2">
              Attach the slip you just saved to the chat.
            </p>
          )}
        </motion.div>
      )}
    </section>
  );
};

export default InvoiceSuccess;
