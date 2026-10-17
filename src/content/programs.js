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
      {
        heading: "Diet plans for PCOS, thyroid and menopause",
        paragraphs: [
          "Living with PCOS or PCOD, a thyroid condition, insulin resistance or menopause? Share it with your dietitian and your plan is built around it.",
        ],
        links: [
          ["PCOS, PCOD & thyroid diet plan", "/pcos-diet-plan"],
          ["Menopause & insulin resistance", "/menopause-weight-loss"],
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
        q: "Do I get an online dietitian?",
        a: "Yes. Your plan is built by a dietitian from the health details you share, and dietitian support continues throughout with weekly follow-ups — all online, from any country.",
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
          "It's a group class format with a trainer leading live, so you get the energy and accountability of a studio class without the commute — an online gym for women, at home.",
        ],
        links: [
          ["Home workouts for women & girls", "/home-workout-for-women"],
          ["Meet our female trainers", "/trainers"],
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
        q: "Is it like an online gym for women?",
        a: "Yes — live online fitness classes for women, led by female trainers, six days a week. You get a trainer-led class from home, without the commute.",
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
          "A routine-friendly diet plan after delivery, made from the home food you already cook",
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

  "/home-workout-for-women": {
    eyebrow: "HOME WORKOUTS",
    title: "Home Workouts for Women & Girls",
    faqIntro: "Common questions about our home workouts for women.",
    intro:
      "Fitness Zone's home workouts for women and girls are live, trainer-led classes you join from your own home — no gym needed. A female trainer leads a different 50–55 minute workout every day, six days a week, at several times a day, with recordings — and the classes suit varying fitness levels, from beginners up.",
    packageType: "workout",
    serviceType: "Online home workout classes",
    sections: [
      {
        heading: "A home workout routine for the whole week",
        lead: "Each day trains something different, so your routine covers the whole body.",
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
        heading: "Workouts for ladies at home, led live",
        lead: "A guided class beats guessing your way through a random video.",
        bullets: [
          "A female trainer leads every class, live",
          "Guided, interactive workouts you follow in real time",
          "Several class times every day, shown in your timezone",
          "Recordings provided if you miss a class",
          "Suited to varying fitness levels — start where you are",
          "Join from your Fitness Zone profile — no links to hunt for, no groups to scroll through",
        ],
      },
      {
        heading: "Home workouts to lose weight and belly fat",
        paragraphs: [
          "Abs and belly workouts are part of every week, but belly fat comes off as part of overall fat loss — which is why the classes mix strength, cardio and full-body training rather than endless crunches.",
          "For steadier results, pair your home workouts with a customized diet plan built from the food you already eat at home: the Both Combined package gives you both at one price.",
        ],
        links: [
          ["Learn about the customized diet plan", "/online-diet-plan"],
          ["Compare home workout packages", "/plans?type=workout"],
        ],
      },
      {
        heading: "An online gym for women, from anywhere",
        paragraphs: [
          "Fitness Zone is an online fitness platform for women: every class is a home workout you join from your living room, wherever you are in the world. Class times are shown in your own timezone and packages are priced in your local currency.",
        ],
        links: [
          ["Meet our female trainers", "/trainers"],
          ["About our live online workout classes", "/online-workout-classes"],
        ],
      },
    ],
    faqs: [
      {
        q: "Are the home workouts suitable for beginners?",
        a: "Yes. Classes are suited to varying fitness levels, so you can start where you are and build up over time.",
      },
      {
        q: "Can I lose belly fat with home workouts?",
        a: "Abs and belly workouts are part of every week, and belly fat comes off as part of overall fat loss — from consistent full-body training together with the right food. The Both Combined package adds a customized diet plan to your workouts.",
      },
      {
        q: "Do I need to go to a gym?",
        a: "No. Every class is a live home workout you join from your Fitness Zone profile, from anywhere in the world.",
      },
      {
        q: "Who leads the workouts?",
        a: "Every class is led by a female trainer.",
      },
      {
        q: "What if I miss a class?",
        a: "Several classes run every day, and recordings are provided so you can catch up whenever suits you.",
      },
    ],
  },

  "/pcos-diet-plan": {
    eyebrow: "PCOS · PCOD · THYROID",
    title: "PCOS, PCOD & Thyroid Diet Plan for Weight Loss",
    faqIntro: "Common questions about our PCOS, PCOD and thyroid diet plans.",
    intro:
      "Fitness Zone builds a customized PCOS, PCOD or thyroid diet plan for weight loss around your diagnosis, your goal and the food you already eat at home. A dietitian prepares your personal plan within 24 hours of you sharing your health details, follows up every week and renews it every 15 days — real food only, no pills or supplements.",
    packageType: "combo",
    serviceType: "Online PCOS and thyroid diet plan",
    sections: [
      {
        heading: "Not a generic PCOD diet chart",
        paragraphs: [
          "A PCOD diet chart or PDF gives everyone the same list. Your plan starts from you: share your diagnosis — PCOS or PCOD, hypothyroidism or another thyroid condition, insulin resistance — any medication, your goal and the foods you eat, and your dietitian builds a home-based menu around it.",
          "Because it's made from your own cuisine — desi, Arabic, Western or anything else — it's a plan you can keep following, not one you abandon after a week.",
        ],
      },
      {
        heading: "What your PCOS diet plan includes",
        bullets: [
          "A dietitian-built plan around your condition and goal",
          "A home-based menu from the foods you prefer",
          "Daily meal tracking to keep you on course",
          "Weekly follow-ups to adjust what isn't working",
          "A new plan every 15 days as your body changes",
          "Real, whole food only — no powders, pills or supplements",
        ],
      },
      {
        heading: "How it works",
        lead: "From sign-up to your first meal plan takes about a day.",
        steps: [
          [
            "Choose your package",
            "A diet plan on its own, or Both Combined with live home workouts.",
          ],
          [
            "Share your health details",
            "Include your PCOS, PCOD or thyroid diagnosis, any medication, your goal and your food preferences.",
          ],
          [
            "Get your plan within 24 hours",
            "Your dietitian builds your personalized meal plan around your condition.",
          ],
          [
            "Track, check in, renew",
            "Log meals daily, get weekly follow-ups, and a new plan every 15 days.",
          ],
        ],
      },
      {
        heading: "Diet plus home workouts",
        paragraphs: [
          "Regular exercise is widely recommended alongside diet for PCOS and thyroid-related weight gain. The Both Combined package adds live home workout classes with female trainers — 50–55 minutes, six days a week, suited to varying fitness levels.",
        ],
        links: [
          ["Compare combined packages", "/plans?type=combo"],
          ["Diet plan only", "/plans?type=dietplan"],
          ["See the live workout classes", "/online-workout-classes"],
        ],
      },
      {
        heading: "Works alongside your doctor",
        paragraphs: [
          "Your diet plan supports your health — it doesn't replace medical care. Keep following your doctor's advice and any prescribed medication, and tell your dietitian about it so your plan fits around it.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you make diet plans for PCOS and PCOD?",
        a: "Yes. Tell your dietitian about your PCOS or PCOD when you share your health details, and your customized diet plan is built around it — using the foods you already eat at home.",
      },
      {
        q: "Is there a thyroid diet plan for weight loss?",
        a: "Yes. Share your thyroid condition — for example hypothyroidism — and any medication, and your dietitian builds your weight loss plan around it.",
      },
      {
        q: "Is this the same as a PCOD diet chart or PDF?",
        a: "No. A chart gives everyone the same list; your plan is made for you, followed up every week and renewed every 15 days as you progress.",
      },
      {
        q: "Do I need supplements or pills?",
        a: "No. Fitness Zone plans use real, whole food only — no powders, pills or supplements.",
      },
      {
        q: "Can I join from any country?",
        a: "Yes — Pakistan, India, the UK, the Gulf or anywhere else. Everything happens online, prices are shown in your local currency, and your plan uses the food you cook at home.",
      },
    ],
  },

  "/menopause-weight-loss": {
    eyebrow: "MENOPAUSE · INSULIN RESISTANCE",
    title: "Menopause & Insulin Resistance Weight Loss for Women",
    faqIntro: "Common questions about weight loss in menopause and with insulin resistance.",
    intro:
      "Fitness Zone helps women in perimenopause, menopause or with insulin resistance lose weight at home — with a customized diet plan built around their health and the food they already eat, and live home workouts suited to varying fitness levels. Real food, steady habits and weekly follow-ups: no pills, powders or crash diets.",
    packageType: "dietplan",
    serviceType: "Online menopause weight loss program",
    sections: [
      {
        heading: "A weight loss plan for women over 40 and 50",
        paragraphs: [
          "Weight that used to shift often stops shifting after 40, and the diets that once worked stop working. A plan built around you — not a generic diet — is what makes the difference.",
          "Share where you are — perimenopause, menopause, insulin resistance, any other health conditions or medication — and your dietitian builds your plan around it.",
        ],
      },
      {
        heading: "What's included",
        bullets: [
          "A dietitian-built plan around your health and goal",
          "A home-based menu from the foods you prefer",
          "Daily meal tracking and weekly follow-ups",
          "A new plan every 15 days as your body changes",
          "Real, whole food only — no powders, pills or supplements",
          "Optional live home workouts with female trainers",
        ],
      },
      {
        heading: "An insulin resistance diet plan made from your own food",
        paragraphs: [
          "Insulin resistance diet food lists are everywhere, but a list isn't a plan. Your dietitian turns your health details into a home-based menu from the foods you already cook, follows up every week and renews your plan every 15 days.",
        ],
      },
      {
        heading: "Strength and movement at home",
        paragraphs: [
          "Live classes include upper and lower body strength training, yoga and stretching, and full-body sessions — 50–55 minutes, six days a week, with recordings, so you can train at home at a pace that suits you.",
        ],
        links: [
          ["See the live workout classes", "/online-workout-classes"],
          ["Compare diet plan packages", "/plans?type=dietplan"],
          ["Diet plan and workouts together", "/plans?type=combo"],
        ],
      },
      {
        heading: "Works alongside your doctor",
        paragraphs: [
          "Your plan supports your health — it doesn't replace medical care. Keep following your doctor's advice and any prescribed medication or treatment, and tell your dietitian about it so your plan fits around it.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you help with weight loss during menopause?",
        a: "Yes. Tell your dietitian whether you're in perimenopause or menopause, plus any health conditions or medication, and your customized diet plan is built around it.",
      },
      {
        q: "Do you make diet plans for insulin resistance?",
        a: "Yes. Share your insulin resistance diagnosis and your goal, and your dietitian builds your plan around it, using real food from your own cuisine.",
      },
      {
        q: "Are the workouts suitable for women over 50?",
        a: "Classes are suited to varying fitness levels, and recordings let you go at your own pace. If you have a health condition, check with your doctor before starting a new exercise routine.",
      },
      {
        q: "Do I need menopause supplements or pills?",
        a: "No. Fitness Zone plans use real, whole food only — no powders, pills or supplements.",
      },
    ],
  },
};

export const programPaths = Object.keys(programs);
