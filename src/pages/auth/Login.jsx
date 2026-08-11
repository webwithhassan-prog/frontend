import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData,
      );
      login(res.data.token, res.data.role, res.data.client_id);

      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      // Resume a pending package checkout, if any
      const pendingPlanIdsRaw = localStorage.getItem("pending_plan_ids");
      const pendingIncludePremium =
        localStorage.getItem("pending_include_premium") === "true";

      if (pendingPlanIdsRaw) {
        const pendingPlanIds = JSON.parse(pendingPlanIdsRaw);
        localStorage.removeItem("pending_plan_ids");
        localStorage.removeItem("pending_include_premium");

        if (pendingPlanIds.length > 0) {
          try {
            const checkoutRes = await api.post("/payments/stripe/checkout", {
              client_id: res.data.client_id,
              plan_ids: pendingPlanIds,
              include_premium: pendingIncludePremium,
            });
            window.location.href = checkoutRes.data.url;
            return;
          } catch (checkoutErr) {
            // If checkout fails, fall through
          }
        }
      }

      // Resume a pending e-book checkout, if any
      const pendingEbookId = localStorage.getItem("pending_ebook_id");
      if (pendingEbookId) {
        localStorage.removeItem("pending_ebook_id");
        try {
          const ebookCheckoutRes = await api.post(
            "/payments/stripe/ebook-checkout",
            {
              client_id: res.data.client_id,
              ebook_id: pendingEbookId,
            },
          );
          window.location.href = ebookCheckoutRes.data.url;
          return;
        } catch (checkoutErr) {
          // If checkout fails, fall through
        }
      }

      // Resume a pending 1-on-1 consultation request, if any
      const pendingSpecialty = localStorage.getItem(
        "pending_consultation_specialty",
      );
      if (pendingSpecialty) {
        const pendingTime =
          localStorage.getItem("pending_consultation_time") || "";
        localStorage.removeItem("pending_consultation_specialty");
        localStorage.removeItem("pending_consultation_time");

        try {
          await api.post("/consultation-requests", {
            client_id: res.data.client_id,
            specialty: pendingSpecialty,
            preferred_time: pendingTime,
          });
        } catch (requestErr) {
          // If it fails, just continue to profile — client can resubmit from there
        }
      }

      navigate("/client");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <motion.h1
        className="font-display text-3xl text-brand-blue text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        WELCOME BACK
      </motion.h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-brand-orange font-semibold"
            >
              Forgot password?
            </a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-brand-blue/70 mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-brand-orange font-semibold">
            Sign up
          </a>
        </p>
      </Card>
    </section>
  );
};

export default Login;
