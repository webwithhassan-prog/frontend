import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "./Card";
import Button from "./Button";
import CardSlider from "./CardSlider";
import CardRow from "./CardRow";
import CurrencySwitcher from "./CurrencySwitcher";
import Modal from "../admin/Modal";
// Loaded only when someone opens manual payment — it carries the full
// country list for the phone field, which the homepage doesn't need up front.
const ManualPaymentPanel = lazy(() => import("./ManualPaymentPanel"));
import { useCurrency } from "../../context/CurrencyContext";
import { CURRENCY_TO_COUNTRY } from "../../utils/currencyToCountry";
import { getErrorMessage } from "../../utils/errors";
import { trackEvent } from "../../utils/analytics";
import { popularFlags } from "../../utils/packages";

// Same fallbacks the packages page uses when a plan has no features set.
const defaultFeatures = {
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
};

// Offer discount only — the coupon field lives on the packages page.
const priceOf = (plan) =>
  Math.round(plan.price * (1 - (plan.discount_percent || 0) / 100));

const FeatureColumn = ({ title, features, className }) => (
  <div className={className}>
    <p className="text-[10px] font-bold text-brand-blue uppercase tracking-wide mb-1.5">
      {title}
    </p>
    <ul className="space-y-1">
      {features.map((f) => (
        <li
          key={f}
          className="flex items-start gap-1 text-[11px] leading-snug text-brand-blue/70"
        >
          <Check size={12} className="text-brand-orange mt-[2px] shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  </div>
);

const PlanCard = ({
  plan,
  dietplan,
  workout,
  isPopular,
  inSlider,
  format,
  manualMethods,
  checkingOut,
  onPayWithCard,
  onManualPay,
}) => {
  const total = priceOf(plan);
  const hasDiscount = total < plan.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - total / plan.price) * 100)
    : 0;
  const perDay = Math.round(total / plan.duration_days);

  return (
    <Card
      revealOnScroll={!inSlider}
      padding="p-4 md:p-5"
      className={`h-full flex flex-col ${
        isPopular ? "border-brand-orange border-2 shadow-xl" : ""
      }`}
    >
      {/* Badge shares the title row, so every card is the same height and
          the slider's arrows/dots don't jump when the popular card appears. */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-brand-blue text-base">
          {plan.duration_days} Days
        </h3>
        {isPopular && (
          <span className="bg-brand-orange text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-0.5">
        <p className="font-display text-2xl text-brand-blue tabular-nums">
          {format(total)}
        </p>
        {hasDiscount && (
          <span className="text-[9px] font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>
      <p className="text-[11px] text-brand-blue/70 tabular-nums">
        {hasDiscount && (
          <>
            <span className="line-through text-brand-blue/60">
              {format(plan.price)}
            </span>
            <span className="mx-1.5" aria-hidden="true">
              ·
            </span>
          </>
        )}
        ≈ {format(perDay)} / day
      </p>

      {plan.diet_plans_included > 0 && (
        <p className="text-xs text-brand-blue/70 mt-1.5">
          Includes {plan.diet_plans_included} diet plans
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 my-3 flex-1">
        <FeatureColumn
          title="Dietplan"
          features={
            dietplan?.features?.length
              ? dietplan.features
              : defaultFeatures.dietplan
          }
          className="pr-3 border-r border-brand-blue-pale"
        />
        <FeatureColumn
          title="Home Workouts"
          features={
            workout?.features?.length
              ? workout.features
              : defaultFeatures.workout
          }
        />
      </div>

      <Button
        size="sm"
        onClick={onPayWithCard}
        disabled={checkingOut}
        variant={isPopular ? "primary" : "secondary"}
        className="w-full"
      >
        {checkingOut ? "Redirecting..." : "Pay with Card"}
      </Button>
      <p className="text-[10px] text-brand-blue-light text-center mt-1">
        Instant Access
      </p>

      {manualMethods.length > 0 && (
        <>
          <Button
            size="sm"
            onClick={onManualPay}
            variant="secondary"
            className="w-full mt-2.5"
          >
            {manualMethods.map((m) => m.name).join(" / ")}
          </Button>
          <p className="text-[10px] text-brand-blue-light text-center mt-1">
            Instant Access (once your payment is verified by our team)
          </p>
        </>
      )}
    </Card>
  );
};

// Homepage showcase of the Dietplan + Home Workouts packages, with the same
// checkout and payment options as the packages page: a row of cards on
// larger screens, a one-card-at-a-time slider on phones.
const ComboPlans = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [checkingOutId, setCheckingOutId] = useState(null);
  const [manualMethods, setManualMethods] = useState([]);
  const [manualPayFor, setManualPayFor] = useState(null); // { plan, amountLabel }
  const { format, currency } = useCurrency();

  useEffect(() => {
    api
      .get("/plans/public")
      .then((res) => setAllPlans(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoaded(true));
  }, []);

  // Tied to the selected currency, exactly like the packages page — so the
  // local methods for that currency's country (e.g. JazzCash for PKR) show.
  const manualMethodsCountry = CURRENCY_TO_COUNTRY[currency.code];
  useEffect(() => {
    if (!manualMethodsCountry) {
      setManualMethods([]);
      return;
    }
    api
      .get("/manual-payment-methods/public", {
        params: { country: manualMethodsCountry },
      })
      .then((res) => setManualMethods(res.data))
      .catch((err) => console.error(err));
  }, [manualMethodsCountry]);

  const plans = allPlans
    .filter((p) => p.product_type === "combo")
    .sort((a, b) => a.duration_days - b.duration_days);

  if (loaded && plans.length === 0) return null;

  const findPlan = (type, days) =>
    allPlans.find((p) => p.product_type === type && p.duration_days === days);
  const popular = popularFlags(plans.map((p) => !!p.is_popular));

  const payWithCard = async (plan) => {
    setCheckingOutId(plan._id);
    trackEvent("checkout_started", "/", {
      type: "combo",
      duration: plan.duration_days,
    });
    try {
      const res = await api.post("/payments/stripe/checkout", {
        plan_ids: [plan._id],
        currency_code: currency.code,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(getErrorMessage(err, "Checkout failed"));
      setCheckingOutId(null);
    }
  };

  const cardProps = (plan, i, inSlider) => ({
    plan,
    dietplan: findPlan("dietplan", plan.duration_days),
    workout: findPlan("workout", plan.duration_days),
    isPopular: popular[i],
    inSlider,
    format,
    manualMethods,
    checkingOut: checkingOutId === plan._id,
    onPayWithCard: () => payWithCard(plan),
    onManualPay: () =>
      setManualPayFor({ plan, amountLabel: format(priceOf(plan)) }),
  });

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          DIETPLAN + HOME WORKOUTS
        </motion.h2>
        <p className="text-brand-blue/70 text-center max-w-xl mx-auto mb-4">
          Both combined — your meals and your workouts, planned together in one
          package.
        </p>
        <div className="flex justify-center mb-8">
          <CurrencySwitcher />
        </div>

        {/* Tablet and up: a centred row, which becomes a slider with
            arrows once there are more packages than fit (3 on desktop,
            2 on tablets) — admins can add any number of durations. */}
        {!loaded ? (
          // Card-sized placeholders while the packages load, so everything
          // below doesn't jump down when they arrive.
          <div aria-hidden="true">
            <div className="md:hidden max-w-[311px] h-[440px] mx-auto my-2 rounded-2xl bg-white border border-brand-blue-pale animate-pulse" />
            <div className="hidden md:flex gap-6 max-w-5xl mx-auto">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-[440px] rounded-2xl bg-white border border-brand-blue-pale animate-pulse ${i === 2 ? "hidden lg:block" : ""}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <CardRow
              className="hidden md:block max-w-5xl mx-auto"
              items={plans}
              getKey={(plan) => plan._id}
              getLabel={(plan) => `the ${plan.duration_days}-day package`}
              itemName="package"
              renderItem={(plan, i) => (
                <PlanCard {...cardProps(plan, i, false)} />
              )}
            />

            {/* Phones: one card at a time */}
            <CardSlider
              className="md:hidden"
              items={plans}
              getKey={(plan) => plan._id}
              getLabel={(plan) => `${plan.duration_days}-day package`}
              itemName="package"
              renderItem={(plan, i) => (
                <PlanCard {...cardProps(plan, i, true)} />
              )}
            />
          </>
        )}

        {/* Onward to every package — Dietplan-only and Home Workouts-only
            live on the packages page, not here. */}
        <div className="text-center mt-8 md:mt-10">
          <Button variant="secondary" to="/plans">
            <span className="flex items-center gap-2">
              View All Packages <ArrowRight size={16} />
            </span>
          </Button>
        </div>
      </div>

      <Modal
        isOpen={!!manualPayFor}
        onClose={() => setManualPayFor(null)}
        title="Manual Payment"
      >
        {manualPayFor && (
          <Suspense
            fallback={
              <p className="text-sm text-brand-blue/60 py-6 text-center">
                Loading payment details…
              </p>
            }
          >
            <ManualPaymentPanel
              methods={manualMethods}
              type="package"
              planIds={[manualPayFor.plan._id]}
              itemLabel={`Both Combined (${manualPayFor.plan.duration_days} Days)`}
              amountLabel={manualPayFor.amountLabel}
              currencyCode={currency.code}
            />
          </Suspense>
        )}
      </Modal>
    </section>
  );
};

export default ComboPlans;
