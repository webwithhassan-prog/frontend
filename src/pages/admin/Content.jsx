import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = { title: "", youtube_link: "", category: "" };

const Content = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchContent = async () => {
    try {
      const res = await api.get("/content");
      setContent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({
      title: item.title,
      youtube_link: item.youtube_link,
      category: item.category,
    });
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/content/${editingId}`, formData);
    } else {
      await api.post("/content", formData);
    }
    setIsModalOpen(false);
    fetchContent();
  };

  const handleDelete = async (id) => {
    await api.delete(`/content/${id}`);
    fetchContent();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Recorded Content
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Video
          </span>
        </Button>
      </div>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.map((item) => (
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
              <p className="text-brand-blue-light text-xs mb-4 capitalize">
                {item.category}
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
            placeholder="YouTube Link (unlisted)"
            value={formData.youtube_link}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Yoga, Nutrition)"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Video"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Content;
