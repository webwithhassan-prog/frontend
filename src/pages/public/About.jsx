import { motion } from "framer-motion";

const About = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <motion.h1
        className="font-display text-3xl md:text-4xl text-brand-blue mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to FITNESSZONE OFFICIAL LIMITED
      </motion.h1>
      <p className="font-display text-brand-orange text-sm md:text-base tracking-wide mb-10">
        Empowering Women's Health Through Natural Nutrition &amp; Movement
      </p>

      <div className="space-y-10 text-brand-blue/80 text-sm md:text-base leading-relaxed">
        <div className="space-y-4">
          <p>
            Since 2023, FITNESSZONE OFFICIAL LIMITED has been dedicated to
            helping women take control of their health and well-being. We
            specialize in addressing root-cause health challenges brought on
            by modern, sedentary lifestyles — including PCOS/PCOD, Thyroid
            imbalances, Fertility challenges, Insulin Resistance, Type-2
            Diabetes, and other metabolic conditions.
          </p>
          <p>
            We believe that managing hormonal and lifestyle disorders
            shouldn't require harsh starvation diets, shortcuts, or long
            lists of supplements. True, sustainable healing begins right in
            your kitchen and through consistent movement.
          </p>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-xl md:text-2xl mb-5">
            What We Offer
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-brand-blue mb-1">
                100% Natural &amp; Fully Customized Diet Plans
              </h3>
              <p>
                No powders, pills, or artificial products — ever. We design
                sustainable nutrition plans based entirely on real, whole
                foods. We cater to every cuisine, dietary preference, and
                cultural background, ensuring your meal plan is enjoyable,
                effective, and easy to follow.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-blue mb-1">
                Interactive Live Workout Sessions
              </h3>
              <p>
                Stay active, energized, and accountable from the comfort of
                your home with our guided, live workout sessions tailored to
                fit varying fitness levels and health conditions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-blue mb-1">
                Targeted Hormonal &amp; Metabolic Care
              </h3>
              <p>
                We focus on internal balance and root-cause healing rather
                than just quick weight loss, helping you rebuild your
                energy, balance your hormones, and restore your confidence.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-brand-blue text-xl md:text-2xl mb-4">
            Our Philosophy
          </h2>
          <blockquote className="border-l-4 border-brand-orange pl-5 italic text-brand-blue mb-4">
            "No supplements, no shortcuts — just real food, structured
            movement, and lasting results."
          </blockquote>
          <p>
            Every woman's body is unique. Our mission is to guide you toward
            a healthier, disease-free lifestyle through a personalized
            approach that seamlessly integrates into your daily routine
            without feeling like a burden.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
