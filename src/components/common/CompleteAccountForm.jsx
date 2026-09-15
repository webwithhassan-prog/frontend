import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Button from "./Button";
import PhoneInput from "./PhoneInput";
import { getErrorMessage } from "../../utils/errors";

// Shared between the inline prompt on the payment-success page (right
// after paying, they're still on the tab) and the standalone page reached
// from the emailed setup link (a closed tab, or a different device) —
// same account, same one-time token, same form either way.
const CompleteAccountForm = ({ token, email, onDone }) => {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/complete-account", {
        token,
        phone_number: phone,
        password,
      });
      login(res.data.token, res.data.role, res.data.client_id);
      toast.success("You're all set!");
      onDone?.();
    } catch (err) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-left">
      {email && (
        <div>
          <label className="block text-xs font-semibold text-brand-blue-light mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm bg-brand-blue-pale/30 text-brand-blue/70"
          />
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-brand-blue-light mb-1">
          Phone Number
        </label>
        <PhoneInput value={phone} onChange={setPhone} required />
      </div>
      <div>
        <label className="block text-xs font-semibold text-brand-blue-light mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-blue/40 hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Setting up..." : "Set Password & Continue"}
      </Button>
    </form>
  );
};

export default CompleteAccountForm;
