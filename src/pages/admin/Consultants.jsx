import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = {
  name: "",
  specialty: "",
  photo_url: "",
  years_experience: "",
  session_duration: "",
  fee: "",
};
const specialties = [
  "dietician",
  "gynecologist",
  "psychiatrist",
  "physiotherapist",
  "personal_trainer",
];
const specialtyLabels = {
  dietician: "Dietician",
  gynecologist: "Gynecologist",
  psychiatrist: "Psychiatrist",
  physiotherapist: "Physiotherapist",
  personal_trainer: "Fitness Trainer",
};

const CLOUDINARY_CLOUD_NAME = "zyfxigcj";
const CLOUDINARY_UPLOAD_PRESET = "FitnessZone";

const Consultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchConsultants = async () => {
    try {
      const res = await api.get("/consultants");
      setConsultants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setPhotoFile(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (consultant) => {
    setFormData({
      name: consultant.name,
      specialty: consultant.specialty,
      photo_url: consultant.photo_url || "",
      years_experience: consultant.years_experience ?? "",
      session_duration: consultant.session_duration || "",
      fee: consultant.fee ?? "",
    });
    setPhotoFile(null);
    setEditingId(consultant._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setFormData({ ...formData, photo_url: URL.createObjectURL(file) });
  };

  const uploadPhotoToCloudinary = async () => {
    const uploadData = new FormData();
    uploadData.append("file", photoFile);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      uploadData,
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let photo_url = formData.photo_url;
      if (photoFile) {
        photo_url = await uploadPhotoToCloudinary();
      }

      const payload = {
        name: formData.name,
        specialty: formData.specialty,
        photo_url,
        years_experience: formData.years_experience
          ? Number(formData.years_experience)
          : undefined,
        session_duration: formData.session_duration || undefined,
        fee: formData.fee ? Number(formData.fee) : undefined,
      };

      if (editingId) {
        await api.put(`/consultants/${editingId}`, payload);
      } else {
        await api.post("/consultants", payload);
      }
      setIsModalOpen(false);
      fetchConsultants();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/consultants/${id}`);
    fetchConsultants();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Consultants
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Consultant
          </span>
        </Button>
      </div>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {consultants.map((consultant) => (
            <Card key={consultant._id}>
              <div className="w-14 h-14 rounded-full bg-brand-blue-pale overflow-hidden mb-3">
                {consultant.photo_url && (
                  <img
                    src={consultant.photo_url}
                    alt={consultant.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="text-brand-blue font-bold text-lg">
                {consultant.name}
              </h3>
              <p className="text-brand-blue-light text-sm mt-1 mb-1">
                {specialtyLabels[consultant.specialty] || consultant.specialty}
              </p>
              <p className="text-brand-blue-light text-xs mb-4">
                {consultant.years_experience
                  ? `${consultant.years_experience} yrs experience`
                  : "Experience not set"}
                {consultant.session_duration
                  ? ` · ${consultant.session_duration}`
                  : ""}
                {consultant.fee ? ` · Rs ${consultant.fee.toLocaleString()}` : ""}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(consultant)}
                  className="text-brand-blue-light hover:text-brand-blue"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(consultant._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Consultant" : "Add Consultant"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
              {formData.photo_url ? (
                <img
                  src={formData.photo_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload size={18} className="text-brand-blue/40" />
              )}
            </div>
            <label className="cursor-pointer text-sm font-semibold text-brand-orange">
              {formData.photo_url ? "Change Photo" : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <select
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Select Specialty</option>
            {specialties.map((s) => (
              <option key={s} value={s}>
                {specialtyLabels[s]}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="years_experience"
              placeholder="Years experience"
              min="0"
              value={formData.years_experience}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              name="session_duration"
              placeholder="Session time (e.g. 30 min)"
              value={formData.session_duration}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <input
            type="number"
            name="fee"
            placeholder="Fee (Rs per session)"
            min="0"
            value={formData.fee}
            onChange={handleChange}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading
              ? "Saving..."
              : editingId
                ? "Save Changes"
                : "Add Consultant"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Consultants;
