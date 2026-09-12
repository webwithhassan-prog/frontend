import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Tag, X } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { trackEvent } from "../../utils/analytics";
import { useCurrency } from "../../context/CurrencyContext";
import CurrencySwitcher from "../../components/common/CurrencySwitcher";
import { getErrorMessage } from "../../utils/errors";
import Modal from "../../components/admin/Modal";
import ManualPaymentPanel from "../../components/common/ManualPaymentPanel";
import { CURRENCY_TO_COUNTRY } from "../../utils/currencyToCountry";

const durations = [30, 90, 180];

const packageLabels = {
  dietplan: "Customized Dietplan",
  workout: "Home Workouts",
  combo: "Both Combined",
};

const packageTabs = [
  { type: "dietplan", label: "Dietplan" },
  { type: "workout", label: "Home Workouts" },
  { type: "combo", label: "Both Combined" },
];

const featuresByType = {
  dietplan: [
    "Dietitian support",
    "Home-based menu",
    "Health-specific / preferred food only",
    "Daily meal tracking",
    "Weekly follow-up",
    "Renews every 15 days",
  ],
  workout: [
    "Flexible timings",
    "50-55 minute sessions",
    "6 days a week",
    "Different workout daily",
    "Female trainers",
    "Recordings provided",
  ],
  combo: [
    "Everything in Customized Dietplan",
    "Everything in Home Workouts",
    "One package, one price",
  ],
};

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOutDuration, setCheckingOutDuration] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { format, currency } = useCurrency();

  const [couponInput, setCouponInput] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount_percent, applies_to }

  const [manualMethods, setManualMethods] = useState([]);
  const [manualPayFor, setManualPayFor] = useState(null); // { duration, planIds, amountLabel }

  const selectedType = searchParams.get("type") || "dietplan";

  // Which manual (non-Stripe) payment methods, if any, apply to the
  // country tied to the client's currently-selected currency — entirely
  // admin-managed, see admin/ManualPaymentMethods.jsx. Tied to the
  // currency (not the raw geo-detected country) so switching currency
  // manually also switches which methods show — a client can deliberately
  // reveal a country's methods by picking its currency, same as they'd
  // pick it to see prices in that currency.
  const manualMethodsCountry = CURRENCY_TO_COUNTRY[currency.code];
  useEffect(() => {
    if (!manualMethodsCountry) {
      setManualMethods([]);
      return;
    }
    api
      .get("/manual-payment-methods/public", { params: { country: manualMethodsCountry } })
      .then((res) => setManualMethods(res.data))
      .catch((err) => console.error(err));
  }, [manualMethodsCountry]);

  // A guest who clicked "Pay via Bank Transfer..." gets sent to signup with
  // the intent saved (see handleManualPayClick below) — once they're a
  // client, reopen the same manual-payment panel automatically instead of
  // making them find the button again.
  useEffect(() => {
    if (role !== "client") return;
    const raw = localStorage.getItem("pending_manual_payment");
    if (!raw) return;
    localStorage.removeItem("pending_manual_payment");
    try {
      const pending = JSON.parse(raw);
      if (pending.type === "package") {
        setManualPayFor({
          duration: pending.duration,
          planIds: pending.planIds,
          amountLabel: pending.amountLabel,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [role]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get("/plans/public");
        setPlans(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getSelectionForDuration = (duration) => {
    const dietplan = plans.find(
      (p) => p.product_type === "dietplan" && p.duration_days === duration,
    );
    const workout = plans.find(
      (p) => p.product_type === "workout" && p.duration_days === duration,
    );
    const combo = plans.find(
      (p) => p.product_type === "combo" && p.duration_days === duration,
    );

    if (selectedType === "dietplan") return dietplan ? [dietplan] : [];
    if (selectedType === "workout") return workout ? [workout] : [];
    // A dedicated combo plan (its own price + features) takes priority;
    // falling back to summing Dietplan + Workout keeps older durations
    // working before a combo price is set for them.
    if (selectedType === "combo") {
      if (combo) return [combo];
      return [dietplan, workout].filter(Boolean);
    }
    return [];
  };

  const startCheckout = async (planIds) => {
    try {
      const clientId = localStorage.getItem("client_id");
      const res = await api.post("/payments/stripe/checkout", {
        client_id: clientId,
        plan_ids: planIds,
        coupon_code: appliedCoupon?.code,
        currency_code: currency.code,
      });
      window.location.href = res.data.url;
    } catch (err) {
      const msg = getErrorMessage(err, "Checkout failed");
      setError(msg);
      toast.error(msg);
      setCheckingOutDuration(null);
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponChecking(true);
    setCouponError("");
    try {
      const typePlans = plans.filter((p) =>
        selectedType === "combo"
          ? p.product_type === "dietplan" || p.product_type === "workout"
          : p.product_type === selectedType,
      );
      const res = await api.post("/coupons/validate", {
        code,
        plan_ids: typePlans.map((p) => p._id),
      });
      setAppliedCoupon({
        code: code.toUpperCase(),
        discount_percent: res.data.discount_percent,
        applies_to: res.data.applies_to,
      });
      toast.success(`${code.toUpperCase()} applied — ${res.data.discount_percent}% off`);
    } catch (err) {
      setAppliedCoupon(null);
      const msg = getErrorMessage(err, "Invalid coupon code");
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponChecking(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const getBestDiscountPercent = (plan) => {
    const offerPercent = plan.discount_percent || 0;
    const couponPercent =
      appliedCoupon &&
      (appliedCoupon.applies_to === "all" ||
        appliedCoupon.applies_to === plan.product_type)
        ? appliedCoupon.discount_percent
        : 0;
    return Math.max(offerPercent, couponPercent);
  };

  const getPlanPrice = (plan) =>
    Math.round(plan.price * (1 - getBestDiscountPercent(plan) / 100));

  const handleCheckout = (duration) => {
    setError("");
    const selection = getSelectionForDuration(duration);

    if (selection.length === 0) {
      setError("This package/duration combination isn\u2019t available yet.");
      return;
    }

    const planIds = selection.map((p) => p._id);
    setCheckingOutDuration(duration);

    trackEvent("checkout_started", "/plans", {
      type: selectedType,
      duration,
    });

    if (role !== "client") {
      localStorage.setItem("pending_plan_ids", JSON.stringify(planIds));
      if (appliedCoupon?.code) {
        localStorage.setItem("pending_coupon_code", appliedCoupon.code);
      }
      navigate("/signup");
      return;
    }

    startCheckout(planIds);
  };

  const handleManualPayClick = (duration, selection, total) => {
    const planIds = selection.map((p) => p._id);
    const amountLabel = format(total);

    if (role !== "client") {
      localStorage.setItem(
        "pending_manual_payment",
        JSON.stringify({
          type: "package",
          duration,
          planIds,
          amountLabel,
          returnTo: `/plans?type=${selectedType}`,
        }),
      );
      navigate("/signup");
      return;
    }

    setManualPayFor({ duration, planIds, amountLabel });
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {packageLabels[selectedType]?.toUpperCase() || "PACKAGES"}
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-4">
        Choose the duration that works for you.
      </p>
      <div className="flex justify-center mb-6">
        <CurrencySwitcher />
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {packageTabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setSearchParams({ type: tab.type })}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              selectedType === tab.type
                ? "bg-brand-blue text-white"
                : "bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-sm mx-auto mb-14">
        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-3 bg-brand-blue-pale/50 border border-brand-blue-pale rounded-full px-4 py-2.5">
            <span className="flex items-center gap-2 text-sm text-brand-blue font-medium">
              <Tag size={15} className="text-brand-orange" />
              {appliedCoupon.code} — {appliedCoupon.discount_percent}% off
              applied
            </span>
            <button
              onClick={handleRemoveCoupon}
              className="text-brand-blue/50 hover:text-red-500 transition-colors rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              title="Remove coupon"
              aria-label="Remove coupon"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              placeholder="Have a coupon code?"
              className="flex-1 border border-brand-blue-pale rounded-full px-4 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleApplyCoupon}
              disabled={couponChecking || !couponInput.trim()}
            >
              {couponChecking ? "Checking..." : "Apply"}
            </Button>
          </div>
        )}
        {couponError && (
          <p className="text-red-500 text-xs text-center mt-2">
            {couponError}
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center text-sm mb-8">{error}</p>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {durations.map((duration, i) => {
            const selection = getSelectionForDuration(duration);
            const total = selection.reduce(
              (sum, p) => sum + getPlanPrice(p),
              0,
            );
            const originalTotal = selection.reduce(
              (sum, p) => sum + p.price,
              0,
            );
            const hasDiscount = selection.length > 0 && total < originalTotal;
            const discountPercent = hasDiscount
              ? Math.round((1 - total / originalTotal) * 100)
              : 0;
            const dietplan = selection.find(
              (p) => p.product_type === "dietplan",
            );
            // Looked up independently of `selection` because once a
            // dedicated combo plan exists, selection is just [combo] — but
            // the combo card should still show both plans' real feature
            // lists side by side, not only the combo's own summary.
            const dietplanForDuration = plans.find(
              (p) => p.product_type === "dietplan" && p.duration_days === duration,
            );
            const workoutForDuration = plans.find(
              (p) => p.product_type === "workout" && p.duration_days === duration,
            );
            const isDedicatedCombo =
              selectedType === "combo" &&
              selection.length === 1 &&
              selection[0].product_type === "combo";
            const dietPlansIncluded = isDedicatedCombo
              ? selection[0].diet_plans_included
              : selectedType === "dietplan"
                ? dietplan?.diet_plans_included
                : null;
            const isMiddle = i === 1;
            const perDay =
              selection.length > 0 ? Math.round(total / duration) : null;

            return (
              <motion.div
                key={duration}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={isMiddle ? "md:-mt-4" : ""}
              >
                <Card
                  className={`h-full flex flex-col ${
                    isMiddle
                      ? "border-brand-orange border-2 shadow-xl"
                      : ""
                  }`}
                >
                  {isMiddle && (
                    <span className="inline-block bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="font-display text-brand-blue text-lg mb-1">
                    {duration} Days
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display text-3xl text-brand-blue">
                      {selection.length > 0 ? format(total) : "—"}
                    </p>
                    {hasDiscount && (
                      <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-sm text-brand-blue/40 line-through">
                      {format(originalTotal)}
                    </p>
                  )}
                  {perDay && (
                    <p className="text-xs text-brand-blue/50 mb-4">
                      ≈ {format(perDay)} / day
                    </p>
                  )}

                  {dietPlansIncluded && (
                    <p className="text-sm text-brand-blue/70 mb-2">
                      Includes {dietPlansIncluded} diet plans
                    </p>
                  )}

                  {selectedType === "combo" ? (
                    <div className="grid grid-cols-2 gap-4 my-4 flex-1">
                      <div className="pr-4 border-r border-brand-blue-pale">
                        <p className="text-[11px] font-bold text-brand-blue uppercase tracking-wide mb-2.5">
                          Dietplan
                        </p>
                        <ul className="space-y-2">
                          {(dietplanForDuration?.features?.length
                            ? dietplanForDuration.features
                            : featuresByType.dietplan
                          ).map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-1.5 text-xs text-brand-blue/70"
                            >
                              <Check
                                size={14}
                                className="text-brand-orange mt-0.5 shrink-0"
                              />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pl-1">
                        <p className="text-[11px] font-bold text-brand-blue uppercase tracking-wide mb-2.5">
                          Home Workouts
                        </p>
                        <ul className="space-y-2">
                          {(workoutForDuration?.features?.length
                            ? workoutForDuration.features
                            : featuresByType.workout
                          ).map((f) => (
                            <li
                              key={f}
                              className="flex items-start gap-1.5 text-xs text-brand-blue/70"
                            >
                              <Check
                                size={14}
                                className="text-brand-orange mt-0.5 shrink-0"
                              />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-2.5 my-4 flex-1">
                      {(selection.length === 1 && selection[0].features?.length
                        ? selection[0].features
                        : featuresByType[selectedType] || []
                      ).map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-brand-blue/70"
                        >
                          <Check
                            size={16}
                            className="text-brand-orange mt-0.5 shrink-0"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button
                    onClick={() => handleCheckout(duration)}
                    disabled={checkingOutDuration === duration}
                    variant={isMiddle ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {checkingOutDuration === duration
                      ? "Redirecting..."
                      : "Pay with Card"}
                  </Button>
                  <p className="text-[11px] text-brand-blue-light text-center mt-1.5">
                    Instant Access
                  </p>

                  {manualMethods.length > 0 && selection.length > 0 && (
                    <>
                      <Button
                        onClick={() => handleManualPayClick(duration, selection, total)}
                        variant="secondary"
                        className="w-full mt-3"
                      >
                        {manualMethods.map((m) => m.name).join(" / ")}
                      </Button>
                      <p className="text-[11px] text-brand-blue-light text-center mt-1.5">
                        Instant Access (once your payment is verified by our team)
                      </p>
                    </>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!manualPayFor}
        onClose={() => setManualPayFor(null)}
        title="Manual Payment"
      >
        {manualPayFor && (
          <ManualPaymentPanel
            methods={manualMethods}
            type="package"
            planIds={manualPayFor.planIds}
            couponCode={appliedCoupon?.code}
            itemLabel={`${packageLabels[selectedType]} (${manualPayFor.duration} Days)`}
            amountLabel={manualPayFor.amountLabel}
            currencyCode={currency.code}
          />
        )}
      </Modal>
    </section>
  );
};

export default Plans;
