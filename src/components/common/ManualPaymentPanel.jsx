import { useState } from "react";
import { Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useSettings } from "../../context/SettingsContext";
import { getErrorMessage } from "../../utils/errors";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

// Shown to clients whose detected country has at least one admin-configured
// manual (non-Stripe) payment method — Stripe can't process most local
// bank/wallet rails directly, so this is a fully manual flow: the client
// transfers to the account shown here, taps "I've Sent the Payment" (which
// logs a pending claim and opens WhatsApp with the details pre-filled for
// them to attach a screenshot), and an admin verifies + activates the
// purchase from the admin Manual Payments screen once the transfer shows
// up in the real account. Which methods appear, for which countries, is
// entirely admin-managed (see admin/ManualPaymentMethods.jsx) — nothing
// here is hardcoded to a specific bank or country.
const ManualPaymentPanel = ({
  methods,
  type, // "package" | "ebook" | "course"
  planIds,
  ebookId,
  courseId,
  couponCode,
  itemLabel,
  amountLabel,
  currencyCode,
}) => {
  const { settings } = useSettings();
  const [selectedId, setSelectedId] = useState(methods[0]?._id || null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success("Copied");
    setTimeout(() => setCopiedField(""), 1500);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const clientId = localStorage.getItem("client_id");
      await api.post("/payments/manual/initiate", {
        client_id: clientId,
        type,
        plan_ids: planIds,
        ebook_id: ebookId,
        course_id: courseId,
        coupon_code: couponCode,
        method_id: selectedId,
        currency_code: currencyCode,
      });

      const method = methods.find((m) => m._id === selectedId);
      const message = `Hi! I've sent payment for "${itemLabel}" (${amountLabel}) via ${method?.name}. Attaching my payment screenshot here.`;
      window.open(
        `https://wa.me/${settings.whatsapp_general}?text=${encodeURIComponent(message)}`,
        "_blank",
      );
      setSubmitted(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  if (methods.length === 0) return null;

  if (submitted) {
    return (
      <div className="bg-brand-blue-pale/40 border border-brand-blue-pale rounded-xl p-4 text-center">
        <p className="text-brand-blue text-sm font-semibold mb-1">
          Payment submitted
        </p>
        <p className="text-brand-blue/70 text-xs leading-relaxed">
          Your account will be activated as soon as your payment is verified.
          If WhatsApp didn't open, send your screenshot to{" "}
          <span className="font-semibold">+{settings.whatsapp_general}</span>{" "}
          directly.
        </p>
      </div>
    );
  }

  const selectedMethod = methods.find((m) => m._id === selectedId);

  return (
    <div className="border border-brand-blue-pale rounded-xl p-4 space-y-4">
      <div className="flex gap-2">
        {methods.map((m) => (
          <button
            key={m._id}
            type="button"
            onClick={() => setSelectedId(m._id)}
            className={`flex-1 flex items-center justify-center p-2.5 rounded-lg border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              selectedId === m._id
                ? "border-brand-orange bg-brand-orange/5"
                : "border-brand-blue-pale hover:border-brand-blue-pale/70"
            }`}
            aria-label={`Pay via ${m.name}`}
            title={m.name}
          >
            {m.logo_url ? (
              <img
                src={optimizeCloudinaryUrl(m.logo_url, 200)}
                alt={m.name}
                className="h-5 object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-brand-blue">{m.name}</span>
            )}
          </button>
        ))}
      </div>

      {selectedMethod && (
        <div className="space-y-2">
          {selectedMethod.fields.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between gap-2 bg-brand-blue-pale/30 rounded-lg px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-[10px] text-brand-blue-light uppercase tracking-wide">
                  {f.label}
                </p>
                <p className="text-sm font-semibold text-brand-blue truncate">
                  {f.value}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(f.value, f.label)}
                className="shrink-0 text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                aria-label={`Copy ${f.label}`}
              >
                {copiedField === f.label ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-brand-blue-light leading-relaxed">
        Transfer {amountLabel} to the account above, then tap the button
        below — you'll be asked to send your payment screenshot on WhatsApp
        so we can verify and activate your purchase.
      </p>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold text-sm py-3 rounded-full hover:bg-brand-orange/90 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        {submitting ? "Submitting..." : "I've Sent the Payment"}
      </button>
    </div>
  );
};

export default ManualPaymentPanel;
