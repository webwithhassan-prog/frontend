import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Stethoscope,
  Heart,
  Brain,
  Apple,
  Activity,
  Dumbbell,
  ChevronDown,
  Briefcase,
  Clock,
  Wallet,
  UserRound,
  MoreHorizontal,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import { useCurrency } from "../../context/CurrencyContext";

const consultationSpecialties = [
  { value: "dietician", label: "Dietician", icon: Apple },
  { value: "gynecologist", label: "Gynecologist", icon: Heart },
  { value: "psychiatrist", label: "Psychiatrist", icon: Brain },
  { value: "physiotherapist", label: "Physiotherapist", icon: Activity },
  { value: "personal_trainer", label: "Fitness Trainer", icon: Dumbbell },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

const Consultation = () => {
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [loadingConsultants, setLoadingConsultants] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth();
  const { format } = useCurrency();

  const handleSelectSpecialty = async (specialty) => {
    setSelectedSpecialty(specialty);
    setIsSpecialtyOpen(false);
    setLoadingConsultants(true);
    try {
      const res = await api.get("/consultants/public");
      setConsultants(res.data.filter((c) => c.specialty === specialty.value));
    } catch (err) {
      console.error(err);
      setConsultants([]);
    } finally {
      setLoadingConsultants(false);
    }
  };

  const handleBook = async (consultant) => {
    if (role !== "client") {
      localStorage.setItem(
        "pending_consultation_consultant_id",
        consultant._id,
      );
      navigate("/signup");
      return;
    }

    setBookingId(consultant._id);
    try {
      const clientId = localStorage.getItem("client_id");
      const res = await api.post("/payments/stripe/consultation-checkout", {
        client_id: clientId,
        consultant_id: consultant._id,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not start checkout");
      setBookingId(null);
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
          psychiatrist, physiotherapist, or fitness trainer — and book a
          session directly.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <div className="relative flex justify-center mb-8">
          <button
            onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
            className="flex items-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:bg-brand-orange-dark transition-colors"
          >
            Book a Consultation
            <ChevronDown
              size={18}
              className={`transition-transform ${isSpecialtyOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isSpecialtyOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsSpecialtyOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-3 w-72 bg-white rounded-2xl shadow-lg border border-brand-blue-pale py-2 z-20"
                >
                  {consultationSpecialties.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => handleSelectSpecialty(s)}
                      className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-brand-blue hover:bg-brand-blue-pale transition-colors"
                    >
                      <s.icon size={16} className="text-brand-orange" />
                      {s.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {selectedSpecialty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-brand-blue/60 text-xs uppercase tracking-wide text-center mb-4">
              Available {selectedSpecialty.label}s
            </p>
            {loadingConsultants ? (
              <p className="text-brand-blue/60 text-sm text-center">
                Loading...
              </p>
            ) : consultants.length === 0 ? (
              <p className="text-brand-blue/60 text-sm text-center">
                No {selectedSpecialty.label.toLowerCase()}s available right
                now — check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultants.map((c) => (
                  <Card key={c._id} className="h-full flex flex-col text-center">
                    <div className="w-20 h-20 rounded-full bg-brand-blue-pale overflow-hidden flex items-center justify-center mx-auto mb-4">
                      {c.photo_url ? (
                        <img
                          src={c.photo_url}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <selectedSpecialty.icon
                          className="text-brand-blue"
                          size={28}
                        />
                      )}
                    </div>
                    <h3 className="font-display text-brand-blue text-base mb-2">
                      {c.name}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-brand-blue/60 mb-3">
                      {c.years_experience && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={12} /> {c.years_experience} yrs
                        </span>
                      )}
                      {c.session_duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {c.session_duration}
                        </span>
                      )}
                      {c.fee && (
                        <span className="flex items-center gap-1">
                          <Wallet size={12} /> {format(c.fee)}
                        </span>
                      )}
                      {c.max_clients_per_session && (
                        <span className="flex items-center gap-1">
                          <UserRound size={12} /> Max{" "}
                          {c.max_clients_per_session} client
                          {c.max_clients_per_session > 1 ? "s" : ""}/session
                        </span>
                      )}
                    </div>
                    {c.bio && (
                      <p className="text-brand-blue/70 text-xs leading-relaxed mb-5 flex-1">
                        {c.bio}
                      </p>
                    )}
                    <Button
                      size="sm"
                      onClick={() => handleBook(c)}
                      disabled={bookingId === c._id || !c.fee}
                      className="w-full mt-auto"
                    >
                      {bookingId === c._id
                        ? "Redirecting..."
                        : !c.fee
                          ? "Fee not set"
                          : "Book"}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Consultation;
