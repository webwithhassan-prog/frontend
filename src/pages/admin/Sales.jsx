import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const categories = ["plan", "consultation", "package"];

const Sales = () => {
  const [summary, setSummary] = useState({ daily_total: 0, monthly_total: 0 });
  const [category, setCategory] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await api.get("/sales/summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await api.get("/sales/search", {
        params: category ? { category } : {},
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Sales & Reporting
      </motion.h1>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <p className="text-brand-blue-light text-sm mb-1">Today's Sales</p>
          <p className="text-3xl font-bold text-brand-blue">
            {loading ? "—" : `Rs ${summary.daily_total.toLocaleString()}`}
          </p>
        </Card>
        <Card>
          <p className="text-brand-blue-light text-sm mb-1">
            This Month's Sales
          </p>
          <p className="text-3xl font-bold text-brand-blue">
            {loading ? "—" : `Rs ${summary.monthly_total.toLocaleString()}`}
          </p>
        </Card>
      </div>

      {/* Category Search (30-day retained log) */}
      <h2 className="text-lg font-bold text-brand-blue mb-4">
        Search Sales by Category (last 30 days)
      </h2>
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange capitalize"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
          <Button onClick={handleSearch}>
            <span className="flex items-center gap-2">
              <Search size={16} /> Search
            </span>
          </Button>
        </div>
      </Card>

      {searching && <p className="text-brand-blue-light">Searching...</p>}

      {searchResults && !searching && (
        <Card className="overflow-x-auto">
          <p className="text-brand-blue font-semibold mb-4">
            Total: Rs {searchResults.total.toLocaleString()} (
            {searchResults.count} entries)
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-brand-blue border-b border-brand-blue-pale">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.logs.map((log) => (
                <motion.tr
                  key={log._id}
                  className="border-b border-brand-blue-pale/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="py-3 px-2 text-brand-blue-light">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-brand-blue-light capitalize">
                    {log.category}
                  </td>
                  <td className="py-3 px-2 text-brand-blue font-medium">
                    Rs {log.amount.toLocaleString()}
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

export default Sales;
