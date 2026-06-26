// assistant-data.js
// Extra metadata for the concierge and collections.
// Keeping this separate from restaurants-data.js makes the beginner data easier to read.

const restaurantProfiles = {
  1: {
    averageSpend: "₹6,000 for two",
    spendValue: 6000,
    perfectFor: "Anniversary dinners, seafood dates, luxury celebrations",
    mustOrder: "Lobster thermidor and sushi platters",
    curatedRating: 9.4,
    tags: ["date night", "anniversary", "romantic", "seafood", "luxury", "celebrity", "late night", "wine", "rooftop", "skyline"],
    collections: ["date-nights", "luxury-dining", "celebrity-favorites", "best-rooftops"]
  },
  2: {
    averageSpend: "₹4,500 for two",
    spendValue: 4500,
    perfectFor: "Modern Indian dinners, visiting friends, business-hosted meals",
    mustOrder: "Seasonal small plates and regional cocktails",
    curatedRating: 9.3,
    tags: ["business", "modern indian", "brunch", "premium", "wine", "celebrity", "date night"],
    collections: ["luxury-dining", "celebrity-favorites", "best-brunch", "business-dining"]
  },
  3: {
    averageSpend: "₹2,200 for two",
    spendValue: 2200,
    perfectFor: "Casual groups, Colaba walks, old-school Mumbai energy",
    mustOrder: "Chilli cheese toast and classic cafe plates",
    curatedRating: 8.5,
    tags: ["hidden gems", "family", "cafe", "under 3000", "late night", "colaba"],
    collections: ["hidden-gems", "under-3000", "late-night"]
  },
  4: {
    averageSpend: "₹4,200 for two",
    spendValue: 4200,
    perfectFor: "Coastal dinners, family seafood meals, old Mumbai classics",
    mustOrder: "Butter garlic crab",
    curatedRating: 9.1,
    tags: ["seafood", "family", "business", "premium", "hidden gems", "fort"],
    collections: ["celebrity-favorites", "family-picks", "hidden-gems"]
  },
  5: {
    averageSpend: "₹1,600 for two",
    spendValue: 1600,
    perfectFor: "Brunch, theatre evenings, casual dates in Juhu",
    mustOrder: "Irish coffee, parathas, and cutting chai",
    curatedRating: 8.8,
    tags: ["brunch", "juhu", "date night", "cafe", "under 3000", "hidden gems"],
    collections: ["best-brunch", "hidden-gems", "under-3000", "date-nights"]
  },
  6: {
    averageSpend: "₹5,800 for two",
    spendValue: 5800,
    perfectFor: "Business lunches, dim sum dates, polished BKC evenings",
    mustOrder: "Truffle edamame dumplings",
    curatedRating: 9.0,
    tags: ["business", "bkc", "chinese", "luxury", "wine", "date night"],
    collections: ["luxury-dining", "business-dining", "date-nights"]
  },
  7: {
    averageSpend: "₹900 for two",
    spendValue: 900,
    perfectFor: "Breakfast runs, family mornings, budget food walks",
    mustOrder: "Masala dosa and filter coffee",
    curatedRating: 9.0,
    tags: ["family", "hidden gems", "under 3000", "breakfast", "south indian", "brunch"],
    collections: ["hidden-gems", "under-3000", "best-brunch", "family-picks"]
  },
  8: {
    averageSpend: "₹4,800 for two",
    spendValue: 4800,
    perfectFor: "Romantic Italian, date nights, wine-led dinners",
    mustOrder: "Handmade pasta and tiramisu",
    curatedRating: 9.0,
    tags: ["italian", "romantic", "date night", "wine", "bkc", "premium"],
    collections: ["date-nights", "italian-picks", "business-dining"]
  },
  9: {
    averageSpend: "₹2,600 for two",
    spendValue: 2600,
    perfectFor: "Family seafood meals and relaxed weekend lunches",
    mustOrder: "Bombil fry and seafood thali",
    curatedRating: 8.7,
    tags: ["family", "seafood", "under 3000", "andheri", "hidden gems"],
    collections: ["family-picks", "under-3000", "hidden-gems"]
  },
  10: {
    averageSpend: "₹2,800 for two",
    spendValue: 2800,
    perfectFor: "Family dinners, Powai dates, lively North Indian meals",
    mustOrder: "Galouti kebab and dal makhani",
    curatedRating: 9.2,
    tags: ["family", "powai", "date night", "business", "under 3000", "north indian"],
    collections: ["date-nights", "family-picks", "under-3000", "business-dining"]
  },
  11: {
    averageSpend: "₹1,500 for two",
    spendValue: 1500,
    perfectFor: "Vegetarian meals, family lunches, comfort food",
    mustOrder: "Farsan platter and aamras thali",
    curatedRating: 8.8,
    tags: ["family", "vegetarian", "under 3000", "hidden gems", "brunch"],
    collections: ["family-picks", "under-3000", "hidden-gems", "best-brunch"]
  },
  12: {
    averageSpend: "₹4,000 for two",
    spendValue: 4000,
    perfectFor: "Japanese dates, ramen cravings, compact premium dinners",
    mustOrder: "Tonkotsu ramen and sushi rolls",
    curatedRating: 9.1,
    tags: ["japanese", "bandra", "date night", "romantic", "premium", "hidden gems"],
    collections: ["japanese-picks", "date-nights", "hidden-gems"]
  },
  13: {
    averageSpend: "₹8,500 for two",
    spendValue: 8500,
    perfectFor: "Luxury tasting menus, anniversaries, chef-led celebrations",
    mustOrder: "Seasonal tasting menu",
    curatedRating: 9.6,
    tags: ["luxury", "anniversary", "date night", "wine", "celebrity", "new openings", "rooftop", "skyline"],
    collections: ["luxury-dining", "date-nights", "celebrity-favorites", "best-rooftops"]
  },
  14: {
    averageSpend: "₹4,600 for two",
    spendValue: 4600,
    perfectFor: "Italian brunch, polished dates, wine and pizza nights",
    mustOrder: "Neapolitan pizza and burrata",
    curatedRating: 9.0,
    tags: ["italian", "brunch", "wine", "date night", "fort", "premium", "rooftop"],
    collections: ["italian-picks", "best-brunch", "date-nights", "best-rooftops"]
  },
  15: {
    averageSpend: "₹4,400 for two",
    spendValue: 4400,
    perfectFor: "BKC group dinners, Goan seafood, celebratory cocktails",
    mustOrder: "Prawn balchao and poee",
    curatedRating: 9.2,
    tags: ["bkc", "business", "brunch", "wine", "celebrity", "new openings", "seafood"],
    collections: ["celebrity-favorites", "best-brunch", "business-dining", "new-openings"]
  },
  16: {
    averageSpend: "₹2,900 for two",
    spendValue: 2900,
    perfectFor: "Japanese comfort food, Bandra dates, cosy ramen plans",
    mustOrder: "Ramen and chicken karaage",
    curatedRating: 8.7,
    tags: ["japanese", "bandra", "date night", "under 3000", "hidden gems"],
    collections: ["japanese-picks", "under-3000", "hidden-gems", "date-nights"]
  },
  17: {
    averageSpend: "₹900 for two",
    spendValue: 900,
    perfectFor: "Old Bombay breakfasts, budget dates, hidden-gem cafe stops",
    mustOrder: "Bun maska and Irani chai",
    curatedRating: 8.6,
    tags: ["hidden gems", "under 3000", "brunch", "family", "cafe"],
    collections: ["hidden-gems", "under-3000", "best-brunch", "family-picks"]
  },
  18: {
    averageSpend: "₹2,700 for two",
    spendValue: 2700,
    perfectFor: "Family seafood meals, Juhu lunches, coastal comfort food",
    mustOrder: "Prawn gassi and neer dosa",
    curatedRating: 8.8,
    tags: ["family", "juhu", "seafood", "under 3000", "brunch"],
    collections: ["family-picks", "under-3000", "best-brunch"]
  }
};

const conciergeChips = [
  { label: "❤️ Date Night", query: "date night romantic dinner" },
  { label: "🌇 Rooftop", query: "luxury rooftop" },
  { label: "🍣 Japanese", query: "japanese" },
  { label: "🍝 Italian", query: "italian romantic" },
  { label: "🥂 Brunch", query: "best brunch" },
  { label: "🍷 Wine", query: "wine dinner" },
  { label: "⭐ Hidden Gems", query: "hidden gems" },
  { label: "👨‍👩‍👧 Family", query: "family dinner" },
  { label: "💼 Business", query: "business dinner" },
  { label: "🌙 Late Night", query: "late night" }
];

const collections = [
  {
    id: "date-nights",
    title: "Best Date Nights",
    description: "Romantic, polished restaurants for a memorable evening.",
    query: "date night romantic anniversary"
  },
  {
    id: "luxury-dining",
    title: "Luxury Dining",
    description: "High-end rooms, premium service, and celebration energy.",
    query: "luxury premium anniversary wine"
  },
  {
    id: "celebrity-favorites",
    title: "Celebrity Favorites",
    description: "Stylish, high-demand spots with a scene.",
    query: "celebrity luxury premium"
  },
  {
    id: "best-brunch",
    title: "Best Brunch",
    description: "Weekend-friendly cafes, brunch rooms, and relaxed lunches.",
    query: "brunch cafe juhu"
  },
  {
    id: "japanese-picks",
    title: "Japanese Picks",
    description: "Sushi, ramen, dimly lit dates, and comforting bowls.",
    query: "japanese sushi ramen bandra"
  },
  {
    id: "italian-picks",
    title: "Italian Picks",
    description: "Pasta, pizza, wine, and romantic Italian rooms.",
    query: "italian romantic wine"
  },
  {
    id: "hidden-gems",
    title: "Hidden Gems",
    description: "Character-rich places that feel personal and discovered.",
    query: "hidden gems old bombay cosy"
  },
  {
    id: "under-3000",
    title: "Under ₹3000",
    description: "Premium-feeling meals that stay below ₹3000 for two.",
    query: "under 3000 budget"
  },
  {
    id: "new-openings",
    title: "New Openings",
    description: "Fresh-feeling spots and newer conversation starters.",
    query: "new openings modern premium"
  },
  {
    id: "best-rooftops",
    title: "Best Rooftops",
    description: "Open-air, skyline, and terrace-style dining moods.",
    query: "rooftop skyline luxury date night"
  }
];
