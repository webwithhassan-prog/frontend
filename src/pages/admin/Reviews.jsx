import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

const StarRow = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={14}
        className={n <= rating ? "fill-brand-orange text-brand-orange" : "text-brand-blue-pale"}
      />
    ))}
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Reviews
      </motion.h1>
      <p className="text-brand-blue-light text-sm mb-8">
        Client reviews of 1-on-1 consultations. Not shown publicly yet —
        collected here until there's enough volume to display on the site.
      </p>

      {loading ? (
        <Loader />
      ) : reviews.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No reviews yet — they'll show up here once clients start reviewing
          completed 1-on-1 sessions.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r._id}>
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <div>
                  <h3 className="text-brand-blue font-bold">
                    {r.consultant_ref?.name || "Unknown consultant"}
                  </h3>
                  <p className="text-brand-blue-light text-xs capitalize">
                    {r.consultant_ref?.specialty}
                  </p>
                </div>
                <StarRow rating={r.rating} />
              </div>
              {r.comment && (
                <p className="text-brand-blue text-sm mb-2">{r.comment}</p>
              )}
              <p className="text-brand-blue-light text-xs">
                {r.client_ref?.name || "Client"} ·{" "}
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
