import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { getErrorMessage } from "../../utils/errors";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

// Admin's review queue for manual (non-Stripe) payment claims — a client
// transferred money themselves and reported it via WhatsApp; this is
// where that gets cross-checked against the real account and either
// confirmed (grants the package/e-book/course, same as the Stripe
// webhook would) or rejected.
const ManualPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await api.get("/payments/manual/pending");
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleConfirm = async (id) => {
    setActioningId(id);
    try {
      await api.put(`/payments/manual/${id}/confirm`);
      toast.success("Payment confirmed and activated");
      fetchPending();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to confirm payment"));
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this payment? The client will not be activated.")) {
      return;
    }
    setActioningId(id);
    try {
      await api.put(`/payments/manual/${id}/reject`);
      toast.success("Payment rejected");
      fetchPending();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to reject payment"));
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Manual Payments
      </motion.h1>
      <p className="text-brand-blue-light text-sm mb-8">
        Bank transfer / JazzCash / Easypaisa claims awaiting verification.
        Check the client's reported payment against the real account (they
        message the screenshot on WhatsApp), then confirm or reject.
      </p>

      {loading ? (
        <Loader />
      ) : payments.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No manual payments waiting for review.
        </p>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                <th className="py-3 px-2">Client</th>
                <th className="py-3 px-2">Item</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Slip</th>
                <th className="py-3 px-2">Submitted</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-brand-blue-pale/60">
                  <td className="py-3 px-2">
                    <p className="font-medium text-brand-blue">{p.client_name}</p>
                    <p className="text-xs text-brand-blue-light">{p.client_phone}</p>
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {p.item_label}
                    {p.manual_batch_id && (
                      <span className="ml-1.5 text-[10px] text-brand-orange font-semibold">
                        (bundle)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">{p.method_name}</td>
                  <td className="py-3 px-2 text-brand-blue font-medium">
                    {p.currency_code} {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-2">
                    {p.slip_url ? (
                      <a href={p.slip_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={optimizeCloudinaryUrl(p.slip_url, 100)}
                          alt="Payment slip"
                          className="h-10 w-10 rounded-md object-cover border border-brand-blue-pale hover:opacity-80 transition-opacity"
                        />
                      </a>
                    ) : (
                      <span className="text-xs text-brand-blue-light">
                        Sent on WhatsApp
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light text-xs">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirm(p._id)}
                        disabled={actioningId === p._id}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      >
                        <Check size={14} /> Confirm
                      </button>
                      <button
                        onClick={() => handleReject(p._id)}
                        disabled={actioningId === p._id}
                        className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      >
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default ManualPayments;
