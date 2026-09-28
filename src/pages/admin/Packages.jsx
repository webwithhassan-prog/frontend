import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";
import { getErrorMessage } from "../../utils/errors";

const emptyForm = {
  product_type: "dietplan",
  duration_days: "",
  price: "",
  diet_plans_included: "",
  features: "",
  is_popular: false,
};

const productTypes = [
  { value: "dietplan", label: "Customized Dietplan" },
  { value: "workout", label: "Home Workouts" },
  { value: "combo", label: "Both Combined" },
];

// Quick picks only — the duration field takes any whole number of days.
const suggestedDurations = [7, 15, 30, 60, 90, 180, 365];

const inputClass =
  "w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange";

const sections = [
  {
    type: "dietplan",
    title: "Customized Dietplans",
    showDietPlans: true,
    empty: "No dietplan packages yet.",
  },
  {
    type: "workout",
    title: "Home Workouts",
    showDietPlans: false,
    empty: "No home workout packages yet.",
  },
  {
    type: "combo",
    title: "Both Combined",
    showDietPlans: true,
    empty: "No dedicated combo packages yet.",
    note:
      "Optional — give the combo its own price and feature list. Without one for a given duration, the public packages page falls back to summing that duration's Dietplan + Workout prices (when both exist).",
  },
];

const Packages = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const plansRes = await api.get("/plans");
      setPlans(plansRes.data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load packages"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = (productType = "dietplan") => {
    setFormData({ ...emptyForm, product_type: productType });
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
      is_popular: !!plan.is_popular,
    });
    setEditingId(plan._id);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
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
      is_popular: formData.is_popular,
    };
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/plans/${editingId}`, payload);
        toast.success("Package updated");
      } else {
        await api.post("/plans", payload);
        toast.success("Package added");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't save the package"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan, label) => {
    if (
      !window.confirm(
        `Delete the ${plan.duration_days}-day ${label} package? It disappears from the packages page straight away.`,
      )
    ) {
      return;
    }
    try {
      await api.delete(`/plans/${plan._id}`);
      toast.success("Package deleted");
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete the package"));
    }
  };

  const typeLabel = (type) =>
    productTypes.find((t) => t.value === type)?.label || type;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Packages
        </motion.h1>
        <Button onClick={() => openAddModal()}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Package
          </span>
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        sections.map((section) => {
          const sectionPlans = plans
            .filter((p) => p.product_type === section.type)
            .sort((a, b) => a.duration_days - b.duration_days);
          const label = typeLabel(section.type);

          return (
            <div key={section.type} className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-2">
                <h2 className="text-lg font-bold text-brand-blue">
                  {section.title}
                </h2>
                <button
                  onClick={() => openAddModal(section.type)}
                  className="flex items-center gap-1 text-sm font-semibold text-brand-blue-light hover:text-brand-orange rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  <Plus size={15} /> Add
                </button>
              </div>
              {section.note && (
                <p className="text-brand-blue-light text-sm">{section.note}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {sectionPlans.length === 0 ? (
                  <p className="text-brand-blue-light col-span-full">
                    {section.empty}
                  </p>
                ) : (
                  sectionPlans.map((plan) => (
                    <Card key={plan._id}>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-brand-blue font-bold text-lg">
                          {plan.duration_days} Days
                        </h3>
                        {plan.is_popular && (
                          <span className="flex items-center gap-1 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Star size={10} fill="currentColor" /> MOST POPULAR
                          </span>
                        )}
                      </div>
                      {section.showDietPlans && plan.diet_plans_included ? (
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
                          className="text-brand-blue-light hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                          aria-label={`Edit ${plan.duration_days} Days ${label} package`}
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(plan, label)}
                          className="text-red-400 hover:text-red-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                          aria-label={`Delete ${plan.duration_days} Days ${label} package`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Package" : "Add Package"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1.5">
              Package type
            </span>
            <select
              name="product_type"
              value={formData.product_type}
              onChange={handleChange}
              className={inputClass}
            >
              {productTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <div>
            <label className="block">
              <span className="block text-sm font-semibold text-brand-blue mb-1.5">
                Duration (days)
              </span>
              <input
                type="number"
                name="duration_days"
                min={1}
                max={3650}
                step={1}
                inputMode="numeric"
                placeholder="Any number of days, e.g. 45"
                value={formData.duration_days}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {suggestedDurations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFormData({ ...formData, duration_days: d })}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                    Number(formData.duration_days) === d
                      ? "bg-brand-blue text-white"
                      : "bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1.5">
              Price (₹)
            </span>
            <input
              type="number"
              name="price"
              min={0}
              placeholder="e.g. 1500"
              value={formData.price}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </label>

          {(formData.product_type === "dietplan" ||
            formData.product_type === "combo") && (
            <label className="block">
              <span className="block text-sm font-semibold text-brand-blue mb-1.5">
                Diet plans included
              </span>
              <input
                type="number"
                name="diet_plans_included"
                min={1}
                placeholder="e.g. 3"
                value={formData.diet_plans_included}
                onChange={handleChange}
                required={formData.product_type === "dietplan"}
                className={inputClass}
              />
            </label>
          )}

          <label className="block">
            <span className="block text-sm font-semibold text-brand-blue mb-1.5">
              Features
            </span>
            <textarea
              name="features"
              placeholder="One per line — shown on the packages page for this package"
              value={formData.features}
              onChange={handleChange}
              rows={5}
              className={inputClass}
            />
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="is_popular"
              checked={formData.is_popular}
              onChange={handleChange}
              className="mt-1 accent-brand-orange"
            />
            <span className="text-sm text-brand-blue">
              Mark as <span className="font-semibold">Most popular</span>
              <span className="block text-xs text-brand-blue-light">
                Highlighted on the packages page. If no package of this type is
                marked, the middle duration is highlighted.
              </span>
            </span>
          </label>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add Package"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Packages;
