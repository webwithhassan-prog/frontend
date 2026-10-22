// Blog posts: in-depth guides for the searches the program pages can't
// answer on their own ("pcos diet plan", "postpartum weight loss while
// breastfeeding", "pakistani diet plan for weight loss", "home workout for
// women"). Research, Oct 2026: the pages ranking for these are 900–2,400
// word articles with a sample day built from local food, a table of
// contents and FAQs (Marham, Oladoc, ProPakistani) — almost none are written
// around desi food for PCOS or for breastfeeding moms, which is the gap.
//
// Rendered by BlogPost and, word for word, into the crawler-readable HTML,
// BlogPosting and FAQPage data by seo/build.js. Health guidance here stays
// with mainstream, widely published advice and always points to a doctor
// for medical decisions. `reviewedBy` stays null until a named dietitian has
// actually reviewed the post — never fill it in for them.
//
// Section shape: { heading, paragraphs?, bullets?, table?: { head, rows },
// note? }.

export const posts = [
  {
    slug: "pcos-diet-plan-desi-food",
    title:
      "PCOS Diet Plan for Weight Loss with Desi Food (Sample Day Included)",
    metaTitle: "PCOS Diet Plan for Weight Loss with Desi Food",
    description:
      "What to eat with PCOS or PCOD using everyday Pakistani and Indian food — roti, daal, salan and chai — with simple swaps and a sample day.",
    category: "PCOS & PCOD",
    date: "2026-10-22",
    updated: "2026-10-22",
    author: "Fitness Zone Team",
    reviewedBy: null,
    program: ["/pcos-diet-plan", "PCOS, PCOD & thyroid diet plan"],
    intro:
      "You don't need imported superfoods or a diet that bans roti to manage PCOS. Most women with PCOS can make real progress with the food already cooked at home — by changing what goes on the plate, how much, and when. This guide shows how, using desi food.",
    sections: [
      {
        heading: "Why diet matters so much with PCOS",
        paragraphs: [
          "Many women with PCOS (polycystic ovary syndrome, often called PCOD in South Asia) have insulin resistance: the body needs more insulin than usual to handle the sugar from food. Higher insulin can push the ovaries to make more androgens, which is linked to irregular periods, acne, unwanted hair and weight that's hard to shift — especially around the belly.",
          "The encouraging part is how little it can take. Losing around 5–10% of your body weight — 4 to 8 kg for someone who weighs 80 kg — is widely reported to improve periods, insulin levels and other symptoms. You don't have to reach a 'perfect' weight to feel the difference.",
        ],
      },
      {
        heading: "The five rules that matter most",
        bullets: [
          "Protein at every meal — eggs, daal, chana, chicken, fish, yogurt or paneer. Protein keeps you full and slows the rise in blood sugar.",
          "Fibre before refined carbs — fill half the plate with sabzi or salad, and choose chakki atta over maida.",
          "Smaller portions of rice and roti, not zero — one roti or a small cup of rice with plenty of daal and sabzi works for most people.",
          "Drink your calories less — sugar in chai, cold drinks, packaged juice and sweet lassi add up fast.",
          "Eat at regular times — long gaps followed by a big dinner make cravings and blood sugar swings worse.",
        ],
      },
      {
        heading: "Easy desi swaps",
        paragraphs: [
          "Small swaps you repeat every day beat a strict diet you abandon after a week.",
        ],
        table: {
          head: ["Instead of", "Try"],
          rows: [
            [
              "Maida naan or paratha",
              "One chakki atta roti, or roti with an egg",
            ],
            [
              "A full plate of white rice",
              "A small cup of rice with extra daal and sabzi",
            ],
            [
              "Chai with two spoons of sugar",
              "Cut down half a spoon at a time",
            ],
            [
              "Samosa, pakora or nimko",
              "Roasted chana or a small handful of nuts",
            ],
            ["Packaged juice", "A whole fruit — guava, apple, orange or pear"],
            [
              "Biscuits or rusk with chai",
              "Chai on its own, or with a few almonds",
            ],
            [
              "Salan floating in oil",
              "The same salan with a measured spoon or two of oil",
            ],
          ],
        },
      },
      {
        heading: "A sample PCOS-friendly day",
        paragraphs: [
          "An example of how a day can look — not a prescription. Portions depend on your weight, height, activity and goals, which is why a personal plan works better than any chart.",
        ],
        table: {
          head: ["Meal", "Example"],
          rows: [
            [
              "Breakfast",
              "Two-egg omelette with onion, tomato and spinach, plus one small chakki atta roti — or daliya cooked in milk with a few nuts",
            ],
            ["Mid-morning", "One fruit (guava or apple) and 5–6 almonds"],
            [
              "Lunch",
              "One roti, chicken or daal salan with little oil, a big salad and a small bowl of raita",
            ],
            ["Evening", "Chai with less sugar and a handful of roasted chana"],
            [
              "Dinner",
              "Chicken, fish or paneer tikka or karahi with sabzi; half a roti or none",
            ],
          ],
        },
        note: "Have a thyroid condition or diabetes, or take medication such as metformin? Plan around it with your doctor or dietitian.",
      },
      {
        heading: "Movement: the other half of PCOS care",
        paragraphs: [
          "Exercise improves how your body responds to insulin even before the scale moves. The general guidance for adults is at least 150 minutes of moderate activity a week — a brisk 30-minute walk five days a week counts — plus strength training on two days.",
          "Strength work matters with PCOS because muscle uses blood sugar. Squats, lunges, push-ups against a wall and glute bridges at home are a good start.",
        ],
      },
      {
        heading: "PCOS diet myths",
        bullets: [
          '"You must stop eating roti." Portion and atta type matter far more than cutting it out.',
          '"Dairy and gluten are banned." There\'s no need to cut them unless you have a diagnosed intolerance or your doctor advises it.',
          '"A PCOS tea or supplement will fix it." None replaces a balanced diet, movement and medical care.',
          '"Skipping breakfast helps." For many women it leads to bigger cravings later in the day.',
        ],
      },
      {
        heading: "When to see a doctor",
        paragraphs: [
          "See a doctor if your periods are very irregular or absent, if you're trying to get pregnant, or if you have symptoms such as heavy hair growth, severe acne or dark patches of skin. PCOS is diagnosed by a doctor, and some women need medication alongside diet and exercise.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can I eat rice with PCOS?",
        a: "Yes, in a smaller portion. A small cup of rice with plenty of daal, sabzi and some protein is a better choice than a full plate of rice on its own.",
      },
      {
        q: "Is roti good or bad for PCOS?",
        a: "Roti made from chakki (whole wheat) atta is a reasonable choice in a sensible portion — usually one or two a meal, depending on your needs. Maida naan and paratha are best kept occasional.",
      },
      {
        q: "How much weight do I need to lose to help PCOS?",
        a: "Losing around 5–10% of your body weight is widely reported to improve periods and other PCOS symptoms.",
      },
      {
        q: "Which fruits are best with PCOS?",
        a: "Whole fruits with skin and fibre — guava, apple, pear, orange and berries — eaten one portion at a time. Juice and very large portions of mango are better kept occasional.",
      },
      {
        q: "Should I avoid dairy with PCOS?",
        a: "Not unless you have an intolerance or your doctor advises it. Plain yogurt and milk can be part of a PCOS-friendly diet.",
      },
    ],
  },

  {
    slug: "postpartum-weight-loss-breastfeeding",
    title:
      "Postpartum Weight Loss While Breastfeeding: A Safe Guide for Desi Moms",
    metaTitle: "Postpartum Weight Loss While Breastfeeding",
    description:
      "When to start losing baby weight, how fast is safe while breastfeeding, what panjiri and ghee really do, and a sample day of desi meals for new moms.",
    category: "Postpartum",
    date: "2026-10-22",
    updated: "2026-10-22",
    author: "Fitness Zone Team",
    reviewedBy: null,
    program: ["/postpartum-weight-loss", "Postpartum weight loss program"],
    intro:
      "After having a baby, the pressure to 'get your body back' can start in the hospital. But losing weight while breastfeeding is something to do slowly and safely — for you and for your milk supply. Here's what's realistic, with food you already eat.",
    sections: [
      {
        heading: "When can I start losing weight after delivery?",
        paragraphs: [
          "Your body needs time to recover first. Most mothers have a postpartum check-up around six weeks after birth, and that's the usual point to ask your doctor about exercise — after a C-section or a difficult delivery, it can take longer.",
          "If you're breastfeeding, many experts suggest waiting until about two months after birth before actively cutting calories, so your milk supply has time to settle. Until then, focus on eating well, gentle walks and rest when you can.",
        ],
      },
      {
        heading: "How fast is safe while breastfeeding?",
        paragraphs: [
          "Aim for slow and steady: around half a kilo (about 1 lb) a week. Losing weight faster than that, or eating very little, can lower your energy and may reduce your milk supply.",
          "Breastfeeding uses energy — roughly 400–500 extra calories a day. Most guidance advises breastfeeding mothers not to go much below about 1,800 calories a day without medical advice. That's why crash diets and long fasts are a bad fit right now.",
          "Most women lose pregnancy weight gradually over six months to a year. That's normal, not slow.",
        ],
      },
      {
        heading: "Panjiri, ghee and traditional foods",
        paragraphs: [
          "Panjiri, gond ke laddoo, harira and extra desi ghee are a loving tradition in many families. There's little evidence they increase milk supply, and they're very high in calories — a single laddoo can carry as much energy as a full meal.",
          "You don't have to refuse them. Enjoy a small portion as part of your day rather than on top of three full meals, and lean on regular food — roti, daal, sabzi, eggs, chicken and yogurt — for your actual nourishment.",
        ],
      },
      {
        heading: "What to eat: the breastfeeding plate",
        bullets: [
          "Protein at each meal — eggs, daal, chana, chicken, fish, yogurt, milk or paneer.",
          "Calcium every day — milk, yogurt, lassi without sugar, or paneer.",
          "Iron-rich food — daal, chana, spinach, eggs and meat — especially if you lost a lot of blood at delivery.",
          "Whole grains — chakki atta roti and daliya rather than maida.",
          "Plenty of sabzi and fruit for fibre, which also helps with constipation after birth.",
          "Water by your side whenever you feed, and drink to thirst.",
        ],
      },
      {
        heading: "A sample day for a breastfeeding mom",
        paragraphs: [
          "An example only — you may need more or less depending on your size, activity and how much you're feeding.",
        ],
        table: {
          head: ["Meal", "Example"],
          rows: [
            [
              "Breakfast",
              "Daliya cooked in milk with nuts, or two eggs with one chakki atta roti",
            ],
            ["Mid-morning", "A fruit and a glass of milk or unsweetened lassi"],
            [
              "Lunch",
              "One or two roti, daal or chicken salan with light oil, sabzi and raita",
            ],
            [
              "Evening",
              "Chai with less sugar, roasted chana or a small piece of panjiri",
            ],
            [
              "Dinner",
              "Rice or roti with fish, chicken or chana, and a big serving of sabzi",
            ],
            [
              "Night feed",
              "If you're hungry: a small bowl of yogurt or a few nuts",
            ],
          ],
        },
      },
      {
        heading: "Exercise after pregnancy",
        bullets: [
          "Start with walking and pelvic floor exercises — usually fine early on, but check with your doctor.",
          "After your doctor clears you, build up to strength exercises such as squats, glute bridges and gentle core work.",
          "Notice a bulge down the middle of your tummy when you sit up? It may be diastasis recti (separated tummy muscles) — ask your doctor or a physiotherapist before doing crunches.",
          "Stop and seek advice if you have pain, heavy bleeding or leaking when you exercise.",
        ],
        note: "After a C-section, recovery usually takes longer. Wait for your doctor's go-ahead before any exercise beyond gentle walking.",
      },
      {
        heading: "Sleep, stress and being kind to yourself",
        paragraphs: [
          "Broken nights make cravings stronger and make it harder to stick to anything. Rest when the baby rests if you can, accept help from family, and keep healthy snacks within reach so tiredness doesn't decide what you eat.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will dieting reduce my breast milk?",
        a: "Eating too little or losing weight too quickly can affect your energy and may reduce supply. A slow loss of about half a kilo a week, with regular balanced meals, is the usual advice.",
      },
      {
        q: "How long does it take to lose baby weight?",
        a: "Most women lose it gradually over six months to a year. Every body and every pregnancy is different.",
      },
      {
        q: "Can I do workouts while breastfeeding?",
        a: "Yes, once your doctor has cleared you to exercise. Feeding or pumping before a workout and wearing a supportive bra can make it more comfortable.",
      },
      {
        q: "Is panjiri fattening?",
        a: "It's very high in calories because of the ghee, sugar and nuts. A small portion can fit into your day — it just shouldn't come on top of three full meals.",
      },
      {
        q: "When can I exercise after a C-section?",
        a: "Gentle walking is usually encouraged early, but wait for your doctor's go-ahead — often after your postpartum check-up — before anything more.",
      },
    ],
  },

  {
    slug: "pakistani-diet-plan-for-weight-loss-women",
    title:
      "Pakistani Diet Plan for Weight Loss for Women: Simple Rules and a 3-Day Sample",
    metaTitle: "Pakistani Diet Plan for Weight Loss for Women",
    description:
      "Lose weight on the food you already cook: the desi plate method, the hidden calories in oil and chai, a 3-day sample menu and dawat tips.",
    category: "Weight loss",
    date: "2026-10-22",
    updated: "2026-10-22",
    author: "Fitness Zone Team",
    reviewedBy: null,
    program: ["/online-diet-plan", "Customized online diet plan"],
    intro:
      "Most weight loss plans fail in Pakistani homes for one reason: they ask you to eat food nobody else in the family is eating. You don't need a separate pot. These simple rules work with the same roti, daal and salan the whole family eats.",
    sections: [
      {
        heading: "How weight loss actually works",
        paragraphs: [
          "You lose weight when you take in a little less energy than your body uses. A steady pace of about half a kilo a week is realistic and easier to keep off than fast loss from a crash diet.",
          "That doesn't mean counting every calorie. For most women, the changes below create that gap on their own.",
        ],
      },
      {
        heading: "The desi plate method",
        bullets: [
          "Half the plate: sabzi or salad — cooked vegetables, kachumber, cucumber, raita.",
          "A quarter: protein — chicken, fish, eggs, daal, chana or paneer.",
          "A quarter: roti or rice — usually one chakki atta roti or a small cup of rice.",
          "Use your own plate at family meals: the same food, different proportions.",
        ],
      },
      {
        heading: "The hidden calories: oil, chai and drinks",
        paragraphs: [
          "One tablespoon of cooking oil carries roughly 120 calories. Many salans are cooked with several tablespoons per person, which can quietly double the calories in an otherwise healthy meal. Measuring the oil — and taking curry from the bottom of the pot rather than the oily top — makes a big difference.",
          "Drinks are the other hidden source. Two or three cups of chai a day with two spoons of sugar, a cold drink with lunch or a glass of sweet lassi can add several hundred calories without filling you up.",
        ],
      },
      {
        heading: "A 3-day sample menu",
        paragraphs: [
          "An example to show the idea — portions vary from person to person.",
        ],
        table: {
          head: ["", "Day 1", "Day 2", "Day 3"],
          rows: [
            [
              "Breakfast",
              "Two-egg omelette with vegetables, one roti",
              "Daliya cooked in milk with nuts",
              "Yogurt with fruit and a few almonds",
            ],
            [
              "Snack",
              "One fruit",
              "Roasted chana",
              "Chai with less sugar and 5–6 almonds",
            ],
            [
              "Lunch",
              "One roti, daal, sabzi, salad",
              "Small cup of rice, chana, raita, salad",
              "One roti, chicken salan with light oil, salad",
            ],
            [
              "Evening",
              "Chai with less sugar",
              "One fruit",
              "Roasted makhana or chana",
            ],
            [
              "Dinner",
              "Grilled chicken or fish with sabzi",
              "Chicken karahi with little oil, half a roti, salad",
              "Daal with sabzi and one roti",
            ],
          ],
        },
      },
      {
        heading: "Dawats, weddings and eating out",
        bullets: [
          "Don't arrive starving — eat a small snack with protein before you go.",
          "Fill half your plate with salad, tikka or grilled items first.",
          "Pick one favourite — biryani or naan or dessert — instead of all three.",
          "Skip the cold drink and have water or a lemon soda without sugar.",
          "One heavy meal doesn't undo your progress. Go back to your usual plate the next day.",
        ],
      },
      {
        heading: "Common mistakes",
        bullets: [
          "Skipping breakfast, then overeating at night.",
          "Cutting out roti completely for a week, then giving up.",
          "Relying on green tea, detox drinks or pills instead of meals.",
          "Weighing yourself every day — weight goes up and down with water; weekly is enough.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many calories should a woman eat to lose weight?",
        a: "It depends on your age, height, weight and activity. Many women lose weight at around 1,400–1,600 calories a day, but most guidance advises not going below about 1,200 without medical supervision.",
      },
      {
        q: "Can I lose weight without exercise?",
        a: "Yes — diet drives most weight loss. Exercise helps you keep muscle, lose more fat than muscle, and keep the weight off, so it's worth adding.",
      },
      {
        q: "Do I need green tea or detox drinks?",
        a: "No. They don't cause meaningful weight loss on their own. Regular meals, sensible portions and fewer sugary drinks matter far more.",
      },
      {
        q: "Is skipping dinner a good way to lose weight?",
        a: "It works for some people but often backfires with late-night snacking. A lighter dinner with protein and sabzi is easier to keep up.",
      },
    ],
  },

  {
    slug: "home-workout-routine-for-women",
    title:
      "Home Workout Routine for Women: A 6-Day Weekly Plan (No Gym Needed)",
    metaTitle: "Home Workout Routine for Women: 6-Day Plan",
    description:
      "A simple 6-day home workout plan for women and beginners — yoga, upper body, lower body, cardio, abs and full body — with sets and reps. No equipment needed.",
    category: "Home workouts",
    date: "2026-10-22",
    updated: "2026-10-22",
    author: "Fitness Zone Team",
    reviewedBy: null,
    program: ["/home-workout-for-women", "Live home workouts for women"],
    intro:
      "You don't need a gym or equipment to get fitter at home. A week that trains something different each day keeps your whole body working and stops it feeling repetitive. This is the same weekly structure our live classes follow, written out so you can start on your own.",
    sections: [
      {
        heading: "Before you start",
        bullets: [
          "Warm up for 5 minutes: march on the spot, arm circles and gentle squats.",
          "Cool down for 5 minutes with slow stretches.",
          "Beginners: start with 2 rounds of each workout; build up to 3 over a few weeks.",
          "Rest 30–60 seconds between exercises.",
          "If you're pregnant, recently gave birth, or have a heart, joint or blood pressure condition, check with your doctor first.",
        ],
      },
      {
        heading: "Your weekly plan",
        table: {
          head: ["Day", "Focus", "Exercises"],
          rows: [
            [
              "Monday",
              "Yoga and stretching",
              "Cat-cow, child's pose, downward dog, low lunge stretch, seated forward bend — hold each for 30–45 seconds",
            ],
            [
              "Tuesday",
              "Upper body",
              "Wall or knee push-ups ×10, chair dips ×10, plank shoulder taps ×10 each side, superman hold ×20 seconds",
            ],
            [
              "Wednesday",
              "Lower body",
              "Squats ×15, reverse lunges ×10 each leg, glute bridges ×15, side-lying leg lifts ×12 each side",
            ],
            [
              "Thursday",
              "Cardio and tabata",
              "20 seconds on, 10 seconds rest, 8 rounds: jumping jacks or step jacks, high knees, squat to reach, skaters",
            ],
            [
              "Friday",
              "Abs and core",
              "Dead bug ×10 each side, bird dog ×10 each side, plank ×20–30 seconds, heel taps ×20",
            ],
            [
              "Saturday",
              "Full body",
              "Squat to press-up from knees ×10, glute bridges ×15, mountain climbers ×20, plank ×30 seconds",
            ],
            [
              "Sunday",
              "Rest",
              "A relaxed walk, stretching — and planning your meals for the week",
            ],
          ],
        },
      },
      {
        heading: "Can home workouts reduce belly fat?",
        paragraphs: [
          "Abs and core work make your middle stronger, but you can't choose where your body loses fat. Belly fat comes off as part of overall fat loss — from regular full-body training together with the right food.",
          "That's why the plan mixes strength, cardio and core rather than doing hundreds of crunches.",
        ],
      },
      {
        heading: "How to keep progressing",
        bullets: [
          "When an exercise feels easy, add 2–3 reps or a third round.",
          "Move from wall push-ups to knee push-ups, then full push-ups.",
          "Hold water bottles or a filled school bag for squats and lunges.",
          "Slow the lowering part of each move — it makes it harder without equipment.",
        ],
      },
      {
        heading: "Why a live class helps",
        paragraphs: [
          "The hardest part of working out at home is keeping going. A trainer leading you live checks your form, sets the pace, and gives you a fixed time to show up — which is often what turns a plan on paper into a habit.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this home workout plan good for beginners?",
        a: "Yes. Start with two rounds of each workout and the easier versions of each move, then add rounds and reps as you get stronger.",
      },
      {
        q: "How long should a home workout be?",
        a: "Around 30–50 minutes including warm-up and cool-down works well. Even 20 minutes is worthwhile on a busy day.",
      },
      {
        q: "Do I need any equipment?",
        a: "No. Everything here uses your body weight. Water bottles or a bag can add weight as you progress.",
      },
      {
        q: "How soon will I see results?",
        a: "Most people feel fitter and stronger within 3–4 weeks of training regularly. Visible changes usually take a few months, and depend a lot on food too.",
      },
    ],
  },
];

export const postBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

export const postPath = (post) => `/blog/${post.slug}`;

// Rough reading time from all the post's words.
export const readingMinutes = (post) => {
  const text = [
    post.intro,
    ...post.sections.flatMap((s) => [
      s.heading,
      ...(s.paragraphs || []),
      ...(s.bullets || []),
      ...(s.table ? s.table.rows.flat() : []),
      s.note || "",
    ]),
    ...post.faqs.flatMap((f) => [f.q, f.a]),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 200));
};

// Section ids for the table of contents.
export const sectionId = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
