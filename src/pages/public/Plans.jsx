import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const packageOptions = [
  { value: "dietplan", label: "Customized Dietplan" },
  { value: "workout", label: "Live Workout Sessions" },
  { value: "combo", label: "Both Combined" },
];

const durations = [30, 90, 180];

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
  const [selectedType, setSelectedType] = useState("dietplan");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { role } = useAuth();

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

  const dietplan = plans.find(
    (p) =>
      p.product_type === "dietplan" && p.duration_days === selectedDuration,
  );
  const workout = plans.find(
    (p) => p.product_type === "workout" && p.duration_days === selectedDuration,
  );

  const getSelection = () => {
    if (selectedType === "dietplan") return dietplan ? [dietplan] : [];
    if (selectedType === "workout") return workout ? [workout] : [];
    if (selectedType === "combo") return [dietplan, workout].filter(Boolean);
    return [];
  };

  const selection = getSelection();
  const total = selection.reduce((sum, p) => sum + p.price, 0);

  const startCheckout = async (planIds) => {
    setCheckingOut(true);
    setError("");
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
      setCheckingOut(false);
    }
  };

  const handleCheckout = () => {
    setError("");

    if (selection.length === 0) {
      setError("This package/duration combination isn\u2019t available yet.");
      return;
    }

    const planIds = selection.map((p) => p._id);

    if (role !== "client") {
      localStorage.setItem("pending_plan_ids", JSON.stringify(planIds));
      localStorage.setItem("pending_include_premium", "false");
      navigate("/signup");
      return;
    }

    startCheckout(planIds);
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        PACKAGES
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-12">
        Choose a package, then a duration — Dietplan, Live Workout Sessions, or
        both together.
      </p>

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading packages...</p>
      ) : (
        <Card className="max-w-xl mx-auto">
          <div className="space-y-5">
            <div>
              <label className="text-sm text-brand-blue/60 mb-1 block">
                Package
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                {packageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-brand-blue/60 mb-1 block">
                Duration
              </label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              >
                {durations.map((d) => (
                  <option key={d} value={d}>
                    {d} Days
                  </option>
                ))}
              </select>
            </div>

            <ul className="space-y-2 pt-2">
              {featuresByType[selectedType].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2 text-sm text-brand-blue/70"
                >
                  <Check size={16} className="text-brand-orange" />
                  {f}
                </li>
              ))}
            </ul>

            {selectedType === "dietplan" && dietplan?.diet_plans_included && (
              <p className="text-sm text-brand-blue/70">
                Includes {dietplan.diet_plans_included} diet plans over{" "}
                {selectedDuration} days.
              </p>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="border-t border-brand-blue-pale pt-5">
              <p className="text-brand-blue/60 text-sm mb-1">Total</p>
              <p className="font-display text-3xl text-brand-blue mb-5">
                {selection.length > 0 ? `Rs ${total.toLocaleString()}` : "—"}
              </p>
              <Button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full"
              >
                {checkingOut ? "Redirecting..." : "Checkout"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <p className="text-center text-brand-blue/60 text-sm mt-8">
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
