import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Ban,
  ShieldCheck,
  Trash2,
  MoreVertical,
  UserPlus,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import PhoneInput from "../../components/common/PhoneInput";
import { getErrorMessage } from "../../utils/errors";

const statusColors = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  expired: "bg-red-100 text-red-700",
};

const PAGE_SIZE = 15;

// Converts any ISO 3166-1 alpha-2 code (e.g. "PK") into its flag emoji via
// the Unicode regional indicator symbols — works for every country, not
// just a hardcoded shortlist.
const countryCodeToFlag = (code) =>
  code
    ?.toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));

const sortAccessors = {
  name: (c) => (c.name || "").toLowerCase(),
  status: (c) => (c.status || "").toLowerCase(),
  days_remaining: (c) => c.days_remaining ?? -Infinity,
};

const Enrollments = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [extendDays, setExtendDays] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [adding, setAdding] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState(null);
  // Bumped whenever addForm resets to empty, forcing PhoneInput to remount
  // back to its default country instead of keeping the last-picked one.
  const [phoneResetKey, setPhoneResetKey] = useState(0);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const phone = (c.phone_number || "").toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [clients, searchQuery]);

  const sortedClients = useMemo(() => {
    if (!sortField) return filteredClients;
    const accessor = sortAccessors[sortField];
    const sorted = [...filteredClients].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });
    if (sortDir === "desc") sorted.reverse();
    return sorted;
  }, [filteredClients, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedClients.length / PAGE_SIZE));
  const pagedClients = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedClients.slice(start, start + PAGE_SIZE);
  }, [sortedClients, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortField, sortDir]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const toggleSort = (field) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortField(null);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <ArrowUpDown size={12} className="text-brand-blue-light/50" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-brand-orange" />
    ) : (
      <ArrowDown size={12} className="text-brand-orange" />
    );
  };

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
      toast.error(getErrorMessage(err, "Failed to freeze client"));
    }
  };

  const handleResume = async (id) => {
    try {
      await api.put(`/clients/${id}/resume`);
      toast.success("Client resumed");
      fetchClients();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resume client"));
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
      toast.error(getErrorMessage(err, "Failed to extend access"));
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
      toast.error(getErrorMessage(err, "Failed to ban client"));
    }
  };

  const handleUnban = async (id) => {
    setOpenMenuId(null);
    try {
      await api.put(`/clients/${id}/unban`);
      toast.success("Client unbanned");
      fetchClients();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to unban client"));
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
      toast.error(getErrorMessage(err, "Failed to delete client"));
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
      });
      fetchClients();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update package"));
    }
  };

  const handleDeliverDietPlan = async (id) => {
    try {
      await api.put(`/clients/${id}/deliver-dietplan`);
      toast.success("Diet plan delivered");
      fetchClients();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to mark diet plan delivered"));
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.phone_number || !addForm.email) {
      toast.error("Name, phone number, and email are required");
      return;
    }
    setAdding(true);
    try {
      const res = await api.post("/clients", addForm);
      toast.success(`${addForm.name} added`);
      fetchClients();
      if (res.data.generated_password) {
        setGeneratedCreds({
          email: addForm.email,
          password: res.data.generated_password,
        });
      } else {
        setShowAddModal(false);
        setAddForm({ name: "", phone_number: "", email: "", password: "" });
        setPhoneResetKey((k) => k + 1);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to add client"));
    } finally {
      setAdding(false);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setGeneratedCreds(null);
    setAddForm({ name: "", phone_number: "", email: "", password: "" });
    setPhoneResetKey((k) => k + 1);
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

        <div className="flex items-center gap-3 flex-wrap">
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <UserPlus size={15} className="inline mr-1.5 -mt-0.5" />
          Add Client
        </Button>
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
      </div>

      {loading ? (
        <Loader />
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
                <th className="py-3 px-2">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
                  >
                    Name <SortIcon field="name" />
                  </button>
                </th>
                <th className="py-3 px-2">Phone</th>
                <th className="py-3 px-2">
                  <button
                    onClick={() => toggleSort("status")}
                    className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
                  >
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="py-3 px-2">
                  <button
                    onClick={() => toggleSort("days_remaining")}
                    className="flex items-center gap-1.5 hover:text-brand-orange transition-colors"
                  >
                    Days Remaining <SortIcon field="days_remaining" />
                  </button>
                </th>
                <th className="py-3 px-2">Packages</th>
                <th className="py-3 px-2">Diet Plans</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedClients.map((client) => (
                <motion.tr
                  key={client._id}
                  className="border-b border-brand-blue-pale/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="py-3 px-2 font-medium text-brand-blue">
                    <span className="inline-flex items-center gap-1.5">
                      {client.country_code && (
                        <span title={client.country}>
                          {countryCodeToFlag(client.country_code) || "🌍"}
                        </span>
                      )}
                      {client.name}
                    </span>
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

          {totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
              <p className="text-brand-blue-light text-xs">
                Page {page} of {totalPages} — {sortedClients.length} clients
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-blue-pale text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue-pale transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-blue-pale text-brand-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-blue-pale transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAddModal}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {generatedCreds ? (
                <>
                  <h2 className="text-lg font-bold text-brand-blue mb-2">
                    Client added
                  </h2>
                  <p className="text-sm text-brand-blue-light mb-4">
                    No password was set, so one was generated. Share these
                    login details with the client — this won't be shown
                    again.
                  </p>
                  <div className="bg-brand-blue-pale/40 rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-brand-blue-light">
                        Email
                      </span>
                      <span className="text-sm font-mono text-brand-blue">
                        {generatedCreds.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-brand-blue-light">
                        Password
                      </span>
                      <span className="flex items-center gap-2 text-sm font-mono text-brand-blue">
                        {generatedCreds.password}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              generatedCreds.password,
                            );
                            toast.success("Password copied");
                          }}
                          title="Copy password"
                          className="text-brand-blue-light hover:text-brand-orange"
                        >
                          <Copy size={14} />
                        </button>
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={closeAddModal}>
                    Done
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-brand-blue mb-4">
                    Add Client Manually
                  </h2>
                  <form onSubmit={handleAddClient} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={addForm.name}
                      onChange={(e) =>
                        setAddForm({ ...addForm, name: e.target.value })
                      }
                      className="w-full border border-brand-blue-pale rounded-lg px-3 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <PhoneInput
                      key={phoneResetKey}
                      value={addForm.phone_number}
                      onChange={(v) =>
                        setAddForm({ ...addForm, phone_number: v })
                      }
                      placeholder="Phone number"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={addForm.email}
                      onChange={(e) =>
                        setAddForm({ ...addForm, email: e.target.value })
                      }
                      className="w-full border border-brand-blue-pale rounded-lg px-3 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <input
                      type="text"
                      placeholder="Password (optional — auto-generated if blank)"
                      value={addForm.password}
                      onChange={(e) =>
                        setAddForm({ ...addForm, password: e.target.value })
                      }
                      className="w-full border border-brand-blue-pale rounded-lg px-3 py-2.5 text-sm text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <div className="flex items-center gap-3 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={closeAddModal}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" disabled={adding}>
                        {adding ? "Adding..." : "Add Client"}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Enrollments;
