
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl text-brand-blue mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        PRIVACY POLICY
      </motion.h1>
      <p className="text-brand-blue/60 text-sm mb-10">Last updated: August 2026</p>

      <div className="space-y-8 text-brand-blue/80 text-sm leading-relaxed">
        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">1. Information We Collect</h2>
          <p>
            When you create an account, we collect your name, phone number, and email
            address. When you purchase a package, e-book, or consultation, payment is
            processed by our payment provider (Stripe) — we do not store your card
            details ourselves.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">2. Dietician Follow-Up Tool</h2>
          <p>
            Details you enter into the Dietician Follow-Up tool (age, weight, height,
            goals, dietary notes) are processed entirely in your browser to generate an
            image. This information is never sent to or stored on our servers — it
            exists only on your device until you choose to save and send it to us
            yourself, e.g. via WhatsApp.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">3. How We Use Your Information</h2>
          <p>
            We use your information to manage your account, activate and track your
            packages, schedule classes and consultations, process payments, and
            communicate with you about your membership.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">4. Sharing Your Information</h2>
          <p>
            We do not sell your personal information. We share limited information with
            trusted service providers strictly to operate the platform — payment
            processing (Stripe), video sessions (Zoom), and email delivery — solely for
            the purpose of providing our services to you.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">5. Data Retention</h2>
          <p>
            We retain your account information for as long as your account is active.
            You may request deletion of your account and associated data by contacting
            us via WhatsApp or email.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">6. Your Rights</h2>
          <p>
            You can update your account details, change your password, or request
            account deletion at any time by contacting us.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-base mb-2">7. Contact Us</h2>
          <p>
            Questions about this policy? Reach out via the Contact page or WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;