const siteName = "Fitness Zone";
const defaultDescription =
  "Fitness Zone is a fitness platform built for women — customized dietplans, live workout sessions with female trainers, and private 1-on-1 consultations with a dietician, gynecologist, or psychiatrist.";

// Path -> { title, description }. Falls back to the defaults below for any
// route not listed here (e.g. dynamic ones like /reset-password/:token).
const pageMeta = {
  "/": {
    title: `${siteName} — Dietplans, Live Workouts & Consultations for Women`,
    description:
      "Customized dietplans, live workout sessions, and private 1-on-1 consultations — one platform, no WhatsApp groups, no missed links.",
  },
  "/plans": {
    title: `Packages & Pricing | ${siteName}`,
    description:
      "Choose a Dietplan, Live Workout Sessions, or both — 30, 90, or 180-day packages with transparent pricing.",
  },
  "/trainers": {
    title: `Meet Our Trainers & Consultants | ${siteName}`,
    description:
      "Meet the female trainers and consultants behind Fitness Zone's live sessions and 1-on-1 consultations.",
  },
  "/consultation": {
    title: `Book a 1-on-1 Consultation | ${siteName}`,
    description:
      "Book a private consultation with a dietician, gynecologist, or psychiatrist — no package required.",
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
    title: `Careers — Professional Partner Onboarding | ${siteName}`,
    description:
      "Are you a dietician, gynecologist, psychiatrist, or personal trainer? Apply to offer 1-on-1 consultations through Fitness Zone.",
  },
  "/contact": {
    title: `Contact Us | ${siteName}`,
    description:
      "Questions about packages, sessions, or consultations? Reach Fitness Zone by WhatsApp, Instagram, or email.",
  },
  "/join": {
    title: `Join Your Class | ${siteName}`,
    description: "Enter your name and phone number to join your live class — no login needed.",
  },
  "/login": {
    title: `Login | ${siteName}`,
    description: "Log in to your Fitness Zone account.",
  },
  "/signup": {
    title: `Sign Up | ${siteName}`,
    description: "Create your Fitness Zone account to get started.",
  },
  "/forgot-password": {
    title: `Reset Your Password | ${siteName}`,
    description: "Request a password reset link for your Fitness Zone account.",
  },
  "/privacy-policy": {
    title: `Privacy Policy | ${siteName}`,
    description: "How Fitness Zone collects, uses, and protects your information.",
  },
  "/terms": {
    title: `Terms of Service | ${siteName}`,
    description: "Fitness Zone's terms of service and refund policy.",
  },
};

export const getPageMeta = (pathname) =>
  pageMeta[pathname] || {
    title: siteName,
    description: defaultDescription,
  };
