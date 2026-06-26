// script.js
// This file controls the interactive parts of the app:
// 1. Fill filters from the restaurant data.
// 2. Show restaurant cards with photos, buttons, and save hearts.
// 3. Filter by search, area, cuisine, price, and saved restaurants.
// 4. Switch dark/light theme.
// 5. Recommend restaurants with local concierge keyword matching.

const restaurantGrid = document.querySelector("#restaurantGrid");
const resultsCount = document.querySelector("#resultsCount");
const resultsSubtext = document.querySelector("#resultsSubtext");
const emptyState = document.querySelector("#emptyState");

const searchInput = document.querySelector("#searchInput");
const areaFilter = document.querySelector("#areaFilter");
const cuisineFilter = document.querySelector("#cuisineFilter");
const priceFilter = document.querySelector("#priceFilter");
const resetButton = document.querySelector("#resetButton");
const quickChips = document.querySelectorAll(".quick-chip[data-area]");
const favoritesOnlyButton = document.querySelector("#favoritesOnlyButton");
const favoriteCount = document.querySelector("#favoriteCount");

const themeToggle = document.querySelector("#themeToggle");
const conciergeForm = document.querySelector("#conciergeForm");
const conciergeInput = document.querySelector("#conciergeInput");
const conciergeChipsContainer = document.querySelector("#conciergeChips");
const conciergeResults = document.querySelector("#conciergeResults");

let savedRestaurantIds = new Set(loadFromStorage("savedRestaurants", []));
let favoritesOnly = false;

// This helper reads localStorage safely. If storage is blocked, it returns a backup value.
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

// This helper finds unique values, sorts them, and turns them into <option> tags.
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
  const priceLevels = {
    "Budget": 1,
    "Mid Range": 2,
    "Premium": 3,
    "Luxury": 4
  };

  return priceLevels[price] || 0;
}

function createPriceMeter(price) {
  const filledDots = getPriceLevel(price);
  let dots = "";

  for (let index = 1; index <= 4; index++) {
    const filledClass = index <= filledDots ? " is-filled" : "";
    dots += `<span class="price-dot${filledClass}"></span>`;
  }

  return dots;
}

function formatCardNumber(id) {
  return `No. ${String(id).padStart(2, "0")}`;
}

function getProfile(restaurant) {
  return restaurantProfiles[restaurant.id];
}

function createRestaurantCard(restaurant, index) {
  const isSaved = savedRestaurantIds.has(String(restaurant.id));
  const featuredLabel = restaurant.rating >= 4.7 ? '<span class="featured-pill">Top rated</span>' : "";
  const savedClass = isSaved ? " is-saved" : "";
  const savedLabel = isSaved ? "Remove from saved" : "Save restaurant";

  return `
    <article class="restaurant-card" style="animation-delay: ${index * 0.04}s">
      <div class="card-top">
        <img class="restaurant-photo" src="${restaurant.photo}" alt="${restaurant.name} restaurant photo" loading="lazy">
        <div class="photo-overlay"></div>
        <span class="card-number">${formatCardNumber(restaurant.id)}</span>
        <span class="rating-pill">${restaurant.rating} ★</span>
        ${featuredLabel}
        <button class="save-button${savedClass}" type="button" data-id="${restaurant.id}" aria-label="${savedLabel}">
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
        </div>
      </div>
    </article>
  `;
}

function displayRestaurants(restaurantsToShow) {
  restaurantGrid.innerHTML = restaurantsToShow.map(createRestaurantCard).join("");
  updateFavoriteCount();

  if (restaurantsToShow.length === 0) {
    emptyState.hidden = false;
    resultsCount.textContent = "No restaurants match your filters";
    resultsSubtext.textContent = favoritesOnly
      ? "You have no saved restaurants in this filter. Try showing all restaurants."
      : "Try a broader search term or remove one filter.";
    return;
  }

  emptyState.hidden = true;

  if (restaurantsToShow.length === restaurants.length && !favoritesOnly) {
    resultsCount.textContent = "Showing all restaurants";
    resultsSubtext.textContent = "Tip: save restaurants, open maps, or combine filters to narrow your choices.";
  } else {
    resultsCount.textContent = `Showing ${restaurantsToShow.length} restaurant${restaurantsToShow.length === 1 ? "" : "s"}`;
    resultsSubtext.textContent = favoritesOnly
      ? "Saved-only mode is active."
      : "Filters are active. Reset to return to the full Mumbai list.";
  }
}

function filterRestaurants() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedArea = areaFilter.value;
  const selectedCuisine = cuisineFilter.value;
  const selectedPrice = priceFilter.value;

  const filteredRestaurants = restaurants.filter(function(restaurant) {
    const searchableText = `${restaurant.name} ${restaurant.area} ${restaurant.cuisine} ${restaurant.description}`.toLowerCase();
    const searchMatches = searchableText.includes(searchText);
    const areaMatches = selectedArea === "all" || restaurant.area === selectedArea;
    const cuisineMatches = selectedCuisine === "all" || restaurant.cuisine === selectedCuisine;
    const priceMatches = selectedPrice === "all" || restaurant.price === selectedPrice;
    const savedMatches = !favoritesOnly || savedRestaurantIds.has(String(restaurant.id));

    return searchMatches && areaMatches && cuisineMatches && priceMatches && savedMatches;
  });

  updateQuickChips();
  displayRestaurants(filteredRestaurants);
}

function resetFilters() {
  searchInput.value = "";
  areaFilter.value = "all";
  cuisineFilter.value = "all";
  priceFilter.value = "all";
  favoritesOnly = false;
  favoritesOnlyButton.classList.remove("is-active");
  updateQuickChips();
  displayRestaurants(restaurants);
}

function updateQuickChips() {
  quickChips.forEach(function(chip) {
    chip.classList.toggle("is-active", chip.dataset.area === areaFilter.value);
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

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);
  themeToggle.textContent = isLight ? "🌙" : "☀️";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  saveToStorage("theme", theme);
}

function parseBudget(query) {
  const budgetMatch = query.match(/(?:under|below|less than)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  return budgetMatch ? Number(budgetMatch[1]) : null;
}

function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/[^\w₹ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getQueryTerms(query) {
  const normalizedQuery = normalizeQuery(query);
  const directTerms = normalizedQuery.split(" ").filter(function(term) {
    return term.length > 2 && term !== "best" && term !== "for" && term !== "the";
  });

  const phraseTerms = [
    "date night",
    "hidden gems",
    "late night",
    "business dinner",
    "romantic italian",
    "luxury rooftop",
    "anniversary dinner"
  ].filter(function(phrase) {
    return normalizedQuery.includes(phrase);
  });

  return [...new Set(directTerms.concat(phraseTerms))];
}

function scoreRestaurantForQuery(restaurant, query) {
  const profile = getProfile(restaurant);
  const normalizedQuery = normalizeQuery(query);
  const terms = getQueryTerms(query);
  const maxBudget = parseBudget(query);
  const searchableText = [
    restaurant.name,
    restaurant.area,
    restaurant.cuisine,
    restaurant.price,
    restaurant.description,
    restaurant.highlight,
    profile.perfectFor,
    profile.mustOrder,
    profile.tags.join(" ")
  ].join(" ").toLowerCase();

  let score = profile.curatedRating;

  terms.forEach(function(term) {
    if (searchableText.includes(term)) {
      score += term.includes(" ") ? 7 : 3;
    }

    if (restaurant.area.toLowerCase() === term || restaurant.cuisine.toLowerCase().includes(term)) {
      score += 5;
    }
  });

  if (normalizedQuery.includes("anniversary") && profile.tags.includes("anniversary")) {
    score += 8;
  }

  if (normalizedQuery.includes("romantic") && profile.tags.includes("romantic")) {
    score += 7;
  }

  if (normalizedQuery.includes("rooftop") && profile.tags.includes("rooftop")) {
    score += 8;
  }

  if (normalizedQuery.includes("business") && profile.tags.includes("business")) {
    score += 8;
  }

  if (normalizedQuery.includes("brunch") && profile.tags.includes("brunch")) {
    score += 8;
  }

  if (maxBudget) {
    score += profile.spendValue <= maxBudget ? 8 : -8;
  }

  return score;
}

function buildRecommendationReason(restaurant, query) {
  const profile = getProfile(restaurant);
  const normalizedQuery = normalizeQuery(query);
  const reasons = [];

  if (normalizedQuery.includes(restaurant.area.toLowerCase())) {
    reasons.push(restaurant.area);
  }

  if (normalizedQuery.includes(restaurant.cuisine.toLowerCase().split(" ")[0])) {
    reasons.push(restaurant.cuisine);
  }

  ["anniversary", "romantic", "date night", "rooftop", "brunch", "business", "wine", "hidden gems", "family", "late night"].forEach(function(tag) {
    if (normalizedQuery.includes(tag) && profile.tags.includes(tag)) {
      reasons.push(tag);
    }
  });

  if (parseBudget(query) && profile.spendValue <= parseBudget(query)) {
    reasons.push("within your budget");
  }

  if (reasons.length === 0) {
    reasons.push(profile.tags.slice(0, 2).join(" and "));
  }

  return `Recommended because it matches ${reasons.slice(0, 3).join(", ")} with a strong curated rating.`;
}

function getConciergeRecommendations(query) {
  return restaurants
    .map(function(restaurant) {
      return {
        restaurant: restaurant,
        score: scoreRestaurantForQuery(restaurant, query)
      };
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
  const profile = getProfile(restaurant);

  return `
    <article class="recommendation-card" style="animation-delay: ${index * 0.04}s">
      <p class="eyebrow">${restaurant.area} · ${restaurant.cuisine}</p>
      <h3>${restaurant.name}</h3>
      <p class="recommendation-reason">${buildRecommendationReason(restaurant, query)}</p>

      <dl class="recommendation-details">
        <div>
          <dt>Average spend</dt>
          <dd>${profile.averageSpend}</dd>
        </div>
        <div>
          <dt>Perfect for</dt>
          <dd>${profile.perfectFor}</dd>
        </div>
        <div>
          <dt>Must order</dt>
          <dd>${profile.mustOrder}</dd>
        </div>
        <div>
          <dt>Curated rating</dt>
          <dd>${profile.curatedRating}/10</dd>
        </div>
      </dl>

      <a class="action-link reserve-link" href="${restaurant.bookingUrl}" target="_blank" rel="noopener">Reserve</a>
    </article>
  `;
}

function runConcierge(query) {
  const safeQuery = query.trim() || "premium date night";
  conciergeInput.value = safeQuery;

  const recommendations = getConciergeRecommendations(safeQuery);
  conciergeResults.innerHTML = recommendations.map(function(restaurant, index) {
    return createRecommendationCard(restaurant, safeQuery, index);
  }).join("");
}

function renderConciergeChips() {
  conciergeChipsContainer.innerHTML = conciergeChips.map(function(chip) {
    return `<button class="quick-chip concierge-chip" type="button" data-query="${chip.query}">${chip.label}</button>`;
  }).join("");
}

// Start the app by filling filters and showing every restaurant card.
fillFilter(areaFilter, restaurants.map(function(restaurant) {
  return restaurant.area;
}));

fillFilter(cuisineFilter, restaurants.map(function(restaurant) {
  return restaurant.cuisine;
}));

fillFilter(priceFilter, restaurants.map(function(restaurant) {
  return restaurant.price;
}), ["Budget", "Mid Range", "Premium", "Luxury"]);

setTheme(loadFromStorage("theme", "dark"));
renderConciergeChips();
runConcierge("Best anniversary dinner under ₹6000");
displayRestaurants(restaurants);
updateQuickChips();
updateFavoriteCount();

searchInput.addEventListener("input", filterRestaurants);
areaFilter.addEventListener("change", filterRestaurants);
cuisineFilter.addEventListener("change", filterRestaurants);
priceFilter.addEventListener("change", filterRestaurants);
resetButton.addEventListener("click", resetFilters);
conciergeForm.addEventListener("submit", function(event) {
  event.preventDefault();
  runConcierge(conciergeInput.value);
});

themeToggle.addEventListener("click", function() {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  setTheme(nextTheme);
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

restaurantGrid.addEventListener("click", function(event) {
  const saveButton = event.target.closest(".save-button");

  if (saveButton) {
    toggleSavedRestaurant(saveButton.dataset.id);
  }
});

conciergeChipsContainer.addEventListener("click", function(event) {
  const chip = event.target.closest(".concierge-chip");

  if (chip) {
    runConcierge(chip.dataset.query);
  }
});
