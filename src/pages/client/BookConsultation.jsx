import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const BookConsultation = () => {
  const [consultants, setConsultants] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [datetime, setDatetime] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const clientId = localStorage.getItem("client_id");
      const [consultantsRes, clientRes] = await Promise.all([
        api.get("/consultants/public"),
        api.get(`/clients/${clientId}`),
      ]);
      setConsultants(consultantsRes.data);
      setClient(clientRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const clientId = localStorage.getItem("client_id");

      const consultationRes = await api.post("/consultations", {
        consultant_ref: selectedConsultant,
        client_ref: clientId,
        datetime,
      });

      await api.post("/bookings", {
        client_id: clientId,
        consultation_id: consultationRes.data._id,
      });

      setMessage("Consultation booked successfully!");
      setSelectedConsultant("");
      setDatetime("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  const isPremium = client?.has_premium === true;
  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Book a 1-on-1 Consultation
      </motion.h1>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : !isPremium ? (
        <Card className="max-w-lg text-center border-brand-orange border-2">
          <p className="text-brand-blue font-semibold mb-4">
            1-on-1 consultations are available on Premium plans only.
          </p>
          <Button onClick={() => navigate("/plans")}>Upgrade to Premium</Button>
        </Card>
      ) : (
        <Card className="max-w-lg">
          {message && (
            <motion.p
              className="text-brand-blue font-medium mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.p>
          )}

          <form onSubmit={handleBook} className="space-y-4">
            <select
              value={selectedConsultant}
              onChange={(e) => setSelectedConsultant(e.target.value)}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
              <option value="">Select Consultant</option>
              {consultants.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} — {c.specialty}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />

            <Button type="submit" className="w-full">
              Book Consultation
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default BookConsultation;
