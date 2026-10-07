import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Button from "../../components/common/Button";
import FaqSection from "../../components/common/FaqSection";
import { programs } from "../../content/programs";
import NotFound from "./NotFound";

// One template for the program pages (online diet plan, live workout
// classes, postpartum weight loss). Content lives in content/programs.js,
// which the build also turns into the crawler-readable HTML and FAQ/Service
// structured data, so what people read and what search engines read match.
const ProgramPage = () => {
  const { pathname } = useLocation();
  const program = programs[pathname];
  if (!program) return <NotFound />;

  return (
    <>
      <section className="max-w-3xl mx-auto px-6 pt-16 md:pt-20 pb-10 text-center">
        <p className="font-display text-brand-orange-dark text-xs tracking-[0.2em] mb-3">
          {program.eyebrow}
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-brand-blue mb-5 text-balance">
          {program.title}
        </h1>
        <p className="text-brand-blue/75 text-base md:text-lg leading-relaxed mb-8">
          {program.intro}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button to={`/plans?type=${program.packageType}`}>
            See packages &amp; prices
          </Button>
          <Button to="/timetable" variant="secondary">
            View class times
          </Button>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 pb-6 space-y-6">
        {program.sections.map((section) => (
          <section
            key={section.heading}
            className="bg-white border border-brand-blue-pale rounded-2xl shadow-sm p-6 md:p-8"
          >
            <h2 className="font-display text-xl md:text-2xl text-brand-blue mb-2 text-balance">
              {section.heading}
            </h2>
            {section.lead && (
              <p className="text-brand-blue/70 mb-5">{section.lead}</p>
            )}

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

            {section.steps && (
              <ol className="space-y-4 mt-5">
                {section.steps.map(([title, desc], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="font-display text-brand-orange-dark text-xl leading-none w-7 shrink-0 tabular-nums">
                      {i + 1}.
                    </span>
                    <div>
                      <p className="font-display text-brand-blue text-base">
                        {title}
                      </p>
                      <p className="text-brand-blue/75 text-sm md:text-base">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {section.links && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
                {section.links.map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    className="inline-flex items-center gap-1.5 py-1 font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    {label} <ArrowRight size={16} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <FaqSection
        items={program.faqs}
        intro={`Common questions about our ${program.title.toLowerCase()}.`}
      />

      <section className="bg-brand-blue py-14">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-3">
            Ready to start?
          </h2>
          <p className="text-white/80 mb-7">
            Choose your package — prices are shown in your local currency.
          </p>
          <Button to={`/plans?type=${program.packageType}`}>
            See packages &amp; prices
          </Button>
        </div>
      </section>
    </>
  );
};

export default ProgramPage;
