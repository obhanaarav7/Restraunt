// data-store.js
// Loads the restaurant JSON database once and exposes helper functions.
// Adding a restaurant now only requires editing restaurants.json.

const DataStore = {
  restaurants: [],

  async loadRestaurants() {
    if (this.restaurants.length > 0) {
      return this.restaurants;
    }

    const response = await fetch("restaurants.json");

    if (!response.ok) {
      throw new Error("Could not load restaurants.json");
    }

    const data = await response.json();
    this.restaurants = data.restaurants;
    window.restaurants = this.restaurants;
    return this.restaurants;
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
