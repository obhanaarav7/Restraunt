// script.js
// This file controls the interactive parts of the app:
// 1. Fill the filter dropdowns.
// 2. Show restaurant cards.
// 3. Filter cards when the user changes a dropdown.

const restaurantGrid = document.querySelector("#restaurantGrid");
const resultsCount = document.querySelector("#resultsCount");
const emptyState = document.querySelector("#emptyState");

const areaFilter = document.querySelector("#areaFilter");
const cuisineFilter = document.querySelector("#cuisineFilter");
const priceFilter = document.querySelector("#priceFilter");
const resetButton = document.querySelector("#resetButton");

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

function createRestaurantCard(restaurant) {
  return `
    <article class="restaurant-card">
      <div class="card-top">
        <span class="rating-pill">${restaurant.rating} ★</span>
        <span class="food-emoji" aria-hidden="true">${restaurant.emoji}</span>
      </div>

      <div class="card-body">
        <h3>${restaurant.name}</h3>
        <p class="description">${restaurant.description}</p>

        <div class="tag-row">
          <span class="tag">${restaurant.area}</span>
          <span class="tag">${restaurant.cuisine}</span>
          <span class="tag">${restaurant.price}</span>
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
    return;
  }

  emptyState.hidden = true;

  if (restaurantsToShow.length === restaurants.length) {
    resultsCount.textContent = "Showing all restaurants";
  } else {
    resultsCount.textContent = `Showing ${restaurantsToShow.length} restaurant${restaurantsToShow.length === 1 ? "" : "s"}`;
  }
}

function filterRestaurants() {
  const selectedArea = areaFilter.value;
  const selectedCuisine = cuisineFilter.value;
  const selectedPrice = priceFilter.value;

  const filteredRestaurants = restaurants.filter(function(restaurant) {
    const areaMatches = selectedArea === "all" || restaurant.area === selectedArea;
    const cuisineMatches = selectedCuisine === "all" || restaurant.cuisine === selectedCuisine;
    const priceMatches = selectedPrice === "all" || restaurant.price === selectedPrice;

    return areaMatches && cuisineMatches && priceMatches;
  });

  displayRestaurants(filteredRestaurants);
}

function resetFilters() {
  areaFilter.value = "all";
  cuisineFilter.value = "all";
  priceFilter.value = "all";
  displayRestaurants(restaurants);
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

areaFilter.addEventListener("change", filterRestaurants);
cuisineFilter.addEventListener("change", filterRestaurants);
priceFilter.addEventListener("change", filterRestaurants);
resetButton.addEventListener("click", resetFilters);
