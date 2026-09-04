import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Ban, ShieldCheck, Trash2, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const phone = (c.phone_number || "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [clients, searchQuery]);

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
    try {
      await api.put(`/clients/${id}/freeze`);
      toast.success("Client frozen");
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to freeze client");
    }
  };

  const handleResume = async (id) => {
    try {
      await api.put(`/clients/${id}/resume`);
      toast.success("Client resumed");
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resume client");
    }
  };

  const handleExtend = async (id) => {
    const days = Number(extendDays[id] || 0);
    if (!days) return;
    try {
      await api.put(`/clients/${id}/extend`, { days });
      toast.success(`Extended by ${days} day(s)`);
      setExtendDays({ ...extendDays, [id]: "" });
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to extend access");
    }
  };

  const handleBan = async (client) => {
    setOpenMenuId(null);
    const reason = window.prompt(
      `Ban ${client.name}? They'll be logged out and blocked from logging back in.\n\nReason (optional):`,
    );
    if (reason === null) return; // cancelled
    try {
      await api.put(`/clients/${client._id}/ban`, {
        reason: reason || undefined,
      });
      toast.success(`${client.name} banned`);
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to ban client");
    }
  };

  const handleUnban = async (id) => {
    setOpenMenuId(null);
    try {
      await api.put(`/clients/${id}/unban`);
      toast.success("Client unbanned");
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to unban client");
    }
  };

  const handleDelete = async (client) => {
    setOpenMenuId(null);
    const confirmed = window.confirm(
      `Permanently delete ${client.name}? This removes their account and login for good — this can't be undone.`,
    );
    if (!confirmed) return;
    try {
      await api.delete(`/clients/${client._id}`);
      toast.success(`${client.name} deleted`);
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete client");
    }
  };

  const handleTogglePackage = async (client, field) => {
    try {
      await api.put(`/clients/${client._id}/packages`, {
        has_dietplan:
          field === "has_dietplan"
            ? !client.has_dietplan
            : client.has_dietplan,
        has_workout:
          field === "has_workout" ? !client.has_workout : client.has_workout,
        has_premium:
          field === "has_premium"
            ? !client.has_premium
            : client.has_premium,
      });
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update package");
    }
  };

  const handleDeliverDietPlan = async (id) => {
    try {
      await api.put(`/clients/${id}/deliver-dietplan`);
      toast.success("Diet plan delivered");
      fetchClients();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to mark diet plan delivered",
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Enrollments
        </motion.h1>

        <div className="relative w-full sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue-light"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full border border-brand-blue-pale rounded-full pl-10 pr-9 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-blue-light hover:text-brand-blue"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-brand-blue-light">Loading...</p>
      ) : filteredClients.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          {searchQuery
            ? `No clients found matching "${searchQuery}".`
            : "No clients enrolled yet."}
        </p>
      ) : (
        <>
          {searchQuery && (
            <p className="text-brand-blue-light text-xs mb-3">
              {filteredClients.length} of {clients.length} clients match
            </p>
          )}
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
              {filteredClients.map((client) => (
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
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[client.status]}`}
                      >
                        {client.status}
                      </span>
                      {client.banned && (
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-white"
                          title={client.ban_reason || ""}
                        >
                          BANNED
                        </span>
                      )}
                    </div>
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
                    <div className="flex items-center gap-2 flex-nowrap">
                      {client.status === "active" ? (
                        <button
                          onClick={() => handleFreeze(client._id)}
                          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                        >
                          Freeze
                        </button>
                      ) : (
                        <button
                          onClick={() => handleResume(client._id)}
                          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
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
                        className="w-14 shrink-0 border border-brand-blue-pale rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
                      />
                      <Button size="sm" onClick={() => handleExtend(client._id)}>
                        Extend
                      </Button>

                      <div className="relative shrink-0 ml-auto">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === client._id ? null : client._id,
                            )
                          }
                          title="More actions"
                          className="w-7 h-7 flex items-center justify-center rounded-full text-brand-blue-light hover:bg-brand-blue-pale transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>

                        <AnimatePresence>
                          {openMenuId === client._id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-brand-blue-pale py-1.5 z-20"
                              >
                                {client.banned ? (
                                  <button
                                    onClick={() => handleUnban(client._id)}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-brand-blue hover:bg-brand-blue-pale transition-colors"
                                  >
                                    <ShieldCheck size={14} /> Unban
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBan(client)}
                                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-brand-blue hover:bg-brand-blue-pale transition-colors"
                                  >
                                    <Ban size={14} /> Ban
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(client)}
                                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </Card>
        </>
      )}
    </div>
  );
};

export default Enrollments;
