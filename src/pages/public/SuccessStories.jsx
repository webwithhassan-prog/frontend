import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import Loader from "../../components/common/Loader";

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
      <p className="text-brand-blue/70 text-center mb-14">
        Real check-ins, real progress, from real members.
      </p>

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
              src={src}
              alt={`Success story ${i + 1}`}
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
