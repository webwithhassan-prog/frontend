import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = { title: "", youtube_link: "" };

const RecordedGallery = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchRecordings = async () => {
    try {
      const res = await api.get("/recorded-gallery");
      setRecordings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({ title: item.title, youtube_link: item.youtube_link });
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/recorded-gallery/${editingId}`, formData);
        toast.success("Recording updated");
      } else {
        await api.post("/recorded-gallery", formData);
        toast.success("Recording added");
      }
      setIsModalOpen(false);
      fetchRecordings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this recording?")) return;
    try {
      await api.delete(`/recorded-gallery/${id}`);
      toast.success("Recording removed");
      fetchRecordings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove recording");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Recorded Gallery
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Recording
          </span>
        </Button>
      </div>

      <p className="text-brand-blue-light text-sm mb-6">
        Weekly session recordings (unlisted YouTube links) for clients with
        live classes. Shown newest first, separate from Recorded Content.
      </p>

      {loading ? (
        <Loader />
      ) : recordings.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No recordings yet — add this week's session link.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recordings.map((item) => (
            <Card key={item._id}>
              <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-brand-blue-pale">
                <iframe
                  src={item.youtube_link.replace("watch?v=", "embed/")}
                  title={item.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              <h3 className="text-brand-blue font-bold text-sm mb-1">
                {item.title}
              </h3>
              <p className="text-brand-blue-light text-xs mb-4">
                Added {new Date(item.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(item)}
                  className="text-brand-blue-light hover:text-brand-blue"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
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
        title={editingId ? "Edit Recording" : "Add Recording"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title (e.g. Week of Sep 8 — Full Body)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="youtube_link"
            placeholder="YouTube Link (unlisted)"
            value={formData.youtube_link}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Recording"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default RecordedGallery;
