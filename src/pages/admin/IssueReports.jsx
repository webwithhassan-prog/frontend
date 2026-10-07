import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getErrorMessage } from "../../utils/errors";

const formatDate = (d) =>
  new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// Problems visitors and clients reported through "Report an issue".
// Open ones come first; resolving keeps them for reference.
const IssueReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("open");

  const fetchReports = async () => {
    try {
      const res = await api.get("/issues");
      setReports(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load reported issues"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const setStatus = async (report, status) => {
    try {
      await api.put(`/issues/${report._id}`, { status });
      toast.success(status === "resolved" ? "Marked as resolved" : "Reopened");
      fetchReports();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update the report"));
    }
  };

  const remove = async (report) => {
    if (!window.confirm("Delete this report? This can't be undone.")) return;
    try {
      await api.delete(`/issues/${report._id}`);
      toast.success("Report deleted");
      fetchReports();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete the report"));
    }
  };

  const openCount = reports.filter((r) => r.status === "open").length;
  const shown = filter === "all" ? reports : reports.filter((r) => r.status === filter);

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Reported Issues
      </motion.h1>
      <p className="text-brand-blue-light text-sm mb-6">
        Problems sent through &ldquo;Report an issue&rdquo; on the website.
        Each new report is also emailed to the support inbox.
      </p>

      <div className="flex gap-2 mb-6">
        {[
          ["open", `Open (${openCount})`],
          ["resolved", "Resolved"],
          ["all", "All"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              filter === value
                ? "bg-brand-blue text-white"
                : "bg-white text-brand-blue hover:bg-brand-blue-pale"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : shown.length === 0 ? (
        <Card revealOnScroll={false}>
          <p className="text-brand-blue-light text-sm">
            {filter === "open" ? "No open reports — nothing needs attention." : "No reports here."}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {shown.map((report) => (
            <Card key={report._id} revealOnScroll={false} padding="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-bold text-brand-blue">
                    {report.name || "Anonymous"}
                    {report.contact && (
                      <span className="font-normal text-brand-blue-light"> · {report.contact}</span>
                    )}
                  </p>
                  <p className="text-xs text-brand-blue/60">
                    {formatDate(report.createdAt)} · {report.page || "page not recorded"}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    report.status === "open"
                      ? "bg-brand-orange/15 text-brand-orange-dark"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {report.status}
                </span>
              </div>
              <p className="text-sm text-brand-blue whitespace-pre-wrap mb-4">{report.message}</p>
              <div className="flex gap-4">
                {report.status === "open" ? (
                  <button
                    onClick={() => setStatus(report, "resolved")}
                    className="flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <CheckCircle2 size={16} /> Mark resolved
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus(report, "open")}
                    className="flex items-center gap-1.5 text-sm font-semibold text-brand-blue-light hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  >
                    <RotateCcw size={16} /> Reopen
                  </button>
                )}
                <button
                  onClick={() => remove(report)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueReports;
