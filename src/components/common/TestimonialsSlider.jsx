import { useState, useEffect } from "react";
import api from "../../services/api";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";
import CardSlider from "./CardSlider";

// Success-story screenshots on the homepage: one at a time with arrows on
// either side, swipe, dots, and auto-advance until the visitor takes over.
const TestimonialsSlider = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/testimonials/public");
        setTestimonials(res.data.filter((t) => t.image_url));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Same footprint as the slider, so the page below doesn't jump on load.
  if (loading) {
    return (
      <div className="max-w-sm mx-auto px-2 sm:px-0 py-2" aria-hidden="true">
        <div className="aspect-[4/5] rounded-2xl bg-white/10 animate-pulse" />
        <div className="h-2 mt-4" />
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <p className="text-center text-white/60 text-sm">
        No success stories added yet — check back soon.
      </p>
    );
  }

  return (
    <CardSlider
      className="max-w-md mx-auto"
      itemClassName="max-w-sm"
      tone="dark"
      autoAdvanceMs={5000}
      items={testimonials}
      getKey={(t) => t._id}
      getLabel={(t, i) => `success story ${i + 1}`}
      itemName="success story"
      renderItem={(t, i) => (
        <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl bg-white/10">
          <img
            src={optimizeCloudinaryUrl(t.image_url, 600)}
            srcSet={[400, 600, 800, 1000]
              .map((w) => `${optimizeCloudinaryUrl(t.image_url, w)} ${w}w`)
              .join(", ")}
            sizes="(max-width: 640px) 85vw, 384px"
            alt={`Client success story ${i + 1} of ${testimonials.length}`}
            // The browser's own image drag would hijack the swipe on desktop.
            draggable={false}
            className="w-full h-full object-cover select-none"
          />
        </div>
      )}
    />
  );
};

export default TestimonialsSlider;
