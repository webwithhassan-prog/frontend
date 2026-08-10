import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = { name: "", specialty: "" };

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchTrainers = async () => {
    try {
      const res = await api.get("/trainers");
      setTrainers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (trainer) => {
    setFormData({ name: trainer.name, specialty: trainer.specialty });
    setEditingId(trainer._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/trainers/${editingId}`, formData);
    } else {
      await api.post("/trainers", formData);
    }
    setIsModalOpen(false);
    fetchTrainers();
  };

  const handleDelete = async (id) => {
    await api.delete(`/trainers/${id}`);
    fetchTrainers();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Trainers
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Trainer
          </span>
        </Button>
      </div>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <Card key={trainer._id}>
              <h3 className="text-brand-blue font-bold text-lg">
                {trainer.name}
              </h3>
              <p className="text-brand-blue-light text-sm mt-1 mb-4">
                {trainer.specialty}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(trainer)}
                  className="text-brand-blue-light hover:text-brand-blue"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(trainer._id)}
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
        title={editingId ? "Edit Trainer" : "Add Trainer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="specialty"
            placeholder="Specialty (e.g. Yoga, HIIT)"
            value={formData.specialty}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Trainer"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Trainers;
