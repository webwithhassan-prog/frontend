import { useState } from "react";
import { Copy, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Button from "../common/Button";
import { getErrorMessage } from "../../utils/errors";

const fieldClass =
  "w-full border border-brand-blue-pale rounded-lg px-3 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange";

// yyyy-mm-dd in local time, for a date input.
const toDateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-sm font-semibold text-brand-blue mb-1">
      {label}
    </span>
    {children}
    {hint && (
      <span className="block text-xs text-brand-blue-light mt-1">{hint}</span>
    )}
  </label>
);

// Every editable detail of one client, plus a password reset for clients
// who can't log in. Saves through PUT /clients/:id/details, which checks
// everything before saving anything.
const EditClientForm = ({ client, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    name: client.name || "",
    email: client.email || "",
    phone_number: client.phone_number || "",
    country: client.country || "",
    status: client.status || "expired",
    access_expires_at: toDateInput(client.access_expires_at),
    has_dietplan: !!client.has_dietplan,
    has_workout: !!client.has_workout,
    diet_plans_total: String(client.diet_plans_total ?? 0),
    diet_plans_used: String(client.diet_plans_used ?? 0),
    onboarding_completed: !!client.onboarding_completed,
  });
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [newPassword, setNewPassword] = useState(null);

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/clients/${client._id}/details`, {
        ...form,
        diet_plans_total: Number(form.diet_plans_total || 0),
        diet_plans_used: Number(form.diet_plans_used || 0),
        // End of the chosen day, so the client keeps that whole day.
        access_expires_at: form.access_expires_at
          ? new Date(`${form.access_expires_at}T23:59:59`).toISOString()
          : null,
      });
      toast.success(`${form.name.trim() || "Client"} updated`);
      onSaved();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't save the changes"));
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    const ok = window.confirm(
      `Set a new password for ${client.name}? Their current password will stop working.`,
    );
    if (!ok) return;
    setResetting(true);
    try {
      const res = await api.put(`/clients/${client._id}/reset-password`);
      setNewPassword(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't reset the password"));
    } finally {
      setResetting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Name">
        <input
          type="text"
          value={form.name}
          onChange={set("name")}
          required
          className={fieldClass}
        />
      </Field>

      <Field label="Login email">
        <input
          type="email"
          value={form.email}
          onChange={set("email")}
          required
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={fieldClass}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="WhatsApp number" hint="With country code, e.g. +92…">
          <input
            type="tel"
            value={form.phone_number}
            onChange={set("phone_number")}
            required
            className={fieldClass}
          />
        </Field>
        <Field label="Country">
          <input
            type="text"
            value={form.country}
            onChange={set("country")}
            className={fieldClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Status">
          <select
            value={form.status}
            onChange={set("status")}
            className={`${fieldClass} bg-white`}
          >
            <option value="active">Active</option>
            <option value="paused">Paused (frozen)</option>
            <option value="expired">Expired</option>
          </select>
        </Field>
        <Field label="Access until" hint="Leave empty for no access date">
          <input
            type="date"
            value={form.access_expires_at}
            onChange={set("access_expires_at")}
            className={fieldClass}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="block text-sm font-semibold text-brand-blue mb-1.5">
          Packages
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-blue">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.has_dietplan}
              onChange={set("has_dietplan")}
              className="accent-brand-orange w-4 h-4"
            />
            Dietplan
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.has_workout}
              onChange={set("has_workout")}
              className="accent-brand-orange w-4 h-4"
            />
            Workout
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.onboarding_completed}
              onChange={set("onboarding_completed")}
              className="accent-brand-orange w-4 h-4"
            />
            Onboarding form done
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Diet plans in total">
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={form.diet_plans_total}
            onChange={set("diet_plans_total")}
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
        <Field label="Diet plans used">
          <input
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={form.diet_plans_used}
            onChange={set("diet_plans_used")}
            className={`${fieldClass} tabular-nums`}
          />
        </Field>
      </div>

      <div className="rounded-xl bg-brand-blue-pale/40 px-4 py-3">
        <p className="text-sm font-semibold text-brand-blue">
          Client can&apos;t log in?
        </p>
        {newPassword ? (
          <div className="mt-2 space-y-1 text-sm text-brand-blue">
            <p>Share these login details with the client — they won&apos;t be shown again.</p>
            <p>
              Email: <span className="font-mono">{newPassword.email}</span>
            </p>
            <p className="flex items-center gap-2">
              Password:{" "}
              <span className="font-mono">{newPassword.password}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(newPassword.password);
                  toast.success("Password copied");
                }}
                aria-label="Copy password"
                title="Copy password"
                className="text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <Copy size={14} />
              </button>
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-brand-blue-light mt-0.5 mb-2">
              They can also log in with their WhatsApp number instead of
              their email.
            </p>
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetting}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <KeyRound size={14} />
              {resetting ? "Setting…" : "Set a new password"}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="secondary"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditClientForm;
