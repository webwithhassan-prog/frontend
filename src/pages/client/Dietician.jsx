import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const emptyForm = {
  name: "",
  age: "",
  weight: "",
  height: "",
  goal: "",
  dietary_notes: "",
};

const Dietician = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [imageGenerated, setImageGenerated] = useState(false);
  const cardRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setImageGenerated(true);
  };

  const handleSaveImage = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `${formData.name || "dietician-details"}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setImageGenerated(false);
  };

  return (
    <div>
      <motion.h1
        className="text-2xl font-bold text-brand-blue mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dietician Details
      </motion.h1>
      <p className="text-brand-blue-light mb-8">
        Fill in your details below — nothing is saved on our servers. You'll get
        an image to send us directly on WhatsApp.
      </p>

      <AnimatePresence mode="wait">
        {!imageGenerated ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="max-w-xl">
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
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <input
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>
                <input
                  type="text"
                  name="goal"
                  placeholder="Goal (e.g. Weight loss, Muscle gain)"
                  value={formData.goal}
                  onChange={handleChange}
                  required
                  className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <textarea
                  name="dietary_notes"
                  placeholder="Dietary notes / allergies / preferences"
                  value={formData.dietary_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <Button type="submit" className="w-full">
                  Generate Image
                </Button>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div
              ref={cardRef}
              className="max-w-xl bg-white border-2 border-brand-blue rounded-2xl p-8"
            >
              <h2 className="text-brand-blue font-bold text-xl mb-4">
                Dietician Details
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-brand-blue-light">Name:</span>{" "}
                  <span className="text-brand-blue font-medium">
                    {formData.name}
                  </span>
                </p>
                <p>
                  <span className="text-brand-blue-light">Age:</span>{" "}
                  <span className="text-brand-blue font-medium">
                    {formData.age}
                  </span>
                </p>
                <p>
                  <span className="text-brand-blue-light">Weight:</span>{" "}
                  <span className="text-brand-blue font-medium">
                    {formData.weight} kg
                  </span>
                </p>
                <p>
                  <span className="text-brand-blue-light">Height:</span>{" "}
                  <span className="text-brand-blue font-medium">
                    {formData.height} cm
                  </span>
                </p>
                <p>
                  <span className="text-brand-blue-light">Goal:</span>{" "}
                  <span className="text-brand-blue font-medium">
                    {formData.goal}
                  </span>
                </p>
                {formData.dietary_notes && (
                  <p>
                    <span className="text-brand-blue-light">Notes:</span>{" "}
                    <span className="text-brand-blue font-medium">
                      {formData.dietary_notes}
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-6 text-xs text-brand-orange font-semibold">
                FitFemme • Dietician Intake
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleSaveImage}>Save Image</Button>
              <button
                onClick={handleReset}
                className="text-sm font-semibold text-brand-blue-light hover:text-brand-blue"
              >
                Start Over
              </button>
            </div>

            <motion.p
              className="text-brand-blue-light text-sm mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Send this image to us on WhatsApp to get your diet plan.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dietician;
