import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
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

// Slots are grouped by the hour they fall on in the selected timezone, so
// someone in London sees their own mornings and evenings, not Pakistan's.
const periods = [
  { key: "morning", label: "Morning", icon: Sunrise, from: 4, to: 12 },
  { key: "afternoon", label: "Afternoon", icon: Sun, from: 12, to: 17 },
  { key: "evening", label: "Evening", icon: Sunset, from: 17, to: 21 },
  { key: "night", label: "Night", icon: Moon, from: 21, to: 28 }, // 21:00–03:59
];

const periodFor = (hour) => {
  const h = hour < 4 ? hour + 24 : hour;
  return periods.find((p) => h >= p.from && h < p.to);
};

// Slots are entered in admin as Pakistan time (Asia/Karachi, a fixed UTC+5
// with no DST) — this is the real UTC instant for that wall-clock time,
// today. Converting on today's date, not a fixed one, keeps zones with
// daylight saving (UK, US) right all year instead of an hour off in summer.
const PAKISTAN_OFFSET_MS = 5 * 60 * 60 * 1000;
const slotInstant = (hour, minute) => {
  const pkt = new Date(Date.now() + PAKISTAN_OFFSET_MS);
  return new Date(
    Date.UTC(pkt.getUTCFullYear(), pkt.getUTCMonth(), pkt.getUTCDate(), hour, minute) -
      PAKISTAN_OFFSET_MS,
  );
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

  // Wall-clock hour/minute of a slot in the selected timezone.
  const localParts = (hour, minute) => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: selectedZone.timeZone,
    }).formatToParts(slotInstant(hour, minute));
    const get = (type) => Number(parts.find((p) => p.type === type)?.value);
    return { hour: get("hour"), minute: get("minute") };
  };

  const formatSlotTime = (hour, minute) =>
    slotInstant(hour, minute).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: selectedZone.timeZone,
    });

  // Ordered by the visitor's own clock (a slot can cross midnight once
  // converted), then bucketed into parts of their day.
  const slotsByPeriod = periods
    .map((period) => ({
      ...period,
      slots: timeSlots
        .map((slot) => {
          const local = localParts(slot.hour, slot.minute);
          return { ...slot, local, sortKey: ((local.hour + 20) % 24) * 60 + local.minute };
        })
        .filter((slot) => periodFor(slot.local.hour) === period)
        .sort((a, b) => a.sortKey - b.sortKey),
    }))
    .filter((period) => period.slots.length > 0);

  const todayIndex = (() => {
    try {
      const weekday = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        timeZone: selectedZone.timeZone,
      }).format(new Date());
      return dayNames.indexOf(weekday);
    } catch {
      return new Date().getDay();
    }
  })();

  const weekPlans = dayDisplayOrder
    .map((dayIndex) => ({
      dayIndex,
      plan: dayPlans.find((p) => p.day_of_week === dayIndex),
    }))
    .filter((d) => d.plan);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12 md:py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        TIME SLOTS
      </motion.h1>
      <p className="text-brand-blue/70 text-center text-sm md:text-base mb-4">
        The same slots run every day — join from your Profile once active.
      </p>

      <div className="flex flex-col items-center gap-1.5 mb-6 md:mb-8">
        <label htmlFor="timezone" className="sr-only">
          Show times for
        </label>
        <select
          id="timezone"
          value={selectedZone.label}
          onChange={(e) =>
            setSelectedZone(
              timezoneOptions.find((c) => c.label === e.target.value),
            )
          }
          className="max-w-full border border-brand-blue-pale rounded-full px-5 py-2.5 text-sm text-brand-blue font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          {timezoneOptions.map((c) => (
            <option key={c.label} value={c.label}>
              {c.flag} Show times for {c.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-brand-blue/50 text-center">
          {selectedZone.label === "My Local Time"
            ? "Detected from your device — change it if that's wrong."
            : "Change this to see times in another timezone."}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading schedule...</p>
      ) : (
        <>
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h2 className="font-display text-sm text-brand-orange tracking-wide">
              DAILY TIME SLOTS
            </h2>
            <p className="text-xs text-brand-blue/50">
              {selectedZone.label} time
            </p>
          </div>
          <Card padding="p-3.5 sm:p-5" className="mb-8 md:mb-10">
            {slotsByPeriod.length === 0 ? (
              <p className="text-brand-blue/50 text-sm py-2">
                No time slots scheduled yet.
              </p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {slotsByPeriod.map((period) => (
                  <div key={period.key}>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-blue/60 mb-1.5">
                      <period.icon size={13} className="text-brand-orange" />
                      {period.label}
                    </p>
                    <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {period.slots.map((slot) => (
                        <li
                          key={slot._id}
                          className="rounded-xl bg-brand-blue-pale/50 border border-brand-blue-pale px-1.5 py-1.5 text-center"
                        >
                          <p className="font-display text-sm text-brand-blue tabular-nums whitespace-nowrap">
                            {formatSlotTime(slot.hour, slot.minute)}
                          </p>
                          <p className="text-[11px] text-brand-blue/60 truncate">
                            {slot.trainer_ref?.name || "—"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <h2 className="font-display text-sm text-brand-orange tracking-wide mb-3">
            WEEKLY PLAN
          </h2>
          <Card padding="p-3 sm:p-4">
            {weekPlans.length === 0 ? (
              <p className="text-brand-blue/50 text-sm py-2 px-1">
                No weekly plan set yet.
              </p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-7 gap-2">
                {weekPlans.map(({ dayIndex, plan }, i) => {
                  const isToday = dayIndex === todayIndex;
                  // An odd last tile spans the row on phones instead of
                  // sitting alone next to a gap.
                  const spanLast =
                    i === weekPlans.length - 1 && weekPlans.length % 2 === 1;
                  return (
                    <li
                      key={dayIndex}
                      className={`rounded-xl px-3 py-2.5 md:px-2 md:py-3 md:text-center border ${
                        isToday
                          ? "bg-brand-blue border-brand-blue text-white"
                          : "bg-white border-brand-blue-pale text-brand-blue"
                      } ${spanLast ? "col-span-2 md:col-span-1" : ""}`}
                    >
                      <p
                        className={`flex items-center md:justify-center gap-1.5 font-display text-xs tracking-wide ${
                          isToday ? "text-brand-orange" : "text-brand-blue"
                        }`}
                      >
                        {dayNames[dayIndex].slice(0, 3).toUpperCase()}
                        {isToday && (
                          <span className="text-[9px] font-bold bg-brand-orange text-white rounded-full px-1.5 py-px">
                            TODAY
                          </span>
                        )}
                      </p>
                      <p
                        className={`text-xs leading-snug mt-0.5 ${
                          isToday ? "text-white/85" : "text-brand-blue/70"
                        }`}
                      >
                        {plan.type}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </section>
  );
};

export default TimetableSchedule;
