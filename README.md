# Mumbai Table - Restaurant Web App

A beginner-friendly static web app for discovering Mumbai restaurants. It uses only
HTML, CSS, and vanilla JavaScript.

## Features

- Restaurant cards with area, cuisine, price, rating, address, and a short highlight.
- Area, cuisine, and price filters that work together.
- Reset button to quickly show every restaurant again.
- Clean premium UI with gradients, cards, rounded corners, shadows, and responsive layouts.
- No build tools or frameworks needed.

## How to run

Open `index.html` directly in a browser.

## File explanation

### `index.html`

This is the main page. It creates the app structure:

- A large hero section with the app title and description.
- A filter panel with three dropdowns: area, cuisine, and price.
- A reset button.
- A results heading that tells the user how many restaurants are showing.
- An empty state message for filter combinations with no matches.
- Script tags that load `restaurants-data.js` first, then `script.js`.

### `styles.css`

This file controls the premium visual design:

- CSS variables in `:root` store reusable colors, shadows, and border radius values.
- The hero uses layered gradients for a polished restaurant-guide feel.
- CSS Grid lays out the filter panel and restaurant cards.
- Cards use hover effects, shadows, rounded corners, and badges.
- Media queries make the layout adapt for tablets and phones.

### `restaurants-data.js`

This file stores the restaurant data in one array named `restaurants`.

Each restaurant object includes:

- `name`
- `area`
- `cuisine`
- `price`
- `rating`
- `emoji`
- `address`
- `description`
- `highlight`

Keeping the data separate makes it easy to add or edit restaurants without touching
the filtering logic.

### `script.js`

This file adds the interactivity:

- Finds important HTML elements with `document.querySelector`.
- Fills each dropdown using unique values from `restaurants-data.js`.
- Builds restaurant card HTML with `createRestaurantCard`.
- Shows cards with `displayRestaurants`.
- Filters restaurants with `filterRestaurants`.
- Clears filters with `resetFilters`.
- Adds event listeners so the page reacts when dropdowns change.

## How to add a restaurant

Add a new object to the `restaurants` array in `restaurants-data.js`:

```javascript
{
  id: 13,
  name: "New Mumbai Spot",
  area: "Bandra",
  cuisine: "Italian",
  price: "Mid Range",
  rating: 4.4,
  emoji: "🍕",
  address: "Example Road, Mumbai",
  description: "Short description of the restaurant.",
  highlight: "Best for: pizza nights"
}
```

The filters update automatically because `script.js` reads values from the data.
