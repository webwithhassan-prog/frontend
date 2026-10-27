import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Quote, Star } from "lucide-react";
import api from "../../services/api";
import Button from "./Button";

const initials = (name = "") =>
  name
    .replace(/\./g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

// Stars fill in one after another when the card comes into view.
const Stars = ({ rating, size = 16, animate = true }) => (
  <p className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <motion.span
        key={n}
        initial={animate ? { scale: 0, rotate: -30 } : false}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 18,
          delay: 0.15 + n * 0.08,
        }}
        aria-hidden="true"
      >
        <Star
          size={size}
          className={
            n <= rating
              ? "fill-brand-gold text-brand-gold"
              : "text-brand-blue-pale"
          }
        />
      </motion.span>
    ))}
  </p>
);

const ReviewCard = ({ review, animateStars }) => (
  <figure className="relative h-full flex flex-col bg-white border border-brand-blue-pale rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6">
    <Quote
      size={36}
      className="absolute top-4 right-4 text-brand-orange/15"
      aria-hidden="true"
    />
    <Stars rating={review.rating} animate={animateStars} />
    <blockquote className="flex-1 mt-3 text-brand-blue/85 leading-relaxed line-clamp-5">
      {review.text}
    </blockquote>
    <figcaption className="flex items-center gap-3 mt-5">
      <span
        aria-hidden="true"
        className="w-9 h-9 shrink-0 rounded-full bg-brand-orange/15 text-brand-orange-dark font-display text-sm flex items-center justify-center"
      >
        {initials(review.display_name)}
      </span>
      <span>
        <span className="block font-semibold text-brand-blue text-sm">
          {review.display_name}
        </span>
        <span className="block text-xs text-brand-blue/60">
          Fitness Zone member
        </span>
      </span>
    </figcaption>
  </figure>
);

// One endlessly scrolling row. The list is rendered twice so the loop is
// seamless; the copy is hidden from screen readers. Pure CSS (see
// .marquee-track in index.css) — no JavaScript runs while it moves.
const MarqueeRow = ({ reviews, reverse }) => {
  const duration = Math.max(30, reviews.length * 9);
  const items = (copy) =>
    reviews.map((r) => (
      <li
        key={`${copy}-${r._id}`}
        className="w-[290px] sm:w-[340px] shrink-0 px-2.5"
        aria-hidden={copy === "b" || undefined}
      >
        <ReviewCard review={r} animateStars={false} />
      </li>
    ));
  return (
    <ul
      className={`marquee-track flex w-max py-2 ${reverse ? "marquee-reverse" : ""}`}
      style={{ "--marquee-duration": `${duration}s` }}
    >
      {items("a")}
      {items("b")}
    </ul>
  );
};

// "Loved by our members" — approved client reviews on the homepage.
// 4+ reviews glide past in a ribbon (two rows, opposite directions, from
// 6); fewer rise in as a centred row. Hidden until there's a review.
const HomeReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    api
      .get("/reviews/public")
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err));
  }, []);

  if (reviews.length === 0) return null;

  const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const useMarquee = reviews.length >= 4;
  const twoRows = reviews.length >= 6;
  const rows = twoRows
    ? [
        reviews.filter((_, i) => i % 2 === 0),
        reviews.filter((_, i) => i % 2 === 1),
      ]
    : [reviews];

  return (
    <section aria-labelledby="home-reviews" className="py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center mb-10">
        <motion.p
          className="font-display text-brand-orange-dark text-xs tracking-[0.2em] mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          REVIEWS
        </motion.p>
        <motion.h2
          id="home-reviews"
          className="font-display text-2xl md:text-3xl text-brand-blue mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
        >
          LOVED BY OUR MEMBERS
        </motion.h2>
        <motion.div
          className="inline-flex items-center gap-2 text-brand-blue"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <Stars rating={Math.round(average)} size={18} />
          <span className="text-sm">
            <strong className="tabular-nums">{average.toFixed(1)}</strong> from{" "}
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </motion.div>
      </div>

      {useMarquee ? (
        <div
          className="reviews-marquee relative"
          data-paused={paused || undefined}
        >
          <div className="space-y-3">
            {rows.map((row, i) => (
              <MarqueeRow key={i} reviews={row} reverse={i === 1} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="motion-reduce:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue/70 hover:text-brand-blue px-3 py-1.5 rounded-full border border-brand-blue-pale bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
              {paused ? "Play reviews" : "Pause reviews"}
            </button>
          </div>
        </div>
      ) : (
        <ul className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-5">
          {reviews.map((r, i) => (
            <motion.li
              key={r._id}
              className="w-full sm:w-[340px]"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                delay: i * 0.12,
              }}
            >
              <ReviewCard review={r} animateStars />
            </motion.li>
          ))}
        </ul>
      )}

      <div className="text-center mt-8">
        <Button variant="secondary" to="/success-stories">
          Read more success stories
        </Button>
      </div>
    </section>
  );
};

export default HomeReviews;
