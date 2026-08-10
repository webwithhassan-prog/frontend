import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const specialties = ["dietician", "gynecologist", "psychiatrist"];

const Consultation = () => {
  const [specialty, setSpecialty] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (role !== "client") {
      localStorage.setItem("pending_consultation_specialty", specialty);
      localStorage.setItem("pending_consultation_time", preferredTime);
      navigate("/signup");
      return;
    }

    setSubmitting(true);
    try {
      const clientId = localStorage.getItem("client_id");
      await api.post("/consultation-requests", {
        client_id: clientId,
        specialty,
        preferred_time: preferredTime,
      });
      setMessage(
        "Request sent — we\u2019ll confirm a time with you soon. You can track it from your Profile.",
      );
      setSpecialty("");
      setPreferredTime("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <Stethoscope className="mx-auto text-brand-orange mb-4" size={36} />
        <h1 className="font-display text-3xl text-brand-blue mb-3">
          1-ON-1 CONSULTATION
        </h1>
        <p className="text-brand-blue/70">
          Talk directly to a dietician, gynecologist, or psychiatrist. Tell us
          who you'd like to speak with and a rough time — we'll confirm the
          exact slot with you.
        </p>
      </motion.div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Select Specialty</option>
            {specialties.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Preferred time (e.g. Weekday evenings)"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-brand-blue text-sm">{message}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Request Consultation"}
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default Consultation;
