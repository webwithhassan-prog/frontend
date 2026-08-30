import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, ChevronDown, Bell, Footprints, Droplet } from "lucide-react";
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
  const [dailySteps, setDailySteps] = useState("");
  const [dailyWater, setDailyWater] = useState("");
  const [dailyLogMessage, setDailyLogMessage] = useState("");
  const navigate = useNavigate();

  const [dietForm, setDietForm] = useState(emptyDietForm);
  const [imageGenerated, setImageGenerated] = useState(false);
  const cardRef = useRef(null);

  const [progressForm, setProgressForm] = useState(emptyProgressForm);
  const [progressPhoto, setProgressPhoto] = useState(null);
  const [progressPhotoPreview, setProgressPhotoPreview] = useState(null);
  const [progressImageGenerated, setProgressImageGenerated] = useState(false);
  const progressCardRef = useRef(null);

  const fetchData = async () => {
    try {
      const clientId = localStorage.getItem("client_id");
      const [clientRes, classesRes, ebooksRes] = await Promise.all([
        api.get(`/clients/${clientId}`),
        api.get("/classes/public"),
        api.get("/ebooks/public"),
      ]);
      setClient(clientRes.data);
      const todayLogRes = await api.get("/daily-logs/today");
      setDailySteps(todayLogRes.data.steps || "");
      setDailyWater(todayLogRes.data.water_liters || "");
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
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

  const renderClassCard = (c) => (
    <Card key={c._id}>
      <h3 className="font-display text-brand-blue text-sm mb-1">{c.type}</h3>
      <p className="text-brand-blue/70 text-xs mb-1">
        with {c.trainer_ref?.name || "Fitness Zone Trainer"}
      </p>
      <p className="text-brand-blue/70 text-xs mb-4">
        {showFullWeek
          ? new Date(c.datetime).toLocaleString()
          : new Date(c.datetime).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
      </p>
      <Button onClick={() => handleJoin(c._id)}>Join Class</Button>
    </Card>
  );

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

  return (
    <div>
      <motion.h1
        className="font-display text-2xl text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome back{client ? `, ${client.name}` : ""}
      </motion.h1>

      {loading ? (
        <p className="text-brand-blue/70">Loading...</p>
      ) : (
        <>
          {/* Weekly check-in reminder */}
          {checkinDue && (client?.has_dietplan || client?.has_workout) && (
            <motion.div
              className="mb-8 flex items-center gap-3 bg-brand-orange/10 border border-brand-orange rounded-xl px-4 py-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Bell size={18} className="text-brand-orange flex-shrink-0" />
              <p className="text-brand-blue text-sm">
                {daysSinceCheckin === null
                  ? "You haven't done a weekly check-in yet — fill it out below."
                  : `It's been ${daysSinceCheckin} days since your last check-in — time for a new one.`}
              </p>
            </motion.div>
          )}

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <p className="text-brand-blue/60 text-sm mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[client?.status]}`}
              >
                {client?.status}
              </span>
            </Card>
            <Card>
              <p className="text-brand-blue/60 text-sm mb-1">Days Remaining</p>
              <p className="font-display text-3xl text-brand-blue">
                {client?.days_remaining}
              </p>
            </Card>
            <Card>
              <p className="text-brand-blue/60 text-sm mb-1">Packages</p>
              <p className="text-sm text-brand-blue">
                {[
                  client?.has_dietplan && "Dietplan",
                  client?.has_workout && "Workout",
                  client?.has_premium && "Premium",
                ]
                  .filter(Boolean)
                  .join(" · ") || "None active"}
              </p>
            </Card>
          </div>

          {/* Usage quotas */}
          {(client?.has_dietplan || client?.has_premium) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {client?.has_dietplan && (
                <Card>
                  <p className="text-brand-blue/60 text-sm mb-1">Diet Plans</p>
                  <p className="text-brand-blue text-sm">
                    {client.diet_plans_total - client.diet_plans_used} of{" "}
                    {client.diet_plans_total} remaining
                  </p>
                </Card>
              )}
              {client?.has_premium && (
                <Card>
                  <p className="text-brand-blue/60 text-sm mb-1">
                    Premium Sessions
                  </p>
                  <p className="text-brand-blue text-sm">
                    {client.premium_sessions_total -
                      client.premium_sessions_used}{" "}
                    of {client.premium_sessions_total} remaining
                  </p>
                </Card>
              )}
            </div>
          )}
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

          {/* Upcoming classes */}
          <div className="flex items-center justify-between mb-4">
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

          {/* Recorded Library */}
          <h2 className="font-display text-lg text-brand-blue mb-4">
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
          <h2 className="font-display text-lg text-brand-blue mb-4">
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

          {/* Dietician follow-up
          <h2 className="font-display text-lg text-brand-blue mb-2">
            DIETICIAN FOLLOW-UP
          </h2>
          <p className="text-brand-blue/70 text-sm mb-6">
            Fill this in anytime you want an updated plan — nothing here is
            saved on our servers. Save the image and send it to us on WhatsApp.
          </p>

          <AnimatePresence mode="wait">
            {!imageGenerated ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="max-w-xl">
                  <form onSubmit={handleDietSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={dietForm.name}
                      onChange={handleDietChange}
                      required
                      className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={dietForm.age}
                        onChange={handleDietChange}
                        required
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <input
                        type="number"
                        name="weight"
                        placeholder="Weight (kg)"
                        value={dietForm.weight}
                        onChange={handleDietChange}
                        required
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <input
                        type="number"
                        name="height"
                        placeholder="Height (cm)"
                        value={dietForm.height}
                        onChange={handleDietChange}
                        required
                        className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                    </div>
                    <input
                      type="text"
                      name="goal"
                      placeholder="Goal (e.g. Weight loss, Muscle gain)"
                      value={dietForm.goal}
                      onChange={handleDietChange}
                      required
                      className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <textarea
                      name="dietary_notes"
                      placeholder="Dietary notes / allergies / preferences"
                      value={dietForm.dietary_notes}
                      onChange={handleDietChange}
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
                key="image"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  ref={cardRef}
                  className="max-w-xl bg-white border-2 border-brand-blue rounded-2xl p-8"
                >
                  <h2 className="font-display text-brand-blue text-lg mb-4">
                    DIETICIAN FOLLOW-UP
                  </h2>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-brand-blue/60">Name:</span>{" "}
                      <span className="text-brand-blue font-medium">
                        {dietForm.name}
                      </span>
                    </p>
                    <p>
                      <span className="text-brand-blue/60">Age:</span>{" "}
                      <span className="text-brand-blue font-medium">
                        {dietForm.age}
                      </span>
                    </p>
                    <p>
                      <span className="text-brand-blue/60">Weight:</span>{" "}
                      <span className="text-brand-blue font-medium">
                        {dietForm.weight} kg
                      </span>
                    </p>
                    <p>
                      <span className="text-brand-blue/60">Height:</span>{" "}
                      <span className="text-brand-blue font-medium">
                        {dietForm.height} cm
                      </span>
                    </p>
                    <p>
                      <span className="text-brand-blue/60">Goal:</span>{" "}
                      <span className="text-brand-blue font-medium">
                        {dietForm.goal}
                      </span>
                    </p>
                    {dietForm.dietary_notes && (
                      <p>
                        <span className="text-brand-blue/60">Notes:</span>{" "}
                        <span className="text-brand-blue font-medium">
                          {dietForm.dietary_notes}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="mt-6 text-xs text-brand-orange font-semibold">
                    FITNESS ZONE • Dietician Follow-Up
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button onClick={handleSaveImage}>Save Image</Button>
                  <button
                    onClick={handleDietReset}
                    className="text-sm font-semibold text-brand-blue/60 hover:text-brand-blue"
                  >
                    Start Over
                  </button>
                </div>

                <p className="text-brand-blue/70 text-sm mt-6">
                  Send this image to us on WhatsApp to get your updated plan.
                </p>
              </motion.div>
            )}
          </AnimatePresence> */}

          {/* Weekly Progress form */}
          <h2 className="font-display text-lg text-brand-blue mb-2 mt-12">
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
