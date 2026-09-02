import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, role, loading } = useAuth();

  useEffect(() => {
    if (!loading && role) {
      navigate(role === "admin" ? "/admin/dashboard" : "/client", {
        replace: true,
      });
    }
  }, [loading, role, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        formData,
      );
      login(res.data.token, res.data.role, res.data.client_id);

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
        const pendingConsultantId =
          localStorage.getItem("pending_consultation_consultant_id") || null;
        localStorage.removeItem("pending_consultation_specialty");
        localStorage.removeItem("pending_consultation_time");
        localStorage.removeItem("pending_consultation_consultant_id");

        try {
          await api.post("/consultation-requests", {
            client_id: res.data.client_id,
            specialty: pendingSpecialty,
            consultant_id: pendingConsultantId,
            preferred_time: pendingTime,
          });
        } catch (requestErr) {
          // If it fails, just continue to profile — client can resubmit from there
        }
      }

      navigate("/client");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  if (loading || role) return null;

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <motion.h1
        className="font-display text-3xl text-brand-blue text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        CREATE YOUR ACCOUNT
      </motion.h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-brand-blue/70 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-brand-orange font-semibold">
            Login
          </a>
        </p>
      </Card>
    </section>
  );
};

export default Signup;
