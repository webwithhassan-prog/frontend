import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../services/api";

const TestimonialsSlider = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (loading) return null;

  if (images.length === 0) {
    return (
      <p className="text-center text-white/60 text-sm">
        No success stories added yet — check back soon.
      </p>
    );
  }

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  const goNext = () => setIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="relative max-w-sm mx-auto">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={images[index]}
            alt="Client success story"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-brand-blue hover:text-brand-orange transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white shadow-md rounded-full p-2 text-brand-blue hover:text-brand-orange transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-brand-orange" : "w-2 bg-brand-blue-pale"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TestimonialsSlider;
