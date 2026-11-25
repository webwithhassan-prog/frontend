import { useEffect, useState } from "react";
import { Coins, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Card from "../common/Card";
import Button from "../common/Button";
import { getErrorMessage } from "../../utils/errors";

// Admin → Settings: which currencies visitors can pick in the price
// dropdown, each with the country it's for. Any currency the exchange-rate
// feed covers can be added; INR (the price base) always stays.
const CurrencySettings = () => {
  const [list, setList] = useState([]);
  const [available, setAvailable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    api
      .get("/currency/admin")
      .then((res) => {
        setList(res.data.currencies);
        setAvailable(res.data.available);
      })
      .catch((err) => toast.error(getErrorMessage(err, "Couldn't load currencies")))
      .finally(() => setLoading(false));
  }, []);

  const change = (next) => {
    setList(next);
    setDirty(true);
  };

  const addCurrency = (e) => {
    e.preventDefault();
    const code = newCode.trim().toUpperCase();
    if (!code) return;
    if (list.some((c) => c.code === code)) {
      toast.error(`${code} is already in the list`);
      return;
    }
    if (!available.includes(code)) {
      toast.error(`${code} isn't a currency we have exchange rates for`);
      return;
    }
    change([...list, { code, label: newLabel.trim() }].sort((a, b) => a.code.localeCompare(b.code)));
    setNewCode("");
    setNewLabel("");
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put("/currency/admin", { currencies: list });
      setList(res.data.currencies);
      setDirty(false);
      toast.success("Currencies saved — the price dropdown is updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't save currencies"));
    } finally {
      setSaving(false);
    }
  };

  const unused = available.filter((code) => !list.some((c) => c.code === code));

  return (
    <Card className="lg:col-span-2">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-full bg-brand-blue-light/10 flex items-center justify-center shrink-0">
          <Coins className="text-brand-blue-light" size={16} />
        </div>
        <div>
          <p className="text-brand-blue text-sm font-semibold">Currencies</p>
          <p className="text-brand-blue/60 text-xs">
            The currencies visitors can pick for prices. Add a country name so
            they find it, e.g. "Malaysia".
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-brand-blue/60">Loading…</p>
      ) : (
        <>
          <ul className="divide-y divide-brand-blue-pale border border-brand-blue-pale rounded-xl mb-4">
            {list.map((c, i) => (
              <li key={c.code} className="flex items-center gap-3 px-3 py-2">
                <span className="w-12 font-semibold text-brand-blue text-sm">{c.code}</span>
                <label className="sr-only" htmlFor={`cur-label-${c.code}`}>
                  Country for {c.code}
                </label>
                <input
                  id={`cur-label-${c.code}`}
                  value={c.label}
                  onChange={(e) =>
                    change(list.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                  }
                  placeholder="Country, e.g. Malaysia"
                  className="flex-1 min-w-0 border border-brand-blue-pale rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                {c.code === "INR" ? (
                  <span className="text-xs text-brand-blue/40 w-8 text-center" title="Prices are set in rupees">
                    base
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => change(list.filter((_, j) => j !== i))}
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                    aria-label={`Remove ${c.code}`}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <form onSubmit={addCurrency} className="flex flex-wrap items-end gap-2 mb-5">
            <div>
              <label htmlFor="new-cur-code" className="block text-xs font-medium text-brand-blue mb-1">
                Add currency
              </label>
              <input
                id="new-cur-code"
                list="currency-codes"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. SGD"
                maxLength={3}
                className="w-28 uppercase border border-brand-blue-pale rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <datalist id="currency-codes">
                {unused.map((code) => (
                  <option key={code} value={code} />
                ))}
              </datalist>
            </div>
            <div className="flex-1 min-w-[10rem]">
              <label htmlFor="new-cur-label" className="block text-xs font-medium text-brand-blue mb-1">
                Country
              </label>
              <input
                id="new-cur-label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g. Singapore"
                className="w-full border border-brand-blue-pale rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            <Button type="submit" size="sm" variant="secondary" className="inline-flex items-center gap-1.5">
              <Plus size={14} /> Add
            </Button>
          </form>

          <Button onClick={save} disabled={!dirty || saving}>
            {saving ? "Saving…" : dirty ? "Save currencies" : "Saved"}
          </Button>
        </>
      )}
    </Card>
  );
};

export default CurrencySettings;
