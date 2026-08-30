import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Footprints, Droplet } from "lucide-react";
import axios from "axios";

const AchievementMarquee = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/daily-logs/recent-activity`,
        );
        setEntries(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntries();
  }, []);

  if (entries.length === 0) return null;

  const renderEntries = () =>
    entries.map((entry, i) => (
      <span key={i} className="flex items-center gap-2 mx-8">
        {entry.steps > 0 && (
          <>
            <Footprints size={16} className="text-brand-orange" />
            <strong>{entry.name}</strong> walked {entry.steps.toLocaleString()}{" "}
            steps
          </>
        )}
        {entry.steps > 0 && entry.water_liters > 0 && (
          <span className="mx-2">·</span>
        )}
        {entry.water_liters > 0 && (
          <>
            <Droplet size={16} className="text-brand-orange" />
            <strong>{entry.name}</strong> drank {entry.water_liters}L of water
          </>
        )}
        <span className="mx-3 opacity-50">|</span>
      </span>
    ));

  return (
    <div className="bg-brand-blue overflow-hidden py-2.5 whitespace-nowrap">
      <motion.div
        className="inline-flex text-white text-sm font-medium"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {renderEntries()}
        {renderEntries()}
      </motion.div>
    </div>
  );
};

export default AchievementMarquee;
