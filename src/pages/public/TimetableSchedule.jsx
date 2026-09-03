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

// Fixed weekly workout plan — same every week, always shown Monday through Saturday
const weeklyWorkoutPlan = [
  { day: "Monday", type: "Yoga and Stretching" },
  { day: "Tuesday", type: "Upper Body Strength Training" },
  { day: "Wednesday", type: "Lower Body Strength Training" },
  { day: "Thursday", type: "Aerobics & Tabata" },
  { day: "Friday", type: "Abs & Belly" },
  { day: "Saturday", type: "Full Body Workout" },
];

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
        Weekly plan and daily time slots — join from your Profile once
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
            WEEKLY PLAN
          </h2>
          <Card className="mb-3">
            <ul className="divide-y divide-brand-blue-pale/60">
              {weeklyWorkoutPlan.map(({ day, type }) => (
                <li
                  key={day}
                  className="py-3 text-sm text-brand-blue text-center sm:text-left"
                >
                  <span className="font-display">{day}:</span>{" "}
                  <span className="text-brand-blue/70">{type}</span>
                </li>
              ))}
            </ul>
          </Card>
          <p className="text-brand-blue/60 text-xs text-center mb-12">
            Cardio &amp; Facial Yoga included every day.
          </p>

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
