import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const dayDisplayOrder = [1, 2, 3, 4, 5, 6, 0]; // Monday first, Sunday last

const StaticCard = ({ children }) => (
  <div className="bg-white border border-brand-blue-pale rounded-2xl shadow-md p-6 overflow-x-auto">
    {children}
  </div>
);

const Timetable = () => {
  const [dayPlans, setDayPlans] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateMessage, setRegenerateMessage] = useState("");

  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [dayTypeInput, setDayTypeInput] = useState("");

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [slotForm, setSlotForm] = useState({
    trainer_ref: "",
    hour: "",
    minute: "",
  });

  const fetchData = async () => {
    try {
      const [dayPlansRes, timeSlotsRes, trainersRes] = await Promise.all([
        api.get("/day-plans"),
        api.get("/time-slots"),
        api.get("/trainers"),
      ]);
      setDayPlans(dayPlansRes.data);
      setTimeSlots(timeSlotsRes.data);
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

  // Weekly Plan handlers
  const openDayModal = (dayIndex) => {
    const existing = dayPlans.find((p) => p.day_of_week === dayIndex);
    setEditingDay(dayIndex);
    setDayTypeInput(existing?.type || "");
    setIsDayModalOpen(true);
  };

  const handleSaveDay = async (e) => {
    e.preventDefault();
    await api.put(`/day-plans/${editingDay}`, { type: dayTypeInput });
    setIsDayModalOpen(false);
    fetchData();
  };

  // Daily Time Slot handlers
  const openAddSlotModal = () => {
    setEditingSlotId(null);
    setSlotForm({ trainer_ref: "", hour: "", minute: "" });
    setIsSlotModalOpen(true);
  };

  const openEditSlotModal = (slot) => {
    setEditingSlotId(slot._id);
    setSlotForm({
      trainer_ref: slot.trainer_ref?._id || slot.trainer_ref,
      hour: slot.hour,
      minute: slot.minute,
    });
    setIsSlotModalOpen(true);
  };

  const handleSlotChange = (e) => {
    setSlotForm({ ...slotForm, [e.target.name]: e.target.value });
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    const payload = {
      trainer_ref: slotForm.trainer_ref,
      hour: Number(slotForm.hour),
      minute: Number(slotForm.minute),
    };
    if (editingSlotId) {
      await api.put(`/time-slots/${editingSlotId}`, payload);
    } else {
      await api.post("/time-slots", payload);
    }
    setIsSlotModalOpen(false);
    fetchData();
  };

  const handleDeleteSlot = async (id) => {
    await api.delete(`/time-slots/${id}`);
    fetchData();
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setRegenerateMessage("");
    try {
      const res = await api.post("/timetable/regenerate");
      setRegenerateMessage(
        `Done — ${res.data.created} new classes created, ${res.data.updated} updated.`,
      );
    } catch (err) {
      setRegenerateMessage(
        err.response?.data?.message || "Regeneration failed.",
      );
    } finally {
      setRegenerating(false);
    }
  };

  const sortedSlots = [...timeSlots].sort((a, b) => {
    const timeA = a.hour * 60 + a.minute;
    const timeB = b.hour * 60 + b.minute;
    return timeA - timeB;
  });

  const formatTime = (hour, minute) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="flex items-center gap-3">
          <Button onClick={handleRegenerate} disabled={regenerating}>
            <span className="flex items-center gap-2">
              <RefreshCw
                size={16}
                className={regenerating ? "animate-spin" : ""}
              />
              {regenerating ? "Regenerating..." : "Regenerate Schedule"}
            </span>
          </Button>
        </div>
      </div>

      {regenerateMessage && (
        <p className="text-sm text-brand-blue mb-6 bg-brand-blue-pale rounded-lg px-4 py-3">
          {regenerateMessage}
        </p>
      )}

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <>
          <h2 className="text-lg font-bold text-brand-blue mb-2">
            Weekly Plan
          </h2>
          <p className="text-brand-blue-light text-sm mb-4">
            The fixed workout type offered on each day. Click a day to edit it —
            then hit "Regenerate Schedule" to apply the change going forward.
          </p>
          <div className="mb-12">
            <StaticCard>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                    <th className="py-3 px-2">Day</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dayDisplayOrder.map((dayIndex) => {
                    const plan = dayPlans.find(
                      (p) => p.day_of_week === dayIndex,
                    );
                    return (
                      <tr
                        key={dayIndex}
                        className="border-b border-brand-blue-pale/60"
                      >
                        <td className="py-3 px-2 font-medium text-brand-blue">
                          {dayNames[dayIndex]}
                        </td>
                        <td className="py-3 px-2 text-brand-blue-light">
                          {plan?.type || (
                            <span className="italic text-brand-blue-light/60">
                              Not set
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => openDayModal(dayIndex)}
                            className="text-brand-blue-light hover:text-brand-blue"
                          >
                            <Pencil size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </StaticCard>
          </div>

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-brand-blue">
              Daily Time Slots
            </h2>
            <Button onClick={openAddSlotModal}>
              <span className="flex items-center gap-2">
                <Plus size={16} /> Add Slot
              </span>
            </Button>
          </div>
          <p className="text-brand-blue-light text-sm mb-4">
            The fixed trainer & time pattern, repeated every day.
          </p>
          <div className="mb-12">
            <StaticCard>
              {sortedSlots.length === 0 ? (
                <p className="text-brand-blue-light text-sm py-2">
                  No time slots set yet.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                      <th className="py-3 px-2">Trainer</th>
                      <th className="py-3 px-2">Time</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSlots.map((slot) => (
                      <tr
                        key={slot._id}
                        className="border-b border-brand-blue-pale/60"
                      >
                        <td className="py-3 px-2 font-medium text-brand-blue">
                          {slot.trainer_ref?.name || "—"}
                        </td>
                        <td className="py-3 px-2 text-brand-blue-light">
                          {formatTime(slot.hour, slot.minute)}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditSlotModal(slot)}
                              className="text-brand-blue-light hover:text-brand-blue"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot._id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </StaticCard>
          </div>
        </>
      )}

      {/* Edit Day Plan Modal */}
      <Modal
        isOpen={isDayModalOpen}
        onClose={() => setIsDayModalOpen(false)}
        title={`Edit ${editingDay !== null ? dayNames[editingDay] : ""}`}
      >
        <form onSubmit={handleSaveDay} className="space-y-4">
          <input
            type="text"
            placeholder="Workout Type (e.g. Yoga and Stretching)"
            value={dayTypeInput}
            onChange={(e) => setDayTypeInput(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Modal>

      {/* Add/Edit Time Slot Modal */}
      <Modal
        isOpen={isSlotModalOpen}
        onClose={() => setIsSlotModalOpen(false)}
        title={editingSlotId ? "Edit Time Slot" : "Add Time Slot"}
      >
        <form onSubmit={handleSaveSlot} className="space-y-4">
          <select
            name="trainer_ref"
            value={slotForm.trainer_ref}
            onChange={handleSlotChange}
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
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="hour"
              placeholder="Hour (0-23)"
              min="0"
              max="23"
              value={slotForm.hour}
              onChange={handleSlotChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <input
              type="number"
              name="minute"
              placeholder="Minute (0-59)"
              min="0"
              max="59"
              value={slotForm.minute}
              onChange={handleSlotChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <p className="text-xs text-brand-blue-light">
            Time is in Pakistan time (24-hour format).
          </p>
          <Button type="submit" className="w-full">
            {editingSlotId ? "Save Changes" : "Add Slot"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;
