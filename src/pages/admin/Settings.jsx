import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Lock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useSettings } from "../../context/SettingsContext";
import { getErrorMessage } from "../../utils/errors";

const Settings = () => {
  const { settings, refetchSettings } = useSettings();
  const [whatsappGeneral, setWhatsappGeneral] = useState("");
  const [whatsappDietician, setWhatsappDietician] = useState("");
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    setWhatsappGeneral(settings.whatsapp_general || "");
    setWhatsappDietician(settings.whatsapp_dietician || "");
  }, [settings]);

  const handleSaveWhatsapp = async (e) => {
    e.preventDefault();
    setSavingWhatsapp(true);
    try {
      await api.put("/settings", {
        whatsapp_general: whatsappGeneral,
        whatsapp_dietician: whatsappDietician,
      });
      await refetchSettings();
      toast.success("WhatsApp numbers updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update"));
    } finally {
      setSavingWhatsapp(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    setChangingPassword(true);
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password updated");
    } catch (err) {
      const msg = getErrorMessage(err, "Something went wrong");
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Settings
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-brand-blue-light/10 flex items-center justify-center shrink-0">
              <MessageCircle className="text-brand-blue-light" size={16} />
            </div>
            <div>
              <p className="text-brand-blue text-sm font-semibold">
                WhatsApp Numbers
              </p>
              <p className="text-brand-blue-light text-xs">
                Used across the site's chat links and buttons.
              </p>
            </div>
          </div>
          <form onSubmit={handleSaveWhatsapp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-blue-light mb-1.5">
                General / Site-wide (Navbar, Footer, Contact)
              </label>
              <input
                type="text"
                placeholder="e.g. 447462164602"
                value={whatsappGeneral}
                onChange={(e) => setWhatsappGeneral(e.target.value)}
                className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-blue-light mb-1.5">
                Dietician (dietplan-only clients)
              </label>
              <input
                type="text"
                placeholder="e.g. 919220447415"
                value={whatsappDietician}
                onChange={(e) => setWhatsappDietician(e.target.value)}
                className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
              />
            </div>
            <p className="text-xs text-brand-blue-light">
              Enter with country code, digits only (no "+" or spaces) — e.g.
              447462164602 for +44 7462 164602.
            </p>
            <Button type="submit" disabled={savingWhatsapp}>
              {savingWhatsapp ? "Saving..." : "Save Numbers"}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-brand-blue-pale flex items-center justify-center shrink-0">
              <Lock className="text-brand-blue" size={16} />
            </div>
            <div>
              <p className="text-brand-blue text-sm font-semibold">
                Change Password
              </p>
              <p className="text-brand-blue-light text-xs">
                Updates the password for this admin account.
              </p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
            />
            {passwordMessage && (
              <p className="text-green-600 text-sm">{passwordMessage}</p>
            )}
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
            <Button type="submit" disabled={changingPassword}>
              {changingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
