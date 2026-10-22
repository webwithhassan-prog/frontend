// People shown by name on the site. Shared by the About page, the blog's
// "Reviewed by" lines and the Person data seo/build.js writes for search
// engines — only facts the person has confirmed.

export const dietitian = {
  id: "sobia-sadia",
  name: "Sobia Sadia",
  credential: "BS Human Nutrition & Dietetics",
  role: "Dietitian",
  bio: "Sobia Sadia is a dietitian at Fitness Zone, with a BS in Human Nutrition & Dietetics. She reviews Fitness Zone's diet and nutrition guides so the advice in them is accurate and safe to follow.",
};

export const reviewers = { [dietitian.id]: dietitian };
