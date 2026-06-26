// script.js
// This file controls the interactive parts of the app:
// 1. Fill filters from the restaurant data.
// 2. Show restaurant cards with photos, buttons, and save hearts.
// 3. Filter by search, area, cuisine, price, and saved restaurants.
// 4. Switch dark/light theme.

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
displayRestaurants(restaurants);
updateQuickChips();
updateFavoriteCount();

searchInput.addEventListener("input", filterRestaurants);
areaFilter.addEventListener("change", filterRestaurants);
cuisineFilter.addEventListener("change", filterRestaurants);
priceFilter.addEventListener("change", filterRestaurants);
resetButton.addEventListener("click", resetFilters);

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
