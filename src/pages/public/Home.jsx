import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  Salad,
  Dumbbell,
  Route,
  CalendarCheck,
  Video,
  ChevronDown,
  Activity,
  Briefcase,
  Clock,
  Wallet,
  UserRound,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import TestimonialsSlider from "../../components/common/TestimonialsSlider";
// import InstagramReelsSlider from "../../components/common/InstagramReelsSlider";
import AchievementMarquee from "../../components/common/AchievementMarquee";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import heroBanner from "../../assets/cleanBanner.jpeg";

const pillars = [
  {
    icon: Salad,
    label: "Dietplan",
    title: "Customized Dietplans",
    desc: "Home-based menus built around your body, your food, your life — tracked daily, adjusted weekly.",
  },
  {
    icon: Dumbbell,
    label: "Live Sessions",
    title: "Live Workout Sessions",
    desc: "50–55 minutes, six days a week, a different workout every day — led by female trainers. (recordings are also available)",
  },
  {
    icon: Stethoscope,
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

const consultationSpecialties = [
  { value: "dietician", label: "Dietician", icon: Apple },
  { value: "gynecologist", label: "Gynecologist", icon: Heart },
  { value: "psychiatrist", label: "Psychiatrist", icon: Brain },
  { value: "physiotherapist", label: "Physiotherapist", icon: Activity },
  { value: "personal_trainer", label: "Fitness Trainer", icon: Dumbbell },
];

const demoVideos = [
  { id: "vtxAyruLOX4", title: "Session Demo" },
  { id: "1bze7Y6_UaM", title: "Session Demo" },
  { id: "qpBVpOgzB1w", title: "Session Demo" },
];

const steps = [
  {
    icon: Route,
    n: "01",
    title: "Choose your path",
    desc: "Pick a Dietplan, Live Sessions, or both. Add Premium if you want a professional in your corner.",
  },
  {
    icon: CalendarCheck,
    n: "02",
    title: "Get matched & scheduled",
    desc: "We assign your trainer or consultant and set your timetable around your week, not the other way round.",
  },
  {
    icon: Video,
    n: "03",
    title: "Show up live",
    desc: "Join from your dashboard — no links to hunt for, no groups to scroll through.",
  },
];

const Home = () => {
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [consultants, setConsultants] = useState([]);
  const [loadingConsultants, setLoadingConsultants] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleSelectSpecialty = async (specialty) => {
    setSelectedSpecialty(specialty);
    setIsSpecialtyOpen(false);
    setLoadingConsultants(true);
    try {
      const res = await api.get("/consultants/public");
      setConsultants(
        res.data.filter((c) => c.specialty === specialty.value),
      );
    } catch (err) {
      console.error(err);
      setConsultants([]);
    } finally {
      setLoadingConsultants(false);
    }
  };

  const handleBook = async (consultant) => {
    if (role !== "client") {
      localStorage.setItem(
        "pending_consultation_consultant_id",
        consultant._id,
      );
      navigate("/signup");
      return;
    }

    setBookingId(consultant._id);
    try {
      const clientId = localStorage.getItem("client_id");
      const res = await api.post("/payments/stripe/consultation-checkout", {
        client_id: clientId,
        consultant_id: consultant._id,
      });
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not start checkout",
      );
      setBookingId(null);
    }
  };

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
                  Empowering your health journey with certified female fitness
                  coaches, expert dietitians, and specialized wellness
                  professionals. Total care designed around you.
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
                    onClick={() =>
                      document
                        .getElementById("how-it-works")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
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
      {/*
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
      */}
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
                <div className="flex items-center gap-2 mb-3">
                  <div className="inline-flex shrink-0 bg-brand-blue-pale rounded-full p-2">
                    <pillar.icon className="text-brand-blue" size={18} />
                  </div>
                  <span className="font-display text-brand-orange text-[10px] tracking-[0.15em]">
                    {pillar.label.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-display text-brand-blue text-lg mb-3">
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
      <section id="how-it-works" className="py-20">
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
                <div className="inline-flex bg-brand-orange/10 rounded-full p-3 mb-4">
                  <step.icon className="text-brand-orange" size={22} />
                </div>
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
              room. Book a 1-on-1 with a real professional.
            </p>
          </motion.div>

          <div className="max-w-lg mx-auto">
            <div className="relative flex justify-center mb-8">
              <button
                onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
                className="flex items-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full shadow-lg hover:bg-brand-orange-dark transition-colors"
              >
                Book a Consultation
                <ChevronDown
                  size={18}
                  className={`transition-transform ${isSpecialtyOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isSpecialtyOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSpecialtyOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-3 w-72 bg-white rounded-2xl shadow-lg border border-brand-blue-pale py-2 z-20"
                    >
                      {consultationSpecialties.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => handleSelectSpecialty(s)}
                          className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-brand-blue hover:bg-brand-blue-pale transition-colors"
                        >
                          <s.icon size={16} className="text-brand-orange" />
                          {s.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {selectedSpecialty && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-brand-blue/60 text-xs uppercase tracking-wide text-center mb-4">
                  Available {selectedSpecialty.label}s
                </p>
                {loadingConsultants ? (
                  <p className="text-brand-blue/60 text-sm text-center">
                    Loading...
                  </p>
                ) : consultants.length === 0 ? (
                  <p className="text-brand-blue/60 text-sm text-center">
                    No {selectedSpecialty.label.toLowerCase()}s available
                    right now — check back soon.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {consultants.map((c) => (
                      <Card
                        key={c._id}
                        className="flex flex-col sm:flex-row sm:items-start gap-4"
                      >
                        <div className="w-14 h-14 rounded-full bg-brand-blue-pale overflow-hidden flex items-center justify-center shrink-0">
                          {c.photo_url ? (
                            <img
                              src={c.photo_url}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <selectedSpecialty.icon
                              className="text-brand-blue"
                              size={22}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-brand-blue text-sm mb-1">
                            {c.name}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-blue/60 mb-2">
                            {c.years_experience && (
                              <span className="flex items-center gap-1">
                                <Briefcase size={12} /> {c.years_experience}{" "}
                                yrs experience
                              </span>
                            )}
                            {c.session_duration && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} /> {c.session_duration}
                              </span>
                            )}
                            {c.fee && (
                              <span className="flex items-center gap-1">
                                <Wallet size={12} /> Rs{" "}
                                {c.fee.toLocaleString()}
                              </span>
                            )}
                            {c.max_clients_per_session && (
                              <span className="flex items-center gap-1">
                                <UserRound size={12} /> Max{" "}
                                {c.max_clients_per_session} client
                                {c.max_clients_per_session > 1 ? "s" : ""}
                                /session
                              </span>
                            )}
                          </div>
                          {c.bio && (
                            <p className="text-brand-blue/70 text-xs leading-relaxed">
                              {c.bio}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleBook(c)}
                          disabled={bookingId === c._id}
                          className="shrink-0"
                        >
                          {bookingId === c._id ? "Redirecting..." : "Book"}
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
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
