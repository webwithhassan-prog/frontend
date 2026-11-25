import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import api from "../../services/api";

const W = 360;
const H = 170;
const PAD = { top: 14, right: 12, bottom: 26, left: 34 };

const fmtDate = (d) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { day: "numeric", month: "short" });

// The client's weight over their weekly check-ins, with how much they've
// changed since starting. Drawn as plain SVG; the numbers come from the
// check-in form (only weight and inch loss are stored).
const ProgressChart = ({ clientId, refreshKey, className = "" }) => {
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    if (!clientId) return;
    api
      .get(`/clients/${clientId}/progress`)
      .then((res) => setEntries(Array.isArray(res.data) ? res.data : []))
      .catch(() => setEntries([]));
  }, [clientId, refreshKey]);

  if (entries === null) return null;

  const points = entries.filter((e) => e.weight_kg);
  if (points.length === 0) {
    return (
      <div className={`rounded-2xl border border-dashed border-brand-blue-pale bg-white p-5 text-center ${className}`}>
        <p className="font-semibold text-brand-blue text-sm">Your progress chart</p>
        <p className="text-xs text-brand-blue/60 mt-1">
          Fill in your weekly check-in below — your weight shows up here each
          week so you can see how far you've come.
        </p>
      </div>
    );
  }

  const start = points[0].starting_weight_kg || points[0].weight_kg;
  const latest = points[points.length - 1].weight_kg;
  const change = Math.round((latest - start) * 10) / 10;
  const totalInches = points.reduce((sum, e) => sum + (e.inch_loss || 0), 0);

  // Chart scale with a little room above and below.
  const series = [{ date: points[0].date, w: start, isStart: true }, ...points.map((p) => ({ date: p.date, w: p.weight_kg }))];
  const ws = series.map((s) => s.w);
  const lo = Math.floor(Math.min(...ws) - 1);
  const hi = Math.ceil(Math.max(...ws) + 1);
  const x = (i) =>
    PAD.left + (series.length === 1 ? (W - PAD.left - PAD.right) / 2 : (i * (W - PAD.left - PAD.right)) / (series.length - 1));
  const y = (w) => PAD.top + ((hi - w) * (H - PAD.top - PAD.bottom)) / (hi - lo || 1);
  const path = series.map((s, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(s.w).toFixed(1)}`).join(" ");
  const area = `${path} L${x(series.length - 1).toFixed(1)},${H - PAD.bottom} L${x(0).toFixed(1)},${H - PAD.bottom} Z`;
  const ticks = [hi, Math.round(((hi + lo) / 2) * 10) / 10, lo];
  // Date labels: first, last and (if room) middle.
  const labelIdx = [...new Set([0, Math.floor((series.length - 1) / 2), series.length - 1])];

  const lost = change < 0;
  return (
    <div className={`rounded-2xl border border-brand-blue-pale bg-white p-4 sm:p-5 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
        <div>
          <p className="font-semibold text-brand-blue text-sm">Your progress</p>
          <p className="text-xs text-brand-blue/60">
            {points.length} check-in{points.length === 1 ? "" : "s"} · started at {start} kg
          </p>
        </div>
        <div className="text-right">
          <p className={`flex items-center justify-end gap-1 font-display text-xl ${lost ? "text-green-600" : change > 0 ? "text-brand-orange" : "text-brand-blue"}`}>
            {lost ? <TrendingDown size={18} aria-hidden="true" /> : change > 0 ? <TrendingUp size={18} aria-hidden="true" /> : null}
            {change === 0 ? "No change yet" : `${lost ? "−" : "+"}${Math.abs(change)} kg`}
          </p>
          {totalInches > 0 && (
            <p className="text-xs text-brand-blue/60">{Math.round(totalInches * 10) / 10} inches lost</p>
          )}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Weight from ${start} kg to ${latest} kg`}>
        <defs>
          <linearGradient id="progress-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f76b1c" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f76b1c" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#dbe4f5" strokeDasharray="3 4" />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize="12" fill="#6b7a99">
              {t}
            </text>
          </g>
        ))}
        {series.length > 1 && <path d={area} fill="url(#progress-fill)" />}
        <path d={path} fill="none" stroke="#f76b1c" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {series.map((s, i) => (
          <circle key={i} cx={x(i)} cy={y(s.w)} r={i === series.length - 1 ? 5.5 : 3.5} fill={i === series.length - 1 ? "#12224a" : "#f76b1c"} stroke="#fff" strokeWidth="2" />
        ))}
        {labelIdx.map((i) => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"} fontSize="12" fill="#6b7a99">
            {series[i].isStart ? "Start" : fmtDate(series[i].date)}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default ProgressChart;
