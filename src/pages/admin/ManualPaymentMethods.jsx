import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";
import { getErrorMessage } from "../../utils/errors";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

const CLOUDINARY_CLOUD_NAME = "zyfxigcj";
const CLOUDINARY_UPLOAD_PRESET = "FitnessZone";

const emptyForm = {
  country_code: "",
  name: "",
  logo_url: null,
  fields: [{ label: "", value: "" }],
  active: true,
  sort_order: 0,
};

// Admin CRUD for manual (non-Stripe) payment methods — e.g. "JazzCash" for
// PK or "STC Pay" for SA. Adding support for a new country's bank/wallet is
// just adding one of these here, no code change or deploy needed — the
// public checkout side (ManualPaymentPanel) fetches whatever's active for
// the client's detected country.
const ManualPaymentMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchMethods = async () => {
    try {
      const res = await api.get("/manual-payment-methods");
      setMethods(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setLogoFile(null);
    setLogoPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (method) => {
    setFormData({
      country_code: method.country_code,
      name: method.name,
      logo_url: method.logo_url || null,
      fields: method.fields.length > 0 ? method.fields : [{ label: "", value: "" }],
      active: method.active,
      sort_order: method.sort_order,
    });
    setEditingId(method._id);
    setLogoFile(null);
    setLogoPreview(method.logo_url || null);
    setIsModalOpen(true);
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const uploadLogoToCloudinary = async () => {
    const uploadData = new FormData();
    uploadData.append("file", logoFile);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      uploadData,
    );
    return res.data.secure_url;
  };

  const handleFieldChange = (index, key, value) => {
    const fields = [...formData.fields];
    fields[index] = { ...fields[index], [key]: value };
    setFormData({ ...formData, fields });
  };

  const addField = () => {
    setFormData({ ...formData, fields: [...formData.fields, { label: "", value: "" }] });
  };

  const removeField = (index) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      country_code: formData.country_code.trim().toUpperCase(),
      fields: formData.fields.filter((f) => f.label.trim() && f.value.trim()),
    };
    if (payload.fields.length === 0) {
      toast.error("Add at least one detail field (e.g. Account Number)");
      return;
    }
    setSaving(true);
    try {
      if (logoFile) {
        payload.logo_url = await uploadLogoToCloudinary();
      }
      if (editingId) {
        await api.put(`/manual-payment-methods/${editingId}`, payload);
        toast.success("Payment method updated");
      } else {
        await api.post("/manual-payment-methods", payload);
        toast.success("Payment method added");
      }
      setIsModalOpen(false);
      fetchMethods();
    } catch (err) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (method) => {
    if (!window.confirm(`Remove "${method.name}" (${method.country_code})? This can't be undone.`)) {
      return;
    }
    try {
      await api.delete(`/manual-payment-methods/${method._id}`);
      toast.success("Payment method removed");
      fetchMethods();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to remove payment method"));
    }
  };

  const methodsByCountry = methods.reduce((acc, m) => {
    (acc[m.country_code] = acc[m.country_code] || []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Manual Payment Methods
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Method
          </span>
        </Button>
      </div>
      <p className="text-brand-blue-light text-sm mb-8">
        Bank transfers and wallets shown to clients in a specific country
        alongside Stripe at checkout (Stripe can't process these directly).
        Add a new country or bank here any time — no code change needed.
      </p>

      {loading ? (
        <Loader />
      ) : methods.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No manual payment methods set up yet.
        </p>
      ) : (
        <div className="space-y-8">
          {Object.entries(methodsByCountry).map(([country, countryMethods]) => (
            <div key={country}>
              <p className="font-display text-brand-orange text-xs tracking-[0.15em] mb-3">
                {country}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {countryMethods.map((method) => (
                  <Card key={method._id}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="h-10 flex items-center">
                        {method.logo_url ? (
                          <img
                            src={optimizeCloudinaryUrl(method.logo_url, 200)}
                            alt={method.name}
                            className="h-8 object-contain"
                          />
                        ) : (
                          <span className="text-brand-blue font-bold">{method.name}</span>
                        )}
                      </div>
                      {!method.active && (
                        <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full shrink-0">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-brand-blue font-bold text-sm mb-2">{method.name}</h3>
                    <ul className="space-y-1 mb-4">
                      {method.fields.map((f) => (
                        <li key={f.label} className="text-xs text-brand-blue-light">
                          <span className="font-semibold text-brand-blue">{f.label}:</span>{" "}
                          {f.value}
                        </li>
                      ))}
                    </ul>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(method)}
                        className="text-brand-blue-light hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                        aria-label={`Edit ${method.name}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(method)}
                        className="text-red-400 hover:text-red-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                        aria-label={`Delete ${method.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Payment Method" : "Add Payment Method"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-14 rounded-lg bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <Upload size={18} className="text-brand-blue/40" />
              )}
            </div>
            <label className="cursor-pointer text-sm font-semibold text-brand-orange">
              {logoFile ? "Change Logo" : "Upload Logo (optional)"}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Country Code (e.g. PK)"
              value={formData.country_code}
              onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
              required
              maxLength={2}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              placeholder="Method Name (e.g. JazzCash)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-brand-blue-light mb-2">
              Details shown to the client (e.g. Account Title, Account Number, IBAN)
            </p>
            <div className="space-y-2">
              {formData.fields.map((field, i) => (
                <div key={i} className="flex items-start gap-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. Account Number)"
                    value={field.label}
                    onChange={(e) => handleFieldChange(i, "label", e.target.value)}
                    className="flex-1 border border-brand-blue-pale rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => handleFieldChange(i, "value", e.target.value)}
                    className="flex-1 border border-brand-blue-pale rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  {formData.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeField(i)}
                      className="text-red-400 hover:text-red-600 mt-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      aria-label={`Remove field ${i + 1}`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addField}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:underline"
            >
              <Plus size={14} /> Add Field
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-brand-blue">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded border-brand-blue-pale text-brand-orange focus:ring-brand-orange"
            />
            Active (visible to clients at checkout)
          </label>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add Method"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManualPaymentMethods;
