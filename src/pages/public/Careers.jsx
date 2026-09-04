import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Upload, Check } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const specialties = [
  { value: "dietician", label: "Dietician" },
  { value: "gynecologist", label: "Gynecologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "physiotherapist", label: "Physiotherapist" },
  { value: "personal_trainer", label: "Personal Trainer" },
  { value: "other", label: "Other" },
];

const CLOUDINARY_CLOUD_NAME = "zyfxigcj";
const CLOUDINARY_UPLOAD_PRESET = "FitnessZone";

const emptyForm = {
  name: "",
  title: "",
  specialty: "",
  years_experience: "",
  session_duration: "",
  available_days: "",
  bio: "",
  contact: "",
};

const Careers = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
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
    setError("");
    setUploading(true);

    try {
      let photo_url = "";
      if (photoFile) {
        photo_url = await uploadPhotoToCloudinary();
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/applications`, {
        ...formData,
        photo_url,
      });

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again." , err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        PROFESSIONAL PARTNER ONBOARDING
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-10">
        Are you a dietician, gynecologist, psychiatrist, or personal trainer
        interested in offering online consultancy to our members? Apply below.
      </p>

      <Card>
        {submitted ? (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Check size={40} className="mx-auto text-brand-orange mb-4" />
            <p className="text-brand-blue font-semibold">
              Thanks for applying! We'll review your application and get back to
              you.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Photo upload */}
            <div>
              <label className="text-sm text-brand-blue/60 mb-2 block">
                Profile Picture
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload size={20} className="text-brand-blue/40" />
                  )}
                </div>
                <label className="cursor-pointer text-sm font-semibold text-brand-orange">
                  {photoFile ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Full Name & Title (e.g. Dr. Jane Doe, Gynecologist)"
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
              <option value="">Profession / Specialty</option>
              {specialties.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="years_experience"
              placeholder="Total Years of Experience"
              value={formData.years_experience}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />

            <input
              type="text"
              name="session_duration"
              placeholder="Duration per Session (e.g. 30 mins / 45 mins)"
              value={formData.session_duration}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />

            <input
              type="text"
              name="available_days"
              placeholder="Available Days per Week (e.g. Mon-Fri, or 3 days a week)"
              value={formData.available_days}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />

            <textarea
              name="bio"
              placeholder="Key Areas of Expertise / Short Bio (for your profile listing)"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={4}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />

            <input
              type="text"
              name="contact"
              placeholder="Email & Phone Number (for verification — admin only)"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />

            <p className="text-xs text-brand-blue/50">
              Note: consultations are 1-on-1 only.
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={uploading}>
              {uploading ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        )}
      </Card>
    </section>
  );
};

export default Careers;
