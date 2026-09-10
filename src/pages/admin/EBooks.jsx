import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import axios from "axios";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

const CLOUDINARY_CLOUD_NAME = "zyfxigcj";
const CLOUDINARY_UPLOAD_PRESET = "FitnessZone";

const emptyForm = {
  title: "",
  description: "",
  pdf_url: "",
  price: "",
  banner_url: null,
};

const EBooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const fetchEbooks = async () => {
    try {
      const res = await api.get("/ebooks");
      setEbooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setBannerFile(null);
    setBannerPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ebook) => {
    setFormData({
      title: ebook.title,
      description: ebook.description || "",
      pdf_url: ebook.pdf_url,
      price: ebook.price,
      banner_url: ebook.banner_url || null,
    });
    setEditingId(ebook._id);
    setBannerFile(null);
    setBannerPreview(ebook.banner_url || null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const uploadBannerToCloudinary = async () => {
    const uploadData = new FormData();
    uploadData.append("file", bannerFile);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      uploadData,
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price) };
    if (bannerFile) {
      payload.banner_url = await uploadBannerToCloudinary();
    }
    if (editingId) {
      await api.put(`/ebooks/${editingId}`, payload);
    } else {
      await api.post("/ebooks", payload);
    }
    setIsModalOpen(false);
    fetchEbooks();
  };

  const handleDelete = async (id) => {
    await api.delete(`/ebooks/${id}`);
    fetchEbooks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          E-Books
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add E-Book
          </span>
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ebooks.map((ebook) => (
            <Card key={ebook._id}>
              {ebook.banner_url && (
                <div className="aspect-video mb-3 -mt-1 rounded-lg overflow-hidden bg-brand-blue-pale">
                  <img
                    src={optimizeCloudinaryUrl(ebook.banner_url, 500)}
                    alt={ebook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-brand-blue font-bold text-lg mb-1">
                {ebook.title}
              </h3>
              <p className="text-brand-blue-light text-sm mb-2">
                {ebook.description}
              </p>
              <p className="text-brand-blue font-semibold mb-4">
                ₹{ebook.price.toLocaleString("en-IN")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(ebook)}
                  className="text-brand-blue-light hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  aria-label={`Edit ${ebook.title}`}
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(ebook._id)}
                  className="text-red-400 hover:text-red-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  aria-label={`Delete ${ebook.title}`}
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
        title={editingId ? "Edit E-Book" : "Add E-Book"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-14 rounded-lg bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload size={18} className="text-brand-blue/40" />
              )}
            </div>
            <label className="cursor-pointer text-sm font-semibold text-brand-orange">
              {bannerFile ? "Change Banner" : "Upload Banner (optional)"}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerSelect}
                className="hidden"
              />
            </label>
          </div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="pdf_url"
            placeholder="PDF Link (Google Drive, etc.)"
            value={formData.pdf_url}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (Rs)"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add E-Book"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default EBooks;
