// data-store.js
// Loads the restaurant JSON database once and exposes helper functions.
// Adding a restaurant now only requires editing restaurants.json.

const DataStore = {
  restaurants: [],

  async loadRestaurants() {
    if (this.restaurants.length > 0) {
      return this.restaurants;
    }

    try {
      const response = await fetch("restaurants.json");

      if (!response.ok) {
        throw new Error("Could not load restaurants.json");
      }

      const data = await response.json();
      this.setRestaurants(data.restaurants);
      return this.restaurants;
    } catch (error) {
      if (window.RESTAURANT_DATABASE_FALLBACK) {
        this.setRestaurants(window.RESTAURANT_DATABASE_FALLBACK.restaurants);
        return this.restaurants;
      }

      throw error;
    }
  },

  setRestaurants(restaurants) {
    this.restaurants = restaurants;
    window.restaurants = this.restaurants;
  },

  getRestaurantById(id) {
    return this.restaurants.find(function(restaurant) {
      return restaurant.id === Number(id);
    });
  },

  getUniqueValues(key) {
    return [...new Set(this.restaurants.map(function(restaurant) {
      return restaurant[key];
    }))].sort();
  }
};
