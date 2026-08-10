import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const ZoomAccess = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    class_id: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

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
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/join/lookup`,
        formData,
      );
      window.location.href = res.data.join_url;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to verify your details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <motion.h1
        className="text-3xl font-bold text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Join Your Class
      </motion.h1>
      <p className="text-brand-blue-light text-center mb-8">
        Enter your name and phone number to access your class — no login needed.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            required
            disabled={loadingClasses}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">
              {loadingClasses ? "Loading classes..." : "Select Your Class"}
            </option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.type} — {c.trainer_ref?.name} —{" "}
                {new Date(c.datetime).toLocaleString()}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-brand-blue text-sm">{message}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Join Class"}
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default ZoomAccess;
