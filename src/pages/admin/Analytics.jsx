import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import Card from "../../components/common/Card";

const rangeOptions = [7, 30, 90];

const StatCard = ({ label, value, sublabel }) => (
  <Card>
    <p className="text-brand-blue-light text-sm mb-1">{label}</p>
    <p className="font-display text-3xl text-brand-blue">{value}</p>
    {sublabel && (
      <p className="text-brand-blue-light text-xs mt-1">{sublabel}</p>
    )}
  </Card>
);

const Analytics = () => {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/analytics/summary?days=${days}`);
        setSummary(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [days]);

  const conversionRate =
    summary && summary.funnel.checkoutStarted > 0
      ? Math.round(
          (summary.funnel.checkoutCompleted / summary.funnel.checkoutStarted) *
            100,
        )
      : 0;

  const offerCtr =
    summary && summary.offers.popupViews > 0
      ? Math.round(
          (summary.offers.popupClicks / summary.offers.popupViews) * 100,
        )
      : 0;

  const maxDailyViews = summary
    ? Math.max(1, ...summary.dailyViews.map((d) => d.count))
    : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Analytics
        </motion.h1>
        <div className="flex items-center gap-2">
          {rangeOptions.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
                days === d
                  ? "bg-brand-blue text-white"
                  : "bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading || !summary ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <StatCard label="Page Views" value={summary.totalPageViews} />
            <StatCard
              label="Checkouts Started"
              value={summary.funnel.checkoutStarted}
            />
            <StatCard
              label="Checkouts Completed"
              value={summary.funnel.checkoutCompleted}
              sublabel={`${conversionRate}% conversion`}
            />
            <StatCard
              label="Offer Popup CTR"
              value={`${offerCtr}%`}
              sublabel={`${summary.offers.popupClicks} of ${summary.offers.popupViews} clicked`}
            />
          </div>

          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Daily Page Views
          </h2>
          <Card className="mb-10">
            {summary.dailyViews.length === 0 ? (
              <p className="text-brand-blue-light text-sm py-2">
                No page views recorded in this range yet.
              </p>
            ) : (
              <div className="flex items-end gap-1.5 h-40">
                {summary.dailyViews.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative"
                  >
                    <div
                      className="w-full bg-brand-orange/80 hover:bg-brand-orange rounded-t-md transition-colors"
                      style={{
                        height: `${Math.max(4, (d.count / maxDailyViews) * 100)}%`,
                      }}
                    />
                    <span className="absolute -top-6 text-[10px] font-semibold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {d.date}: {d.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Top Pages
          </h2>
          <Card>
            {summary.topPages.length === 0 ? (
              <p className="text-brand-blue-light text-sm py-2">
                No page views recorded in this range yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                    <th className="py-3 px-2">Page</th>
                    <th className="py-3 px-2">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.topPages.map((p) => (
                    <tr
                      key={p.path}
                      className="border-b border-brand-blue-pale/60"
                    >
                      <td className="py-3 px-2 font-medium text-brand-blue">
                        {p.path || "/"}
                      </td>
                      <td className="py-3 px-2 text-brand-blue-light">
                        {p.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default Analytics;
