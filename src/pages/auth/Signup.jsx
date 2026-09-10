import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PhoneInput from "../../components/common/PhoneInput";
import { getErrorMessage } from "../../utils/errors";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, role, loading } = useAuth();
  const redirectingRef = useRef(false);

  useEffect(() => {
    if (!loading && role && !redirectingRef.current) {
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
      // Block the role-change effect above from racing this handler's own
      // navigation — otherwise it fires the instant login() updates auth
      // state, flashing the dashboard before an async checkout redirect
      // gets a chance to run.
      redirectingRef.current = true;
      login(res.data.token, res.data.role, res.data.client_id);

      // Resume a pending package checkout, if any
      const pendingPlanIdsRaw = localStorage.getItem("pending_plan_ids");
      const pendingCouponCode = localStorage.getItem("pending_coupon_code");

      if (pendingPlanIdsRaw) {
        const pendingPlanIds = JSON.parse(pendingPlanIdsRaw);
        localStorage.removeItem("pending_plan_ids");
        localStorage.removeItem("pending_coupon_code");

        if (pendingPlanIds.length > 0) {
          try {
            const checkoutRes = await api.post("/payments/stripe/checkout", {
              client_id: res.data.client_id,
              plan_ids: pendingPlanIds,
              coupon_code: pendingCouponCode || undefined,
              currency_code: localStorage.getItem("selected_currency") || "INR",
            });
            window.location.href = checkoutRes.data.url;
            return;
          } catch (checkoutErr) {
            toast.error(
              getErrorMessage(
                checkoutErr,
                "Your account was created, but we couldn't start checkout for your package",
              ),
            );
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
              currency_code: localStorage.getItem("selected_currency") || "INR",
            },
          );
          window.location.href = ebookCheckoutRes.data.url;
          return;
        } catch (checkoutErr) {
          toast.error(
            getErrorMessage(
              checkoutErr,
              "Your account was created, but we couldn't start checkout for your e-book",
            ),
          );
        }
      }

      // Resume a pending course checkout, if any
      const pendingCourseId = localStorage.getItem("pending_course_id");
      if (pendingCourseId) {
        localStorage.removeItem("pending_course_id");
        try {
          const courseCheckoutRes = await api.post(
            "/payments/stripe/course-checkout",
            {
              client_id: res.data.client_id,
              course_id: pendingCourseId,
              currency_code: localStorage.getItem("selected_currency") || "INR",
            },
          );
          window.location.href = courseCheckoutRes.data.url;
          return;
        } catch (checkoutErr) {
          toast.error(
            getErrorMessage(
              checkoutErr,
              "Your account was created, but we couldn't start checkout for your course",
            ),
          );
        }
      }

      navigate("/client");
    } catch (err) {
      const msg = getErrorMessage(err, "Signup failed");
      setError(msg);
      toast.error(msg);
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
          <PhoneInput
            value={formData.phone_number}
            onChange={(v) => setFormData({ ...formData, phone_number: v })}
            required
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-blue/40 hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-brand-blue/70 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-brand-orange font-semibold rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange">
            Login
          </a>
        </p>
      </Card>
    </section>
  );
};

export default Signup;
