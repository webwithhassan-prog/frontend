import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
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

const Profile = () => {
  const [client, setClient] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [dietForm, setDietForm] = useState(emptyDietForm);
  const [imageGenerated, setImageGenerated] = useState(false);
  const cardRef = useRef(null);

  const fetchData = async () => {
    try {
      const clientId = localStorage.getItem("client_id");
      const [clientRes, bookingsRes, ebooksRes] = await Promise.all([
        api.get(`/clients/${clientId}`),
        api.get(`/bookings/${clientId}`),
        api.get("/ebooks/public"),
      ]);
      setClient(clientRes.data);
      setBookings(bookingsRes.data.filter((b) => b.status === "booked"));

      const purchasedIds = (clientRes.data.purchased_ebooks || []).map((id) =>
        id.toString(),
      );
      setEbooks(ebooksRes.data.filter((e) => purchasedIds.includes(e._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = async (id) => {
    await api.put(`/bookings/${id}/cancel`);
    fetchData();
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
          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

          {/* Upcoming classes */}
          <h2 className="font-display text-lg text-brand-blue mb-4">
            UPCOMING CLASSES
          </h2>
          {bookings.length === 0 ? (
            <p className="text-brand-blue/70 mb-12">
              No upcoming bookings yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {bookings.map((booking) => {
                const session = booking.class_ref || booking.consultation_ref;
                return (
                  <Card key={booking._id}>
                    <h3 className="font-display text-brand-blue text-sm mb-1">
                      {booking.class_ref
                        ? booking.class_ref.type
                        : "Consultation"}
                    </h3>
                    <p className="text-brand-blue/70 text-xs mb-4">
                      {session
                        ? new Date(session.datetime).toLocaleString()
                        : "—"}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          (window.location.href = `${import.meta.env.VITE_API_URL}/join/booking/${booking._id}`)
                        }
                      >
                        Join Class
                      </Button>
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

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

          {/* Dietician follow-up */}
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
