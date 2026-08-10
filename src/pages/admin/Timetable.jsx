import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = { trainer_ref: "", type: "", datetime: "", capacity: "" };

const Timetable = () => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const [classesRes, trainersRes] = await Promise.all([
        api.get("/classes"),
        api.get("/trainers"),
      ]);
      setClasses(classesRes.data);
      setTrainers(trainersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (classItem) => {
    setFormData({
      trainer_ref: classItem.trainer_ref?._id || classItem.trainer_ref,
      type: classItem.type,
      datetime: classItem.datetime?.slice(0, 16),
      capacity: classItem.capacity,
    });
    setEditingId(classItem._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, capacity: Number(formData.capacity) };
    if (editingId) {
      await api.put(`/classes/${editingId}`, payload);
    } else {
      await api.post("/classes", payload);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/classes/${id}`);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Timetable
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Class
          </span>
        </Button>
      </div>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                <th className="py-3 px-2">Trainer</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Date & Time</th>
                <th className="py-3 px-2">Capacity</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem) => (
                <motion.tr
                  key={classItem._id}
                  className="border-b border-brand-blue-pale/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="py-3 px-2 font-medium text-brand-blue">
                    {classItem.trainer_ref?.name || "—"}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {classItem.type}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {new Date(classItem.datetime).toLocaleString()}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {classItem.capacity}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(classItem)}
                        className="text-brand-blue-light hover:text-brand-blue"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Class" : "Add Class"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="trainer_ref"
            value={formData.trainer_ref}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Select Trainer</option>
            {trainers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="type"
            placeholder="Class Type (e.g. Yoga, HIIT)"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="datetime-local"
            name="datetime"
            value={formData.datetime}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Class"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;
