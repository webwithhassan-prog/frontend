import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = { name: "", specialty: "" };
const specialties = ["dietician", "gynecologist", "psychiatrist"];

const Consultants = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

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
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (consultant) => {
    setFormData({ name: consultant.name, specialty: consultant.specialty });
    setEditingId(consultant._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/consultants/${editingId}`, formData);
    } else {
      await api.post("/consultants", formData);
    }
    setIsModalOpen(false);
    fetchConsultants();
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
              <h3 className="text-brand-blue font-bold text-lg">
                {consultant.name}
              </h3>
              <p className="text-brand-blue-light text-sm mt-1 mb-4 capitalize">
                {consultant.specialty}
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
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Consultant"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Consultants;
