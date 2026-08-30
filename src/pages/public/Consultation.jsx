import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Stethoscope, Check } from "lucide-react";
import axios from "axios";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const specialtyLabels = {
  dietician: "Dietician",
  gynecologist: "Gynecologist",
  psychiatrist: "Psychiatrist",
  personal_trainer: "Personal Trainer",
  other: "Other",
};

const Consultation = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuth();

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/consultants/public`,
        );
        setConsultants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

  const handleSelect = (consultant) => {
    setSelectedConsultant(consultant);
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (role !== "client") {
      localStorage.setItem(
        "pending_consultation_specialty",
        selectedConsultant.specialty,
      );
      localStorage.setItem(
        "pending_consultation_consultant_id",
        selectedConsultant._id,
      );
      localStorage.setItem("pending_consultation_time", preferredTime);
      navigate("/signup");
      return;
    }

    setSubmitting(true);
    try {
      const clientId = localStorage.getItem("client_id");
      await api.post("/consultation-requests", {
        client_id: clientId,
        specialty: selectedConsultant.specialty,
        consultant_id: selectedConsultant._id,
        preferred_time: preferredTime,
      });
      setMessage(
        "Request sent — we\u2019ll confirm a time with you soon. You can track it from your Profile.",
      );
      setSelectedConsultant(null);
      setPreferredTime("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <Stethoscope className="mx-auto text-brand-orange mb-4" size={36} />
        <h1 className="font-display text-3xl text-brand-blue mb-3">
          1-ON-1 CONSULTATION
        </h1>
        <p className="text-brand-blue/70 max-w-xl mx-auto">
          Choose who you'd like to speak with — a dietician, gynecologist,
          psychiatrist, or personal trainer — and request a time that works for
          you.
        </p>
      </motion.div>

      {loading ? (
        <p className="text-center text-brand-blue/70">
          Loading available professionals...
        </p>
      ) : consultants.length === 0 ? (
        <p className="text-center text-brand-blue/70">
          No consultants available yet — check back soon.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {consultants.map((c, i) => {
              const isSelected = selectedConsultant?._id === c._id;
              return (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer text-center transition-all ${
                      isSelected ? "border-brand-orange border-2" : ""
                    }`}
                  >
                    <button onClick={() => handleSelect(c)} className="w-full">
                      <div className="inline-flex bg-brand-blue-pale rounded-full p-3 mb-3">
                        {c.photo_url ? (
                          <img
                            src={c.photo_url}
                            alt={c.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <Stethoscope className="text-brand-blue" size={20} />
                        )}
                      </div>
                      <h3 className="font-display text-brand-blue text-base mb-1">
                        {c.name}
                      </h3>
                      <p className="text-brand-blue/60 text-xs mb-3">
                        {specialtyLabels[c.specialty] || c.specialty}
                      </p>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-orange">
                          <Check size={14} /> Selected
                        </span>
                      )}
                    </button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {selectedConsultant && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="max-w-lg mx-auto">
                <p className="text-brand-blue text-sm mb-4">
                  Requesting a session with{" "}
                  <span className="font-semibold">
                    {selectedConsultant.name}
                  </span>{" "}
                  <span className="text-brand-blue/60">
                    (
                    {specialtyLabels[selectedConsultant.specialty] ||
                      selectedConsultant.specialty}
                    )
                  </span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Preferred time (e.g. Weekday evenings)"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />

                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {message && (
                    <p className="text-brand-blue text-sm">{message}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Request Consultation"}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </section>
  );
};

export default Consultation;
