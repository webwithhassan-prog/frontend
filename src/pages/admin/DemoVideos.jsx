import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = { title: "", youtube_link: "" };

const getYoutubeEmbedSrc = (link) => {
  if (!link) return "";
  const match = link.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  const videoId = match ? match[1] : link;
  return `https://www.youtube.com/embed/${videoId}`;
};

const DemoVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/demo-videos");
      setVideos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (video) => {
    setFormData({ title: video.title, youtube_link: video.youtube_link });
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
        await api.put(`/demo-videos/${editingId}`, formData);
        toast.success("Video updated");
      } else {
        await api.post("/demo-videos", formData);
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
      await api.delete(`/demo-videos/${id}`);
      toast.success("Video removed");
      fetchVideos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove video");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Demo Videos
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Video
          </span>
        </Button>
      </div>
      <p className="text-brand-blue-light text-sm mb-6">
        These show in the "See a session in action" section on the Home page.
      </p>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : videos.length === 0 ? (
        <p className="text-brand-blue-light">
          No demo videos yet — add one to show it on the Home page.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video._id}>
              <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-brand-blue-pale">
                <iframe
                  src={getYoutubeEmbedSrc(video.youtube_link)}
                  title={video.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <h3 className="text-brand-blue font-bold text-sm mb-3">
                {video.title}
              </h3>
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
            placeholder="Video Title"
            value={formData.title}
            onChange={handleChange}
            required
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

export default DemoVideos;
