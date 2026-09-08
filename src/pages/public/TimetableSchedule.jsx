import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Card from "../../components/common/Card";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const dayDisplayOrder = [1, 2, 3, 4, 5, 6, 0]; // Monday first, Sunday last

// The 6 fixed timezones clients most often ask about, plus a 7th "My Local
// Time" option that auto-detects wherever the visitor actually is —
// covering every other country without listing them all individually.
const fixedTimezones = [
  { label: "Pakistan", flag: "🇵🇰", timeZone: "Asia/Karachi" },
  { label: "India", flag: "🇮🇳", timeZone: "Asia/Kolkata" },
  { label: "Saudi Arabia", flag: "🇸🇦", timeZone: "Asia/Riyadh" },
  { label: "UAE", flag: "🇦🇪", timeZone: "Asia/Dubai" },
  { label: "United Kingdom", flag: "🇬🇧", timeZone: "Europe/London" },
  { label: "United States (ET)", flag: "🇺🇸", timeZone: "America/New_York" },
];

const getGlobalOption = () => {
  let timeZone = "UTC";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    // fall back to UTC
  }
  return { label: "My Local Time", flag: "🌍", timeZone };
};

const TimetableSchedule = () => {
  const [dayPlans, setDayPlans] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const globalOption = getGlobalOption();
  const timezoneOptions = [...fixedTimezones, globalOption];

  // Default to a fixed zone if the visitor's detected timezone matches one
  // of the 6 exactly; otherwise default straight to "My Local Time" so
  // anyone anywhere still sees correctly converted times immediately.
  const [selectedZone, setSelectedZone] = useState(() => {
    const detected = getGlobalOption().timeZone;
    return (
      fixedTimezones.find((c) => c.timeZone === detected) || getGlobalOption()
    );
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const [dayPlansRes, timeSlotsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/day-plans/public`),
          axios.get(`${import.meta.env.VITE_API_URL}/time-slots/public`),
        ]);
        setDayPlans(dayPlansRes.data);
        setTimeSlots(timeSlotsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const sortedSlots = [...timeSlots].sort((a, b) => {
    const timeA = a.hour * 60 + a.minute;
    const timeB = b.hour * 60 + b.minute;
    return timeA - timeB;
  });

  const formatSlotTime = (hour, minute) => {
    // Slots are entered in admin as Pakistan time (Asia/Karachi, a fixed
    // UTC+5 with no DST) — build the real UTC instant that corresponds to
    // that wall-clock time, then let toLocaleTimeString convert it into
    // whichever zone is currently selected.
    const PAKISTAN_OFFSET_MS = 5 * 60 * 60 * 1000;
    const instant = new Date(
      Date.UTC(2026, 0, 1, hour, minute) - PAKISTAN_OFFSET_MS,
    );
    return instant.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: selectedZone.timeZone,
    });
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        TIME SLOTS
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-8">
        Weekly plan and daily time slots — join from your Profile once
        active.
      </p>

      <div className="flex flex-col items-center gap-2 mb-12">
        <select
          value={selectedZone.label}
          onChange={(e) =>
            setSelectedZone(
              timezoneOptions.find((c) => c.label === e.target.value),
            )
          }
          className="border border-brand-blue-pale rounded-full px-5 py-2.5 text-sm text-brand-blue font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          {timezoneOptions.map((c) => (
            <option key={c.label} value={c.label}>
              {c.flag} Show times for {c.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-brand-blue/50">
          {selectedZone.label === "My Local Time"
            ? "Detected automatically from your device — pick a country above if that's wrong."
            : "Change this anytime to see times in a different timezone."}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading schedule...</p>
      ) : (
        <>
          <h2 className="font-display text-sm text-brand-orange tracking-wide mb-4">
            WEEKLY PLAN
          </h2>
          <Card className="mb-12">
            {dayPlans.length === 0 ? (
              <p className="text-brand-blue/50 text-sm py-2">
                No weekly plan set yet.
              </p>
            ) : (
              <ul className="divide-y divide-brand-blue-pale/60">
                {dayDisplayOrder.map((dayIndex) => {
                  const plan = dayPlans.find(
                    (p) => p.day_of_week === dayIndex,
                  );
                  if (!plan) return null;
                  return (
                    <li
                      key={dayIndex}
                      className="py-3 text-sm text-brand-blue text-center sm:text-left"
                    >
                      <span className="font-display">
                        {dayNames[dayIndex]}:
                      </span>{" "}
                      <span className="text-brand-blue/70">{plan.type}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <h2 className="font-display text-sm text-brand-orange tracking-wide mb-4">
            DAILY TIME SLOTS
          </h2>
          <Card className="overflow-x-auto">
            {sortedSlots.length === 0 ? (
              <p className="text-brand-blue/50 text-sm py-2">
                No time slots scheduled yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                    <th className="py-3 px-2">Trainer</th>
                    <th className="py-3 px-2">
                      Time ({selectedZone.label})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSlots.map((slot) => (
                    <tr
                      key={slot._id}
                      className="border-b border-brand-blue-pale/60"
                    >
                      <td className="py-3 px-2 font-medium text-brand-blue">
                        {slot.trainer_ref?.name || "—"}
                      </td>
                      <td className="py-3 px-2 text-brand-blue/70">
                        {formatSlotTime(slot.hour, slot.minute)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </>
      )}
    </section>
  );
};

export default TimetableSchedule;
