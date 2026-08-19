import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import axios from "axios";
import Card from "../../components/common/Card";

const countries = [
  { label: "Pakistan", flag: "🇵🇰", timeZone: "Asia/Karachi" },
  { label: "India", flag: "🇮🇳", timeZone: "Asia/Kolkata" },
  { label: "Saudi Arabia", flag: "🇸🇦", timeZone: "Asia/Riyadh" },
  { label: "UAE", flag: "🇦🇪", timeZone: "Asia/Dubai" },
];

const TimetableSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

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

  // Build the next 7 calendar days explicitly, so every day of the week shows
  // up in order — even if it currently has no classes — instead of silently
  // skipping days with no data.
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const classesByDay = next7Days.map((dayDate) => {
    const dayClasses = classes
      .filter((c) => {
        const classDate = new Date(c.datetime);
        return (
          classDate.getFullYear() === dayDate.getFullYear() &&
          classDate.getMonth() === dayDate.getMonth() &&
          classDate.getDate() === dayDate.getDate()
        );
      })
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    return { dayDate, dayClasses };
  });

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        TIMETABLE
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-8">
        This week's live sessions — join from your Profile once you have an
        active package.
      </p>

      <div className="flex justify-center mb-14">
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
      </div>

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading schedule...</p>
      ) : (
        classesByDay.map(({ dayDate, dayClasses }, i) => {
          const dayLabel = dayDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            timeZone: selectedCountry.timeZone,
          });

          return (
            <motion.div
              key={dayDate.toDateString()}
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <h2 className="font-display text-sm text-brand-orange tracking-wide mb-4">
                {dayLabel.toUpperCase()}
              </h2>

              {dayClasses.length === 0 ? (
                <p className="text-brand-blue/50 text-sm">
                  No classes scheduled.
                </p>
              ) : (
                <div className="space-y-3">
                  {dayClasses.map((c) => (
                    <Card
                      key={c._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-display text-brand-blue text-base">
                          {c.type}
                        </h3>
                        <p className="text-brand-blue/60 text-sm mt-1">
                          with {c.trainer_ref?.name || "Fitness Zone Trainer"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-brand-blue/70 text-sm">
                        <Clock size={16} />
                        {new Date(c.datetime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: selectedCountry.timeZone,
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </section>
  );
};

export default TimetableSchedule;
