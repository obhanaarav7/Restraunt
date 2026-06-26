// script.js
// This file controls the interactive parts of the app:
// 1. Fill the filter dropdowns.
// 2. Show restaurant cards.
// 3. Filter cards when the user changes a dropdown.

const restaurantGrid = document.querySelector("#restaurantGrid");
const resultsCount = document.querySelector("#resultsCount");
const resultsSubtext = document.querySelector("#resultsSubtext");
const emptyState = document.querySelector("#emptyState");

const searchInput = document.querySelector("#searchInput");
const areaFilter = document.querySelector("#areaFilter");
const cuisineFilter = document.querySelector("#cuisineFilter");
const priceFilter = document.querySelector("#priceFilter");
const resetButton = document.querySelector("#resetButton");
const quickChips = document.querySelectorAll(".quick-chip");

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

  return priceLevels[price];
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

function createRestaurantCard(restaurant) {
  const featuredLabel = restaurant.rating >= 4.7 ? '<span class="featured-pill">Top rated</span>' : "";

  return `
    <article class="restaurant-card">
      <div class="card-top">
        <span class="card-number">${formatCardNumber(restaurant.id)}</span>
        <span class="rating-pill">${restaurant.rating} ★</span>
        ${featuredLabel}
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
      </div>
    </article>
  `;
}

function displayRestaurants(restaurantsToShow) {
  restaurantGrid.innerHTML = restaurantsToShow.map(createRestaurantCard).join("");

  if (restaurantsToShow.length === 0) {
    emptyState.hidden = false;
    resultsCount.textContent = "No restaurants match your filters";
    resultsSubtext.textContent = "Try a broader search term or remove one filter.";
    return;
  }

  emptyState.hidden = true;

  if (restaurantsToShow.length === restaurants.length) {
    resultsCount.textContent = "Showing all restaurants";
    resultsSubtext.textContent = "Tip: search and combine filters to narrow your choices.";
  } else {
    resultsCount.textContent = `Showing ${restaurantsToShow.length} restaurant${restaurantsToShow.length === 1 ? "" : "s"}`;
    resultsSubtext.textContent = "Filters are active. Reset to return to the full Mumbai list.";
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

    return searchMatches && areaMatches && cuisineMatches && priceMatches;
  });

  updateQuickChips();
  displayRestaurants(filteredRestaurants);
}

function resetFilters() {
  searchInput.value = "";
  areaFilter.value = "all";
  cuisineFilter.value = "all";
  priceFilter.value = "all";
  updateQuickChips();
  displayRestaurants(restaurants);
}

function updateQuickChips() {
  quickChips.forEach(function(chip) {
    chip.classList.toggle("is-active", chip.dataset.area === areaFilter.value);
  });
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

displayRestaurants(restaurants);
updateQuickChips();

searchInput.addEventListener("input", filterRestaurants);
areaFilter.addEventListener("change", filterRestaurants);
cuisineFilter.addEventListener("change", filterRestaurants);
priceFilter.addEventListener("change", filterRestaurants);
resetButton.addEventListener("click", resetFilters);

quickChips.forEach(function(chip) {
  chip.addEventListener("click", function() {
    areaFilter.value = chip.dataset.area;
    filterRestaurants();
  });
});
