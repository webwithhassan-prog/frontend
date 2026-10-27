import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw, Star, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getErrorMessage } from "../../utils/errors";

const formatDate = (d) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

// Client reviews from the dashboard. Nothing is public until approved here;
// approved reviews show on the Success Stories page.
const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews");
      setReviews(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load reviews"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const setStatus = async (review, status) => {
    try {
      await api.put(`/reviews/${review._id}`, { status });
      toast.success(
        status === "approved"
          ? "Review published"
          : status === "rejected"
            ? "Review hidden"
            : "Moved back to pending",
      );
      fetchReviews();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update the review"));
    }
  };

  const handleDelete = async (review) => {
    if (!window.confirm(`Delete ${review.display_name}'s review for good?`))
      return;
    try {
      await api.delete(`/reviews/${review._id}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete the review"));
    }
  };

  const counts = reviews.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] || 0) + 1 }),
    {},
  );
  const shown =
    filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Client Reviews
      </motion.h1>
      <p className="text-sm text-brand-blue-light mb-6">
        Reviews clients write from their dashboard. Approve one to show it on
        the Success Stories page.
      </p>

      <div
        className="flex flex-wrap gap-2 mb-6"
        role="tablist"
        aria-label="Filter reviews"
      >
        {[
          ["pending", "Pending"],
          ["approved", "Published"],
          ["rejected", "Hidden"],
          ["all", "All"],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              filter === key
                ? "bg-brand-blue text-white"
                : "bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70"
            }`}
          >
            {label}
            {key !== "all" && counts[key] ? ` (${counts[key]})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : shown.length === 0 ? (
        <Card>
          <p className="text-sm text-brand-blue/70">
            {filter === "pending"
              ? "No reviews waiting for approval."
              : "No reviews here yet."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {shown.map((r) => (
            <Card key={r._id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-brand-blue">
                    {r.display_name}
                  </p>
                  <p className="text-xs text-brand-blue/60">
                    {r.client_ref?.name || "Deleted client"}
                    {r.client_ref?.phone_number
                      ? ` · ${r.client_ref.phone_number}`
                      : ""}{" "}
                    · {formatDate(r.updatedAt)}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[r.status]}`}
                >
                  {r.status === "approved"
                    ? "Published"
                    : r.status === "rejected"
                      ? "Hidden"
                      : "Pending"}
                </span>
              </div>
              <p
                className="flex gap-0.5 mb-2"
                role="img" aria-label={`${r.rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={16}
                    className={
                      n <= r.rating
                        ? "fill-brand-gold text-brand-gold"
                        : "text-brand-blue-pale"
                    }
                    aria-hidden="true"
                  />
                ))}
              </p>
              <p className="text-sm text-brand-blue/85 leading-relaxed whitespace-pre-line">
                {r.text}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {r.status !== "approved" && (
                  <button
                    onClick={() => setStatus(r, "approved")}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <Check size={14} /> Publish
                  </button>
                )}
                {r.status !== "rejected" && (
                  <button
                    onClick={() => setStatus(r, "rejected")}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <X size={14} /> Hide
                  </button>
                )}
                {r.status !== "pending" && (
                  <button
                    onClick={() => setStatus(r, "pending")}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <RotateCcw size={14} /> Back to pending
                  </button>
                )}
                <button
                  onClick={() => handleDelete(r)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
