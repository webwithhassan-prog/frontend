// Program pages: one per keyword cluster people actually search for
// (Google autocomplete, Oct 2026 — see the commit for the research). Each
// page leads with a direct answer, keeps sections self-contained, and only
// states facts the site already makes elsewhere (package features, About,
// refund policy, the weekly plan) — search engines and AI assistants quote
// these pages, so nothing here is embellished. Rendered by ProgramPage and,
// word for word, into the crawler-readable HTML, Service and FAQPage data
// by seo/build.js.

export const programs = {
  "/online-diet-plan": {
    eyebrow: "CUSTOMIZED DIET PLAN",
    title: "Customized Online Diet Plan for Women",
    intro:
      "Fitness Zone's online diet plan is a customized meal plan for women, built by a dietitian around your health, your goal and the food you already eat at home. Share your health details and your personalized plan arrives within 24 hours — then a fresh plan every 15 days as you progress.",
    packageType: "dietplan",
    serviceType: "Online diet plan",
    sections: [
      {
        heading: "What's included in your diet plan",
        lead: "Every plan is personal, made from real food, and followed up — not a generic diet chart.",
        bullets: [
          "Dietitian support from start to finish",
          "A home-based menu built around your cuisine and the foods you prefer",
          "Health-specific choices — your plan works around your needs",
          "Daily meal tracking to keep you on course",
          "Weekly follow-ups to adjust what isn't working",
          "A new plan every 15 days as your body changes",
          "Real, whole food only — no powders, pills or supplements",
        ],
      },
      {
        heading: "How the online diet plan works",
        lead: "From sign-up to your first meal plan takes about a day.",
        steps: [
          [
            "Choose your package",
            "Pick a dietplan package length — longer packages include more 15-day plans.",
          ],
          [
            "Share your health details",
            "Tell us your goal, health needs and food preferences.",
          ],
          [
            "Get your plan within 24 hours",
            "Your dietitian builds your personalized meal plan.",
          ],
          [
            "Track, check in, renew",
            "Log meals daily, get weekly follow-ups, and a new plan every 15 days.",
          ],
        ],
      },
      {
        heading: "A diet plan for weight loss you can actually follow",
        paragraphs: [
          "Most diet plans for weight loss fail because they ask you to eat food you don't cook. Fitness Zone builds your meal plan for weight loss from your own home menu — whether you cook desi, Arabic or Western food — so it fits your family's meals instead of fighting them.",
          "There are no starvation diets, shortcuts or supplements: real, sustainable results come from your kitchen and consistent habits.",
        ],
      },
      {
        heading: "Diet plan and workouts together",
        paragraphs: [
          "Want faster, steadier results? The Both Combined package pairs your customized diet plan with live online workout classes led by female trainers — one package, one price.",
        ],
        links: [
          ["See live online workout classes", "/online-workout-classes"],
          ["Compare packages and prices", "/plans?type=combo"],
        ],
      },
    ],
    faqs: [
      {
        q: "How quickly do I get my diet plan?",
        a: "Within 24 hours of sharing your health details. After that, you get a new plan every 15 days for as long as your package runs.",
      },
      {
        q: "Is it a diet plan for weight loss?",
        a: "It can be. Tell us your goal when you share your health details — such as losing weight — and your dietitian builds your meal plan around it, using the foods you already eat.",
      },
      {
        q: "Will the meal plan suit my cuisine?",
        a: "Yes. Plans use a home-based menu built around your preferred foods, for any cuisine, dietary preference or cultural background.",
      },
      {
        q: "Do I need supplements or shakes?",
        a: "No. Fitness Zone plans use real, whole food only — no powders, pills or artificial products.",
      },
      {
        q: "How much does the online diet plan cost?",
        a: "Prices depend on the package length and are shown in your local currency on the packages page. Longer packages usually work out cheaper per day.",
      },
    ],
  },

  "/online-workout-classes": {
    eyebrow: "LIVE HOME WORKOUTS",
    title: "Live Online Workout Classes for Women",
    intro:
      "Fitness Zone runs live online workout classes for women, led by female trainers, six days a week. Each class is 50–55 minutes with a different workout every day, several time slots run daily, and recordings are provided — so you can train at home around your own schedule.",
    packageType: "workout",
    serviceType: "Online fitness classes",
    sections: [
      {
        heading: "What a week of classes looks like",
        lead: "A different focus each day keeps the whole body working and the routine fresh.",
        bullets: [
          "Yoga and stretching",
          "Upper body strength training",
          "Lower body strength training",
          "Aerobics and tabata",
          "Abs and belly workouts",
          "Full body workouts",
          "A weekly dietitian's session",
        ],
        links: [["See this week's plan and class times", "/timetable"]],
      },
      {
        heading: "Why women choose our online fitness classes",
        bullets: [
          "Female trainers lead every class",
          "Live classes, 50–55 minutes, six days a week",
          "Several time slots every day, shown in your own timezone",
          "Recordings provided if you miss a class",
          "Workouts suited to varying fitness levels",
          "Join from your Fitness Zone profile — no links to hunt for, no groups to scroll through",
        ],
      },
      {
        heading: "Home workouts for women, without the gym",
        paragraphs: [
          "Every class is a home workout: you join live from your living room, wherever you are in the world. Class times are shown in local time for Pakistan, India, Saudi Arabia, the UAE, the UK and the US, or for wherever you're joining from.",
          "It's a group class format with a trainer leading live, so you get the energy and accountability of a studio class without the commute.",
        ],
      },
      {
        heading: "Pair your workouts with a diet plan",
        paragraphs: [
          "Training works best alongside the right food. Add a customized diet plan with the Both Combined package — both in one package at one price.",
        ],
        links: [
          ["Learn about the customized diet plan", "/online-diet-plan"],
          ["Compare packages and prices", "/plans?type=workout"],
        ],
      },
    ],
    faqs: [
      {
        q: "Are the online workout classes live?",
        a: "Yes. Classes are live and led by a female trainer, and recordings are provided so you can catch up on any you miss.",
      },
      {
        q: "What times are the classes?",
        a: "Several classes run every day, from early morning to night. The Time Slots page shows every time converted to your own timezone.",
      },
      {
        q: "How long is each class?",
        a: "Each class runs 50–55 minutes, six days a week, with a different workout each day.",
      },
      {
        q: "Are the classes only for women?",
        a: "Fitness Zone is built for women, and every class is led by a female trainer.",
      },
      {
        q: "How do I join a class?",
        a: "Once your package is active, you join each class from your Fitness Zone profile — there's no link to find or group to scroll through.",
      },
    ],
  },

  "/postpartum-weight-loss": {
    eyebrow: "POSTPARTUM RECOVERY",
    title: "Postpartum Weight Loss Program for New Moms",
    intro:
      "Fitness Zone helps new moms lose weight after pregnancy at home, with a routine-friendly customized diet plan and doctor-safe home workouts led by female trainers. Classes run several times a day with recordings, so your plan fits around your baby — not the other way round.",
    packageType: "combo",
    serviceType: "Online postpartum weight loss program",
    sections: [
      {
        heading: "Built around life with a new baby",
        bullets: [
          "Train at home — no gym, no travel, no childcare to arrange",
          "Several live class times every day, plus recordings for broken nights",
          "Female trainers, and workouts suited to varying fitness levels",
          "A routine-friendly diet plan made from the home food you already cook",
          "No crash diets, powders or supplements",
        ],
      },
      {
        heading: "Your postpartum weight loss plan",
        lead: "The Both Combined package brings diet and exercise together in one plan.",
        steps: [
          [
            "Share your health details",
            "Include that you've recently given birth, how, and whether you're breastfeeding.",
          ],
          [
            "Get your diet plan within 24 hours",
            "Built by a dietitian around your needs, renewed every 15 days.",
          ],
          [
            "Join live home workouts",
            "50–55 minute classes, six days a week — or catch up with recordings.",
          ],
          [
            "Check in weekly",
            "Daily meal tracking and weekly follow-ups keep your plan on track.",
          ],
        ],
      },
      {
        heading: "Safety first after pregnancy",
        paragraphs: [
          "Every recovery is different — especially after a C-section. Start exercising once your doctor has cleared you, and tell us about your delivery and recovery so your plan can be built around it.",
        ],
        links: [
          ["Compare combined packages", "/plans?type=combo"],
          ["See class times in your timezone", "/timetable"],
        ],
      },
    ],
    faqs: [
      {
        q: "When can I start after giving birth?",
        a: "Once your doctor has cleared you to exercise. Recovery times differ, especially after a C-section, so tell us about your delivery when you share your health details.",
      },
      {
        q: "Can I follow the diet plan while breastfeeding?",
        a: "Tell your dietitian you're breastfeeding when you share your health details, so your customized diet plan is built around it.",
      },
      {
        q: "What if the baby means I miss a class?",
        a: "Several classes run every day, and recordings are provided — you can catch up whenever your baby lets you.",
      },
      {
        q: "Do I need to leave home or go to a gym?",
        a: "No. Everything — your diet plan, live workouts and check-ins — happens online, at home.",
      },
    ],
  },
};

export const programPaths = Object.keys(programs);
