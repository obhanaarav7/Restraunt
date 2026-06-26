// detail-modal.js
// Shared premium restaurant detail modal for both index.html and collections.html.
// It uses the existing restaurant and assistant data; no APIs or backend are needed.

const detailGalleryImages = {
  seafood: [
    "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80"
  ],
  japanese: [
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1200&q=80"
  ],
  italian: [
    "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80"
  ],
  cafe: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=80"
  ],
  indian: [
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=80"
  ],
  luxury: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
  ]
};

let activeDetailRestaurant = null;
let activeGalleryIndex = 0;
let detailLoadTimer = null;

function getDetailProfile(restaurant) {
  return restaurantProfiles[restaurant.id];
}

function getGalleryKey(restaurant) {
  const cuisine = restaurant.cuisine.toLowerCase();

  if (cuisine.includes("seafood") || cuisine.includes("goan")) {
    return "seafood";
  }

  if (cuisine.includes("japanese")) {
    return "japanese";
  }

  if (cuisine.includes("italian")) {
    return "italian";
  }

  if (cuisine.includes("cafe") || cuisine.includes("irani")) {
    return "cafe";
  }

  if (restaurant.price === "Luxury" || cuisine.includes("tasting")) {
    return "luxury";
  }

  return "indian";
}

function getRestaurantGallery(restaurant) {
  const gallery = detailGalleryImages[getGalleryKey(restaurant)];
  return [restaurant.photo].concat(gallery.filter(function(image) {
    return image !== restaurant.photo;
  })).slice(0, 4);
}

function clampScore(score) {
  return Math.max(7.8, Math.min(9.9, score)).toFixed(1);
}

function getCuratedScores(restaurant) {
  const profile = getDetailProfile(restaurant);
  const base = profile.curatedRating;
  const tags = profile.tags;

  return [
    { label: "Food", value: clampScore(base + 0.2) },
    { label: "Ambience", value: clampScore(base + (tags.includes("luxury") ? 0.3 : 0)) },
    { label: "Service", value: clampScore(base - 0.1 + (restaurant.price === "Luxury" ? 0.2 : 0)) },
    { label: "Luxury Feel", value: clampScore(base - 0.2 + (tags.includes("luxury") ? 0.5 : 0)) },
    { label: "Date Night", value: clampScore(base - 0.1 + (tags.includes("date night") ? 0.4 : 0)) },
    { label: "Instagram Worthiness", value: clampScore(base - 0.2 + (tags.includes("celebrity") || tags.includes("rooftop") ? 0.4 : 0)) }
  ];
}

function getBestTableTip(restaurant) {
  const profile = getDetailProfile(restaurant);

  if (profile.tags.includes("rooftop")) {
    return "Ask for a terrace-edge table around golden hour.";
  }

  if (profile.tags.includes("romantic") || profile.tags.includes("date night")) {
    return "Request a corner table away from the main service path.";
  }

  if (profile.tags.includes("business")) {
    return "Book a quieter table along the wall for easier conversation.";
  }

  if (profile.tags.includes("family")) {
    return "Choose an early dinner slot for the smoothest service.";
  }

  return "Ask for the room's signature table when reserving.";
}

function getDressCode(restaurant) {
  if (restaurant.price === "Luxury") {
    return "Smart elegant";
  }

  if (restaurant.price === "Premium") {
    return "Smart casual";
  }

  return "Relaxed casual";
}

function getParkingInfo(restaurant) {
  const valetAreas = ["Bandra", "BKC", "Lower Parel", "Mahalaxmi", "Juhu", "Powai"];
  return valetAreas.includes(restaurant.area) ? "Valet usually available" : "Street parking nearby; arrive early";
}

function getOpeningHours(restaurant) {
  const profile = getDetailProfile(restaurant);

  if (profile.tags.includes("breakfast") || profile.tags.includes("cafe")) {
    return "8:00 AM - 11:30 PM";
  }

  if (profile.tags.includes("late night")) {
    return "12:00 PM - 1:00 AM";
  }

  return "12:00 PM - 11:30 PM";
}

function getRestaurantPhone(restaurant) {
  return `+91 22 40${String(restaurant.id).padStart(2, "0")} ${String(7000 + restaurant.id * 37).padStart(4, "0")}`;
}

function getWebsiteUrl(restaurant) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${restaurant.name} ${restaurant.area} official website`)}`;
}

function getEditorialDescription(restaurant) {
  const profile = getDetailProfile(restaurant);
  return `${restaurant.name} is the kind of Mumbai table that earns its place through mood as much as food. ${restaurant.description} The room works especially well for ${profile.perfectFor.toLowerCase()}, with a signature order of ${profile.mustOrder.toLowerCase()}.`;
}

function getNearbyRestaurants(restaurant) {
  const sameArea = restaurants.filter(function(candidate) {
    return candidate.id !== restaurant.id && candidate.area === restaurant.area;
  });

  const sameCuisine = restaurants.filter(function(candidate) {
    return candidate.id !== restaurant.id && candidate.cuisine === restaurant.cuisine;
  });

  const samePrice = restaurants.filter(function(candidate) {
    return candidate.id !== restaurant.id && candidate.price === restaurant.price;
  });

  return sameArea.concat(sameCuisine, samePrice, restaurants).filter(function(candidate, index, list) {
    return list.findIndex(function(item) {
      return item.id === candidate.id;
    }) === index;
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
  return getCuratedScores(restaurant).map(function(score) {
    return `
      <article class="score-card">
        <span>${score.label}</span>
        <strong>${score.value}</strong>
      </article>
    `;
  }).join("");
}

function createDetailFacts(restaurant) {
  const profile = getDetailProfile(restaurant);
  const facts = [
    ["Must Order", profile.mustOrder],
    ["Perfect For", profile.perfectFor],
    ["Best Table Tip", getBestTableTip(restaurant)],
    ["Dress Code", getDressCode(restaurant)],
    ["Average Spend", profile.averageSpend],
    ["Parking / Valet", getParkingInfo(restaurant)],
    ["Opening Hours", getOpeningHours(restaurant)]
  ];

  return facts.map(function(fact) {
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
  const profile = getDetailProfile(restaurant);
  const gallery = getRestaurantGallery(restaurant);
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
          <span>${profile.curatedRating}/10 curated</span>
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
        <p>${getEditorialDescription(restaurant)}</p>

        <div class="detail-actions">
          <a class="action-link" href="${restaurant.bookingUrl}" target="_blank" rel="noopener">Reservation</a>
          <a class="action-link secondary" href="${restaurant.mapUrl}" target="_blank" rel="noopener">Directions</a>
          <a class="action-link secondary" href="tel:${getRestaurantPhone(restaurant).replace(/\s/g, "")}">Call</a>
          <a class="action-link secondary" href="${getWebsiteUrl(restaurant)}" target="_blank" rel="noopener">Website</a>
        </div>
      </section>

      <section>
        <p class="eyebrow">Curated scores</p>
        <div class="scores-grid">
          ${createScoreCards(restaurant)}
        </div>
      </section>

      <section>
        <p class="eyebrow">Planning notes</p>
        <dl class="detail-facts">
          ${createDetailFacts(restaurant)}
        </dl>
      </section>

      <section>
        <p class="eyebrow">Nearby restaurants</p>
        <div class="nearby-grid">
          ${createNearbyRestaurants(restaurant)}
        </div>
      </section>
    </div>
  `;
}

function ensureDetailModal() {
  if (document.querySelector("#restaurantDetailModal")) {
    return;
  }

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
  const content = document.querySelector("#detailModalContent");
  content.innerHTML = createDetailContent(activeDetailRestaurant);
}

function openRestaurantDetail(restaurantId) {
  ensureDetailModal();
  activeDetailRestaurant = restaurants.find(function(restaurant) {
    return restaurant.id === Number(restaurantId);
  });
  activeGalleryIndex = 0;

  if (!activeDetailRestaurant) {
    return;
  }

  const modal = document.querySelector("#restaurantDetailModal");
  const content = document.querySelector("#detailModalContent");
  modal.hidden = false;
  document.body.classList.add("detail-open");
  content.innerHTML = createSkeleton();

  clearTimeout(detailLoadTimer);
  detailLoadTimer = setTimeout(renderDetailContent, 180);
}

function closeRestaurantDetail() {
  const modal = document.querySelector("#restaurantDetailModal");

  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove("detail-open");
}

function moveGallery(direction) {
  const gallery = getRestaurantGallery(activeDetailRestaurant);
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
  const interactiveTarget = event.target.closest("a, .save-button, .collection-card, .quick-chip, .gallery-control, .gallery-thumb, .nearby-card, .detail-close");
  const restaurantCard = event.target.closest("[data-restaurant-id]");

  if (closeTarget) {
    closeRestaurantDetail();
    return;
  }

  if (galleryButton) {
    moveGallery(Number(galleryButton.dataset.galleryDirection));
    return;
  }

  if (galleryThumb) {
    showGalleryImage(Number(galleryThumb.dataset.galleryIndex));
    return;
  }

  if (nearbyCard) {
    openRestaurantDetail(nearbyCard.dataset.nearbyId);
    return;
  }

  if (restaurantCard && !interactiveTarget) {
    openRestaurantDetail(restaurantCard.dataset.restaurantId);
  }
});

document.addEventListener("keydown", function(event) {
  if (event.key === "Escape") {
    closeRestaurantDetail();
  }

  if (!activeDetailRestaurant || document.querySelector("#restaurantDetailModal").hidden) {
    return;
  }

  if (event.key === "ArrowLeft") {
    moveGallery(-1);
  }

  if (event.key === "ArrowRight") {
    moveGallery(1);
  }
});
