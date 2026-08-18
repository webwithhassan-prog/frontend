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
      <p className="text-brand-blue/60 text-sm mb-10">
        Last updated: August 2026
      </p>

      <div className="space-y-8 text-brand-blue/80 text-sm leading-relaxed">
        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            1. Our Services
          </h2>
          <p>
            Fitness Zone provides customized dietplans, live workout sessions,
            1-on-1 consultations with dieticians, gynecologists, and
            psychiatrists, and downloadable e-books, delivered through this
            website.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            2. Accounts
          </h2>
          <p>
            You must provide accurate information when creating an account and
            are responsible for keeping your login credentials secure. You must
            be old enough to legally enter into a contract in your country to
            use paid services.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            3. Packages & Payments
          </h2>
          <p>
            Package durations, pricing, and inclusions are as shown on the
            Packages page at the time of purchase. Payments are processed
            securely through Stripe. Prices are subject to change for future
            purchases but will not change for an already-active package.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            4. Health Disclaimer
          </h2>
          <p>
            Our workout sessions, dietplans, and consultations are for general
            wellness purposes and do not replace professional medical advice.
            Consult a physician before starting any new fitness or dietary
            program, especially if you have an existing medical condition.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            5. Live Sessions & Consultations
          </h2>
          <p>
            Live sessions and 1-on-1 consultations are delivered via Zoom at
            scheduled times. Session access is tied to your active package —
            cancelled or expired packages lose access to future sessions.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            6. E-Books
          </h2>
          <p>
            E-books are for personal use only. Redistribution, resale, or public
            sharing of purchased e-book content is not permitted.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            7. Refunds
          </h2>
          <p>
            Please contact us via WhatsApp or the Contact page regarding any
            refund requests — these are handled on a case-by-case basis.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            8. Changes to These Terms
          </h2>
          <p>
            We may update these terms from time to time. Continued use of the
            platform after changes means you accept the updated terms.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">
            9. Contact Us
          </h2>
          <p>
            Questions about these terms? Reach out via the Contact page or
            WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
