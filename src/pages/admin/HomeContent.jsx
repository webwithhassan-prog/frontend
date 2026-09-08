import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
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

const formatUploadedAt = (isoDate) => {
  if (!isoDate) return null;
  return new Date(isoDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const tabs = [
  { key: "hero-banners", label: "Hero Banners" },
  { key: "transformations", label: "Transformation Videos" },
  { key: "demo-videos", label: "Demo Sessions" },
  { key: "testimonials", label: "Testimonials" },
];

const emptyVideoForm = { title: "", youtube_link: "" };

const emptyBannerForm = {
  eyebrow: "",
  title: "",
  desc: "",
  cta_label: "",
  cta_link: "",
  order: 0,
};

const HeroBannersManager = ({ onCountChange }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyBannerForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      const res = await api.get("/hero-banners");
      setBanners(res.data);
      onCountChange?.(res.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setFormData({ ...emptyBannerForm, order: banners.length });
    setEditingId(null);
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setFormData({
      eyebrow: banner.eyebrow,
      title: banner.title,
      desc: banner.desc,
      cta_label: banner.cta_label,
      cta_link: banner.cta_link,
      order: banner.order,
    });
    setEditingId(banner._id);
    setPhotoFile(null);
    setPhotoPreview(banner.image_url);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "order" ? Number(value) : value });
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
    if (!editingId && !photoFile) {
      toast.error("Please select an image");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData };
      if (photoFile) {
        payload.image_url = await uploadPhotoToCloudinary();
      }
      if (editingId) {
        await api.put(`/hero-banners/${editingId}`, payload);
        toast.success("Banner updated");
      } else {
        await api.post("/hero-banners", payload);
        toast.success("Banner added");
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner slide? This can't be undone.")) return;
    try {
      await api.delete(`/hero-banners/${id}`);
      toast.success("Banner removed");
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove banner");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <h2 className="text-lg font-bold text-brand-blue">Hero Banners</h2>
        <Button onClick={openAddModal} className="self-start sm:self-auto">
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} /> Add Banner
          </span>
        </Button>
      </div>
      <p className="text-brand-blue-light text-sm mb-6">
        These are the sliding banners at the top of the Home page — image,
        headline, description, and button all editable here. Shown in "Order"
        sequence, lowest first.
      </p>

      {loading ? (
        <Loader />
      ) : banners.length === 0 ? (
        <p className="text-brand-blue-light">
          No banners yet — add one to show it on the Home page hero.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {banners.map((b) => (
            <Card key={b._id} className="overflow-hidden">
              <div className="aspect-[2/1] rounded-lg overflow-hidden bg-brand-blue-pale mb-3">
                <img
                  src={b.image_url}
                  alt={b.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-brand-orange text-[10px] font-bold tracking-wide mb-1">
                {b.eyebrow}
              </p>
              <h3 className="text-brand-blue font-bold text-sm mb-1">
                {b.title}
              </h3>
              <p className="text-brand-blue-light text-xs mb-2 line-clamp-2">
                {b.desc}
              </p>
              <p className="text-brand-blue-light text-xs mb-3">
                Button: <span className="font-semibold">{b.cta_label}</span> →{" "}
                {b.cta_link} · Order {b.order}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(b)}
                  className="text-brand-blue-light hover:text-brand-blue"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(b._id)}
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
        title={editingId ? "Edit Banner" : "Add Banner"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-12 rounded-lg bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
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

          <input
            type="text"
            name="eyebrow"
            placeholder="Eyebrow tag (e.g. LIVE GROUP WORKOUTS)"
            value={formData.eyebrow}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="title"
            placeholder="Headline"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <textarea
            name="desc"
            placeholder="Description"
            value={formData.desc}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="cta_label"
              placeholder="Button Label"
              value={formData.cta_label}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="text"
              name="cta_link"
              placeholder="Button Link (e.g. /plans)"
              value={formData.cta_link}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <div>
            <label className="text-xs text-brand-blue-light mb-1 block">
              Display order (lowest shows first)
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add Banner"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

const VideoManager = ({ endpoint, title, description, aspect, onCountChange }) => {
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
      onCountChange?.(res.data.length);
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
        <Loader />
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
                <h3 className="text-brand-blue font-bold text-sm mb-1">
                  {video.title}
                </h3>
              )}
              {video.createdAt && (
                <p className="text-brand-blue-light text-xs mb-3">
                  Uploaded at: {formatUploadedAt(video.createdAt)}
                </p>
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

const TestimonialsManager = ({ onCountChange }) => {
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
      onCountChange?.(res.data.length);
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
        <Loader />
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
              {t.createdAt && (
                <p className="text-brand-blue-light text-[11px] text-center mb-1">
                  Uploaded at: {formatUploadedAt(t.createdAt)}
                </p>
              )}
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
  const [activeTab, setActiveTab] = useState("hero-banners");
  const [counts, setCounts] = useState({
    "hero-banners": null,
    transformations: null,
    "demo-videos": null,
    testimonials: null,
  });

  const setCount = (key) => (count) =>
    setCounts((prev) => ({ ...prev, [key]: count }));

  useEffect(() => {
    const endpoints = {
      "hero-banners": "hero-banners",
      transformations: "transformation-videos",
      "demo-videos": "demo-videos",
      testimonials: "testimonials",
    };
    Object.entries(endpoints).forEach(async ([key, endpoint]) => {
      try {
        const res = await api.get(`/${endpoint}`);
        setCount(key)(res.data.length);
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

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

      <div className="relative mb-8">
        <div className="flex gap-2 border-b border-brand-blue-pale overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-brand-orange text-brand-orange"
                : "border-transparent text-brand-blue-light hover:text-brand-blue"
            }`}
          >
            {tab.label}
            {counts[tab.key] != null && (
              <span
                className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                  activeTab === tab.key
                    ? "bg-brand-orange/10 text-brand-orange"
                    : "bg-brand-blue-pale text-brand-blue-light"
                }`}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-gradient-to-l from-brand-blue-pale to-transparent" />
      </div>

      {activeTab === "hero-banners" && (
        <HeroBannersManager onCountChange={setCount("hero-banners")} />
      )}
      {activeTab === "transformations" && (
        <VideoManager
          endpoint="transformation-videos"
          title="Transformation Videos"
          description='These show in the "Real Transformations" section on the Home page. Paste any YouTube link, including Shorts.'
          aspect="portrait"
          onCountChange={setCount("transformations")}
        />
      )}
      {activeTab === "demo-videos" && (
        <VideoManager
          endpoint="demo-videos"
          title="Demo Session Videos"
          description='These show in the "See a Session in Action" section on the Home page.'
          aspect="landscape"
          onCountChange={setCount("demo-videos")}
        />
      )}
      {activeTab === "testimonials" && (
        <TestimonialsManager onCountChange={setCount("testimonials")} />
      )}
    </div>
  );
};

export default HomeContent;
