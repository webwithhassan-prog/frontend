import { useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import Modal from "../admin/Modal";
import Button from "./Button";
import { getErrorMessage } from "../../utils/errors";

const inputClass =
  "w-full border border-brand-blue-pale rounded-lg px-3.5 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange";

const emptyForm = { name: "", contact: "", message: "", website: "" };

// "Report an issue": a link that opens a short form. Reports land on the
// admin Reported Issues page and are emailed to the support inbox; the page
// the visitor was on is recorded automatically.
const ReportIssue = ({ className = "", label = "Report an issue" }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/issues", { ...form, page: location.pathname + location.search });
      toast.success("Thanks — your report has been sent to our team.");
      setForm(emptyForm);
      setIsOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't send your report. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={className}>
        {label}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Report an issue">
        <form onSubmit={submit} className="space-y-4">
          <p className="text-sm text-brand-blue/70">
            Something not working or looking wrong? Tell us what happened and
            our team will look into it.
          </p>
          {/* Hidden from people; bots that fill every field get rejected. */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={update}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1.5">
              What went wrong?
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={update}
              required
              minLength={5}
              maxLength={2000}
              rows={4}
              placeholder="e.g. The Pay with Card button didn't respond on my phone"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1.5">
              Your name <span className="font-normal text-brand-blue/60">(optional)</span>
            </span>
            <input name="name" value={form.name} onChange={update} maxLength={100} className={inputClass} />
          </label>
          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1.5">
              Email or WhatsApp number{" "}
              <span className="font-normal text-brand-blue/60">(optional — so we can reply)</span>
            </span>
            <input
              name="contact"
              value={form.contact}
              onChange={update}
              maxLength={150}
              className={inputClass}
            />
          </label>
          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? "Sending..." : "Send report"}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default ReportIssue;
