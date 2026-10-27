import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../common/Card";
import Button from "../common/Button";
import { getErrorMessage } from "../../utils/errors";

const STATUS = {
  pending: {
    label: "Waiting for approval",
    className: "bg-amber-100 text-amber-800",
    note: "Thanks! Your review will appear on the site once our team has checked it.",
  },
  approved: {
    label: "Published",
    className: "bg-green-100 text-green-700",
    note: "Your review is live on our Success Stories page — thank you!",
  },
  rejected: {
    label: "Not published",
    className: "bg-red-100 text-red-700",
    note: "This review wasn't published. You can edit it and send it again.",
  },
};

// "Leave a review" on the client dashboard. One review per client; editing
// it sends it back for approval.
const ReviewCard = () => {
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/reviews/mine")
      .then((res) => {
        const r = res.data.review;
        setReview(r);
        setRating(r?.rating || 0);
        setText(r?.text || "");
        setDisplayName(r?.display_name || res.data.suggested_name || "");
        setEditing(!r);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Tap a star to choose your rating");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/reviews/mine", {
        rating,
        text,
        display_name: displayName,
      });
      setReview(res.data);
      setEditing(false);
      toast.success("Review sent — thank you!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't send your review"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;
  const status = review && STATUS[review.status];

  return (
    <Card className="max-w-xl">
      {!editing && review ? (
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <p
              className="flex gap-0.5"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={18}
                  className={
                    n <= review.rating
                      ? "fill-brand-gold text-brand-gold"
                      : "text-brand-blue-pale"
                  }
                  aria-hidden="true"
                />
              ))}
            </p>
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${status.className}`}
            >
              {status.label}
            </span>
          </div>
          <p className="text-brand-blue/85 leading-relaxed">“{review.text}”</p>
          <p className="text-sm text-brand-blue/60 mt-2">
            — {review.display_name}
          </p>
          <p className="text-xs text-brand-blue/60 mt-3">{status.note}</p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-3 text-sm font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
          >
            Edit review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset>
            <legend className="block text-sm font-semibold text-brand-blue mb-1.5">
              Your rating
            </legend>
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  <Star
                    size={30}
                    className={
                      n <= (hover || rating)
                        ? "fill-brand-gold text-brand-gold"
                        : "text-brand-blue-pale"
                    }
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1">
              Your experience
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={1000}
              required
              placeholder="How has your diet plan or the classes helped you?"
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </label>

          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1">
              Name to show
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={60}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <span className="block text-xs text-brand-blue/60 mt-1">
              Shown with your review. Your surname is shortened to an initial by
              default.
            </span>
          </label>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={saving}>
              {saving
                ? "Sending…"
                : review
                  ? "Send updated review"
                  : "Send review"}
            </Button>
            {review && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm font-semibold text-brand-blue/60 hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </Card>
  );
};

export default ReviewCard;
