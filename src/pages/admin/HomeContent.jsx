import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const CLOUDINARY_CLOUD_NAME = "zyfxigcj";
const CLOUDINARY_UPLOAD_PRESET = "FitnessZone";

const getYoutubeEmbedSrc = (link) => {
  if (!link) return "";
  const match = link.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  const videoId = match ? match[1] : link;
  return `https://www.youtube.com/embed/${videoId}`;
};

const tabs = [
  { key: "transformations", label: "Transformation Videos" },
  { key: "demo-videos", label: "Demo Sessions" },
  { key: "testimonials", label: "Testimonials" },
];

const emptyVideoForm = { title: "", youtube_link: "" };

const VideoManager = ({ endpoint, title, description, aspect }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyVideoForm);
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${endpoint}`);
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const openAddModal = () => {
    setFormData(emptyVideoForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (video) => {
    setFormData({ title: video.title || "", youtube_link: video.youtube_link });
    setEditingId(video._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/${endpoint}/${editingId}`, formData);
        toast.success("Video updated");
      } else {
        await api.post(`/${endpoint}`, formData);
        toast.success("Video added");
      }
      setIsModalOpen(false);
      fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save video");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${endpoint}/${id}`);
      toast.success("Video removed");
      fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove video");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <h2 className="text-lg font-bold text-brand-blue">{title}</h2>
        <Button onClick={openAddModal} className="self-start sm:self-auto">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} /> Add Video
          </span>
        </Button>
      </div>
      <p className="text-brand-blue-light text-sm mb-6">{description}</p>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : videos.length === 0 ? (
        <p className="text-brand-blue-light">No videos yet — add one above.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {videos.map((video) => (
            <Card key={video._id}>
              <div
                className={`${aspect === "portrait" ? "aspect-[9/16]" : "aspect-video"} mb-3 rounded-lg overflow-hidden bg-brand-blue-pale`}
              >
                <iframe
                  src={getYoutubeEmbedSrc(video.youtube_link)}
                  title={video.title || "Video"}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              {video.title && (
                <h3 className="text-brand-blue font-bold text-sm mb-3">
                  {video.title}
                </h3>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(video)}
                  className="text-brand-blue-light hover:text-brand-blue"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
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
        title={editingId ? "Edit Video" : "Add Video"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title (optional)"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="youtube_link"
            placeholder="YouTube Link (any format)"
            value={formData.youtube_link}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add Video"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials");
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openAddModal = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsModalOpen(true);
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
    if (!photoFile) {
      toast.error("Please select an image");
      return;
    }
    setUploading(true);
    try {
      const image_url = await uploadPhotoToCloudinary();
      await api.post("/testimonials", { image_url });
      toast.success("Testimonial added");
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add testimonial");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success("Testimonial removed");
      fetchTestimonials();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove testimonial");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <h2 className="text-lg font-bold text-brand-blue">Testimonials</h2>
        <Button onClick={openAddModal} className="self-start sm:self-auto">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} /> Add Testimonial
          </span>
        </Button>
      </div>
      <p className="text-brand-blue-light text-sm mb-6">
        These show in the "Success Stories" slider on the Home page.
      </p>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : testimonials.length === 0 ? (
        <p className="text-brand-blue-light">
          No testimonials yet — add one to show it on the Home page slider.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <Card key={t._id} className="p-2">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-brand-blue-pale mb-2">
                <img
                  src={t.image_url}
                  alt="Testimonial"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => handleDelete(t._id)}
                className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-600 py-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Testimonial"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-20 rounded-lg bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
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
              {photoFile ? "Change Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Testimonial"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

const HomeContent = () => {
  const [activeTab, setActiveTab] = useState("transformations");

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Home Page Content
      </motion.h1>
      <p className="text-brand-blue-light text-sm mb-6">
        Manage the transformation videos, demo session videos, and success
        story testimonials shown on the public Home page.
      </p>

      <div className="flex gap-2 border-b border-brand-blue-pale mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-brand-blue-light hover:text-brand-blue"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "transformations" && (
        <VideoManager
          endpoint="transformation-videos"
          title="Transformation Videos"
          description='These show in the "Real Transformations" section on the Home page. Paste any YouTube link, including Shorts.'
          aspect="portrait"
        />
      )}
      {activeTab === "demo-videos" && (
        <VideoManager
          endpoint="demo-videos"
          title="Demo Session Videos"
          description='These show in the "See a Session in Action" section on the Home page.'
          aspect="landscape"
        />
      )}
      {activeTab === "testimonials" && <TestimonialsManager />}
    </div>
  );
};

export default HomeContent;
