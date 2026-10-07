/* global process */
// Build-time SEO/GEO for the public pages.
//
// The site is a single-page app: without JavaScript every URL is an empty
// <div id="root">. Google runs the JavaScript, but most AI assistants'
// crawlers (ChatGPT, Claude, Perplexity...) read the raw HTML only — so to
// them every page was blank. For each page in pageMeta this writes its own
// HTML file with:
//   - its title, description, robots, canonical and social tags;
//   - structured data (JSON-LD) describing the business and the page;
//   - a plain, readable version of the page's content inside #root, which
//     React replaces the moment the app starts (visitors never see it — it
//     is visually hidden until then — while crawlers read it as the page).
// It also writes /llms.txt (a plain-language brief for AI assistants), the
// sitemap, and the 404 page. Live data (packages, timetable, trainers,
// e-books, contact numbers) is fetched from the public API at build time;
// if the API can't be reached, pages are built from the static copy only.
import { getPageMeta, pageMeta, SITE_ORIGIN } from "../src/utils/pageMeta.js";
import { faqs, plansFaqs } from "../src/content/faq.js";
import { optimizeCloudinaryUrl } from "../src/utils/cloudinary.js";

const API = process.env.SEO_API_URL || "https://fitnesszone-backend.onrender.com/api";

const ORG = {
  name: "Fitness Zone",
  legalName: "FITNESSZONE OFFICIAL LTD",
  founded: "2023",
  founder: "M Abu Bakar Siddique",
  email: "fitnesszoneofficial.uk26@gmail.com",
  instagram: "https://www.instagram.com/fitness_zone5566",
  address: {
    streetAddress: "Office 20790, 182–184 High Street North",
    addressLocality: "London",
    postalCode: "E6 2JA",
    addressCountry: "GB",
  },
};

const TYPE_NAMES = {
  dietplan: "Customized Dietplan",
  workout: "Home Workouts",
  combo: "Both Combined (Dietplan + Home Workouts)",
};

// Same fallbacks the packages page shows when a plan has no features set.
const DEFAULT_FEATURES = {
  dietplan: [
    "Dietitian support",
    "Home-based menu",
    "Health-specific / preferred food only",
    "Daily meal tracking",
    "Weekly follow-up",
    "Renews every 15 days",
  ],
  workout: [
    "Flexible timings",
    "50-55 minute sessions",
    "6 days a week",
    "Different workout daily",
    "Female trainers",
    "Recordings provided",
  ],
};

const STEPS = [
  ["Choose your path", "Pick a Dietplan, Home Workouts, or both — combine them for full support."],
  ["Get matched & scheduled", "We assign your trainer and set your timetable around your week."],
  ["Join your workout", "Join from your dashboard — no links to hunt for, no groups to scroll through."],
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pageName = (title) => title.split(" | ")[0];
const absolute = (path) => `${SITE_ORIGIN}${path}`;
const indexable = () => Object.entries(pageMeta).filter(([, m]) => !m.noindex);

const getJson = async (path) => {
  try {
    // Generous: the API host can take a while to wake from idle.
    const res = await fetch(`${API}${path}`, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[seo] ${path} unavailable (${err.message}) — building without it`);
    return null;
  }
};

export const loadSiteData = async () => {
  const [heroBanners, plans, dayPlans, timeSlots, trainers, ebooks, courses, settings] = await Promise.all([
    getJson("/hero-banners/public"),
    getJson("/plans/public"),
    getJson("/day-plans/public"),
    getJson("/time-slots/public"),
    getJson("/trainers/public"),
    getJson("/ebooks/public"),
    getJson("/courses/public"),
    getJson("/settings"),
  ]);
  return {
    heroBanners: Array.isArray(heroBanners) ? heroBanners : [],
    plans: Array.isArray(plans) ? plans : [],
    dayPlans: Array.isArray(dayPlans) ? dayPlans : [],
    timeSlots: Array.isArray(timeSlots) ? timeSlots : [],
    trainers: Array.isArray(trainers) ? trainers : [],
    ebooks: Array.isArray(ebooks) ? ebooks : [],
    courses: Array.isArray(courses) ? courses : [],
    settings: settings && typeof settings === "object" ? settings : {},
  };
};

// ---- facts derived from the live data ---------------------------------

const durationsByType = (plans) => {
  const out = {};
  for (const type of Object.keys(TYPE_NAMES)) {
    out[type] = [...new Set(plans.filter((p) => p.product_type === type).map((p) => p.duration_days))].sort(
      (a, b) => a - b,
    );
  }
  return out;
};

const featuresFor = (plans, type) => {
  const withFeatures = plans.find((p) => p.product_type === type && p.features?.length);
  return withFeatures ? withFeatures.features : DEFAULT_FEATURES[type] || [];
};

const listDays = (days) =>
  days.length > 1 ? `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]} days` : `${days[0]} days`;

const pktTime = (hour, minute) => {
  const h12 = hour % 12 || 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"}`;
};

const sortedSlots = (slots) => [...slots].sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));

const weekPlan = (dayPlans) =>
  DAY_ORDER.map((d) => dayPlans.find((p) => p.day_of_week === d))
    .filter(Boolean)
    .map((p) => ({ day: DAY_NAMES[p.day_of_week], type: p.type }));

const formatPhone = (digits) => (digits ? `+${String(digits).replace(/\D/g, "")}` : null);

// ---- readable page content --------------------------------------------

const ul = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

const siteNav = () =>
  `<nav aria-label="Pages"><ul>${indexable()
    .map(([path, m]) => `<li><a href="${path}">${esc(pageName(m.title))}</a></li>`)
    .join("")}</ul></nav>`;

const packagesSection = (data, headingLevel = "h2") => {
  const durations = durationsByType(data.plans);
  return Object.keys(TYPE_NAMES)
    .filter((type) => durations[type].length)
    .map((type) => {
      const features =
        type === "combo"
          ? [...featuresFor(data.plans, "dietplan"), ...featuresFor(data.plans, "workout")]
          : featuresFor(data.plans, type);
      return `<${headingLevel}>${esc(TYPE_NAMES[type])}</${headingLevel}><p>Available for ${esc(
        listDays(durations[type]),
      )}.</p>${ul(features)}`;
    })
    .join("");
};

const faqSection = (items = faqs) =>
  `<h2>Frequently asked questions</h2>${items
    .map(({ q, a }) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`)
    .join("")}`;

const pageContent = {
  "/": (data) =>
    `<p>${esc(pageMeta["/"].description)}</p>
<p>3+ years running · 50,000+ clients served · 10,000+ success stories · 24/7 support.</p>
<h2>What we offer</h2>${packagesSection(data, "h3")}
<p>See packages and prices in your local currency: <a href="/plans">Packages &amp; Pricing</a>.</p>
<h2>How it works</h2><ol>${STEPS.map(([t, d]) => `<li><strong>${esc(t)}</strong> — ${esc(d)}</li>`).join("")}</ol>
${faqSection()}`,

  "/plans": (data) =>
    `<p>${esc(pageMeta["/plans"].description)}</p>${packagesSection(data)}
<p>Prices are shown in your local currency. Pay by card through secure Stripe checkout for instant access; in some countries local methods (for example bank transfer, JazzCash or Easypaisa in Pakistan) are also available, with access once the payment is verified.</p>
${faqSection(plansFaqs)}`,

  "/timetable": (data) => {
    const slots = sortedSlots(data.timeSlots);
    const week = weekPlan(data.dayPlans);
    return `<p>${esc(pageMeta["/timetable"].description)}</p>
${slots.length ? `<h2>Daily class times (Pakistan time, UTC+5)</h2>${ul(slots.map((s) => `${pktTime(s.hour, s.minute)} — ${s.trainer_ref?.name || "Trainer"}`))}<p>The same slots run every day. The page shows them converted to your own timezone.</p>` : ""}
${week.length ? `<h2>Weekly plan</h2>${ul(week.map((w) => `${w.day}: ${w.type}`))}` : ""}`;
  },

  "/trainers": (data) =>
    `<p>${esc(pageMeta["/trainers"].description)}</p>${
      data.trainers.length
        ? ul(data.trainers.map((t) => (t.specialty ? `${t.name} — ${t.specialty.replace(/\|+$/, "")}` : t.name)))
        : ""
    }`,

  "/success-stories": () =>
    `<p>${esc(pageMeta["/success-stories"].description)}</p><p>Members share check-ins and progress after following their Fitness Zone diet plan and live home workouts.</p>`,

  "/ebooks": (data) => {
    const items = [...data.ebooks.map((e) => ["E-book", e]), ...data.courses.map((c) => ["Course", c])];
    return `<p>${esc(pageMeta["/ebooks"].description)}</p>${items
      .map(([kind, item]) => `<h2>${esc(item.title)}</h2><p>${esc(kind)}${item.description ? ` — ${esc(item.description)}` : ""}</p>`)
      .join("")}`;
  },

  "/about": () =>
    `<p>Since 2023, ${ORG.legalName} has been dedicated to helping women take control of their health and well-being — the everyday effects of sedentary lifestyles such as low energy, stubborn weight and inconsistent routines — through sustainable nutrition and movement, not quick fixes.</p>
<h2>What we offer</h2>${ul([
      "100% natural, fully customized diet plans built on real, whole foods — no powders, pills or artificial products — for every cuisine, dietary preference and cultural background.",
      "Interactive home workouts, guided and tailored to varying fitness levels and health conditions.",
      "Sustainable energy and balance: steady, whole-body wellness rather than quick weight loss.",
    ])}
<h2>Our philosophy</h2><p>No supplements, no shortcuts — just real food, structured movement, and lasting results.</p>`,

  "/contact": (data) => {
    const general = formatPhone(data.settings.whatsapp_general);
    const dietician = formatPhone(data.settings.whatsapp_dietician);
    return `<p>${esc(pageMeta["/contact"].description)}</p>${ul(
      [
        general && `WhatsApp (general): ${general}`,
        dietician && `WhatsApp (dietitian): ${dietician}`,
        `Email: ${ORG.email}`,
        `Office: ${ORG.address.streetAddress}, ${ORG.address.addressLocality} ${ORG.address.postalCode}, United Kingdom`,
      ].filter(Boolean),
    )}`;
  },

  "/careers": () =>
    `<p>${esc(pageMeta["/careers"].description)}</p><p>Trainers lead live, 50–55 minute online home workout classes for women. Apply through the form on this page.</p>`,
};

const readableContent = (path, meta, data) => {
  const body = pageContent[path] ? pageContent[path](data) : `<p>${esc(meta.description)}</p>`;
  const h1 = path === "/" ? "Fitness Zone — Online Diet Plans & Live Home Workouts for Women" : pageName(meta.title);
  // Visually hidden: the app replaces #root's contents as soon as it runs.
  return `<div style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0"><main><h1>${esc(
    h1,
  )}</h1>${body}</main>${siteNav()}</div>`;
};

// ---- structured data --------------------------------------------------

const orgNode = (data) => {
  const phone = formatPhone(data.settings.whatsapp_general);
  return {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: ORG.name,
    legalName: ORG.legalName,
    url: `${SITE_ORIGIN}/`,
    logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/icon-512.png`, width: 512, height: 512 },
    image: `${SITE_ORIGIN}/og-image.png`,
    description:
      "Online fitness platform for women: customized diet plans and live home workout classes with female trainers.",
    foundingDate: ORG.founded,
    founder: { "@type": "Person", name: ORG.founder },
    email: ORG.email,
    address: { "@type": "PostalAddress", ...ORG.address },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: ORG.email,
      ...(phone && { telephone: phone }),
      areaServed: "Worldwide",
    },
    sameAs: [ORG.instagram],
  };
};

const websiteNode = {
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: ORG.name,
  alternateName: ["FitnessZone", "Fitness Zone Official"],
  publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  inLanguage: "en",
};

const serviceNodes = (data) => {
  const durations = durationsByType(data.plans);
  const describe = {
    dietplan:
      "A dietitian-built, home-based menu around your health needs and preferred foods — real food, no supplements — with daily meal tracking, weekly follow-ups and a new plan every 15 days.",
    workout:
      "Live online home workout classes for women led by female trainers: 50–55 minutes, six days a week, a different workout each day, several daily time slots, recordings provided.",
    combo: "The customized diet plan and live home workouts together in one package at one price.",
  };
  return Object.keys(TYPE_NAMES)
    .filter((type) => durations[type].length)
    .map((type) => ({
      "@type": "Service",
      "@id": `${SITE_ORIGIN}/plans#${type}`,
      name: TYPE_NAMES[type],
      serviceType: type === "dietplan" ? "Online diet plan" : "Online fitness classes",
      description: `${describe[type]} Available for ${listDays(durations[type])}.`,
      provider: { "@id": `${SITE_ORIGIN}/#organization` },
      areaServed: "Worldwide",
      audience: { "@type": "PeopleAudience", audienceType: "Women" },
      url: `${SITE_ORIGIN}/plans?type=${type}`,
    }));
};

const PAGE_TYPES = { "/about": "AboutPage", "/contact": "ContactPage", "/plans": "CollectionPage" };

const jsonLd = (path, meta, data) => {
  const url = absolute(path);
  const graph = [orgNode(data), websiteNode];
  const page = {
    "@type": PAGE_TYPES[path] || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    about: { "@id": `${SITE_ORIGIN}/#organization` },
    inLanguage: "en",
  };
  if (path !== "/") {
    page.breadcrumb = { "@id": `${url}#breadcrumb` };
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: pageName(meta.title), item: url },
      ],
    });
  }
  graph.push(page);
  const pageFaqs = path === "/" ? faqs : path === "/plans" ? plansFaqs : null;
  if (pageFaqs) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: pageFaqs.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }
  if (path === "/" || path === "/plans") graph.push(...serviceNodes(data));
  if (path === "/trainers" && data.trainers.length) {
    graph.push({
      "@type": "ItemList",
      name: "Fitness Zone trainers",
      itemListElement: data.trainers.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Person",
          name: t.name,
          jobTitle: "Fitness Trainer",
          worksFor: { "@id": `${SITE_ORIGIN}/#organization` },
        },
      })),
    });
  }
  // "<" escaped so nothing in the data can close the <script> early.
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
};

// ---- head tags --------------------------------------------------------

const withPageTags = (html, pathname, { title, description, noindex }) => {
  const url = absolute(pathname);
  const t = esc(title);
  const d = esc(description);
  const swaps = [
    [/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`],
    [/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${d}" />`],
    [
      /<meta\s+name="robots"[\s\S]*?\/>/,
      `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    ],
    [/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${url}" />`],
    [/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${url}" />`],
    [/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${t}" />`],
    [/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${d}" />`],
    [/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${t}" />`],
    [/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${d}" />`],
  ];
  for (const [pattern, tag] of swaps) {
    if (!pattern.test(html)) throw new Error(`seo: ${pattern} not found in index.html`);
    html = html.replace(pattern, () => tag);
  }
  return html;
};

// The homepage hero photo is its largest element (what Lighthouse times as
// LCP), but its URL comes from the API — so the browser couldn't even start
// downloading it until the app had loaded and the API had answered (~3s on
// mobile). The banners are baked into the homepage HTML instead: the app
// renders them immediately (and refreshes from the API after), and the
// first photo is preloaded straight from the HTML with the same srcset the
// <img> uses, so it's fetched once, at high priority.
const HERO_WIDTHS = [600, 900, 1200, 1600];
const heroHead = (banners) => {
  if (!banners.length) return "";
  const first = banners[0].image_url;
  const srcset = HERO_WIDTHS.map((w) => `${optimizeCloudinaryUrl(first, w)} ${w}w`).join(", ");
  const json = JSON.stringify(banners).replace(/</g, "\\u003c");
  return `<link rel="preload" as="image" href="${esc(optimizeCloudinaryUrl(first, 1200))}" imagesrcset="${esc(srcset)}" imagesizes="100vw" fetchpriority="high" />
  <script>window.__HERO_BANNERS__ = ${json};</script>`;
};

const buildPage = (base, path, meta, data) => {
  let html = withPageTags(base, path, meta);
  if (meta.noindex) return html;
  if (path === "/") html = html.replace("</head>", () => `  ${heroHead(data.heroBanners)}
</head>`);
  html = html.replace("</head>", () => `  ${jsonLd(path, meta, data)}\n</head>`);
  html = html.replace('<div id="root"></div>', () => `<div id="root">${readableContent(path, meta, data)}</div>`);
  return html;
};

// ---- llms.txt and sitemap --------------------------------------------

const llmsTxt = (data) => {
  const durations = durationsByType(data.plans);
  const slots = sortedSlots(data.timeSlots);
  const week = weekPlan(data.dayPlans);
  const phone = formatPhone(data.settings.whatsapp_general);
  const lines = [
    `# ${ORG.name}`,
    "",
    `> ${ORG.name} (${ORG.legalName}) is an online fitness platform for women offering customized diet plans and live online home workout classes led by female trainers. Founded in ${ORG.founded}, with an office in London, UK, and members around the world.`,
    "",
    "## Key facts",
    "",
    ...Object.keys(TYPE_NAMES)
      .filter((type) => durations[type].length)
      .map((type) => `- ${TYPE_NAMES[type]}: available for ${listDays(durations[type])}.`),
    "- Live classes: 50–55 minutes, six days a week, a different workout each day, led by female trainers; recordings provided; members join from their Fitness Zone profile.",
    ...(slots.length
      ? [`- Daily class times (Pakistan time, UTC+5): ${slots.map((s) => pktTime(s.hour, s.minute)).join(", ")}. The website shows them in the visitor's timezone.`]
      : []),
    ...(week.length ? [`- Weekly plan: ${week.map((w) => `${w.day} — ${w.type}`).join("; ")}.`] : []),
    "- Diet plans: dietitian-built, home-based menus around health needs and preferred foods; real, whole food with no powders, pills or supplements; daily meal tracking and weekly follow-ups; first plan within 24 hours, renewed every 15 days.",
    "- Prices are shown in the visitor's local currency at https://fitnesszone.ltd/plans.",
    "- Payment: card via Stripe (instant access); local methods in some countries, e.g. bank transfer, JazzCash or Easypaisa in Pakistan.",
    `- Contact: ${[phone && `WhatsApp ${phone}`, `email ${ORG.email}`].filter(Boolean).join(", ")}.`,
    "",
    "## Pages",
    "",
    ...indexable().map(([path, m]) => `- [${pageName(m.title)}](${absolute(path)}): ${m.description}`),
    "",
    "## FAQ",
    "",
    ...faqs.flatMap(({ q, a }) => [`### ${q}`, "", a, ""]),
  ];
  return `${lines.join("\n").trim()}\n`;
};

const sitemapXml = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = indexable()
    .map(([path]) => `  <url>\n    <loc>${absolute(path)}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

// ---- Vite plugin ------------------------------------------------------

export const seoPages = () => ({
  name: "seo-pages",
  apply: "build",
  enforce: "post",
  async generateBundle(_, bundle) {
    const index = bundle["index.html"];
    if (!index) return;
    const base = String(index.source);
    const data = await loadSiteData();

    index.source = buildPage(base, "/", pageMeta["/"], data);

    // The hero-banner data preload only helps the homepage; elsewhere it's
    // a wasted request on every page load.
    const withoutHeroPreload = base.replace(/<link\s+rel="preload"\s+as="fetch"[^>]*hero-banners[^>]*\/>/, "");
    for (const [path, meta] of Object.entries(pageMeta)) {
      if (path === "/") continue;
      this.emitFile({
        type: "asset",
        fileName: `${path.slice(1)}/index.html`,
        source: buildPage(withoutHeroPreload, path, meta, data),
      });
    }

    // Served with a real 404 status for any URL that isn't a page (see
    // vercel.json): the app still shows its own "page not found" screen.
    this.emitFile({
      type: "asset",
      fileName: "404.html",
      source: withPageTags(withoutHeroPreload, "/404", getPageMeta("/404")).replace(
        /<link\s+rel="canonical"[^>]*\/>/,
        "",
      ),
    });

    this.emitFile({ type: "asset", fileName: "llms.txt", source: llmsTxt(data) });
    this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemapXml() });
  },
});
