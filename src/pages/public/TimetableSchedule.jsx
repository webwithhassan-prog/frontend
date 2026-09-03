import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Card from "../../components/common/Card";

const countries = [
  { label: "Pakistan", flag: "🇵🇰", timeZone: "Asia/Karachi" },
  { label: "India", flag: "🇮🇳", timeZone: "Asia/Kolkata" },
  { label: "Saudi Arabia", flag: "🇸🇦", timeZone: "Asia/Riyadh" },
  { label: "UAE", flag: "🇦🇪", timeZone: "Asia/Dubai" },
];

const detectCountry = () => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return countries.find((c) => c.timeZone === timeZone) || null;
  } catch {
    return null;
  }
};

const TimetableSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(
    () => detectCountry() || countries[0],
  );
  const [autoDetected] = useState(() => !!detectCountry());

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/classes/public`,
        );
        setClasses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  // Weekly Plan: one representative class per real upcoming date, showing day + type
  const weeklyPlan = next7Days.map((dayDate) => {
    const match = classes.find((c) => {
      const classDate = new Date(c.datetime);
      return (
        classDate.getFullYear() === dayDate.getFullYear() &&
        classDate.getMonth() === dayDate.getMonth() &&
        classDate.getDate() === dayDate.getDate()
      );
    });
    return {
      dayDate,
      type: match?.type || null,
      cancelled: match?.status === "cancelled",
      cancelReason: match?.cancel_reason,
    };
  });
  // Daily Time Slots: unique trainer + time-of-day combos (same pattern repeats every day)
  const slotMap = new Map();
  classes.forEach((c) => {
    const d = new Date(c.datetime);
    const trainerName = c.trainer_ref?.name || "—";
    const key = `${trainerName}-${d.getHours()}-${d.getMinutes()}`;
    if (!slotMap.has(key)) {
      slotMap.set(key, { trainerName, datetime: c.datetime });
    }
  });
  const dailyTimeSlots = [...slotMap.values()].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime),
  );

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
        This week's plan and daily time slots — join from your Profile once
        active.
      </p>

      <div className="flex flex-col items-center gap-2 mb-12">
        <select
          value={selectedCountry.label}
          onChange={(e) =>
            setSelectedCountry(
              countries.find((c) => c.label === e.target.value),
            )
          }
          className="border border-brand-blue-pale rounded-full px-5 py-2.5 text-sm text-brand-blue font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          {countries.map((c) => (
            <option key={c.label} value={c.label}>
              {c.flag} Show times for {c.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-brand-blue/50">
          {autoDetected
            ? "Detected automatically from your location — change it above if that's wrong."
            : "Couldn't detect your location — pick your country above."}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading schedule...</p>
      ) : (
        <>
          <h2 className="font-display text-sm text-brand-orange tracking-wide mb-4">
            THIS WEEK'S PLAN
          </h2>
          <Card className="overflow-x-auto mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                  <th className="py-3 px-2">Day</th>
                  <th className="py-3 px-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {weeklyPlan.map(
                  ({ dayDate, type, cancelled, cancelReason }) => (
                    <tr
                      key={dayDate.toDateString()}
                      className="border-b border-brand-blue-pale/60"
                    >
                      <td className="py-3 px-2 font-medium text-brand-blue">
                        {dayDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                          timeZone: selectedCountry.timeZone,
                        })}
                      </td>
                      <td className="py-3 px-2 text-brand-blue/70">
                        {cancelled ? (
                          <span className="text-red-500">
                            Cancelled{cancelReason ? ` — ${cancelReason}` : ""}
                          </span>
                        ) : (
                          type || (
                            <span className="italic text-brand-blue/40">
                              No classes
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </Card>

          <h2 className="font-display text-sm text-brand-orange tracking-wide mb-4">
            DAILY TIME SLOTS
          </h2>
          <Card className="overflow-x-auto">
            {dailyTimeSlots.length === 0 ? (
              <p className="text-brand-blue/50 text-sm py-2">
                No time slots scheduled yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                    <th className="py-3 px-2">Trainer</th>
                    <th className="py-3 px-2">
                      Time ({selectedCountry.label})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailyTimeSlots.map((slot, i) => (
                    <tr key={i} className="border-b border-brand-blue-pale/60">
                      <td className="py-3 px-2 font-medium text-brand-blue">
                        {slot.trainerName}
                      </td>
                      <td className="py-3 px-2 text-brand-blue/70">
                        {new Date(slot.datetime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                          timeZone: selectedCountry.timeZone,
                        })}
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
