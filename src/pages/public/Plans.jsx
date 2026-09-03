import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { trackEvent } from "../../utils/analytics";

const durations = [30, 90, 180];

const packageLabels = {
  dietplan: "Customized Dietplan",
  workout: "Live Workout Sessions",
  combo: "Both Combined",
};

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
    "Everything in Live Workout Sessions",
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
  const [searchParams] = useSearchParams();

  const selectedType = searchParams.get("type") || "dietplan";

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

    if (selectedType === "dietplan") return dietplan ? [dietplan] : [];
    if (selectedType === "workout") return workout ? [workout] : [];
    if (selectedType === "combo") return [dietplan, workout].filter(Boolean);
    return [];
  };

  const startCheckout = async (planIds) => {
    try {
      const clientId = localStorage.getItem("client_id");
      const res = await api.post("/payments/stripe/checkout", {
        client_id: clientId,
        plan_ids: planIds,
        include_premium: false,
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(
        err.response?.data?.message || "Checkout failed. Please try again.",
      );
      setCheckingOutDuration(null);
    }
  };

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
      localStorage.setItem("pending_include_premium", "false");
      navigate("/signup");
      return;
    }

    startCheckout(planIds);
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
      <p className="text-brand-blue/70 text-center mb-14">
        Choose the duration that works for you.
      </p>

      {error && (
        <p className="text-red-500 text-center text-sm mb-8">{error}</p>
      )}

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading packages...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {durations.map((duration, i) => {
            const selection = getSelectionForDuration(duration);
            const total = selection.reduce(
              (sum, p) => sum + (p.discounted_price ?? p.price),
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
                      {selection.length > 0
                        ? `Rs ${total.toLocaleString()}`
                        : "—"}
                    </p>
                    {hasDiscount && (
                      <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <p className="text-sm text-brand-blue/40 line-through">
                      Rs {originalTotal.toLocaleString()}
                    </p>
                  )}
                  {perDay && (
                    <p className="text-xs text-brand-blue/50 mb-4">
                      ≈ Rs {perDay.toLocaleString()} / day
                    </p>
                  )}

                  {selectedType === "dietplan" &&
                    dietplan?.diet_plans_included && (
                      <p className="text-sm text-brand-blue/70 mb-2">
                        Includes {dietplan.diet_plans_included} diet plans
                      </p>
                    )}

                  {selectedType === "combo" ? (
                    <div className="grid grid-cols-2 gap-4 my-4 flex-1">
                      <div className="pr-4 border-r border-brand-blue-pale">
                        <p className="text-[11px] font-bold text-brand-blue uppercase tracking-wide mb-2.5">
                          Dietplan
                        </p>
                        <ul className="space-y-2">
                          {featuresByType.dietplan.map((f) => (
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
                          Live Sessions
                        </p>
                        <ul className="space-y-2">
                          {featuresByType.workout.map((f) => (
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
                      {(featuresByType[selectedType] || []).map((f) => (
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
                      : "Checkout"}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="text-center text-brand-blue/60 text-sm mt-12">
        Looking for a 1-on-1 consultation with a dietician, gynecologist, or
        psychiatrist?{" "}
        <a
          href="/consultation"
          className="text-brand-orange font-semibold underline"
        >
          Book it here
        </a>
        .
      </p>
    </section>
  );
};

export default Plans;
