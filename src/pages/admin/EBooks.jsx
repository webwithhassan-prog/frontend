import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = { title: "", description: "", pdf_url: "", price: "" };

const EBooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

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
    setIsModalOpen(true);
  };

  const openEditModal = (ebook) => {
    setFormData({
      title: ebook.title,
      description: ebook.description || "",
      pdf_url: ebook.pdf_url,
      price: ebook.price,
    });
    setEditingId(ebook._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price) };
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
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ebooks.map((ebook) => (
            <Card key={ebook._id}>
              <h3 className="text-brand-blue font-bold text-lg mb-1">
                {ebook.title}
              </h3>
              <p className="text-brand-blue-light text-sm mb-2">
                {ebook.description}
              </p>
              <p className="text-brand-blue font-semibold mb-4">
                Rs {ebook.price.toLocaleString()}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(ebook)}
                  className="text-brand-blue-light hover:text-brand-blue"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(ebook._id)}
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
        title={editingId ? "Edit E-Book" : "Add E-Book"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
