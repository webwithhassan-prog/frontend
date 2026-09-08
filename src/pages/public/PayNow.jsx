import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import CurrencySwitcher from "../../components/common/CurrencySwitcher";
import { useCurrency } from "../../context/CurrencyContext";

const emptyForm = {
  client_name: "",
  client_email: "",
  client_phone: "",
  description: "",
  amount: "",
};

const PayNow = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { currency, rates } = useCurrency();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // The amount the client types is in whichever currency they've picked —
  // convert it back to INR (the site's base/stored currency) before saving.
  const rate = rates[currency.code] || 1;
  const enteredAmount = Number(formData.amount) || 0;
  const amountInInr =
    currency.code === "INR" ? enteredAmount : enteredAmount / rate;
  const estimatedGbp = amountInInr * (rates.GBP || 0.0078);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/custom-invoices/self-serve", {
        ...formData,
        amount: Math.round(amountInInr * 100) / 100,
        currency_code: currency.code,
        amount_display: enteredAmount,
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Could not start checkout");
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-lg mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-brand-blue-light/10 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-brand-blue-light" size={26} />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-brand-blue mb-2">
            Make a Payment
          </h1>
          <p className="text-brand-blue/60 text-sm">
            Already spoke with us and agreed on an amount? Enter it below to
            pay securely — no account needed.
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <CurrencySwitcher />
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="client_name"
              placeholder="Your Name"
              value={formData.client_name}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
            />
            <input
              type="text"
              name="description"
              placeholder="What's this payment for? (e.g. 3-month dietplan)"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
            />
            <div>
              <input
                type="number"
                name="amount"
                placeholder={`Agreed Amount (${currency.symbol.trim()})`}
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
                className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
              />
              {enteredAmount > 0 && (
                <p className="text-brand-blue/50 text-xs mt-1.5 px-1">
                  You'll be charged{" "}
                  <span className="font-semibold text-brand-blue/70">
                    ≈ £{estimatedGbp.toFixed(2)} GBP
                  </span>{" "}
                  via Stripe (card payments are processed in GBP).
                </p>
              )}
            </div>
            <input
              type="email"
              name="client_email"
              placeholder="Email (optional — for your receipt)"
              value={formData.client_email}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
            />
            <input
              type="text"
              name="client_phone"
              placeholder="Phone (optional)"
              value={formData.client_phone}
              onChange={handleChange}
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Redirecting..." : "Proceed to Payment"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </section>
  );
};

export default PayNow;
