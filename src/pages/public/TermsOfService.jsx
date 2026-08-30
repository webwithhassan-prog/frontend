import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "premium", label: "Premium 1-on-1 Services" },
  { id: "standard", label: "Standard Platform Services" },
  { id: "professional", label: "Professional Partnership" },
];

const TermsOfService = () => {
  const [activeTab, setActiveTab] = useState("premium");

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl text-brand-blue mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        TERMS OF SERVICE
      </motion.h1>
      <p className="text-brand-blue/60 text-sm mb-8">
        Last updated: August 2026
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-brand-blue-pale pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-brand-orange text-white"
                : "text-brand-blue/60 hover:bg-brand-blue-pale"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "premium" && (
          <motion.div
            key="premium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-brand-blue/80 text-sm leading-relaxed"
          >
            <h2 className="font-display text-brand-blue text-lg">
              Terms of Service & Refund Policy: Premium 1-on-1 Services
            </h2>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                1. Booking & System Operations
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  All Premium 1-on-1 consultations and personalized sessions
                  must be booked exclusively through our website's integrated
                  payment gateway (Stripe).
                </li>
                <li>
                  Once a booking is confirmed, the selected verified
                  professional is legally bound to initiate the service within
                  the committed timeframe.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                2. 7-Day Refund & Consumer Protection Guarantee
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>The Complaint Window:</strong> We offer a strict 7-day
                  refund window starting from the official commencement date of
                  your premium service.
                </li>
                <li>
                  <strong>Eligibility:</strong> If the professional fails to
                  deliver the promised consultation, delays sessions
                  unreasonably, or does not meet the specified program
                  commitments, you must lodge a formal complaint with our
                  support team within these 7 days.
                </li>
                <li>
                  <strong>Resolution:</strong> Verified and legitimate
                  complaints will result in a 100% refund of your booking
                  amount.
                </li>
                <li>
                  <strong>Strict Limitation:</strong> No refund claims,
                  disputes, or chargebacks will be entertained under any
                  circumstances once the 7-day period expires.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                3. Payment Bypass & Off-Platform Prohibitions
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Protected Transactions:</strong> The platform
                  guarantees consumer protection, quality monitoring, and
                  financial security only if your payment is processed directly
                  through our website.
                </li>
                <li>
                  <strong>Bypass Warning:</strong> Members are strictly
                  prohibited from entering into private financial arrangements
                  with listed professionals, trainers, or dietitians outside the
                  platform.
                </li>
                <li>
                  <strong>Zero Liability:</strong> If you bypass our system and
                  transact privately with a professional, the platform holds
                  zero financial or legal liability for any service failures,
                  financial losses, or scheduling scams. Additionally, the
                  platform reserves the right to permanently terminate the
                  accounts of both the member and the professional involved.
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === "standard" && (
          <motion.div
            key="standard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-brand-blue/80 text-sm leading-relaxed"
          >
            <h2 className="font-display text-brand-blue text-lg">
              Terms of Service & Refund Policy: Standard Affordable Platform
              Services
            </h2>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                1. Nature of Services
              </h3>
              <p>
                All affordable tier plans (Customized Diet Plans, Live Workout
                Sessions, and the Ultimate Fitness Combo) are digital,
                intangible, time-bound services managed directly by our
                platform. Unlike physical merchandise, these digital assets and
                access credits cannot be "returned" or "undone" once initiated.
              </p>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                2. Plan Specific Rules & Deliverables
              </h3>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong>Customized Diet Plans:</strong> Upon submission of
                  your health data, our specialist will deliver your
                  personalized 15-day plan within 24 hours. Members receive a
                  direct contact number for their dietitian and will participate
                  in group meal tracking. Plans are valid strictly for 15 days.
                </li>
                <li>
                  <strong>Live Workout Sessions:</strong> Interactive live
                  classes are conducted by certified female trainers with
                  flexible time slots. Memberships operate on a strict
                  "date-to-date" monthly cycle (e.g., from the 10th of one month
                  to the 10th of the next). This is a group fitness model;
                  individual personal trainer support outside live classes is
                  not included.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                3. Strict No-Refund Policy (Gym Membership Framework)
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Following the traditional "Gym Membership" legal framework,
                  fees paid for affordable tier plans are for temporary access
                  to our live coaches, tracking networks, and digital resources
                  for a designated period.
                </li>
                <li>
                  <strong>Instant Disqualification for Refunds:</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      For Diet Plans: No refunds once the customized plan has
                      been generated or shared.
                    </li>
                    <li>
                      For Live Workouts: No refunds once class access links are
                      issued or the monthly cycle begins.
                    </li>
                  </ul>
                </li>
                <li>
                  With an established 3-year track record of high-quality
                  fitness service delivery, refunds will not be issued due to
                  personal scheduling conflicts, lack of individual motivation,
                  or changes in personal preference.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                4. Membership Pause & Extension Policy
              </h3>
              <p className="mb-2">
                We provide a complimentary membership "Pause/Hold" feature to
                accommodate unexpected emergencies, governed by strict
                compliance protocols:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Advance Notice Required:</strong> If you need to pause
                  your plan, you must formally inform the support team before
                  your absence begins, stating the exact duration of the hold.
                </li>
                <li>
                  <strong>Unnotified Absences:</strong> If you stop attending
                  live workout sessions or fail to follow up with your dietitian
                  without prior notice, those days will be counted as fully
                  consumed.
                </li>
                <li>
                  <strong>Strict Exclusion:</strong> The platform will not grant
                  extensions retroactively for past unnotified absences under
                  any circumstances, including medical inconveniences or
                  unexpected personal events. Extensions are only valid if
                  approved in advance.
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {activeTab === "professional" && (
          <motion.div
            key="professional"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 text-brand-blue/80 text-sm leading-relaxed"
          >
            <h2 className="font-display text-brand-blue text-lg">
              Professional Partnership and Listing Policy (Terms for Experts)
            </h2>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                1. Verification and Documents
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  All trainers, dietitians, and consultants must submit genuine
                  certifications and government ID via WhatsApp before
                  onboarding.
                </li>
                <li>
                  Submitting false or misleading documents will result in an
                  immediate permanent ban.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                2. Mandatory 30-Minute Live Demo
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Every professional must deliver a mandatory 30-minute live
                  practical trial or demonstration session.
                </li>
                <li>
                  Demo sessions are arranged on a random Sunday for management
                  evaluation and quality checks.
                </li>
                <li>
                  Your profile and advertisement will only be posted on the
                  website after passing this demo session.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                3. Monthly Premium Placement Fee
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Listed professionals must pay a minimal monthly subscription
                  fee to remain active on the platform. This fee acts as a
                  direct marketing contribution to fund paid ads and boosts that
                  bring global clients to your profile.
                </li>
                <li>
                  Failure to renew this monthly subscription will result in the
                  temporary removal of your website listing.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                4. Commission and Payout Cycle
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  The platform charges a 15% service fee on every successful
                  booking generated through the website.
                </li>
                <li>
                  The professional receives the remaining 85% of the
                  consultation fee. Total earnings are transferred to your bank
                  account either bi-weekly or at the calendar month-end.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-brand-blue text-base mb-2">
                5. Off-Platform Bookings and Account Removal
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  You are 100% free to bring and manage your private personal
                  clients outside the platform with 0% commission.
                </li>
                <li>
                  Any client who finds or approaches you through our platform
                  must be processed strictly via the website payment gateway.
                </li>
                <li>
                  Taking a platform-sourced client offline is a breach of
                  contract; the platform holds zero liability, and your active
                  listing will be permanently deleted.
                </li>
                <li>
                  You can remove your ad and leave the platform at any time
                  without penalties, provided all current active monthly client
                  bookings are fully served.
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TermsOfService;
