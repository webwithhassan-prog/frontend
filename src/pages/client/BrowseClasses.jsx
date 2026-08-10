import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const BrowseClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState(null);
  const [message, setMessage] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleBook = async (classId) => {
    setMessage("");
    try {
      const clientId = localStorage.getItem("client_id");
      await api.post("/bookings", { client_id: clientId, class_id: classId });
      setMessage("Class booked successfully!");
      fetchClasses();
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  const trainerNames = [
    ...new Set(classes.map((c) => c.trainer_ref?.name).filter(Boolean)),
  ];
  const classTypes = [...new Set(classes.map((c) => c.type))];

  const filteredClasses = classes.filter((c) => {
    return (
      (!trainerFilter || c.trainer_ref?.name === trainerFilter) &&
      (!typeFilter || c.type === typeFilter)
    );
  });

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Browse Classes
      </motion.h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <select
          value={trainerFilter}
          onChange={(e) => setTrainerFilter(e.target.value)}
          className="border border-brand-blue-pale rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          <option value="">All Trainers</option>
          {trainerNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-brand-blue-pale rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
        >
          <option value="">All Types</option>
          {classTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <motion.p
          className="text-brand-blue font-medium mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {message}
        </motion.p>
      )}

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredClasses.map((classItem) => (
            <Card key={classItem._id}>
              <h3 className="text-brand-blue font-bold text-lg mb-1">
                {classItem.type}
              </h3>
              <p className="text-brand-blue-light text-sm mb-1">
                Trainer: {classItem.trainer_ref?.name || "—"}
              </p>
              <p className="text-brand-blue-light text-sm mb-4">
                {new Date(classItem.datetime).toLocaleString()}
              </p>
              <Button onClick={() => handleBook(classItem._id)}>
                Book Class
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseClasses;
