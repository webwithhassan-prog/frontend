import { posts } from "../content/blog.js";

export const SITE_ORIGIN = "https://fitnesszone.ltd";
const siteName = "Fitness Zone";
const defaultDescription =
  "Fitness Zone is a fitness platform built for women — customized dietplans and home workouts with female trainers.";

// Path -> { title, description, noindex? }. Shared by usePageMeta (in the
// browser) and the build, which writes each path its own HTML file with
// these tags already in place — see seo/build.js. Pages with
// noindex are kept out of Google: account screens, payment results, and
// anything not listed here (the 404 page, one-time token links).
export const pageMeta = {
  "/": {
    title: `${siteName} — Online Diet Plans & Home Workouts for Women`,
    description:
      "Fitness Zone is an online fitness platform for women: customized diet plans and live home workout classes with female trainers, six days a week — from anywhere.",
  },
  "/plans": {
    title: `Diet Plan & Home Workout Packages for Women | ${siteName}`,
    description:
      "Compare diet plan, home workout and combined packages for women — several lengths, priced in your local currency. Pick your plan and start today.",
  },
  "/about": {
    title: `About Us — Natural Nutrition for Women | ${siteName}`,
    description:
      "Since 2023, Fitness Zone has helped women build lasting health with real-food diet plans and home workouts — no powders, pills or shortcuts. Meet us.",
  },
  "/trainers": {
    title: `Female Fitness Trainers Online for Women | ${siteName}`,
    description:
      "Live online fitness classes for women, every one led by a female fitness trainer — train at home instead of a mixed gym, six days a week, from anywhere.",
  },
  "/timetable": {
    title: `Live Online Workout Class Times | ${siteName}`,
    description:
      "Live home workout classes with female trainers run several times a day — see today's class times in your timezone and the weekly plan. Join a class.",
  },
  "/ebooks": {
    title: `Healthy Recipe E-Books & Fitness Courses | ${siteName}`,
    description:
      "Healthy recipe e-books and fitness courses from Fitness Zone — buy individually, with instant access that stays in your account. Browse the library.",
  },
  "/success-stories": {
    title: `Weight Loss Success Stories | ${siteName}`,
    description:
      "Real check-ins and results from women on Fitness Zone diet plans and live home workouts. Read their stories and start your own.",
  },
  "/online-diet-plan": {
    title: `Customized Online Diet Plan for Women | ${siteName}`,
    description:
      "A customized diet plan for weight loss, built by a dietitian around your health and the home food you eat — no supplements. Get your plan within 24 hours.",
  },
  "/online-workout-classes": {
    title: `Live Online Workout Classes for Women | ${siteName}`,
    description:
      "Live online fitness classes for women with female trainers — 50–55 minute home workouts, six days a week, several times a day, with recordings. See class times.",
  },
  "/home-workout-for-women": {
    title: `Home Workout for Women & Girls — Live Classes | ${siteName}`,
    description:
      "Live home workouts for women and girls with female trainers — a different 50–55 minute class every day, six days a week, suited to varying fitness levels.",
  },
  "/pcos-diet-plan": {
    title: `PCOS, PCOD & Thyroid Diet Plan for Weight Loss | ${siteName}`,
    description:
      "A customized PCOS, PCOD or thyroid diet plan for weight loss, built by a dietitian around your diagnosis and home food — no pills. Your plan in 24 hours.",
  },
  "/menopause-weight-loss": {
    title: `Menopause & Insulin Resistance Weight Loss | ${siteName}`,
    description:
      "Lose weight in menopause or with insulin resistance: a customized diet plan from your own food, plus home workouts for women over 40 and 50 — no pills.",
  },
  "/postpartum-weight-loss": {
    title: `Postpartum Weight Loss Program for New Moms | ${siteName}`,
    description:
      "Lose weight after pregnancy at home: a routine-friendly customized diet plan and doctor-safe live workouts with female trainers, built around your baby.",
  },
  "/blog": {
    title: `Diet & Home Workout Guides for Women | ${siteName}`,
    description:
      "Practical guides on PCOS diets, postpartum weight loss, Pakistani diet plans and home workouts for women — built around desi food and real routines.",
  },
  ...Object.fromEntries(
    posts.map((p) => [
      `/blog/${p.slug}`,
      { title: `${p.metaTitle} | ${siteName}`, description: p.description },
    ]),
  ),
  "/careers": {
    title: `Careers — Join Our Trainer Team | ${siteName}`,
    description:
      "Female fitness trainer? Lead live online home workout classes for women with Fitness Zone, from home. Apply to join our team today.",
  },
  "/contact": {
    title: `Contact Us — WhatsApp & Email | ${siteName}`,
    description:
      "Questions about diet plans, home workouts or your membership? Message Fitness Zone on WhatsApp or email us — we reply around the clock.",
  },
  "/join": {
    noindex: true,
    title: `Join Your Class | ${siteName}`,
    description: "Enter your name and phone number to join your class — no login needed.",
  },
  "/login": {
    noindex: true,
    title: `Login | ${siteName}`,
    description: "Log in to your Fitness Zone account.",
  },
  "/signup": {
    noindex: true,
    title: `Sign Up | ${siteName}`,
    description: "Create your Fitness Zone account to get started.",
  },
  "/forgot-password": {
    noindex: true,
    title: `Reset Your Password | ${siteName}`,
    description: "Request a password reset link for your Fitness Zone account.",
  },
  "/privacy-policy": {
    title: `Privacy Policy | ${siteName}`,
    description: "How Fitness Zone collects, uses, and protects your information.",
  },
  "/terms": {
    title: `Terms of Service | ${siteName}`,
    description: "Fitness Zone's terms of service.",
  },
  "/refund-policy": {
    title: `Refund Policy | ${siteName}`,
    description: "Fitness Zone's refund and membership pause policy.",
  },
  // Payment/invoice result pages: reached from checkout, never from search.
  "/pay": {
    noindex: true,
    title: `Pay Your Invoice | ${siteName}`,
    description: defaultDescription,
  },
  "/payment-success": {
    noindex: true,
    title: `Payment Successful | ${siteName}`,
    description: defaultDescription,
  },
  "/payment-cancelled": {
    noindex: true,
    title: `Payment Cancelled | ${siteName}`,
    description: defaultDescription,
  },
  "/invoice-success": {
    noindex: true,
    title: `Invoice Paid | ${siteName}`,
    description: defaultDescription,
  },
};

export const getPageMeta = (pathname) =>
  pageMeta[pathname] || {
    title: `Page Not Found | ${siteName}`,
    description: defaultDescription,
    noindex: true,
  };
