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
        Last updated: September 2026
      </p>

      <div className="space-y-8 text-brand-blue/80 text-sm leading-relaxed">
        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            1. Acceptance of Terms
          </h3>
          <p>
            By creating an account or purchasing any package, e-book, course,
            or other service on this platform, you agree to be bound by
            these Terms of Service. If you do not agree, please do not use
            the platform.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            2. Your Account
          </h3>
          <p>
            You're responsible for keeping your login details confidential
            and for all activity that happens under your account. Let us
            know immediately if you suspect unauthorized access. You must
            provide accurate information when signing up and keep it up to
            date.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            3. Acceptable Use
          </h3>
          <p>
            Class access links, e-books, and course videos are for your
            personal use only and may not be shared, resold, or redistributed.
            You agree not to misuse the platform — including attempting to
            disrupt our services, access accounts that aren't yours, or use
            the platform for any unlawful purpose.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            4. Payments & Refunds
          </h3>
          <p>
            Package pricing is shown at checkout before you pay. Our refund
            and membership pause rules are covered separately in our{" "}
            <a href="/refund-policy" className="text-brand-orange underline">
              Refund Policy
            </a>
            , which forms part of these Terms.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            5. Intellectual Property
          </h3>
          <p>
            All content on this platform — including diet plans, workout
            videos, e-books, course material, and branding — belongs to
            Fitnesszone Official Limited or our licensors. You may not copy,
            reproduce, or distribute it outside of your own personal use.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            6. Service Availability
          </h3>
          <p>
            We work to keep classes, e-books, and account access running
            smoothly, but we don't guarantee uninterrupted availability —
            occasional downtime for maintenance, technical issues, or
            circumstances outside our control can happen. We'll do our best
            to keep disruption to a minimum and notify you of significant
            planned changes.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            7. Limitation of Liability
          </h3>
          <p>
            Our diet plans and workout guidance are general fitness and
            nutrition support, not medical advice — consult a doctor before
            starting any new diet or exercise program, especially if you
            have an existing health condition. To the fullest extent
            permitted by law, we aren't liable for indirect or consequential
            losses arising from your use of the platform.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            8. Changes to These Terms
          </h3>
          <p>
            We may update these Terms from time to time to reflect changes
            to our services or for legal reasons. We'll update the "Last
            updated" date above when we do — continued use of the platform
            after a change means you accept the updated Terms.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            9. Governing Law
          </h3>
          <p>
            These Terms are governed by the laws of England and Wales.
            Nothing here limits any statutory rights you have as a consumer
            that can't be excluded under applicable law.
          </p>
        </div>

        <div>
          <h3 className="font-display text-brand-blue text-base mb-2">
            10. Contact Us
          </h3>
          <p>
            Questions about these Terms? Reach out via the Contact page or
            WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
