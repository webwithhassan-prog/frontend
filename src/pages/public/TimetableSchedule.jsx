import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import axios from "axios";
import Card from "../../components/common/Card";

const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TimetableSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const sorted = [...classes].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime),
  );

  const grouped = sorted.reduce((acc, c) => {
    const day = new Date(c.datetime).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(c);
    return acc;
  }, {});

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
      <p className="text-brand-blue/70 text-center mb-14">
        Upcoming live sessions — join from your Profile once booked.
      </p>

      {loading ? (
        <p className="text-center text-brand-blue/70">Loading schedule...</p>
      ) : sorted.length === 0 ? (
        <p className="text-center text-brand-blue/70">
          No upcoming classes scheduled yet.
        </p>
      ) : (
        Object.entries(grouped).map(([day, dayClasses], i) => (
          <motion.div
            key={day}
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <h2 className="font-display text-sm text-brand-orange tracking-wide mb-4">
              {day.toUpperCase()}
            </h2>
            <div className="space-y-3">
              {dayClasses.map((c) => (
                <Card key={c._id} className="flex items-center justify-between">
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
                    {new Date(c.datetime).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </section>
  );
};

export default TimetableSchedule;
