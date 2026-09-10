import { motion } from "framer-motion";

const TermsOfService = () => {
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

      <div className="space-y-8 text-brand-blue/80 text-sm leading-relaxed">
        <h2 className="font-display text-brand-blue text-lg">
          Terms of Service & Refund Policy
        </h2>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            1. Nature of Services
          </h3>
          <p>
            Everything sold on this platform — Customized Diet Plans, Home
            Workouts, the Ultimate Fitness Combo, E-Books, Courses, and any
            custom payment arrangement made through a one-off invoice or
            payment link — is a digital, intangible service or asset managed
            directly by our platform. Unlike physical merchandise, these
            digital assets and access credits cannot be "returned" or
            "undone" once initiated.
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
              <strong>Home Workouts:</strong> Interactive classes are
              conducted by certified female trainers with flexible time
              slots. Memberships operate on a strict "date-to-date" monthly
              cycle (e.g., from the 10th of one month to the 10th of the
              next). This is a group fitness model; individual personal
              trainer support outside these classes is not included.
            </li>
            <li>
              <strong>E-Books &amp; Courses:</strong> Access is granted
              instantly upon successful payment. E-Books and course video
              lessons remain available in your account indefinitely once
              purchased.
            </li>
            <li>
              <strong>Custom Payment Links &amp; Invoices:</strong> One-off
              services or deliverables agreed directly with our team (e.g.
              a negotiated custom dietplan) are billed through a dedicated
              invoice or payment link and are subject to the same no-refund
              terms once payment is confirmed.
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
              fees paid for plans are for temporary access
              to our coaches, tracking networks, and digital resources
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
                  For Home Workouts: No refunds once class access links are
                  issued or the monthly cycle begins.
                </li>
                <li>
                  For E-Books &amp; Courses: No refunds once purchased and
                  access has been granted, as digital content cannot be
                  "returned."
                </li>
                <li>
                  For Custom Payment Links &amp; Invoices: No refunds once
                  payment is confirmed and the agreed service or deliverable
                  has been provided or initiated.
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
              home workouts or fail to follow up with your dietitian
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
      </div>
    </section>
  );
};

export default TermsOfService;
