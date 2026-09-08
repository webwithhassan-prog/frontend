import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

const PAGE_SIZE = 10;

const sortOptions = [
  { field: "createdAt", label: "Date" },
  { field: "rating", label: "Rating" },
  { field: "consultant", label: "Consultant" },
];

const sortAccessors = {
  createdAt: (r) => new Date(r.createdAt).getTime(),
  rating: (r) => r.rating ?? -Infinity,
  consultant: (r) => (r.consultant_ref?.name || "").toLowerCase(),
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

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

  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) => {
      const consultant = (r.consultant_ref?.name || "").toLowerCase();
      const client = (r.client_ref?.name || "").toLowerCase();
      const comment = (r.comment || "").toLowerCase();
      return (
        consultant.includes(q) || client.includes(q) || comment.includes(q)
      );
    });
  }, [reviews, searchQuery]);

  const sortedReviews = useMemo(() => {
    const accessor = sortAccessors[sortField];
    const sorted = [...filteredReviews].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });
    if (sortDir === "desc") sorted.reverse();
    return sorted;
  }, [filteredReviews, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / PAGE_SIZE));
  const pagedReviews = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedReviews.slice(start, start + PAGE_SIZE);
  }, [sortedReviews, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortField, sortDir]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const toggleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir(field === "createdAt" ? "desc" : "asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

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

      {!loading && reviews.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="relative w-full sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue-light"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by consultant, client, or comment..."
              className="w-full border border-brand-blue-pale rounded-full pl-10 pr-9 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue-light hover:text-brand-blue"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-brand-blue-light">Sort by:</span>
            {sortOptions.map((opt) => (
              <button
                key={opt.field}
                onClick={() => toggleSort(opt.field)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  sortField === opt.field
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "text-brand-blue-light hover:bg-brand-blue-pale"
                }`}
              >
                {opt.label}
                {sortField === opt.field &&
                  (sortDir === "asc" ? (
                    <ArrowUp size={11} />
                  ) : (
                    <ArrowDown size={11} />
                  ))}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : reviews.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No reviews yet — they'll show up here once clients start reviewing
          completed 1-on-1 sessions.
        </p>
      ) : filteredReviews.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No reviews found matching "{searchQuery}".
        </p>
      ) : (
        <>
          {searchQuery && (
            <p className="text-brand-blue-light text-xs mb-3">
              {filteredReviews.length} of {reviews.length} reviews match
            </p>
          )}
          <div className="space-y-4">
          {pagedReviews.map((r) => (
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
              <p className="text-brand-blue-light text-xs">
                Page {page} of {totalPages} — {sortedReviews.length} reviews
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-blue-pale text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue-pale transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-blue-pale text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue-pale transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;
