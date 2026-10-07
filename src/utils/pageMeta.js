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
      "Customized diet plans and live online home workout classes for women, led by female trainers six days a week — from anywhere. Choose your package today.",
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
    title: `Female Fitness Trainers | ${siteName}`,
    description:
      "Meet the female fitness trainers who lead Fitness Zone's live online home workout classes, six days a week. Find a class time that suits you.",
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
