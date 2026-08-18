import { motion } from "framer-motion";
import { Star, Home, ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";

const NotFound = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white px-6">
      {/* Background ascent line, echoing the homepage signature */}
      <svg
        viewBox="0 0 780 400"
        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M-40,380 Q140,300 240,300 Q340,300 340,200 Q440,100 640,110 Q740,115 820,60"
          stroke="#2B5FE2"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      <div className="relative max-w-lg mx-auto text-center">
        {/* Big wobbling 404 with a star replacing the middle 0 */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="font-display text-7xl md:text-8xl text-brand-blue"
            animate={{ rotate: [0, -4, 4, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            4
          </motion.span>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            className="relative"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Star
                size={64}
                fill="#FFC93C"
                color="#FFC93C"
                className="md:w-20 md:h-20"
              />
            </motion.div>
          </motion.div>

          <motion.span
            className="font-display text-7xl md:text-8xl text-brand-blue"
            animate={{ rotate: [0, 4, -4, 2, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          >
            4
          </motion.span>
        </motion.div>

        <motion.p
          className="font-display text-brand-orange text-xs tracking-[0.2em] mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          OFF THE PATH
        </motion.p>

        <motion.h1
          className="font-display text-2xl md:text-3xl text-brand-blue mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          THIS PAGE SKIPPED LEG DAY.
        </motion.h1>

        <motion.p
          className="text-brand-blue/70 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          It's not here — but your Dietplan, live sessions, and consultations
          are. Let's get you back on track.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button onClick={() => (window.location.href = "/")}>
            <span className="flex items-center gap-2">
              <Home size={16} /> Back Home
            </span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = "/plans")}
          >
            <span className="flex items-center gap-2">
              Explore Packages <ArrowRight size={16} />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default NotFound;
