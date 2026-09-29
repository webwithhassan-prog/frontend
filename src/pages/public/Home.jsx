import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  ArrowRight,
  CalendarDays,
  Users,
  TrendingUp,
  Headset,
  Route,
  CalendarCheck,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import IconDraw from "../../components/common/IconDraw";
import AnimatedCounter from "../../components/common/AnimatedCounter";
import TestimonialsSlider from "../../components/common/TestimonialsSlider";
import AchievementMarquee from "../../components/common/AchievementMarquee";
import ComboPlans from "../../components/common/ComboPlans";
import CardSlider from "../../components/common/CardSlider";
import YouTubeFacade from "../../components/common/YouTubeFacade";
import api from "../../services/api";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

// Thousands are shown as "K" so all four fit in one row on a phone.
const stats = [
  { icon: CalendarDays, target: 3, suffix: "+", label: "Years Running" },
  { icon: Users, target: 50, suffix: "K+", label: "Clients Served" },
  { icon: TrendingUp, target: 10, suffix: "K+", label: "Success Stories" },
  { icon: Headset, display: "24/7", label: "Support" },
];

const steps = [
  {
    icon: Route,
    n: "01",
    title: "Choose your path",
    desc: "Pick a Dietplan, Home Workouts, or both — combine them for full support.",
  },
  {
    icon: CalendarCheck,
    n: "02",
    title: "Get matched & scheduled",
    desc: "We assign your trainer and set your timetable around your week, not the other way round.",
  },
  {
    icon: Video,
    n: "03",
    title: "Join your workout",
    desc: "Join from your dashboard — no links to hunt for, no groups to scroll through.",
  },
];

const Home = () => {
  const [demoVideos, setDemoVideos] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const res = await api.get("/hero-banners/public");
        setHeroSlides(
          res.data.map((b) => ({
            image: b.image_url,
            eyebrow: b.eyebrow,
            title: b.title,
            desc: b.desc,
            cta: b.cta_label,
            href: b.cta_link,
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setHeroLoading(false);
      }
    };
    fetchHeroBanners();
  }, []);

  useEffect(() => {
    const fetchDemoVideos = async () => {
      try {
        const res = await api.get("/demo-videos/public");
        setDemoVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDemoVideos();
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goPrevHero = () =>
    setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const goNextHero = () =>
    setHeroSlide((prev) => (prev + 1) % heroSlides.length);


  return (
    <div className="overflow-hidden">
      <AchievementMarquee />

      {heroLoading && (
        <section className="relative bg-brand-blue overflow-hidden">
          <div className="relative w-full aspect-square sm:aspect-[3/2] lg:aspect-[2/1] lg:max-h-[560px]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-light to-brand-blue-light-dark" />

              <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-end text-center px-6 sm:px-16 pb-14 sm:pb-20 pt-10">
                <p className="font-display text-brand-orange text-[11px] sm:text-sm tracking-[0.15em] mb-1.5 line-clamp-1">
                  HOME WORKOUTS
                </p>
                <h1 className="font-display text-[26px] sm:text-4xl text-white leading-[1.15] mb-2 sm:mb-3 max-w-[300px] sm:max-w-[520px] text-balance line-clamp-3">
                  Dietplans &amp; Home Workouts — Built For You
                </h1>
                <p className="text-white/90 font-medium text-sm sm:text-lg leading-snug sm:leading-relaxed max-w-[300px] sm:max-w-[420px] mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-3">
                  Customized dietplans and home workouts — all on one
                  platform, wherever you are.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <Button
                    size="sm"
                    className="whitespace-nowrap"
                    to="/plans"
                  >
                    Explore Packages
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="whitespace-nowrap"
                    onClick={() =>
                      document
                        .getElementById("how-it-works")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <span className="flex items-center gap-1.5">
                      How it works <ArrowRight size={14} />
                    </span>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:flex absolute inset-0 items-center">
                <div className="max-w-6xl mx-auto px-8 w-full">
                  <div className="max-w-sm md:max-w-md">
                    <p className="font-display text-brand-orange text-sm tracking-[0.2em] mb-3">
                      HOME WORKOUTS
                    </p>
                    <h1 className="font-display text-3xl md:text-5xl text-white leading-[1.15] mb-4">
                      Dietplans &amp; Home Workouts — Built For You
                    </h1>
                    <p className="text-white font-medium text-base md:text-lg mb-5 leading-relaxed">
                      Customized dietplans and home workouts — all on
                      one platform, wherever you are.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        size="sm"
                        className="!px-6 !py-3 text-sm"
                        to="/plans"
                      >
                        Explore Packages
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="!px-6 !py-3 text-sm"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {heroSlides.length > 0 && (
      <section className="relative bg-brand-blue overflow-hidden">
        {/* Image box — content swaps instantly with the current slide;
            arrows/dots below are stable siblings. Mobile/tablet uses a
            taller portrait-ish ratio with everything (eyebrow, heading,
            description, buttons) overlaid as one bottom-anchored block —
            previously these were three separate stacked sections (heading
            above the photo, description overlaid on it, buttons below),
            which read as disconnected chunks rather than one hero. Desktop
            keeps its own wide ratio and left-column layout, unchanged. */}
        <div className="relative w-full aspect-square sm:aspect-[3/2] lg:aspect-[2/1] lg:max-h-[560px]">
          <div className="absolute inset-0">
            <img
              src={optimizeCloudinaryUrl(heroSlides[heroSlide].image, 1200)}
              srcSet={[600, 900, 1200, 1600]
                .map((w) => `${optimizeCloudinaryUrl(heroSlides[heroSlide].image, w)} ${w}w`)
                .join(", ")}
              sizes="100vw"
              alt={heroSlides[heroSlide].title}
              // This is almost always the page's LCP element — full
              // priority, and only the very first slide needs it (the
              // rest are swapped in later via user/timer interaction).
              fetchPriority={heroSlide === 0 ? "high" : "auto"}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Scrim — these are real photos with no built-in blank panel.
                  Mobile anchors its text to the bottom, so it gets a
                  bottom-heavy gradient; desktop keeps its text in a left
                  column, so it gets a left-side gradient instead. Darker
                  than a typical scrim on purpose — legibility over photo
                  fidelity for the overlaid text. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 via-55% to-black/5 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/50 lg:via-50% lg:to-transparent" />

            {/* Text + CTA overlay — mobile + tablet, anchored to the bottom
                of the photo as one block */}
            <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-end text-center px-6 sm:px-16 pb-14 sm:pb-20 pt-10">
              <p
                className="font-display text-brand-orange text-[11px] sm:text-sm tracking-[0.15em] mb-1.5 line-clamp-1"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
              >
                {heroSlides[heroSlide].eyebrow}
              </p>
              <h1
                className="font-display text-[26px] sm:text-4xl text-white leading-[1.15] mb-2 sm:mb-3 max-w-[300px] sm:max-w-[520px] text-balance line-clamp-3"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
              >
                {heroSlides[heroSlide].title}
              </h1>
              <p
                className="text-white/90 font-medium text-sm sm:text-lg leading-snug sm:leading-relaxed max-w-[300px] sm:max-w-[420px] mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-3"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
              >
                {heroSlides[heroSlide].desc}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <Button
                  size="sm"
                  className="whitespace-nowrap"
                  to={heroSlides[heroSlide].href}
                >
                  {heroSlides[heroSlide].cta}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="whitespace-nowrap"
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <span className="flex items-center gap-1.5">
                    How it works <ArrowRight size={14} />
                  </span>
                </Button>
              </div>
            </div>

            {/* Text overlay — desktop only, where the image is wide enough
                  to hold the full heading/description/buttons comfortably */}
            <div className="hidden lg:flex absolute inset-0 items-center">
              <div className="max-w-6xl mx-auto px-8 w-full">
                <div className="max-w-sm md:max-w-md">
                  <p
                    className="font-display text-brand-orange text-sm tracking-[0.2em] mb-3"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
                  >
                    {heroSlides[heroSlide].eyebrow}
                  </p>

                  <h1
                    className="font-display text-3xl md:text-5xl text-white leading-[1.15] mb-4"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
                  >
                    {heroSlides[heroSlide].title}
                  </h1>

                  <p
                    className="text-white font-medium text-base md:text-lg mb-5 leading-relaxed"
                    style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
                  >
                    {heroSlides[heroSlide].desc}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      size="sm"
                      className="!px-6 !py-3 text-sm"
                      to={heroSlides[heroSlide].href}
                    >
                      {heroSlides[heroSlide].cta}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="!px-6 !py-3 text-sm"
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prev/next arrows — stable, outside the crossfade */}
          <button
            onClick={goPrevHero}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            title="Previous"
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goNextHero}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            title="Next"
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dot indicators — stable, outside the crossfade */}
          <div className="absolute bottom-9 sm:bottom-14 lg:bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                  i === heroSlide ? "w-6 bg-brand-orange" : "w-1.5 bg-white/50"
                }`}
                title={`Slide ${i + 1}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Stats — one card of four, lifted over the banner's bottom edge so
          the two read as one opening block (and the page no longer spends
          a full-width band on four numbers). The banner leaves room at its
          bottom for the overlap; with no banner the card just sits in flow. */}
      <section
        className={`relative z-10 px-4 sm:px-6 ${
          heroLoading || heroSlides.length > 0
            ? "-mt-7 sm:-mt-10 lg:-mt-12"
            : "pt-8"
        }`}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-4 divide-x divide-brand-blue-pale bg-white border border-brand-blue-pale rounded-2xl shadow-[0_14px_36px_-14px_rgba(18,34,74,0.35)]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col lg:flex-row items-center justify-center gap-1.5 lg:gap-3.5 px-1 py-3.5 sm:py-5 text-center lg:text-left"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="hidden sm:flex shrink-0 w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-brand-orange/10 items-center justify-center">
                <stat.icon className="text-brand-orange" size={18} />
              </span>
              <div>
                <p className="font-display text-xl sm:text-2xl lg:text-3xl text-brand-blue leading-none tabular-nums">
                  {stat.display ?? (
                    <>
                      <AnimatedCounter target={stat.target} />
                      <span className="text-brand-orange">{stat.suffix}</span>
                    </>
                  )}
                </p>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide leading-tight text-brand-blue/55 mt-1.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <ComboPlans />
      {/* Session Demos — blue background to keep the page's alternating
          light/blue rhythm after the light Combo Plans section. */}
      {demoVideos.length > 0 && (
        <section className="bg-brand-blue py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="font-display text-2xl md:text-3xl text-white text-center mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              SESSION DEMOS
            </motion.h2>
            <p className="text-white/80 text-center max-w-xl mx-auto mb-8 md:mb-10">
              Home workouts in action, exactly as our members experience them.
            </p>

            <CardSlider
              className="max-w-3xl mx-auto"
              itemClassName="max-w-2xl"
              tone="dark"
              autoAdvanceMs={6000}
              items={demoVideos}
              getKey={(video) => video._id}
              getLabel={(video, i) => `video ${i + 1}`}
              itemName="video"
              renderItem={(video) => (
                <Card revealOnScroll={false} padding="p-2">
                  <div className="aspect-video rounded-xl overflow-hidden bg-brand-blue-pale">
                    <YouTubeFacade
                      link={video.youtube_link}
                      title={video.title || "Session demo"}
                      className="w-full h-full"
                    />
                  </div>
                  {video.title && (
                    <h3 className="font-display text-brand-blue text-sm mt-2 mb-0.5 text-center">
                      {video.title}
                    </h3>
                  )}
                </Card>
              )}
            />
          </div>
        </section>
      )}

      {/* How it works — real sequence, numbers earn their place */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            HOW IT WORKS
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <motion.div
                  className="h-full rounded-2xl shadow-md p-6 flex flex-col overflow-hidden relative bg-gradient-to-br from-brand-blue to-brand-blue-light"
                  whileHover={{ y: -6, boxShadow: "0 16px 32px rgba(30,58,138,0.3)" }}
                  transition={{
                    default: { duration: 0.35 },
                    y: { type: "spring", stiffness: 300, damping: 20 },
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex shrink-0 bg-white/15 rounded-full p-3">
                      <step.icon className="text-white" size={22} />
                    </div>
                    <p className="font-display text-brand-orange text-3xl">
                      {step.n}
                    </p>
                  </div>
                  <h3 className="font-display text-white text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    {step.desc}
                  </p>
                  <div className="mt-auto flex justify-center pt-2">
                    <IconDraw Icon={step.icon} size={56} />
                  </div>
                </motion.div>
              </motion.div>
            ))}
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
              to="/success-stories"
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
            Pick your package — Dietplan, Home Workouts, or both — and start
            this week.
          </p>
          <Button to="/plans">
            Explore Packages
          </Button>
        </div>
      </section>

      {/* About / company info — right above the footer */}
      <section className="bg-brand-blue py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.p
            className="font-display text-brand-orange text-xs tracking-[0.2em] mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ABOUT US
          </motion.p>
          <motion.h2
            className="font-display text-2xl md:text-3xl text-white mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Welcome to FITNESSZONE OFFICIAL LTD.
          </motion.h2>

          <motion.div
            className="text-white/70 text-sm md:text-base leading-relaxed space-y-4 mb-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p>
              Since 2023, FITNESSZONE OFFICIAL LIMITED has been dedicated to
              helping women take control of their health and well-being. We
              focus on the everyday effects of modern, sedentary lifestyles —
              low energy, stubborn weight, and inconsistent routines — through
              sustainable nutrition and movement, not quick fixes.
            </p>
            <p>
              We believe lasting change shouldn't require harsh starvation
              diets, shortcuts, or long lists of supplements — real,
              sustainable results begin in your kitchen and through
              consistent movement. No powders, pills, or artificial products,
              ever.
            </p>
            <a
              href="/about"
              className="inline-block text-brand-orange text-sm font-semibold hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              Read more about us →
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
