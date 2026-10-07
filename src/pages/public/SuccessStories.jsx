import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

const SuccessStories = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/testimonials/public");
        setImages(res.data.map((t) => t.image_url));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        SUCCESS STORIES
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-6">
        Real check-ins, real progress, from real members.
      </p>
      {/* Text alongside the screenshots: an image-only page gave search
          engines nothing to index ("crawled — currently not indexed"). */}
      <div className="max-w-2xl mx-auto text-center text-brand-blue/80 leading-relaxed space-y-3 mb-12">
        <p>
          These weight loss success stories are real check-ins shared by Fitness
          Zone members — women following a customized diet plan built from their
          own home food, live online workout classes with female trainers, or
          both together.
        </p>
        <p>
          Diet plan members track their meals daily and check in with our team
          every week, so progress is followed, not guessed.
        </p>
        <p className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          <Link
            to="/online-diet-plan"
            className="font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            How the diet plan works
          </Link>
          <Link
            to="/online-workout-classes"
            className="font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Live workout classes
          </Link>
          <Link
            to="/plans"
            className="font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Packages &amp; prices
          </Link>
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : images.length === 0 ? (
        <p className="text-center text-brand-blue/50 text-sm">
          No stories added yet — check back soon.
        </p>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {images.map((src, i) => (
            <motion.img
              key={src}
              // Resized/compressed by Cloudinary instead of the full-size
              // uploads (~1.3MB for the set); off-screen ones load lazily.
              src={optimizeCloudinaryUrl(src, 600)}
              srcSet={[400, 600, 900]
                .map((w) => `${optimizeCloudinaryUrl(src, w)} ${w}w`)
                .join(", ")}
              sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, 320px"
              loading={i < 3 ? "eager" : "lazy"}
              decoding="async"
              alt={`Fitness Zone member weight loss check-in ${i + 1}`}
              className="w-full rounded-2xl shadow-md break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default SuccessStories;
