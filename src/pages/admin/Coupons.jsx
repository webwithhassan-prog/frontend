import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = {
  code: "",
  discount_percent: "",
  applies_to: "all",
  max_uses: "",
  expires_at: "",
  active: true,
};

const appliesToLabels = {
  all: "All Packages",
  dietplan: "Dietplan Only",
  workout: "Workout Sessions Only",
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data);
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
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setFormData({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      applies_to: coupon.applies_to || "all",
      max_uses: coupon.max_uses ?? "",
      expires_at: coupon.expires_at
        ? coupon.expires_at.slice(0, 10)
        : "",
      active: coupon.active,
    });
    setEditingId(coupon._id);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const payload = {
      ...formData,
      discount_percent: Number(formData.discount_percent) || 0,
      max_uses: formData.max_uses === "" ? null : Number(formData.max_uses),
      expires_at: formData.expires_at || null,
    };
    try {
      if (editingId) {
        await api.put(`/coupons/${editingId}`, payload);
        toast.success("Coupon updated");
      } else {
        await api.post("/coupons", payload);
        toast.success("Coupon created");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      toast.success("Coupon deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await api.put(`/coupons/${coupon._id}`, { active: !coupon.active });
      toast.success(coupon.active ? "Coupon turned off" : "Coupon turned on");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update coupon");
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
          Coupons
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Coupon
          </span>
        </Button>
      </div>

      <p className="text-brand-blue-light text-sm mb-6">
        Coupons are codes clients type in at checkout. Set a usage limit or
        expiry date to keep them under control.
      </p>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : coupons.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No coupons yet — add one to let clients type in a code at checkout.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((coupon) => {
            const isExpired =
              coupon.expires_at && new Date(coupon.expires_at) < new Date();
            const isMaxedOut =
              coupon.max_uses != null && coupon.used_count >= coupon.max_uses;
            return (
              <Card
                key={coupon._id}
                className={!coupon.active ? "opacity-60" : ""}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-brand-blue font-bold text-lg tracking-wide">
                    {coupon.code}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      coupon.active && !isExpired && !isMaxedOut
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {!coupon.active
                      ? "Off"
                      : isExpired
                        ? "Expired"
                        : isMaxedOut
                          ? "Maxed Out"
                          : "Live"}
                  </span>
                </div>
                <span className="inline-block text-xs font-bold text-white bg-brand-orange px-2.5 py-1 rounded-full mb-2">
                  {coupon.discount_percent}% OFF ·{" "}
                  {appliesToLabels[coupon.applies_to] || "All Packages"}
                </span>
                <p className="text-brand-blue-light text-sm mb-1">
                  Used {coupon.used_count}
                  {coupon.max_uses != null ? ` / ${coupon.max_uses}` : ""}{" "}
                  times
                </p>
                {coupon.expires_at && (
                  <p className="text-brand-blue-light text-sm mb-4">
                    Expires {new Date(coupon.expires_at).toLocaleDateString()}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => toggleActive(coupon)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70 transition-colors"
                  >
                    {coupon.active ? "Turn Off" : "Turn On"}
                  </button>
                  <button
                    onClick={() => openEditModal(coupon)}
                    className="text-brand-blue-light hover:text-brand-blue"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Coupon" : "Add Coupon"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="code"
            placeholder="Code (e.g. WELCOME20)"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 uppercase focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="discount_percent"
              placeholder="Discount %"
              min="1"
              max="100"
              value={formData.discount_percent}
              onChange={handleChange}
              required
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

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="max_uses"
              placeholder="Max uses (optional)"
              min="1"
              value={formData.max_uses}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="date"
              name="expires_at"
              value={formData.expires_at}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <p className="text-xs text-brand-blue-light -mt-2">
            Leave max uses or expiry blank for no limit.
          </p>

          {formError && (
            <p className="text-red-500 text-sm">{formError}</p>
          )}

          <label className="flex items-center gap-2 text-sm text-brand-blue">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Clients can redeem this code now
          </label>
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Coupon"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Coupons;
