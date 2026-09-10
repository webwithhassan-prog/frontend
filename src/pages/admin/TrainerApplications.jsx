import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, User, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";
import { getErrorMessage } from "../../utils/errors";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const TrainerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [offerTerms, setOfferTerms] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openOfferModal = (application) => {
    setSelectedApplication(application);
    setOfferTerms("");
    setIsOfferModalOpen(true);
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    await api.put(`/applications/${selectedApplication._id}/approve`, {
      offer_terms: offerTerms,
    });
    setIsOfferModalOpen(false);
    fetchData();
  };

  const handleReject = async (id) => {
    await api.put(`/applications/${id}/reject`);
    fetchData();
  };

  const handleDeleteApplication = async (app) => {
    if (
      !window.confirm(
        `Permanently delete ${app.name}'s application? This can't be undone.`,
      )
    ) {
      return;
    }
    try {
      await api.delete(`/applications/${app._id}`);
      toast.success("Application deleted");
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete application"));
    }
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Trainer Applications
      </motion.h1>
      <p className="text-brand-blue-light text-sm mb-8">
        Review applications from people wanting to join as a trainer.
        Approving one adds them to the Trainers list, ready to assign a Daily
        Time Slot.
      </p>

      {loading ? (
        <Loader />
      ) : applications.length === 0 ? (
        <p className="text-brand-blue-light">No applications yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card key={app._id}>
              <div className="flex items-start gap-4 mb-3">
                <div className="w-14 h-14 rounded-full bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
                  {app.photo_url ? (
                    <img
                      src={app.photo_url}
                      alt={app.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-brand-blue-light" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-brand-blue font-bold">{app.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-brand-blue-light text-sm capitalize">
                    {app.specialty}
                    {app.years_experience
                      ? ` · ${app.years_experience} yrs experience`
                      : ""}
                  </p>
                </div>
              </div>

              {app.available_days && (
                <p className="text-brand-blue-light text-xs mb-1">
                  Available: {app.available_days}
                </p>
              )}

              {app.bio && (
                <p className="text-brand-blue-light text-sm mb-3 leading-relaxed">
                  {app.bio}
                </p>
              )}

              <p className="text-brand-blue-light text-xs mb-1">
                Contact: {app.contact}
              </p>

              {app.cv_link && (
                <a
                  href={app.cv_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange text-sm underline mb-3 inline-block"
                >
                  View CV
                </a>
              )}

              {app.offer_terms && (
                <p className="text-xs text-brand-blue-light bg-brand-blue-pale rounded-lg p-3 mb-4">
                  Offer: {app.offer_terms}
                </p>
              )}

              <div className="flex gap-3 mt-3">
                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => openOfferModal(app)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(app._id)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      <X size={14} /> Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteApplication(app)}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue-pale text-brand-blue-light hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title={`Approve ${selectedApplication?.name || ""}`}
      >
        <form onSubmit={handleApprove} className="space-y-4">
          <textarea
            placeholder="Offer / onboarding notes"
            value={offerTerms}
            onChange={(e) => setOfferTerms(e.target.value)}
            required
            rows={4}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            Approve & Add as Trainer
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default TrainerApplications;
