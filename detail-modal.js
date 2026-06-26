// detail-modal.js
// Shared restaurant detail modal. All restaurant detail content comes from restaurants.json.

let activeDetailRestaurant = null;
let activeGalleryIndex = 0;
let detailLoadTimer = null;

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
    // The modal still works if storage is blocked.
  }
}

function rememberViewedRestaurant(id) {
  const restaurantId = String(id);
  const recentIds = loadFromStorage("recentlyViewedRestaurants", []);
  const updatedIds = [restaurantId].concat(recentIds.filter(function(savedId) {
    return savedId !== restaurantId;
  })).slice(0, 8);

  saveToStorage("recentlyViewedRestaurants", updatedIds);
  document.dispatchEvent(new CustomEvent("restaurantViewed"));
}

function getNearbyRestaurants(restaurant) {
  return restaurants.filter(function(candidate) {
    return candidate.id !== restaurant.id;
  }).sort(function(first, second) {
    const firstScore = Number(first.area === restaurant.area) + Number(first.cuisine === restaurant.cuisine) + Number(first.price === restaurant.price);
    const secondScore = Number(second.area === restaurant.area) + Number(second.cuisine === restaurant.cuisine) + Number(second.price === restaurant.price);
    return secondScore - firstScore;
  }).slice(0, 3);
}

function createSkeleton() {
  return `
    <div class="detail-skeleton">
      <div class="skeleton-block skeleton-hero"></div>
      <div class="detail-shell">
        <div>
          <div class="skeleton-line wide"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div class="skeleton-grid">
          <div class="skeleton-block"></div>
          <div class="skeleton-block"></div>
          <div class="skeleton-block"></div>
          <div class="skeleton-block"></div>
        </div>
      </div>
    </div>
  `;
}

function createScoreCards(restaurant) {
  return [
    ["Food", restaurant.detail.scores.food],
    ["Ambience", restaurant.detail.scores.ambience],
    ["Service", restaurant.detail.scores.service],
    ["Luxury Feel", restaurant.detail.scores.luxuryFeel],
    ["Date Night", restaurant.detail.scores.dateNight],
    ["Instagram Worthiness", restaurant.detail.scores.instagramWorthiness]
  ].map(function(score) {
    return `
      <article class="score-card">
        <span>${score[0]}</span>
        <strong>${score[1]}</strong>
      </article>
    `;
  }).join("");
}

function createDetailFacts(restaurant) {
  return [
    ["Must Order", restaurant.mustOrder],
    ["Perfect For", restaurant.perfectFor],
    ["Best Table Tip", restaurant.detail.bestTableTip],
    ["Dress Code", restaurant.dressCode],
    ["Average Spend", restaurant.averageSpend],
    ["Parking / Valet", restaurant.detail.parkingValet],
    ["Opening Hours", restaurant.detail.openingHours]
  ].map(function(fact) {
    return `
      <div>
        <dt>${fact[0]}</dt>
        <dd>${fact[1]}</dd>
      </div>
    `;
  }).join("");
}

function createGalleryThumbnails(gallery) {
  return gallery.map(function(image, index) {
    const activeClass = index === activeGalleryIndex ? " is-active" : "";
    return `
      <button class="gallery-thumb${activeClass}" type="button" data-gallery-index="${index}" aria-label="Show gallery image ${index + 1}">
        <img src="${image}" alt="">
      </button>
    `;
  }).join("");
}

function createNearbyRestaurants(restaurant) {
  return getNearbyRestaurants(restaurant).map(function(nearby) {
    return `
      <button class="nearby-card" type="button" data-nearby-id="${nearby.id}">
        <span class="eyebrow">${nearby.area} · ${nearby.cuisine}</span>
        <strong>${nearby.name}</strong>
      </button>
    `;
  }).join("");
}

function createDetailContent(restaurant) {
  const gallery = restaurant.detail.gallery;
  const activeImage = gallery[activeGalleryIndex];

  return `
    <div class="detail-hero">
      <img class="detail-hero-image" src="${activeImage}" alt="${restaurant.name} editorial image">
      <div class="detail-hero-overlay"></div>
      <button class="detail-close" type="button" aria-label="Close restaurant details">×</button>
      <button class="gallery-control previous" type="button" data-gallery-direction="-1" aria-label="Previous gallery image">‹</button>
      <button class="gallery-control next" type="button" data-gallery-direction="1" aria-label="Next gallery image">›</button>
      <div class="detail-hero-copy">
        <p class="eyebrow">${restaurant.area} · ${restaurant.cuisine}</p>
        <h2>${restaurant.name}</h2>
        <p>${restaurant.highlight}</p>
        <div class="hero-card-meta">
          <span>${restaurant.rating} ★</span>
          <span>${restaurant.price}</span>
          <span>${restaurant.curatedRating}/10 curated</span>
        </div>
      </div>
    </div>

    <div class="gallery-strip">
      ${createGalleryThumbnails(gallery)}
    </div>

    <div class="detail-shell">
      <section class="detail-editorial">
        <p class="eyebrow">Editorial note</p>
        <h3>Why it feels special</h3>
        <p>${restaurant.detail.editorialDescription}</p>

        <div class="detail-actions">
          <a class="action-link" href="${restaurant.bookingUrl}" target="_blank" rel="noopener">Reservation</a>
          <a class="action-link secondary" href="${restaurant.mapUrl}" target="_blank" rel="noopener">Directions</a>
          <a class="action-link secondary" href="tel:${restaurant.detail.phone.replace(/\s/g, "")}">Call</a>
          <a class="action-link secondary" href="${restaurant.detail.websiteUrl}" target="_blank" rel="noopener">Website</a>
        </div>
      </section>

      <section>
        <p class="eyebrow">Curated scores</p>
        <div class="scores-grid">${createScoreCards(restaurant)}</div>
      </section>

      <section>
        <p class="eyebrow">Planning notes</p>
        <dl class="detail-facts">${createDetailFacts(restaurant)}</dl>
      </section>

      <section>
        <p class="eyebrow">Nearby restaurants</p>
        <div class="nearby-grid">${createNearbyRestaurants(restaurant)}</div>
      </section>
    </div>
  `;
}

function ensureDetailModal() {
  if (document.querySelector("#restaurantDetailModal")) return;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="restaurantDetailModal" class="detail-modal" hidden>
      <div class="detail-backdrop" data-detail-close></div>
      <article class="detail-panel" role="dialog" aria-modal="true" aria-label="Restaurant details">
        <div id="detailModalContent"></div>
      </article>
    </div>
  `);
}

function renderDetailContent() {
  document.querySelector("#detailModalContent").innerHTML = createDetailContent(activeDetailRestaurant);
}

function openRestaurantDetail(restaurantId) {
  ensureDetailModal();
  activeDetailRestaurant = DataStore.getRestaurantById(restaurantId);
  activeGalleryIndex = 0;

  if (!activeDetailRestaurant) return;

  const modal = document.querySelector("#restaurantDetailModal");
  const content = document.querySelector("#detailModalContent");
  modal.hidden = false;
  document.body.classList.add("detail-open");
  content.innerHTML = createSkeleton();
  rememberViewedRestaurant(activeDetailRestaurant.id);

  clearTimeout(detailLoadTimer);
  detailLoadTimer = setTimeout(renderDetailContent, 180);
}

function closeRestaurantDetail() {
  const modal = document.querySelector("#restaurantDetailModal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("detail-open");
}

function moveGallery(direction) {
  const gallery = activeDetailRestaurant.detail.gallery;
  activeGalleryIndex = (activeGalleryIndex + direction + gallery.length) % gallery.length;
  renderDetailContent();
}

function showGalleryImage(index) {
  activeGalleryIndex = index;
  renderDetailContent();
}

ensureDetailModal();

document.addEventListener("click", function(event) {
  const closeTarget = event.target.closest("[data-detail-close], .detail-close");
  const galleryButton = event.target.closest("[data-gallery-direction]");
  const galleryThumb = event.target.closest("[data-gallery-index]");
  const nearbyCard = event.target.closest("[data-nearby-id]");
  const interactiveTarget = event.target.closest("a, .save-button, .compare-button, .collection-card, .quick-chip, .gallery-control, .gallery-thumb, .nearby-card, .detail-close");
  const restaurantCard = event.target.closest("[data-restaurant-id]");

  if (closeTarget) return closeRestaurantDetail();
  if (galleryButton) return moveGallery(Number(galleryButton.dataset.galleryDirection));
  if (galleryThumb) return showGalleryImage(Number(galleryThumb.dataset.galleryIndex));
  if (nearbyCard) return openRestaurantDetail(nearbyCard.dataset.nearbyId);
  if (restaurantCard && !interactiveTarget) openRestaurantDetail(restaurantCard.dataset.restaurantId);
});

document.addEventListener("keydown", function(event) {
  const modal = document.querySelector("#restaurantDetailModal");
  if (event.key === "Escape") closeRestaurantDetail();
  if (!activeDetailRestaurant || !modal || modal.hidden) return;
  if (event.key === "ArrowLeft") moveGallery(-1);
  if (event.key === "ArrowRight") moveGallery(1);
});
