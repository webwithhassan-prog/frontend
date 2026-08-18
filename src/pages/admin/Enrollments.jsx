import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const statusColors = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  expired: "bg-red-100 text-red-700",
};

const Enrollments = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendDays, setExtendDays] = useState({});

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleFreeze = async (id) => {
    await api.put(`/clients/${id}/freeze`);
    fetchClients();
  };

  const handleResume = async (id) => {
    await api.put(`/clients/${id}/resume`);
    fetchClients();
  };

  const handleExtend = async (id) => {
    const days = Number(extendDays[id] || 0);
    if (!days) return;
    await api.put(`/clients/${id}/extend`, { days });
    setExtendDays({ ...extendDays, [id]: "" });
    fetchClients();
  };

  const handleTogglePackage = async (client, field) => {
    await api.put(`/clients/${client._id}/packages`, {
      has_dietplan:
        field === "has_dietplan" ? !client.has_dietplan : client.has_dietplan,
      has_workout:
        field === "has_workout" ? !client.has_workout : client.has_workout,
      has_premium:
        field === "has_premium" ? !client.has_premium : client.has_premium,
    });
    fetchClients();
  };

  const handleDeliverDietPlan = async (id) => {
    try {
      await api.put(`/clients/${id}/deliver-dietplan`);
      fetchClients();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to mark diet plan delivered",
      );
    }
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Enrollments
      </motion.h1>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Phone</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Days Remaining</th>
                <th className="py-3 px-2">Packages</th>
                <th className="py-3 px-2">Diet Plans</th>
                <th className="py-3 px-2">Premium Sessions</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <motion.tr
                  key={client._id}
                  className="border-b border-brand-blue-pale/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="py-3 px-2 font-medium text-brand-blue">
                    {client.name}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {client.phone_number}
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[client.status]}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light">
                    {client.days_remaining}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col gap-1 text-xs">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={client.has_dietplan}
                          onChange={() =>
                            handleTogglePackage(client, "has_dietplan")
                          }
                          className="accent-brand-orange"
                        />
                        Dietplan
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={client.has_workout}
                          onChange={() =>
                            handleTogglePackage(client, "has_workout")
                          }
                          className="accent-brand-orange"
                        />
                        Workout
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={client.has_premium}
                          onChange={() =>
                            handleTogglePackage(client, "has_premium")
                          }
                          className="accent-brand-orange"
                        />
                        Premium
                      </label>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    {client.has_dietplan ? (
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-xs text-brand-blue-light">
                          {client.diet_plans_used} of {client.diet_plans_total}{" "}
                          used
                        </span>
                        <button
                          onClick={() => handleDeliverDietPlan(client._id)}
                          disabled={
                            client.diet_plans_used >= client.diet_plans_total
                          }
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Deliver Diet Plan
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-brand-blue-light/50">
                        —
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    {client.has_premium ? (
                      <span className="text-xs text-brand-blue-light">
                        {client.premium_sessions_used} of{" "}
                        {client.premium_sessions_total} used
                      </span>
                    ) : (
                      <span className="text-xs text-brand-blue-light/50">
                        —
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {client.status === "active" ? (
                        <button
                          onClick={() => handleFreeze(client._id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                        >
                          Freeze
                        </button>
                      ) : (
                        <button
                          onClick={() => handleResume(client._id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          Resume
                        </button>
                      )}

                      <input
                        type="number"
                        placeholder="Days"
                        value={extendDays[client._id] || ""}
                        onChange={(e) =>
                          setExtendDays({
                            ...extendDays,
                            [client._id]: e.target.value,
                          })
                        }
                        className="w-16 border border-brand-blue-pale rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <Button onClick={() => handleExtend(client._id)}>
                        Extend
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default Enrollments;
