import { Globe } from "lucide-react";
import { useTimeZone } from "../../context/TimeZoneContext";
import {
  TIMEZONE_CHOICES,
  choiceFor,
  deviceTimeZone,
  offsetLabel,
  placeName,
} from "../../utils/timezones";

// "Showing times in 🇵🇰 Pakistan (GMT+5)" with a dropdown to change it —
// the same setting on the timetable and the client dashboard.
const TimeZonePicker = ({ className = "", align = "center" }) => {
  const { timeZone, isDeviceZone, setTimeZone } = useTimeZone();
  const device = deviceTimeZone();
  const current = choiceFor(timeZone);
  const deviceListed = !!choiceFor(device);

  const name = placeName(timeZone);
  const flag = current?.flag || "🌍";

  return (
    <div
      className={`flex flex-col gap-1.5 ${align === "center" ? "items-center text-center" : "items-start"} ${className}`}
    >
      <p className="flex flex-wrap items-center gap-1.5 text-sm text-brand-blue">
        <Globe
          size={15}
          className="text-brand-orange shrink-0"
          aria-hidden="true"
        />
        <span>Showing times in</span>
        <strong className="font-semibold">
          {flag} {name}
        </strong>
        <span className="text-brand-blue/60 tabular-nums">
          ({offsetLabel(timeZone)})
        </span>
      </p>
      <label className="flex items-center gap-2 text-xs text-brand-blue/70">
        <span>Change:</span>
        <select
          value={isDeviceZone ? "" : timeZone}
          onChange={(e) => setTimeZone(e.target.value || null)}
          className="max-w-[16rem] border border-brand-blue-pale rounded-full px-3 py-1.5 text-xs text-brand-blue bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          <option value="">
            My device — {placeName(device)} ({offsetLabel(device)})
          </option>
          {TIMEZONE_CHOICES.filter(
            (c) => !deviceListed || c.id !== choiceFor(device)?.id,
          ).map((c) => (
            <option key={c.id} value={c.id}>
              {c.flag} {c.country} ({offsetLabel(c.id)})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default TimeZonePicker;
