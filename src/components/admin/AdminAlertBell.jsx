import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ShoppingBag, Flag } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const SEEN_KEY = "admin_sales_seen_at";
const POLL_MS = 60000;

const readSeen = () => {
  try {
    return localStorage.getItem(SEEN_KEY);
  } catch {
    return null;
  }
};
const writeSeen = (iso) => {
  try {
    localStorage.setItem(SEEN_KEY, iso);
  } catch {
    // private mode etc. — the badge just won't remember between visits
  }
};

const money = (sale) =>
  sale.amountDisplay != null
    ? `${sale.currencyCode} ${Number(sale.amountDisplay).toLocaleString()}`
    : sale.amountSettled != null
      ? `GBP ${Number(sale.amountSettled).toFixed(2)}`
      : "";

const timeAgo = (date) => {
  const mins = Math.round((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
};

// Sales and reported issues, surfaced wherever the admin is in the panel:
// a badge for what's new, a notice the moment a sale comes in, and a panel
// listing recent sales and open reports. The emails cover "right now" when
// nobody's in the panel; this covers everyone who is.
const AdminAlertBell = ({ onOpenIssuesChange, className = "" }) => {
  const [alerts, setAlerts] = useState({ sales: [], openIssues: 0, latestIssues: [] });
  const [seenAt, setSeenAt] = useState(readSeen);
  const [isOpen, setIsOpen] = useState(false);
  const newestRef = useRef(null);

  const poll = useCallback(() => {
    api
      .get("/admin-alerts")
      .then((res) => {
        const data = res.data;
        setAlerts(data);
        onOpenIssuesChange?.(data.openIssues);
        const newest = data.sales[0]?.date;
        if (!newest) return;
        // First visit ever: start from now rather than flagging history.
        if (!readSeen()) {
          writeSeen(newest);
          setSeenAt(newest);
        }
        // Something arrived since the last poll in this session.
        if (newestRef.current && new Date(newest) > new Date(newestRef.current)) {
          const fresh = data.sales.filter((s) => new Date(s.date) > new Date(newestRef.current));
          fresh.forEach((s) =>
            toast.success(`New sale: ${s.itemLabel}${money(s) ? ` — ${money(s)}` : ""}`, {
              duration: 8000,
            }),
          );
        }
        newestRef.current = newest;
      })
      .catch(() => {});
  }, [onOpenIssuesChange]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [poll]);

  const unseenSales = alerts.sales.filter(
    (s) => !seenAt || new Date(s.date) > new Date(seenAt),
  ).length;
  const badge = unseenSales + alerts.openIssues;

  const toggle = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening && alerts.sales[0]) {
      writeSeen(alerts.sales[0].date);
      setSeenAt(alerts.sales[0].date);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggle}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white text-brand-blue shadow-md border border-brand-blue-pale hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        aria-label={badge ? `Alerts: ${badge} new` : "Alerts"}
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-brand-orange text-white text-[11px] font-bold">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-brand-blue-pale z-50 text-brand-blue">
            <div className="px-4 py-3 border-b border-brand-blue-pale flex items-center justify-between">
              <p className="font-bold text-sm">Recent sales</p>
              <Link
                to="/admin/sales"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-brand-blue-light hover:text-brand-orange"
              >
                Open Sales
              </Link>
            </div>
            {alerts.sales.length === 0 ? (
              <p className="px-4 py-4 text-sm text-brand-blue/60">No sales in the last 30 days.</p>
            ) : (
              <ul className="divide-y divide-brand-blue-pale/70">
                {alerts.sales.slice(0, 8).map((s) => (
                  <li key={s.id} className="flex items-start gap-3 px-4 py-3">
                    <ShoppingBag size={16} className="mt-0.5 shrink-0 text-brand-orange" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{s.itemLabel}</p>
                      <p className="text-xs text-brand-blue/65 truncate">
                        {s.clientName} · {timeAgo(s.date)}
                      </p>
                    </div>
                    <p className="text-xs font-bold tabular-nums whitespace-nowrap">{money(s)}</p>
                  </li>
                ))}
              </ul>
            )}

            <div className="px-4 py-3 border-y border-brand-blue-pale flex items-center justify-between">
              <p className="font-bold text-sm">
                Open issue reports{alerts.openIssues ? ` (${alerts.openIssues})` : ""}
              </p>
              <Link
                to="/admin/issues"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-brand-blue-light hover:text-brand-orange"
              >
                Open Issues
              </Link>
            </div>
            {alerts.latestIssues.length === 0 ? (
              <p className="px-4 py-4 text-sm text-brand-blue/60">No open reports.</p>
            ) : (
              <ul className="divide-y divide-brand-blue-pale/70">
                {alerts.latestIssues.map((issue) => (
                  <li key={issue._id} className="flex items-start gap-3 px-4 py-3">
                    <Flag size={16} className="mt-0.5 shrink-0 text-red-500" />
                    <div className="min-w-0">
                      <p className="text-sm line-clamp-2">{issue.message}</p>
                      <p className="text-xs text-brand-blue/65 truncate">
                        {issue.name || "Anonymous"} · {issue.page || "—"} · {timeAgo(issue.createdAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAlertBell;
