import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, DollarSign, Calendar } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const requestStatusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  scheduled: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

const Professionals = () => {
  const [applications, setApplications] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [offerTerms, setOfferTerms] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentGateway, setPaymentGateway] = useState("stripe");

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [scheduleConsultant, setScheduleConsultant] = useState("");
  const [scheduleDatetime, setScheduleDatetime] = useState("");

  const fetchData = async () => {
    try {
      const [applicationsRes, consultationsRes, requestsRes, consultantsRes] =
        await Promise.all([
          api.get("/applications"),
          api.get("/consultations"),
          api.get("/consultation-requests"),
          api.get("/consultants"),
        ]);
      setApplications(applicationsRes.data);
      setConsultations(consultationsRes.data);
      setRequests(requestsRes.data);
      setConsultants(consultantsRes.data);
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

  const openPaymentModal = (consultation) => {
    setSelectedConsultation(consultation);
    setPaymentAmount("");
    setPaymentGateway("stripe");
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    await api.post("/payments/consultation", {
      client_id: selectedConsultation.client_ref?._id,
      professional_id: selectedConsultation.consultant_ref?._id,
      amount: Number(paymentAmount),
      gateway: paymentGateway,
    });
    setIsPaymentModalOpen(false);
    fetchData();
  };

  const commission = paymentAmount
    ? (Number(paymentAmount) * 0.1).toFixed(2)
    : "0.00";

  const openScheduleModal = (request) => {
    setSelectedRequest(request);
    // Pre-fill with the client's preferred consultant, if they picked one
    setScheduleConsultant(request.preferred_consultant_ref?._id || "");
    setScheduleDatetime("");
    setIsScheduleModalOpen(true);
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    await api.put(`/consultation-requests/${selectedRequest._id}/schedule`, {
      consultant_ref: scheduleConsultant,
      datetime: scheduleDatetime,
    });
    setIsScheduleModalOpen(false);
    fetchData();
  };

  const handleDeclineRequest = async (id) => {
    await api.put(`/consultation-requests/${id}/decline`);
    fetchData();
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Professionals
      </motion.h1>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <>
          {/* Consultation Requests */}
          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Consultation Requests
          </h2>
          {requests.filter((r) => r.status === "pending").length === 0 ? (
            <p className="text-brand-blue-light mb-12">No pending requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {requests
                .filter((r) => r.status === "pending")
                .map((req) => (
                  <Card key={req._id}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-brand-blue font-bold capitalize">
                        {req.specialty}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${requestStatusColors[req.status]}`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-brand-blue-light text-sm mb-1">
                      Client: {req.client_ref?.name} (
                      {req.client_ref?.phone_number})
                    </p>
                    {req.preferred_consultant_ref && (
                      <p className="text-brand-blue-light text-sm mb-1">
                        Requested:{" "}
                        <span className="font-medium text-brand-blue">
                          {req.preferred_consultant_ref.name}
                        </span>
                      </p>
                    )}
                    <p className="text-brand-blue-light text-sm mb-4">
                      Preferred time:{" "}
                      {req.preferred_time || "No preference given"}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openScheduleModal(req)}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        <Calendar size={14} /> Schedule
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req._id)}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        <X size={14} /> Decline
                      </button>
                    </div>
                  </Card>
                ))}
            </div>
          )}

          {/* Job Applications */}
          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Job Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {applications.map((app) => (
              <Card key={app._id}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-brand-blue font-bold">{app.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="text-brand-blue-light text-sm capitalize mb-1">
                  {app.specialty}
                </p>
                <p className="text-brand-blue-light text-sm mb-1">
                  {app.contact}
                </p>
                <a
                  href={app.cv_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange text-sm underline mb-4 inline-block"
                >
                  View CV
                </a>

                {app.offer_terms && (
                  <p className="text-xs text-brand-blue-light bg-brand-blue-pale rounded-lg p-3 mb-4">
                    Offer: {app.offer_terms}
                  </p>
                )}

                {app.status === "pending" && (
                  <div className="flex gap-3">
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
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* 1-on-1 Bookings & Commission */}
          <h2 className="text-lg font-bold text-brand-blue mb-4">
            1-on-1 Consultations & Commission
          </h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                  <th className="py-3 px-2">Consultant</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Date & Time</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((c) => (
                  <tr
                    key={c._id}
                    className="border-b border-brand-blue-pale/60"
                  >
                    <td className="py-3 px-2 font-medium text-brand-blue">
                      {c.consultant_ref?.name || "—"}
                    </td>
                    <td className="py-3 px-2 text-brand-blue-light">
                      {c.client_ref?.name || "—"}
                    </td>
                    <td className="py-3 px-2 text-brand-blue-light">
                      {new Date(c.datetime).toLocaleString()}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => openPaymentModal(c)}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-colors"
                      >
                        <DollarSign size={14} /> Record Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title={`Approve ${selectedApplication?.name || ""}`}
      >
        <form onSubmit={handleApprove} className="space-y-4">
          <textarea
            placeholder="Offer / payment terms & conditions"
            value={offerTerms}
            onChange={(e) => setOfferTerms(e.target.value)}
            required
            rows={4}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            Approve & Send Offer
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Record Payment — ${selectedConsultation?.consultant_ref?.name || ""}`}
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <input
            type="number"
            placeholder="Amount (Rs)"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <select
            value={paymentGateway}
            onChange={(e) => setPaymentGateway(e.target.value)}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="stripe">Stripe</option>
            <option value="easypaisa">Easypaisa</option>
            <option value="jazzcash">JazzCash</option>
          </select>

          <p className="text-sm text-brand-blue-light">
            Platform commission (10%):{" "}
            <span className="font-semibold text-brand-blue">
              Rs {commission}
            </span>
          </p>

          <Button type="submit" className="w-full">
            Record Payment
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title={`Schedule — ${selectedRequest?.client_ref?.name || ""}`}
      >
        <form onSubmit={handleSchedule} className="space-y-4">
          {selectedRequest?.preferred_consultant_ref && (
            <p className="text-xs text-brand-blue-light bg-brand-blue-pale rounded-lg p-3">
              Client requested:{" "}
              <span className="font-semibold text-brand-blue">
                {selectedRequest.preferred_consultant_ref.name}
              </span>
            </p>
          )}
          <select
            value={scheduleConsultant}
            onChange={(e) => setScheduleConsultant(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Select Consultant</option>
            {consultants
              .filter((c) => c.specialty === selectedRequest?.specialty)
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          <input
            type="datetime-local"
            value={scheduleDatetime}
            onChange={(e) => setScheduleDatetime(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            Confirm Schedule
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Professionals;
