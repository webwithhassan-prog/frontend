import { useEffect, useState } from "react";
import { Copy, Check, Upload, X as XIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../../services/api";
import { useSettings } from "../../context/SettingsContext";
import { getErrorMessage } from "../../utils/errors";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

const CLOUDINARY_CLOUD_NAME = "zyfxigcj";
const CLOUDINARY_UPLOAD_PRESET = "FitnessZone";

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
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [slipWasUploaded, setSlipWasUploaded] = useState(false);

  // `methods` usually arrives after this component's first render (it's
  // fetched async by the parent) — the useState initializer above only
  // runs once, so without this, opening the panel before that fetch
  // resolves leaves selectedId stuck at null forever, hiding the account
  // details entirely even once methods populate.
  useEffect(() => {
    if (!selectedId && methods.length > 0) {
      setSelectedId(methods[0]._id);
    }
  }, [methods, selectedId]);

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success("Copied");
    setTimeout(() => setCopiedField(""), 1500);
  };

  const handleSlipChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
  };

  const handleRemoveSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
  };

  const uploadSlipToCloudinary = async () => {
    const uploadData = new FormData();
    uploadData.append("file", slipFile);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      uploadData,
    );
    return res.data.secure_url;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let slipUrl = null;
      if (slipFile) {
        setUploadingSlip(true);
        try {
          slipUrl = await uploadSlipToCloudinary();
        } finally {
          setUploadingSlip(false);
        }
      }

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
        slip_url: slipUrl,
      });

      const method = methods.find((m) => m._id === selectedId);
      if (!slipUrl) {
        const message = `Hi! I've sent payment for "${itemLabel}" (${amountLabel}) via ${method?.name}. Attaching my payment screenshot here.`;
        window.open(
          `https://wa.me/${settings.whatsapp_general}?text=${encodeURIComponent(message)}`,
          "_blank",
        );
      }
      setSlipWasUploaded(Boolean(slipUrl));
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
          {slipWasUploaded ? (
            "Your screenshot was received. Your account will be activated as soon as your payment is verified."
          ) : (
            <>
              Your account will be activated as soon as your payment is
              verified. If WhatsApp didn't open, send your screenshot to{" "}
              <span className="font-semibold">
                +{settings.whatsapp_general}
              </span>{" "}
              directly.
            </>
          )}
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
        Transfer {amountLabel} to the account above, then attach your payment
        screenshot below (or send it on WhatsApp instead) so we can verify
        and activate your purchase.
      </p>

      <div>
        <p className="text-[10px] text-brand-blue-light uppercase tracking-wide mb-1.5">
          Payment Screenshot (optional)
        </p>
        {slipPreview ? (
          <div className="relative inline-block">
            <img
              src={slipPreview}
              alt="Payment slip preview"
              className="h-24 rounded-lg border border-brand-blue-pale object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveSlip}
              className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 text-brand-blue-light hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              aria-label="Remove screenshot"
            >
              <XIcon size={14} />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-brand-blue-pale rounded-lg py-3 text-xs font-medium text-brand-blue-light cursor-pointer hover:border-brand-orange hover:text-brand-orange transition-colors">
            <Upload size={14} />
            Upload screenshot
            <input
              type="file"
              accept="image/*"
              onChange={handleSlipChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-semibold text-sm py-3 rounded-full hover:bg-brand-orange/90 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        {uploadingSlip
          ? "Uploading screenshot..."
          : submitting
            ? "Submitting..."
            : "I've Sent the Payment"}
      </button>
    </div>
  );
};

export default ManualPaymentPanel;
