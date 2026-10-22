import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, Info } from "lucide-react";
import Button from "../../components/common/Button";
import FaqSection from "../../components/common/FaqSection";
import {
  posts,
  postBySlug,
  postPath,
  readingMinutes,
  sectionId,
} from "../../content/blog";
import { reviewers } from "../../content/team";
import NotFound from "./NotFound";

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// One guide. Content lives in content/blog.js, which the build also turns
// into the crawler-readable HTML and BlogPosting/FAQPage data.
const BlogPost = () => {
  const { slug } = useParams();
  const post = postBySlug[slug];
  if (!post) return <NotFound />;

  const [programPath, programLabel] = post.program;
  const reviewer = reviewers[post.reviewedBy];
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <article className="max-w-3xl mx-auto px-6 pt-12 md:pt-16 pb-6">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-brand-blue-light mb-6"
        >
          <Link
            to="/"
            className="hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <Link
            to="/blog"
            className="hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Guides
          </Link>
        </nav>

        <span className="inline-block text-[11px] font-bold tracking-wide text-brand-orange-dark bg-brand-orange/10 px-2.5 py-1 rounded-full">
          {post.category.toUpperCase()}
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-brand-blue mt-3 mb-4 text-balance">
          {post.title}
        </h1>
        <p className="text-sm text-brand-blue-light mb-6">
          By {post.author}
          {reviewer && (
            <>
              {" "}
              · Reviewed by{" "}
              <Link
                to="/about#dietitian"
                className="font-semibold underline decoration-brand-blue-light/40 underline-offset-2 hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                {reviewer.name}, {reviewer.credential}
              </Link>
            </>
          )}{" "}
          · Updated{" "}
          <time dateTime={post.updated}>{formatDate(post.updated)}</time> ·{" "}
          {readingMinutes(post)} min read
        </p>
        <p className="text-brand-blue/85 text-lg leading-relaxed mb-8">
          {post.intro}
        </p>

        <nav
          aria-label="In this guide"
          className="bg-brand-blue-pale/50 rounded-2xl px-5 py-4 mb-10"
        >
          <p className="font-display text-sm text-brand-blue mb-2">
            In this guide
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {post.sections.map((s) => (
              <li key={s.heading}>
                <a
                  href={`#${sectionId(s.heading)}`}
                  className="text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {post.sections.map((section) => (
            <section
              key={section.heading}
              id={sectionId(section.heading)}
              className="scroll-mt-24"
            >
              <h2 className="font-display text-2xl text-brand-blue mb-3 text-balance">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="text-brand-blue/85 leading-relaxed mb-4"
                >
                  {p}
                </p>
              ))}
              {section.bullets && (
                <ul className="space-y-2.5 mt-2">
                  {section.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-brand-blue/85 leading-relaxed"
                    >
                      <Check
                        size={18}
                        className="text-brand-orange mt-1 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.table && (
                <div className="overflow-x-auto mt-4 rounded-xl border border-brand-blue-pale">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-brand-blue-pale/60 text-brand-blue">
                      <tr>
                        {section.table.head.map((h, i) => (
                          <th
                            key={i}
                            scope="col"
                            className="px-4 py-2.5 font-semibold whitespace-nowrap"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr
                          key={row[0]}
                          className="border-t border-brand-blue-pale align-top"
                        >
                          {row.map((cell, i) =>
                            i === 0 ? (
                              <th
                                key={i}
                                scope="row"
                                className="px-4 py-2.5 font-semibold text-brand-blue whitespace-nowrap"
                              >
                                {cell}
                              </th>
                            ) : (
                              <td
                                key={i}
                                className="px-4 py-2.5 text-brand-blue/85 min-w-[10rem]"
                              >
                                {cell}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.note && (
                <p className="flex items-start gap-2.5 mt-4 text-sm text-brand-blue bg-brand-orange/10 rounded-xl px-4 py-3">
                  <Info
                    size={18}
                    className="text-brand-orange-dark mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{section.note}</span>
                </p>
              )}
            </section>
          ))}
        </div>

        <aside className="mt-12 bg-brand-blue rounded-2xl px-6 py-7 text-center">
          <p className="font-display text-xl md:text-2xl text-white mb-2 text-balance">
            Want a plan made for you?
          </p>
          <p className="text-white/80 mb-6 text-sm md:text-base">
            A dietitian builds it around your health and the food you cook at
            home — with weekly follow-ups.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to={programPath}>
              See the {programLabel.toLowerCase()}
            </Button>
          </div>
        </aside>

        {reviewer && (
          <section
            aria-label="Reviewed by"
            className="mt-10 flex items-start gap-4 border border-brand-blue-pale rounded-2xl p-5"
          >
            <span
              aria-hidden="true"
              className="shrink-0 w-11 h-11 rounded-full bg-brand-orange/15 text-brand-orange-dark font-display flex items-center justify-center"
            >
              {reviewer.name
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </span>
            <div className="text-sm">
              <p className="text-xs font-semibold tracking-wide text-brand-blue-light mb-0.5">
                REVIEWED BY
              </p>
              <p className="font-display text-brand-blue text-base">
                {reviewer.name}
              </p>
              <p className="text-brand-blue/75">
                {reviewer.role} · {reviewer.credential}
              </p>
              {post.reviewed && (
                <p className="text-brand-blue/60 text-xs mt-1">
                  Reviewed on{" "}
                  <time dateTime={post.reviewed}>
                    {formatDate(post.reviewed)}
                  </time>
                </p>
              )}
            </div>
          </section>
        )}

        <p className="mt-8 text-xs text-brand-blue/60 leading-relaxed">
          This guide is general information, not medical advice. Talk to your
          doctor before changing your diet or exercise if you have a health
          condition, are pregnant or breastfeeding, or take medication.
        </p>
      </article>

      <FaqSection
        items={post.faqs}
        intro="Quick answers to common questions."
      />

      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16">
          <h2 className="font-display text-xl text-brand-blue mb-4">
            More guides
          </h2>
          <ul className="space-y-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  to={postPath(p)}
                  className="inline-flex items-center gap-1.5 font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  {p.title} <ArrowRight size={16} className="shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default BlogPost;
