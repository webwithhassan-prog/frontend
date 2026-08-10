import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const specialties = ["dietician", "gynecologist", "psychiatrist"];

const Careers = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    specialty: "",
    cv_link: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/applications`,
        formData,
      );
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        CONSULT WITH FITNESS ZONE
      </motion.h1>
      <p className="text-brand-blue/70 text-center mb-10">
        Are you a dietician, gynecologist, or psychiatrist interested in
        offering online consultancy to our members? Apply below.
      </p>

      <Card>
        {submitted ? (
          <motion.p
            className="text-brand-blue font-semibold text-center py-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Thanks for applying! We'll review your application and get back to
            you.
          </motion.p>
        ) : (
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
              name="contact"
              placeholder="Phone or Email"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            >
              <option value="">Select Specialty</option>
              {specialties.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="cv_link"
              placeholder="CV Link (Google Drive, LinkedIn, etc.)"
              value={formData.cv_link}
              onChange={handleChange}
              required
              className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit">Submit Application</Button>
          </form>
        )}
      </Card>
    </section>
  );
};

export default Careers;
