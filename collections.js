// collections.js
// Controls the separate Collections page.
// It uses the same restaurant data and the same premium card structure.

const collectionGrid = document.querySelector("#collectionGrid");
const collectionRestaurantGrid = document.querySelector("#collectionRestaurantGrid");
const collectionTitle = document.querySelector("#collectionTitle");
const collectionSubtext = document.querySelector("#collectionSubtext");
const themeToggle = document.querySelector("#themeToggle");

let activeCollectionId = collections[0].id;

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
    // The page still works if storage is blocked.
  }
}

function setTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("light-theme", isLight);
  themeToggle.textContent = isLight ? "🌙" : "☀️";
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  saveToStorage("theme", theme);
}

function getProfile(restaurant) {
  return restaurantProfiles[restaurant.id];
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
  const featuredLabel = restaurant.rating >= 4.7 ? '<span class="featured-pill">Top rated</span>' : "";

  return `
    <article class="restaurant-card" style="animation-delay: ${index * 0.04}s">
      <div class="card-top">
        <img class="restaurant-photo" src="${restaurant.photo}" alt="${restaurant.name} restaurant photo" loading="lazy">
        <div class="photo-overlay"></div>
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

        <div class="card-actions">
          <a class="action-link" href="${restaurant.bookingUrl}" target="_blank" rel="noopener">Book</a>
          <a class="action-link secondary" href="${restaurant.orderUrl}" target="_blank" rel="noopener">Order</a>
          <a class="action-link secondary" href="${restaurant.mapUrl}" target="_blank" rel="noopener">Map</a>
        </div>
      </div>
    </article>
  `;
}

function getCollectionRestaurants(collectionId) {
  return restaurants.filter(function(restaurant) {
    return getProfile(restaurant).collections.includes(collectionId);
  });
}

function renderCollectionCards() {
  collectionGrid.innerHTML = collections.map(function(collection) {
    const activeClass = collection.id === activeCollectionId ? " is-active" : "";

    return `
      <button class="collection-card${activeClass}" type="button" data-collection="${collection.id}">
        <p class="eyebrow">${getCollectionRestaurants(collection.id).length} picks</p>
        <h3>${collection.title}</h3>
        <p>${collection.description}</p>
      </button>
    `;
  }).join("");
}

function showCollection(collectionId) {
  const collection = collections.find(function(item) {
    return item.id === collectionId;
  }) || collections[0];

  activeCollectionId = collection.id;
  const filteredRestaurants = getCollectionRestaurants(collection.id);

  collectionTitle.textContent = collection.title;
  collectionSubtext.textContent = `${filteredRestaurants.length} restaurant${filteredRestaurants.length === 1 ? "" : "s"} selected for this collection.`;
  collectionRestaurantGrid.innerHTML = filteredRestaurants.map(createRestaurantCard).join("");
  renderCollectionCards();
}

function getInitialCollectionId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("collection") || collections[0].id;
}

setTheme(loadFromStorage("theme", "dark"));
showCollection(getInitialCollectionId());

themeToggle.addEventListener("click", function() {
  const nextTheme = document.body.classList.contains("light-theme") ? "dark" : "light";
  setTheme(nextTheme);
});

collectionGrid.addEventListener("click", function(event) {
  const collectionCard = event.target.closest(".collection-card");

  if (collectionCard) {
    showCollection(collectionCard.dataset.collection);
  }
});
