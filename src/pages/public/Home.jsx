import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ArrowRight,
  CalendarDays,
  Users,
  TrendingUp,
  Headset,
  Salad,
  Dumbbell,
  Route,
  CalendarCheck,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import AnimatedCounter from "../../components/common/AnimatedCounter";
import TestimonialsSlider from "../../components/common/TestimonialsSlider";
import AchievementMarquee from "../../components/common/AchievementMarquee";
import api from "../../services/api";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

const pillars = [
  {
    icon: Salad,
    label: "Dietplan",
    title: "Customized Dietplans",
    desc: "Home-based menus built around your body, your food, your life — tracked daily, adjusted weekly.",
    image:
      "https://res.cloudinary.com/zyfxigcj/image/upload/v1789084354/homepage_dietplan.jpg",
  },
  {
    icon: Dumbbell,
    label: "Home Workouts",
    title: "Home Workouts",
    desc: "50–55 minutes, six days a week, a different workout every day — led by female trainers. (recordings are also available)",
    image:
      "https://res.cloudinary.com/zyfxigcj/image/upload/v1789084362/homepage_homeworkout.jpg",
    imagePosition: "object-top",
  },
];

const stats = [
  { icon: CalendarDays, target: 3, suffix: "+", label: "Years Running" },
  { icon: Users, target: 50000, suffix: "+", label: "Clients Served" },
  { icon: TrendingUp, target: 10000, suffix: "+", label: "Success Stories" },
  { icon: Headset, display: "24/7", label: "Support" },
];

const getYoutubeEmbedSrc = (link) => {
  if (!link) return "";
  const match = link.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  const videoId = match ? match[1] : link;
  return `https://www.youtube.com/embed/${videoId}`;
};

const steps = [
  {
    icon: Route,
    n: "01",
    title: "Choose your path",
    desc: "Pick a Dietplan, Home Workouts, or both — combine them for full support.",
    image:
      "https://res.cloudinary.com/zyfxigcj/image/upload/v1789084366/homepage_step1_choose.jpg",
    imagePosition: "object-top",
  },
  {
    icon: CalendarCheck,
    n: "02",
    title: "Get matched & scheduled",
    desc: "We assign your trainer and set your timetable around your week, not the other way round.",
    image:
      "https://res.cloudinary.com/zyfxigcj/image/upload/v1789084370/homepage_step2_schedule.jpg",
  },
  {
    icon: Video,
    n: "03",
    title: "Join your workout",
    desc: "Join from your dashboard — no links to hunt for, no groups to scroll through.",
    image:
      "https://res.cloudinary.com/zyfxigcj/image/upload/v1789084375/homepage_step3_join.jpg",
  },
];

const Home = () => {
  const [demoVideos, setDemoVideos] = useState([]);
  const [transformationVideos, setTransformationVideos] = useState([]);
  const [demoSlide, setDemoSlide] = useState(0);
  const [transformationSlide, setTransformationSlide] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const res = await api.get("/hero-banners/public");
        setHeroSlides(
          res.data.map((b) => ({
            image: optimizeCloudinaryUrl(b.image_url, 1200),
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

    const fetchTransformationVideos = async () => {
      try {
        const res = await api.get("/transformation-videos/public");
        setTransformationVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransformationVideos();
  }, []);

  useEffect(() => {
    if (demoVideos.length <= 1) return;
    const timer = setInterval(() => {
      setDemoSlide((prev) => (prev + 1) % demoVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [demoVideos.length]);

  const goPrevDemo = () =>
    setDemoSlide((prev) => (prev - 1 + demoVideos.length) % demoVideos.length);
  const goNextDemo = () =>
    setDemoSlide((prev) => (prev + 1) % demoVideos.length);

  useEffect(() => {
    if (transformationVideos.length <= 1) return;
    const timer = setInterval(() => {
      setTransformationSlide((prev) => (prev + 1) % transformationVideos.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [transformationVideos.length]);

  const goPrevTransformation = () =>
    setTransformationSlide(
      (prev) =>
        (prev - 1 + transformationVideos.length) % transformationVideos.length,
    );
  const goNextTransformation = () =>
    setTransformationSlide((prev) => (prev + 1) % transformationVideos.length);

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
          <div className="relative w-full aspect-[4/5] sm:aspect-[3/2] lg:aspect-[2/1] lg:max-h-[560px]">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-light to-brand-blue-light-dark" />

              <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-end text-center px-8 sm:px-16 pb-8 sm:pb-10 pt-16">
                <p className="font-display text-brand-orange text-sm sm:text-base tracking-[0.15em] mb-2">
                  HOME WORKOUTS
                </p>
                <h1 className="font-display text-3xl sm:text-4xl text-white leading-[1.2] mb-3">
                  Dietplans &amp; Home Workouts — Built For You
                </h1>
                <p className="text-white font-medium text-base sm:text-lg leading-relaxed max-w-[300px] sm:max-w-[380px] mb-5">
                  Customized dietplans and home workouts — all on one
                  platform, wherever you are.
                </p>
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={() => (window.location.href = "/plans")}>
                    Explore Packages
                  </Button>
                  <Button
                    size="sm"
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
                        onClick={() => (window.location.href = "/plans")}
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
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/2] lg:aspect-[2/1] lg:max-h-[560px]">
          <div className="absolute inset-0">
            <img
              src={heroSlides[heroSlide].image}
              alt={heroSlides[heroSlide].title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Scrim — these are real photos with no built-in blank panel.
                  Mobile anchors its text to the bottom, so it gets a
                  bottom-heavy gradient; desktop keeps its text in a left
                  column, so it gets a left-side gradient instead. Darker
                  than a typical scrim on purpose — legibility over photo
                  fidelity for the overlaid text. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/50 lg:to-transparent" />

            {/* Text + CTA overlay — mobile + tablet, anchored to the bottom
                of the photo as one block */}
            <div className="lg:hidden absolute inset-0 flex flex-col items-center justify-end text-center px-8 sm:px-16 pb-8 sm:pb-10 pt-16">
              <p
                className="font-display text-brand-orange text-sm sm:text-base tracking-[0.15em] mb-2"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
              >
                {heroSlides[heroSlide].eyebrow}
              </p>
              <h1
                className="font-display text-3xl sm:text-4xl text-white leading-[1.2] mb-3"
                style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}
              >
                {heroSlides[heroSlide].title}
              </h1>
              <p
                className="text-white font-medium text-base sm:text-lg leading-relaxed max-w-[300px] sm:max-w-[380px] mb-5"
                style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
              >
                {heroSlides[heroSlide].desc}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() =>
                    (window.location.href = heroSlides[heroSlide].href)
                  }
                >
                  {heroSlides[heroSlide].cta}
                </Button>
                <Button
                  size="sm"
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
                      onClick={() =>
                        (window.location.href = heroSlides[heroSlide].href)
                      }
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
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 lg:bottom-5">
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

      {/* Stats bar */}
      <section className="bg-brand-blue">
        <div className="max-w-6xl mx-auto px-6 py-7 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5 md:gap-8">
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
              <p className="font-display text-2xl md:text-3xl text-brand-orange mb-1 tabular-nums">
                {stat.display ?? (
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                )}
              </p>
              <p className="text-white/70 text-xs md:text-sm tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Transformations — right after the stats bar, as before */}
      {transformationVideos.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              REAL RESULTS
            </motion.h2>
            <p className="text-brand-blue/70 text-center max-w-xl mx-auto mb-14">
              Real member transformations, in their own words.
            </p>

            <div>
              <div className="relative flex items-center justify-center gap-4 sm:gap-6">
                  {transformationVideos.length > 1 && (
                    <button
                      onClick={goPrevTransformation}
                      className="hidden sm:flex shrink-0 bg-white shadow-md rounded-full p-2.5 text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                      aria-label="Previous video"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}

                  <div className="flex flex-col items-center">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={transformationSlide}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.35 }}
                        className="w-full max-w-[260px] sm:max-w-[300px]"
                      >
                        <Card className="p-2">
                          <div className="aspect-[9/16] rounded-xl overflow-hidden bg-brand-blue-pale">
                            <iframe
                              src={getYoutubeEmbedSrc(
                                transformationVideos[transformationSlide]
                                  .youtube_link,
                              )}
                              title={
                                transformationVideos[transformationSlide]
                                  .title || "Video"
                              }
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                          {transformationVideos[transformationSlide].title && (
                            <h3 className="font-display text-brand-blue text-sm mt-2 text-center">
                              {transformationVideos[transformationSlide].title}
                            </h3>
                          )}
                        </Card>
                      </motion.div>
                    </AnimatePresence>

                    {transformationVideos.length > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        {transformationVideos.map((v, i) => (
                          <button
                            key={v._id}
                            onClick={() => setTransformationSlide(i)}
                            aria-label={`Go to video ${i + 1}`}
                            className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                              i === transformationSlide
                                ? "w-6 bg-brand-orange"
                                : "w-2 bg-brand-blue-pale"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {transformationVideos.length > 1 && (
                    <button
                      onClick={goNextTransformation}
                      className="hidden sm:flex shrink-0 bg-white shadow-md rounded-full p-2.5 text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                      aria-label="Next video"
                    >
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>

                {transformationVideos.length > 1 && (
                  <div className="flex sm:hidden justify-center gap-6 mt-6">
                    <button
                      onClick={goPrevTransformation}
                      className="bg-white shadow-md rounded-full p-2.5 text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                      aria-label="Previous video"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={goNextTransformation}
                      className="bg-white shadow-md rounded-full p-2.5 text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                      aria-label="Next video"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
          </div>
        </section>
      )}
      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.h2
          className="font-display text-2xl md:text-3xl text-brand-blue text-center mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          CHOOSE YOUR PATH
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full">
                <div className="aspect-[4/3] mb-4 -mt-1 rounded-lg overflow-hidden bg-brand-blue-pale">
                  <img
                    src={optimizeCloudinaryUrl(pillar.image, 600)}
                    alt={pillar.title}
                    className={`w-full h-full object-cover ${pillar.imagePosition || ""}`}
                  />
                </div>
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

      {/* Session Demos — its own section, separate from Transformations
          since one's landscape and the other's portrait. Blue background
          to keep the page's alternating light/blue rhythm. */}
      {demoVideos.length > 0 && (
        <section className="bg-brand-blue py-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h2
              className="font-display text-2xl md:text-3xl text-white text-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              SESSION DEMOS
            </motion.h2>
            <p className="text-white/80 text-center max-w-xl mx-auto mb-14">
              Home workouts in action, exactly as our members experience them.
            </p>

            <div className="relative flex items-center justify-center gap-4 sm:gap-6">
              {demoVideos.length > 1 && (
                <button
                  onClick={goPrevDemo}
                  className="hidden sm:flex shrink-0 bg-white shadow-md rounded-full p-2.5 text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  aria-label="Previous video"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <div className="flex flex-col items-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={demoSlide}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                    className="w-full max-w-xl"
                  >
                    <Card className="p-2">
                      <div className="aspect-video rounded-xl overflow-hidden bg-brand-blue-pale">
                        <iframe
                          src={getYoutubeEmbedSrc(
                            demoVideos[demoSlide].youtube_link,
                          )}
                          title={demoVideos[demoSlide].title || "Video"}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {demoVideos[demoSlide].title && (
                        <h3 className="font-display text-brand-blue text-sm mt-2 text-center">
                          {demoVideos[demoSlide].title}
                        </h3>
                      )}
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {demoVideos.length > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {demoVideos.map((v, i) => (
                      <button
                        key={v._id}
                        onClick={() => setDemoSlide(i)}
                        aria-label={`Go to video ${i + 1}`}
                        className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                          i === demoSlide
                            ? "w-6 bg-brand-orange"
                            : "w-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {demoVideos.length > 1 && (
                <button
                  onClick={goNextDemo}
                  className="hidden sm:flex shrink-0 bg-white shadow-md rounded-full p-2.5 text-brand-blue hover:text-brand-orange transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  aria-label="Next video"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {demoVideos.length > 1 && (
              <div className="flex sm:hidden justify-center gap-6 mt-6">
                <button
                  onClick={goPrevDemo}
                  className="bg-white shadow-md rounded-full p-2.5 text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  aria-label="Previous video"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goNextDemo}
                  className="bg-white shadow-md rounded-full p-2.5 text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  aria-label="Next video"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
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
            How it works?
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
                <Card className="h-full">
                  <div className="aspect-[4/3] mb-4 -mt-1 rounded-lg overflow-hidden bg-brand-blue-pale">
                    <img
                      src={optimizeCloudinaryUrl(step.image, 600)}
                      alt={step.title}
                      className={`w-full h-full object-cover ${step.imagePosition || ""}`}
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex shrink-0 bg-brand-orange/10 rounded-full p-3">
                      <step.icon className="text-brand-orange" size={22} />
                    </div>
                    <p className="font-display text-brand-orange text-3xl">
                      {step.n}
                    </p>
                  </div>
                  <h3 className="font-display text-brand-blue text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-brand-blue/70 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </Card>
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
            Pick your package — Dietplan, Home Workouts, or both — and start
            this week.
          </p>
          <Button onClick={() => (window.location.href = "/plans")}>
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
