import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "./Card";
import Button from "./Button";
import Modal from "../admin/Modal";
import ManualPaymentPanel from "./ManualPaymentPanel";
import { useCurrency } from "../../context/CurrencyContext";
import { CURRENCY_TO_COUNTRY } from "../../utils/currencyToCountry";
import { getErrorMessage } from "../../utils/errors";
import { trackEvent } from "../../utils/analytics";

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

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

// Offer discount only — the coupon field lives on the packages page.
const priceOf = (plan) =>
  Math.round(plan.price * (1 - (plan.discount_percent || 0) / 100));

const FeatureColumn = ({ title, features, className }) => (
  <div className={className}>
    <p className="text-[11px] font-bold text-brand-blue uppercase tracking-wide mb-2.5">
      {title}
    </p>
    <ul className="space-y-2">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-1.5 text-xs text-brand-blue/70">
          <Check size={14} className="text-brand-orange mt-0.5 shrink-0" />
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
  const discountPercent = hasDiscount ? Math.round((1 - total / plan.price) * 100) : 0;
  const perDay = Math.round(total / plan.duration_days);

  return (
    <Card
      revealOnScroll={!inSlider}
      className={`h-full flex flex-col ${
        isPopular ? "border-brand-orange border-2 shadow-xl" : ""
      }`}
    >
      {/* Badge shares the title row, so every card is the same height and
          the slider's arrows/dots don't jump when the popular card appears. */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="font-display text-brand-blue text-lg">
          {plan.duration_days} Days
        </h3>
        {isPopular && (
          <span className="bg-brand-orange text-white text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
            MOST POPULAR
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-display text-3xl text-brand-blue tabular-nums">{format(total)}</p>
        {hasDiscount && (
          <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
            {discountPercent}% OFF
          </span>
        )}
      </div>
      {hasDiscount && (
        <p className="text-sm text-brand-blue/40 line-through tabular-nums">
          {format(plan.price)}
        </p>
      )}
      <p className="text-xs text-brand-blue/50 mb-4 tabular-nums">≈ {format(perDay)} / day</p>

      {plan.diet_plans_included > 0 && (
        <p className="text-sm text-brand-blue/70 mb-2">
          Includes {plan.diet_plans_included} diet plans
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 my-4 flex-1">
        <FeatureColumn
          title="Dietplan"
          features={dietplan?.features?.length ? dietplan.features : defaultFeatures.dietplan}
          className="pr-4 border-r border-brand-blue-pale"
        />
        <FeatureColumn
          title="Home Workouts"
          features={workout?.features?.length ? workout.features : defaultFeatures.workout}
          className="pl-1"
        />
      </div>

      <Button
        onClick={onPayWithCard}
        disabled={checkingOut}
        variant={isPopular ? "primary" : "secondary"}
        className="w-full"
      >
        {checkingOut ? "Redirecting..." : "Pay with Card"}
      </Button>
      <p className="text-[11px] text-brand-blue-light text-center mt-1.5">Instant Access</p>

      {manualMethods.length > 0 && (
        <>
          <Button onClick={onManualPay} variant="secondary" className="w-full mt-3">
            {manualMethods.map((m) => m.name).join(" / ")}
          </Button>
          <p className="text-[11px] text-brand-blue-light text-center mt-1.5">
            Instant Access (once your payment is verified by our team)
          </p>
        </>
      )}
    </Card>
  );
};

// Homepage showcase of the Dietplan + Home Workouts packages, with the same
// checkout and payment options as the packages page: a 3-up row on desktop,
// a one-card-at-a-time slider (arrows, dots, swipe) on mobile.
const ComboPlans = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [checkingOutId, setCheckingOutId] = useState(null);
  const [manualMethods, setManualMethods] = useState([]);
  const [manualPayFor, setManualPayFor] = useState(null); // { plan, amountLabel }
  const { format, currency } = useCurrency();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    api
      .get("/plans/public")
      .then((res) => setAllPlans(res.data))
      .catch((err) => console.error(err));
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
      .get("/manual-payment-methods/public", { params: { country: manualMethodsCountry } })
      .then((res) => setManualMethods(res.data))
      .catch((err) => console.error(err));
  }, [manualMethodsCountry]);

  const plans = allPlans
    .filter((p) => p.product_type === "combo")
    .sort((a, b) => a.duration_days - b.duration_days);

  if (plans.length === 0) return null;

  const findPlan = (type, days) =>
    allPlans.find((p) => p.product_type === type && p.duration_days === days);
  const popularIndex = plans.length === 3 ? 1 : -1;

  const payWithCard = async (plan) => {
    setCheckingOutId(plan._id);
    trackEvent("checkout_started", "/", { type: "combo", duration: plan.duration_days });
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
    isPopular: i === popularIndex,
    inSlider,
    format,
    manualMethods,
    checkingOut: checkingOutId === plan._id,
    onPayWithCard: () => payWithCard(plan),
    onManualPay: () => setManualPayFor({ plan, amountLabel: format(priceOf(plan)) }),
  });

  const goTo = (target, dir) => {
    setDirection(dir);
    setSlide((target + plans.length) % plans.length);
  };
  const goPrev = () => goTo(slide - 1, -1);
  const goNext = () => goTo(slide + 1, 1);

  const shift = reduceMotion ? 0 : 60;
  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir * shift }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -shift }),
  };

  const arrowClass =
    "bg-white shadow-md rounded-full p-2.5 text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2";

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          DIETPLAN + HOME WORKOUTS
        </motion.h2>
        <p className="text-brand-blue/70 text-center max-w-xl mx-auto mb-12">
          Both combined — your meals and your workouts, planned together in one
          package.
        </p>

        {/* Desktop: all three side by side */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-8 md:items-start pt-4">
          {plans.map((plan, i) => (
            <div key={plan._id} className={i === popularIndex ? "-mt-4" : ""}>
              <PlanCard {...cardProps(plan, i, false)} />
            </div>
          ))}
        </div>

        {/* Mobile: one full card at a time */}
        <div className="md:hidden">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={plans[slide]._id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                drag={plans.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) goNext();
                  else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) goPrev();
                }}
                className="max-w-[360px] mx-auto touch-pan-y"
              >
                <PlanCard {...cardProps(plans[slide], slide, true)} />
              </motion.div>
            </AnimatePresence>
          </div>

          {plans.length > 1 && (
            <div className="flex items-center justify-center gap-5 mt-6">
              <button onClick={goPrev} className={arrowClass} aria-label="Previous package">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {plans.map((plan, i) => (
                  <button
                    key={plan._id}
                    onClick={() => goTo(i, i > slide ? 1 : -1)}
                    aria-label={`Show ${plan.duration_days}-day package`}
                    aria-current={i === slide}
                    className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                      i === slide ? "w-6 bg-brand-orange" : "w-2 bg-brand-blue-pale"
                    }`}
                  />
                ))}
              </div>
              <button onClick={goNext} className={arrowClass} aria-label="Next package">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!manualPayFor}
        onClose={() => setManualPayFor(null)}
        title="Manual Payment"
      >
        {manualPayFor && (
          <ManualPaymentPanel
            methods={manualMethods}
            type="package"
            planIds={[manualPayFor.plan._id]}
            itemLabel={`Both Combined (${manualPayFor.plan.duration_days} Days)`}
            amountLabel={manualPayFor.amountLabel}
            currencyCode={currency.code}
          />
        )}
      </Modal>
    </section>
  );
};

export default ComboPlans;
