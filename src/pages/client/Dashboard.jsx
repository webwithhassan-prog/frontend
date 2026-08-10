import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const statusColors = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  expired: "bg-red-100 text-red-700",
};

const Dashboard = () => {
  const [client, setClient] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientId = localStorage.getItem("client_id");
        const [clientRes, bookingsRes] = await Promise.all([
          api.get(`/clients/${clientId}`),
          api.get(`/bookings/${clientId}`),
        ]);
        setClient(clientRes.data);
        setBookings(bookingsRes.data.filter((b) => b.status === "booked"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome back{client ? `, ${client.name}` : ""}
      </motion.h1>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <p className="text-brand-blue-light text-sm mb-1">Status</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[client?.status]}`}
              >
                {client?.status}
              </span>
            </Card>
            <Card>
              <p className="text-brand-blue-light text-sm mb-1">Dietplan</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${client?.has_dietplan ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {client?.has_dietplan ? "Active" : "Not active"}
              </span>
            </Card>
            <Card>
              <p className="text-brand-blue-light text-sm mb-1">
                Workout Sessions
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${client?.has_workout ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {client?.has_workout ? "Active" : "Not active"}
              </span>
            </Card>
            <Card>
              <p className="text-brand-blue-light text-sm mb-1">Premium</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${client?.has_premium ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              >
                {client?.has_premium ? "Active" : "Not active"}
              </span>
            </Card>
          </div>

          {!client?.has_dietplan && !client?.has_workout && (
            <Card className="mb-12 border-brand-orange border-2 text-center">
              <p className="text-brand-blue font-semibold mb-4">
                You don't have an active package yet — pick a Dietplan or
                Workout Sessions to get started.
              </p>
              <Button onClick={() => navigate("/plans")}>View Packages</Button>
            </Card>
          )}

          <h2 className="text-lg font-bold text-brand-blue mb-4">
            Upcoming Classes
          </h2>
          {bookings.length === 0 ? (
            <p className="text-brand-blue-light">No upcoming bookings yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bookings.map((booking) => {
                const session = booking.class_ref || booking.consultation_ref;
                return (
                  <Card key={booking._id}>
                    <h3 className="text-brand-blue font-bold text-sm mb-1">
                      {booking.class_ref
                        ? booking.class_ref.type
                        : "Consultation"}
                    </h3>
                    <p className="text-brand-blue-light text-xs mb-4">
                      {new Date(session?.datetime).toLocaleString()}
                    </p>
                    <Button
                      onClick={() =>
                        (window.location.href = `${import.meta.env.VITE_API_URL}/join/booking/${booking._id}`)
                      }
                    >
                      Join Class
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
