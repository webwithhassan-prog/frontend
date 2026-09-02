import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = {
  title: "",
  message: "",
  cta_label: "View Offer",
  cta_link: "/plans",
  discount_percent: "",
  applies_to: "all",
  active: true,
};

const appliesToLabels = {
  all: "All Packages",
  dietplan: "Dietplan Only",
  workout: "Workout Sessions Only",
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchData = async () => {
    try {
      const res = await api.get("/offers");
      setOffers(res.data);
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

  const openEditModal = (offer) => {
    setFormData({
      title: offer.title,
      message: offer.message,
      cta_label: offer.cta_label,
      cta_link: offer.cta_link,
      discount_percent: offer.discount_percent || "",
      applies_to: offer.applies_to || "all",
      active: offer.active,
    });
    setEditingId(offer._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      discount_percent: Number(formData.discount_percent) || 0,
    };
    if (editingId) {
      await api.put(`/offers/${editingId}`, payload);
    } else {
      await api.post("/offers", payload);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/offers/${id}`);
    fetchData();
  };

  const toggleActive = async (offer) => {
    await api.put(`/offers/${offer._id}`, { active: !offer.active });
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
          Offers
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Offer
          </span>
        </Button>
      </div>

      <p className="text-brand-blue-light text-sm mb-6">
        Active offers pop up for visitors when they open the website. Turn
        one on for a special day, then switch it off when it's over.
      </p>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : offers.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No offers yet — add one to run a promo popup.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer._id} className={!offer.active ? "opacity-60" : ""}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-brand-blue font-bold text-lg">
                  {offer.title}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    offer.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {offer.active ? "Live" : "Off"}
                </span>
              </div>
              {offer.discount_percent > 0 && (
                <span className="inline-block text-xs font-bold text-white bg-brand-orange px-2.5 py-1 rounded-full mb-2">
                  {offer.discount_percent}% OFF ·{" "}
                  {appliesToLabels[offer.applies_to] || "All Packages"}
                </span>
              )}
              <p className="text-brand-blue-light text-sm mb-4">
                {offer.message}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleActive(offer)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70 transition-colors"
                >
                  {offer.active ? "Turn Off" : "Turn On"}
                </button>
                <button
                  onClick={() => openEditModal(offer)}
                  className="text-brand-blue-light hover:text-brand-blue"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
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
        title={editingId ? "Edit Offer" : "Add Offer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title (e.g. Eid Special)"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <textarea
            name="message"
            placeholder="Message (e.g. Get 20% off all packages this week!)"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="cta_label"
            placeholder="Button Label (e.g. View Offer)"
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

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="discount_percent"
              placeholder="Discount % (optional)"
              min="0"
              max="100"
              value={formData.discount_percent}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <select
              name="applies_to"
              value={formData.applies_to}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
              <option value="all">All Packages</option>
              <option value="dietplan">Dietplan Only</option>
              <option value="workout">Workout Sessions Only</option>
            </select>
          </div>
          <p className="text-xs text-brand-blue-light -mt-2">
            Leave discount at 0 for an announcement-only popup. A discount
            here actually applies at checkout — it's not just text.
          </p>

          <label className="flex items-center gap-2 text-sm text-brand-blue">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Show this offer to visitors now
          </label>
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Offer"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Offers;
