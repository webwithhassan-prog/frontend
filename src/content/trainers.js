// The Trainers page's own text — shown on the page and, word for word, in
// the crawler-readable HTML and FAQPage data (seo/build.js). It stands on
// its own without the trainer list, which loads from the API: a page that
// only said "no trainers yet" while the API was unreachable was being
// reported by Google as a soft 404.

export const trainersIntro =
  "Every Fitness Zone class is led by a female fitness trainer. Our trainers teach live online workout classes for women — yoga, strength training, tabata, abs and full-body sessions — six days a week, so you can train at home with a woman leading you instead of in a mixed gym.";

export const trainersSections = [
  {
    heading: "Why train with a female trainer online",
    bullets: [
      "A female trainer leads every live class",
      "Train privately at home — no mixed gym, no commute",
      "Several class times every day, shown in your timezone",
      "Recordings provided if you miss a class",
      "Workouts suited to varying fitness levels",
      "Join from your Fitness Zone profile — no links to hunt for, no groups to scroll through",
    ],
  },
  {
    heading: "Fitness classes built for women",
    paragraphs: [
      "Many women — including many Muslim women — would rather exercise with a female trainer than in a mixed gym. Fitness Zone is built for women, so you get live, trainer-led classes at home, wherever you are in the world.",
    ],
  },
  {
    heading: "What our trainers lead each week",
    bullets: [
      "Yoga and stretching",
      "Upper body strength training",
      "Lower body strength training",
      "Aerobics and tabata",
      "Abs and belly workouts",
      "Full body workouts",
    ],
  },
];

export const trainersLinks = [
  ["See class times in your timezone", "/timetable"],
  ["About the live online classes", "/online-workout-classes"],
  ["Home workout packages", "/plans?type=workout"],
];

export const trainersFaqs = [
  {
    q: "Are all the trainers women?",
    a: "Yes. Every Fitness Zone class is led by a female trainer.",
  },
  {
    q: "Is it one-to-one personal training?",
    a: "Classes are live group classes led by a female trainer. Your diet plan is one-to-one: a dietitian builds it for you and follows up every week.",
  },
  {
    q: "Can I train with a female trainer from any country?",
    a: "Yes. Classes are online, times are shown in your own timezone, and recordings are provided.",
  },
];
