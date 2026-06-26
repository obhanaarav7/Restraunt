// script.js
// Main page behavior: JSON data loading, cards, filters, favorites, recent views, compare, and concierge.

const restaurantGrid = document.querySelector("#restaurantGrid");
const resultsCount = document.querySelector("#resultsCount");
const resultsSubtext = document.querySelector("#resultsSubtext");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const areaFilter = document.querySelector("#areaFilter");
const cuisineFilter = document.querySelector("#cuisineFilter");
const priceFilter = document.querySelector("#priceFilter");
const occasionFilter = document.querySelector("#occasionFilter");
const dressFilter = document.querySelector("#dressFilter");
const resetButton = document.querySelector("#resetButton");
const quickChips = document.querySelectorAll(".quick-chip[data-area]");
const featureChips = document.querySelectorAll(".feature-chip");
const favoritesOnlyButton = document.querySelector("#favoritesOnlyButton");
const favoriteCount = document.querySelector("#favoriteCount");
const compareContent = document.querySelector("#compareContent");
const recentlyViewed = document.querySelector("#recentlyViewed");
const themeToggle = document.querySelector("#themeToggle");
const conciergeForm = document.querySelector("#conciergeForm");
const conciergeInput = document.querySelector("#conciergeInput");
const conciergeChipsContainer = document.querySelector("#conciergeChips");
const conciergeResults = document.querySelector("#conciergeResults");

let savedRestaurantIds = new Set(loadFromStorage("savedRestaurants", []));
let compareRestaurantIds = [];
let activeFeatures = new Set();
let favoritesOnly = false;

function loadFromStorage(key, backupValue) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : backupValue;
  } catch (error) {
    return backupValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // The app still works if storage is blocked; it just will not remember choices.
  }
}

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);
  themeToggle.textContent = isLight ? "🌙" : "☀️";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  saveToStorage("theme", theme);
}

function fillFilter(selectElement, values, customOrder) {
  let uniqueValues = [...new Set(values)].sort();

  if (customOrder) {
    uniqueValues = customOrder.filter(function(value) {
      return uniqueValues.includes(value);
    });
  }

  uniqueValues.forEach(function(value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function getPriceLevel(price) {
  return {
    "Budget": 1,
    "Mid Range": 2,
    "Premium": 3,
    "Luxury": 4
  }[price] || 0;
}

function createPriceMeter(price) {
  let dots = "";
  const filledDots = getPriceLevel(price);

  for (let index = 1; index <= 4; index++) {
    const filledClass = index <= filledDots ? " is-filled" : "";
    dots += `<span class="price-dot${filledClass}"></span>`;
  }

  return dots;
}

function formatCardNumber(id) {
  return `No. ${String(id).padStart(2, "0")}`;
}

function createRestaurantCard(restaurant, index) {
  const isSaved = savedRestaurantIds.has(String(restaurant.id));
  const isCompared = compareRestaurantIds.includes(String(restaurant.id));
  const featuredLabel = restaurant.rating >= 4.7 ? '<span class="featured-pill">Top rated</span>' : "";

  return `
    <article class="restaurant-card" data-restaurant-id="${restaurant.id}" style="animation-delay: ${index * 0.04}s">
      <div class="card-top">
        <img class="restaurant-photo" src="${restaurant.photo}" alt="${restaurant.name} restaurant photo" loading="lazy">
        <div class="photo-overlay"></div>
        <span class="card-number">${formatCardNumber(restaurant.id)}</span>
        <span class="rating-pill">${restaurant.rating} ★</span>
        ${featuredLabel}
        <button class="save-button${isSaved ? " is-saved" : ""}" type="button" data-id="${restaurant.id}" aria-label="${isSaved ? "Remove from saved" : "Save restaurant"}">
          ${isSaved ? "♥" : "♡"}
        </button>
        <span class="food-emoji" aria-hidden="true">${restaurant.emoji}</span>
      </div>

      <div class="card-body">
        <p class="card-kicker">${restaurant.area} · ${restaurant.cuisine}</p>
        <h3>${restaurant.name}</h3>
        <p class="description">${restaurant.description}</p>

        <div class="tag-row">
          <span class="tag">${restaurant.area}</span>
          <span class="tag">${restaurant.cuisine}</span>
          <span class="tag">${restaurant.price}</span>
        </div>

        <div class="price-meter" aria-label="${restaurant.price} price level">
          ${createPriceMeter(restaurant.price)}
        </div>

        <div class="meta-row">
          <span>${restaurant.address}</span>
          <span class="highlight">${restaurant.highlight}</span>
        </div>

        <div class="card-actions">
          <a class="action-link" href="${restaurant.bookingUrl}" target="_blank" rel="noopener">Book</a>
          <a class="action-link secondary" href="${restaurant.orderUrl}" target="_blank" rel="noopener">Order</a>
          <a class="action-link secondary" href="${restaurant.mapUrl}" target="_blank" rel="noopener">Map</a>
          <button class="action-link secondary compare-button${isCompared ? " is-active" : ""}" type="button" data-id="${restaurant.id}">Compare</button>
        </div>
      </div>
    </article>
  `;
}

function getSearchText(restaurant) {
  return [
    restaurant.name,
    restaurant.area,
    restaurant.cuisine,
    restaurant.description,
    restaurant.highlight,
    restaurant.mustOrder,
    restaurant.perfectFor,
    restaurant.tags.join(" "),
    restaurant.occasions.join(" ")
  ].join(" ").toLowerCase();
}

function restaurantMatchesFilters(restaurant) {
  const searchText = searchInput.value.toLowerCase().trim();
  const searchMatches = !searchText || getSearchText(restaurant).includes(searchText);
  const areaMatches = areaFilter.value === "all" || restaurant.area === areaFilter.value;
  const cuisineMatches = cuisineFilter.value === "all" || restaurant.cuisine === cuisineFilter.value;
  const priceMatches = priceFilter.value === "all" || restaurant.price === priceFilter.value;
  const occasionMatches = occasionFilter.value === "all" || restaurant.occasions.includes(occasionFilter.value);
  const dressMatches = dressFilter.value === "all" || restaurant.dressCode === dressFilter.value;
  const featureMatches = [...activeFeatures].every(function(feature) {
    return restaurant.features[feature];
  });
  const savedMatches = !favoritesOnly || savedRestaurantIds.has(String(restaurant.id));

  return searchMatches && areaMatches && cuisineMatches && priceMatches && occasionMatches && dressMatches && featureMatches && savedMatches;
}

function displayRestaurants(restaurantsToShow) {
  restaurantGrid.innerHTML = restaurantsToShow.map(createRestaurantCard).join("");
  updateFavoriteCount();
  renderCompare();

  if (restaurantsToShow.length === 0) {
    emptyState.hidden = false;
    resultsCount.textContent = "No restaurants match your filters";
    resultsSubtext.textContent = favoritesOnly ? "You have no saved restaurants in this filter." : "Try removing one filter or using a broader search.";
    return;
  }

  emptyState.hidden = true;
  resultsCount.textContent = restaurantsToShow.length === restaurants.length && !favoritesOnly
    ? "Showing all restaurants"
    : `Showing ${restaurantsToShow.length} restaurant${restaurantsToShow.length === 1 ? "" : "s"}`;
  resultsSubtext.textContent = "Search supports restaurant, cuisine, area, dish, and occasion.";
}

function filterRestaurants() {
  const filteredRestaurants = restaurants.filter(restaurantMatchesFilters);
  updateQuickChips();
  updateFeatureChips();
  displayRestaurants(filteredRestaurants);
}

function resetFilters() {
  searchInput.value = "";
  areaFilter.value = "all";
  cuisineFilter.value = "all";
  priceFilter.value = "all";
  occasionFilter.value = "all";
  dressFilter.value = "all";
  activeFeatures.clear();
  favoritesOnly = false;
  favoritesOnlyButton.classList.remove("is-active");
  filterRestaurants();
}

function updateQuickChips() {
  quickChips.forEach(function(chip) {
    chip.classList.toggle("is-active", chip.dataset.area === areaFilter.value);
  });
}

function updateFeatureChips() {
  featureChips.forEach(function(chip) {
    chip.classList.toggle("is-active", activeFeatures.has(chip.dataset.feature));
  });
}

function updateFavoriteCount() {
  favoriteCount.textContent = savedRestaurantIds.size;
  favoritesOnlyButton.setAttribute("aria-pressed", String(favoritesOnly));
}

function toggleSavedRestaurant(id) {
  const restaurantId = String(id);

  if (savedRestaurantIds.has(restaurantId)) {
    savedRestaurantIds.delete(restaurantId);
  } else {
    savedRestaurantIds.add(restaurantId);
  }

  saveToStorage("savedRestaurants", [...savedRestaurantIds]);
  filterRestaurants();
}

function toggleCompareRestaurant(id) {
  const restaurantId = String(id);

  if (compareRestaurantIds.includes(restaurantId)) {
    compareRestaurantIds = compareRestaurantIds.filter(function(savedId) {
      return savedId !== restaurantId;
    });
  } else {
    compareRestaurantIds = compareRestaurantIds.slice(-1).concat(restaurantId);
  }

  filterRestaurants();
}

function createCompareCard(restaurant) {
  return `
    <article class="compare-card">
      <p class="eyebrow">${restaurant.area}</p>
      <h3>${restaurant.name}</h3>
      <dl class="compare-list">
        <div><dt>Cuisine</dt><dd>${restaurant.cuisine}</dd></div>
        <div><dt>Price</dt><dd>${restaurant.price}</dd></div>
        <div><dt>Ratings</dt><dd>${restaurant.rating} ★ · ${restaurant.curatedRating}/10 curated</dd></div>
        <div><dt>Perfect For</dt><dd>${restaurant.perfectFor}</dd></div>
        <div><dt>Dress Code</dt><dd>${restaurant.dressCode}</dd></div>
        <div><dt>Luxury Score</dt><dd>${restaurant.detail.scores.luxuryFeel}/10</dd></div>
      </dl>
    </article>
  `;
}

function renderCompare() {
  const selectedRestaurants = compareRestaurantIds.map(function(id) {
    return DataStore.getRestaurantById(id);
  }).filter(Boolean);

  if (selectedRestaurants.length === 0) {
    compareContent.innerHTML = "<p>Select Compare on any two restaurant cards.</p>";
    return;
  }

  compareContent.innerHTML = `
    <div class="compare-grid">
      ${selectedRestaurants.map(createCompareCard).join("")}
    </div>
    <p>${selectedRestaurants.length === 1 ? "Choose one more restaurant to complete the comparison." : "Comparing your selected restaurants."}</p>
  `;
}

function renderRecentlyViewed() {
  const recentIds = loadFromStorage("recentlyViewedRestaurants", []);
  const recentRestaurants = recentIds.map(function(id) {
    return DataStore.getRestaurantById(id);
  }).filter(Boolean).slice(0, 4);

  if (recentRestaurants.length === 0) {
    recentlyViewed.innerHTML = "<p>Open a restaurant detail page to build your recent list.</p>";
    return;
  }

  recentlyViewed.innerHTML = `
    <div class="compare-grid">
      ${recentRestaurants.map(function(restaurant) {
        return `
          <button class="nearby-card" type="button" data-nearby-id="${restaurant.id}">
            <span class="eyebrow">${restaurant.area} · ${restaurant.cuisine}</span>
            <strong>${restaurant.name}</strong>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function parseBudget(query) {
  const budgetMatch = query.match(/(?:under|below|less than)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  return budgetMatch ? Number(budgetMatch[1]) : null;
}

function normalizeQuery(query) {
  return query.toLowerCase().replace(/[^\w₹ ]/g, " ").replace(/\s+/g, " ").trim();
}

function getQueryTerms(query) {
  const normalizedQuery = normalizeQuery(query);
  return normalizedQuery.split(" ").filter(function(term) {
    return term.length > 2 && !["best", "for", "the"].includes(term);
  });
}

function scoreRestaurantForQuery(restaurant, query) {
  const normalizedQuery = normalizeQuery(query);
  const maxBudget = parseBudget(query);
  let score = restaurant.curatedRating;

  getQueryTerms(query).forEach(function(term) {
    if (getSearchText(restaurant).includes(term)) {
      score += 3;
    }
  });

  ["anniversary", "romantic", "rooftop", "business", "brunch", "family", "late night"].forEach(function(tag) {
    if (normalizedQuery.includes(tag) && restaurant.tags.includes(tag)) {
      score += 7;
    }
  });

  if (maxBudget) {
    score += restaurant.spendValue <= maxBudget ? 8 : -8;
  }

  return score;
}

function buildRecommendationReason(restaurant, query) {
  const reasons = [];
  const normalizedQuery = normalizeQuery(query);

  if (normalizedQuery.includes(restaurant.area.toLowerCase())) reasons.push(restaurant.area);
  if (normalizedQuery.includes(restaurant.cuisine.toLowerCase().split(" ")[0])) reasons.push(restaurant.cuisine);
  restaurant.tags.forEach(function(tag) {
    if (normalizedQuery.includes(tag)) reasons.push(tag);
  });
  if (parseBudget(query) && restaurant.spendValue <= parseBudget(query)) reasons.push("within your budget");

  return `Recommended because it matches ${[...new Set(reasons)].slice(0, 3).join(", ") || restaurant.perfectFor.toLowerCase()} with a strong curated rating.`;
}

function getConciergeRecommendations(query) {
  return restaurants
    .map(function(restaurant) {
      return { restaurant, score: scoreRestaurantForQuery(restaurant, query) };
    })
    .sort(function(first, second) {
      return second.score - first.score;
    })
    .slice(0, 3)
    .map(function(result) {
      return result.restaurant;
    });
}

function createRecommendationCard(restaurant, query, index) {
  return `
    <article class="recommendation-card" data-restaurant-id="${restaurant.id}" style="animation-delay: ${index * 0.04}s">
      <p class="eyebrow">${restaurant.area} · ${restaurant.cuisine}</p>
      <h3>${restaurant.name}</h3>
      <p class="recommendation-reason">${buildRecommendationReason(restaurant, query)}</p>
      <dl class="recommendation-details">
        <div><dt>Average spend</dt><dd>${restaurant.averageSpend}</dd></div>
        <div><dt>Perfect for</dt><dd>${restaurant.perfectFor}</dd></div>
        <div><dt>Must order</dt><dd>${restaurant.mustOrder}</dd></div>
        <div><dt>Curated rating</dt><dd>${restaurant.curatedRating}/10</dd></div>
      </dl>
      <a class="action-link reserve-link" href="${restaurant.bookingUrl}" target="_blank" rel="noopener">Reserve</a>
    </article>
  `;
}

function runConcierge(query) {
  const safeQuery = query.trim() || "premium date night";
  conciergeInput.value = safeQuery;
  conciergeResults.innerHTML = getConciergeRecommendations(safeQuery).map(function(restaurant, index) {
    return createRecommendationCard(restaurant, safeQuery, index);
  }).join("");
}

function renderConciergeChips() {
  conciergeChipsContainer.innerHTML = conciergeChips.map(function(chip) {
    return `<button class="quick-chip concierge-chip" type="button" data-query="${chip.query}">${chip.label}</button>`;
  }).join("");
}

function initializeFilters() {
  fillFilter(areaFilter, DataStore.getUniqueValues("area"));
  fillFilter(cuisineFilter, DataStore.getUniqueValues("cuisine"));
  fillFilter(priceFilter, DataStore.getUniqueValues("price"), ["Budget", "Mid Range", "Premium", "Luxury"]);
  fillFilter(occasionFilter, [...new Set(restaurants.flatMap(function(restaurant) {
    return restaurant.occasions;
  }))].sort());
  fillFilter(dressFilter, DataStore.getUniqueValues("dressCode"));
}

function bindEvents() {
  searchInput.addEventListener("input", filterRestaurants);
  areaFilter.addEventListener("change", filterRestaurants);
  cuisineFilter.addEventListener("change", filterRestaurants);
  priceFilter.addEventListener("change", filterRestaurants);
  occasionFilter.addEventListener("change", filterRestaurants);
  dressFilter.addEventListener("change", filterRestaurants);
  resetButton.addEventListener("click", resetFilters);
  conciergeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    runConcierge(conciergeInput.value);
  });
  themeToggle.addEventListener("click", function() {
    setTheme(document.body.classList.contains("light-theme") ? "dark" : "light");
  });
  favoritesOnlyButton.addEventListener("click", function() {
    favoritesOnly = !favoritesOnly;
    favoritesOnlyButton.classList.toggle("is-active", favoritesOnly);
    filterRestaurants();
  });
  quickChips.forEach(function(chip) {
    chip.addEventListener("click", function() {
      areaFilter.value = chip.dataset.area;
      filterRestaurants();
    });
  });
  featureChips.forEach(function(chip) {
    chip.addEventListener("click", function() {
      const feature = chip.dataset.feature;
      activeFeatures.has(feature) ? activeFeatures.delete(feature) : activeFeatures.add(feature);
      filterRestaurants();
    });
  });
  restaurantGrid.addEventListener("click", function(event) {
    const saveButton = event.target.closest(".save-button");
    const compareButton = event.target.closest(".compare-button");
    if (saveButton) toggleSavedRestaurant(saveButton.dataset.id);
    if (compareButton) toggleCompareRestaurant(compareButton.dataset.id);
  });
  conciergeChipsContainer.addEventListener("click", function(event) {
    const chip = event.target.closest(".concierge-chip");
    if (chip) runConcierge(chip.dataset.query);
  });
  document.addEventListener("restaurantViewed", renderRecentlyViewed);
}

async function initApp() {
  await DataStore.loadRestaurants();
  setTheme(loadFromStorage("theme", "dark"));
  initializeFilters();
  renderConciergeChips();
  runConcierge("Best anniversary dinner under ₹6000");
  displayRestaurants(restaurants);
  renderRecentlyViewed();
  updateQuickChips();
  updateFeatureChips();
  updateFavoriteCount();
  bindEvents();
}

function renderLoadError(error) {
  resultsCount.textContent = "Restaurant data could not load";
  resultsSubtext.textContent = "Refresh the page, or run it with a local server if your browser blocks local files.";
  restaurantGrid.innerHTML = "";
  emptyState.hidden = false;
  emptyState.querySelector("h2").textContent = "Unable to load restaurants";
  emptyState.querySelector("p").textContent = error.message;
}

initApp().catch(renderLoadError);
