// Homepage FAQ. Shown on the page and, word for word, in the FAQPage
// structured data the build adds (seo/build.js) — search engines and AI
// assistants quote these, so every answer sticks to facts the site already
// states elsewhere (package features, About, refund policy, payments).
// onPlans: also shown (with its own FAQPage data) on the packages page.
export const faqs = [
  {
    q: "What is Fitness Zone?",
    a: "Fitness Zone (FITNESSZONE OFFICIAL LTD) is an online fitness platform for women. Since 2023 it has offered customized diet plans and live home workout classes with female trainers, all managed from one account.",
  },
  {
    q: "How do the online home workout classes work?",
    onPlans: true,
    a: "Classes are live, led by female trainers, and run 50–55 minutes, six days a week, with a different workout each day — from yoga and stretching to strength, tabata, abs and full-body sessions. Several time slots run every day, you join from your Fitness Zone profile, and recordings are provided.",
  },
  {
    q: "What is included in the customized diet plan?",
    onPlans: true,
    a: "A dietitian builds a home-based menu around your health needs and the foods you prefer — real, whole food, with no powders, pills or supplements. Your plan arrives within 24 hours of sharing your health details, includes daily meal tracking and weekly follow-ups, and is renewed every 15 days.",
  },
  {
    q: "Are the trainers women?",
    a: "Yes. Every Fitness Zone class is led by a female trainer.",
  },
  {
    q: "Can I join from any country?",
    onPlans: true,
    a: "Yes. Everything happens online, so you can join from anywhere. The Time Slots page shows class times in your own timezone, and package prices are shown in your local currency.",
  },
  {
    q: "Which package should I choose?",
    onPlans: true,
    a: "Choose Customized Dietplan for nutrition, Home Workouts for live classes, or Both Combined to get both in one package at one price. Packages come in several lengths, and longer packages usually work out cheaper per day.",
  },
  {
    q: "How can I pay?",
    onPlans: true,
    a: "Pay by card through secure Stripe checkout for instant access. In some countries you can also pay through local methods — for example bank transfer, JazzCash or Easypaisa in Pakistan — and access starts once our team verifies the payment.",
  },
];

export const plansFaqs = faqs.filter((f) => f.onPlans);
