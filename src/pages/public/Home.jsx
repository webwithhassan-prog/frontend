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
import InstagramReelsSlider from "../../components/common/InstagramReelsSlider";
import AchievementMarquee from "../../components/common/AchievementMarquee";
import heroBanner from "../../assets/cleanBanner.jpeg";

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
      <section className="relative bg-white overflow-hidden">
        <motion.div
          className="relative w-full h-[620px] sm:h-[560px] md:h-[560px] lg:h-[640px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={heroBanner}
            alt="Fitness Zone — built for women, not adapted to them"
            className="absolute inset-0 w-full h-full object-cover object-[68%_center]"
          />

          {/* Scrim behind the text only — reaches further on narrow screens where the
              text column takes up more of the width, and tucks in tighter on desktop
              so the model stays clear. */}
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 55%, rgba(255,255,255,0) 88%)",
            }}
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 28%, rgba(255,255,255,0) 52%)",
            }}
          />

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-6xl mx-auto px-6 w-full">
              <div className="max-w-[230px] sm:max-w-sm md:max-w-lg">
                <motion.p
                  className="font-display text-brand-orange text-xs tracking-[0.2em] mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  A GLOBAL PLATFORM
                </motion.p>

                <motion.h1
                  className="font-display text-3xl sm:text-4xl md:text-5xl text-brand-blue leading-[1.1] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  FITNESSZONE OFFICIAL LTD.
                  <br />
                  ONE STOP WELLNESS HUB
                </motion.h1>

                <motion.p
                  className="text-brand-blue/70 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Dietplans, live workouts, and one-on-one consultations — one
                  platform, no missed links.
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
              </div>
            </div>
          </div>
        </motion.div>
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
      {/* Transformations */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            REAL TRANSFORMATIONS
          </motion.h2>
          <p className="text-brand-blue/70 text-center max-w-xl mx-auto mb-14">
            Straight from Instagram — real members, real results.
          </p>

          <InstagramReelsSlider />
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
      <section className="bg-brand-blue py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="font-display text-2xl md:text-3xl text-white text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            SEE A SESSION IN ACTION
          </motion.h2>
          <p className="text-white/80 text-center max-w-xl mx-auto mb-14">
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
            How it works?
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
      <section className="bg-brand-blue py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="font-display text-2xl md:text-3xl text-white text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            SUCCESS STORIES
          </motion.h2>
          <p className="text-white/80 text-center max-w-xl mx-auto mb-14">
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
            Ready to Transform
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
