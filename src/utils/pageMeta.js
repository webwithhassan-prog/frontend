export const SITE_ORIGIN = "https://fitnesszone.ltd";
const siteName = "Fitness Zone";
const defaultDescription =
  "Fitness Zone is a fitness platform built for women — customized dietplans and home workouts with female trainers.";

// Path -> { title, description, noindex? }. Shared by usePageMeta (in the
// browser) and the build, which writes each path its own HTML file with
// these tags already in place — see seoPages in vite.config.js. Pages with
// noindex are kept out of Google: account screens, payment results, and
// anything not listed here (the 404 page, one-time token links).
export const pageMeta = {
  "/": {
    title: `${siteName} — Dietplans & Home Workouts for Women`,
    description:
      "Customized dietplans and home workouts — one platform, no WhatsApp groups, no missed links.",
  },
  "/plans": {
    title: `Packages & Pricing | ${siteName}`,
    description:
      "Choose a Dietplan, Home Workouts, or both — packages for every timeline, with transparent pricing.",
  },
  "/about": {
    title: `About Us | ${siteName}`,
    description:
      "Fitness Zone is a fitness platform built for women — dietplans and home workouts, all in one place.",
  },
  "/trainers": {
    title: `Meet Our Trainers | ${siteName}`,
    description:
      "Meet the female trainers behind Fitness Zone's home workouts.",
  },
  "/timetable": {
    title: `Time Slots | ${siteName}`,
    description:
      "This week's workout plan and daily time slots, shown in your local timezone.",
  },
  "/ebooks": {
    title: `E-Books & Courses | ${siteName}`,
    description:
      "Guides, resources, and courses you can keep — workout and nutrition e-books available to purchase individually.",
  },
  "/success-stories": {
    title: `Success Stories | ${siteName}`,
    description: "Real check-ins, real progress, from real Fitness Zone members.",
  },
  "/careers": {
    title: `Careers — Join Our Trainer Team | ${siteName}`,
    description:
      "Are you a fitness trainer interested in leading home workout classes? Apply to join Fitness Zone.",
  },
  "/contact": {
    title: `Contact Us | ${siteName}`,
    description:
      "Questions about packages or sessions? Reach Fitness Zone by WhatsApp, Instagram, or email.",
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
