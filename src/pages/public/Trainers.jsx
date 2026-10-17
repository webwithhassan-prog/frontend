import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import axios from "axios";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import FaqSection from "../../components/common/FaqSection";
import {
  trainersIntro,
  trainersSections,
  trainersLinks,
  trainersFaqs,
} from "../../content/trainers";

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/trainers/public`,
        );
        setTrainers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <motion.h1
          className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          MEET THE TEAM
        </motion.h1>
        <p className="text-brand-blue/75 text-center max-w-2xl mx-auto mb-12">
          {trainersIntro}
        </p>

        {/* The list only appears once it has loaded with trainers in it —
            the text around it carries the page either way. */}
        {loading ? (
          <Loader />
        ) : (
          trainers.length > 0 && (
            <>
              <h2 className="font-display text-lg text-brand-blue mb-6">
                OUR FEMALE TRAINERS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {trainers.map((t) => (
                  <Card key={t._id}>
                    <h3 className="font-display text-brand-blue text-base">
                      {t.name}
                    </h3>
                    <p className="text-brand-blue/70 text-sm mt-1">
                      {t.specialty}
                    </p>
                  </Card>
                ))}
              </div>
            </>
          )
        )}
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-6 space-y-6">
        {trainersSections.map((section) => (
          <section
            key={section.heading}
            className="bg-white border border-brand-blue-pale rounded-2xl shadow-sm p-6 md:p-8"
          >
            <h2 className="font-display text-xl md:text-2xl text-brand-blue mb-2 text-balance">
              {section.heading}
            </h2>
            {section.paragraphs?.map((p) => (
              <p
                key={p.slice(0, 40)}
                className="text-brand-blue/80 leading-relaxed mb-4 last:mb-0"
              >
                {p}
              </p>
            ))}
            {section.bullets && (
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
                {section.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-brand-blue/85 text-sm md:text-base"
                  >
                    <Check
                      size={18}
                      className="text-brand-orange mt-0.5 shrink-0"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2">
          {trainersLinks.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              className="inline-flex items-center gap-1.5 py-1 font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              {label} <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </div>

      <FaqSection
        items={trainersFaqs}
        intro="Common questions about training with our female trainers."
      />
    </>
  );
};

export default Trainers;
