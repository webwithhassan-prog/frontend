import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Link2,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import SkeletonTable from "../../components/common/SkeletonTable";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";
import PhoneInput from "../../components/common/PhoneInput";
import { getErrorMessage } from "../../utils/errors";

const emptyForm = {
  description: "",
  amount: "",
  client_name: "",
  client_email: "",
  client_phone: "",
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
};

const PAGE_SIZE = 15;

const sortAccessors = {
  invoice_number: (i) => (i.invoice_number || "").toLowerCase(),
  client_name: (i) => (i.client_name || "").toLowerCase(),
  amount: (i) => i.amount ?? -Infinity,
  status: (i) => (i.status || "").toLowerCase(),
};

const CustomInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [verifyForm, setVerifyForm] = useState({ invoice_number: "", code: "" });
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  // Bumped whenever formData resets to empty, forcing PhoneInput to remount
  // back to its default country instead of keeping the last-picked one.
  const [phoneResetKey, setPhoneResetKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter((inv) => {
      const invoiceNumber = (inv.invoice_number || "").toLowerCase();
      const clientName = (inv.client_name || "").toLowerCase();
      const description = (inv.description || "").toLowerCase();
      return (
        invoiceNumber.includes(q) ||
        clientName.includes(q) ||
        description.includes(q)
      );
    });
  }, [invoices, searchQuery]);

  const sortedInvoices = useMemo(() => {
    if (!sortField) return filteredInvoices;
    const accessor = sortAccessors[sortField];
    const sorted = [...filteredInvoices].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });
    if (sortDir === "desc") sorted.reverse();
    return sorted;
  }, [filteredInvoices, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedInvoices.length / PAGE_SIZE));
  const pagedInvoices = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedInvoices.slice(start, start + PAGE_SIZE);
  }, [sortedInvoices, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortField, sortDir]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const toggleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortField(null);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ArrowUpDown size={12} className="text-brand-blue-light/50" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-brand-orange" />
    ) : (
      <ArrowDown size={12} className="text-brand-orange" />
    );
  };

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/custom-invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setGeneratedLink(null);
    setIsModalOpen(true);
    setPhoneResetKey((k) => k + 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post("/custom-invoices", {
        ...formData,
        amount: Number(formData.amount),
      });
      setGeneratedLink({ url: res.data.url, invoice_number: res.data.invoice.invoice_number });
      toast.success(`${res.data.invoice.invoice_number} created`);
      fetchInvoices();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not create invoice"));
    } finally {
      setCreating(false);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Payment link copied");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verifyForm.invoice_number || !verifyForm.code) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await api.get(
        `/custom-invoices/verify/${encodeURIComponent(verifyForm.invoice_number.trim())}/${encodeURIComponent(verifyForm.code.trim())}`,
      );
      setVerifyResult(res.data);
    } catch (err) {
      setVerifyResult({
        valid: false,
        message: getErrorMessage(err, "Could not verify"),
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleDelete = async (invoice) => {
    if (!window.confirm(`Delete ${invoice.invoice_number}? This can't be undone.`)) {
      return;
    }
    try {
      await api.delete(`/custom-invoices/${invoice._id}`);
      toast.success("Invoice removed");
      fetchInvoices();
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete invoice"));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Custom Payment Links
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> New Invoice
          </span>
        </Button>
      </div>
      <p className="text-brand-blue-light text-sm mb-6">
        For negotiated, off-menu deals — create a one-off payment link for a
        specific amount and send it to the client directly (e.g. via
        WhatsApp). Once paid, it's logged in Sales and the client gets a
        numbered invoice slip.
      </p>

      <Card className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-blue-light/10 flex items-center justify-center shrink-0">
            <Link2 className="text-brand-blue-light" size={16} />
          </div>
          <div>
            <p className="text-brand-blue text-sm font-semibold">
              Universal Payment Link
            </p>
            <p className="text-brand-blue-light text-xs">
              One link for any client — they type in the amount you already
              agreed on. Same invoice/sales tracking as above.
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            handleCopyLink(`${window.location.origin}/pay`)
          }
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-blue-light/10 text-brand-blue-light hover:bg-brand-blue-light/20 transition-colors shrink-0"
        >
          <Copy size={14} />
          Copy /pay Link
        </button>
      </Card>

      <Card className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-brand-blue-pale flex items-center justify-center shrink-0">
            <ShieldQuestion className="text-brand-blue" size={16} />
          </div>
          <div>
            <p className="text-brand-blue text-sm font-semibold">
              Verify an Invoice Slip
            </p>
            <p className="text-brand-blue-light text-xs">
              A client's screenshot can be edited — check the invoice number
              and verification code printed on it against what's really
              stored.
            </p>
          </div>
        </div>
        <form onSubmit={handleVerify} className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Invoice # (e.g. INV-00012)"
            value={verifyForm.invoice_number}
            onChange={(e) =>
              setVerifyForm({ ...verifyForm, invoice_number: e.target.value })
            }
            className="border border-brand-blue-pale rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
          />
          <input
            type="text"
            placeholder="Verification Code"
            value={verifyForm.code}
            onChange={(e) => setVerifyForm({ ...verifyForm, code: e.target.value })}
            className="border border-brand-blue-pale rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
          />
          <Button type="submit" size="sm" disabled={verifying}>
            {verifying ? "Checking..." : "Check"}
          </Button>
        </form>

        {verifyResult && (
          <div
            className={`mt-4 rounded-xl p-4 flex items-start gap-3 ${
              verifyResult.valid
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-700"
            }`}
          >
            {verifyResult.valid ? (
              <ShieldCheck size={18} className="shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            )}
            <div className="text-sm">
              {verifyResult.valid ? (
                <>
                  <p className="font-semibold mb-1">Genuine — matches our records</p>
                  <p>
                    {verifyResult.invoice.client_name} • {verifyResult.invoice.description} • ₹
                    {verifyResult.invoice.amount.toLocaleString("en-IN")} •{" "}
                    {verifyResult.invoice.status}
                  </p>
                </>
              ) : (
                <p className="font-semibold">{verifyResult.message}</p>
              )}
            </div>
          </div>
        )}
      </Card>

      {!loading && invoices.length > 0 && (
        <div className="relative w-full sm:w-72 mb-4">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue-light"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by invoice #, client, or description..."
            className="w-full border border-brand-blue-pale rounded-full pl-10 pr-9 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue-light hover:text-brand-blue"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}

      {loading ? (
        <SkeletonTable columns={6} rows={8} actionsColumn />
      ) : invoices.length === 0 ? (
        <p className="text-brand-blue-light">No custom invoices yet.</p>
      ) : filteredInvoices.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No invoices found matching "{searchQuery}".
        </p>
      ) : (
        <>
          {searchQuery && (
            <p className="text-brand-blue-light text-xs mb-3">
              {filteredInvoices.length} of {invoices.length} invoices match
            </p>
          )}
          <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                <th className="py-3 px-2">
                  <button
                    onClick={() => toggleSort("invoice_number")}
                    className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
                  >
                    Invoice # <SortIcon field="invoice_number" />
                  </button>
                </th>
                <th className="py-3 px-2">
                  <button
                    onClick={() => toggleSort("client_name")}
                    className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
                  >
                    Client <SortIcon field="client_name" />
                  </button>
                </th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">
                  <button
                    onClick={() => toggleSort("amount")}
                    className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
                  >
                    Amount <SortIcon field="amount" />
                  </button>
                </th>
                <th className="py-3 px-2">
                  <button
                    onClick={() => toggleSort("status")}
                    className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
                  >
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedInvoices.map((inv) => (
                <tr key={inv._id} className="border-b border-brand-blue-pale/60">
                  <td className="py-3 px-2 font-medium text-brand-blue">
                    {inv.invoice_number}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {inv.client_name}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {inv.description}
                  </td>
                  <td className="py-3 px-2 text-brand-blue font-medium">
                    ₹{inv.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[inv.status]}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {inv.status === "pending" && (
                      <button
                        onClick={() => handleDelete(inv)}
                        className="text-red-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
              <p className="text-brand-blue-light text-xs">
                Page {page} of {totalPages} — {sortedInvoices.length} invoices
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-blue-pale text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue-pale transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-blue-pale text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue-pale transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Custom Invoice"
      >
        {generatedLink ? (
          <div className="space-y-4">
            <p className="text-sm text-brand-blue">
              <span className="font-semibold">{generatedLink.invoice_number}</span>{" "}
              created. Send this link to the client:
            </p>
            <div className="flex items-center gap-2 border border-brand-blue-pale rounded-lg px-3 py-2">
              <input
                readOnly
                value={generatedLink.url}
                className="flex-1 text-xs text-brand-blue-light bg-transparent outline-none"
              />
              <button
                onClick={() => handleCopyLink(generatedLink.url)}
                className="text-brand-blue hover:text-brand-orange"
                title="Copy link"
              >
                <Copy size={16} />
              </button>
              <a
                href={generatedLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue hover:text-brand-orange"
                title="Open link"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            <Button
              className="w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="client_name"
              placeholder="Client Name"
              value={formData.client_name}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              name="description"
              placeholder="What's this for? (e.g. 6-month custom dietplan)"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="number"
              name="amount"
              placeholder="Agreed Amount (₹)"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="email"
              name="client_email"
              placeholder="Client Email (optional — for the receipt)"
              value={formData.client_email}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <PhoneInput
              key={phoneResetKey}
              value={formData.client_phone}
              onChange={(v) => setFormData({ ...formData, client_phone: v })}
              placeholder="Client Phone (optional)"
            />
            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? "Creating..." : "Generate Payment Link"}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default CustomInvoices;
