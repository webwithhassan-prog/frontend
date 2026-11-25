import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
  RotateCcw,
  Copy,
  Check,
  Video,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/admin/Modal";

// Monday first, as the admin reads the week; values are JS day numbers
// (0 = Sunday), matching the server.
const WEEKDAYS = [
  { value: 1, short: "Mon" },
  { value: 2, short: "Tue" },
  { value: 3, short: "Wed" },
  { value: 4, short: "Thu" },
  { value: 5, short: "Fri" },
  { value: 6, short: "Sat" },
  { value: 0, short: "Sun" },
];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const daysOf = (slot) => (slot.days?.length ? slot.days : ALL_DAYS);
const daysLabel = (days) =>
  days.length === 7
    ? "Every day"
    : days.length === 6 && !days.includes(0)
      ? "Mon–Sat"
      : WEEKDAYS.filter((d) => days.includes(d.value)).map((d) => d.short).join(", ");
import { getErrorMessage } from "../../utils/errors";

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

  const [zoomLink, setZoomLink] = useState(null);
  const [zoomCopied, setZoomCopied] = useState(false);
  const [zoomLinkInput, setZoomLinkInput] = useState("");

  const fetchData = async () => {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfTomorrow = new Date(startOfToday);
      endOfTomorrow.setDate(endOfTomorrow.getDate() + 2);
      endOfTomorrow.setMilliseconds(-1); // 23:59:59.999 tomorrow

      const [dayPlansRes, timeSlotsRes, classesRes, trainersRes, zoomRes] =
        await Promise.all([
          api.get("/day-plans"),
          api.get("/time-slots"),
          api.get("/classes", {
            params: {
              from: startOfToday.toISOString(),
              to: endOfTomorrow.toISOString(),
            },
          }),
          api.get("/trainers"),
          api.get("/timetable/zoom-link"),
        ]);
      setDayPlans(dayPlansRes.data);
      setTimeSlots(timeSlotsRes.data);
      setTrainers(trainersRes.data);
      setZoomLink(zoomRes.data);
      setZoomLinkInput(zoomRes.data?.zoom_join_url || "");

      const upcoming = [...classesRes.data].sort(
        (a, b) => new Date(a.datetime) - new Date(b.datetime),
      );
      setUpcomingClasses(upcoming);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyZoomLink = () => {
    if (!zoomLink?.zoom_join_url) return;
    navigator.clipboard.writeText(zoomLink.zoom_join_url);
    setZoomCopied(true);
    toast.success("Zoom link copied");
    setTimeout(() => setZoomCopied(false), 2000);
  };

  const [savingZoom, setSavingZoom] = useState(false);
  const handleSaveZoomLink = async () => {
    if (!zoomLinkInput.trim()) {
      toast.error("Enter a Zoom link first");
      return;
    }
    setSavingZoom(true);
    try {
      const res = await api.put("/timetable/zoom-link", {
        zoom_join_url: zoomLinkInput.trim(),
      });
      setZoomLink(res.data);
      setZoomLinkInput(res.data.zoom_join_url);
      toast.success("Zoom link updated — pushed to every upcoming class");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update the link"));
    } finally {
      setSavingZoom(false);
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
    // New classes usually run Monday to Saturday; Sunday has its own few.
    setSlotForm({ trainer_ref: "", time: "", days: [1, 2, 3, 4, 5, 6], class_zoom_url: "" });
    setIsSlotModalOpen(true);
  };

  const openEditSlotModal = (slot) => {
    setEditingSlotId(slot._id);
    setSlotForm({
      trainer_ref: slot.trainer_ref?._id || slot.trainer_ref,
      time: `${String(slot.hour).padStart(2, "0")}:${String(slot.minute).padStart(2, "0")}`,
      days: [...daysOf(slot)],
      class_zoom_url: slot.class_zoom_url || "",
    });
    setIsSlotModalOpen(true);
  };

  const handleSlotChange = (e) => {
    setSlotForm({ ...slotForm, [e.target.name]: e.target.value });
  };

  const toggleSlotDay = (day) =>
    setSlotForm((f) => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day],
    }));

  const [savingSlot, setSavingSlot] = useState(false);
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (slotForm.days.length === 0) {
      toast.error("Tick at least one day for this class");
      return;
    }
    const [hour, minute] = slotForm.time.split(":").map(Number);
    const payload = {
      trainer_ref: slotForm.trainer_ref,
      hour,
      minute,
      days: slotForm.days,
      class_zoom_url: slotForm.class_zoom_url.trim(),
    };
    setSavingSlot(true);
    try {
      if (editingSlotId) {
        await api.put(`/time-slots/${editingSlotId}`, payload);
      } else {
        await api.post("/time-slots", payload);
      }
      toast.success("Saved — upcoming classes updated");
      setIsSlotModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't save this time slot"));
    } finally {
      setSavingSlot(false);
    }
  };

  const handleDeleteSlot = async (slot) => {
    if (!window.confirm(`Delete the ${formatTime(slot.hour, slot.minute)} class (${slot.trainer_ref?.name || "trainer"})? Its upcoming sessions are removed too.`)) return;
    try {
      await api.delete(`/time-slots/${slot._id}`);
      toast.success("Time slot removed");
      fetchData();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete this time slot"));
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setRegenerateMessage("");
    try {
      const res = await api.post("/timetable/regenerate");
      setRegenerateMessage(
        `Done — ${res.data.created} new classes created, ${res.data.updated} updated, ${res.data.removed || 0} stale sessions removed.`,
      );
      fetchData();
    } catch (err) {
      setRegenerateMessage(getErrorMessage(err, "Regeneration failed"));
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
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
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
        <Loader />
      ) : (
        <>
          {/* One shared Zoom link for every class — same link for every
              trainer/time. Admin-managed: paste a link below and it's
              pushed onto every upcoming class immediately. */}
          <StaticCard className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-blue-pale flex items-center justify-center shrink-0">
                <Video className="text-brand-blue" size={16} />
              </div>
              <div>
                <p className="text-brand-blue text-sm font-semibold">
                  Class Zoom Link
                </p>
                <p className="text-brand-blue-light text-xs">
                  {zoomLink?.zoom_rotated_at
                    ? `Same link for every class — last updated ${new Date(zoomLink.zoom_rotated_at).toLocaleDateString()}`
                    : "Paste your Zoom link below — it's used for every class until you change it"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="url"
                value={zoomLinkInput}
                onChange={(e) => setZoomLinkInput(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="flex-1 min-w-[240px] border border-brand-blue-pale rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              {zoomLink?.zoom_join_url && (
                <button
                  onClick={handleCopyZoomLink}
                  className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-blue-pale text-brand-blue hover:bg-brand-blue-pale/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                >
                  {zoomCopied ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
              )}
              <button
                onClick={handleSaveZoomLink}
                disabled={savingZoom}
                className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-brand-orange text-white hover:bg-brand-orange/90 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <RefreshCw size={14} className={savingZoom ? "animate-spin" : ""} />
                {savingZoom ? "Saving..." : "Save Link"}
              </button>
            </div>
          </StaticCard>

          {/* Upcoming Sessions — real instances, cancel/restore per session */}
          <h2 className="text-lg font-bold text-brand-blue mb-2">
            Today &amp; Tomorrow's Sessions
          </h2>
          <p className="text-brand-blue-light text-sm mb-4">
            Cancel an individual session (holiday, trainer unavailable, etc.)
            without changing the recurring weekly pattern.
          </p>
          <div className="mb-12">
            {sessionsByDay.length === 0 ? (
              <StaticCard>
                <p className="text-brand-blue-light text-sm py-2">
                  No sessions for today or tomorrow — regenerate the schedule after setting
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
                                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                              >
                                <RotateCcw size={14} /> Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => openCancelModal(c)}
                                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
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
                            className="text-brand-blue-light hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                            aria-label={`Edit ${dayNames[dayIndex]}`}
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
            Each class time, the days it runs on and its Zoom link. Untick Sunday on classes that don't run then.
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
                      <th className="py-3 px-2">Runs on</th>
                      <th className="py-3 px-2">Zoom link</th>
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
                        <td className="py-3 px-2 text-brand-blue-light">
                          {daysLabel(daysOf(slot))}
                        </td>
                        <td className="py-3 px-2 text-brand-blue-light">
                          {slot.class_zoom_url ? (
                            <span className="text-green-700 font-medium">Own link</span>
                          ) : (
                            "Shared link"
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEditSlotModal(slot)}
                              className="text-brand-blue-light hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                              aria-label={`Edit ${slot.trainer_ref?.name || "time slot"} slot`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteSlot(slot)}
                              className="text-red-400 hover:text-red-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                              aria-label={`Delete ${slot.trainer_ref?.name || "time slot"} slot`}
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
          <fieldset>
            <legend className="text-sm font-medium text-brand-blue mb-2">
              Runs on
            </legend>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((d) => {
                const on = slotForm.days?.includes(d.value);
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleSlotDay(d.value)}
                    aria-pressed={on}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                      on
                        ? "bg-brand-blue text-white border-brand-blue"
                        : "bg-white text-brand-blue border-brand-blue-pale hover:border-brand-blue"
                    }`}
                  >
                    {d.short}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div>
            <label htmlFor="class_zoom_url" className="text-sm font-medium text-brand-blue">
              This class's Zoom link
            </label>
            <input
              id="class_zoom_url"
              type="url"
              name="class_zoom_url"
              value={slotForm.class_zoom_url || ""}
              onChange={handleSlotChange}
              placeholder="https://us06web.zoom.us/j/… (leave empty to use the shared link)"
              className="mt-1 w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <Button type="submit" className="w-full" disabled={savingSlot}>
            {savingSlot ? "Saving…" : editingSlotId ? "Save Changes" : "Add Slot"}
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
