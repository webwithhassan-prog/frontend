import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import {
  Download,
  ChevronDown,
  Footprints,
  Droplet,
  Lock,
  Check,
  UtensilsCrossed,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const statusColors = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  expired: "bg-red-100 text-red-700",
};

const emptyDietForm = {
  name: "",
  age: "",
  weight: "",
  height: "",
  goal: "",
  dietary_notes: "",
};

const emptyProgressForm = {
  starting_weight: "",
  current_weight: "",
  inch_loss: "",
  cloth_fit_note: "",
  sleep_hours: "",
  sleep_quality: "",
  water_intake: "",
  energy_feedback: "",
};

const emptyOnboardingForm = {
  starting_date: "",
  full_name: "",
  country: "",
  preferred_language: "",
  current_weight: "",
  age: "",
  height: "",
  dietary_preference: "",
  medical_issues: "",
  food_allergies: "",
  smoking_habit: "",
  disability: "",
  marital_status: "",
  occupation: "",
  kids: "",
  measurement_shoulders: "",
  measurement_chest: "",
  measurement_arms: "",
  measurement_waist: "",
  measurement_abdomen: "",
  measurement_hips: "",
  measurement_thighs: "",
  previous_diet: "",
};

const Profile = () => {
  const [client, setClient] = useState(null);
  const [allUpcomingClasses, setAllUpcomingClasses] = useState([]);
  const [showFullWeek, setShowFullWeek] = useState(false);
  const [ebooks, setEbooks] = useState([]);
  const [recordedContent, setRecordedContent] = useState([]);
  const [contentLocked, setContentLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const [dietForm, setDietForm] = useState(emptyDietForm);
  const [imageGenerated, setImageGenerated] = useState(false);
  const cardRef = useRef(null);

  const [progressForm, setProgressForm] = useState(emptyProgressForm);
  const [progressPhoto, setProgressPhoto] = useState(null);
  const [progressPhotoPreview, setProgressPhotoPreview] = useState(null);
  const [progressImageGenerated, setProgressImageGenerated] = useState(false);
  const progressCardRef = useRef(null);

  const [onboardingForm, setOnboardingForm] = useState(emptyOnboardingForm);
  const [onboardingImageGenerated, setOnboardingImageGenerated] =
    useState(false);
  const onboardingCardRef = useRef(null);

  const [dailySteps, setDailySteps] = useState("");
  const [dailyWater, setDailyWater] = useState("");
  const [dailyLogMessage, setDailyLogMessage] = useState("");

  const fetchData = async () => {
    try {
      const clientId = localStorage.getItem("client_id");
      const [clientRes, classesRes, ebooksRes] = await Promise.all([
        api.get(`/clients/${clientId}`),
        api.get("/classes/public"),
        api.get("/ebooks/public"),
      ]);
      setClient(clientRes.data);

      const now = new Date();
      const sevenDaysOut = new Date(now);
      sevenDaysOut.setDate(now.getDate() + 7);
      const upcoming = classesRes.data
        .filter((c) => {
          const d = new Date(c.datetime);
          return d >= now && d <= sevenDaysOut;
        })
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      setAllUpcomingClasses(upcoming);

      const purchasedIds = (clientRes.data.purchased_ebooks || []).map((id) =>
        id.toString(),
      );
      setEbooks(ebooksRes.data.filter((e) => purchasedIds.includes(e._id)));

      try {
        const contentRes = await api.get(`/content/client/${clientId}`);
        setRecordedContent(contentRes.data);
        setContentLocked(false);
      } catch (contentErr) {
        if (contentErr.response?.status === 403) {
          setContentLocked(true);
        } else {
          console.error(contentErr);
        }
      }

      try {
        const todayLogRes = await api.get("/daily-logs/today");
        setDailySteps(todayLogRes.data.steps || "");
        setDailyWater(todayLogRes.data.water_liters || "");
      } catch (logErr) {
        console.error(logErr);
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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDietChange = (e) => {
    setDietForm({ ...dietForm, [e.target.name]: e.target.value });
  };

  const handleDietSubmit = (e) => {
    e.preventDefault();
    setImageGenerated(true);
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${dietForm.name || "dietician-followup"}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleDietReset = () => {
    setDietForm(emptyDietForm);
    setImageGenerated(false);
  };

  const handleProgressChange = (e) => {
    setProgressForm({ ...progressForm, [e.target.name]: e.target.value });
  };

  const handleProgressPhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProgressPhoto(file);
    setProgressPhotoPreview(URL.createObjectURL(file));
  };

  const handleProgressSubmit = (e) => {
    e.preventDefault();
    setProgressImageGenerated(true);
  };

  const handleSaveProgressImage = async () => {
    if (!progressCardRef.current) return;
    const dataUrl = await toPng(progressCardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "weekly-progress.png";
    link.href = dataUrl;
    link.click();

    try {
      const clientId = localStorage.getItem("client_id");
      await api.put(`/clients/${clientId}/progress-checkin`);
      setClient((prev) => ({
        ...prev,
        last_progress_checkin: new Date().toISOString(),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleProgressReset = () => {
    setProgressForm(emptyProgressForm);
    setProgressPhoto(null);
    setProgressPhotoPreview(null);
    setProgressImageGenerated(false);
  };

  const handleOnboardingChange = (e) => {
    setOnboardingForm({ ...onboardingForm, [e.target.name]: e.target.value });
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    setOnboardingImageGenerated(true);
  };

  const handleSaveOnboardingImage = async () => {
    if (!onboardingCardRef.current) return;
    const dataUrl = await toPng(onboardingCardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "day1-onboarding.png";
    link.href = dataUrl;
    link.click();

    try {
      const clientId = localStorage.getItem("client_id");
      await api.put(`/clients/${clientId}/onboarding-complete`);
      setClient((prev) => ({ ...prev, onboarding_completed: true }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveDailyLog = async (e) => {
    e.preventDefault();
    setDailyLogMessage("");
    try {
      await api.put("/daily-logs/today", {
        steps: Number(dailySteps) || 0,
        water_liters: Number(dailyWater) || 0,
      });
      setDailyLogMessage("Saved! Keep it up.");
    } catch (err) {
      setDailyLogMessage("Something went wrong.");
    }
  };

  const handleDismissDietplanNotification = async () => {
    try {
      const clientId = localStorage.getItem("client_id");
      await api.put(`/clients/${clientId}/dismiss-dietplan-notification`);
      setClient((prev) => ({ ...prev, dietplan_notification_pending: false }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = (classId) => {
    const clientId = localStorage.getItem("client_id");
    window.location.href = `${import.meta.env.VITE_API_URL}/join/class/${classId}?client_id=${clientId}`;
  };

  const todayClasses = allUpcomingClasses.filter((c) => {
    const d = new Date(c.datetime);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  const classesToShow = showFullWeek ? allUpcomingClasses : todayClasses;

  const renderClassCard = (c) => {
    const isCancelled = c.status === "cancelled";
    return (
      <Card
        key={c._id}
        className={isCancelled ? "opacity-70 border-red-200 border-2" : ""}
      >
        <h3 className="font-display text-brand-blue text-sm mb-1">{c.type}</h3>
        <p className="text-brand-blue/70 text-xs mb-1">
          with {c.trainer_ref?.name || "Fitness Zone Trainer"}
        </p>
        <p className="text-brand-blue/70 text-xs mb-4">
          {showFullWeek
            ? new Date(c.datetime).toLocaleString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : new Date(c.datetime).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
        </p>
        {isCancelled ? (
          <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700">
            Cancelled{c.cancel_reason ? ` — ${c.cancel_reason}` : ""}
          </span>
        ) : (
          <Button onClick={() => handleJoin(c._id)}>Join Class</Button>
        )}
      </Card>
    );
  };

  const contentByCategory = recordedContent.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const daysSinceCheckin = client?.last_progress_checkin
    ? Math.floor(
        (new Date() - new Date(client.last_progress_checkin)) /
          (1000 * 60 * 60 * 24),
      )
    : null;
  const checkinDue = daysSinceCheckin === null || daysSinceCheckin >= 7;
  const daysUntilCheckin =
    daysSinceCheckin === null ? 0 : Math.max(0, 7 - daysSinceCheckin);
  const services = [
    {
      key: "workout",
      label: "DAILY CLASSES",
      subtitle: todayClasses[0]
        ? `Next: ${todayClasses[0].type} today`
        : "No class today",
      active: client?.status === "active" && client?.has_workout,
      upgradeType: "workout",
    },
    {
      key: "followup",
      label: "FOLLOW UP",
      subtitle: checkinDue
        ? daysSinceCheckin === null
          ? "You haven't checked in yet"
          : `Overdue by ${daysSinceCheckin - 7} day(s)`
        : `Days remaining: ${daysUntilCheckin}`,
      active: client?.has_dietplan || client?.has_workout,
      upgradeType: "workout",
    },
    {
      key: "premium",
      label: "1-ON-1 CONSULTATIONS",
      subtitle: client?.has_premium
        ? `${client.premium_sessions_total - client.premium_sessions_used} of ${client.premium_sessions_total} sessions left`
        : "Dietician, gyne, psychiatrist",
      active: client?.status === "active" && client?.has_premium,
      upgradeType: "combo",
    },
    {
      key: "ebooks",
      label: "E-BOOKS",
      subtitle:
        ebooks.length > 0
          ? `${ebooks.length} e-book${ebooks.length > 1 ? "s" : ""} available`
          : "No e-books purchased yet",
      active: ebooks.length > 0,
    },
  ];

  return (
    <div>
      {loading ? (
        <p className="text-brand-blue/70">Loading...</p>
      ) : (
        <>
          {/* Day 1 Onboarding — shown once for new clients */}
          {!client?.onboarding_completed && (
            <>
              <h2 className="font-display text-lg text-brand-blue mb-2">
                DAY 1 — ONBOARDING FORM
              </h2>
              <p className="text-brand-blue/70 text-sm mb-6">
                Welcome! Fill this in once to help us personalize your plan —
                nothing here is saved on our servers. Save the image and send it
                to us on WhatsApp.
              </p>

              <AnimatePresence mode="wait">
                {!onboardingImageGenerated ? (
                  <motion.div
                    key="onboarding-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="max-w-xl mb-12">
                      <form
                        onSubmit={handleOnboardingSubmit}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="date"
                            name="starting_date"
                            value={onboardingForm.starting_date}
                            onChange={handleOnboardingChange}
                            required
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="full_name"
                            placeholder="Full Name"
                            value={onboardingForm.full_name}
                            onChange={handleOnboardingChange}
                            required
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="country"
                            placeholder="Country / Location"
                            value={onboardingForm.country}
                            onChange={handleOnboardingChange}
                            required
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="preferred_language"
                            placeholder="Preferred Language"
                            value={onboardingForm.preferred_language}
                            onChange={handleOnboardingChange}
                            required
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            name="current_weight"
                            placeholder="Weight (kg/lbs)"
                            value={onboardingForm.current_weight}
                            onChange={handleOnboardingChange}
                            required
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={onboardingForm.age}
                            onChange={handleOnboardingChange}
                            required
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="height"
                            placeholder="Height"
                            value={onboardingForm.height}
                            onChange={handleOnboardingChange}
                            required
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <select
                          name="dietary_preference"
                          value={onboardingForm.dietary_preference}
                          onChange={handleOnboardingChange}
                          required
                          className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        >
                          <option value="">Dietary Preference</option>
                          <option value="Veg">Veg</option>
                          <option value="Non-Veg">Non-Veg</option>
                          <option value="Vegan">Vegan</option>
                          <option value="Eggitarian">Eggitarian</option>
                        </select>

                        <input
                          type="text"
                          name="medical_issues"
                          placeholder="Medical Issues / Health Conditions (names only, e.g. PCOS, Thyroid)"
                          value={onboardingForm.medical_issues}
                          onChange={handleOnboardingChange}
                          className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />

                        <input
                          type="text"
                          name="food_allergies"
                          placeholder="Food Allergies / Intolerances"
                          value={onboardingForm.food_allergies}
                          onChange={handleOnboardingChange}
                          className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />

                        <p className="text-sm text-brand-blue/60 pt-2">
                          Lifestyle Details
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="smoking_habit"
                            placeholder="Smoking Habit"
                            value={onboardingForm.smoking_habit}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="disability"
                            placeholder="Disability (if any)"
                            value={onboardingForm.disability}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="marital_status"
                            placeholder="Marital Status"
                            value={onboardingForm.marital_status}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="occupation"
                            placeholder="Occupation / Daily Routine"
                            value={onboardingForm.occupation}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <input
                          type="text"
                          name="kids"
                          placeholder="Kids (Number/Ages, if applicable)"
                          value={onboardingForm.kids}
                          onChange={handleOnboardingChange}
                          className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />

                        <p className="text-sm text-brand-blue/60 pt-2">
                          Body Measurements (provide within 1-2 days, in
                          inches/cm)
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="measurement_shoulders"
                            placeholder="Shoulders"
                            value={onboardingForm.measurement_shoulders}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="measurement_chest"
                            placeholder="Chest"
                            value={onboardingForm.measurement_chest}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="measurement_arms"
                            placeholder="Arms / Biceps"
                            value={onboardingForm.measurement_arms}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="measurement_waist"
                            placeholder="Waist (narrowest point)"
                            value={onboardingForm.measurement_waist}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="measurement_abdomen"
                            placeholder="Abdomen (at belly button)"
                            value={onboardingForm.measurement_abdomen}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                          <input
                            type="text"
                            name="measurement_hips"
                            placeholder="Hips (widest point)"
                            value={onboardingForm.measurement_hips}
                            onChange={handleOnboardingChange}
                            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                          />
                        </div>

                        <input
                          type="text"
                          name="measurement_thighs"
                          placeholder="Thighs"
                          value={onboardingForm.measurement_thighs}
                          onChange={handleOnboardingChange}
                          className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />

                        <textarea
                          name="previous_diet"
                          placeholder="Currently following any diet plan? (If yes, please share)"
                          value={onboardingForm.previous_diet}
                          onChange={handleOnboardingChange}
                          rows={3}
                          className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                        />

                        <Button type="submit" className="w-full">
                          Generate Image
                        </Button>
                      </form>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="onboarding-image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-12"
                  >
                    <div
                      ref={onboardingCardRef}
                      className="max-w-xl bg-white border-2 border-brand-blue rounded-2xl p-8 max-h-[600px] overflow-y-auto"
                    >
                      <h2 className="font-display text-brand-blue text-lg mb-4">
                        DAY 1 — ONBOARDING
                      </h2>
                      <div className="space-y-2 text-sm">
                        {Object.entries(onboardingForm)
                          .filter(([, value]) => value)
                          .map(([key, value]) => (
                            <p key={key}>
                              <span className="text-brand-blue/60 capitalize">
                                {key.replace(/_/g, " ")}:
                              </span>{" "}
                              <span className="text-brand-blue font-medium">
                                {value}
                              </span>
                            </p>
                          ))}
                      </div>
                      <div className="mt-6 text-xs text-brand-orange font-semibold">
                        FITNESS ZONE • Day 1 Onboarding
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Button onClick={handleSaveOnboardingImage}>
                        Save Image
                      </Button>
                    </div>

                    <p className="text-brand-blue/70 text-sm mt-6">
                      Send this image to us on WhatsApp — welcome aboard!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Header */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-brand-blue to-brand-blue-light rounded-3xl px-6 py-6 mb-8 shadow-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <p className="text-white/50 text-xs font-semibold tracking-wide mb-1">
                WELCOME BACK
              </p>
              <h1 className="font-display text-2xl text-white">
                Hi, {client?.name}!
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${statusColors[client?.status]}`}
              >
                {client?.status}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 text-white">
                {client?.days_remaining} days left
              </span>
            </div>
          </motion.div>

          {/* Dietplan renewal notification */}
          {client?.dietplan_notification_pending && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="border-brand-orange border-2 bg-brand-orange/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="inline-flex shrink-0 bg-brand-orange/10 rounded-full p-2.5">
                    <UtensilsCrossed size={20} className="text-brand-orange" />
                  </div>
                  <div>
                    <p className="font-display text-brand-blue text-sm mb-1">
                      TIME FOR YOUR NEW DIETPLAN
                    </p>
                    <p className="text-brand-blue/70 text-sm">
                      It's been 15 days — your next diet plan is ready. Our
                      team will reach out to you on WhatsApp shortly.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={handleDismissDietplanNotification}
                  className="sm:shrink-0"
                >
                  Got it
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Premium Services grid */}
          <h2 className="font-display text-sm text-brand-blue/60 tracking-wide mb-4">
            YOUR SERVICES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {services.map((s) => (
              <Card
                key={s.key}
                className={`flex flex-col h-full ${!s.active ? "opacity-70" : ""}`}
              >
                <div className="flex-1">
                  {s.active ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-3">
                      <Check size={10} /> ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-blue-light bg-brand-blue-pale px-2 py-0.5 rounded-full mb-3">
                      <Lock size={10} /> LOCKED
                    </span>
                  )}
                  <p className="font-display text-brand-blue text-xs leading-snug mb-2">
                    {s.label}
                  </p>
                  <p className="text-brand-blue/60 text-xs leading-snug">
                    {s.subtitle}
                  </p>
                </div>
                {s.active ? (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (s.key === "workout")
                        document
                          .getElementById("upcoming-classes")
                          ?.scrollIntoView({ behavior: "smooth" });
                      if (s.key === "premium")
                        navigate("/client/book-consultation");
                      if (s.key === "ebooks")
                        document
                          .getElementById("my-ebooks")
                          ?.scrollIntoView({ behavior: "smooth" });
                      if (s.key === "followup")
                        document
                          .getElementById("weekly-progress")
                          ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full mt-4"
                  >
                    View
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (s.key === "ebooks") navigate("/ebooks");
                      else if (s.key === "premium") navigate("/consultation");
                      else navigate(`/plans?type=${s.upgradeType}`);
                    }}
                    className="w-full mt-4"
                  >
                    Upgrade to Unlock
                  </Button>
                )}
              </Card>
            ))}
          </div>

          {/* Upcoming classes */}
          <div
            id="upcoming-classes"
            className="flex items-center justify-between mb-4"
          >
            <h2 className="font-display text-lg text-brand-blue">
              {showFullWeek
                ? "UPCOMING CLASSES — NEXT 7 DAYS"
                : "TODAY'S CLASSES"}
            </h2>
            {client?.status === "active" && client?.has_workout && (
              <button
                onClick={() => setShowFullWeek(!showFullWeek)}
                className="flex items-center gap-1 text-sm font-semibold text-brand-orange"
              >
                {showFullWeek ? "Show Today Only" : "Show Upcoming Week"}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showFullWeek ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          {client?.status !== "active" || !client?.has_workout ? (
            <Card className="mb-12 border-brand-orange border-2 text-center max-w-lg">
              <p className="text-brand-blue font-semibold mb-4">
                Your Workout package isn't active — activate it to see and join
                live classes.
              </p>
              <Button onClick={() => navigate("/plans?type=workout")}>
                View Workout Packages
              </Button>
            </Card>
          ) : classesToShow.length === 0 ? (
            <p className="text-brand-blue/70 mb-12">
              {showFullWeek
                ? "No classes scheduled in the next 7 days."
                : "No classes scheduled for today."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {classesToShow.map(renderClassCard)}
            </div>
          )}

          {/* Today's Log */}
          <h2 className="font-display text-lg text-brand-blue mb-4">
            TODAY'S LOG
          </h2>
          <Card className="max-w-md mb-12">
            <form onSubmit={handleSaveDailyLog} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1 text-sm text-brand-blue/60 mb-1">
                    <Footprints size={14} /> Steps
                  </label>
                  <input
                    type="number"
                    value={dailySteps}
                    onChange={(e) => setDailySteps(e.target.value)}
                    className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm text-brand-blue/60 mb-1">
                    <Droplet size={14} /> Water (liters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={dailyWater}
                    onChange={(e) => setDailyWater(e.target.value)}
                    className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
              </div>
              {dailyLogMessage && (
                <p className="text-brand-blue text-sm">{dailyLogMessage}</p>
              )}
              <Button type="submit">Save Today's Log</Button>
            </form>
          </Card>

          {/* Recorded Library */}
          <h2
            id="recorded-library"
            className="font-display text-lg text-brand-blue mb-4"
          >
            RECORDED LIBRARY
          </h2>
          {contentLocked ? (
            <Card className="mb-12 border-brand-orange border-2 text-center max-w-lg">
              <p className="text-brand-blue font-semibold mb-4">
                Your subscription isn't active — renew to unlock the recorded
                library.
              </p>
              <Button onClick={() => navigate("/plans")}>View Packages</Button>
            </Card>
          ) : recordedContent.length === 0 ? (
            <p className="text-brand-blue/70 mb-12">
              No recorded videos available yet.
            </p>
          ) : (
            Object.entries(contentByCategory).map(([category, items]) => (
              <div key={category} className="mb-8">
                <p className="text-brand-blue/60 text-xs uppercase tracking-wide mb-3">
                  {category}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map((item) => (
                    <Card key={item._id}>
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-brand-blue-pale">
                        <iframe
                          src={item.youtube_link.replace("watch?v=", "embed/")}
                          title={item.title}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                      <h3 className="font-display text-brand-blue text-sm">
                        {item.title}
                      </h3>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
          <div className="mb-4" />

          {/* My E-Books */}
          <h2
            id="my-ebooks"
            className="font-display text-lg text-brand-blue mb-4"
          >
            MY E-BOOKS
          </h2>
          {ebooks.length === 0 ? (
            <p className="text-brand-blue/70 mb-12">
              No e-books purchased yet — check the E-Books page to browse.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {ebooks.map((ebook) => (
                <Card key={ebook._id}>
                  <h3 className="font-display text-brand-blue text-sm mb-1">
                    {ebook.title}
                  </h3>
                  <p className="text-brand-blue/70 text-xs mb-4">
                    {ebook.description}
                  </p>
                  <a
                    href={ebook.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-colors"
                  >
                    <Download size={14} /> Download
                  </a>
                </Card>
              ))}
            </div>
          )}

          {/* Weekly Progress form */}
          <h2
            id="weekly-progress"
            className="font-display text-lg text-brand-blue mb-2 mt-12"
          >
            WEEKLY PROGRESS CHECK-IN
          </h2>
          <p className="text-brand-blue/70 text-sm mb-6">
            Fill this in weekly to track your progress — nothing here is saved
            on our servers except the date of your last check-in (so we can
            remind you). Save the image and send it to us on WhatsApp.
          </p>

          <AnimatePresence mode="wait">
            {!progressImageGenerated ? (
              <motion.div
                key="progress-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="max-w-xl">
                  <form onSubmit={handleProgressSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        name="starting_weight"
                        placeholder="Starting Weight (kg)"
                        value={progressForm.starting_weight}
                        onChange={handleProgressChange}
                        required
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <input
                        type="number"
                        name="current_weight"
                        placeholder="Today's Weight (kg)"
                        value={progressForm.current_weight}
                        onChange={handleProgressChange}
                        required
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                    </div>
                    <input
                      type="text"
                      name="inch_loss"
                      placeholder="Total Inch Loss This Week (if any)"
                      value={progressForm.inch_loss}
                      onChange={handleProgressChange}
                      className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />

                    <div>
                      <label className="text-sm text-brand-blue/60 mb-2 block">
                        Progress Photo (optional) or note how your clothes fit
                      </label>
                      <div className="flex items-center gap-4 mb-2">
                        <label className="cursor-pointer text-sm font-semibold text-brand-orange">
                          {progressPhoto ? "Change Photo" : "Upload Photo"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProgressPhotoSelect}
                            className="hidden"
                          />
                        </label>
                        {progressPhotoPreview && (
                          <img
                            src={progressPhotoPreview}
                            alt="Preview"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                      </div>
                      <input
                        type="text"
                        name="cloth_fit_note"
                        placeholder="How do your clothes fit this week?"
                        value={progressForm.cloth_fit_note}
                        onChange={handleProgressChange}
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="sleep_hours"
                        placeholder="Hours of Sleep"
                        value={progressForm.sleep_hours}
                        onChange={handleProgressChange}
                        required
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <input
                        type="text"
                        name="sleep_quality"
                        placeholder="Sleep Quality"
                        value={progressForm.sleep_quality}
                        onChange={handleProgressChange}
                        required
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                    </div>

                    <input
                      type="text"
                      name="water_intake"
                      placeholder="Water Intake (liters/day)"
                      value={progressForm.water_intake}
                      onChange={handleProgressChange}
                      required
                      className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />

                    <textarea
                      name="energy_feedback"
                      placeholder="Energy levels, feedback, or questions"
                      value={progressForm.energy_feedback}
                      onChange={handleProgressChange}
                      rows={3}
                      className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />

                    <Button type="submit" className="w-full">
                      Generate Image
                    </Button>
                  </form>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="progress-image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  ref={progressCardRef}
                  className="max-w-xl bg-white border-2 border-brand-blue rounded-2xl p-8"
                >
                  <h2 className="font-display text-brand-blue text-lg mb-4">
                    WEEKLY PROGRESS
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-brand-blue/60">
                        Starting Weight:
                      </span>{" "}
                      <span className="text-brand-blue font-medium">
                        {progressForm.starting_weight} kg
                      </span>
                    </p>
                    <p>
                      <span className="text-brand-blue/60">
                        Today's Weight:
                      </span>{" "}
                      <span className="text-brand-blue font-medium">
                        {progressForm.current_weight} kg
                      </span>
                    </p>
                    {progressForm.inch_loss && (
                      <p>
                        <span className="text-brand-blue/60">Inch Loss:</span>{" "}
                        <span className="text-brand-blue font-medium">
                          {progressForm.inch_loss}
                        </span>
                      </p>
                    )}
                    {progressForm.cloth_fit_note && (
                      <p>
                        <span className="text-brand-blue/60">Clothes Fit:</span>{" "}
                        <span className="text-brand-blue font-medium">
                          {progressForm.cloth_fit_note}
                        </span>
                      </p>
                    )}
                    <p>
                      <span className="text-brand-blue/60">Sleep:</span>{" "}
                      <span className="text-brand-blue font-medium">
                        {progressForm.sleep_hours} hrs —{" "}
                        {progressForm.sleep_quality}
                      </span>
                    </p>
                    <p>
                      <span className="text-brand-blue/60">Water Intake:</span>{" "}
                      <span className="text-brand-blue font-medium">
                        {progressForm.water_intake} L/day
                      </span>
                    </p>
                    {progressForm.energy_feedback && (
                      <p>
                        <span className="text-brand-blue/60">
                          Energy & Feedback:
                        </span>{" "}
                        <span className="text-brand-blue font-medium">
                          {progressForm.energy_feedback}
                        </span>
                      </p>
                    )}
                  </div>

                  {progressPhotoPreview && (
                    <img
                      src={progressPhotoPreview}
                      alt="Progress"
                      className="w-full rounded-xl mt-4 max-h-64 object-cover"
                    />
                  )}

                  <div className="mt-6 text-xs text-brand-orange font-semibold">
                    FITNESS ZONE • Weekly Progress
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={handleSaveProgressImage}>Save Image</Button>
                  <button
                    onClick={handleProgressReset}
                    className="text-sm font-semibold text-brand-blue/60 hover:text-brand-blue"
                  >
                    Start Over
                  </button>
                </div>

                <p className="text-brand-blue/70 text-sm mt-6">
                  Send this image to us on WhatsApp — your next reminder will
                  show up in 7 days.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <h2 className="font-display text-lg text-brand-blue mb-2 mt-12">
        CHANGE PASSWORD
      </h2>
      <Card className="max-w-md">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          {passwordMessage && (
            <p className="text-brand-blue text-sm">{passwordMessage}</p>
          )}
          <Button type="submit">Update Password</Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
