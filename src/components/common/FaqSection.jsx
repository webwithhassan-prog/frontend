import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "../../content/faq";

// Native <details> accordion: works without JavaScript, keyboard-accessible
// out of the box, and the answers stay in the page for search engines.
const FaqSection = ({
  items = faqs,
  intro = "Quick answers about our diet plans, live classes and payments.",
}) => (
  <section id="faq" className="py-16 md:py-20">
    <div className="max-w-3xl mx-auto px-6">
      <motion.h2
        className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        FREQUENTLY ASKED QUESTIONS
      </motion.h2>
      <p className="text-brand-blue/70 text-center max-w-xl mx-auto mb-8 md:mb-10">
        {intro}
      </p>

      <div className="space-y-3">
        {items.map(({ q, a }) => (
          <details
            key={q}
            className="group bg-white border border-brand-blue-pale rounded-2xl shadow-sm open:shadow-md transition-shadow"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 font-display text-sm md:text-base text-brand-blue rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange [&::-webkit-details-marker]:hidden">
              {q}
              <ChevronDown
                size={18}
                className="shrink-0 text-brand-orange transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="px-5 pb-5 -mt-1 text-sm leading-relaxed text-brand-blue/75">
              {a}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
