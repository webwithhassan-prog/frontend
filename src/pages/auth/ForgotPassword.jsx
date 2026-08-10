import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email },
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <motion.h1
        className="font-display text-3xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        FORGOT PASSWORD
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-brand-blue text-sm">{message}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Card>
    </section>
  );
};

export default ForgotPassword;
