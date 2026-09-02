import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
  RotateCcw,
} from "lucide-react";
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

const cancelReasons = [
  "Public Holiday",
  "Trainer Unavailable",
  "Low Attendance",
  "Emergency",
  "Other",
];

const StaticCard = ({ children }) => (
  <div className="bg-white border border-brand-blue-pale rounded-2xl shadow-md p-6 overflow-x-auto">
    {children}
  </div>
);

const Timetable = () => {
  const [dayPlans, setDayPlans] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
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
    time: "",
  });

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingClass, setCancellingClass] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const fetchData = async () => {
    try {
      const [dayPlansRes, timeSlotsRes, classesRes, trainersRes] =
        await Promise.all([
          api.get("/day-plans"),
          api.get("/time-slots"),
          api.get("/classes"),
          api.get("/trainers"),
        ]);
      setDayPlans(dayPlansRes.data);
      setTimeSlots(timeSlotsRes.data);
      setTrainers(trainersRes.data);

      const now = new Date();
      const sevenDaysOut = new Date(now);
      sevenDaysOut.setDate(now.getDate() + 7);
      const upcoming = classesRes.data
        .filter((c) => {
          const d = new Date(c.datetime);
          return d >= now && d <= sevenDaysOut;
        })
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      setUpcomingClasses(upcoming);
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
    setSlotForm({ trainer_ref: "", time: "" });
    setIsSlotModalOpen(true);
  };

  const openEditSlotModal = (slot) => {
    setEditingSlotId(slot._id);
    setSlotForm({
      trainer_ref: slot.trainer_ref?._id || slot.trainer_ref,
      time: `${String(slot.hour).padStart(2, "0")}:${String(slot.minute).padStart(2, "0")}`,
    });
    setIsSlotModalOpen(true);
  };

  const handleSlotChange = (e) => {
    setSlotForm({ ...slotForm, [e.target.name]: e.target.value });
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    const [hour, minute] = slotForm.time.split(":").map(Number);
    const payload = {
      trainer_ref: slotForm.trainer_ref,
      hour,
      minute,
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
      fetchData();
    } catch (err) {
      setRegenerateMessage(
        err.response?.data?.message || "Regeneration failed.",
      );
    } finally {
      setRegenerating(false);
    }
  };

  // Cancel / restore handlers
  const openCancelModal = (classItem) => {
    setCancellingClass(classItem);
    setCancelReason("");
    setCustomReason("");
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    const reason = cancelReason === "Other" ? customReason : cancelReason;
    await api.put(`/classes/${cancellingClass._id}/cancel`, { reason });
    setIsCancelModalOpen(false);
    fetchData();
  };

  const handleRestore = async (id) => {
    await api.put(`/classes/${id}/restore`);
    fetchData();
  };

  const sortedSlots = [...timeSlots].sort((a, b) => {
    const timeA = a.hour * 60 + a.minute;
    const timeB = b.hour * 60 + b.minute;
    return timeA - timeB;
  });

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const todayDate = new Date();
  const sessionsByDay = [];
  upcomingClasses.forEach((c) => {
    const classDate = new Date(c.datetime);
    let group = sessionsByDay.find((g) => isSameDay(g.date, classDate));
    if (!group) {
      group = { date: classDate, sessions: [] };
      sessionsByDay.push(group);
    }
    group.sessions.push(c);
  });

  const formatTime = (hour, minute) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
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
          {/* Upcoming Sessions — real instances, cancel/restore per session */}
          <h2 className="text-lg font-bold text-brand-blue mb-2">
            Upcoming Sessions (Next 7 Days)
          </h2>
          <p className="text-brand-blue-light text-sm mb-4">
            Cancel an individual session (holiday, trainer unavailable, etc.)
            without changing the recurring weekly pattern.
          </p>
          <div className="mb-12">
            {sessionsByDay.length === 0 ? (
              <StaticCard>
                <p className="text-brand-blue-light text-sm py-2">
                  No upcoming sessions — regenerate the schedule after setting
                  up your Weekly Plan and Time Slots.
                </p>
              </StaticCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessionsByDay.map(({ date, sessions }) => {
                  const isToday = isSameDay(date, todayDate);
                  return (
                    <div
                      key={date.toDateString()}
                      className="bg-white border border-brand-blue-pale rounded-2xl shadow-md overflow-hidden"
                    >
                      <div
                        className={`flex items-center justify-between px-4 py-3 border-b border-brand-blue-pale ${
                          isToday ? "bg-brand-orange/10" : "bg-brand-blue-pale/40"
                        }`}
                      >
                        <span className="font-bold text-brand-blue text-sm">
                          {date.toLocaleDateString(undefined, {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        {isToday && (
                          <span className="text-[10px] font-bold text-brand-orange bg-white px-2 py-0.5 rounded-full uppercase">
                            Today
                          </span>
                        )}
                      </div>
                      <div className="divide-y divide-brand-blue-pale/60">
                        {sessions.map((c) => (
                          <div
                            key={c._id}
                            className="flex items-center justify-between gap-3 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-brand-blue text-sm truncate">
                                {c.type}
                              </p>
                              <p className="text-brand-blue-light text-xs">
                                {new Date(c.datetime).toLocaleTimeString(
                                  undefined,
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )}{" "}
                                — {c.trainer_ref?.name || "—"}
                              </p>
                              {c.status === "cancelled" && (
                                <p className="text-red-500 text-xs mt-0.5">
                                  Cancelled
                                  {c.cancel_reason
                                    ? ` — ${c.cancel_reason}`
                                    : ""}
                                </p>
                              )}
                            </div>
                            {c.status === "cancelled" ? (
                              <button
                                onClick={() => handleRestore(c._id)}
                                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors shrink-0"
                              >
                                <RotateCcw size={14} /> Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => openCancelModal(c)}
                                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors shrink-0"
                              >
                                <XCircle size={14} /> Cancel
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
          <input
            type="time"
            name="time"
            value={slotForm.time}
            onChange={handleSlotChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <p className="text-xs text-brand-blue-light">
            Time is in Pakistan time.
          </p>
          <Button type="submit" className="w-full">
            {editingSlotId ? "Save Changes" : "Add Slot"}
          </Button>
        </form>
      </Modal>

      {/* Cancel Session Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={`Cancel Session — ${cancellingClass?.type || ""}`}
      >
        <form onSubmit={handleConfirmCancel} className="space-y-4">
          <p className="text-sm text-brand-blue-light">
            {cancellingClass &&
              new Date(cancellingClass.datetime).toLocaleString()}{" "}
            with {cancellingClass?.trainer_ref?.name || "—"}
          </p>
          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="">Select Reason</option>
            {cancelReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {cancelReason === "Other" && (
            <input
              type="text"
              placeholder="Describe the reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          )}
          <Button type="submit" className="w-full">
            Confirm Cancellation
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;
