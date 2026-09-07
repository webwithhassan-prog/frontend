import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const emptyForm = {
  product_type: "dietplan",
  duration_days: 30,
  price: "",
  diet_plans_included: "",
  features: "",
};

const productTypes = [
  { value: "dietplan", label: "Customized Dietplan" },
  { value: "workout", label: "Live Workout Sessions" },
  { value: "combo", label: "Both Combined" },
];

const durations = [30, 90, 180];

const Packages = () => {
  const [plans, setPlans] = useState([]);
  const [premiumAddon, setPremiumAddon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [premiumPrice, setPremiumPrice] = useState("");
  const [premiumSessions, setPremiumSessions] = useState("");

  const fetchData = async () => {
    try {
      const [plansRes, premiumRes] = await Promise.all([
        api.get("/plans"),
        api.get("/premium-addon"),
      ]);
      setPlans(plansRes.data);
      setPremiumAddon(premiumRes.data);
      if (premiumRes.data) {
        setPremiumPrice(premiumRes.data.price);
        setPremiumSessions(premiumRes.data.sessions_included);
      }
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

  const openEditModal = (plan) => {
    setFormData({
      product_type: plan.product_type,
      duration_days: plan.duration_days,
      price: plan.price,
      diet_plans_included: plan.diet_plans_included || "",
      features: (plan.features || []).join("\n"),
    });
    setEditingId(plan._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const includesDietPlans =
      formData.product_type === "dietplan" || formData.product_type === "combo";
    const payload = {
      product_type: formData.product_type,
      duration_days: Number(formData.duration_days),
      price: Number(formData.price),
      diet_plans_included: includesDietPlans
        ? Number(formData.diet_plans_included) || null
        : null,
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };
    if (editingId) {
      await api.put(`/plans/${editingId}`, payload);
    } else {
      await api.post("/plans", payload);
    }
    setIsModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/plans/${id}`);
    fetchData();
  };

  const handlePremiumUpdate = async (e) => {
    e.preventDefault();
    if (premiumAddon) {
      await api.put(`/premium-addon/${premiumAddon._id}`, {
        price: Number(premiumPrice),
        sessions_included: Number(premiumSessions),
      });
    } else {
      await api.post("/premium-addon", {
        price: Number(premiumPrice),
        sessions_included: Number(premiumSessions),
      });
    }
    fetchData();
  };

  const dietplans = plans.filter((p) => p.product_type === "dietplan");
  const workoutPlans = plans.filter((p) => p.product_type === "workout");
  const comboPlans = plans.filter((p) => p.product_type === "combo");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Packages
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Package
          </span>
        </Button>
      </div>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <>
          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Customized Dietplans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {dietplans.map((plan) => (
              <Card key={plan._id}>
                <h3 className="text-brand-blue font-bold text-lg">
                  {plan.duration_days} Days
                </h3>
                <p className="text-brand-blue-light text-sm mb-1">
                  {plan.diet_plans_included} diet plans included
                </p>
                <p className="text-brand-blue font-semibold mb-2">
                  ₹{plan.price.toLocaleString("en-IN")}
                </p>
                {plan.features?.length > 0 && (
                  <ul className="text-brand-blue-light text-xs mb-4 list-disc pl-4 space-y-0.5">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="text-brand-blue-light hover:text-brand-blue"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Live Workout Sessions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {workoutPlans.map((plan) => (
              <Card key={plan._id}>
                <h3 className="text-brand-blue font-bold text-lg">
                  {plan.duration_days} Days
                </h3>
                <p className="text-brand-blue font-semibold mb-2">
                  ₹{plan.price.toLocaleString("en-IN")}
                </p>
                {plan.features?.length > 0 && (
                  <ul className="text-brand-blue-light text-xs mb-4 list-disc pl-4 space-y-0.5">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="text-brand-blue-light hover:text-brand-blue"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <h2 className="text-lg font-bold text-brand-blue mb-2">
            Both Combined
          </h2>
          <p className="text-brand-blue-light text-sm mb-4">
            Optional — give the combo its own price and feature list. Without
            one for a given duration, the public Plans page falls back to
            summing that duration's Dietplan + Workout prices.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {comboPlans.length === 0 ? (
              <p className="text-brand-blue-light col-span-full">
                No dedicated combo packages yet.
              </p>
            ) : (
              comboPlans.map((plan) => (
                <Card key={plan._id}>
                  <h3 className="text-brand-blue font-bold text-lg">
                    {plan.duration_days} Days
                  </h3>
                  {plan.diet_plans_included ? (
                    <p className="text-brand-blue-light text-sm mb-1">
                      {plan.diet_plans_included} diet plans included
                    </p>
                  ) : null}
                  <p className="text-brand-blue font-semibold mb-2">
                    ₹{plan.price.toLocaleString("en-IN")}
                  </p>
                  {plan.features?.length > 0 && (
                    <ul className="text-brand-blue-light text-xs mb-4 list-disc pl-4 space-y-0.5">
                      {plan.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(plan)}
                      className="text-brand-blue-light hover:text-brand-blue"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>

          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Premium Add-on
          </h2>
          <Card className="max-w-md">
            <form onSubmit={handlePremiumUpdate} className="space-y-4">
              <div>
                <label className="text-sm text-brand-blue-light">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={premiumPrice}
                  onChange={(e) => setPremiumPrice(e.target.value)}
                  required
                  className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <div>
                <label className="text-sm text-brand-blue-light">
                  Sessions Included
                </label>
                <input
                  type="number"
                  value={premiumSessions}
                  onChange={(e) => setPremiumSessions(e.target.value)}
                  required
                  className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
              </div>
              <Button type="submit" className="w-full">
                {premiumAddon ? "Update" : "Create"} Premium Add-on
              </Button>
            </form>
          </Card>
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Package" : "Add Package"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            {productTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            name="duration_days"
            value={formData.duration_days}
            onChange={handleChange}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            {durations.map((d) => (
              <option key={d} value={d}>
                {d} Days
              </option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          {(formData.product_type === "dietplan" ||
            formData.product_type === "combo") && (
            <input
              type="number"
              name="diet_plans_included"
              placeholder="Diet Plans Included"
              value={formData.diet_plans_included}
              onChange={handleChange}
              required={formData.product_type === "dietplan"}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          )}
          <textarea
            name="features"
            placeholder="Features (one per line) — shown on the public Plans page for this package"
            value={formData.features}
            onChange={handleChange}
            rows={5}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            {editingId ? "Save Changes" : "Add Package"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Packages;
