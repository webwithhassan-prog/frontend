import { motion } from "framer-motion";
import {
  Star,
  ArrowRight,
  Stethoscope,
  Heart,
  Brain,
  Apple,
  CalendarDays,
  Users,
  TrendingUp,
  Headset,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import TestimonialsSlider from "../../components/common/TestimonialsSlider";
import AchievementMarquee from "../../components/common/AchievementMarquee";

const pillars = [
  {
    label: "Dietplan",
    title: "Customized Dietplans",
    desc: "Home-based menus built around your body, your food, your life — tracked daily, adjusted weekly.",
  },
  {
    label: "Live Sessions",
    title: "Live Workout Sessions",
    desc: "50–55 minutes, six days a week, a different workout every day — led by female trainers, recorded for you.",
  },
  {
    label: "Premium",
    title: "One-on-One Consultations",
    desc: "Direct access to a dietician, gynecologist, or psychiatrist — the questions you don\u2019t ask in group chat.",
  },
];

const stats = [
  { icon: CalendarDays, value: "3+", label: "Years Running" },
  { icon: Users, value: "50,000+", label: "Clients Served" },
  { icon: TrendingUp, value: "10,000+", label: "Success Stories" },
  { icon: Headset, value: "24/7", label: "Support" },
];

const specialists = [
  {
    icon: Apple,
    title: "Dietician",
    desc: "Personalized nutrition guidance beyond the standard plan — allergies, conditions, real-life eating habits.",
  },
  {
    icon: Heart,
    title: "Gynecologist",
    desc: "Private, judgment-free conversations about women's health — from a real professional, on your schedule.",
  },
  {
    icon: Brain,
    title: "Psychiatrist",
    desc: "Mental health support that fits around your week, without the wait time of a walk-in clinic.",
  },
];

const demoVideos = [
  { id: "vtxAyruLOX4", title: "Session Demo" },
  { id: "1bze7Y6_UaM", title: "Session Demo" },
  { id: "qpBVpOgzB1w", title: "Session Demo" },
];

const steps = [
  {
    n: "01",
    title: "Choose your path",
    desc: "Pick a Dietplan, Live Sessions, or both. Add Premium if you want a professional in your corner.",
  },
  {
    n: "02",
    title: "Get matched & scheduled",
    desc: "We assign your trainer or consultant and set your timetable around your week, not the other way round.",
  },
  {
    n: "03",
    title: "Show up live",
    desc: "Join from your dashboard — no links to hunt for, no groups to scroll through.",
  },
];

const Home = () => {
  return (
    <div className="overflow-hidden">
      <AchievementMarquee />
      {/* Hero */}
      <section className="relative bg-white">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p
              className="font-display text-brand-orange text-xs tracking-[0.2em] mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              FITNESS ZONE — FOR WOMEN
            </motion.p>

            <motion.h1
              className="font-display text-4xl md:text-5xl text-brand-blue leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              BUILT FOR WOMEN.
              <br />
              NOT ADAPTED TO THEM.
            </motion.h1>

            <motion.p
              className="text-brand-blue/70 max-w-md mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Dietplans, live workouts, and one-on-one consultations — one
              platform, no WhatsApp groups, no missed links.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button onClick={() => (window.location.href = "/plans")}>
                Explore Packages
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = "/timetable")}
              >
                <span className="flex items-center gap-2">
                  How it works <ArrowRight size={16} />
                </span>
              </Button>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div>
                <p className="font-display text-brand-blue text-lg">
                  50,000+
                </p>
                <p className="text-brand-blue/50 text-xs">Clients Served</p>
              </div>
              <div className="w-px h-8 bg-brand-blue-pale" />
              <div>
                <p className="font-display text-brand-blue text-lg">
                  10,000+
                </p>
                <p className="text-brand-blue/50 text-xs">Success Stories</p>
              </div>
              <div className="w-px h-8 bg-brand-blue-pale" />
              <div className="flex items-center gap-1">
                <Star size={16} fill="#FFC93C" color="#FFC93C" />
                <span className="font-display text-brand-blue text-lg">
                  3+ yrs
                </span>
              </div>
            </motion.div>
          </div>

          {/* Signature ascent-line graphic */}
          <div className="relative">
            <svg
              viewBox="0 0 780 400"
              className="w-full h-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M40,340 Q140,260 240,260 Q340,260 340,170 Q440,80 640,90 Q700,95 738,52"
                stroke="#2B5FE2"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />

              <motion.circle
                cx="240"
                cy="260"
                r="9"
                fill="#F76B1C"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4, type: "spring" }}
              />
              <motion.circle
                cx="440"
                cy="120"
                r="9"
                fill="#F76B1C"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.1, duration: 0.4, type: "spring" }}
              />
              <motion.circle
                cx="640"
                cy="90"
                r="9"
                fill="#F76B1C"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
              />

              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5, type: "spring" }}
              >
                <circle cx="738" cy="52" r="22" fill="#FFC93C" opacity="0.15" />
                <foreignObject x="722" y="36" width="32" height="32">
                  <Star size={32} fill="#FFC93C" color="#FFC93C" />
                </foreignObject>
              </motion.g>
            </svg>

            <div className="absolute inset-0 pointer-events-none">
              <motion.span
                className="absolute font-display text-[10px] text-brand-blue tracking-wide"
                style={{ left: "24%", top: "68%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                DIETPLAN
              </motion.span>
              <motion.span
                className="absolute font-display text-[10px] text-brand-blue tracking-wide"
                style={{ left: "52%", top: "25%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                LIVE SESSIONS
              </motion.span>
              <motion.span
                className="absolute font-display text-[10px] text-brand-blue tracking-wide"
                style={{ left: "76%", top: "15%" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                PREMIUM
              </motion.span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-blue">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <stat.icon className="mx-auto text-brand-orange mb-2" size={22} />
              <p className="font-display text-2xl md:text-3xl text-brand-orange mb-1">
                {stat.value}
              </p>
              <p className="text-white/70 text-xs md:text-sm tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <span className="font-display text-brand-orange text-[10px] tracking-[0.15em]">
                  {pillar.label.toUpperCase()}
                </span>
                <h3 className="font-display text-brand-blue text-lg mt-2 mb-3">
                  {pillar.title}
                </h3>
                <p className="text-brand-blue/70 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Videos */}
      <section className="bg-brand-blue-pale py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            SEE A SESSION IN ACTION
          </motion.h2>
          <p className="text-brand-blue/70 text-center max-w-xl mx-auto mb-14">
            A few real moments from our live workouts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card>
                  <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-white">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}`}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="font-display text-brand-blue text-sm">
                    {video.title}
                  </h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* How it works — real sequence, numbers earn their place */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            HOW YOUR RISE WORKS
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <p className="font-display text-brand-orange text-3xl mb-3">
                  {step.n}
                </p>
                <h3 className="font-display text-brand-blue text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-brand-blue/70 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 1-on-1 Consultation — expanded */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex bg-brand-orange/10 rounded-full p-4 mb-5">
              <Stethoscope className="text-brand-orange" size={28} />
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-brand-blue mb-4">
              NEED TO TALK TO SOMEONE?
            </h2>
            <p className="text-brand-blue/70 leading-relaxed">
              Group classes cover a lot — but some questions need a private
              room. Book a 1-on-1 with a real professional, no package required,
              and no algorithm deciding who you get matched with.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {specialists.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full text-center">
                  <div className="inline-flex bg-brand-blue-pale rounded-full p-3 mb-4">
                    <s.icon className="text-brand-blue" size={22} />
                  </div>
                  <h3 className="font-display text-brand-blue text-base mb-2">
                    {s.title}
                  </h3>
                  <p className="text-brand-blue/70 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-brand-blue/60 text-sm">
              Tell us who you'd like to speak with and a time that works — we'll
              confirm the rest.
            </p>
            <Button onClick={() => (window.location.href = "/consultation")}>
              Book a Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-blue-pale py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            SUCCESS STORIES
          </motion.h2>
          <p className="text-brand-blue/70 text-center max-w-xl mx-auto mb-14">
            Real check-ins, real progress, from real members.
          </p>

          <TestimonialsSlider />

          <div className="text-center mt-10">
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/success-stories")}
            >
              View All Stories
            </Button>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-brand-blue py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Star
            size={28}
            fill="#FFC93C"
            color="#FFC93C"
            className="mx-auto mb-4"
          />
          <h2 className="font-display text-2xl md:text-3xl text-white mb-4">
            READY TO RISE?
          </h2>
          <p className="text-white/70 mb-8">
            Pick your package — Dietplan, Live Sessions, or both — and start
            this week.
          </p>
          <Button onClick={() => (window.location.href = "/plans")}>
            Explore Packages
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
