import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { posts, postPath, readingMinutes } from "../../content/blog";

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// /blog — every guide, newest first.
const BlogIndex = () => {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-20 pb-16">
      <div className="max-w-2xl mx-auto text-center mb-10 md:mb-12">
        <p className="font-display text-brand-orange-dark text-xs tracking-[0.2em] mb-3">
          FITNESS ZONE GUIDES
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-brand-blue mb-4 text-balance">
          Diet and Home Workout Guides for Women
        </h1>
        <p className="text-brand-blue/75 leading-relaxed">
          Practical guides on PCOS, postpartum weight loss, desi diet plans and
          home workouts — built around the food you already cook and the time
          you actually have.
        </p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sorted.map((post) => (
          <li key={post.slug}>
            <Link
              to={postPath(post)}
              className="group flex flex-col h-full bg-white border border-brand-blue-pale rounded-2xl shadow-sm hover:shadow-md p-6 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <span className="self-start text-[11px] font-bold tracking-wide text-brand-orange-dark bg-brand-orange/10 px-2.5 py-1 rounded-full">
                {post.category.toUpperCase()}
              </span>
              <h2 className="font-display text-lg md:text-xl text-brand-blue mt-3 mb-2 text-balance group-hover:text-brand-blue-light transition-colors">
                {post.title}
              </h2>
              <p className="text-brand-blue/75 text-sm leading-relaxed flex-1">
                {post.description}
              </p>
              <p className="flex items-center justify-between gap-3 mt-4 text-xs text-brand-blue-light">
                <span>
                  {formatDate(post.updated)} · {readingMinutes(post)} min read
                </span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  Read <ArrowRight size={14} />
                </span>
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BlogIndex;
